import { useId, useState } from 'react'
import { Banknote, Check, ChevronDown, CreditCard, Landmark } from 'lucide-react'
import { FieldPopover, useFieldPopover } from '../../shared/components/FieldPopover'

const options = [
  { value: 'Chuyển khoản', icon: Landmark, color: 'purple' },
  { value: 'Tiền mặt', icon: Banknote, color: 'green' },
  { value: 'Thẻ ngân hàng', icon: CreditCard, color: 'blue' },
]
const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function PaymentSelect({ value, onChange, labelId, name = 'wallet' }) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const popover = useFieldPopover({ width: 208, matchWidth: true })
  const listId = useId()
  const valueId = useId()
  const optionId = (index) => `${listId}-${index}`

  function show() {
    setActiveIndex(selectedIndex)
    popover.show()
  }
  function choose(index) {
    onChange(options[index].value)
    popover.close()
  }
  function handleKeys(event) {
    if (event.key === 'Tab') {
      if (popover.open) popover.close(false)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (popover.open) choose(activeIndex)
      else show()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      if (!popover.open) {
        popover.show()
        setActiveIndex(
          event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : selectedIndex,
        )
      } else
        setActiveIndex((index) =>
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? options.length - 1
              : Math.max(
                  0,
                  Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)),
                ),
        )
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const start = popover.open ? activeIndex : selectedIndex
      const match = Array.from(
        { length: options.length },
        (_, offset) => (start + offset + 1) % options.length,
      ).find((index) => normalize(options[index].value).startsWith(normalize(event.key)))
      if (match !== undefined) {
        event.preventDefault()
        if (popover.open) setActiveIndex(match)
        else onChange(options[match].value)
      }
    }
  }

  return (
    <>
      <input type="hidden" className="custom-field-value" name={name} value={value} />
      <button
        type="button"
        role="combobox"
        ref={popover.triggerRef}
        className={`transaction-field-trigger ${popover.open ? 'is-open' : ''}`}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="listbox"
        aria-expanded={popover.open}
        aria-controls={popover.open ? listId : undefined}
        aria-activedescendant={popover.open ? optionId(activeIndex) : undefined}
        onClick={() => (popover.open ? popover.close() : show())}
        onKeyDown={handleKeys}
      >
        <span id={valueId}>{value}</span>
        <ChevronDown size={15} className="payment-select-chevron" aria-hidden="true" />
      </button>
      <FieldPopover
        popover={popover}
        id={listId}
        className="payment-select-popover"
        role="listbox"
        aria-label="Phương thức thanh toán"
      >
        <div className="payment-select-caption" aria-hidden="true">
          PHƯƠNG THỨC THANH TOÁN
        </div>
        {options.map(({ value: option, icon: Icon, color }, index) => (
          <button
            type="button"
            role="option"
            id={optionId(index)}
            key={option}
            tabIndex={-1}
            aria-selected={option === value}
            className={`payment-select-option ${index === activeIndex ? 'is-active' : ''} ${option === value ? 'is-selected' : ''}`}
            onPointerMove={() => setActiveIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span className={`payment-option-icon ${color}`}>
              <Icon size={16} aria-hidden="true" />
            </span>
            <span>{option}</span>
            <span className="payment-option-check">
              {option === value && <Check size={15} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </FieldPopover>
    </>
  )
}
