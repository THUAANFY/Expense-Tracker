import './ActionButton.css'

export default function ActionButton({
  children,
  className = '',
  layout,
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={`action-button ${className}`.trim()}
      data-action-layout={layout}
    >
      {children}
    </button>
  )
}
