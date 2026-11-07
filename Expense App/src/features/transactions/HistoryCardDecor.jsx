import { useId } from 'react'

export default function HistoryCardDecor({ kind }) {
  const id = useId().replaceAll(':', '')
  const balance = kind === 'balance'
  const color = balance ? '#9c62ff' : kind === 'income' ? '#25e4bf' : '#f86ab2'
  const wave = balance
    ? 'M285 200C355 154 405 154 446 172S543 213 600 151'
    : 'M85 190C132 169 157 141 190 148S250 187 300 163'
  return (
    <svg
      className={`history-card-decor is-${kind}`}
      viewBox={balance ? '0 0 600 200' : '0 0 300 190'}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-area`} x1=".1" y1="1" x2="1" y2="0">
          <stop stopColor={color} stopOpacity=".02" />
          <stop offset="1" stopColor={color} stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={`${id}-edge`}>
          <stop stopColor={color} stopOpacity="0" />
          <stop offset=".6" stopColor={color} stopOpacity=".6" />
          <stop offset="1" stopColor={color} stopOpacity=".1" />
        </linearGradient>
      </defs>
      {balance && (
        <path
          d="M0 56C70 84 150 122 251 75S398 11 473 33 545 52 600 16V0H0Z"
          fill={`url(#${id}-area)`}
          opacity=".45"
        />
      )}
      <path d={`${wave}${balance ? 'V200H285Z' : 'V190H85Z'}`} fill={`url(#${id}-area)`} />
      <path
        d={wave}
        stroke={`url(#${id}-edge)`}
        strokeWidth=".9"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
