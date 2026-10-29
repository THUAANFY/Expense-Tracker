import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import CategoryArt from '../illustrations/CategoryArt'
import SourceBadge, { SourceBadgeIcon } from '../../features/money-sources/SourceBadge'
import { FieldPopover, useFieldPopover } from './FieldPopover'
import './FilterSelect.css'

const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')

function OptionIcon({ option, compact = false }) {
  const Icon = option.icon
  return (
    <span
      className={`history-select-icon ${option.category ? 'has-category' : ''} ${option.sourceType ? 'has-source' : ''}`}
      style={option.background ? { background: option.background } : undefined}
      aria-hidden="true"
    >
      {option.sourceType ? (
        <SourceBadgeIcon type={option.sourceType} size={compact ? 22 : 28} />
      ) : option.category ? (
        <CategoryArt category={option.category} size={compact ? 22 : 30} />
      ) : Icon ? (
        <Icon size={compact ? 15 : 17} />
      ) : null}
    </span>
  )
}

export default function FilterSelect({ label, caption, options, value, onChange, width = 248 }) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selected = options[selectedIndex]
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const listId = useId()
  const optionRefs = useRef([])
  const typeahead = useRef({ text: '', time: 0 })
  const popover = useFieldPopover({ width, matchWidth: true })
  const optionId = (index) => `${listId}-${index}`

  useEffect(() => {
    if (popover.open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [popover.open, activeIndex])

  function show(index = selectedIndex) {
    setActiveIndex(index)
    typeahead.current = { text: '', time: 0 }
    popover.show()
  }
  function choose(index) {
    onChange(options[index].value)
    popover.close()
  }
  function handleKeys(event) {
    const { key } = event
    if (key === 'Tab') {
      if (popover.open) popover.close(false)
      return
    }
    if (event.altKey && key === 'ArrowUp' && popover.open) {
      event.preventDefault()
      popover.close()
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (popover.open) choose(activeIndex)
      else show()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault()
      const next =
        key === 'Home'
          ? 0
          : key === 'End'
            ? options.length - 1
            : popover.open
              ? Math.max(
                  0,
                  Math.min(options.length - 1, activeIndex + (key === 'ArrowDown' ? 1 : -1)),
                )
              : selectedIndex
      if (popover.open) setActiveIndex(next)
      else show(next)
      return
    }
    if (
      key.length === 1 &&
      /[\p{L}\p{N}]/u.test(key) &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault()
      event.stopPropagation()
      const now = Date.now()
      const text =
        (now - typeahead.current.time < 700 ? typeahead.current.text : '') + normalize(key)
      typeahead.current = { text, time: now }
      const prefix = [...text].every((letter) => letter === text[0]) ? text[0] : text
      const start = popover.open ? activeIndex : selectedIndex
      const match = Array.from(
        { length: options.length },
        (_, offset) => (start + offset + 1) % options.length,
      ).find((index) => normalize(options[index].label).startsWith(prefix))
      if (match !== undefined) {
        if (popover.open) setActiveIndex(match)
        else onChange(options[match].value)
      }
    }
  }

  return (
    <div className="history-select">
      <button
        type="button"
        role="combobox"
        ref={popover.triggerRef}
        className={`history-select-trigger ${popover.open ? 'is-open' : ''}`}
        aria-label={label}
        aria-describedby={`${listId}-value`}
        aria-haspopup="listbox"
        aria-expanded={popover.open}
        aria-controls={popover.open ? listId : undefined}
        aria-activedescendant={popover.open ? optionId(activeIndex) : undefined}
        title={selected.label}
        onClick={() => (popover.open ? popover.close() : show())}
        onKeyDown={handleKeys}
      >
        {selected.sourceType ? (
          <SourceBadge
            type={selected.sourceType}
            label={selected.label}
            size="small"
            className="history-select-source"
            id={`${listId}-value`}
          />
        ) : (
          <>
            <OptionIcon option={selected} compact />
            <span className="history-select-value" id={`${listId}-value`}>
              {selected.label}
            </span>
          </>
        )}
        <ChevronDown className="history-select-chevron" size={14} aria-hidden="true" />
      </button>
      <FieldPopover
        popover={popover}
        id={listId}
        role="listbox"
        aria-label={label}
        className="history-select-popover"
      >
        <div className="history-select-caption" aria-hidden="true">
          <span>{caption}</span>
          <span>{options.length} lựa chọn</span>
        </div>
        <div className="history-select-options">
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              id={optionId(index)}
              type="button"
              role="option"
              tabIndex={-1}
              aria-label={option.label}
              title={option.label}
              aria-selected={value === option.value}
              aria-describedby={option.description ? `${optionId(index)}-description` : undefined}
              className={`history-select-option ${activeIndex === index ? 'is-active' : ''} ${value === option.value ? 'is-selected' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onPointerMove={(event) => {
                if (event.pointerType !== 'touch') setActiveIndex(index)
              }}
              onClick={() => choose(index)}
            >
              <OptionIcon option={option} />
              <span className="history-select-option-copy">
                <span>{option.label}</span>
                {option.description && (
                  <small id={`${optionId(index)}-description`}>{option.description}</small>
                )}
              </span>
              <span className="history-select-check" aria-hidden="true">
                {value === option.value && <Check size={15} />}
              </span>
            </button>
          ))}
        </div>
      </FieldPopover>
    </div>
  )
}
