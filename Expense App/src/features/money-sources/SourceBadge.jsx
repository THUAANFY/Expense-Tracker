import { SOURCE_TYPES } from './moneySources'
import './SourceBadge.css'

const sourceLabels = {
  ...Object.fromEntries(SOURCE_TYPES.map(({ id, label }) => [id, label])),
  unassigned: 'Chưa gán nguồn',
}
const badgeType = (type) => (SOURCE_TYPES.some(({ id }) => id === type) ? type : 'unassigned')

export function SourceBadgeIcon({ type, size = 24 }) {
  const kind = badgeType(type)
  return (
    <svg
      className={`source-badge-icon source-badge-icon--${kind}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'bank' ? (
          <>
            <rect x="2.5" y="3" width="27" height="27" rx="9" fill="#dfeaf7" />
            <path d="m6 12 10-6 10 6H6Z" fill="#fffdf5" stroke="#6685a6" />
            <circle cx="16" cy="10" r="1.2" fill="#a1bdd5" />
            <path d="M8 14h16v11H8z" fill="#f9fcff" stroke="#8ca7bf" />
            <path d="M11 15v7m5-7v7m5-7v7M7 24h18m-19 3h20" stroke="#6685a6" />
            <path d="M9 16h4m1-1h4m1 1h4" stroke="#afc4d6" />
            <circle cx="25" cy="24" r="4.5" fill="#fff0c1" stroke="#c3a060" />
            <path d="M23.5 23h3m-3 2h2m-1-3.5v5" stroke="#b59555" strokeWidth="1" />
          </>
        ) : kind === 'cash' ? (
          <>
            <rect x="2" y="5" width="28" height="25" rx="9" fill="#e0edd5" />
            <g transform="rotate(-9 15 12)">
              <rect x="7" y="3" width="17" height="15" rx="2.5" fill="#edf4df" stroke="#8aa273" />
              <path d="M10 6h11v9H10z" stroke="#b9c9a5" strokeDasharray="1 2" />
              <ellipse cx="15.5" cy="10.5" rx="2.5" ry="3.5" fill="#d6e4c4" stroke="#a6b991" />
            </g>
            <rect x="3.5" y="12" width="25" height="16" rx="5" fill="#f6f9ec" stroke="#7f9b69" />
            <path d="M6 16v6a3 3 0 0 0 3 3h10" stroke="#b0c39b" strokeDasharray="1 2" />
            <path d="M24 17h5v7h-5a3.5 3.5 0 0 1 0-7Z" fill="#dbe9cc" stroke="#7f9b69" />
            <circle cx="25" cy="20.5" r="1" fill="#9db586" />
            <path d="M10 19q1.2-1.6 2.4 0m4 0q1.2-1.6 2.4 0m-5.5 3q1.5 1.5 3 0" stroke="#7f9b69" />
            <path d="M9 22h1m9 0h1" stroke="#e3b6b6" strokeWidth="2" />
          </>
        ) : kind === 'ewallet' ? (
          <>
            <rect x="3" y="2" width="26" height="28" rx="9" fill="#e9ddf5" />
            <rect x="7" y="2.5" width="17" height="27" rx="4.5" fill="#fffaff" stroke="#9571b2" />
            <rect x="9.5" y="6" width="12" height="19" rx="2" fill="#f3eafb" stroke="#d0b7e3" />
            <path d="M13 4.5h5m-4 23h3" stroke="#ac8bc4" />
            <rect x="13" y="13" width="16" height="11" rx="3" fill="#dcebd6" stroke="#8ea77c" />
            <path d="M25 16h5v5h-5a2.5 2.5 0 0 1 0-5Z" fill="#edf6e6" stroke="#8ea77c" />
            <circle cx="26" cy="18.5" r=".8" fill="#8ea77c" stroke="none" />
            <path
              d="M17 17c0-2 3-2 3 0 0-2 3-2 3 0 0 2-3 3.5-3 3.5S17 19 17 17Z"
              fill="#e9bfd3"
              stroke="#bd8da6"
              strokeWidth=".9"
            />
            <path
              d="m27 3 .7 2.3L30 6l-2.3.7L27 9l-.7-2.3L24 6l2.3-.7L27 3Z"
              fill="#fff0c6"
              stroke="#bca36d"
              strokeWidth=".9"
            />
          </>
        ) : (
          <>
            <rect x="2" y="3" width="28" height="27" rx="9" fill="#fff0ce" />
            <path
              d="M10 4h12l6 6v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10l6-6Z"
              fill="#fffdf4"
              stroke="#ba9458"
              strokeDasharray="2 2.5"
            />
            <path d="M22 4v6h6" stroke="#d7b57d" />
            <circle cx="9" cy="10" r="1.6" fill="#f5e2b6" stroke="#c6a46c" />
            <path
              d="M13 16a3.4 3.4 0 0 1 6.6 1c0 2.4-3.3 2.3-3.3 4"
              stroke="#af864d"
              strokeWidth="1.7"
            />
            <circle cx="16.3" cy="24" r="1" fill="#af864d" />
          </>
        )}
      </g>
    </svg>
  )
}

export default function SourceBadge({ type, label, size = 'default', className = '', title, id }) {
  const kind = badgeType(type)
  const text = label || sourceLabels[kind]
  return (
    <span
      id={id}
      className={`source-badge source-badge--${kind} ${size === 'small' ? 'source-badge--small' : ''} ${className}`}
      data-source-badge={kind}
      title={title || (text === sourceLabels[kind] ? text : `${sourceLabels[kind]} · ${text}`)}
    >
      <SourceBadgeIcon type={kind} size={size === 'small' ? 18 : 22} />
      <span className="source-badge-label">{text}</span>
    </span>
  )
}
