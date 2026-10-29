import { dateKey, isValidDate, monthKey } from '../../shared/lib/dates.js'
import { sourceSummary } from '../money-sources/moneySources.js'
import { isValidCategoryBudgetAmount } from './categoryBudgets.js'
export { getCategoryBudgets } from './categoryBudgets.js'

export const isValidBudgetAmount = (value) =>
  Number.isSafeInteger(value) && value > 0 && value <= 1e12

export function isValidMonthlyBudgets(value) {
  return (
    value === undefined ||
    Boolean(
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.entries(value).every(
        ([month, amount]) =>
          /^\d{4}-\d{2}$/.test(month) && isValidDate(`${month}-01`) && isValidBudgetAmount(amount),
      ),
    )
  )
}

export function getMonthlyBudget(data, month = monthKey()) {
  return data.monthlyBudgets?.[month] ?? data.profile.budget
}

export function isValidMonthlyCategoryBudgets(value, categoryIds) {
  return (
    value === undefined ||
    Boolean(
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.entries(value).every(
        ([month, budgets]) =>
          /^\d{4}-\d{2}$/.test(month) &&
          isValidDate(`${month}-01`) &&
          budgets &&
          typeof budgets === 'object' &&
          !Array.isArray(budgets) &&
          Object.entries(budgets).every(
            ([id, amount]) => categoryIds.includes(id) && isValidCategoryBudgetAmount(amount),
          ),
      ),
    )
  )
}

export function budgetFunds(data, asOf = dateKey()) {
  const sources = data.moneySources || []
  const balance = sources.reduce(
    (sum, source) =>
      sum + sourceSummary(source, data.transactions, data.sourceTransfers || [], asOf).balance,
    0,
  )
  return { balance, available: Math.max(0, balance), sourceCount: sources.length }
}

export function monthlyBudgetFundingError(data, amount, asOf = dateKey()) {
  const { available, sourceCount } = budgetFunds(data, asOf)
  if (!sourceCount) return 'Bạn chưa có nguồn tiền. Thêm nguồn và số dư trước khi đặt ngân sách.'
  if (amount <= available) return ''
  const format = (value) => `${value.toLocaleString('vi-VN')} ₫`
  return `Ngân sách vượt số tiền hiện có ${format(amount - available)}. Mức tối đa hiện tại là ${format(available)}.`
}
