import { useId } from 'react'
import { Plus } from 'lucide-react'
import './RecentTransactionsEmpty.css'

function FirstReceiptArt({ id }) {
  return (
    <svg
      className="recent-empty-art"
      viewBox="0 0 180 144"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-paper`}
          x1="60"
          y1="23"
          x2="87"
          y2="117"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef9" />
          <stop offset="1" stopColor="#fff0d9" />
        </linearGradient>
      </defs>
      <path
        d="M30 68C22 41 46 24 70 28c21-18 51-11 61 7 25 3 37 30 21 49 7 23-10 44-36 41H64C35 129 13 98 30 68Z"
        fill="#f4ecf9"
      />
      <circle cx="132" cy="48" r="22" fill="#fff1d6" />
      <ellipse cx="88" cy="132" rx="62" ry="3.5" fill="#d7c6e5" opacity=".3" />
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(9 109 79)">
          <rect x="91" y="39" width="37" height="81" rx="5" fill="#decaec" stroke="#b59ac6" />
          <rect x="95" y="36" width="32" height="80" rx="4" fill="#fbf6ff" stroke="#c1a9d0" />
          <path d="M101 48h19m-19 7h14m-14 8h18m-18 35h18m-18 7h12" stroke="#decee8" />
          <path d="M110 37v16l4-3 4 3V37" fill="#ebc5d5" stroke="#c49ab3" />
        </g>
        <ellipse cx="55" cy="122" rx="9" ry="4.5" fill="#fff6e7" stroke="#bb9abd" />
        <ellipse cx="83" cy="122" rx="9" ry="4.5" fill="#fff6e7" stroke="#bb9abd" />
        <path
          d="M40 27a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v91l-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3V27Z"
          fill={`url(#${id}-paper)`}
          stroke="#b397bf"
        />
        <path d="M45 30v72" stroke="#fff" strokeWidth="2.5" />
        <path d="M51 39h36m-36 7h25" stroke="#d4bed6" />
        <path d="M47 57h45m-42 48h40" stroke="#d7c0d5" strokeDasharray="2 3" />
        <path d="M57 69v2m25-2v2m-18 8q6 6 12 0" stroke="#96749f" strokeWidth="1.8" />
        <path d="M50 76h5m30 0h5" stroke="#e9b9c9" strokeWidth="3.5" />
        <path d="M55 92h29m-24 6h18" stroke="#d7c0d5" />
        <path d="M40 81c-10-7-18 5-8 11 6 3 11-3 8-11Z" fill="#fff8ec" stroke="#b397bf" />
        <g className="recent-empty-pencil">
          <g transform="rotate(17 129 84)" stroke="#b1946c">
            <path d="M124 53h10v63l-5 11-5-11V53Z" fill="#ffe0a4" />
            <path d="M124 53v-7a5 5 0 0 1 10 0v7" fill="#e9bfd1" />
            <path d="M124 58h10m-5 7v46m-5 5h10m-5 11v-5" />
            <path d="M126 66v41" stroke="#fff4d6" strokeWidth="2" />
          </g>
        </g>
        <path
          d="M100 85c8-9 23-5 27 3 3 6-4 11-10 9-7-2-14-5-17-12Z"
          fill="#fff8ec"
          stroke="#b397bf"
        />
        <circle cx="147" cy="122" r="8" fill="#ffe7aa" stroke="#c7a76f" />
        <circle cx="147" cy="122" r="5.3" stroke="#dfc28b" strokeDasharray="1 2" />
        <path d="m144 122 2 2 4-4" stroke="#b0935d" />
        <path
          d="M24 125v-17m0 10c-9 0-13-7-9-10 5-2 9 6 9 10Zm1-7c0-8 7-12 10-8 2 4-4 8-10 8Z"
          fill="#d4e5cc"
          stroke="#98af89"
        />
        <path
          d="m146 24 1.6 4.4L152 30l-4.4 1.6L146 36l-1.6-4.4L140 30l4.4-1.6L146 24Z"
          fill="#ffe8ae"
          stroke="#c9a977"
        />
        <path d="M27 56c-3-4-8 1-3 5l4 2 3-3c4-4-1-8-4-4Z" fill="#edc8d9" stroke="#bf97af" />
        <path d="m151 97 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#e1d0ee" stroke="#b99dcb" />
        <circle cx="30" cy="34" r="2" fill="#c9afdb" stroke="none" />
      </g>
    </svg>
  )
}

export default function RecentTransactionsEmpty({ onAdd }) {
  const id = useId().replaceAll(':', '')
  return (
    <section className="recent-empty" aria-labelledby={`${id}-title`}>
      <FirstReceiptArt id={id} />
      <div className="recent-empty-copy">
        <h3 id={`${id}-title`}>Chưa có giao dịch trong tháng</h3>
        <p>Bắt đầu với một khoản thu hoặc chi.</p>
        <button className="button primary" type="button" onClick={onAdd}>
          <Plus size={14} aria-hidden="true" /> Thêm giao dịch
        </button>
      </div>
    </section>
  )
}
