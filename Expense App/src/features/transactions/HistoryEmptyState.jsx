import { useId } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import './HistoryEmptyState.css'

function EmptyJournalArt({ searching }) {
  return (
    <svg
      className="history-empty-art"
      viewBox="0 0 200 152"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M31 79C19 49 48 22 78 30c22-19 61-9 65 14 29 3 38 35 17 54 4 24-20 38-47 31H62C36 134 15 105 31 79Z"
        fill="#f3edf8"
      />
      <circle cx="146" cy="42" r="23" fill="#fff1d8" />
      <ellipse cx="99" cy="139" rx="74" ry="4" fill="#d5c4e4" opacity=".27" />
      <g strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#aa8bbd">
          <path
            d="M85 51C75 39 77 13 86 14c9 0 13 24 12 32m15-1c0-17 7-35 15-32 9 4-1 26-7 35"
            fill="#fffdf5"
          />
          <path d="M86 24c0 6 2 12 4 17m32-17-4 15" stroke="#e8bfd0" strokeWidth="3.5" />
          <path
            d="M77 64c-1-17 12-26 26-25 17-2 30 11 28 27-1 17-12 26-28 25-17 1-28-11-26-27Z"
            fill="#fffdf5"
          />
          <path d="M92 57v2m22-2v2m-14 6 3 2 3-2m-3 2v3m-5 0q2 3 5 0 3 3 5 0" stroke="#8c699f" />
          <path d="M86 65h5m24 0h5" stroke="#e9bccb" strokeWidth="3.5" />
        </g>
        <g transform="rotate(-5 88 104)">
          <path
            d="M31 74c18-5 36-4 55 4 20-8 38-9 57-4l3 57c-20-4-40-3-58 4-18-7-39-8-58-4l1-57Z"
            fill="#dbc6e9"
            stroke="#a989bd"
          />
          <path
            d="M34 68c17-4 35-2 52 5 17-7 36-9 53-5l3 57c-18-4-37-2-55 4-17-6-36-8-54-4l1-57Z"
            fill="#fffdf7"
            stroke="#b398c5"
          />
          <path d="M86 74v54" stroke="#d2bddf" />
          <path
            d="M43 83q15-1 31 4m-31 6q15 0 31 4m-31 6q10 0 20 2m35-17q14-4 28-4m-28 14q14-4 28-4m-28 14q10-3 18-3"
            stroke="#ddcfe5"
          />
          <path d="M101 71v18l5-3 5 3V69" fill="#ebc1d1" stroke="#c59ab3" />
          <path d="M53 113c-3-4 2-7 4-3 3-3 7 1 3 4l-4 3-3-4Z" fill="#e8d5f3" stroke="#b49ac6" />
          <path d="M117 116h.1m5-1h.1m5-1h.1" stroke="#c9aed8" strokeWidth="2.5" />
        </g>
        {searching ? (
          <g className="history-empty-magnifier">
            <path d="m159 106 16 18" stroke="#a082b7" strokeWidth="9" />
            <path d="m160 107 13 15" stroke="#d1b9e2" strokeWidth="3" />
            <circle cx="148" cy="91" r="22" fill="#e5d7f1" stroke="#a082b7" strokeWidth="2" />
            <circle cx="148" cy="91" r="17" fill="#fcf9ff" stroke="#cbb4df" />
            <path d="M138 87c1-5 6-8 11-8" stroke="#e6d9f0" strokeWidth="3" />
            <path d="M143 94h.1m5 0h.1m5 0h.1" stroke="#b094c5" strokeWidth="2.5" />
          </g>
        ) : (
          <g transform="rotate(19 156 93)" stroke="#b49770">
            <path d="M152 62h10v60l-5 10-5-10V62Z" fill="#ffe5b0" />
            <path d="M152 62v-7a5 5 0 0 1 10 0v7" fill="#e9c3d5" />
            <path d="M152 67h10m-5 5v44m-5 6h10m-5 10v-5" />
            <path d="M154 73v40" stroke="#fff5d9" strokeWidth="2" />
          </g>
        )}
        <path d="M78 85c-6-8-15-2-11 5 4 5 11 1 11-5Z" fill="#fffdf5" stroke="#aa8bbd" />
        <path
          d="M24 128v-17m0 9c-9 0-13-6-10-10 5-2 10 6 10 10Zm1-7c0-8 7-13 10-9 2 4-4 9-10 9Z"
          fill="#d7e7ce"
          stroke="#9eb28f"
        />
        <path d="m37 40 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#ffe9b8" stroke="#cfb07c" />
        <path
          d="m165 45 1.4 3.6L170 50l-3.6 1.4L165 55l-1.4-3.6L160 50l3.6-1.4L165 45Z"
          fill="#edcfde"
          stroke="#c59bb5"
        />
        <path d="M160 22c-3-4-7 1-3 4l4 3 4-4c3-4-2-7-5-3Z" fill="#edccdb" stroke="#c59bb5" />
        <circle cx="54" cy="25" r="2" fill="#cdb4df" stroke="none" />
      </g>
    </svg>
  )
}

export default function HistoryEmptyState({ hasFilters, onClearFilters, onAdd }) {
  const titleId = useId()
  return (
    <section className="history-empty" aria-labelledby={titleId}>
      <EmptyJournalArt searching={hasFilters} />
      <div className="history-empty-copy">
        <h3 id={titleId}>{hasFilters ? 'Chưa có giao dịch phù hợp' : 'Một trang sổ còn trống'}</h3>
        <p>
          {hasFilters
            ? 'Thử từ khóa khác hoặc xóa bộ lọc nhé.'
            : 'Tháng đang xem chưa có giao dịch.'}
        </p>
        <div className="history-empty-actions">
          {hasFilters ? (
            <>
              <button
                className="button primary"
                type="button"
                onClick={onClearFilters}
                aria-label="Xóa bộ lọc trong lịch sử"
              >
                <RotateCcw size={14} aria-hidden="true" /> Xóa bộ lọc
              </button>
              <button
                className="history-empty-add"
                type="button"
                onClick={onAdd}
                aria-label="Thêm giao dịch mới"
              >
                <Plus size={14} aria-hidden="true" /> Ghi mới
              </button>
            </>
          ) : (
            <button className="button primary" type="button" onClick={onAdd}>
              <Plus size={14} aria-hidden="true" /> Thêm giao dịch
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
