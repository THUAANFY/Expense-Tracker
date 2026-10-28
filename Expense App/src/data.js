import { isValidReview } from './reviews.js'
import { isValidBag } from './bags.js'
import { dateKey, isValidDate } from './dates.js'
import { isValidMoneySource, isValidSourceTransfer, sourceName } from './moneySources.js'
export { dateKey, monthKey, isValidDate } from './dates.js'

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Ăn uống',
    color: '#f2997e',
    textColor: '#89412b',
    background: '#fff0e9',
    budget: 3000000,
    description: 'Một bữa ngon, một ngày vui',
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    color: '#a998e3',
    textColor: '#604383',
    background: '#f0eafa',
    budget: 2500000,
    description: 'Những điều nhỏ mình yêu',
  },
  {
    id: 'transport',
    name: 'Di chuyển',
    color: '#70b8ad',
    textColor: '#2d6357',
    background: '#e9f6f1',
    budget: 1200000,
    description: 'Đi đâu cũng là trải nghiệm',
  },
  {
    id: 'home',
    name: 'Nhà cửa',
    color: '#7e9dcf',
    textColor: '#385983',
    background: '#eaf0fa',
    budget: 4500000,
    description: 'Chăm chút tổ ấm của mình',
  },
  {
    id: 'fun',
    name: 'Giải trí',
    color: '#e2b75b',
    textColor: '#75591c',
    background: '#fff7df',
    budget: 1000000,
    description: 'Dành chỗ cho niềm vui',
  },
  {
    id: 'health',
    name: 'Sức khỏe',
    color: '#d88fa5',
    textColor: '#873e58',
    background: '#fcecf2',
    budget: 800000,
    description: 'Đầu tư cho chính mình',
  },
  {
    id: 'study',
    name: 'Học tập',
    color: '#81adc2',
    textColor: '#305e75',
    background: '#eaf4fa',
    budget: 1000000,
    description: 'Tốt hơn một chút mỗi ngày',
  },
  {
    id: 'other',
    name: 'Khác',
    color: '#a2a8b8',
    textColor: '#51566a',
    background: '#eff1f5',
    budget: 1000000,
    description: 'Những khoản chi nho nhỏ',
  },
]

export const getCategory = (id) =>
  CATEGORIES.find((item) => item.id === id) || CATEGORIES[CATEGORIES.length - 1]
export const money = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
export const compactMoney = (value) =>
  Math.abs(value) >= 1000000
    ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1000000)} tr`
    : money(value)
export const formatDate = (
  value,
  options = { day: '2-digit', month: '2-digit', year: 'numeric' },
) => new Date(`${value}T12:00:00`).toLocaleDateString('vi-VN', options)
export const uid = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`

export function createEmptyData() {
  return {
    transactions: [],
    bags: [],
    moneySources: [],
    sourceTransfers: [],
    notes: [],
    profile: { name: 'bạn', budget: 12000000 },
    budgets: Object.fromEntries(CATEGORIES.map((category) => [category.id, category.budget])),
  }
}

// Older backups may contain this retired mode flag; keep every saved record.
export function normalizeData(data) {
  const normalized = { ...data }
  delete normalized.isDemo
  return normalized
}

export const STORAGE_KEY = 'may-expense-tracker-v1'

