import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { dateKey, downloadFile, readData, STORAGE_KEY } from '../storage/data'
import { persistBook, quarantineOriginal, readRecovery } from '../storage/bookStorage'

export const SaveFeedbackContext = createContext({ saveError: '', saving: false })

export default function useBookData(notify) {
  const [initial] = useState(readData)
  const [snapshot, setSnapshot] = useState(initial)
  const snapshotRef = useRef(initial)
  const [recovery, setRecovery] = useState(readRecovery)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const inFlight = useRef(false)
  const notifyRef = useRef(notify)
  notifyRef.current = notify
  const apply = useCallback((next) => {
    snapshotRef.current = next
    setSnapshot(next)
  }, [])

  const sync = useCallback(() => {
    const current = snapshotRef.current
    const next = readData()
    if (next.raw === current.raw && next.blocked === current.blocked) return
    if (next.raw === null && (current.raw !== null || current.blocked)) {
      apply({
        ...current,
        raw: null,
        blocked: true,
        error:
          'Bản lưu vừa bị xóa ở tab khác. Đang giữ dữ liệu trên màn hình và khóa lưu; hãy xuất bản sao lưu trong Cài đặt.',
      })
    } else if (next.blocked) {
      apply({ ...next, data: current.data })
    } else {
      apply(next)
    }
    setRecovery(readRecovery())
  }, [apply])

  useEffect(() => {
    const storage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) sync()
    }
    const visible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    window.addEventListener('storage', storage)
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', visible)
    return () => {
      window.removeEventListener('storage', storage)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', visible)
    }
  }, [sync])

  useEffect(() => {
    if (!snapshot.blocked || typeof snapshot.raw !== 'string') return
    let active = true
    quarantineOriginal(snapshot.raw)
      .then((copy) => {
        if (active) setRecovery(copy)
      })
      .catch(() => {
        /* The primary key remains locked and untouched if archiving is unavailable. */
      })
    return () => {
      active = false
    }
  }, [snapshot.blocked, snapshot.raw])

  const saveData = useCallback(
    async (next, message = 'Đã lưu thay đổi', options = {}) => {
      if (inFlight.current) {
        if (!options.silent) notifyRef.current('Đang lưu thay đổi trước, hãy thử lại sau một chút.')
        return false
      }
      const current = snapshotRef.current
      if (current.blocked && !options.recover) {
        setSaveError(current.error)
        return false
      }
      inFlight.current = true
      setSaving(true)
      setSaveError('')
      try {
        const result = await persistBook(options.base || current.data, next, {
          baseRaw: Object.hasOwn(options, 'baseRaw') ? options.baseRaw : current.raw,
          ...options,
        })
        apply({ data: result.data, raw: result.raw, blocked: false, error: '' })
        sync()
        if (result.recovery) setRecovery(result.recovery)
        if (!options.silent) notifyRef.current(message)
        return result.data
      } catch (error) {
        if (['conflict', 'blocked', 'budget-funds', 'closed-month'].includes(error.code)) {
          sync()
          setSaveError(error.message)
        } else {
          const message =
            'Không thể lưu vào trình duyệt. Nội dung đang nhập vẫn được giữ. Hãy kiểm tra bộ nhớ rồi thử lưu lại; bạn vẫn có thể xuất sổ hiện tại trong Cài đặt.'
          apply({ ...snapshotRef.current, error: message })
          setSaveError(message)
        }
        return false
      } finally {
        inFlight.current = false
        setSaving(false)
      }
    },
    [apply, sync],
  )

  useEffect(() => {
    if (
      snapshot.blocked ||
      snapshot.raw === null ||
      snapshot.data.categoryBudgetPolicy ||
      inFlight.current
    )
      return
    // Stamp the adoption month in an atomic write, without changing historical amounts or records.
    void saveData(snapshot.data, '', { silent: true })
  }, [snapshot.blocked, snapshot.raw, snapshot.data.categoryBudgetPolicy, saveData])

  const originalRaw =
    snapshot.blocked && typeof snapshot.raw === 'string' ? snapshot.raw : recovery?.raw
  function downloadOriginal() {
    if (typeof originalRaw !== 'string') return
    downloadFile(originalRaw, `may-ban-goc-${dateKey()}.json`, 'application/json')
    notifyRef.current('Đã xuất nguyên bản dữ liệu cần khôi phục')
  }

  return {
    data: snapshot.data,
    raw: snapshot.raw,
    storageError: snapshot.error,
    storageBlocked: snapshot.blocked,
    saveData,
    saveError,
    saving,
    clearSaveError: () => setSaveError(''),
    recovery:
      typeof originalRaw === 'string'
        ? { blocked: snapshot.blocked, archived: recovery?.raw === originalRaw, downloadOriginal }
        : null,
  }
}
