const READY_EVENT = 'may:app-ready'
const MIN_INTRO_MS = 1250
let abortCurrentStartup = () => {}

export function markApplicationReady() {
  window.dispatchEvent(new Event(READY_EVENT))
}

export function abortStartup() {
  abortCurrentStartup()
}

// The HTML screen is visible before the React entry finishes downloading.
export function startStartupScreen() {
  const screen = document.getElementById('startup-screen')
  const root = document.getElementById('root')
  const image = screen?.querySelector('img')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let phase = 'loading'
  let applicationReady = false
  let introStartedAt = null
  let introTimer
  let exitTimer
  let imageTimer

  function finish() {
    if (phase === 'done') return
    phase = 'done'
    clearTimeout(introTimer)
    clearTimeout(exitTimer)
    clearTimeout(imageTimer)
    window.removeEventListener(READY_EVENT, onApplicationReady)
    window.removeEventListener('pageshow', onPageShow)
    reducedMotion.removeEventListener('change', onMotionChange)
    image?.removeEventListener('load', onImageLoad)
    image?.removeEventListener('error', onImageError)
    screen?.removeEventListener('transitionend', onExitEnd)
    screen?.remove()
    document.body.classList.remove('is-starting', 'startup-revealing')
    root?.removeAttribute('inert')
    root?.removeAttribute('aria-hidden')
    root?.removeAttribute('aria-busy')
    abortCurrentStartup = () => {}
  }

  function onExitEnd(event) {
    if (event.target === screen && event.propertyName === 'opacity') finish()
  }

  function reveal() {
    if (phase !== 'loading' || !applicationReady) return
    if (reducedMotion.matches) {
      finish()
      return
    }
    phase = 'leaving'
    document.body.classList.add('startup-revealing')
    screen.classList.add('is-leaving')
    screen.addEventListener('transitionend', onExitEnd)
    // Hidden tabs or interrupted CSS transitions must never leave the app inert.
    exitTimer = setTimeout(finish, 450)
  }

  function scheduleReveal() {
    if (!applicationReady || introStartedAt === null || phase !== 'loading') return
    clearTimeout(introTimer)
    const remaining = reducedMotion.matches
      ? 0
      : Math.max(0, MIN_INTRO_MS - (performance.now() - introStartedAt))
    if (remaining === 0) reveal()
    else introTimer = setTimeout(reveal, remaining)
  }

  function startIntro() {
    if (phase !== 'loading' || introStartedAt !== null) return
    clearTimeout(imageTimer)
    introStartedAt = performance.now()
    screen.dataset.intro = 'true'
    scheduleReveal()
  }

  function onImageLoad() {
    if (phase === 'done') return
    screen.dataset.logoReady = 'true'
    startIntro()
  }

  function onImageError() {
    if (phase === 'done') return
    screen.dataset.logoError = 'true'
    startIntro()
  }

  function onApplicationReady() {
    applicationReady = true
    scheduleReveal()
  }

  function onMotionChange() {
    if (reducedMotion.matches && applicationReady) finish()
  }

  function onPageShow(event) {
    if (event.persisted && applicationReady) finish()
  }

  abortCurrentStartup = finish
  if (!screen || !root) {
    finish()
    return
  }
  window.addEventListener(READY_EVENT, onApplicationReady)
  window.addEventListener('pageshow', onPageShow)
  reducedMotion.addEventListener('change', onMotionChange)
  image?.addEventListener('load', onImageLoad)
  image?.addEventListener('error', onImageError)
  if (!image || (image.complete && !image.naturalWidth)) onImageError()
  else if (image.complete) onImageLoad()
  else imageTimer = setTimeout(startIntro, 250)
}

export function showStartupFailure(error) {
  console.error('[mây] Không thể khởi động ứng dụng:', error)
  abortStartup()
  const screen = document.createElement('section')
  screen.className = 'startup-failure'
  screen.innerHTML = `
    <div role="alert" class="startup-failure-card">
      <h1>Chưa thể mở mây.</h1>
      <p>Vui lòng tải lại trang để nhận phiên bản mới nhất.</p>
      <button type="button">Tải lại trang</button>
    </div>`
  screen.querySelector('button').addEventListener('click', () => window.location.reload())
  document.getElementById('root').replaceChildren(screen)
}
