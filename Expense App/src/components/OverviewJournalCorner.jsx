import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { formatDate, getCategory, money } from '../data'
import JournalDeskArt from './JournalDeskArt'
import './OverviewJournalCorner.css'

export default function OverviewJournalCorner({ expenses, month, readOnly, onOpen, onAdd }) {
  const id = useId()
  const root = useRef(null)
  const [animate, setAnimate] = useState(false)
  const largest = expenses.reduce(
    (best, item) =>
      !best ||
      item.amount > best.amount ||
      (item.amount === best.amount &&
        (item.date > best.date || (item.date === best.date && item.createdAt > best.createdAt)))
        ? item
        : best,
    null,
  )

  useEffect(() => {
    let visible = false
    const update = () => setAnimate(visible && document.visibilityState === 'visible')
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.1 },
    )
    observer.observe(root.current)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <section
      className="overview-journal-corner"
      ref={root}
      data-animate={animate}
      aria-labelledby={id}
    >
      <h2 id={id}>Góc mây ghi chép</h2>
      <JournalDeskArt />
      {largest ? (
        <button
          type="button"
          className="journal-receipt"
          aria-label={`Xem khoản chi lớn nhất: ${largest.title}`}
          onClick={() => onOpen(largest)}
        >
          <span className="journal-receipt-label">
            Khoản chi lớn nhất · Tháng {Number(month.slice(5))}/{month.slice(0, 4)}
            <ArrowUpRight size={14} />
          </span>
          <strong className="journal-receipt-title">{largest.title}</strong>
          <span className="journal-receipt-detail">
            <span>
              {getCategory(largest.category).name} ·{' '}
              {formatDate(largest.date, { day: '2-digit', month: '2-digit' })}
            </span>
            <strong>{money(largest.amount)}</strong>
          </span>
        </button>
      ) : (
        <div className="journal-empty-note">
          <p>
            Chưa có khoản chi trong tháng này.
            <br />
            Mây đang chờ câu chuyện đầu tiên.
          </p>
          {!readOnly && (
            <button type="button" onClick={onAdd}>
              <Plus size={13} />
              Ghi một khoản chi
            </button>
          )}
        </div>
      )}
    </section>
  )
}
