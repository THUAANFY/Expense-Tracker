import { Check } from 'lucide-react'

export default function DialogChoice({ selected, children, className = '', ...props }) {
  return (
    <button
      {...props}
      type="button"
      className={`dialog-choice ${selected ? 'selected' : ''} ${className}`.trim()}
      aria-pressed={selected}
    >
      {children}
      <span className="dialog-choice-check" aria-hidden="true">
        <Check size={11} strokeWidth={2.5} />
      </span>
    </button>
  )
}
