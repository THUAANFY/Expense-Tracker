export const APPEARANCE_KEY = 'may-appearance-v1'
export const APPEARANCE_MODES = ['light', 'dark', 'system']

export function parseAppearance(raw) {
  try {
    const value = JSON.parse(raw)
    return value?.version === 1 && APPEARANCE_MODES.includes(value.mode) ? value.mode : 'light'
  } catch {
    return 'light'
  }
}

export const resolveAppearance = (mode, systemDark = false) =>
  mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light'

let mode = 'light'
let theme = 'light'
let media
let cleanup
const listeners = new Set()

function apply(next) {
  mode = next
  theme = resolveAppearance(mode, media?.matches)
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.themeMode = mode
  root.style.colorScheme = theme
  root.style.backgroundColor = theme === 'dark' ? '#0d111d' : '#f7f8fc'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0d111d' : '#a48bc8')
  listeners.forEach((listener) => listener())
}

function readMode() {
  try {
    return parseAppearance(localStorage.getItem(APPEARANCE_KEY))
  } catch {
    return 'light'
  }
}

export function initializeAppearance() {
  if (cleanup) return
  media = window.matchMedia('(prefers-color-scheme: dark)')
  apply(readMode())
  const systemChanged = () => {
    if (mode === 'system') apply(mode)
  }
  const storageChanged = (event) => {
    if (event.key === APPEARANCE_KEY || event.key === null) apply(readMode())
  }
  media.addEventListener('change', systemChanged)
  window.addEventListener('storage', storageChanged)
  cleanup = () => {
    media.removeEventListener('change', systemChanged)
    window.removeEventListener('storage', storageChanged)
    cleanup = undefined
  }
}

export function setAppearance(next) {
  if (!APPEARANCE_MODES.includes(next)) return false
  let persisted = true
  try {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify({ version: 1, mode: next }))
  } catch {
    persisted = false
  }
  apply(next)
  return persisted
}

export const getAppearanceSnapshot = () => `${mode}:${theme}`
export const subscribeAppearance = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    cleanup?.()
    listeners.clear()
  })
