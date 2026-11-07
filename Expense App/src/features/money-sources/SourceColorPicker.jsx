import { Check } from 'lucide-react'
import { SOURCE_COLORS, getSourceColor } from './moneySources'
import './SourceColorPicker.css'

export default function SourceColorPicker({ value, onChange }) {
  const selected = getSourceColor(value)
  const option = (color, soft = false) => (
    <button
      type="button"
      key={color.id}
      className={`source-color-option ${soft ? 'is-soft' : ''}`}
      style={{ '--color-neon': color.neon, '--color-paper': color.paper, '--color-ink': color.ink }}
      aria-label={`Màu nguồn ${color.label}`}
      aria-pressed={value === color.id}
      title={color.label}
      onClick={() => onChange(color.id)}
    >
      <span className="source-color-dot" aria-hidden="true">
        {value === color.id && <Check size={13} strokeWidth={2.5} />}
      </span>
      {!soft && <span>{color.label}</span>}
    </button>
  )
  return (
    <div className="source-color-picker" role="group" aria-label="Màu nguồn tiền">
      <div className="source-color-heading">
        <span>Màu thẻ nguồn tiền</span>
        <span>{selected.label}</span>
      </div>
      <div className="source-neon-swatches">
        {SOURCE_COLORS.filter((color) => color.id.startsWith('neon-')).map((color) =>
          option(color),
        )}
      </div>
      <div className="source-soft-swatches">
        <span>Màu nhẹ</span>
        {SOURCE_COLORS.filter((color) => !color.id.startsWith('neon-')).map((color) =>
          option(color, true),
        )}
      </div>
    </div>
  )
}
