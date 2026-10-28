import { useId } from 'react'

export default function SourceLedgerArt() {
  const id = useId().replaceAll(':', '')
  return (
    <svg className="source-ledger-illustration" viewBox="0 0 116 88" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="32" y1="17" x2="80" y2="77" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffef6" />
          <stop offset="1" stopColor="#f5ecfb" />
        </linearGradient>
      </defs>
      <ellipse cx="58" cy="81" rx="40" ry="4" fill="#b89acb" opacity=".13" />
      <circle cx="57" cy="44" r="35" fill="#eee3f7" opacity=".6" />
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
        <g transform="rotate(8 81 23)" stroke="#c5a164">
          <circle cx="86" cy="20" r="12" fill="#f5d990" />
          <circle cx="86" cy="20" r="9" fill="#fff0bf" strokeDasharray="1 2.4" />
          <path d="M83 16h5m-6 4h5m-3-7v13" />
        </g>
        <g transform="rotate(-7 55 46)" stroke="#a78cb8">
          <rect x="27" y="16" width="55" height="62" rx="7" fill="#dbc8ec" />
          <path d="M34 19h44v55H34" fill="#fffdf9" />
          <rect x="24" y="13" width="55" height="61" rx="6" fill={`url(#${id})`} />
          <path d="M35 15v57" stroke="#d9c4e6" />
          {[24, 36, 48, 60].map((y) => (
            <g key={y}>
              <circle cx="29" cy={y} r="1.6" fill="#c6acd8" stroke="none" />
              <path d={`M29 ${y}c-10 2-10-7-1-6`} stroke="#b39bc7" />
            </g>
          ))}
          <path d="M42 24h24" stroke="#c7b0d7" strokeWidth="2.5" />
          <path d="M42 29h15" stroke="#d8c8e4" />
          <rect x="41" y="36" width="7" height="7" rx="2" fill="#dcebd4" stroke="#97b38b" />
          <path d="m43 39 1.4 1.3 2.2-2.6" stroke="#7f9e70" />
          <path d="M53 38h14m-14 4h9" stroke="#cdbcd8" />
          <rect x="41" y="49" width="7" height="7" rx="2" fill="#f7e0d1" stroke="#c8a287" />
          <path d="M43 52.5h3" stroke="#b68a6d" />
          <path d="M53 51h14m-14 4h9" stroke="#cdbcd8" />
          <path d="M47 63q2-2 4 0m9 0q2-2 4 0m-11 3q3 3 6 0" stroke="#a387b3" />
          <path d="M45 66h3m15 0h3" stroke="#e1b7cc" strokeWidth="2" />
        </g>
        <g transform="rotate(23 88 52)" stroke="#b48e71">
          <path d="M85 30h6v33l-3 7-3-7V30Z" fill="#f6ddbe" />
          <path d="M85 30v-4a3 3 0 0 1 6 0v4" fill="#e9c4d3" />
          <path d="M85 34h6m-3 2v25m-3 2h6m-3 7v-3" />
        </g>
        <path
          d="m15 31 1.5 4.5L21 37l-4.5 1.5L15 43l-1.5-4.5L9 37l4.5-1.5L15 31Z"
          fill="#fae5b0"
          stroke="#c9aa6d"
        />
        <path d="m103 49 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#e4d4f1" stroke="#b99bcf" />
        <path d="M91 77c0-7 5-11 11-11 0 6-4 10-11 11Z" fill="#dce8cf" stroke="#9fb48c" />
        <path d="m91 77 7-7" stroke="#9fb48c" />
      </g>
    </svg>
  )
}
