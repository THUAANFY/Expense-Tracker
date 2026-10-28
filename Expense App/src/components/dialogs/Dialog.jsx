import { useContext, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import '../TransactionDialog.css'
import { SaveFeedbackContext } from '../useBookData'

export default function Dialog({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
  className = '',
}) {
  const ref = useRef(null)
  const { saveError, saving } = useContext(SaveFeedbackContext)
  const headingId = useId()
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    dialog.querySelector('input:not([type="checkbox"]), textarea')?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(
    <dialog
      ref={ref}
      className={`dialog ${wide ? 'wide' : ''} ${className}`}
      aria-labelledby={headingId}
      aria-busy={saving}
      onSubmitCapture={(event) => {
        if (saving) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        className="dialog-inner"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">MỘT CHÚT GHI CHÉP</span>
            <h2 id={headingId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" aria-label="Đóng" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {saveError && (
          <p className="dialog-save-error" role="alert">
            {saveError}
          </p>
        )}
        {children}
      </motion.div>
    </dialog>,
    document.body,
  )
}
