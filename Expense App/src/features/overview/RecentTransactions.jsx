import { useId, useLayoutEffect } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Eye,
  FileText,
  History,
  MoreVertical,
  PencilLine,
} from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import { DARK_CATEGORY_COLORS } from '../../app/theme/palette'
import FintechStatIcon from '../../app/theme/FintechStatIcon'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import { FieldPopover, useFieldPopover } from '../../shared/components/FieldPopover'
import { isClosedMonth } from '../../shared/lib/closedMonths'
import { compactMoney, formatDate, getCategory, money } from '../../shared/storage/data'
import SourceBadge from '../money-sources/SourceBadge'
import { getMoneySource, sourceName } from '../money-sources/moneySources'
import OverviewArt from './OverviewArt'
import RecentTransactionsEmpty from './RecentTransactionsEmpty'
import './RecentTransactions.css'

function TransactionActions({ item, onEdit, onLocate }) {
  const popover = useFieldPopover({ width: 224 })
  const id = useId()
  const readOnly = isClosedMonth(item.date)
  useLayoutEffect(() => {
    if (popover.open) popover.panelRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [popover.open, popover.panelRef])
  const choose = (action) => {
    popover.close(false)
    action()
  }
  return (
    <>
      <button
        type="button"
        className="recent-row-actions"
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
        <MoreVertical size={18} aria-hidden="true" />
      </button>
      <FieldPopover
        popover={popover}
        id={id}
        className="recent-transaction-menu"
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
        <button type="button" role="menuitem" onClick={() => choose(() => onEdit(item))}>
          {readOnly ? <Eye size={16} /> : <PencilLine size={16} />}
          {readOnly ? 'Xem giao dịch' : 'Sửa giao dịch'}
        </button>
        <button type="button" role="menuitem" onClick={() => choose(() => onLocate(item.id))}>
          <History size={16} />
          Xem trong lịch sử
        </button>
      </FieldPopover>
    </>
  )
}

function RecentTransaction({ item, moneySources, onEdit, onLocate }) {
  const income = item.type === 'income'
  const category = getCategory(item.category)
  const kind = income ? 'income' : category.id
  const readOnly = isClosedMonth(item.date)
  const compact =
    item.amount >= 1e9
      ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(item.amount / 1e9)} tỷ`
      : compactMoney(item.amount)
  return (
    <div
      className="transaction-row recent-transaction-row"
      data-transaction-id={item.id}
      data-type={item.type}
      style={{ '--recent-accent': DARK_CATEGORY_COLORS[kind] }}
    >
      <button
        type="button"
        className="recent-row-open"
        onClick={() => onEdit(item)}
        aria-label={`${readOnly ? 'Xem' : 'Sửa'} giao dịch ${item.title}, ${money(item.amount)}`}
      >
        <span className="transaction-main">
          <span className="transaction-art">
            <CategoryArt category={kind} size={48} />
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
        <span className="recent-category-badge">
          <CategoryArt category={kind} size={20} />
          <span>{income ? 'Thu nhập' : category.name}</span>
        </span>
        <span className="recent-transaction-date">
          <CalendarDays size={17} aria-hidden="true" />
          <span>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <small>{formatDate(item.date, { weekday: 'long' })}</small>
          </span>
        </span>
        <strong
          className={`transaction-amount ${income ? 'income-text' : ''} ${item.amount >= 1e9 ? 'is-long' : ''}`}
          title={`${income ? '+' : '−'}${money(item.amount)}`}
        >
          <span className="recent-amount-full">
            {income ? '+' : '−'}
            {money(item.amount)}
          </span>
          {item.amount >= 1e9 && (
            <span className="recent-amount-compact">
              {income ? '+' : '−'}
              {compact}
            </span>
          )}
        </strong>
      </button>
      <TransactionActions item={item} onEdit={onEdit} onLocate={onLocate} />
    </div>
  )
}

export default function RecentTransactions({
  transactions,
  total,
  moneySources,
  onEdit,
  onAdd,
  onViewAll,
  onLocate,
  children,
}) {
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  return (
    <section
      className={`panel recent-panel ${dark ? 'fintech-recent-panel' : ''}`}
      data-empty={transactions.length === 0 || undefined}
    >
      <div className="panel-heading">
        {dark ? (
          <div className="recent-panel-intro">
            <FintechStatIcon kind="income" />
            <div>
              <div className="heading-with-count">
                <h2>Giao dịch gần đây</h2>
                <span className="count-badge">{total}</span>
              </div>
              <p>Thu, chi mới nhất trong tháng.</p>
            </div>
          </div>
        ) : (
          <div className="heading-with-count">
            <OverviewArt variant="receipt" className="overview-heading-art" />
            <h2>Giao dịch gần đây</h2>
            <span className="count-badge">{total}</span>
          </div>
        )}
        <button
          className={dark ? 'recent-view-all' : 'text-button'}
          type="button"
          onClick={onViewAll}
          aria-label="Xem tất cả"
          title="Xem tất cả giao dịch"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={15} />
        </button>
      </div>
      {dark ? (
        transactions.length ? (
          <div className="transaction-table small recent-transactions-table">
            <div className="table-head recent-table-head" aria-hidden="true">
              <span>Giao dịch</span>
              <span>Danh mục</span>
              <span>
                <CalendarDays size={15} />
                Ngày
              </span>
              <span>Số tiền</span>
              <span />
            </div>
            {transactions.map((item) => (
              <RecentTransaction
                key={item.id}
                item={item}
                moneySources={moneySources}
                onEdit={onEdit}
                onLocate={onLocate}
              />
            ))}
          </div>
        ) : (
          <RecentTransactionsEmpty onAdd={onAdd} />
        )
      ) : (
        children
      )}
    </section>
  )
}
