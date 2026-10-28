import { useEffect, useRef, useState } from 'react'
import { motion, useIsPresent } from 'motion/react'
import { ArrowUpRight, Check, X } from 'lucide-react'
import './Toast.css'

export default function Toast({ toast, onClose, onViewTransaction }) {
  const present = useIsPresent()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const duration = toast.transactionId ? 10000 : 3500
  useEffect(() => {
    if (!present || hovered || focused) return
    const timer = setTimeout(() => closeRef.current(), duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, hovered, focused, present])

  return (
    <motion.div
      className={`toast ${toast.transactionId ? 'has-action' : ''}`}
      style={{ x: '-50%' }}
      role="status"
      aria-hidden={!present}
      inert={!present}
      aria-atomic="true"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <span className="toast-icon" aria-hidden="true">
        <Check size={15} />
      </span>
      <span className="toast-message">{toast.message}</span>
      {toast.transactionId && (
        <button className="toast-action" onClick={onViewTransaction}>
          Xem giao dịch vừa lưu <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      )}
      <button className="toast-close" aria-label="Đóng thông báo" onClick={onClose}>
        <X size={14} />
      </button>
    </motion.div>
  )
}
