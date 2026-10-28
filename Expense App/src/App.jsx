import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import {
  ArrowDownLeft,
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cloud,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileText,
  Heart,
  History,
  LayoutDashboard,
  Menu,
  PencilLine,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tags,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import CategoryArt from './components/CategoryArt'
import SpendingChart from './components/SpendingChart'
import MonthPicker from './components/MonthPicker'
import NotesView from './components/NotesView'
import WorthView from './components/WorthView'
import BagsView from './components/BagsView'
import BagArt from './components/BagArt'
import CategoriesView from './components/CategoriesView'
import FilterSelect from './components/FilterSelect'
import HistoryOverview from './components/HistoryOverview'
import HistoryArt from './components/HistoryArt'
import OverviewArt from './components/OverviewArt'
import SidebarArt from './components/SidebarArt'
import NotificationCenter from './components/NotificationCenter'
import SettingsView from './components/SettingsView'
import useBookData, { SaveFeedbackContext } from './components/useBookData'
import Dialog from './components/dialogs/Dialog'
import TransactionDialog from './components/dialogs/TransactionDialog'
import NoteDialog from './components/dialogs/NoteDialog'
import ReviewDialog from './components/dialogs/ReviewDialog'
import BagDialog from './components/dialogs/BagDialog'
import BagTransactionsDialog from './components/dialogs/BagTransactionsDialog'
import BudgetDialog from './components/dialogs/BudgetDialog'
import WelcomeDialog from './components/dialogs/WelcomeDialog'
import {
  CATEGORIES,
  compactMoney,
  dateKey,
  exportCSV,
  formatDate,
  getCategory,
  money,
  monthKey,
} from './data'
import { getReviewOption, withReview } from './reviews'
import { linkBagTransactions, removeBag, setTransactionBag } from './bags'
import './App.css'
import './components/TransactionList.css'
import './components/HistoryView.css'
import './components/OverviewView.css'
import './components/Sidebar.css'

const NAVIGATION = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'transactions', label: 'Lịch sử giao dịch', icon: Wallet },
  { id: 'categories', label: 'Danh mục & ngân sách', icon: Tags },
  { id: 'bags', label: 'Túi chi tiêu', icon: ShoppingBag },
]
const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Mọi danh mục', icon: Tags },
  ...CATEGORIES.map((category) => ({
    value: category.id,
    label: category.name,
    category: category.id,
    background: category.background,
  })),
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất', description: 'Ngày gần đây trước', icon: Clock3 },
  { value: 'oldest', label: 'Cũ nhất', description: 'Ngày xa hơn trước', icon: History },
  {
    value: 'highest',
    label: 'Số tiền cao nhất',
    description: 'Giá trị giảm dần',
    icon: ArrowDownWideNarrow,
  },
]
const TITLES = {
  overview: ['Gọn chi tiêu. Nhẹ cuộc sống.', 'Một góc nhìn rõ ràng hơn về tài chính của bạn.'],
  transactions: ['Mỗi khoản chi, một câu chuyện.', 'Lưu lại những điều nhỏ, hiểu hơn về mỗi ngày.'],
  categories: ['Chi tiêu có một chỗ riêng.', 'Một ngân sách vừa vặn cho từng điều bạn quan tâm.'],
  reviews: ['Đáng tiền không?', 'Nhìn lại một khoản chi, hiểu thêm điều mình cần.'],
  bags: ['Túi chi tiêu theo dịp', 'Một chiếc túi nhỏ cho mỗi câu chuyện chi tiêu.'],
  notes: ['Ghi chú đã lưu.', 'Những dòng ghi chép của bạn vẫn ở đây.'],
  settings: ['Theo cách của bạn.', 'Một vài điều chỉnh để mây gần gũi với bạn hơn.'],
}
const ease = [0.22, 1, 0.36, 1]
const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')

function Brand() {
  return (
    <div className="brand">
      <span className="brand-symbol">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M5 12 16 6l11 6-11 6Z" fill="#b9a7df" />
          <path
            d="m5 17 11 6 11-6"
            stroke="#a08bc7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m5 23 11 6 11-6"
            stroke="#d5c8eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>
        mây<span className="brand-dot">.</span>
      </span>
      <span className="brand-caption">EXPENSE TRACKER</span>
    </div>
  )
}

function EmptyState({
  title = 'Chưa có giao dịch nào',
  description = 'Thêm một giao dịch để bắt đầu câu chuyện chi tiêu của bạn.',
  onAdd,
  compact = false,
}) {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <span>
        <Cloud size={34} strokeWidth={1.3} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {onAdd && (
        <button className="button secondary" onClick={onAdd}>
          <Plus size={15} /> Thêm giao dịch
        </button>
      )}
    </div>
  )
}

