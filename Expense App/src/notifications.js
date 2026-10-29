import { CATEGORIES, dateKey, money, monthKey } from './data'
import { getMonthlyBudget, getCategoryBudgets } from './monthlyBudgets'

export const NOTIFICATION_KEY = 'may-notifications-v1'
export const emptyNotificationState = () => ({ version: 1, remindersEnabled: true, entries: {} })

export function readNotificationState() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || 'null')
    const state = emptyNotificationState()
    if (saved?.version !== 1) return { state, error: false }
    state.remindersEnabled = saved.remindersEnabled !== false
    if (saved.entries && typeof saved.entries === 'object' && !Array.isArray(saved.entries)) {
      state.entries = Object.fromEntries(
        Object.entries(saved.entries)
          .filter(
            ([id, entry]) =>
              id.length < 180 &&
              Number.isFinite(entry?.firstSeen) &&
              entry.firstSeen > 0 &&
              entry.firstSeen <= 8640000000000000,
          )
          .sort((a, b) => b[1].firstSeen - a[1].firstSeen)
          .slice(0, 160)
          .map(([id, entry]) => [
            id,
            {
              firstSeen: entry.firstSeen,
              readAt: Number.isFinite(entry.readAt) && entry.readAt > 0 ? entry.readAt : null,
            },
          ]),
      )
    }
    return { state, error: false }
  } catch {
    return { state: emptyNotificationState(), error: true }
  }
}

export function buildNotifications(
  data,
  { now = new Date(), storageError = '', remindersEnabled = true } = {},
) {
  const month = monthKey(now)
  const notifications = []
  const add = (item) => notifications.push({ ...item, id: `personal:${item.id}` })
  const currentExpenses = data.transactions.filter(
    (item) => item.type === 'expense' && item.date.startsWith(month),
  )

  if (storageError)
    add({
      id: 'storage-error',
      kind: 'error',
      priority: 0,
      title: 'Dữ liệu cần được sao lưu',
      description: storageError,
      actionLabel: 'Mở cài đặt',
      target: { view: 'settings' },
    })

  const budgetNotice = (spent, budget, category) => {
    if (budget < 0 || (budget === 0 && spent === 0) || spent < budget * 0.8) return
    const stage = spent > budget ? 'over' : spent === budget ? 'full' : 'near'
    const name = category ? category.name : 'Ngân sách tháng'
    const percent = budget > 0 ? Math.min(99.9, Math.round((spent / budget) * 1000) / 10) : 100
    const title =
      stage === 'over'
        ? `${name} đã vượt hạn mức`
        : stage === 'full'
          ? `${name} đã dùng hết ngân sách`
          : `${name} sắp chạm ngân sách`
    const description =
      stage === 'over'
        ? `Đã chi ${money(spent)}, vượt ${money(spent - budget)} so với hạn mức ${money(budget)}.`
        : stage === 'full'
          ? `Đã chi đủ ${money(budget)} trong tháng ${now.getMonth() + 1}. Cùng xem lại các khoản chi nhé.`
          : `Đã dùng ${percent.toLocaleString('vi-VN')}% hạn mức, còn ${money(budget - spent)} cho tháng ${now.getMonth() + 1}.`
    add({
      id: `budget:${month}:${category?.id || 'total'}:${stage}`,
      kind: stage === 'over' ? 'over' : 'budget',
      priority: stage === 'over' ? 1 : stage === 'full' ? 2 : 3,
      title,
      description,
      category: category?.id,
      actionLabel: category ? 'Xem khoản chi' : 'Xem ngân sách',
      target: { view: category ? 'transactions' : 'categories', month, category: category?.id },
    })
  }
  budgetNotice(
    currentExpenses.reduce((sum, item) => sum + item.amount, 0),
    getMonthlyBudget(data, month),
  )
  const categoryBudgets = getCategoryBudgets(data, month)
  for (const category of CATEGORIES) {
    budgetNotice(
      currentExpenses
        .filter((item) => item.category === category.id)
        .reduce((sum, item) => sum + item.amount, 0),
      categoryBudgets[category.id],
      category,
    )
  }

  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonth = monthKey(previousDate)
  const previous = data.transactions.filter((item) => item.date.startsWith(previousMonth))
  if (previous.length) {
    const expense = previous
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
    const income = previous
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    add({
      id: `summary:${previousMonth}`,
      kind: 'summary',
      priority: 5,
      title: `Nhìn lại tháng ${previousDate.getMonth() + 1}/${previousDate.getFullYear()}`,
      description: `${previous.length} giao dịch đã ghi: thu ${money(income)}, chi ${money(expense)}.`,
      actionLabel: 'Xem tổng kết',
      target: { view: 'overview', month: previousMonth },
    })
  }

  if (remindersEnabled) {
    if (!data.transactions.length) {
      add({
        id: 'welcome',
        kind: 'reminder',
        priority: 4,
        title: 'Sổ nhỏ đang chờ trang đầu tiên',
        description: 'Ghi lại một khoản thu hoặc chi để bắt đầu theo dõi những điều nhỏ mỗi ngày.',
        actionLabel: 'Ghi giao dịch đầu tiên',
        target: { view: 'transactions', month, add: true },
      })
    } else {
      // Recording an old expense today still counts as keeping the journal up to date.
      const recordedDays = data.transactions
        .map((item) => {
          const recorded =
            item.createdAt > 0 && item.createdAt <= 8640000000000000
              ? dateKey(new Date(item.createdAt))
              : item.date
          if (recorded <= dateKey(now)) return recorded
          return item.date <= dateKey(now) ? item.date : null
        })
        .filter(Boolean)
        .sort()
      const lastDay = recordedDays.at(-1)
      if (lastDay) {
        const calendarDay = (value) =>
          Date.UTC(...value.split('-').map((part, index) => Number(part) - (index === 1 ? 1 : 0)))
        const days = Math.round((calendarDay(dateKey(now)) - calendarDay(lastDay)) / 86400000)
        if (days >= 3)
          add({
            id: `reminder:${lastDay}`,
            kind: 'reminder',
            priority: 4,
            title: 'Dành một phút cho sổ nhỏ nhé',
            description: `Đã ${days} ngày bạn chưa ghi giao dịch. Thêm vài khoản để nhìn lại chi tiêu đầy đủ hơn.`,
            actionLabel: 'Ghi thêm một chút',
            target: { view: 'transactions', month, add: true },
          })
      }
    }
  }
  return notifications.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
}
