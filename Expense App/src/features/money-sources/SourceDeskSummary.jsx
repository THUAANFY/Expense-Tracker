import { ArrowRight, ArrowUpRight, CalendarDays, Layers } from 'lucide-react'
import { formatDate, money } from '../../shared/storage/data'
import SourceSummaryArt from './SourceSummaryArt'
import './SourceDeskSummary.css'

export default function SourceDeskSummary({
  total,
  sourceCount,
  unassigned,
  asOf,
  onTransfer,
  onShowUnassigned,
}) {
  return (
    <section
      className={`sources-summary fintech-sources-summary ${unassigned > 0 ? 'has-unassigned' : ''} ${Math.abs(total) >= 1e10 ? 'has-large-total' : ''}`}
      aria-label="Tổng quan nguồn tiền"
    >
      <h2 className="fintech-desk-label">
        <span aria-hidden="true">
          <Layers size={20} />
        </span>
        Góc bàn của mây
      </h2>
      <div className="sources-total fintech-desk-total">
        <SourceSummaryArt variant="balance" />
        <span className="fintech-desk-caption">Tổng tiền đang theo dõi</span>
        <strong className={total < 0 ? 'is-negative' : ''} title={money(total)}>
          {money(total)}
        </strong>
        <p className="fintech-desk-meta">
          <span className="fintech-desk-count">
            <Layers size={13} aria-hidden="true" />
            {sourceCount} nguồn
          </span>
          <span className="fintech-desk-meta-dot" aria-hidden="true" />
          <span>
            <CalendarDays size={13} aria-hidden="true" />
            Tính đến {formatDate(asOf)}
          </span>
        </p>
      </div>
      <button
        className="fintech-desk-action fintech-desk-transfer"
        type="button"
        aria-label="Ghi chuyển nguồn"
        disabled={sourceCount < 2}
        onClick={onTransfer}
      >
        <SourceSummaryArt variant="transfer" />
        <span className="fintech-desk-action-copy">
          <strong className="fintech-desk-caption">Chuyển nguồn</strong>
          <span className="fintech-desk-description">
            {sourceCount < 2 ? 'Cần ít nhất 2 nguồn.' : 'Không đổi thu/chi.'}
          </span>
          <span className="fintech-desk-link">
            <span className="fintech-desk-link-label">Ghi chuyển</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </span>
      </button>
      {unassigned > 0 && (
        <button
          className="fintech-desk-action fintech-desk-pending"
          type="button"
          onClick={onShowUnassigned}
          aria-label={`${unassigned} giao dịch chưa gán nguồn · Gán dần`}
        >
          <span className="fintech-desk-pending-art" aria-hidden="true">
            <SourceSummaryArt variant="pending" />
            <span className="fintech-desk-pending-count">{unassigned}</span>
          </span>
          <span className="fintech-desk-action-copy">
            <strong className="fintech-desk-caption">Chưa gán nguồn</strong>
            <span className="fintech-desk-description">Chưa tính vào số dư.</span>
            <span className="fintech-desk-link">
              <span className="fintech-desk-link-label">Gán dần</span>
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </section>
  )
}
