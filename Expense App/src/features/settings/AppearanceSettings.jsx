import { useId, useRef, useState } from 'react'
import { Check, MonitorSmartphone, Moon, Sparkles, Sun } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import { resolveAppearance } from '../../app/theme/appearance'
import { revealAppearance } from '../../app/theme/revealAppearance'
import './AppearanceSettings.css'

const choices = [
  {
    mode: 'light',
    label: 'Sáng',
    description: 'Trong trẻo, nhẹ nhàng',
    image: 'Theme Sáng.jpg',
    Icon: Sun,
  },
  {
    mode: 'dark',
    label: 'Tối',
    description: 'Midnight · Kính mờ',
    image: 'Theme Tối.jpg',
    Icon: Moon,
  },
  {
    mode: 'system',
    label: 'Theo thiết bị',
    description: 'Hòa cùng màn hình',
    image: 'Theo thiết bị.jpg',
    Icon: MonitorSmartphone,
  },
]

export default function AppearanceSettings() {
  const { mode, theme, setMode } = useAppearance()
  const id = useId()
  const controls = useRef([])
  const [notice, setNotice] = useState('')
  function select(next, event, target = event?.currentTarget) {
    const box = target?.getBoundingClientRect()
    const pointer = event?.type === 'click' && event.detail > 0
    const origin = pointer
      ? { x: event.clientX, y: event.clientY }
      : box && { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    const nextTheme = resolveAppearance(
      next,
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    )
    revealAppearance(
      () => {
        const persisted = setMode(next)
        setNotice(
          persisted ? '' : 'Đã đổi giao diện cho lần mở này. Trình duyệt chưa lưu được lựa chọn.',
        )
      },
      origin,
      nextTheme !== document.documentElement.dataset.theme,
    )
  }
  return (
    <section className="settings-appearance" aria-labelledby={id}>
      <div className="appearance-intro">
        <span className="appearance-eyebrow">
          <span className="appearance-eyebrow-icon" aria-hidden="true">
            <Sparkles size={15} />
          </span>
          MỘT CHÚT RIÊNG MÌNH
        </span>
        <h2 id={id}>
          Giao diện, <span>theo ý bạn.</span>
        </h2>
        <p>
          {theme === 'dark'
            ? 'Navy sâu. Ánh tím dịu. Rõ từng khoản chi.'
            : 'Chọn sắc độ cho góc ghi chép của bạn.'}
        </p>
        <span className="appearance-current" aria-live="polite">
          <span aria-hidden="true" />
          Đang dùng giao diện {theme === 'dark' ? 'tối' : 'sáng'}
          {mode === 'system' && ' theo thiết bị'}
        </span>
      </div>
      <div className="appearance-choices" role="radiogroup" aria-label="Chế độ giao diện">
        {choices.map(({ mode: value, label, description, image, Icon }, index) => (
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
            onClick={(event) => select(value, event)}
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
              select(choices[next].mode, event, controls.current[next])
            }}
          >
            <img
              className="appearance-choice-image"
              src={`${import.meta.env.BASE_URL}images/themes/${encodeURIComponent(image)}`}
              alt=""
              width="1672"
              height="941"
              decoding="async"
              draggable={false}
            />
            <span
              className={`appearance-option-icon appearance-option-icon--${value}`}
              aria-hidden="true"
            >
              <Icon size={26} strokeWidth={1.7} />
            </span>
            <span className="appearance-option-name">
              <span>{label}</span>
              <span className="appearance-check" aria-hidden="true">
                <span />
              </span>
            </span>
            <span className="appearance-option-description">{description}</span>
            {mode === value && (
              <span className="appearance-selected-mark" aria-hidden="true">
                <Check size={15} strokeWidth={2.5} />
              </span>
            )}
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