export function isValidData(data) {
  return (
    data &&
    Array.isArray(data.transactions) &&
    Array.isArray(data.notes) &&
    (data.moneySources === undefined ||
      (Array.isArray(data.moneySources) &&
        data.moneySources.every(isValidMoneySource) &&
        new Set(data.moneySources.map((source) => source.id)).size === data.moneySources.length)) &&
    (data.sourceTransfers === undefined ||
      (Array.isArray(data.sourceTransfers) &&
        data.sourceTransfers.every((item) =>
          isValidSourceTransfer(item, data.moneySources || []),
        ) &&
        new Set(data.sourceTransfers.map((item) => item.id)).size ===
          data.sourceTransfers.length)) &&
    (data.bags === undefined ||
      (Array.isArray(data.bags) &&
        data.bags.every(isValidBag) &&
        new Set(data.bags.map((bag) => bag.id)).size === data.bags.length)) &&
    data.profile &&
    typeof data.profile.name === 'string' &&
    data.profile.name.trim().length > 0 &&
    data.profile.name.length <= 40 &&
    (data.isDemo === undefined || typeof data.isDemo === 'boolean') &&
    Number.isSafeInteger(data.profile.budget) &&
    data.profile.budget <= 1e12 &&
    data.profile.budget > 0 &&
    data.budgets &&
    CATEGORIES.every(
      (category) =>
        Number.isSafeInteger(data.budgets[category.id]) &&
        data.budgets[category.id] > 0 &&
        data.budgets[category.id] <= 1e12,
    ) &&
    data.transactions.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        item.title.trim() &&
        Number.isSafeInteger(item.amount) &&
        item.amount > 0 &&
        item.amount <= 1e12 &&
        isValidDate(item.date) &&
        Number.isFinite(item.createdAt) &&
        ['income', 'expense'].includes(item.type) &&
        CATEGORIES.some((category) => category.id === item.category) &&
        typeof item.note === 'string' &&
        ['Chuyển khoản', 'Tiền mặt', 'Thẻ ngân hàng'].includes(item.wallet) &&
        item.title.length <= 100 &&
        item.note.length <= 1000 &&
        (item.sourceId === undefined ||
          (typeof item.sourceId === 'string' &&
            (data.moneySources || []).some((source) => source.id === item.sourceId))) &&
        (item.review === undefined || (item.type === 'expense' && isValidReview(item.review))) &&
        (item.bagId === undefined ||
          (item.type === 'expense' &&
            typeof item.bagId === 'string' &&
            (data.bags || []).some((bag) => bag.id === item.bagId))),
    ) &&
    data.notes.every(
      (note) =>
        note &&
        typeof note.id === 'string' &&
        typeof note.title === 'string' &&
        typeof note.content === 'string' &&
        ['yellow', 'purple', 'green'].includes(note.color) &&
        isValidDate(note.date) &&
        note.title.trim().length > 0 &&
        note.title.length <= 100 &&
        note.content.length <= 3000 &&
        typeof note.pinned === 'boolean',
    ) &&
    new Set(data.transactions.map((item) => item.id)).size === data.transactions.length &&
    new Set(data.notes.map((note) => note.id)).size === data.notes.length
  )
}

export function readData() {
  let raw
  try {
    raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (isValidData(parsed))
        return { data: normalizeData(parsed), raw, blocked: false, error: '' }
      throw new Error('Invalid saved book')
    }
  } catch {
    return {
      data: createEmptyData(),
      raw,
      blocked: true,
      error:
        typeof raw === 'string'
          ? 'Dữ liệu đã lưu không hợp lệ. Bản gốc được giữ nguyên và đang khóa lưu thay đổi. Hãy tải bản gốc hoặc khôi phục bản sao lưu trong Cài đặt.'
          : 'Không đọc được bộ nhớ trình duyệt. Đang khóa lưu để bảo vệ dữ liệu; hãy cho phép bộ nhớ trình duyệt rồi thử lại.',
    }
  }
  return { data: createEmptyData(), raw: null, blocked: false, error: '' }
}

export function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportCSV(transactions, sources = []) {
  const cell = (value) =>
    `"${String(value)
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""')}"`
  const rows = [
    [
      'Ngày',
      'Giao dịch',
      'Loại',
      'Danh mục',
      'Số tiền (VND)',
      'Thanh toán',
      'Nguồn tiền',
      'Ghi chú',
    ],
    ...transactions.map((item) => [
      item.date,
      item.title,
      item.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
      getCategory(item.category).name,
      item.amount,
      item.wallet,
      sourceName(sources, item.sourceId),
      item.note,
    ]),
  ]
  downloadFile(
    `\uFEFF${rows.map((row) => row.map(cell).join(',')).join('\r\n')}`,
    `may-giao-dich-${dateKey()}.csv`,
    'text/csv;charset=utf-8',
  )
}
