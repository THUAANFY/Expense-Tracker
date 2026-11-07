import { useId, useRef, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import AppearanceArt from './AppearanceArt'
import './AppearanceSettings.css'

const choices = [
  { mode: 'light', label: 'Sáng', description: 'Trong trẻo, nhẹ nhàng', Icon: Sun },
  { mode: 'dark', label: 'Tối', description: 'Midnight · Kính mờ', Icon: Moon },
  { mode: 'system', label: 'Theo thiết bị', description: 'Hòa cùng màn hình', Icon: Monitor },
]

function ThemePreview({ mode }) {
  return (
    <span className={`appearance-preview is-${mode}`} aria-hidden="true">
      <i className="preview-sidebar">
        <b />
        <b />
        <b />
      </i>
      <i className="preview-content">
        <b />
        <span>
          <i />
          <i />
        </span>
        <em>
          <i />
          <i />
          <i />
          <i />
          <i />
        </em>
      </i>
    </span>
  )
}

export default function AppearanceSettings() {
  const { mode, theme, setMode } = useAppearance()
  const id = useId()
  const controls = useRef([])
  const [notice, setNotice] = useState('')
  function select(next) {
    const persisted = setMode(next)
    setNotice(
      persisted ? '' : 'Đã đổi giao diện cho lần mở này. Trình duyệt chưa lưu được lựa chọn.',
    )
  }
  return (
    <section className="settings-appearance" aria-labelledby={id}>
      <div className="appearance-intro">
        <span className="appearance-eyebrow">MỘT CHÚT RIÊNG MÌNH</span>
        <h2 id={id}>Giao diện, theo ý bạn.</h2>
        <p>
          {theme === 'dark'
            ? 'Navy sâu. Ánh tím dịu. Rõ từng khoản chi.'
            : 'Chọn sắc độ cho góc ghi chép của bạn.'}
        </p>
        <span className="appearance-current">
          <span />
          Đang dùng giao diện {theme === 'dark' ? 'tối' : 'sáng'}
          {mode === 'system' && ' theo thiết bị'}
        </span>
      </div>
      <AppearanceArt dark={theme === 'dark'} className="appearance-hero-art" />
      <div className="appearance-choices" role="radiogroup" aria-label="Chế độ giao diện">
        {choices.map(({ mode: value, label, description, Icon }, index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            aria-label={label}
            tabIndex={mode === value ? 0 : -1}
            className={`appearance-option ${mode === value ? 'is-selected' : ''}`}
            ref={(node) => {
              controls.current[index] = node
            }}
            onClick={() => select(value)}
            onKeyDown={(event) => {
              let next
              if (['ArrowRight', 'ArrowDown'].includes(event.key))
                next = (index + 1) % choices.length
              if (['ArrowLeft', 'ArrowUp'].includes(event.key))
                next = (index + choices.length - 1) % choices.length
              if (event.key === 'Home') next = 0
              if (event.key === 'End') next = choices.length - 1
              if (next === undefined) return
              event.preventDefault()
              controls.current[next]?.focus()
              select(choices[next].mode)
            }}
          >
            <ThemePreview mode={value} />
            <span className="appearance-option-name">
              <Icon size={15} />
              {label}
              <span className="appearance-check">{mode === value && <Check size={11} />}</span>
            </span>
            <span className="appearance-option-description">{description}</span>
          </button>
        ))}
      </div>
      {notice && (
        <p className="appearance-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  )
}
