import { isClosedMonth } from '../../shared/lib/closedMonths.js'

export const BAG_STYLES = [
  { id: 'trip', label: 'Chuyến đi' },
  { id: 'gift', label: 'Quà tặng' },
  { id: 'home', label: 'Góc nhỏ' },
  { id: 'tech', label: 'Công nghệ' },
]

export const BAG_COLORS = [
  {
    id: 'lilac',
    label: 'Tím mây',
    paper: '#f5edfc',
    body: '#ded0ee',
    ink: '#836398',
    border: '#dfcdeb',
  },
  {
    id: 'peach',
    label: 'Đào hồng',
    paper: '#fff1e8',
    body: '#f3d0bc',
    ink: '#a76e53',
    border: '#edcfbc',
  },
  {
    id: 'mint',
    label: 'Xanh lá',
    paper: '#f0f6e9',
    body: '#d6e4c3',
    ink: '#6b855c',
    border: '#d5e1c7',
  },
  {
    id: 'butter',
    label: 'Vàng kem',
    paper: '#fff8e5',
    body: '#f5e2a7',
    ink: '#a18646',
    border: '#ecdfb7',
  },
]

export const getBagColor = (color) => BAG_COLORS.find((item) => item.id === color) || BAG_COLORS[0]

export function isValidBag(bag) {
  return Boolean(
    bag &&
    typeof bag.id === 'string' &&
    bag.id.length > 0 &&
    typeof bag.name === 'string' &&
    bag.name.trim().length > 0 &&
    bag.name.length <= 60 &&
    typeof bag.description === 'string' &&
    bag.description.length <= 300 &&
    Number.isSafeInteger(bag.budget) &&
    bag.budget >= 0 &&
    bag.budget <= 1e12 &&
    BAG_STYLES.some((item) => item.id === bag.style) &&
    BAG_COLORS.some((item) => item.id === bag.color) &&
    ['active', 'done'].includes(bag.status) &&
    Number.isFinite(bag.createdAt) &&
    bag.createdAt > 0,
  )
}

export function bagSummary(bag, transactions) {
  const expenses = transactions.filter((item) => item.type === 'expense' && item.bagId === bag.id)
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0)
  return {
    expenses,
    spent,
    count: expenses.length,
    remaining: bag.budget - spent,
    percent: bag.budget ? Math.round((spent / bag.budget) * 100) : 0,
  }
}

export function setTransactionBag(transaction, bagId) {
  const next = { ...transaction }
  if (bagId && transaction.type === 'expense') next.bagId = bagId
  else delete next.bagId
  return next
}

// The picker edits this bag and unassigned expenses; other bags stay untouched.
export function linkBagTransactions(transactions, bagId, selectedIds) {
  const selected = new Set(selectedIds)
  return transactions.map((item) =>
    !isClosedMonth(item.date) && item.type === 'expense' && (!item.bagId || item.bagId === bagId)
      ? setTransactionBag(item, selected.has(item.id) ? bagId : null)
      : item,
  )
}

export function removeBag(data, bagId) {
  return {
    ...data,
    bags: (data.bags || []).filter((bag) => bag.id !== bagId),
    transactions: data.transactions.map((item) =>
      item.bagId === bagId ? setTransactionBag(item, null) : item,
    ),
  }
}
