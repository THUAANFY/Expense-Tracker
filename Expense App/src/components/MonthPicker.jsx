import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react'
import { monthKey } from '../data'
import './MonthPicker.css'

const MIN_YEAR = 1900
const MAX_YEAR = 2100
const YEAR_PAGE_SIZE = 12
const pageForYear = (year) =>
  MIN_YEAR + Math.floor((year - MIN_YEAR) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE

export default function MonthPicker({ value, onChange, label = 'Chọn tháng thống kê' }) {
  const [selectedYear, selectedMonth] = value.split('-').map(Number)
  const currentMonth = monthKey()
  const currentYear = Number(currentMonth.slice(0, 4))
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('months')
  const [displayedYear, setDisplayedYear] = useState(selectedYear)
  const [yearPage, setYearPage] = useState(pageForYear(selectedYear))
  const [focusIndex, setFocusIndex] = useState(selectedMonth - 1)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 304 })
  const pickerRef = useRef(null)
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const popoverId = useId()
  const titleId = useId()

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true })
  }, [])

  const updatePosition = useCallback(() => {
    const anchor = pickerRef.current?.getBoundingClientRect()
    const panel = popoverRef.current
    if (!anchor || !panel) return
    const styles = getComputedStyle(document.documentElement)
    const padding = parseFloat(styles.getPropertyValue('--popover-viewport-gap')) || 16
    const gap = parseFloat(styles.getPropertyValue('--popover-anchor-gap')) || 8
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = window.visualViewport?.height || window.innerHeight
    const width = Math.min(304, viewportWidth - padding * 2)
    const maxHeight = viewportHeight - padding * 2
    const height = Math.min(panel.scrollHeight, maxHeight)
    const left = Math.max(padding, Math.min(anchor.left, viewportWidth - width - padding))
    const below = anchor.bottom + gap
    const above = anchor.top - gap - height
    const top =
      below + height <= viewportHeight - padding
        ? below
        : above >= padding
          ? above
          : Math.max(padding, viewportHeight - height - padding)
    setPosition({ top, left, width, maxHeight })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    popoverRef.current?.querySelector('[data-index][tabindex="0"]')?.focus({ preventScroll: true })
  }, [open, mode, updatePosition])

  useEffect(() => {
    if (!open) return
    const outside = (event) => {
      if (!pickerRef.current?.contains(event.target) && !popoverRef.current?.contains(event.target))
        close(false)
    }
    const escape = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      close()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.visualViewport?.addEventListener('resize', updatePosition)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      window.visualViewport?.removeEventListener('resize', updatePosition)
    }
  }, [open, close, updatePosition])

  function toggle() {
    if (open) {
      close()
      return
    }
    setDisplayedYear(selectedYear)
    setYearPage(pageForYear(selectedYear))
    setFocusIndex(selectedMonth - 1)
    setMode('months')
    setOpen(true)
  }

  function shiftMonth(offset) {
    onChange(monthKey(new Date(selectedYear, selectedMonth - 1 + offset, 1)))
    close(false)
  }

  function switchMode() {
    if (mode === 'months') {
      const page = pageForYear(displayedYear)
      setYearPage(page)
      setFocusIndex(displayedYear - page)
      setMode('years')
    } else {
      setFocusIndex(selectedMonth - 1)
      setMode('months')
    }
  }

  function browse(offset) {
    if (mode === 'months') setDisplayedYear((year) => year + offset)
    else {
      setYearPage((year) => year + offset * YEAR_PAGE_SIZE)
      setFocusIndex(0)
    }
  }

  function choose(index) {
    if (mode === 'years') {
      setDisplayedYear(yearPage + index)
      setFocusIndex(selectedMonth - 1)
      setMode('months')
      return
    }
    onChange(`${displayedYear}-${String(index + 1).padStart(2, '0')}`)
    close()
  }

  function handleKeys(event) {
    if (event.key === 'Tab') {
      const controls = [...popoverRef.current.querySelectorAll('button:not(:disabled)')].filter(
        (button) => button.tabIndex >= 0,
      )
      if (
        (event.shiftKey && event.target === controls[0]) ||
        (!event.shiftKey && event.target === controls[controls.length - 1])
      ) {
        event.preventDefault()
        close()
      }
      return
    }
    const cell = event.target.closest('[data-index]')
    if (!cell) return
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }
    let next = Number(cell.dataset.index)
    if (event.key in offsets) next += offsets[event.key]
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = 11
    else return
    event.preventDefault()
    const lastIndex = mode === 'years' ? Math.min(11, MAX_YEAR - yearPage) : 11
    next = Math.max(0, Math.min(lastIndex, next))
    setFocusIndex(next)
    popoverRef.current.querySelector(`[data-index="${next}"]`)?.focus()
  }

  const previousDisabled = mode === 'months' ? displayedYear <= MIN_YEAR : yearPage <= MIN_YEAR
  const nextDisabled =
    mode === 'months' ? displayedYear >= MAX_YEAR : yearPage + YEAR_PAGE_SIZE > MAX_YEAR

  return (
    <>
      <div className={`month-picker ${open ? 'is-open' : ''}`} ref={pickerRef}>
        <button
          type="button"
          className="month-arrow"
          aria-label="Tháng trước"
          disabled={value <= '1900-01'}
          onClick={() => shiftMonth(-1)}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          ref={triggerRef}
          className="month-picker-trigger"
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          onClick={toggle}
        >
          <CalendarDays size={15} />
          <span>
            Tháng {String(selectedMonth).padStart(2, '0')}, {selectedYear}
          </span>
          <ChevronDown size={13} className="month-picker-chevron" />
        </button>
        <button
          type="button"
          className="month-arrow"
          aria-label="Tháng sau"
          disabled={value >= '2100-12'}
          onClick={() => shiftMonth(1)}
        >
          <ChevronRight size={15} />
        </button>
      </div>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id={popoverId}
              ref={popoverRef}
              className="month-popover"
              role="dialog"
              aria-labelledby={titleId}
              style={position}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              onKeyDown={handleKeys}
            >
              <div className="month-popover-caption">
                <span id={titleId}>
                  <CalendarDays size={14} /> CHỌN THÁNG & NĂM
                </span>
                <button
                  type="button"
                  className="month-popover-close"
                  aria-label="Đóng bộ chọn tháng"
                  onClick={() => close()}
                >
                  <X size={15} />
                </button>
              </div>
              <div className="month-popover-navigation">
                <button
                  type="button"
                  className="month-browse-arrow"
                  aria-label={mode === 'months' ? 'Năm trước' : '12 năm trước'}
                  disabled={previousDisabled}
                  onClick={() => browse(-1)}
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  className={`month-year-toggle ${mode === 'years' ? 'is-year-grid' : ''}`}
                  aria-label={mode === 'months' ? 'Chọn năm' : 'Quay lại chọn tháng'}
                  onClick={switchMode}
                >
                  {mode === 'months'
                    ? displayedYear
                    : `${yearPage} – ${Math.min(yearPage + 11, MAX_YEAR)}`}
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  className="month-browse-arrow"
                  aria-label={mode === 'months' ? 'Năm sau' : '12 năm sau'}
                  disabled={nextDisabled}
                  onClick={() => browse(1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
              <div
                className="month-options-grid"
                role="group"
                aria-label={mode === 'months' ? `Các tháng năm ${displayedYear}` : 'Danh sách năm'}
                key={mode}
              >
                {Array.from({ length: 12 }, (_, index) => {
                  const cellYear = yearPage + index
                  const key = `${displayedYear}-${String(index + 1).padStart(2, '0')}`
                  const selected = mode === 'months' ? key === value : cellYear === selectedYear
                  const current =
                    mode === 'months' ? key === currentMonth : cellYear === currentYear
                  return (
                    <button
                      type="button"
                      key={index}
                      data-index={index}
                      tabIndex={index === focusIndex ? 0 : -1}
                      disabled={mode === 'years' && cellYear > MAX_YEAR}
                      className={`month-option ${selected ? 'is-selected' : ''} ${current ? 'is-current' : ''}`}
                      aria-pressed={selected}
                      aria-current={current ? 'date' : undefined}
                      aria-label={
                        mode === 'months'
                          ? `Tháng ${index + 1} năm ${displayedYear}`
                          : `Năm ${cellYear}`
                      }
                      onFocus={() => setFocusIndex(index)}
                      onClick={() => choose(index)}
                    >
                      {mode === 'months' ? `Tháng ${index + 1}` : cellYear}
                    </button>
                  )
                })}
              </div>
              <div className="month-popover-footer">
                <span>
                  Đang chọn{' '}
                  <strong>
                    {String(selectedMonth).padStart(2, '0')}/{selectedYear}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onChange(currentMonth)
                    close()
                  }}
                >
                  <RotateCcw size={13} />
                  Tháng này
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
