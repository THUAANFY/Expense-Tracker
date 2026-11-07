import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import { formatDate, getCategory, money } from '../../shared/storage/data'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import JournalDeskArt from './JournalDeskArt'
import './OverviewJournalCorner.css'
import './FintechJournalCorner.css'

export default function OverviewJournalCorner({ expenses, month, readOnly, onOpen, onAdd }) {
  const decorId = useId().replaceAll(':', '')
  const { theme } = useAppearance()
  const dark = theme === 'dark'
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

  useEffect(() => {
    if (!dark) return
    const element = root.current
    let idleTimer
    const resume = () => {
      delete element.dataset.scrolling
      idleTimer = undefined
    }
    const scroll = () => {
      if (element.dataset.animate !== 'true') return
      // Pause filtered SVG motion without a React render or layout read on each scroll event.
      if (idleTimer === undefined) element.dataset.scrolling = 'true'
      clearTimeout(idleTimer)
      idleTimer = setTimeout(resume, 160)
    }
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', scroll)
      clearTimeout(idleTimer)
      resume()
    }
  }, [dark])

  return (
    <section
      className={`overview-journal-corner ${dark ? 'fintech-journal-corner' : ''}`}
      ref={root}
      data-animate={animate}
      aria-label="Góc mây ghi chép"
    >
      <JournalDeskArt />
      {largest ? (
        <button
          type="button"
          className={`journal-receipt ${dark ? 'fintech-journal-receipt' : ''} ${largest.amount >= 1e9 ? 'has-long-amount' : ''}`}
          aria-label={`Xem khoản chi lớn nhất: ${largest.title}`}
          onClick={() => onOpen(largest)}
        >
          {dark ? (
            <>
              <svg
                className="journal-receipt-wave"
                viewBox="0 0 240 90"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient
                    id={`${decorId}-receipt-wave`}
                    x1="0"
                    y1="90"
                    x2="240"
                    y2="10"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7652ed" stopOpacity="0" />
                    <stop offset="1" stopColor="#915aff" stopOpacity=".36" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 90c40 0 62-36 91-28s38 16 66-9S212 40 240 55v35Z"
                  fill={`url(#${decorId}-receipt-wave)`}
                />
                <path
                  d="M0 90c40 0 62-36 91-28s38 16 66-9S212 40 240 55"
                  stroke="#aa76ff"
                  strokeWidth=".8"
                  strokeOpacity=".55"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="journal-receipt-label">
                <span>
                  Khoản chi lớn nhất · Tháng {Number(month.slice(5))}/{month.slice(0, 4)}
                </span>
                <span className="journal-receipt-action" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </span>
              <span className="journal-receipt-body">
                <CategoryArt
                  category={largest.category}
                  size={46}
                  className="journal-category-art"
                />
                <span className="journal-entry-copy">
                  <strong className="journal-receipt-title" title={largest.title}>
                    {largest.title}
                  </strong>
                  <span className="journal-entry-meta">
                    {getCategory(largest.category).name} ·{' '}
                    {formatDate(largest.date, { day: '2-digit', month: '2-digit' })}
                  </span>
                </span>
                <strong className="journal-entry-amount">{money(largest.amount)}</strong>
              </span>
            </>
          ) : (
            <>
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
            </>
          )}
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
