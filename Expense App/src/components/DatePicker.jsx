import { useId, useLayoutEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react'
import { dateKey, formatDate } from '../data'
import { FieldPopover, useFieldPopover } from './FieldPopover'
import './MonthPicker.css'

const MIN_DATE = '1900-01-01'
const MAX_DATE = '2100-12-31'
const parseDate = (value) => new Date(`${value}T12:00:00`)
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
const pageForYear = (year) => 1900 + Math.floor((year - 1900) / 12) * 12
const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export default function DatePicker({ value, onChange, labelId, name = 'date', min = MIN_DATE }) {
  const selected = parseDate(value)
  const [year, setYear] = useState(selected.getFullYear())
  const [month, setMonth] = useState(selected.getMonth())
  const [mode, setMode] = useState('days')
  const [yearPage, setYearPage] = useState(pageForYear(selected.getFullYear()))
  const [focusedDate, setFocusedDate] = useState(value)
  const [focusIndex, setFocusIndex] = useState(selected.getMonth())
  const pendingFocus = useRef(false)
  const contentRef = useRef(null)
  const popover = useFieldPopover()
  const popoverId = useId()
  const valueId = useId()
  const today = dateKey()
  const offset = (new Date(year, month, 1, 12).getDay() + 6) % 7
  const dates = Array.from({ length: 42 }, (_, index) =>
    dateKey(new Date(year, month, index - offset + 1, 12)),
  )

  useLayoutEffect(() => {
    if (popover.open) popover.updatePosition()
  }, [popover.open, popover.updatePosition, mode, year, month])
  useLayoutEffect(() => {
    if (!popover.open || !pendingFocus.current) return
    pendingFocus.current = false
    const selector =
      mode === 'days' ? `[data-date="${focusedDate}"]` : `[data-calendar-index="${focusIndex}"]`
    const target = popover.panelRef.current?.querySelector(selector)
    target?.focus({ preventScroll: true })
    if (target && contentRef.current) {
      const box = target.getBoundingClientRect()
      const bounds = contentRef.current.getBoundingClientRect()
      if (box.bottom > bounds.bottom) contentRef.current.scrollTop += box.bottom - bounds.bottom + 4
      if (box.top < bounds.top) contentRef.current.scrollTop -= bounds.top - box.top + 4
    }
  }, [popover.open, popover.panelRef, mode, focusedDate, focusIndex, year, month])

  function openCalendar() {
    if (popover.open) {
      popover.close()
      return
    }
    setYear(selected.getFullYear())
    setMonth(selected.getMonth())
    setMode('days')
    setFocusedDate(value)
    pendingFocus.current = true
    popover.show()
  }

  function chooseDate(key) {
    if (key < min || key > MAX_DATE) return
    onChange(key)
    popover.close()
  }

  function setView(nextYear, nextMonth, day = parseDate(focusedDate).getDate()) {
    setYear(nextYear)
    setMonth(nextMonth)
    setFocusedDate(
      dateKey(new Date(nextYear, nextMonth, Math.min(day, daysInMonth(nextYear, nextMonth)), 12)),
    )
  }

  function browse(direction) {
    if (mode === 'days') {
      const next = new Date(year, month + direction, 1, 12)
      setView(next.getFullYear(), next.getMonth())
    } else if (mode === 'months') setView(year + direction, month)
    else {
      setYearPage((page) => page + direction * 12)
      setFocusIndex(0)
    }
  }

  function switchMode() {
    pendingFocus.current = true
    if (mode === 'days') {
      setFocusIndex(month)
      setMode('months')
    } else if (mode === 'months') {
      const page = pageForYear(year)
      setYearPage(page)
      setFocusIndex(year - page)
      setMode('years')
    } else {
      setFocusIndex(month)
      setMode('months')
    }
  }

  function choosePeriod(index) {
    pendingFocus.current = true
    if (mode === 'years') {
      setView(yearPage + index, month)
      setFocusIndex(month)
      setMode('months')
    } else {
      setView(year, index)
      setMode('days')
    }
  }

  function handleKeys(event) {
    if (event.key === 'Tab') {
      const controls = [
        ...popover.panelRef.current.querySelectorAll('button:not(:disabled)'),
      ].filter((button) => button.tabIndex >= 0)
      if (
        (event.shiftKey && event.target === controls[0]) ||
        (!event.shiftKey && event.target === controls[controls.length - 1])
      ) {
        event.preventDefault()
        popover.close()
      }
      return
    }
    const dayCell = event.target.closest('[data-date]')
    if (dayCell) {
      const current = parseDate(dayCell.dataset.date)
      const next = new Date(current)
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
      if (event.key in offsets) next.setDate(next.getDate() + offsets[event.key])
      else if (event.key === 'Home') next.setDate(next.getDate() - ((next.getDay() + 6) % 7))
      else if (event.key === 'End') next.setDate(next.getDate() + 6 - ((next.getDay() + 6) % 7))
      else if (event.key === 'PageUp' || event.key === 'PageDown') {
        const direction = event.key === 'PageUp' ? -1 : 1
        const target = new Date(
          current.getFullYear(),
          current.getMonth() + direction * (event.shiftKey ? 12 : 1),
          1,
          12,
        )
        next.setFullYear(
          target.getFullYear(),
          target.getMonth(),
          Math.min(current.getDate(), daysInMonth(target.getFullYear(), target.getMonth())),
        )
      } else return
      event.preventDefault()
      const key = dateKey(next)
      if (key < min || key > MAX_DATE) return
      pendingFocus.current = true
      setYear(next.getFullYear())
      setMonth(next.getMonth())
      setFocusedDate(key)
      return
    }
    const periodCell = event.target.closest('[data-calendar-index]')
    if (!periodCell) return
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }
    let next = Number(periodCell.dataset.calendarIndex)
    if (event.key in offsets) next += offsets[event.key]
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = 11
    else return
    event.preventDefault()
    pendingFocus.current = true
    setFocusIndex(
      Math.max(0, Math.min(mode === 'years' ? Math.min(11, 2100 - yearPage) : 11, next)),
    )
  }

  const previousDisabled =
    mode === 'days'
      ? year === 1900 && month === 0
      : mode === 'months'
        ? year <= 1900
        : yearPage <= 1900
  const nextDisabled =
    mode === 'days'
      ? year === 2100 && month === 11
      : mode === 'months'
        ? year >= 2100
        : yearPage + 12 > 2100
  const caption =
    mode === 'days'
      ? `Tháng ${month + 1}, ${year}`
      : mode === 'months'
        ? year
        : `${yearPage} – ${Math.min(yearPage + 11, 2100)}`

  return (
    <>
      <input type="hidden" className="custom-field-value" name={name} value={value} />
      <button
        type="button"
        ref={popover.triggerRef}
        className={`transaction-field-trigger ${popover.open ? 'is-open' : ''}`}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="dialog"
        aria-expanded={popover.open}
        aria-controls={popover.open ? popoverId : undefined}
        onClick={openCalendar}
      >
        <span id={valueId}>{formatDate(value)}</span>
        <CalendarDays size={15} aria-hidden="true" />
      </button>
      <FieldPopover
        popover={popover}
        id={popoverId}
        className="date-picker-popover"
        role="dialog"
        aria-label="Chọn ngày giao dịch"
        onKeyDown={handleKeys}
      >
        <div className="field-popover-caption">
          <span>
            <CalendarDays size={14} />
            CHỌN NGÀY GIAO DỊCH
          </span>
          <button
            type="button"
            className="field-popover-close"
            aria-label="Đóng lịch"
            onClick={() => popover.close()}
          >
            <X size={15} />
          </button>
        </div>
        <div className="date-picker-navigation">
          <button
            type="button"
            className="month-browse-arrow"
            aria-label={
              mode === 'days'
                ? 'Tháng trước của lịch'
                : mode === 'months'
                  ? 'Năm trước của lịch'
                  : '12 năm trước của lịch'
            }
            disabled={previousDisabled}
            onClick={() => browse(-1)}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            className="date-picker-heading"
            aria-label={
              mode === 'days'
                ? 'Chọn tháng và năm'
                : mode === 'months'
                  ? 'Chọn năm của lịch'
                  : 'Quay lại chọn tháng của lịch'
            }
            onClick={switchMode}
          >
            {caption}
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="month-browse-arrow"
            aria-label={
              mode === 'days'
                ? 'Tháng sau của lịch'
                : mode === 'months'
                  ? 'Năm sau của lịch'
                  : '12 năm sau của lịch'
            }
            disabled={nextDisabled}
            onClick={() => browse(1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="date-picker-content" ref={contentRef}>
          {mode === 'days' ? (
            <div
              role="grid"
              aria-label={`Ngày tháng ${month + 1} năm ${year}`}
              className="date-picker-grid"
            >
              <div role="row" className="date-picker-weekdays">
                {weekdays.map((day, index) => (
                  <span
                    role="columnheader"
                    aria-label={index === 6 ? 'Chủ nhật' : `Thứ ${index + 2}`}
                    key={day}
                  >
                    {day}
                  </span>
                ))}
              </div>
              {Array.from({ length: 6 }, (_, week) => (
                <div role="row" className="date-picker-week" key={week}>
                  {dates.slice(week * 7, week * 7 + 7).map((key) => (
                    <button
                      type="button"
                      role="gridcell"
                      key={key}
                      data-date={key}
                      tabIndex={key === focusedDate ? 0 : -1}
                      disabled={key < min || key > MAX_DATE}
                      aria-label={formatDate(key, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      aria-selected={key === value}
                      aria-current={key === today ? 'date' : undefined}
                      className={`date-picker-day ${parseDate(key).getMonth() !== month ? 'is-outside' : ''} ${key === today ? 'is-today' : ''} ${key === value ? 'is-selected' : ''}`}
                      onFocus={() => setFocusedDate(key)}
                      onClick={() => chooseDate(key)}
                    >
                      {parseDate(key).getDate()}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="month-options-grid"
              role="group"
              aria-label={mode === 'months' ? `Các tháng năm ${year}` : 'Các năm của lịch'}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <button
                  type="button"
                  key={index}
                  data-calendar-index={index}
                  tabIndex={index === focusIndex ? 0 : -1}
                  disabled={mode === 'years' && yearPage + index > 2100}
                  aria-label={
                    mode === 'months' ? `Tháng ${index + 1} năm ${year}` : `Năm ${yearPage + index}`
                  }
                  aria-pressed={
                    mode === 'months'
                      ? index === selected.getMonth() && year === selected.getFullYear()
                      : yearPage + index === selected.getFullYear()
                  }
                  className={`month-option ${(mode === 'months' ? index === month : yearPage + index === year) ? 'is-selected' : ''}`}
                  onFocus={() => setFocusIndex(index)}
                  onClick={() => choosePeriod(index)}
                >
                  {mode === 'months' ? `Tháng ${index + 1}` : yearPage + index}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="field-popover-footer">
          <span>
            Đã chọn <strong>{formatDate(value)}</strong>
          </span>
          <button type="button" onClick={() => chooseDate(today)}>
            <RotateCcw size={13} />
            Hôm nay
          </button>
        </div>
      </FieldPopover>
    </>
  )
}
