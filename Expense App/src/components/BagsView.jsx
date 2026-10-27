import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FolderHeart,
  Link2,
  PencilLine,
  Plus,
  Search,
  ShoppingBag,
  Smile,
  Unlink,
  X,
} from 'lucide-react'
import BagArt from './BagArt'
import CategoryArt from './CategoryArt'
import { BAG_STYLES, bagSummary, getBagColor } from '../bags'
import { CATEGORIES, compactMoney, formatDate, getCategory, money } from '../data'
import './BagsView.css'

const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')
const transition = { duration: 0.25, ease: [0.22, 1, 0.36, 1] }

function BudgetLine({ bag, summary }) {
  if (!bag.budget) return <span className="bag-no-budget">Chưa đặt ngân sách</span>
  return (
    <span className={`bag-budget-line ${summary.remaining < 0 ? 'is-over' : ''}`}>
      <span
        className="bag-budget-track"
        role="progressbar"
        aria-label={`Ngân sách túi ${bag.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(summary.percent, 100)}
        aria-valuetext={`Đã chi ${summary.percent}% ngân sách`}
      >
        <span style={{ width: `${Math.min(summary.percent, 100)}%` }} />
      </span>
      <span>
        {summary.remaining < 0
          ? `Vượt ${compactMoney(-summary.remaining)}`
          : summary.remaining === 0
            ? 'Vừa đủ ngân sách'
            : `Còn ${compactMoney(summary.remaining)}`}
      </span>
    </span>
  )
}

function BagDetail({
  bag,
  isMobile,
  transactions,
  onBack,
  onEdit,
  onStatus,
  onPick,
  onAddExpense,
  onEditTransaction,
  onUnlink,
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const summary = bagSummary(bag, transactions)
  const color = getBagColor(bag.color)
  const filtered = summary.expenses
    .filter((item) =>
      normalize(`${item.title} ${item.note} ${getCategory(item.category).name}`).includes(
        normalize(search),
      ),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 6)))
  const categories = CATEGORIES.map((category) => ({
    ...category,
    spent: summary.expenses
      .filter((item) => item.category === category.id)
      .reduce((sum, item) => sum + item.amount, 0),
  }))
    .filter((item) => item.spent)
    .sort((a, b) => b.spent - a.spent)
  return (
    <div
      className="bag-detail"
      style={{ '--bag-paper': color.paper, '--bag-ink': color.ink, '--bag-border': color.border }}
    >
      <div className="bag-detail-nav">
        <button className="bag-back" onClick={onBack}>
          <ArrowLeft size={14} /> Tất cả túi
        </button>
        <div>
          <button
            className="bag-small-button"
            aria-label={bag.status === 'done' ? 'Mở lại túi' : 'Đánh dấu hoàn tất'}
            onClick={() => onStatus(bag)}
          >
            <CircleCheck size={14} />
            {bag.status === 'done' ? 'Mở lại' : 'Hoàn tất'}
          </button>
          <button className="bag-small-button" onClick={() => onEdit(bag)}>
            <PencilLine size={13} /> Sửa túi
          </button>
        </div>
      </div>
      <div className="bag-detail-sheet">
        <section className="bag-detail-hero" aria-label={`Tổng kết túi ${bag.name}`}>
          <BagArt variant={bag.style} color={bag.color} />
          <div className="bag-detail-intro">
            <div className="bag-detail-copy">
              <span className="bag-stamp">
                {bag.status === 'done' ? (
                  <>
                    <Check size={10} /> ĐÃ HOÀN TẤT
                  </>
                ) : (
                  <>
                    <FolderHeart size={11} /> ĐANG MỞ
                  </>
                )}
              </span>
              <h2>{bag.name}</h2>
              <p>{bag.description || 'Những khoản chi cùng một câu chuyện.'}</p>
            </div>
            <div className="bag-detail-budget">
              <div className="bag-detail-numbers">
                <span>
                  Đã chi<strong>{money(summary.spent)}</strong>
                </span>
                <span>
                  Ngân sách<strong>{bag.budget ? money(bag.budget) : 'Chưa đặt'}</strong>
                </span>
              </div>
              <BudgetLine bag={bag} summary={summary} />
            </div>
          </div>
        </section>
        <div className="bag-detail-columns">
          <section className="bag-expenses-panel" aria-label="Giao dịch trong túi">
            <div className="bag-expenses-heading">
              <div>
                <h3>Những khoản trong túi</h3>
                <span>{summary.count} khoản chi</span>
              </div>
              <div>
                <button className="bag-small-button" onClick={() => onPick(bag)}>
                  <Link2 size={14} /> Chọn giao dịch
                </button>
                <button className="bag-small-button is-primary" onClick={() => onAddExpense(bag)}>
                  <Plus size={14} /> Thêm khoản chi
                </button>
              </div>
            </div>
            {summary.count > 0 && (
              <div className="bag-search bag-detail-search">
                <Search size={14} aria-hidden="true" />
                <input
                  aria-label="Tìm trong túi"
                  value={search}
                  placeholder="Tìm khoản chi trong túi…"
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                />
                {search && (
                  <button
                    aria-label="Xóa tìm kiếm trong túi"
                    onClick={() => {
                      setSearch('')
                      setPage(1)
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
            <div className="bag-expenses-list">
              {filtered.slice((currentPage - 1) * 6, currentPage * 6).map((item) => (
                <article className="bag-expense-row" key={item.id} data-transaction-id={item.id}>
                  <span
                    className="bag-expense-art"
                    style={{ background: getCategory(item.category).background }}
                  >
                    <CategoryArt category={item.category} size={31} />
                  </span>
                  <div className="bag-expense-copy">
                    <button
                      onClick={() => onEditTransaction(item)}
                      aria-label={`Sửa khoản chi ${item.title}`}
                    >
                      <strong>{item.title}</strong>
                      <ArrowUpRight size={11} />
                    </button>
                    <span>
                      <time dateTime={item.date}>{formatDate(item.date)}</time> ·{' '}
                      {getCategory(item.category).name}
                    </span>
                    {item.note && <p title={item.note}>{item.note}</p>}
                  </div>
                  <strong className="bag-expense-amount">{money(item.amount)}</strong>
                  <button
                    className="bag-unlink"
                    aria-label={`Bỏ ${item.title} khỏi túi`}
                    title="Bỏ khỏi túi, giữ giao dịch"
                    onClick={() => onUnlink(item)}
                  >
                    <Unlink size={14} />
                  </button>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <div className="bag-detail-empty">
                <ShoppingBag size={24} strokeWidth={1.4} />
                <h3>
                  {summary.count
                    ? 'Chưa tìm thấy khoản chi phù hợp'
                    : 'Chiếc túi đang chờ câu chuyện đầu tiên'}
                </h3>
                <p>
                  {summary.count
                    ? 'Thử một tên khác hoặc tìm theo danh mục.'
                    : 'Chọn giao dịch đã có hoặc thêm khoản chi mới cho dịp này.'}
                </p>
                {search && (
                  <button className="text-button" onClick={() => setSearch('')}>
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
            {filtered.length > 6 && (
              <div className="bag-list-pagination">
                <span>
                  {(currentPage - 1) * 6 + 1}–{Math.min(currentPage * 6, filtered.length)} /{' '}
                  {filtered.length} khoản
                </span>
                <div>
                  <button
                    className="icon-button"
                    aria-label="Trang trong túi trước"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Trang trong túi sau"
                    disabled={currentPage * 6 >= filtered.length}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </section>
          <details className="bag-category-panel" aria-label="Danh mục trong túi" open={!isMobile}>
            <summary>
              <span>
                <h3>Phân bổ danh mục</h3>
                <span>
                  {categories.length} danh mục · {summary.count} khoản chi
                </span>
              </span>
              <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className="bag-category-content">
              {categories.length ? (
                categories.map((category) => (
                  <div className="bag-category-row" key={category.id}>
                    <CategoryArt category={category.id} size={30} />
                    <span>
                      <span>
                        {category.name}
                        <strong>{money(category.spent)}</strong>
                      </span>
                      <span className="bag-category-track">
                        <span
                          style={{
                            width: `${(category.spent / summary.spent) * 100}%`,
                            background: category.color,
                          }}
                        />
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <p>Danh mục sẽ xuất hiện khi bạn thêm khoản chi vào túi.</p>
              )}
              <div className="bag-category-footnote">
                <span>{summary.count} khoản chi</span>
                <strong>{money(summary.spent)}</strong>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default function BagsView({
  bags,
  isMobile = false,
  transactions,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onStatus,
  onPick,
  onAddExpense,
  onEditTransaction,
  onUnlink,
  onOpenNotes,
  onOpenReviews,
}) {
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const selected = bags.find((bag) => bag.id === selectedId)
  const filtered = bags
    .filter(
      (bag) =>
        (status === 'all' || bag.status === status) &&
        normalize(`${bag.name} ${bag.description}`).includes(normalize(search)),
    )
    .sort((a, b) => b.createdAt - a.createdAt)
  const totalSpent = transactions
    .filter((item) => item.type === 'expense' && bags.some((bag) => bag.id === item.bagId))
    .reduce((sum, item) => sum + item.amount, 0)
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selected?.id || 'shelf'}
        className="bags-workspace"
        initial={{ opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={transition}
      >
        {selected ? (
          <BagDetail
            key={selected.id}
            bag={selected}
            isMobile={isMobile}
            transactions={transactions}
            onBack={() => onSelect(null)}
            onEdit={onEdit}
            onStatus={onStatus}
            onPick={onPick}
            onAddExpense={onAddExpense}
            onEditTransaction={onEditTransaction}
            onUnlink={onUnlink}
          />
        ) : (
          <>
            <section className="bags-collection" aria-label="Bộ sưu tập túi chi tiêu">
              <div className="bags-control-deck">
                <div className="bags-status-tabs" role="group" aria-label="Trạng thái túi">
                  {[
                    ['all', 'Tất cả'],
                    ['active', 'Đang mở'],
                    ['done', 'Hoàn tất'],
                  ].map(([id, label]) => (
                    <button key={id} aria-pressed={status === id} onClick={() => setStatus(id)}>
                      {label}
                      <span aria-hidden="true">
                        {id === 'all'
                          ? bags.length
                          : bags.filter((bag) => bag.status === id).length}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="bag-search">
                  <Search size={15} aria-hidden="true" />
                  <input
                    aria-label="Tìm túi chi tiêu"
                    value={search}
                    placeholder="Tìm một dịp, một chiếc túi…"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  {search && (
                    <button aria-label="Xóa tìm kiếm túi" onClick={() => setSearch('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="bags-total">
                  <span>Đã chi trong túi</span>
                  <strong>{money(totalSpent)}</strong>
                </div>
              </div>
              {filtered.length ? (
                <div className="bags-grid">
                  {filtered.map((bag, index) => {
                    const summary = bagSummary(bag, transactions)
                    const color = getBagColor(bag.color)
                    return (
                      <button
                        key={bag.id}
                        className="bag-card"
                        data-bag-id={bag.id}
                        style={{
                          '--bag-paper': color.paper,
                          '--bag-ink': color.ink,
                          '--bag-border': color.border,
                        }}
                        aria-label={`Mở túi ${bag.name}`}
                        onClick={() => onSelect(bag.id)}
                      >
                        <span className="bag-card-header">
                          <span className="bag-card-index" aria-hidden="true">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {BAG_STYLES.find((style) => style.id === bag.style)?.label}
                          </span>
                          <span className="bag-card-status">
                            {bag.status === 'done' ? (
                              <>
                                <Check size={10} />
                                Hoàn tất
                              </>
                            ) : (
                              <>
                                <span />
                                Đang mở
                              </>
                            )}
                          </span>
                        </span>
                        <span className="bag-card-main">
                          <span className="bag-card-copy">
                            <strong className="bag-card-name" title={bag.name}>
                              {bag.name}
                            </strong>
                            <span className="bag-card-description">
                              {bag.description || 'Một dịp riêng, những khoản chi chung.'}
                            </span>
                          </span>
                          <span className="bag-card-scene">
                            <BagArt variant={bag.style} color={bag.color} />
                          </span>
                        </span>
                        <span className="bag-card-footer">
                          <span className="bag-card-numbers">
                            <span>
                              <small>Đã chi · {summary.count} khoản</small>
                              <strong title={money(summary.spent)}>{money(summary.spent)}</strong>
                            </span>
                            <span>
                              <small>Ngân sách</small>
                              <span title={bag.budget ? money(bag.budget) : undefined}>
                                {bag.budget ? compactMoney(bag.budget) : 'Chưa đặt'}
                              </span>
                            </span>
                          </span>
                          <span className="bag-card-bottom">
                            <BudgetLine bag={bag} summary={summary} />
                            <span className="bag-card-open">
                              <ArrowUpRight size={15} />
                            </span>
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="bags-empty">
                  <BagArt color="lilac" variant="gift" />
                  <h2>
                    {bags.length
                      ? 'Chưa tìm thấy chiếc túi phù hợp'
                      : 'Dịp nào cũng có một chiếc túi riêng'}
                  </h2>
                  <p>
                    {bags.length
                      ? 'Thử một tên khác hoặc xem lại tất cả túi.'
                      : 'Chuyến đi, quà sinh nhật hay góc làm việc mới. Gom khoản chi về một chỗ để dễ theo dõi hơn.'}
                  </p>
                  {bags.length ? (
                    <button
                      className="bag-small-button"
                      onClick={() => {
                        setStatus('all')
                        setSearch('')
                      }}
                    >
                      <X size={13} /> Xóa bộ lọc túi
                    </button>
                  ) : (
                    <button className="button primary" onClick={onCreate}>
                      <Plus size={15} /> Tạo chiếc túi đầu tiên
                    </button>
                  )}
                </div>
              )}
            </section>
            <div className="bags-keepsakes">
              <span>Góc đã lưu</span>
              <button onClick={onOpenNotes}>
                <BookOpen size={13} /> Ghi chú đã lưu
              </button>
              <button onClick={onOpenReviews}>
                <Smile size={13} /> Cảm nhận đã lưu
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
