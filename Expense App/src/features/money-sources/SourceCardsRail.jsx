import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SourceCardsRail({ sourceIds, children }) {
  const trackRef = useRef(null)
  const knownIds = useRef(new Set(sourceIds))
  const trackId = useId()
  const idsKey = JSON.stringify(sourceIds)
  const [position, setPosition] = useState({
    first: 1,
    last: sourceIds.length,
    overflow: false,
    previous: false,
    next: false,
  })
  const measure = useCallback(() => {
    const track = trackRef.current
    const firstCard = track?.firstElementChild
    if (!firstCard) return
    const styles = getComputedStyle(track)
    const gap = parseFloat(styles.columnGap) || 0
    const step = firstCard.getBoundingClientRect().width + gap
    const visible = parseInt(styles.getPropertyValue('--source-cards-visible'), 10) || 1
    const count = track.children.length
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth)
    const offset = Math.max(0, Math.min(track.scrollLeft, maximum))
    const first = Math.min(count, Math.round(offset / step) + 1)
    const next = {
      first,
      last: Math.min(count, first + visible - 1),
      overflow: maximum > 2,
      previous: offset > 2,
      next: maximum - offset > 2,
    }
    setPosition((previous) =>
      Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next,
    )
  }, [])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ids = JSON.parse(idsKey)
    const added = ids.find((id) => !knownIds.current.has(id))
    knownIds.current = new Set(ids)
    if (added) {
      const card = [...track.children].find((element) => element.dataset.sourceId === added)
      if (card) track.scrollTo({ left: card.offsetLeft, behavior: 'auto' })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    for (const card of track.children) observer.observe(card)
    return () => observer.disconnect()
  }, [idsKey, measure])

  function scrollTo(left) {
    trackRef.current?.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }
  function move(direction) {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!card) return
    const step =
      card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0)
    scrollTo((Math.round(track.scrollLeft / step) + direction) * step)
  }
  function handleKeys(event) {
    if (event.target !== event.currentTarget) return
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') scrollTo(0)
    else if (event.key === 'End') scrollTo(trackRef.current.scrollWidth)
    else move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return (
    <section className="source-cards-browser" aria-label="Danh sách nguồn tiền">
      {position.overflow && (
        <div className="source-cards-navigation">
          <span
            className="source-cards-range"
            id={`${trackId}-range`}
            aria-live="polite"
            aria-atomic="true"
          >
            <span>Đang xem</span>
            <strong>
              {position.first === position.last
                ? position.first
                : `${position.first}–${position.last}`}
            </strong>
            <span>/ {sourceIds.length} nguồn</span>
          </span>
          <div className="source-cards-arrows">
            <button
              type="button"
              aria-label="Xem nguồn tiền trước"
              aria-controls={trackId}
              disabled={!position.previous}
              onClick={() => move(-1)}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Xem nguồn tiền tiếp theo"
              aria-controls={trackId}
              disabled={!position.next}
              onClick={() => move(1)}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      <div
        className="source-cards"
        id={trackId}
        ref={trackRef}
        role="group"
        aria-label="Các thẻ nguồn tiền"
        aria-describedby={position.overflow ? `${trackId}-range` : undefined}
        tabIndex={position.overflow ? 0 : -1}
        onScroll={measure}
        onKeyDown={handleKeys}
      >
        {children}
      </div>
    </section>
  )
}
