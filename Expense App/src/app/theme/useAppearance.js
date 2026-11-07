import { useSyncExternalStore } from 'react'
import { getAppearanceSnapshot, setAppearance, subscribeAppearance } from './appearance'

export default function useAppearance() {
  const snapshot = useSyncExternalStore(subscribeAppearance, getAppearanceSnapshot)
  const [mode, theme] = snapshot.split(':')
  return { mode, theme, setMode: setAppearance }
}
