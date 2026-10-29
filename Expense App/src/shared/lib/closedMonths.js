import { monthKey } from './dates.js'

export const isClosedMonth = (value, currentMonth = monthKey()) =>
  typeof value === 'string' && value.slice(0, 7) < currentMonth

export const CLOSED_MONTH_MESSAGE =
  'Các tháng đã qua chỉ được xem. Không thể thêm, sửa hoặc xóa dữ liệu của tháng đã qua.'

const same = (left, right) => {
  if (left === right) return true
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false
  const keys = Object.keys(left)
  return (
    keys.length === Object.keys(right).length &&
    keys.every((key) => Object.hasOwn(right, key) && same(left[key], right[key]))
  )
}

// Check both dates: moving an old entry forward or a new entry backward must not unlock it.
export function closedMonthChangeError(previous, next, currentMonth = monthKey()) {
  for (const key of ['transactions', 'sourceTransfers']) {
    const before = new Map((previous[key] || []).map((item) => [item.id, item]))
    const after = new Map((next[key] || []).map((item) => [item.id, item]))
    for (const id of new Set([...before.keys(), ...after.keys()])) {
      const original = before.get(id)
      const changed = after.get(id)
      if (
        (isClosedMonth(original?.date, currentMonth) ||
          isClosedMonth(changed?.date, currentMonth)) &&
        !same(original, changed)
      )
        return CLOSED_MONTH_MESSAGE
    }
  }
  for (const key of ['monthlyBudgets', 'monthlyCategoryBudgets', 'monthlyCategoryWeights']) {
    const before = previous[key] || {}
    const after = next[key] || {}
    for (const month of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (isClosedMonth(month, currentMonth) && !same(before[month], after[month]))
        return CLOSED_MONTH_MESSAGE
    }
  }
  // Legacy defaults also back historical months, so all new plans use month-specific maps.
  if (
    previous.categoryBudgetPolicy &&
    !same(previous.categoryBudgetPolicy, next.categoryBudgetPolicy)
  )
    return 'Tỷ lệ phân bổ đã lưu được giữ nguyên để bảo vệ hạn mức của các tháng cũ.'
  if (!previous.categoryBudgetPolicy && next.categoryBudgetPolicy?.fromMonth < currentMonth)
    return CLOSED_MONTH_MESSAGE
  if (!same(previous.budgets, next.budgets) || previous.profile.budget !== next.profile.budget)
    return 'Mức ngân sách mặc định được giữ cho lịch sử. Hãy điều chỉnh ngân sách riêng của tháng hiện tại hoặc tháng sau.'
  return ''
}
