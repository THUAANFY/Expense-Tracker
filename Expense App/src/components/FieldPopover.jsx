import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import './TransactionFields.css'

export function useFieldPopover({ width = 304, matchWidth = false } = {}) {
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width })
  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true })
  }, [])
  const show = useCallback(() => {
    // Keep the popup inside the native modal's top layer, outside its scrolling form.
    setPortalTarget(triggerRef.current?.closest('dialog') || document.body)
    setOpen(true)
  }, [])
  const updatePosition = useCallback(() => {
    const anchor = triggerRef.current?.getBoundingClientRect()
    const panel = panelRef.current
    if (!anchor || !panel) return
    const padding = 12
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = window.visualViewport?.height || innerHeight
    const panelWidth = Math.min(
      matchWidth ? Math.max(width, anchor.width) : width,
      viewportWidth - padding * 2,
    )
    const maxHeight = viewportHeight - padding * 2
    const height = Math.min(panel.offsetHeight, maxHeight)
    const below = anchor.bottom + 8
    const above = anchor.top - height - 8
    const top =
      below + height <= viewportHeight - padding
        ? below
        : above >= padding
          ? above
          : Math.max(padding, viewportHeight - height - padding)
    const left = Math.max(padding, Math.min(anchor.left, viewportWidth - panelWidth - padding))
    setPosition({ top, left, width: panelWidth, maxHeight })
  }, [width, matchWidth])
  useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, updatePosition])
  useEffect(() => {
    if (!open) return
    const outside = (event) => {
      if (!triggerRef.current?.contains(event.target) && !panelRef.current?.contains(event.target))
        close(false)
    }
    const escape = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      close()
    }
    const scroll = (event) => {
      if (panelRef.current?.contains(event.target)) return
      const scroller = triggerRef.current?.closest('.transaction-form-body')
      const anchor = triggerRef.current?.getBoundingClientRect()
      const bounds = scroller?.getBoundingClientRect()
      if (bounds && anchor && (anchor.bottom <= bounds.top || anchor.top >= bounds.bottom))
        close(false)
      else updatePosition()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape, true)
    window.addEventListener('scroll', scroll, true)
    window.addEventListener('resize', updatePosition)
    window.visualViewport?.addEventListener('resize', updatePosition)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape, true)
      window.removeEventListener('scroll', scroll, true)
      window.removeEventListener('resize', updatePosition)
      window.visualViewport?.removeEventListener('resize', updatePosition)
    }
  }, [open, close, updatePosition])
  return { open, show, close, triggerRef, panelRef, portalTarget, position, updatePosition }
}

export function FieldPopover({ popover, children, className = '', ...props }) {
  if (!popover.portalTarget) return null
  return createPortal(
    <AnimatePresence>
      {popover.open && (
        <motion.div
          {...props}
          data-field-popover=""
          ref={popover.panelRef}
          className={`field-popover ${className}`}
          style={popover.position}
          initial={{ opacity: 0, y: 4, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 3, scale: 0.985 }}
          transition={{ duration: 0.14 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    popover.portalTarget,
  )
}
