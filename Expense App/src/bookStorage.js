import { isValidData, normalizeData, STORAGE_KEY, uid } from './data'
import { monthlyBudgetFundingError } from './monthlyBudgets'
import { closedMonthChangeError } from './closedMonths'
import { createCategoryBudgetPolicy } from './categoryBudgets'

export const RECOVERY_PREFIX = `${STORAGE_KEY}:recovery:`
const LOCK_DATABASE = 'may-book-writes-v1'
const COLLECTIONS = new Set(['transactions', 'notes', 'bags', 'moneySources', 'sourceTransfers'])
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export class BookStorageError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'BookStorageError'
    this.code = code
  }
}

const conflict = () => {
  throw new BookStorageError(
    'conflict',
    'Nội dung này vừa được thay đổi ở tab khác nên chưa thể lưu. Phần bạn đang nhập vẫn được giữ; hãy sao chép nội dung cần giữ rồi mở lại bản mới.',
  )
}

// Apply only the user's changes to the latest book, including additions and deletions.
// Concurrent edits to the same field require an explicit decision instead of last-write-wins.
function mergeValue(base, next, latest, key = '') {
  if (same(next, base)) return latest
  if (same(latest, base) || same(next, latest)) return next
  if (
    (['monthlyBudgets', 'monthlyCategoryBudgets', 'monthlyCategoryWeights'].includes(key) ||
      /^\d{4}-\d{2}$/.test(key)) &&
    [base, next, latest].every((value) => value === undefined || object(value))
  ) {
    return mergeValue(base || {}, next || {}, latest || {})
  }
  if (
    COLLECTIONS.has(key) &&
    [base, next, latest].every((value) => value === undefined || Array.isArray(value))
  ) {
    const previous = new Map((base || []).map((item) => [item.id, item]))
    const desired = new Map((next || []).map((item) => [item.id, item]))
    const current = new Map((latest || []).map((item) => [item.id, item]))
    const ids = new Set([
      ...(next || []).filter((item) => !previous.has(item.id)).map((item) => item.id),
      ...current.keys(),
      ...desired.keys(),
    ])
    return [...ids].flatMap((id) => {
      const result = mergeValue(previous.get(id), desired.get(id), current.get(id))
      return result === undefined ? [] : [result]
    })
  }
  if ([base, next, latest].every(object)) {
    const merged = {}
    for (const field of new Set([
      ...Object.keys(base),
      ...Object.keys(next),
      ...Object.keys(latest),
    ])) {
      const result = mergeValue(base[field], next[field], latest[field], field)
      if (result !== undefined) merged[field] = result
    }
    return merged
  }
  return conflict()
}

// A readwrite IndexedDB transaction serializes this synchronous read/merge/write across
// tabs. The book itself keeps its existing localStorage format and backup compatibility.
function exclusiveWrite(operation) {
  return new Promise((resolve, reject) => {
    let request
    let cancelled = false
    try {
      request = indexedDB.open(LOCK_DATABASE, 1)
    } catch (error) {
      reject(error)
      return
    }
    request.onupgradeneeded = () => request.result.createObjectStore('writes')
    request.onerror = () => reject(request.error)
    request.onblocked = () => {
      cancelled = true
      reject(new Error('Không thể mở khóa lưu dữ liệu. Hãy đóng tab cũ rồi thử lại.'))
    }
    request.onsuccess = () => {
      const database = request.result
      if (cancelled) {
        database.close()
        return
      }
      database.onversionchange = () => database.close()
      let transaction
      let result
      let failure
      try {
        transaction = database.transaction('writes', 'readwrite')
        const read = transaction.objectStore('writes').get(STORAGE_KEY)
        read.onsuccess = () => {
          try {
            result = operation()
          } catch (error) {
            failure = error
            transaction.abort()
          }
        }
      } catch (error) {
        database.close()
        reject(error)
        return
      }
      transaction.oncomplete = () => {
        database.close()
        resolve(result)
      }
      transaction.onabort = transaction.onerror = () => {
        database.close()
        reject(failure || transaction.error || new Error('Không thể hoàn tất lưu dữ liệu.'))
      }
    }
  })
}

export function archiveOriginal(raw) {
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)
    if (key?.startsWith(RECOVERY_PREFIX) && localStorage.getItem(key) === raw) return key
  }
  const key = `${RECOVERY_PREFIX}${Date.now()}:${uid()}`
  localStorage.setItem(key, raw)
  return key
}

export function readRecovery() {
  try {
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .filter((key) => key?.startsWith(RECOVERY_PREFIX))
      .sort()
    const key = keys.at(-1)
    return key ? { key, raw: localStorage.getItem(key) } : null
  } catch {
    return null
  }
}

export const quarantineOriginal = (raw) =>
  exclusiveWrite(() => ({ key: archiveOriginal(raw), raw }))

export function persistBook(base, next, { baseRaw, replace = false, recover = false } = {}) {
  return exclusiveWrite(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    let latest = null
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw)
        if (isValidData(parsed)) latest = normalizeData(parsed)
      } catch {
        /* The original bytes are retained below, including malformed JSON. */
      }
    }
    if (raw !== null && !latest && !(replace && recover)) {
      throw new BookStorageError(
        'blocked',
        'Bản lưu hiện tại không hợp lệ. Đã chặn ghi đè; hãy tải bản gốc và khôi phục trong Cài đặt.',
      )
    }
    if ((replace || raw === null) && raw !== baseRaw) conflict()
    if (recover && baseRaw === undefined) {
      throw new BookStorageError(
        'blocked',
        'Chưa đọc được bản lưu hiện tại nên không thể khôi phục an toàn. Hãy thử lại sau khi cho phép bộ nhớ trình duyệt.',
      )
    }
    let saved =
      replace || raw === null
        ? normalizeData(next)
        : mergeValue(normalizeData(base), normalizeData(next), latest)
    if (!isValidData(saved)) {
      throw new BookStorageError(
        'conflict',
        'Các thay đổi không còn phù hợp với dữ liệu mới ở tab khác. Chưa lưu; hãy giữ nội dung cần thiết rồi mở lại bản mới.',
      )
    }
    if (saved.categoryBudgetPolicy === undefined) {
      saved = {
        ...saved,
        categoryBudgetPolicy: latest?.categoryBudgetPolicy || createCategoryBudgetPolicy(),
      }
    }
    // Initial restore/recovery can recover historical records. Replacing an existing
    // financial book must preserve its closed months just like an ordinary save.
    const previous = latest || normalizeData(base)
    const restoringEmptyBook =
      replace &&
      (!latest ||
        (!latest.transactions.length &&
          !(latest.sourceTransfers || []).length &&
          !Object.keys(latest.monthlyBudgets || {}).length &&
          !Object.keys(latest.monthlyCategoryWeights || {}).length &&
          !Object.keys(latest.monthlyCategoryBudgets || {}).length))
    if (!restoringEmptyBook) {
      const error = closedMonthChangeError(previous, saved)
      if (error) throw new BookStorageError('closed-month', error)
    }
    if (!replace) {
      for (const [month, amount] of Object.entries(saved.monthlyBudgets || {})) {
        if (amount === latest?.monthlyBudgets?.[month]) continue
        const error = monthlyBudgetFundingError(saved, amount)
        if (error) throw new BookStorageError('budget-funds', error)
      }
    }
    let recovery = null
    if (raw !== null && !latest) recovery = { key: archiveOriginal(raw), raw }
    const serialized = JSON.stringify(saved)
    localStorage.setItem(STORAGE_KEY, serialized)
    return { data: saved, raw: serialized, recovery }
  })
}
