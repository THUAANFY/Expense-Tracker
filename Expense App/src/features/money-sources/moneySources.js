import { dateKey, isValidDate } from '../../shared/lib/dates.js'

export const SOURCE_TYPES = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'bank', label: 'Ngân hàng' },
  { id: 'ewallet', label: 'Ví điện tử' },
]
export const SOURCE_COLORS = [
  {
    id: 'lilac',
    neon: '#b78aff',
    label: 'Tím mây',
    paper: '#f6eefc',
    fill: '#dfcff1',
    border: '#dcc8ec',
    ink: '#8a6aab',
  },
  {
    id: 'mint',
    neon: '#57efc0',
    label: 'Xanh lá',
    paper: '#f0f7ec',
    fill: '#d7e8c8',
    border: '#d3e2c6',
    ink: '#789265',
  },
  {
    id: 'peach',
    neon: '#ff8aab',
    label: 'Đào hồng',
    paper: '#fff2e9',
    fill: '#f5d4bf',
    border: '#edd1bd',
    ink: '#b38a6c',
  },
  {
    id: 'butter',
    neon: '#e2e979',
    label: 'Vàng kem',
    paper: '#fffae9',
    fill: '#f6e4b1',
    border: '#ecdfb9',
    ink: '#b29b63',
  },
  {
    id: 'neon-violet',
    label: 'Tím điện',
    neon: '#b78aff',
    paper: '#f4edff',
    fill: '#dfc9fc',
    border: '#d0b3ef',
    ink: '#71509d',
  },
  {
    id: 'neon-blue',
    label: 'Xanh điện',
    neon: '#66a5ff',
    paper: '#edf4ff',
    fill: '#c9dffd',
    border: '#a9c9ee',
    ink: '#426997',
  },
  {
    id: 'neon-cyan',
    label: 'Xanh ngọc',
    neon: '#48dfff',
    paper: '#eafaFD',
    fill: '#bceaf3',
    border: '#a2d5e1',
    ink: '#366f80',
  },
  {
    id: 'neon-mint',
    label: 'Bạc hà',
    neon: '#57efc0',
    paper: '#ebfbf4',
    fill: '#bfead9',
    border: '#9ecfbb',
    ink: '#386f5b',
  },
  {
    id: 'neon-lime',
    label: 'Xanh chanh',
    neon: '#b5f06a',
    paper: '#f3fae9',
    fill: '#d6eabd',
    border: '#bad399',
    ink: '#546f37',
  },
  {
    id: 'neon-pink',
    label: 'Hồng sáng',
    neon: '#ff80bd',
    paper: '#fff0f7',
    fill: '#f6c8de',
    border: '#e6a9c6',
    ink: '#94516f',
  },
  {
    id: 'neon-coral',
    label: 'San hô',
    neon: '#ff8a94',
    paper: '#fff0f1',
    fill: '#f7c7cd',
    border: '#e9aeb7',
    ink: '#93525c',
  },
  {
    id: 'neon-orange',
    label: 'Cam sáng',
    neon: '#ffad68',
    paper: '#fff4e9',
    fill: '#f7d8b9',
    border: '#e6bf98',
    ink: '#8c623a',
  },
]
export const getSourceColor = (id) =>
  SOURCE_COLORS.find((item) => item.id === id) || SOURCE_COLORS[0]
export const sourceColorStyle = (id) => {
  const color = getSourceColor(id)
  return {
    '--source-paper': color.paper,
    '--source-border': color.border,
    '--source-fill': color.fill,
    '--source-ink': color.ink,
    '--source-neon': color.neon,
  }
}
export const getSourceType = (id) => SOURCE_TYPES.find((item) => item.id === id) || SOURCE_TYPES[0]
export const getMoneySource = (sources = [], id) => sources.find((source) => source.id === id)
export const sourceName = (sources, id) => getMoneySource(sources, id)?.name || 'Chưa gán nguồn'

export function isValidMoneySource(source) {
  return Boolean(
    source &&
    typeof source.id === 'string' &&
    source.id.length > 0 &&
    typeof source.name === 'string' &&
    source.name.trim().length > 0 &&
    source.name.length <= 60 &&
    SOURCE_TYPES.some((type) => type.id === source.type) &&
    SOURCE_COLORS.some((color) => color.id === source.color) &&
    Number.isSafeInteger(source.openingBalance) &&
    source.openingBalance >= 0 &&
    source.openingBalance <= 1e12 &&
    isValidDate(source.openingDate) &&
    Number.isFinite(source.createdAt) &&
    source.createdAt > 0,
  )
}

export function isValidSourceTransfer(transfer, sources = []) {
  const from = getMoneySource(sources, transfer?.fromSourceId)
  const to = getMoneySource(sources, transfer?.toSourceId)
  return Boolean(
    transfer &&
    typeof transfer.id === 'string' &&
    transfer.id.length > 0 &&
    from &&
    to &&
    from.id !== to.id &&
    Number.isSafeInteger(transfer.amount) &&
    transfer.amount > 0 &&
    transfer.amount <= 1e12 &&
    isValidDate(transfer.date) &&
    transfer.date >= from.openingDate &&
    transfer.date >= to.openingDate &&
    typeof transfer.note === 'string' &&
    transfer.note.length <= 300 &&
    Number.isFinite(transfer.createdAt) &&
    transfer.createdAt > 0,
  )
}

export function sourceSummary(source, transactions, transfers = [], asOf = dateKey()) {
  const linked = transactions.filter((item) => item.sourceId === source.id)
  const counted = linked.filter((item) => item.date >= source.openingDate && item.date <= asOf)
  const income = counted
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
  const expense = counted
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
  const movements = transfers.filter((item) => item.date >= source.openingDate && item.date <= asOf)
  const transferredIn = movements
    .filter((item) => item.toSourceId === source.id)
    .reduce((sum, item) => sum + item.amount, 0)
  const transferredOut = movements
    .filter((item) => item.fromSourceId === source.id)
    .reduce((sum, item) => sum + item.amount, 0)
  const opening = source.openingDate <= asOf ? source.openingBalance : 0
  return {
    balance: opening + income - expense + transferredIn - transferredOut,
    income,
    expense,
    transferredIn,
    transferredOut,
    linked,
    counted,
    beforeOpening: linked.filter((item) => item.date < source.openingDate).length,
    upcoming: linked.filter((item) => item.date > asOf).length,
  }
}

export function previewSourceBalance(source, transactions, transfers, draft, asOf = dateKey()) {
  const withoutDraft = transactions.filter((item) => item.id !== draft.id)
  return sourceSummary(source, [...withoutDraft, draft], transfers, asOf).balance
}

export function removeMoneySource(data, sourceId) {
  if (
    !(data.moneySources || []).some((source) => source.id === sourceId) ||
    data.transactions.some((item) => item.sourceId === sourceId) ||
    (data.sourceTransfers || []).some(
      (item) => item.fromSourceId === sourceId || item.toSourceId === sourceId,
    )
  )
    return null
  return {
    ...data,
    moneySources: (data.moneySources || []).filter((source) => source.id !== sourceId),
  }
}
