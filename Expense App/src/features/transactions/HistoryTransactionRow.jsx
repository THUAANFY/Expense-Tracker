import { useId, useLayoutEffect, useState } from 'react'
import { Check, Copy, Eye, FileText, MoreHorizontal, PencilLine } from 'lucide-react'
import { DARK_CATEGORY_COLORS } from '../../app/theme/palette'
import { FieldPopover, useFieldPopover } from '../../shared/components/FieldPopover'
import HistoryCategoryArt from './HistoryCategoryArt'
import { isClosedMonth } from '../../shared/lib/closedMonths'
import { formatDate, getCategory, money } from '../../shared/storage/data'
import SourceBadge from '../money-sources/SourceBadge'
import { getMoneySource, sourceName } from '../money-sources/moneySources'

function HistoryRowActions({ item, moneySources, onOpen }) {
  const popover = useFieldPopover({ width: 224 })
  const id = useId()
  const readOnly = isClosedMonth(item.date)
  const [copyState, setCopyState] = useState('idle')
  useLayoutEffect(() => {
    if (!popover.open) return
    setCopyState('idle')
    popover.panelRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [popover.open, popover.panelRef])
  const open = () => {
    popover.close(false)
    onOpen(item)
  }
  const copy = async () => {
    const text = [
      item.title,
      `${item.type === 'income' ? '+' : '−'}${money(item.amount)} · ${item.type === 'income' ? 'Thu nhập' : getCategory(item.category).name}`,
      `Ngày: ${formatDate(item.date)}`,
      `Nguồn tiền: ${sourceName(moneySources, item.sourceId)}`,
      `Thanh toán: ${item.wallet}`,
      ...(item.note ? [`Ghi chú: ${item.note}`] : []),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('done')
    } catch {
      setCopyState('error')
    }
  }
  return (
    <>
      <button
        type="button"
        className="history-row-edit"
        onClick={open}
        aria-label={`${readOnly ? 'Xem' : 'Sửa'} chi tiết giao dịch ${item.title}`}
      >
        {readOnly ? (
          <Eye size={16} aria-hidden="true" />
        ) : (
          <PencilLine size={16} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className="history-row-more"
        ref={popover.triggerRef}
        aria-label={`Thao tác giao dịch ${item.title}`}
        aria-haspopup="menu"
        aria-expanded={popover.open}
        aria-controls={popover.open ? id : undefined}
        onClick={() => (popover.open ? popover.close() : popover.show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            popover.show()
          }
        }}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      <FieldPopover
        popover={popover}
        id={id}
        className="history-row-menu"
        role="menu"
        aria-label={`Thao tác giao dịch ${item.title}`}
        onKeyDown={(event) => {
          const items = [...event.currentTarget.querySelectorAll('[role="menuitem"]')]
          const index = items.indexOf(document.activeElement)
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            const next =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
            items[next]?.focus()
          }
          if (event.key === 'Tab') popover.close(false)
        }}
      >
        <button type="button" role="menuitem" onClick={open}>
          {readOnly ? <Eye size={16} /> : <PencilLine size={16} />}
          {readOnly ? 'Xem chi tiết' : 'Sửa giao dịch'}
        </button>
        <button type="button" role="menuitem" onClick={copy}>
          {copyState === 'done' ? <Check size={16} /> : <Copy size={16} />}
          {copyState === 'done' ? 'Đã sao chép' : 'Sao chép nội dung'}
        </button>
        {copyState === 'error' && (
          <p role="alert">Chưa sao chép được. Bạn có thể mở chi tiết để xem giao dịch.</p>
        )}
        <span className="sr-only" role="status">
          {copyState === 'done' ? 'Đã sao chép nội dung giao dịch' : ''}
        </span>
      </FieldPopover>
    </>
  )
}

export default function HistoryTransactionRow({
  item,
  moneySources,
  onOpen,
  rowRef,
  highlighted,
  showDate,
  artPrefix,
}) {
  const income = item.type === 'income'
  const category = getCategory(item.category)
  const kind = income ? 'income' : category.id
  const readOnly = isClosedMonth(item.date)
  return (
    <div
      className={`transaction-row history-transaction-row ${item.amount >= 1e9 ? 'has-long-amount' : ''}`}
      data-transaction-id={item.id}
      data-highlighted={highlighted || undefined}
      data-type={item.type}
      style={{
        '--history-row-accent': DARK_CATEGORY_COLORS[kind],
        '--history-row-flow': income ? '#5ed6ad' : '#ff789d',
      }}
    >
      <button
        type="button"
        className="history-row-open"
        ref={rowRef}
        onClick={() => onOpen(item)}
        aria-label={`${readOnly ? 'Xem' : 'Sửa'} giao dịch ${item.title}, ${money(item.amount)}, ${formatDate(item.date)}`}
      >
        <span className="transaction-main">
          <span className="history-row-art" aria-hidden="true">
            <HistoryCategoryArt prefix={artPrefix} category={kind} size={46} />
          </span>
          <span className="transaction-copy">
            <strong title={item.title}>{item.title}</strong>
            <span className="transaction-meta">
              <SourceBadge
                type={getMoneySource(moneySources, item.sourceId)?.type}
                label={sourceName(moneySources, item.sourceId)}
                size="small"
                className="transaction-wallet"
              />
              <span className="transaction-payment" title={item.wallet}>
                · {item.wallet}
              </span>
              {showDate && (
                <time className="history-row-date" dateTime={item.date}>
                  · {formatDate(item.date)}
                </time>
              )}
              {item.note && (
                <>
                  <span className="transaction-meta-dot" aria-hidden="true" />
                  <span className="transaction-note" title={item.note}>
                    <FileText size={12} aria-hidden="true" />
                    <span>{item.note}</span>
                  </span>
                </>
              )}
            </span>
          </span>
        </span>
        <span className="history-category-badge">
          <HistoryCategoryArt prefix={artPrefix} category={kind} size={20} />
          <span>{income ? 'Thu nhập' : category.name}</span>
        </span>
        <strong
          className={`transaction-amount ${income ? 'income-text' : ''}`}
          title={`${income ? '+' : '−'}${money(item.amount)}`}
        >
          <span>
            {income ? '+' : '−'}
            {money(item.amount)}
          </span>
        </strong>
      </button>
      <HistoryRowActions item={item} moneySources={moneySources} onOpen={onOpen} />
    </div>
  )
}