function Stats({ income, expense, previousExpense, budget, transactionCount }) {
  const [showBalance, setShowBalance] = useState(true)
  const difference = previousExpense ? ((expense - previousExpense) / previousExpense) * 100 : null
  return (
    <div className="stats-grid">
      <section className="stat-card balance-card">
        <div className="stat-label">
          <span>
            <Wallet size={17} /> Số dư trong tháng
          </span>
          <button
            className="icon-button"
            aria-label={showBalance ? 'Ẩn số dư' : 'Hiện số dư'}
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <strong className="stat-value">{showBalance ? money(income - expense) : '••••••••'}</strong>
        <div className="stat-foot">
          <span className="balance-dot" /> Thu nhập − chi tiêu trong tháng
        </div>
        <OverviewArt className="overview-balance-art" />
      </section>
      <section className="stat-card overview-income-card">
        <div className="stat-label">
          <span>
            <span className="stat-icon income">
              <ArrowDownLeft size={18} />
            </span>{' '}
            Tổng thu nhập
          </span>
          <HistoryArt variant="income" className="overview-stat-art" />
        </div>
        <strong className="stat-value">{money(income)}</strong>
        <div className="stat-foot">
          <span className="pill green">
            <TrendingUp size={12} /> Khoản thu
          </span>
          <span>Cho những dự định mới</span>
        </div>
      </section>
      <section className="stat-card overview-expense-card">
        <div className="stat-label">
          <span>
            <span className="stat-icon expense">
              <ArrowUpRight size={18} />
            </span>{' '}
            Tổng chi tiêu
          </span>
          <HistoryArt variant="expense" className="overview-stat-art" />
        </div>
        <strong className="stat-value">{money(expense)}</strong>
        <div className="stat-foot">
          {difference !== null ? (
            <>
              <span className={`pill ${difference <= 0 ? 'green' : 'orange'}`}>
                {difference <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}{' '}
                {Math.abs(difference).toFixed(1).replace('.', ',')}%
              </span>
              <span>so với tháng trước</span>
            </>
          ) : (
            <>
              <span className={`pill ${expense <= budget ? 'green' : 'orange'}`}>
                {transactionCount} giao dịch
              </span>
              <span>trong tháng này</span>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function CategoryDonut({ totals, expense, onCategory }) {
  const sorted = [...totals]
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent - a.spent)
  let offset = 0
  const ringPoint = (radius, angle) =>
    `${87 + radius * Math.cos(angle)} ${87 + radius * Math.sin(angle)}`
  const slicePath = (start, end) => {
    const middle = (start + end) / 2
    return `M ${ringPoint(73.5, start)} A 73.5 73.5 0 0 1 ${ringPoint(73.5, middle)} A 73.5 73.5 0 0 1 ${ringPoint(73.5, end)} L ${ringPoint(54.5, end)} A 54.5 54.5 0 0 0 ${ringPoint(54.5, middle)} A 54.5 54.5 0 0 0 ${ringPoint(54.5, start)} Z`
  }
  return (
    <section className="panel category-panel">
      <div className="panel-heading">
        <h2>Chi tiêu theo danh mục</h2>
        <span className="tiny-label">THÁNG NÀY</span>
      </div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 174 174"
          role="img"
          aria-label={`Phân bổ chi tiêu: ${sorted.map((category) => `${category.name} ${money(category.spent)}`).join(', ') || 'chưa có chi tiêu'}`}
        >
          <circle cx="87" cy="87" r="64" fill="none" stroke="#f1eef6" strokeWidth="19" />
          {sorted.map((category) => {
            const fraction = category.spent / expense
            const start = offset * 2 * Math.PI - Math.PI / 2
            offset += fraction
            const end = offset * 2 * Math.PI - Math.PI / 2
            return (
              <path
                key={category.id}
                d={slicePath(start, end)}
                fill={category.color}
                data-category={category.id}
              />
            )
          })}
        </svg>
        <div className="donut-center">
          <span>Tổng chi tiêu</span>
          <strong>{compactMoney(expense)}</strong>
          <span>{sorted.length} danh mục</span>
        </div>
        <OverviewArt variant="flower" className="overview-donut-flower" />
        <span className="donut-spark two" aria-hidden="true">
          ✧
        </span>
      </div>
      <div className="donut-legend">
        {sorted.length ? (
          sorted.slice(0, 3).map((category) => (
            <button key={category.id} onClick={() => onCategory(category.id)}>
              <span className="legend-name">
                <span className="overview-legend-art" style={{ background: category.background }}>
                  <CategoryArt category={category.id} size={26} />
                </span>
                {category.name}
              </span>
              <strong>
                {((category.spent / expense) * 100).toFixed(1).replace('.', ',')}
                <span>%</span>
              </strong>
            </button>
          ))
        ) : (
          <p className="category-empty-message muted center">Chưa có chi tiêu trong tháng này.</p>
        )}
        {sorted.length > 3 && (
          <button onClick={() => onCategory('all')}>
            <span className="legend-name">
              <i style={{ background: '#c8cbd4' }} />
              Các danh mục khác
            </span>
            <strong>
              {(
                (sorted.slice(3).reduce((sum, category) => sum + category.spent, 0) / expense) *
                100
              )
                .toFixed(1)
                .replace('.', ',')}
              <span>%</span>
            </strong>
          </button>
        )}
      </div>
    </section>
  )
}

function TransactionList({
  transactions,
  onEdit,
  onAdd,
  small = false,
  total = transactions.length,
  hasFilters = false,
  page = 1,
  onPage,
  ledger = false,
  groupByDate = false,
}) {
  if (!transactions.length)
    return (
      <EmptyState
        title={hasFilters ? 'Không tìm thấy giao dịch' : 'Một trang mới đang chờ bạn'}
        description={
          hasFilters
            ? 'Thử tìm từ khóa khác hoặc thay đổi bộ lọc.'
            : 'Lưu lại khoản chi đầu tiên, mọi thứ sẽ bắt đầu từ đây.'
        }
        onAdd={onAdd}
      />
    )
  const renderRows = (items) =>
    items.map((item) => {
      const category = getCategory(item.category)
      const income = item.type === 'income'
      return (
        <button
          className="transaction-row"
          data-type={item.type}
          style={
            ledger
              ? {
                  '--transaction-accent': income ? '#6d9d84' : category.color,
                  '--transaction-tint': income ? '#edf5ee' : category.background,
                }
              : undefined
          }
          key={item.id}
          onClick={() => onEdit(item)}
          aria-label={`Sửa giao dịch ${item.title}, ${money(item.amount)}${ledger ? `, ${formatDate(item.date)}` : ''}`}
        >
          <span className="transaction-main">
            <span
              className="transaction-art"
              style={{ background: income ? '#edf5ee' : category.background }}
            >
              <CategoryArt category={income ? 'income' : item.category} size={42} />
            </span>
            <span className="transaction-copy">
              <strong title={item.title}>{item.title}</strong>
              <span className="transaction-meta">
                <span className="transaction-wallet">{item.wallet}</span>
                {item.note && (
                  <>
                    <span className="transaction-meta-dot" aria-hidden="true" />
                    <span className="transaction-note" title={item.note}>
                      <FileText size={12} aria-hidden="true" />
                      <span>{item.note}</span>
                    </span>
                  </>
                )}
              </span>
            </span>
          </span>
          <span
            className="category-badge"
            style={{
              background: income ? '#edf5ee' : category.background,
              color: income ? 'var(--text-success)' : category.textColor,
            }}
          >
            {income ? 'Thu nhập' : category.name}
          </span>
          <span className="transaction-date">
            <CalendarDays size={13} className="transaction-date-icon" aria-hidden="true" />
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </span>
          <strong className={`transaction-amount ${income ? 'income-text' : ''}`}>
            {ledger && (
              <span className="history-amount-kind" aria-hidden="true">
                {income ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
              </span>
            )}
            {income ? '+' : '−'}
            {money(item.amount)}
          </strong>
          <span className="row-edit" aria-hidden="true">
            <PencilLine size={15} />
          </span>
        </button>
      )
    })
  const groups = []
  if (ledger && groupByDate) {
    for (const item of transactions) {
      const last = groups.at(-1)
      if (last?.date === item.date) last.items.push(item)
      else groups.push({ date: item.date, items: [item] })
    }
  }
  return (
    <>
      <div
        className={`transaction-table ${small ? 'small' : ''} ${ledger ? `history-ledger ${groupByDate ? 'is-grouped' : 'is-ranked'}` : ''}`}
      >
        <div className="table-head">
          <span>Giao dịch</span>
          <span>Danh mục</span>
          <span>Ngày</span>
          <span>Số tiền</span>
          <span />
        </div>
        {ledger && groupByDate
          ? groups.map((group) => (
              <section
                className="history-day-group"
                key={group.date}
                aria-label={`Giao dịch ngày ${formatDate(group.date)}`}
              >
                <div className="history-day-marker" aria-hidden="true">
                  <strong>{group.date.slice(8)}</strong>
                  <span>TH.{Number(group.date.slice(5, 7))}</span>
                </div>
                <div className="history-day-content">
                  <div className="history-day-heading">
                    <h3>
                      {group.date === dateKey()
                        ? 'Hôm nay'
                        : formatDate(group.date, { weekday: 'long' })}
                    </h3>
                    <time dateTime={group.date}>{formatDate(group.date)}</time>
                  </div>
                  <div className="history-day-transactions">{renderRows(group.items)}</div>
                </div>
              </section>
            ))
          : renderRows(transactions)}
      </div>
      {onPage && (
        <div className="pagination">
          <span>
            {(page - 1) * 8 + 1}–{Math.min(page * 8, total)} trong {total} giao dịch
          </span>
          <div>
            <button
              className="icon-button"
              aria-label="Trang trước"
              disabled={page <= 1}
              onClick={() => onPage(page - 1)}
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              Trang {page}/{Math.max(1, Math.ceil(total / 8))}
            </span>
            <button
              className="icon-button"
              aria-label="Trang sau"
              disabled={page * 8 >= total}
              onClick={() => onPage(page + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function AppProviders({ saveError, saving, children }) {
  return (
    <SaveFeedbackContext.Provider value={{ saveError, saving }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SaveFeedbackContext.Provider>
  )
}

export default function App() {
  const [view, setView] = useState('overview')
  const [month, setMonth] = useState(monthKey())
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [modal, setModalState] = useState(null)
  const [selectedBagId, setSelectedBagId] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [toast, setToast] = useState('')
  const searchRef = useRef(null)
  const toastTimer = useRef(null)
  const {
    data,
    raw,
    storageError,
    storageBlocked,
    saveData,
    saveError,
    saving,
    clearSaveError,
    recovery,
  } = useBookData(notify)
  function setModal(value) {
    clearSaveError()
    setModalState(value ? { ...value, base: data, baseRaw: raw } : null)
  }
  const saveModalData = (next, message) =>
    saveData(next, message, { base: modal.base, baseRaw: modal.baseRaw })
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = (event) => setIsMobile(event.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!mobileMenu || !isMobile) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const sidebar = document.querySelector('.sidebar')
    document.body.style.overflow = 'hidden'
    sidebar.querySelector('[aria-current="page"]')?.focus()
    function handleKeys(event) {
      if (document.querySelector('dialog[open]')) return
      if (event.key === 'Escape') setMobileMenu(false)
      if (event.key !== 'Tab') return
      const controls = [...sidebar.querySelectorAll('button')].filter(
        (button) => button.offsetWidth > 0,
      )
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeys)
    return () => {
      document.removeEventListener('keydown', handleKeys)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [mobileMenu, isMobile])
  useEffect(() => {
    const handler = (event) => {
      if (
        (event.key === '/' &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) ||
        ((event.metaKey || event.ctrlKey) && event.key === 'k')
      ) {
        if (document.querySelector('dialog[open]')) return
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
      clearTimeout(toastTimer.current)
    }
  }, [])

  function notify(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3500)
  }
  function navigate(id) {
    setView(id)
    if (id === 'bags') setSelectedBagId(null)
    setMobileMenu(false)
    setSearch('')
    setPage(1)
  }
  function openNotification(target) {
    navigate(target.view)
    if (target.month) setMonth(target.month)
    setFilterCategory(target.category || 'all')
    setFilterType(target.category ? 'expense' : 'all')
    setSort('newest')
    if (target.add) setModal({ type: 'transaction' })
  }
  function categoryFilter(id) {
    setFilterCategory(id)
    setFilterType('expense')
    setSearch('')
    setPage(1)
    setView('transactions')
  }
  const addTransaction = () => setModal({ type: 'transaction' })
  const editTransaction = (transaction) => setModal({ type: 'transaction', transaction })
  const editNote = (note) => setModal({ type: 'note', note })
  const createBag = () => setModal({ type: 'bag' })
  const bags = data.bags || []
  function rateTransaction(id, review, options = {}) {
    const source = options.base || data
    const transaction = source.transactions.find((item) => item.id === id)
    if (!transaction || transaction.type !== 'expense') return
    return saveData(
      {
        ...source,
        transactions: source.transactions.map((item) =>
          item.id === id ? withReview(item, review) : item,
        ),
      },
      review ? `Đã lưu cảm nhận: ${getReviewOption(review.rating).label}` : 'Đã bỏ đánh giá',
      options,
    )
  }
  function pinNote(id) {
    saveData(
      {
        ...data,
        notes: data.notes.map((note) =>
          note.id === id ? { ...note, pinned: !note.pinned } : note,
        ),
      },
      'Đã cập nhật ghim ghi chú',
    )
  }
  async function startOwnBook() {
    const saved = await saveData(
      { ...data, transactions: [], notes: [], bags: [], isDemo: false },
      'Sổ chi tiêu của bạn đã sẵn sàng',
      { replace: true, base: modal.base, baseRaw: modal.baseRaw },
    )
    if (!saved) return
    setModal(null)
    setMonth(monthKey())
    setView('overview')
    setSearch('')
  }
  const monthTransactions = data.transactions.filter((item) => item.date.startsWith(month))
  const expenses = monthTransactions.filter((item) => item.type === 'expense')
  const expense = expenses.reduce((total, item) => total + item.amount, 0)
  const income = monthTransactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)
  const [year, monthNumber] = month.split('-').map(Number)
  const previousMonth = monthKey(new Date(year, monthNumber - 2, 1))
  const previousExpense = data.transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(previousMonth))
    .reduce((total, item) => total + item.amount, 0)
  const totals = CATEGORIES.map((category) => ({
    ...category,
    spent: expenses
      .filter((item) => item.category === category.id)
      .reduce((total, item) => total + item.amount, 0),
  }))
  const sortedTransactions = [...monthTransactions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  )
  const filtered = sortedTransactions.filter(
    (item) =>
      (filterType === 'all' || item.type === filterType) &&
      (filterCategory === 'all' || item.category === filterCategory) &&
      normalize(`${item.title} ${item.note} ${getCategory(item.category).name}`).includes(
        normalize(search),
      ),
  )
  if (sort === 'oldest') filtered.reverse()
  if (sort === 'highest') filtered.sort((a, b) => b.amount - a.amount)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 8)))
  const budgetPercent = Math.round((expense / data.profile.budget) * 100)
  const remaining = data.profile.budget - expense
  const viewLabel =
    view === 'notes'
      ? 'Ghi chú đã lưu'
      : view === 'reviews'
        ? 'Cảm nhận đã lưu'
        : NAVIGATION.find((item) => item.id === view)?.label || 'Cài đặt'
  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <AppProviders saveError={saveError} saving={saving}>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <div className="app-shell">
        {mobileMenu && (
          <button
            className="sidebar-scrim"
            aria-label="Đóng menu"
            onClick={() => setMobileMenu(false)}
          />
        )}
        <aside
          className={`sidebar sidebar-cute ${mobileMenu ? 'is-open' : ''}`}
          aria-label="Điều hướng chính"
          inert={isMobile && !mobileMenu}
        >
          <div className="sidebar-brand-row">
            <button
              className="brand-button"
              aria-label="mây - về tổng quan"
              onClick={() => navigate('overview')}
            >
              <Brand />
            </button>
            <button
              className="mobile-close icon-button"
              onClick={() => setMobileMenu(false)}
              aria-label="Đóng menu"
            >
              <X size={18} />
            </button>
          </div>
          <div className="workspace-label">
            <span>MỘT GÓC CHO MÌNH</span>
            <Sparkles size={12} aria-hidden="true" />
          </div>
          <nav>
            {NAVIGATION.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-item ${view === id || (['notes', 'reviews'].includes(view) && id === 'bags') ? 'active' : ''}`}
                data-section={id}
                title={label}
                onClick={() => navigate(id)}
                aria-label={label}
                aria-current={
                  view === id || (['notes', 'reviews'].includes(view) && id === 'bags')
                    ? 'page'
                    : undefined
                }
              >
                {(view === id || (['notes', 'reviews'].includes(view) && id === 'bags')) && (
                  <motion.span
                    className="nav-active-bg"
                    layoutId="nav-active"
                    transition={{ duration: 0.35, ease }}
                  />
                )}
                <span className="sidebar-nav-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="nav-label">{label}</span>
                {id === 'bags' && bags.some((bag) => bag.status === 'active') && (
                  <span className="nav-count" aria-hidden="true" title="Túi chi tiêu đang mở">
                    {bags.filter((bag) => bag.status === 'active').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-prompt">
              <div className="prompt-art">
                <SidebarArt />
              </div>
              <h3>Tích nhỏ, thành điều lớn.</h3>
              <p>
                Một thói quen nhỏ hôm nay.
                <br />
                Một tương lai nhẹ nhàng hơn.
              </p>
              <button onClick={() => setModal({ type: 'help' })}>
                Cùng mây bắt đầu <ArrowUpRight size={14} />
              </button>
            </div>
            <button
              className={`nav-item settings-nav ${view === 'settings' ? 'active' : ''}`}
              data-section="settings"
              aria-label="Cài đặt"
              aria-current={view === 'settings' ? 'page' : undefined}
              onClick={() => navigate('settings')}
            >
              {view === 'settings' && (
                <motion.span
                  className="nav-active-bg"
                  layoutId="nav-active"
                  transition={{ duration: 0.35, ease }}
                />
              )}
              <span className="sidebar-nav-icon" aria-hidden="true">
                <Settings2 size={18} strokeWidth={1.8} />
              </span>
              <span className="nav-label">Cài đặt</span>
            </button>
            <div className="sidebar-signature">
              <span className="online-dot" />
              Không gian chi tiêu cá nhân
              <Heart size={11} />
            </div>
          </div>
        </aside>
        <div className="app-body">
          <header className="topbar">
            <div className="breadcrumb">
              <button
                className="mobile-menu icon-button"
                aria-label="Mở menu"
                aria-expanded={mobileMenu}
                onClick={() => setMobileMenu(true)}
              >
                <Menu size={21} />
              </button>
              <span>Không gian cá nhân</span>
              <ChevronRight size={13} />
              <strong>{viewLabel}</strong>
            </div>
            <div className="topbar-actions">
              <label className="global-search">
                <Search size={16} />
                <input
                  ref={searchRef}
                  aria-label="Tìm giao dịch"
                  placeholder="Tìm một giao dịch…"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setView('transactions')
                    setPage(1)
                  }}
                />
                <kbd>/</kbd>
              </label>
              <NotificationCenter
                data={data}
                storageError={storageError}
                onNavigate={openNotification}
              />
              <span className="topbar-divider" />
              <button
                className="profile-button"
                aria-label="Mở cài đặt cá nhân"
                onClick={() => navigate('settings')}
              >
                <span className="avatar">
                  {data.profile.name === 'bạn' ? 'M' : data.profile.name.charAt(0).toUpperCase()}
                </span>
                <ChevronDown size={13} />
              </button>
            </div>
          </header>
          <main id="main-content" tabIndex="-1">
            <div
              className={
                view === 'categories'
                  ? 'page-heading categories-page-heading'
                  : view === 'transactions'
                    ? 'page-heading history-page-heading'
                    : view === 'overview'
                      ? 'page-heading overview-page-heading'
                      : view === 'settings'
                        ? 'page-heading settings-page-heading'
                        : view === 'bags'
                          ? `page-heading bags-page-heading ${bags.some((bag) => bag.id === selectedBagId) ? 'is-bag-detail' : ''}`
                          : view === 'reviews'
                            ? 'page-heading worth-page-heading'
                            : view === 'notes'
                              ? 'page-heading notes-page-heading'
                              : 'page-heading'
              }
            >
              <div>
                <div className="greeting">
                  <Sun size={15} /> Chào {data.profile.name}, một ngày thật nhẹ nhàng
                  <span className="greeting-dot">✧</span>
                  {data.isDemo && (
                    <button className="demo-tag" onClick={() => setModal({ type: 'welcome' })}>
                      Dữ liệu mẫu
                    </button>
                  )}
                </div>
                <h1>{TITLES[view][0]}</h1>
                <p>
                  {['notes', 'reviews'].includes(view) ? (
                    <button
                      className={view === 'notes' ? 'notes-parent-link' : 'worth-parent-link'}
                      onClick={() => navigate('bags')}
                    >
                      <ChevronLeft size={13} /> Túi chi tiêu
                    </button>
                  ) : (
                    TITLES[view][1]
                  )}
                </p>
              </div>
              <div className="page-actions">
                {!['notes', 'settings', 'bags'].includes(view) && (
                  <MonthPicker
                    value={month}
                    onChange={(value) => {
                      setMonth(value)
                      setPage(1)
                    }}
                  />
                )}
                <button
                  className="button primary add-button"
                  disabled={storageBlocked}
                  aria-label={
                    view === 'notes'
                      ? 'Viết ghi chú'
                      : view === 'bags'
                        ? 'Tạo túi'
                        : 'Thêm giao dịch'
                  }
                  onClick={
                    view === 'notes'
                      ? () => setModal({ type: 'note' })
                      : view === 'bags'
                        ? createBag
                        : addTransaction
                  }
                >
                  <Plus size={17} />
                  <span>
                    {view === 'notes'
                      ? 'Viết ghi chú'
                      : view === 'bags'
                        ? 'Tạo túi'
                        : 'Thêm giao dịch'}
                  </span>
                </button>
              </div>
            </div>
            {(storageError || saveError) && (
              <div className="storage-alert" role="alert">
                <CircleHelp size={18} />
                <span>{storageError || saveError}</span>
                {recovery && storageBlocked && (
                  <button onClick={recovery.downloadOriginal}>Tải bản gốc</button>
                )}
                {storageError ? (
                  <button onClick={() => navigate('settings')}>Sao lưu dữ liệu</button>
                ) : (
                  <button onClick={clearSaveError}>Đã hiểu</button>
                )}
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                className="page-content"
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                transition={{ duration: 0.3, ease }}
              >
                {view === 'overview' && (
                  <div className="overview-workspace">
                    <Stats
                      income={income}
                      expense={expense}
                      previousExpense={previousExpense}
                      budget={data.profile.budget}
                      transactionCount={monthTransactions.length}
                    />
                    <div className="dashboard-columns">
                      <div className="dashboard-main">
                        <section className="panel chart-panel">
                          <div className="panel-heading">
                            <div>
                              <h2>
                                Dòng chảy chi tiêu <span className="subtle-dot" />
                              </h2>
                              <p>Mỗi ngày một chút, nhìn lại cả tháng.</p>
                            </div>
                            <div className="overview-chart-corner">
                              <OverviewArt variant="cloud" className="overview-cloud-art" />
                              <span className="chart-legend">
                                <i /> Chi tiêu
                              </span>
                            </div>
                          </div>
                          <div className="chart-summary">
                            <strong>{money(expense)}</strong>
                            <span>trong tháng {monthNumber}</span>
                            <span className="chart-period">
                              01 — {new Date(year, monthNumber, 0).getDate()} THÁNG {monthNumber}
                            </span>
                          </div>
                          <SpendingChart
                            key={month}
                            transactions={monthTransactions}
                            month={month}
                          />
                        </section>
                        <section className="panel recent-panel">
                          <div className="panel-heading">
                            <div className="heading-with-count">
                              <OverviewArt variant="receipt" className="overview-heading-art" />
                              <h2>Giao dịch gần đây</h2>
                              <span className="count-badge">{monthTransactions.length}</span>
                            </div>
                            <button
                              className="text-button"
                              onClick={() => navigate('transactions')}
                            >
                              Xem tất cả <ArrowRight size={14} />
                            </button>
                          </div>
                          <TransactionList
                            transactions={sortedTransactions.slice(0, 5)}
                            onEdit={editTransaction}
                            onAdd={addTransaction}
                            small
                          />
                        </section>
                        <section className="category-strip">
                          <div className="section-heading">
                            <h2>Chi tiêu theo cách của bạn</h2>
                            <button className="text-button" onClick={() => navigate('categories')}>
                              Tất cả danh mục <ArrowRight size={14} />
                            </button>
                          </div>
                          <div className="quick-categories">
                            {CATEGORIES.slice(0, 5).map((category) => (
                              <button
                                key={category.id}
                                style={{
                                  '--quick-tint': category.background,
                                  '--quick-accent': category.color,
                                }}
                                onClick={() =>
                                  setModal({ type: 'transaction', category: category.id })
                                }
                              >
                                <span style={{ background: category.background }}>
                                  <CategoryArt category={category.id} size={58} />
                                </span>
                                <strong>{category.name}</strong>
                                <span className="quick-category-plus">
                                  <Plus size={13} />
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>
                      </div>
                      <div className="dashboard-side">
                        <CategoryDonut
                          totals={totals}
                          expense={expense}
                          onCategory={categoryFilter}
                        />
                        <section className="panel budget-panel">
                          <div className="panel-heading">
                            <div className="overview-budget-intro">
                              <OverviewArt variant="jar" className="overview-budget-art" />
                              <div>
                                <span>TÍCH TỪNG CHÚT NHỎ</span>
                                <h2>Ngân sách tháng</h2>
                              </div>
                            </div>
                            <button
                              className="icon-button"
                              aria-label="Điều chỉnh ngân sách tháng"
                              onClick={() => navigate('settings')}
                            >
                              <SlidersHorizontal size={16} />
                            </button>
                          </div>
                          <div className="budget-numbers">
                            <strong>{compactMoney(expense)}</strong>
                            <span>/ {compactMoney(data.profile.budget)}</span>
                            <span className={budgetPercent > 100 ? 'over-budget' : ''}>
                              {budgetPercent}%
                            </span>
                          </div>
                          <div
                            className={`progress-track ${budgetPercent > 100 ? 'over' : ''}`}
                            role="progressbar"
                            aria-label="Ngân sách đã sử dụng"
                            aria-valuenow={Math.min(budgetPercent, 100)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuetext={`Đã sử dụng ${budgetPercent}% ngân sách`}
                          >
                            <motion.span
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, budgetPercent)}%` }}
                              transition={{ duration: 0.8, ease }}
                            />
                          </div>
                          <p>
                            {remaining >= 0 ? (
                              <>
                                <span className="online-dot" /> Còn{' '}
                                <strong>{money(remaining)}</strong> để chi tiêu.
                              </>
                            ) : (
                              <>
                                <span className="over-dot" /> Vượt ngân sách{' '}
                                <strong>{money(-remaining)}</strong>.
                              </>
                            )}
                          </p>
                        </section>
                        <button className="overview-bags-card" onClick={() => navigate('bags')}>
                          <BagArt />
                          <span>
                            <strong>Túi chi tiêu</strong>
                            <span>
                              {bags.some((bag) => bag.status === 'active')
                                ? `${bags.filter((bag) => bag.status === 'active').length} dịp đang được chăm chút`
                                : 'Gom khoản chi cho từng dịp riêng'}
                            </span>
                          </span>
                          <ArrowUpRight size={16} />
                        </button>
                        <div className="little-message">
                          <OverviewArt variant="flower" className="overview-message-art" />
                          <p>
                            Chi tiêu thông minh.
                            <br />
                            Sống theo cách mình muốn.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {view === 'transactions' && (
                  <div className="history-workspace">
                    <HistoryOverview
                      month={month}
                      transactions={monthTransactions}
                      income={income}
                      expense={expense}
                    />
                    <section className="panel history-panel">
                      <div className="history-control-deck">
                        <div className="history-toolbar">
                          <div className="filter-tabs" role="group" aria-label="Loại giao dịch">
                            {[
                              ['all', 'Tất cả'],
                              ['expense', 'Khoản chi'],
                              ['income', 'Khoản thu'],
                            ].map(([id, label]) => (
                              <button
                                key={id}
                                className={filterType === id ? 'active' : ''}
                                aria-label={label}
                                aria-pressed={filterType === id}
                                onClick={() => {
                                  setFilterType(id)
                                  setPage(1)
                                }}
                              >
                                <span className="history-type-icon" aria-hidden="true">
                                  {id === 'all' ? (
                                    <Wallet size={14} />
                                  ) : id === 'income' ? (
                                    <ArrowDownLeft size={14} />
                                  ) : (
                                    <ArrowUpRight size={14} />
                                  )}
                                </span>
                                {label}
                                <span className="history-type-count" aria-hidden="true">
                                  {id === 'all'
                                    ? monthTransactions.length
                                    : monthTransactions.filter((item) => item.type === id).length}
                                </span>
                              </button>
                            ))}
                          </div>
                          <div className="history-filters history-custom-filters">
                            <FilterSelect
                              label="Lọc danh mục"
                              caption="DANH MỤC"
                              value={filterCategory}
                              options={CATEGORY_FILTER_OPTIONS}
                              onChange={(value) => {
                                setFilterCategory(value)
                                setPage(1)
                              }}
                            />
                            <FilterSelect
                              label="Sắp xếp giao dịch"
                              caption="SẮP XẾP THEO"
                              value={sort}
                              options={SORT_OPTIONS}
                              onChange={(value) => {
                                setSort(value)
                                setPage(1)
                              }}
                            />
                            <button
                              className="button secondary export-button"
                              aria-label="Xuất CSV"
                              onClick={() => {
                                exportCSV(filtered)
                                notify(`Đã xuất ${filtered.length} giao dịch`)
                              }}
                            >
                              <Download size={15} />
                              <span>Xuất CSV</span>
                            </button>
                          </div>
                        </div>
                        <div className="history-search">
                          <Search size={17} />
                          <input
                            aria-label="Tìm trong lịch sử giao dịch"
                            value={search}
                            onChange={(event) => {
                              setSearch(event.target.value)
                              setPage(1)
                            }}
                            placeholder="Tìm tên giao dịch, ghi chú, danh mục…"
                          />
                          {(search || filterCategory !== 'all' || filterType !== 'all') && (
                            <button
                              className="text-button"
                              aria-label="Xóa bộ lọc"
                              onClick={() => {
                                setSearch('')
                                setFilterCategory('all')
                                setFilterType('all')
                                setPage(1)
                              }}
                            >
                              <X size={13} /> Xóa bộ lọc
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="history-ledger-section">
                        <div className="history-results-heading">
                          <div>
                            <BookOpen size={16} />
                            <h2>Nhật ký giao dịch</h2>
                            <span>{filtered.length}</span>
                          </div>
                          <span>
                            {search || filterCategory !== 'all' || filterType !== 'all'
                              ? 'Kết quả đang lọc'
                              : sort === 'highest'
                                ? 'Xếp theo số tiền'
                                : 'Ghi chép theo ngày'}
                          </span>
                        </div>
                        <TransactionList
                          transactions={filtered.slice((currentPage - 1) * 8, currentPage * 8)}
                          total={filtered.length}
                          hasFilters={Boolean(
                            search || filterType !== 'all' || filterCategory !== 'all',
                          )}
                          onEdit={editTransaction}
                          onAdd={addTransaction}
                          page={currentPage}
                          onPage={setPage}
                          ledger
                          groupByDate={sort !== 'highest'}
                        />
                      </div>
                    </section>
                  </div>
                )}
                {view === 'categories' && (
                  <CategoriesView
                    categories={totals}
                    budgets={data.budgets}
                    totalBudget={data.profile.budget}
                    spent={expense}
                    transactions={expenses}
                    month={month}
                    onEditBudget={(category) => setModal({ type: 'budget', category })}
                    onEditTotalBudget={() => navigate('settings')}
                    onViewTransactions={categoryFilter}
                  />
                )}
                {view === 'bags' && (
                  <BagsView
                    bags={bags}
                    isMobile={isMobile}
                    transactions={data.transactions}
                    selectedId={selectedBagId}
                    onSelect={setSelectedBagId}
                    onCreate={createBag}
                    onEdit={(bag) => setModal({ type: 'bag', bag })}
                    onStatus={(bag) =>
                      saveData(
                        {
                          ...data,
                          bags: bags.map((item) =>
                            item.id === bag.id
                              ? { ...item, status: item.status === 'active' ? 'done' : 'active' }
                              : item,
                          ),
                        },
                        bag.status === 'active' ? 'Đã khép lại dịp này' : 'Đã mở lại túi',
                      )
                    }
                    onPick={(bag) => setModal({ type: 'bag-transactions', bag })}
                    onAddExpense={(bag) => setModal({ type: 'transaction', bagId: bag.id })}
                    onEditTransaction={editTransaction}
                    onUnlink={(transaction) =>
                      saveData(
                        {
                          ...data,
                          transactions: data.transactions.map((item) =>
                            item.id === transaction.id ? setTransactionBag(item, null) : item,
                          ),
                        },
                        'Đã bỏ khỏi túi, giao dịch vẫn được giữ',
                      )
                    }
                    onOpenNotes={() => navigate('notes')}
                    onOpenReviews={() => navigate('reviews')}
                  />
                )}
                {view === 'reviews' && (
                  <WorthView
                    key={month}
                    transactions={monthTransactions}
                    month={month}
                    onRate={rateTransaction}
                    onReason={(transaction) => setModal({ type: 'review', transaction })}
                    onEditTransaction={editTransaction}
                    onAdd={addTransaction}
                    onOpenNotes={() => navigate('notes')}
                  />
                )}
                {view === 'notes' && (
                  <NotesView
                    notes={data.notes}
                    transactions={sortedTransactions}
                    month={month}
                    onMonthChange={setMonth}
                    onAdd={() => setModal({ type: 'note' })}
                    onEdit={editNote}
                    onPin={pinNote}
                    onEditTransaction={editTransaction}
                  />
                )}
                {view === 'settings' && (
                  <SettingsView
                    data={data}
                    dataRaw={raw}
                    storageBlocked={storageBlocked}
                    recovery={recovery}
                    onSave={saveData}
                    onRestore={(restored, base, baseRaw) =>
                      saveData(restored, 'Đã khôi phục dữ liệu', {
                        replace: true,
                        recover: storageBlocked,
                        base,
                        baseRaw,
                      })
                    }
                    onStart={() => setModal({ type: 'welcome' })}
                    onCategories={() => navigate('categories')}
                    notify={notify}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <footer className="footer">
              <span>
                Được chăm chút bởi <span className="footer-brand">mây.</span>
                <span className="footer-separator">/</span>Nhẹ ghi chép, nhẹ âu lo.
              </span>
              <span>
                {data.isDemo ? (
                  <button onClick={() => setModal({ type: 'welcome' })}>
                    <span className="demo-dot" />
                    Dữ liệu mẫu <ArrowUpRight size={11} />
                  </button>
                ) : (
                  <>
                    <CheckCheck size={12} /> Dữ liệu trên thiết bị
                  </>
                )}
                <span className="footer-separator">·</span>
                <span className="footer-date">{today}</span>
              </span>
            </footer>
          </main>
        </div>
      </div>
      {modal?.type === 'transaction' && (
        <TransactionDialog
          transaction={modal.transaction}
          initialCategory={modal.category}
          initialBagId={modal.bagId}
          bags={bags}
          onClose={() => setModal(null)}
          onSave={async (transaction) => {
            const existing = data.transactions.some((item) => item.id === transaction.id)
            const saved = await saveModalData(
              {
                ...data,
                transactions: existing
                  ? data.transactions.map((item) =>
                      item.id === transaction.id ? transaction : item,
                    )
                  : [transaction, ...data.transactions],
              },
              existing ? 'Đã cập nhật giao dịch' : 'Đã lưu một giao dịch mới',
            )
            if (!saved) return
            const savedTransaction = saved.transactions.find((item) => item.id === transaction.id)
            if (savedTransaction) setMonth(savedTransaction.date.slice(0, 7))
            setModal(null)
          }}
          onDelete={async (id) => {
            const saved = await saveModalData(
              { ...data, transactions: data.transactions.filter((item) => item.id !== id) },
              'Đã xóa giao dịch',
            )
            if (!saved) return
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'bag' && (
        <BagDialog
          bag={modal.bag}
          onClose={() => setModal(null)}
          onSave={async (bag) => {
            const saved = await saveModalData(
              {
                ...data,
                bags: bags.some((item) => item.id === bag.id)
                  ? bags.map((item) => (item.id === bag.id ? bag : item))
                  : [bag, ...bags],
              },
              modal.bag ? 'Đã cập nhật chiếc túi' : 'Chiếc túi mới đã sẵn sàng',
            )
            if (!saved) return
            setSelectedBagId(bag.id)
            setView('bags')
            setModal(null)
          }}
          onDelete={async (id) => {
            const saved = await saveModalData(
              removeBag(data, id),
              'Đã xóa túi, các giao dịch vẫn được giữ',
            )
            if (!saved) return
            setSelectedBagId(null)
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'bag-transactions' && (
        <BagTransactionsDialog
          bag={modal.bag}
          transactions={data.transactions}
          onClose={() => setModal(null)}
          onSave={async (ids) => {
            const saved = await saveModalData(
              {
                ...data,
                transactions: linkBagTransactions(data.transactions, modal.bag.id, ids),
              },
              'Đã cập nhật các khoản trong túi',
            )
            if (!saved) return
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'review' && (
        <ReviewDialog
          transaction={modal.transaction}
          onClose={() => setModal(null)}
          onSave={async (review) => {
            const saved = await rateTransaction(modal.transaction.id, review, {
              base: modal.base,
              baseRaw: modal.baseRaw,
            })
            if (!saved) return
            setModal(null)
          }}
          onClear={async () => {
            const saved = await rateTransaction(modal.transaction.id, null, {
              base: modal.base,
              baseRaw: modal.baseRaw,
            })
            if (!saved) return
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'note' && (
        <NoteDialog
          note={modal.note}
          onClose={() => setModal(null)}
          onSave={async (note) => {
            const saved = await saveModalData(
              {
                ...data,
                notes: data.notes.some((item) => item.id === note.id)
                  ? data.notes.map((item) => (item.id === note.id ? note : item))
                  : [note, ...data.notes],
              },
              'Đã lưu ghi chú của bạn',
            )
            if (!saved) return
            setModal(null)
          }}
          onDelete={async (id) => {
            const saved = await saveModalData(
              { ...data, notes: data.notes.filter((item) => item.id !== id) },
              'Đã xóa ghi chú',
            )
            if (!saved) return
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'budget' && (
        <BudgetDialog
          category={modal.category}
          budget={data.budgets[modal.category.id]}
          spent={totals.find((category) => category.id === modal.category.id)?.spent || 0}
          month={month}
          onClose={() => setModal(null)}
          onSave={async (budget) => {
            const saved = await saveModalData(
              { ...data, budgets: { ...data.budgets, [modal.category.id]: budget } },
              'Đã cập nhật ngân sách danh mục',
            )
            if (!saved) return
            setModal(null)
          }}
        />
      )}
      {modal?.type === 'welcome' && (
        <WelcomeDialog onClose={() => setModal(null)} onStart={startOwnBook} />
      )}
      {modal?.type === 'help' && (
        <Dialog
          title="Chào bạn, mây đây."
          subtitle="Quản lý chi tiêu có thể là một điều thật nhẹ nhàng."
          onClose={() => setModal(null)}
        >
          <div className="help-steps">
            {[
              [
                Wallet,
                'Ghi lại khoản thu, chi',
                'Nhấn “Thêm giao dịch”, chọn danh mục và lưu thêm một dòng ghi chú.',
              ],
              [
                Tags,
                'Đặt ngân sách vừa sức',
                'Điều chỉnh giới hạn cho từng danh mục và theo dõi tiến độ hàng tháng.',
              ],
              [
                ShoppingBag,
                'Một chiếc túi cho từng dịp',
                'Tạo túi cho chuyến đi, quà tặng hoặc góc nhà rồi gom những khoản chi liên quan để theo dõi ngân sách.',
              ],
            ].map(([Icon, title, description]) => (
              <div key={title}>
                <span>
                  <Icon size={21} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="dialog-actions">
            {data.isDemo && (
              <button className="button secondary" onClick={() => setModal({ type: 'welcome' })}>
                Tạo sổ của tôi
              </button>
            )}
            <button className="button primary" onClick={() => setModal(null)}>
              Bắt đầu khám phá <ArrowRight size={16} />
            </button>
          </div>
        </Dialog>
      )}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="toast"
            style={{ x: '-50%' }}
            role="status"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span>
              <Check size={15} />
            </span>
            {toast}
            <button aria-label="Đóng thông báo" onClick={() => setToast('')}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AppProviders>
  )
}
