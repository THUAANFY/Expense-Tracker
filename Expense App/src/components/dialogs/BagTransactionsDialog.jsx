import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'
import { formatDate, getCategory, money } from '../../data'
import '../BagDialogs.css'

const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')
const PAGE_SIZE = 8

export default function BagTransactionsDialog({ bag, transactions, onSave, onClose }) {
  const eligible = transactions.filter(
    (item) => item.type === 'expense' && (!item.bagId || item.bagId === bag.id),
  )
  const [selected, setSelected] = useState(
    () => new Set(eligible.filter((item) => item.bagId === bag.id).map((item) => item.id)),
  )
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const filtered = eligible
    .filter((item) =>
      normalize(
        `${item.title} ${item.note} ${item.date} ${getCategory(item.category).name}`,
      ).includes(normalize(search)),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const total = eligible
    .filter((item) => selected.has(item.id))
    .reduce((sum, item) => sum + item.amount, 0)
  return (
    <Dialog
      title="Gom khoản chi vào túi"
      subtitle={`Chọn cho “${bag.name}”. Chỉ hiện khoản chi chưa thuộc túi khác.`}
      className="bag-picker-dialog"
      onClose={onClose}
    >
      <form
        className="bag-picker-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSave([...selected])
        }}
      >
        <div className="bag-picker-body">
          <div className="bag-search">
            <Search size={15} aria-hidden="true" />
            <input
              aria-label="Tìm giao dịch để thêm vào túi"
              value={search}
              placeholder="Tìm tên, ghi chú, danh mục…"
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="bag-picker-list">
            {filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item) => (
              <label
                className={`bag-picker-row ${selected.has(item.id) ? 'is-selected' : ''}`}
                key={item.id}
              >
                <input
                  type="checkbox"
                  aria-label={item.title}
                  checked={selected.has(item.id)}
                  onChange={(event) =>
                    setSelected((previous) => {
                      const next = new Set(previous)
                      if (event.target.checked) next.add(item.id)
                      else next.delete(item.id)
                      return next
                    })
                  }
                />
                <span
                  className="bag-picker-art"
                  style={{ background: getCategory(item.category).background }}
                >
                  <CategoryArt category={item.category} size={29} />
                </span>
                <span className="bag-picker-copy">
                  <strong>{item.title}</strong>
                  <span>
                    {formatDate(item.date)} · {getCategory(item.category).name}
                  </span>
                </span>
                <strong>{money(item.amount)}</strong>
              </label>
            ))}
          </div>
          {!filtered.length && (
            <p className="bag-picker-empty">
              {eligible.length
                ? 'Chưa tìm thấy khoản chi phù hợp.'
                : 'Chưa có khoản chi để gom. Bạn có thể thêm khoản chi mới ngay trong túi.'}
            </p>
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="bag-picker-pagination">
              <span>
                {currentPage}/{Math.ceil(filtered.length / PAGE_SIZE)}
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label="Trang giao dịch trước"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Trang giao dịch sau"
                disabled={currentPage * PAGE_SIZE >= filtered.length}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="dialog-actions">
          <span className="bag-selection-total">
            {selected.size} khoản · <strong>{money(total)}</strong>
          </span>
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button type="submit" className="button primary">
            <Check size={14} /> Lưu vào túi
          </button>
        </div>
      </form>
    </Dialog>
  )
}
