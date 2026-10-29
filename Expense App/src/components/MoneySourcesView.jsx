import { useRef, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  Eye,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react'
import SourceArt from './SourceArt'
import { isClosedMonth } from '../closedMonths'
import SourceBadge from './SourceBadge'
import SourceCardsRail from './SourceCardsRail'
import SourceSummaryArt from './SourceSummaryArt'
import SourceLedgerArt from './SourceLedgerArt'
import CategoryArt from './CategoryArt'
import FilterSelect from './FilterSelect'
import { compactMoney, formatDate, getCategory, money } from '../data'
import {
  SOURCE_TYPES,
  getMoneySource,
  getSourceColor,
  sourceName,
  sourceSummary,
} from '../moneySources'
import './MoneySourcesView.css'

const normalize = (value) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('đ', 'd')
const PAGE_SIZE = 8
const LEDGER_KINDS = [
  { id: 'all', label: 'Tất cả', shortLabel: 'Tất cả', icon: WalletCards },
  { id: 'income', label: 'Khoản thu', shortLabel: 'Thu', icon: ArrowDownLeft },
  { id: 'expense', label: 'Khoản chi', shortLabel: 'Chi', icon: ArrowUpRight },
  { id: 'transfer', label: 'Chuyển nguồn', shortLabel: 'Chuyển', icon: ArrowLeftRight },
]

function LedgerSource({ sources, id }) {
  const source = getMoneySource(sources, id)
  return (
    <SourceBadge
      type={source?.type}
      label={sourceName(sources, id)}
      size="small"
      className="source-ledger-source"
    />
  )
}

export function OverviewMoneySources({ sources, transactions, transfers, asOf, onOpen, onCreate }) {
  const total = sources.reduce(
    (sum, source) => sum + sourceSummary(source, transactions, transfers, asOf).balance,
    0,
  )
  return (
    <button className="overview-sources" onClick={sources.length ? onOpen : onCreate}>
      <SourceArt type="cash" color="mint" />
      <span>
        <span className="overview-sources-label">
          Nguồn tiền <small>Đến {formatDate(asOf, { day: '2-digit', month: '2-digit' })}</small>
        </span>
        <strong>{sources.length ? money(total) : 'Bạn đang có tiền ở đâu?'}</strong>
      </span>
      <span className="overview-sources-link">
        {sources.length ? `${sources.length} nguồn · Xem chi tiết` : 'Thêm nguồn đầu tiên'}
        <ArrowRight size={15} />
      </span>
    </button>
  )
}

export default function MoneySourcesView({
  sources,
  transactions,
  transfers,
  asOf,
  onCreate,
  onEdit,
  onTransfer,
  onEditTransfer,
  onAddTransaction,
  onEditTransaction,
}) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [kind, setKind] = useState('all')
  const ledger = useRef(null)
  const summaries = sources.map((source) => ({
    source,
    ...sourceSummary(source, transactions, transfers, asOf),
  }))
  const total = summaries.reduce((sum, item) => sum + item.balance, 0)
  const unassigned = transactions.filter((item) => !item.sourceId).length
  const selectedSourceId = filter.startsWith('source:') ? filter.slice(7) : null
  const activeFilter =
    selectedSourceId && !getMoneySource(sources, selectedSourceId) ? 'all' : filter
  const sourceId = activeFilter.startsWith('source:') ? activeFilter.slice(7) : null
  const financial = transactions
    .filter(
      (item) =>
        activeFilter === 'all' ||
        (activeFilter === 'unassigned' ? !item.sourceId : item.sourceId === sourceId),
    )
    .map((item) => ({ ...item, kind: 'transaction' }))
  const movements = transfers
    .filter(
      (item) =>
        activeFilter !== 'unassigned' &&
        (!sourceId || item.fromSourceId === sourceId || item.toSourceId === sourceId),
    )
    .map((item) => ({
      ...item,
      kind: 'transfer',
      title: `${sourceName(sources, item.fromSourceId)} → ${sourceName(sources, item.toSourceId)}`,
    }))
  const matchingEntries = [...financial, ...movements]
    .filter((item) =>
      normalize(
        `${item.title} ${item.note} ${item.date} ${item.kind === 'transaction' ? `${sourceName(sources, item.sourceId)} ${item.type === 'income' ? 'Thu nhập' : getCategory(item.category).name}` : 'Chuyển nguồn'}`,
      ).includes(normalize(search)),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  const entryKind = (item) => (item.kind === 'transfer' ? 'transfer' : item.type)
  const entries = matchingEntries.filter((item) => kind === 'all' || entryKind(item) === kind)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(entries.length / PAGE_SIZE)))
  const pageGroups = []
  for (const item of entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)) {
    const previous = pageGroups.at(-1)
    if (previous?.date === item.date) previous.items.push(item)
    else pageGroups.push({ date: item.date, items: [item] })
  }
  function showUnassigned() {
    setFilter('unassigned')
    setSearch('')
    setKind('all')
    setPage(1)
    requestAnimationFrame(() => {
      ledger.current?.focus({ preventScroll: true })
      ledger.current?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    })
  }
  return (
    <div className="sources-workspace">
      <section
        className={`sources-summary ${unassigned > 0 ? 'has-unassigned' : ''}`}
        aria-label="Tổng quan nguồn tiền"
      >
        <h2 className="sources-desk-title">
          <Sparkles size={13} aria-hidden="true" /> Góc bàn của mây
        </h2>
        <div className="sources-total">
          <SourceSummaryArt variant="balance" />
          <span className="sources-summary-caption">Tổng tiền đang theo dõi</span>
          <strong className={total < 0 ? 'is-negative' : ''}>{money(total)}</strong>
          <p>
            <span className="sources-summary-source-count">{sources.length} nguồn</span>
            <span>Tính đến {formatDate(asOf)}</span>
          </p>
        </div>
        <button
          className="sources-transfer-action"
          type="button"
          aria-label="Ghi chuyển nguồn"
          disabled={sources.length < 2}
          onClick={() => onTransfer()}
        >
          <SourceSummaryArt variant="transfer" />
          <span className="sources-transfer-copy">
            <span className="sources-summary-caption">Chuyển nguồn</span>
            <span className="sources-transfer-description">
              {sources.length < 2 ? 'Cần ít nhất 2 nguồn.' : 'Không đổi thu/chi.'}
            </span>
            <span className="sources-desk-link">
              <span>Ghi chuyển</span> <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </span>
        </button>
        {unassigned > 0 && (
          <button
            className="sources-unassigned"
            type="button"
            onClick={showUnassigned}
            aria-label={`${unassigned} giao dịch chưa gán nguồn · Gán dần`}
          >
            <span className="sources-unassigned-art" aria-hidden="true">
              <SourceSummaryArt variant="pending" />
              <span className="sources-unassigned-count">{unassigned}</span>
            </span>
            <span className="sources-unassigned-copy">
              <span className="sources-unassigned-heading">
                <strong>Chưa gán nguồn</strong>
              </span>
              <span className="sources-unassigned-description">Chưa tính vào số dư.</span>
              <span className="sources-desk-link">
                <span>Gán dần</span> <ArrowRight size={13} aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </section>
      {sources.length ? (
        <SourceCardsRail sourceIds={sources.map((source) => source.id)}>
          {summaries.map(
            ({
              source,
              balance,
              income,
              expense,
              transferredIn,
              transferredOut,
              beforeOpening,
              upcoming,
            }) => {
              const c = getSourceColor(source.color)
              const netTransfer = transferredIn - transferredOut
              return (
                <article
                  className={`source-card ${balance < 0 ? 'is-overdrawn' : ''}`}
                  key={source.id}
                  data-source-id={source.id}
                  data-source-type={source.type}
                  style={{
                    '--source-paper': c.paper,
                    '--source-border': c.border,
                    '--source-fill': c.fill,
                    '--source-ink': c.ink,
                  }}
                >
                  <div className="source-card-topline">
                    <SourceBadge type={source.type} />
                    <button
                      className="source-edit"
                      aria-label={`Sửa nguồn ${source.name}`}
                      onClick={() => onEdit(source)}
                    >
                      <PencilLine size={15} />
                    </button>
                  </div>
                  <div className="source-card-showcase">
                    <div className="source-card-identity">
                      <h2 title={source.name}>{source.name}</h2>
                      <span>Số dư hiện tại</span>
                    </div>
                    <div className="source-card-artwork">
                      <SourceArt type={source.type} color={source.color} />
                    </div>
                  </div>
                  <div className="source-card-balance">
                    <strong title={money(balance)} className={balance < 0 ? 'is-negative' : ''}>
                      {money(balance)}
                    </strong>
                    <span className="source-card-clasp" aria-hidden="true" />
                  </div>
                  <div className="source-card-pocket-wrap">
                    <div className="source-card-pocket">
                      <div className="source-card-flow">
                        <div className="source-card-income">
                          <span>
                            <ArrowDownLeft size={13} />
                            Thu đã ghi
                          </span>
                          <strong title={money(income)}>{compactMoney(income)}</strong>
                        </div>
                        <div>
                          <span>
                            <ArrowUpRight size={13} />
                            Chi đã ghi
                          </span>
                          <strong title={money(expense)}>{compactMoney(expense)}</strong>
                        </div>
                      </div>
                      <p className="source-card-transfer">
                        <span>
                          <ArrowLeftRight size={12} />
                          Chuyển nguồn
                        </span>
                        <strong
                          title={transferredIn || transferredOut ? money(netTransfer) : undefined}
                        >
                          {transferredIn || transferredOut
                            ? `${netTransfer > 0 ? '+' : netTransfer < 0 ? '−' : ''}${compactMoney(Math.abs(netTransfer))}`
                            : 'Chưa có'}
                        </strong>
                      </p>
                      <div className="source-card-actions">
                        <button
                          onClick={() => onAddTransaction(source, 'income')}
                          aria-label={`Ghi khoản thu vào ${source.name}`}
                        >
                          <Plus size={14} /> Ghi thu
                        </button>
                        <button
                          onClick={() => onAddTransaction(source, 'expense')}
                          aria-label={`Ghi khoản chi từ ${source.name}`}
                        >
                          <ArrowUpRight size={14} /> Ghi chi
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="source-card-opening">
                    Đầu {formatDate(source.openingDate)}:{' '}
                    <strong>{compactMoney(source.openingBalance)}</strong>
                  </p>
                  {balance < 0 && (
                    <p className="source-card-warning">
                      Số dư âm. Kiểm tra số dư đầu ngày hoặc khoản thu còn thiếu.
                    </p>
                  )}
                  {(beforeOpening > 0 || upcoming > 0) && (
                    <p className="source-card-excluded">
                      {beforeOpening > 0 ? `${beforeOpening} khoản trước mốc theo dõi` : ''}
                      {beforeOpening > 0 && upcoming > 0 ? ' · ' : ''}
                      {upcoming > 0 ? `${upcoming} khoản tương lai` : ''} chưa tính vào số dư.
                    </p>
                  )}
                </article>
              )
            },
          )}
        </SourceCardsRail>
      ) : (
        <section className="sources-empty" aria-label="Bắt đầu theo dõi nguồn tiền">
          <h2>Một chỗ cho từng nguồn tiền</h2>
          <p>Khai báo số dư đầu ngày, rồi gán khoản thu/chi để biết tiền đang ở đâu.</p>
          <div>
            {SOURCE_TYPES.map((type, index) => (
              <button
                key={type.id}
                onClick={() => onCreate(type.id)}
                aria-label={`Thêm nguồn ${type.label}`}
              >
                <SourceArt type={type.id} color={['mint', 'lilac', 'peach'][index]} />
                <strong>{type.label}</strong>
                <span>
                  <Plus size={13} /> Thêm nguồn
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      <section className="source-ledger" ref={ledger} tabIndex={-1} aria-label="Nhật ký nguồn tiền">
        <div className="source-ledger-heading">
          <div className="source-ledger-title">
            <SourceLedgerArt />
            <div>
              <span className="source-ledger-eyebrow">SỔ THU CHI CỦA BẠN</span>
              <h2>Nhật ký nguồn tiền</h2>
              <p>Tất cả thời gian · Chạm để chỉnh sửa.</p>
            </div>
          </div>
          <span className="source-ledger-count">
            <strong>{entries.length}</strong> bản ghi
          </span>
        </div>
        <div className="source-ledger-tools">
          <div className="source-ledger-search">
            <Search size={15} />
            <input
              aria-label="Tìm trong nguồn tiền"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Tìm giao dịch, ghi chú…"
            />
            {search && (
              <button
                aria-label="Xóa tìm kiếm nguồn tiền"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <FilterSelect
            label="Lọc nhật ký nguồn tiền"
            caption="NGUỒN TIỀN"
            value={activeFilter}
            onChange={(value) => {
              setFilter(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'Mọi nguồn', icon: WalletCards },
              { value: 'unassigned', label: 'Chưa gán nguồn', sourceType: 'unassigned' },
              ...sources.map((source) => ({
                value: `source:${source.id}`,
                label: source.name,
                sourceType: source.type,
              })),
            ]}
          />
        </div>
        <div className="source-ledger-filters" role="group" aria-label="Loại bản ghi nguồn tiền">
          {LEDGER_KINDS.map(({ id, label, shortLabel, icon: Icon }) => (
            <button
              key={id}
              className={`source-ledger-kind ${kind === id ? 'is-active' : ''}`}
              data-kind={id}
              aria-label={label}
              aria-pressed={kind === id}
              onClick={() => {
                setKind(id)
                setPage(1)
              }}
            >
              <Icon size={14} aria-hidden="true" />
              <span className="source-ledger-kind-label" aria-hidden="true">
                {label}
              </span>
              <span className="source-ledger-kind-short" aria-hidden="true">
                {shortLabel}
              </span>
              <small aria-hidden="true">
                {id === 'all'
                  ? matchingEntries.length
                  : matchingEntries.filter((item) => entryKind(item) === id).length}
              </small>
            </button>
          ))}
        </div>
        {entries.length > 0 && (
          <div className="source-ledger-columns" aria-hidden="true">
            <span>Khoản ghi chép</span>
            <span>Nguồn tiền</span>
            <span>Số tiền</span>
          </div>
        )}
        <div className="source-ledger-list">
          {pageGroups.map((group) => (
            <section
              className="source-ledger-day"
              key={group.date}
              aria-label={`Nhật ký ngày ${formatDate(group.date)}`}
            >
              <div className="source-ledger-date">
                <span className="source-ledger-date-stamp" aria-hidden="true">
                  {group.date.slice(8)}
                </span>
                <h3>
                  {group.date === asOf ? 'Hôm nay' : formatDate(group.date, { weekday: 'long' })}
                  <time dateTime={group.date}>{formatDate(group.date)}</time>
                </h3>
                <span className="source-ledger-date-rule" />
                <small>{group.items.length} khoản</small>
              </div>
              <div className="source-ledger-day-rows">
                {group.items.map((item) => {
                  const transfer = item.kind === 'transfer'
                  const source = getMoneySource(sources, item.sourceId)
                  const type = entryKind(item)
                  const state =
                    item.date > asOf
                      ? 'Dự kiến · chưa tính hôm nay'
                      : !transfer && !source
                        ? 'Chưa tính vào số dư'
                        : !transfer && item.date < source.openingDate
                          ? 'Trước mốc theo dõi · chưa tính'
                          : ''
                  const category =
                    item.type === 'income' ? 'Thu nhập' : getCategory(item.category).name
                  return (
                    <button
                      key={`${item.kind}:${item.id}`}
                      className="source-ledger-row"
                      data-kind={type}
                      data-transaction-id={transfer ? undefined : item.id}
                      data-transfer-id={transfer ? item.id : undefined}
                      aria-label={
                        isClosedMonth(item.date, asOf.slice(0, 7))
                          ? `Xem ${transfer ? 'chuyển nguồn' : 'giao dịch'} ${item.title}`
                          : transfer
                            ? `Sửa chuyển nguồn ${item.title}`
                            : `${source ? 'Sửa giao dịch' : 'Gán nguồn cho'} ${item.title}`
                      }
                      onClick={() =>
                        transfer
                          ? onEditTransfer(item)
                          : onEditTransaction(transactions.find((entry) => entry.id === item.id))
                      }
                    >
                      <span className="source-ledger-art" aria-hidden="true">
                        {transfer ? (
                          <ArrowLeftRight size={19} />
                        ) : (
                          <CategoryArt
                            category={item.type === 'income' ? 'income' : item.category}
                            size={30}
                          />
                        )}
                      </span>
                      <span className="source-ledger-copy">
                        <strong title={item.title}>
                          {transfer ? 'Chuyển giữa hai nguồn' : item.title}
                        </strong>
                        {(!transfer || item.note) && (
                          <span className="source-ledger-meta">
                            {!transfer && (
                              <span className="source-ledger-category">{category}</span>
                            )}
                            {item.note && (
                              <span className="source-ledger-note" title={item.note}>
                                <FileText size={11} aria-hidden="true" />
                                <span>{item.note}</span>
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                      <span className="source-ledger-origin">
                        {transfer ? (
                          <span className="source-ledger-route">
                            <span>
                              <small>Từ</small>
                              <LedgerSource sources={sources} id={item.fromSourceId} />
                            </span>
                            <span>
                              <small>Đến</small>
                              <LedgerSource sources={sources} id={item.toSourceId} />
                            </span>
                          </span>
                        ) : (
                          <LedgerSource sources={sources} id={item.sourceId} />
                        )}
                        {state && <small className="source-ledger-state">{state}</small>}
                      </span>
                      <span className="source-ledger-money">
                        <strong className="source-ledger-amount">
                          {transfer ? '' : item.type === 'income' ? '+' : '−'}
                          {money(item.amount)}
                        </strong>
                        <small>
                          {transfer
                            ? 'Chuyển nội bộ'
                            : item.type === 'income'
                              ? 'Tiền vào'
                              : 'Tiền ra'}
                        </small>
                      </span>
                      <span className="source-ledger-pencil" aria-hidden="true">
                        {isClosedMonth(item.date, asOf.slice(0, 7)) ? (
                          <Eye size={14} />
                        ) : (
                          <PencilLine size={14} />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
        {!entries.length && (
          <p className="source-ledger-empty">
            {search || kind !== 'all'
              ? 'Chưa tìm thấy bản ghi phù hợp.'
              : activeFilter === 'unassigned'
                ? 'Mọi giao dịch đã được gán nguồn.'
                : 'Những khoản thu, chi và chuyển nguồn sẽ xuất hiện ở đây.'}
          </p>
        )}
        {entries.length > PAGE_SIZE && (
          <div className="source-pagination">
            <span>
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, entries.length)} / {entries.length}
            </span>
            <div>
              <button
                aria-label="Trang nguồn tiền trước"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft size={15} />
              </button>
              <span>
                {currentPage}/{Math.ceil(entries.length / PAGE_SIZE)}
              </span>
              <button
                aria-label="Trang nguồn tiền sau"
                disabled={currentPage * PAGE_SIZE >= entries.length}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
