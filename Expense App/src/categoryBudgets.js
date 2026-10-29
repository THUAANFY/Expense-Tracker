import { isValidDate, monthKey } from './dates.js'

export const CATEGORY_BUDGET_WEIGHTS = Object.freeze({
  food: 25,
  shopping: 10,
  transport: 10,
  home: 30,
  fun: 8,
  health: 7,
  study: 5,
  other: 5,
})

// Compatibility only: old, closed months retain the amounts that were recorded before auto-allocation.
export const LEGACY_CATEGORY_BUDGETS = Object.freeze({
  food: 3000000,
  shopping: 2500000,
  transport: 1200000,
  home: 4500000,
  fun: 1000000,
  health: 800000,
  study: 1000000,
  other: 1000000,
})

export const isValidCategoryBudgetAmount = (value) =>
  Number.isSafeInteger(value) && value >= 0 && value <= 1e12

export function createCategoryBudgetPolicy(fromMonth = monthKey()) {
  return { version: 1, fromMonth, weights: { ...CATEGORY_BUDGET_WEIGHTS } }
}

export function isValidCategoryWeights(value, ids = Object.keys(CATEGORY_BUDGET_WEIGHTS)) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === ids.length &&
    ids.every((id) => Number.isSafeInteger(value[id]) && value[id] >= 0 && value[id] <= 100) &&
    ids.reduce((sum, id) => sum + value[id], 0) === 100,
  )
}

export function isValidMonthlyCategoryWeights(value) {
  return (
    value === undefined ||
    Boolean(
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.entries(value).every(
        ([month, weights]) =>
          /^\d{4}-\d{2}$/.test(month) &&
          isValidDate(`${month}-01`) &&
          isValidCategoryWeights(weights),
      ),
    )
  )
}

export function getCategoryBudgetWeights(data, month = monthKey()) {
  const policy = data.categoryBudgetPolicy || createCategoryBudgetPolicy()
  const effectiveMonth = Object.keys(data.monthlyCategoryWeights || {})
    .filter((key) => key >= policy.fromMonth && key <= month)
    .sort()
    .at(-1)
  return effectiveMonth ? data.monthlyCategoryWeights[effectiveMonth] : policy.weights
}

export function isValidCategoryBudgetPolicy(value, ids = Object.keys(CATEGORY_BUDGET_WEIGHTS)) {
  if (value === undefined) return true
  return Boolean(
    value &&
    value.version === 1 &&
    typeof value.fromMonth === 'string' &&
    /^\d{4}-\d{2}$/.test(value.fromMonth) &&
    isValidDate(`${value.fromMonth}-01`) &&
    value.weights &&
    typeof value.weights === 'object' &&
    !Array.isArray(value.weights) &&
    Object.keys(value.weights).length === ids.length &&
    ids.every(
      (id) =>
        Number.isSafeInteger(value.weights[id]) &&
        value.weights[id] > 0 &&
        value.weights[id] <= 100,
    ) &&
    ids.reduce((sum, id) => sum + value.weights[id], 0) === 100,
  )
}

// Largest remainders allocate whole VND without exceeding or losing any of the monthly amount.
export function allocateCategoryBudget(total, weights) {
  // Backup key order must not change which category receives a remaining đồng.
  const order = Object.keys(CATEGORY_BUDGET_WEIGHTS)
  const entries = Object.entries(weights).sort(
    ([left], [right]) => order.indexOf(left) - order.indexOf(right),
  )
  if (!entries.length) return {}
  const weightSum = entries.reduce((sum, [, weight]) => sum + weight, 0)
  if (weightSum === 0) return Object.fromEntries(entries.map(([id]) => [id, 0]))
  const rows = entries.map(([id, weight], index) => ({
    id,
    index,
    amount: Math.floor((total * weight) / weightSum),
    remainder: (total * weight) % weightSum,
  }))
  const extra = total - rows.reduce((sum, row) => sum + row.amount, 0)
  const ranked = [...rows].sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  for (let index = 0; index < extra; index++) ranked[index].amount++
  return Object.fromEntries(rows.map(({ id, amount }) => [id, amount]))
}

export function getCategoryBudgetPlan(
  data,
  month = monthKey(),
  overrides = data.monthlyCategoryBudgets?.[month] || {},
) {
  const policy = data.categoryBudgetPolicy || createCategoryBudgetPolicy()
  const total = data.monthlyBudgets?.[month] ?? data.profile.budget
  const weights = getCategoryBudgetWeights(data, month)
  const ids = Object.keys(weights)
  const customIds = ids.filter((id) => Object.hasOwn(overrides, id))
  const mode = month >= policy.fromMonth ? 'auto' : 'legacy'
  let budgets
  if (mode === 'legacy') {
    budgets = { ...data.budgets, ...overrides }
  } else {
    const fixed = customIds.reduce((sum, id) => sum + overrides[id], 0)
    const automaticWeights = Object.fromEntries(
      ids.filter((id) => !customIds.includes(id)).map((id) => [id, weights[id]]),
    )
    budgets = {
      ...allocateCategoryBudget(Math.max(0, total - fixed), automaticWeights),
      ...overrides,
    }
  }
  const allocated = ids.reduce((sum, id) => sum + budgets[id], 0)
  return {
    mode,
    budgets,
    weights,
    customIds,
    total,
    allocated,
    excess: Math.max(0, allocated - total),
    unallocated: Math.max(0, total - allocated),
  }
}

export function getCategoryBudgets(data, month = monthKey()) {
  return getCategoryBudgetPlan(data, month).budgets
}

export function getAutomaticCategoryBudget(data, month, id) {
  const overrides = { ...data.monthlyCategoryBudgets?.[month] }
  delete overrides[id]
  return getCategoryBudgetPlan(data, month, overrides).budgets[id]
}
