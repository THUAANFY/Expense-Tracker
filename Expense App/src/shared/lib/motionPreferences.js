// Include touch devices in landscape, where the viewport can be wider than the mobile layout.
export const LIGHTWEIGHT_MOTION_QUERY = '(max-width: 760px), (pointer: coarse)'

export function prefersLightweightMotion() {
  return window.matchMedia(LIGHTWEIGHT_MOTION_QUERY).matches
}

export function subscribeLightweightMotion(listener) {
  const media = window.matchMedia(LIGHTWEIGHT_MOTION_QUERY)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
