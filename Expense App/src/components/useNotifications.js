import { useEffect, useMemo, useState } from 'react'
import { buildNotifications, NOTIFICATION_KEY, readNotificationState } from '../notifications'

export default function useNotifications(data, storageError) {
  const [initial] = useState(readNotificationState)
  const [state, setState] = useState(initial.state)
  const [persistenceError, setPersistenceError] = useState(initial.error)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const refresh = () => setNow(new Date())
    const visible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const sync = (event) => {
      if (event.key === NOTIFICATION_KEY || event.key === null)
        setState(readNotificationState().state)
    }
    const timer = setInterval(refresh, 60000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', visible)
    window.addEventListener('storage', sync)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', visible)
      window.removeEventListener('storage', sync)
    }
  }, [])
  const notifications = useMemo(
    () =>
      buildNotifications(data, {
        now,
        storageError,
        remindersEnabled: state.remindersEnabled,
      }),
    [data, now, storageError, state.remindersEnabled],
  )
  useEffect(() => {
    const missing = notifications.filter((item) => !state.entries[item.id])
    if (!missing.length) return
    const activeIds = new Set(notifications.map((item) => item.id))
    setState((previous) => ({
      ...previous,
      entries: Object.fromEntries(
        Object.entries({
          ...previous.entries,
          ...Object.fromEntries(
            missing.map((item) => [item.id, { firstSeen: now.getTime(), readAt: null }]),
          ),
        })
          .sort(
            (a, b) =>
              Number(activeIds.has(b[0])) - Number(activeIds.has(a[0])) ||
              b[1].firstSeen - a[1].firstSeen,
          )
          .slice(0, 160),
      ),
    }))
  }, [notifications, state.entries, now])
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(state))
      setPersistenceError(false)
    } catch {
      setPersistenceError(true)
    }
  }, [state])

  const markRead = (ids) => {
    setState((previous) => {
      const entries = { ...previous.entries }
      for (const id of ids)
        entries[id] = { firstSeen: entries[id]?.firstSeen || now.getTime(), readAt: Date.now() }
      return { ...previous, entries }
    })
  }
  const items = notifications.map((item) => ({
    ...item,
    firstSeen: state.entries[item.id]?.firstSeen || now.getTime(),
    unread: !state.entries[item.id]?.readAt,
  }))
  return {
    items,
    now,
    persistenceError,
    remindersEnabled: state.remindersEnabled,
    unreadCount: items.filter((item) => item.unread).length,
    markRead,
    markAllRead: () => markRead(items.map((item) => item.id)),
    setRemindersEnabled: (enabled) =>
      setState((previous) => ({ ...previous, remindersEnabled: enabled })),
  }
}
