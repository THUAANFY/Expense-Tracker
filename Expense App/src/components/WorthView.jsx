import { useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  MessageCircle,
  PencilLine,
  Plus,
  Search,
  Tags,
  X,
} from 'lucide-react'
import CategoryArt from './CategoryArt'
import MoodArt from './MoodArt'
import FilterSelect from './FilterSelect'
import { CATEGORIES, compactMoney, formatDate, getCategory, money } from '../data'
import { REVIEW_OPTIONS, summarizeReviews } from '../reviews'
import './WorthView.css'

const categories = [
  { value: 'all', label: 'Mọi danh mục', icon: Tags },
  ...CATEGORIES.map((category) => ({
    value: category.id,
    label: category.name,
    category: category.id,
    background: category.background,
  })),
]
const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')
const PAGE_SIZE = 6

export default function WorthView({
  transactions,
  month,
  onRate,
  onReason,
  onEditTransaction,
  onAdd,
  onOpenNotes,
}) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const expenses = transactions.filter(
    (item) => item.type === 'expense' && item.date.startsWith(month),
  )
  const summary = summarizeReviews(expenses)
  const progress = summary.total ? (summary.reviewed / summary.total) * 100 : 0
  const selectFilter = (value) => {
    setFilter(value)
    setPage(1)
  }
  const filtered = expenses
    .filter(
      (item) =>
        (filter === 'all' ||
          (filter === 'pending'
            ? !item.review
            : filter === 'reviewed'
              ? Boolean(item.review)
              : item.review?.rating === filter)) &&
        (category === 'all' || item.category === category) &&
        normalize(
          `${item.title} ${item.note} ${item.review?.note || ''} ${getCategory(item.category).name}`,
        ).includes(normalize(search)),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const hasFilters = filter !== 'all' || category !== 'all' || search
  const clearFilters = () => {
    setFilter('all')
    setSearch('')
    setCategory('all')
    setPage(1)
  }
  return (
    <div className="worth-workspace">
      <div className="worth-summary" role="group" aria-label="Lọc theo cảm nhận">
        {REVIEW_OPTIONS.map((option) => (
          <button
            key={option.id}
            data-mood={option.id}
            aria-pressed={filter === option.id}
            onClick={() => selectFilter(filter === option.id ? 'all' : option.id)}
          >
            <span className="worth-summary-sticker">
              <MoodArt mood={option.id} />
            </span>
            <span className="worth-summary-copy">
              <span className="worth-summary-name">{option.label}</span>
              <span className="worth-summary-tally">
                <strong>{summary[option.id].count}</strong>
                <span>khoản chi</span>
              </span>
            </span>
            <span className="worth-summary-amount" title={money(summary[option.id].amount)}>
              <span>{compactMoney(summary[option.id].amount)}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
            <span className="worth-summary-check" aria-hidden="true">
              <Check size={11} />
            </span>
          </button>
        ))}
      </div>
      <section className="worth-library" aria-label="Cảm nhận về các khoản chi">
        <div className="worth-library-heading">
          <div className="worth-library-title">
            <span aria-hidden="true">
              <Heart size={17} />
            </span>
            <div>
              <h2>Góc nhìn lại</h2>
              <p>Một chạm, một cảm nhận của bạn.</p>
            </div>
          </div>
          <div className="worth-progress">
            <span className="worth-progress-label">
              Đã nhìn lại{' '}
              <strong>
                {summary.reviewed}/{summary.total}
              </strong>{' '}
              khoản chi
            </span>
            <span
              className="worth-progress-track"
              role="progressbar"
              aria-label="Số khoản chi đã đánh giá"
              aria-valuemin={0}
              aria-valuemax={Math.max(1, summary.total)}
              aria-valuenow={summary.reviewed}
              aria-valuetext={`${summary.reviewed} trên ${summary.total} khoản chi`}
            >
              <span style={{ width: `${progress}%` }} />
            </span>
          </div>
        </div>
        <div className="worth-toolbar">
          <div className="worth-status-tabs" role="group" aria-label="Trạng thái đánh giá">
            {[
              ['all', 'Tất cả', summary.total],
              ['pending', 'Chưa đánh giá', summary.pending],
              ['reviewed', 'Đã đánh giá', summary.reviewed],
            ].map(([id, label, count]) => (
              <button
                key={id}
                aria-pressed={
                  id === 'reviewed' ? !['all', 'pending'].includes(filter) : filter === id
                }
                onClick={() => selectFilter(id)}
              >
                {label}
                <span aria-hidden="true">{count}</span>
              </button>
            ))}
          </div>
          <div className="worth-tools">
            <div className="worth-search">
              <Search size={15} aria-hidden="true" />
              <input
                aria-label="Tìm khoản chi để đánh giá"
                value={search}
                placeholder="Tìm khoản chi, lý do…"
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
              {search && (
                <button
                  aria-label="Xóa tìm kiếm đánh giá"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="worth-category">
              <FilterSelect
                label="Lọc danh mục đánh giá"
                caption="DANH MỤC"
                options={categories}
                value={category}
                onChange={(value) => {
                  setCategory(value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>
        {filtered.length ? (
          <>
            <div className="worth-list">
              {filtered
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((item) => {
                  const itemCategory = getCategory(item.category)
                  return (
                    <article
                      className="worth-row"
                      key={item.id}
                      data-transaction-id={item.id}
                      data-mood={item.review?.rating || 'pending'}
                      aria-label={`${item.title}, ${money(item.amount)}, ${formatDate(item.date)}`}
                    >
                      <div className="worth-transaction">
                        <span
                          className="worth-category-art"
                          style={{ background: itemCategory.background }}
                        >
                          <CategoryArt category={item.category} size={36} />
                        </span>
                        <div className="worth-transaction-copy">
                          <button
                            className="worth-transaction-title"
                            onClick={() => onEditTransaction(item)}
                            aria-label={`Sửa giao dịch ${item.title}`}
                          >
                            <strong title={item.title}>{item.title}</strong>
                            <ArrowUpRight size={12} aria-hidden="true" />
                          </button>
                          <div className="worth-transaction-meta">
                            <span>
                              <time dateTime={item.date}>{formatDate(item.date)}</time>
                              <span className="worth-category-name"> · {itemCategory.name}</span>
                            </span>
                            <strong>{money(item.amount)}</strong>
                          </div>
                          {item.review?.note && (
                            <p className="worth-reason" title={item.review.note}>
                              <MessageCircle size={11} aria-hidden="true" />
                              <span>{item.review.note}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="worth-row-actions">
                        <div
                          className="worth-rating-choices"
                          role="group"
                          aria-label={`Đánh giá ${item.title}`}
                        >
                          {REVIEW_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              data-mood={option.id}
                              aria-label={option.label}
                              aria-pressed={item.review?.rating === option.id}
                              onClick={() => {
                                if (item.review?.rating !== option.id)
                                  onRate(item.id, {
                                    rating: option.id,
                                    note: item.review?.note || '',
                                  })
                              }}
                            >
                              <MoodArt mood={option.id} />
                              <span>{option.label}</span>
                              {item.review?.rating === option.id && (
                                <Check
                                  className="worth-rating-check"
                                  size={10}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                        <button
                          className={`worth-reason-button ${item.review?.note ? 'has-reason' : ''}`}
                          aria-label={`${item.review ? 'Sửa cảm nhận' : 'Thêm lý do cho'} ${item.title}`}
                          title={item.review ? 'Sửa cảm nhận và lý do' : 'Thêm cảm nhận và lý do'}
                          onClick={() => onReason(item)}
                        >
                          <PencilLine size={15} />
                        </button>
                      </div>
                    </article>
                  )
                })}
            </div>
            <div className="worth-pagination">
              <span>
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} khoản chi
              </span>
              <div>
                <button
                  className="icon-button"
                  aria-label="Trang đánh giá trước"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={15} />
                </button>
                <span>
                  {currentPage}/{Math.ceil(filtered.length / PAGE_SIZE)}
                </span>
                <button
                  className="icon-button"
                  aria-label="Trang đánh giá sau"
                  disabled={currentPage * PAGE_SIZE >= filtered.length}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="worth-empty">
            <MoodArt mood={filter === 'regret' ? 'regret' : 'happy'} />
            <h3>
              {summary.total === 0
                ? 'Chờ một khoản chi để nhìn lại'
                : filter === 'pending' && !search && category === 'all'
                  ? 'Bạn đã nhìn lại hết rồi!'
                  : 'Chưa có khoản chi phù hợp'}
            </h3>
            <p>
              {summary.total === 0
                ? 'Thêm khoản chi, rồi chọn cảm nhận của riêng bạn.'
                : filter === 'pending' && !search && category === 'all'
                  ? 'Mọi cảm nhận đã được lưu. Bạn có thể xem lại hoặc đổi ý bất cứ lúc nào.'
                  : 'Tìm một từ khác hoặc đổi bộ lọc để xem thêm.'}
            </p>
            {summary.total === 0 ? (
              <button className="button secondary" onClick={onAdd}>
                <Plus size={14} /> Thêm khoản chi
              </button>
            ) : (
              hasFilters && (
                <button className="text-button" onClick={clearFilters}>
                  <X size={13} /> Xóa bộ lọc đánh giá
                </button>
              )
            )}
          </div>
        )}
        <div className="worth-library-footer">
          <span>
            <PencilLine size={13} aria-hidden="true" /> Thêm lý do bằng nút bút chì
          </span>
          <button className="worth-archive-button" onClick={onOpenNotes}>
            <BookOpen size={14} aria-hidden="true" /> Ghi chú đã lưu{' '}
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  )
}
