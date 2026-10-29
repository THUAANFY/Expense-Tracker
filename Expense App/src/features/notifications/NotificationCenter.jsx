import { useEffect, useId, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  CheckCheck,
  CircleAlert,
  NotebookPen,
  PieChart,
  Wallet,
  X,
} from 'lucide-react'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import OverviewArt from '../overview/OverviewArt'
import { FieldPopover, useFieldPopover } from '../../shared/components/FieldPopover'
import useNotifications from './useNotifications'
import { dateKey } from '../../shared/storage/data'
import './NotificationCenter.css'

const formatTime = (timestamp, now) => {
  const date = new Date(timestamp)
  const day =
    dateKey(date) === dateKey(now)
      ? 'Hôm nay'
      : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  return `${day} · ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
}

export default function NotificationCenter({ data, storageError, onNavigate }) {
  const notifications = useNotifications(data, storageError)
  const popover = useFieldPopover({ width: 400 })
  const panelId = useId()
  const countId = useId()
  const [filter, setFilter] = useState('all')
  const { open, panelRef, triggerRef } = popover
  const { updatePosition } = popover
  useEffect(() => {
    if (open) panelRef.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [open, panelRef])
  useEffect(() => {
    if (!open || !panelRef.current) return
    const observer = new ResizeObserver(updatePosition)
    observer.observe(panelRef.current)
    return () => observer.disconnect()
  }, [open, panelRef, updatePosition])
  const visibleItems = notifications.items.filter((item) => filter === 'all' || item.unread)

  const leavePanel = (event) => {
    if (event.key !== 'Tab') return
    const controls = [
      ...panelRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled)'),
    ]
    const atStart = event.shiftKey && document.activeElement === controls[0]
    const atEnd = !event.shiftKey && document.activeElement === controls.at(-1)
    if (!atStart && !atEnd) return
    event.preventDefault()
    if (atStart) popover.close()
    else {
      const outsideControls = [
        ...document.querySelectorAll('button, input, a[href], select, textarea'),
      ].filter(
        (element) =>
          !panelRef.current.contains(element) &&
          !element.disabled &&
          !element.closest('[inert]') &&
          element.getClientRects().length,
      )
      const next = outsideControls[outsideControls.indexOf(triggerRef.current) + 1]
      popover.close(false)
      ;(next || triggerRef.current)?.focus({ preventScroll: true })
    }
  }
  return (
    <>
      <button
        ref={triggerRef}
        className={`icon-button notification-center-trigger ${open ? 'is-open' : ''}`}
        aria-label="Thông báo"
        aria-describedby={countId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? popover.close(false) : popover.show())}
      >
        <Bell size={19} />
        {notifications.unreadCount > 0 && (
          <span className="notification-center-badge" aria-hidden="true">
            {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
          </span>
        )}
      </button>
      <span id={countId} className="sr-only">
        {notifications.unreadCount} thông báo chưa đọc
      </span>
      <FieldPopover
        popover={popover}
        id={panelId}
        role="dialog"
        aria-label="Thông báo của bạn"
        className="notification-center-panel"
        onKeyDown={leavePanel}
      >
        <div className="notification-center-header">
          <span className="notification-header-icon" aria-hidden="true">
            <Bell size={19} />
          </span>
          <div>
            <h2>Hộp thư nhỏ</h2>
            <p>
              {notifications.unreadCount
                ? `${notifications.unreadCount} lời nhắc đang chờ bạn`
                : 'Một góc nhắc bạn nhẹ nhàng'}
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Đóng thông báo"
            onClick={() => popover.close()}
          >
            <X size={17} />
          </button>
        </div>
        <div className="notification-center-toolbar">
          <div role="group" aria-label="Lọc thông báo">
            <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              Tất cả
            </button>
            <button aria-pressed={filter === 'unread'} onClick={() => setFilter('unread')}>
              Chưa đọc <span aria-hidden="true">{notifications.unreadCount}</span>
            </button>
          </div>
          <button
            className="notification-read-all"
            aria-label="Đánh dấu tất cả đã đọc"
            disabled={!notifications.unreadCount}
            onClick={notifications.markAllRead}
          >
            <CheckCheck size={14} />
            <span>Đọc tất cả</span>
          </button>
        </div>
        <div className="notification-center-list">
          {visibleItems.length ? (
            <ul>
              {visibleItems.map((item) => {
                const Icon =
                  item.kind === 'error' || item.kind === 'over'
                    ? CircleAlert
                    : item.kind === 'summary'
                      ? PieChart
                      : item.kind === 'reminder'
                        ? NotebookPen
                        : Wallet
                return (
                  <li key={item.id} data-kind={item.kind} data-unread={item.unread}>
                    <button
                      className="notification-card"
                      onClick={() => {
                        notifications.markRead([item.id])
                        popover.close()
                        onNavigate(item.target)
                      }}
                    >
                      <span className="notification-item-icon" aria-hidden="true">
                        {item.category ? (
                          <CategoryArt category={item.category} size={31} />
                        ) : (
                          <Icon size={18} />
                        )}
                      </span>
                      <span className="notification-item-copy">
                        <span className="notification-item-title">
                          <strong>{item.title}</strong>
                          {item.unread && (
                            <span>
                              Mới<span className="sr-only">, chưa đọc</span>
                            </span>
                          )}
                        </span>
                        <span className="notification-item-description">{item.description}</span>
                        <span className="notification-item-meta">
                          <time dateTime={new Date(item.firstSeen).toISOString()}>
                            {formatTime(item.firstSeen, notifications.now)}
                          </time>
                          <span>
                            {item.actionLabel}
                            <ArrowUpRight size={12} aria-hidden="true" />
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="notification-empty">
              <OverviewArt variant="cloud" className="notification-empty-art" />
              <h3>{filter === 'unread' ? 'Đã xem hết rồi!' : 'Mọi thứ đang nhẹ nhàng'}</h3>
              <p>
                {filter === 'unread'
                  ? 'Bạn có thể xem lại các lời nhắc trong mục Tất cả.'
                  : 'Mây sẽ nhắc khi ngân sách hoặc sổ chi tiêu có điều cần chú ý.'}
              </p>
            </div>
          )}
        </div>
        {notifications.persistenceError && (
          <p className="notification-save-error" role="status">
            Trạng thái thông báo chưa lưu được trên thiết bị.
          </p>
        )}
        <label className="notification-reminder-setting">
          <span>
            <strong>Nhắc ghi chép</strong>
            <span>Sau 3 ngày chưa ghi giao dịch</span>
          </span>
          <input
            type="checkbox"
            aria-label="Nhắc ghi chép"
            checked={notifications.remindersEnabled}
            onChange={(event) => notifications.setRemindersEnabled(event.target.checked)}
          />
        </label>
      </FieldPopover>
    </>
  )
}
