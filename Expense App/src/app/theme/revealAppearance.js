import { flushSync } from 'react-dom'
import { subscribeAppearance } from './appearance'

let sequence = 0
let active
let applying = false

function stopActive() {
  const previous = active
  active = undefined
  previous?.animation?.cancel()
  previous?.transition.skipTransition()
  document.documentElement.removeAttribute('data-theme-transition')
}

export function revealAppearance(update, origin, changeColors = true) {
  const request = ++sequence
  stopActive()
  let applied = false
  const apply = () => {
    if (request !== sequence || applied) return
    applied = true
    // The new snapshot must include React's theme-dependent SVGs and local notices.
    applying = true
    try {
      flushSync(update)
    } finally {
      applying = false
    }
  }
  if (
    !changeColors ||
    typeof document.startViewTransition !== 'function' ||
    typeof document.documentElement.animate !== 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.visibilityState === 'hidden'
  ) {
    apply()
    return
  }

  const root = document.documentElement
  const width = window.innerWidth
  const height = window.innerHeight
  const x = Math.min(width, Math.max(0, Number.isFinite(origin?.x) ? origin.x : width / 2))
  const y = Math.min(height, Math.max(0, Number.isFinite(origin?.y) ? origin.y : height / 2))
  const radius = Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y))) + 2
  root.setAttribute('data-theme-transition', '')

  let transition
  try {
    transition = document.startViewTransition(apply)
  } catch {
    root.removeAttribute('data-theme-transition')
    apply()
    return
  }
  const current = { request, transition, animation: undefined }
  active = current
  const finish = () => {
    if (active !== current) return
    apply()
    active = undefined
    root.removeAttribute('data-theme-transition')
  }

  void transition.ready.then(
    () => {
      if (active !== current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        transition.skipTransition()
        return
      }
      try {
        current.animation = root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'both',
            pseudoElement: '::view-transition-new(root)',
          },
        )
        void current.animation.finished.catch(() => {})
      } catch {
        transition.skipTransition()
      }
    },
    () => apply(),
  )
  void transition.finished.then(finish, finish)
}

// A system or other-tab update takes priority over an in-progress local reveal.
const unsubscribe = subscribeAppearance(() => {
  if (!active || applying) return
  sequence += 1
  stopActive()
})

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    unsubscribe()
    sequence += 1
    stopActive()
  })
