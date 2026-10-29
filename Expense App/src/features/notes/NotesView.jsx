import { useId, useRef, useState } from 'react'
import { isClosedMonth } from '../../shared/lib/closedMonths'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  PencilLine,
  Pin,
  Plus,
  Search,
  Wallet,
  X,
} from 'lucide-react'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import MonthPicker from '../../shared/components/MonthPicker'
import { formatDate, money } from '../../shared/storage/data'
import './NotesView.css'

const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pinned', label: 'Đã ghim', icon: Pin },
  { id: 'yellow', label: 'Vàng' },
  { id: 'purple', label: 'Tím' },
  { id: 'green', label: 'Xanh' },
]

function NotebookArt({ className = '' }) {
  return (
    <svg
      className={`notebook-art ${className}`}
      viewBox="0 0 184 132"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="93" cy="117" rx="65" ry="8" fill="#a58ac5" fillOpacity=".1" />
      <g transform="rotate(9 96 66)">
        <rect x="61" y="20" width="79" height="96" rx="8" fill="#e6dcf0" />
        <rect x="57" y="17" width="79" height="96" rx="8" fill="#f7f2fc" stroke="#cbb8dd" />
      </g>
      <g transform="rotate(-8 83 66)">
        <rect x="40" y="17" width="83" height="98" rx="8" fill="#fffcf5" stroke="#ded1b8" />
        <path d="M55 18v96" stroke="#e7bfc1" strokeOpacity=".65" />
        {[40, 53, 66, 79, 92].map((y) => (
          <path key={y} d={`M61 ${y}h48`} stroke="#e7dfd3" />
        ))}
        {[32, 49, 66, 83, 100].map((y) => (
          <g key={y}>
            <circle cx="46" cy={y} r="2" fill="#d5c4e2" />
            <path
              d={`M46 ${y}c-13 0-13-10-1-10`}
              stroke="#9b7bb5"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ))}
        <path
          d="m75 66 5 5 12-13"
          stroke="#8f77b1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="87" y="11" width="23" height="14" rx="2" fill="#e5d8f1" fillOpacity=".85" />
      </g>
      <g transform="rotate(33 135 84)">
        <rect x="131" y="47" width="9" height="61" rx="3" fill="#a58ac5" />
        <path d="M131 100h9v8l-4.5 10-4.5-10Z" fill="#d9c5a8" />
        <path d="m134 114 1.5 4 1.5-4" fill="#6b527b" />
        <path d="M133 52h5" stroke="#e9e0f3" strokeLinecap="round" />
      </g>
      <path
        d="m148 23 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"
        stroke="#a58ac5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m29 83 1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5Z" fill="#c4b3d5" />
      <path d="M158 92c8-1 14-8 14-15-9 1-14 7-14 15Z" fill="#c6d9c8" />
      <path d="M158 92c-6-4-8-10-6-16 7 4 9 10 6 16Z" fill="#9cbaa7" />
      <path d="M158 92v12" stroke="#829f8a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function NotebookCard({ note, onEdit, onPin }) {
  const titleId = useId()
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`note-card notebook-card ${note.color} ${note.pinned ? 'is-pinned' : ''}`}
      aria-labelledby={titleId}
    >
      <div className="notebook-card-top">
        <span className="notebook-card-date">
          <CalendarDays size={12} aria-hidden="true" />
          <time dateTime={note.date}>
            {formatDate(note.date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </time>
        </span>
        <button
          type="button"
          className={`notebook-pin ${note.pinned ? 'is-active' : ''}`}
          aria-label={note.pinned ? 'Bỏ ghim ghi chú' : 'Ghim ghi chú'}
          aria-pressed={Boolean(note.pinned)}
          title={note.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
          onClick={() => onPin(note.id)}
        >
          <Pin size={15} />
        </button>
      </div>
      <button
        className="note-body"
        aria-label={`Chỉnh sửa ghi chú ${note.title}`}
        onClick={() => onEdit(note)}
      >
        <span className="notebook-title-row">
          <h3 id={titleId}>{note.title}</h3>
          <PencilLine size={13} aria-hidden="true" />
        </span>
        <p>{note.content}</p>
      </button>
    </motion.article>
  )
}

export default function NotesView({
  notes,
  transactions,
  month,
  onMonthChange,
  onAdd,
  onEdit,
  onPin,
  onEditTransaction,
}) {
  const [tab, setTab] = useState('personal')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const searchRef = useRef(null)
  const id = useId()
  const pinnedCount = notes.filter((note) => note.pinned).length
  const transactionNotes = transactions.filter((transaction) => transaction.note?.trim())
  const term = normalize(query.trim())
  const personalNotes = [...notes]
    .filter(
      (note) =>
        (filter === 'all' || (filter === 'pinned' ? note.pinned : note.color === filter)) &&
        normalize(`${note.title} ${note.content}`).includes(term),
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date))
  const visibleTransactions = transactionNotes.filter((item) =>
    normalize(`${item.title} ${item.note}`).includes(term),
  )
  const visibleCount = tab === 'personal' ? personalNotes.length : visibleTransactions.length
  const totalCount = tab === 'personal' ? notes.length : transactionNotes.length
  const hasFilters = Boolean(query.trim() || (tab === 'personal' && filter !== 'all'))

  function resetFilters() {
    setQuery('')
    setFilter('all')
  }
  function changeTab(next) {
    setTab(next)
    resetFilters()
  }
  function handleTabKeys(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 'personal'
        : event.key === 'End'
          ? 'transactions'
          : tab === 'personal'
            ? 'transactions'
            : 'personal'
    changeTab(next)
    document.getElementById(`${id}-tab-${next}`)?.focus()
  }

  return (
    <div className="notes-workspace">
      <section className="notebook-library" aria-label="Thư viện ghi chú">
        <div className="notebook-toolbar">
          <div
            className="notebook-tabs"
            role="tablist"
            aria-label="Nguồn ghi chú"
            onKeyDown={handleTabKeys}
          >
            {[
              { key: 'personal', label: 'Ghi chú của tôi', count: notes.length, icon: BookOpen },
              {
                key: 'transactions',
                label: 'Từ giao dịch',
                count: transactionNotes.length,
                icon: Wallet,
              },
            ].map(({ key, label, count, icon: Icon }) => (
              <button
                key={key}
                id={`${id}-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={tab === key}
                aria-controls={`${id}-panel`}
                tabIndex={tab === key ? 0 : -1}
                onClick={() => changeTab(key)}
              >
                <Icon size={15} />
                <span>{label}</span>
                <span className="notebook-tab-count">{count}</span>
              </button>
            ))}
          </div>
          <label className="notebook-search">
            <Search size={16} aria-hidden="true" />
            <input
              ref={searchRef}
              aria-label="Tìm trong sổ ghi chú"
              placeholder="Tìm điều bạn muốn nhớ…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm ghi chú"
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        <div className="notebook-filter-row">
          {tab === 'personal' ? (
            <div className="notebook-filters" role="group" aria-label="Lọc ghi chú">
              {filters.map(({ id: key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={filter === key}
                  className={`notebook-filter ${key} ${filter === key ? 'is-active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {Icon ? (
                    <Icon size={13} />
                  ) : key !== 'all' ? (
                    <span className="notebook-filter-dot" aria-hidden="true">
                      {filter === key && <Check size={9} />}
                    </span>
                  ) : null}
                  {label}
                  {key === 'pinned' && pinnedCount > 0 && (
                    <span className="notebook-pin-count" aria-hidden="true">
                      {pinnedCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <MonthPicker value={month} onChange={onMonthChange} />
          )}
          <span
            className={`notebook-result-count ${hasFilters ? '' : 'sr-only'}`}
            role="status"
            aria-live="polite"
          >
            {hasFilters ? `${visibleCount} / ${totalCount}` : totalCount} ghi chú
          </span>
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`} tabIndex={0}>
          {visibleCount ? (
            tab === 'personal' ? (
              <div className="notes-grid notebook-grid">
                <AnimatePresence initial={false}>
                  {personalNotes.map((note) => (
                    <NotebookCard key={note.id} note={note} onEdit={onEdit} onPin={onPin} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="notebook-transaction-grid">
                {visibleTransactions.map((item) => (
                  <button
                    key={item.id}
                    className="notebook-transaction-card"
                    aria-label={`${isClosedMonth(item.date) ? 'Xem' : 'Chỉnh sửa'} giao dịch ${item.title}`}
                    onClick={() => onEditTransaction(item)}
                  >
                    <span className="notebook-transaction-heading">
                      <CategoryArt
                        category={item.type === 'income' ? 'income' : item.category}
                        size={38}
                      />
                      <span>
                        <strong>{item.title}</strong>
                        <time dateTime={item.date}>{formatDate(item.date)}</time>
                      </span>
                      <ArrowUpRight size={15} className="notebook-transaction-arrow" />
                    </span>
                    <span className="notebook-transaction-copy">{item.note}</span>
                    <span className="notebook-transaction-footer">
                      <span className={item.type === 'income' ? 'income-text' : ''}>
                        {item.type === 'income' ? '+' : '−'}
                        {money(item.amount)}
                      </span>
                      <span>
                        <PencilLine size={12} /> Ghi chú giao dịch
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="notebook-empty">
              {hasFilters ? (
                <span className="notebook-empty-icon">
                  <Search size={25} strokeWidth={1.5} />
                </span>
              ) : (
                <NotebookArt />
              )}
              <h3>
                {hasFilters
                  ? 'Chưa tìm thấy ghi chú phù hợp'
                  : tab === 'personal'
                    ? 'Bắt đầu bằng một điều muốn nhớ'
                    : 'Chưa có ghi chú giao dịch'}
              </h3>
              <p>
                {hasFilters
                  ? 'Thử một từ khóa khác hoặc đổi bộ lọc nhé.'
                  : tab === 'personal'
                    ? 'Một dự định, một lời nhắc. Trang giấy này dành cho bạn.'
                    : 'Thêm ghi chú khi tạo hoặc chỉnh sửa giao dịch trong tháng này.'}
              </p>
              {hasFilters ? (
                <button className="button secondary" onClick={resetFilters}>
                  Xóa bộ lọc
                </button>
              ) : tab === 'personal' ? (
                <button className="button primary" onClick={onAdd}>
                  <Plus size={15} /> Viết ghi chú đầu tiên
                </button>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
