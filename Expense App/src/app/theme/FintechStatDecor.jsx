import { useId } from 'react'
import FintechStatIcon from './FintechStatIcon'

const waves = {
  income:
    'M0 124C28 124 35 116 55 113S83 109 101 96S126 91 145 76S170 72 187 53S216 41 232 28S250 19 260 17',
  expense: 'M0 122C26 122 34 116 50 104S76 60 98 76S126 113 148 88S174 38 197 51S232 88 260 58',
  balance: 'M0 123C30 123 40 116 59 106S87 86 108 91S135 108 154 92S179 64 199 69S230 59 260 36',
}

export default function FintechStatDecor({ kind }) {
  const id = useId().replaceAll(':', '')
  const color = { income: '#a37bff', expense: '#ff789d', balance: '#4f8cff' }[kind]
  const wave = waves[kind] || waves.balance
  return (
    <>
      <svg
        className="fintech-stat-wave"
        viewBox="0 0 260 130"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
        data-stat-wave={kind}
      >
        <defs>
          <linearGradient
            id={`${id}-area`}
            x1="150"
            y1="20"
            x2="150"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} stopOpacity=".26" />
            <stop offset="1" stopColor={color} stopOpacity=".01" />
          </linearGradient>
          <linearGradient
            id={`${id}-line`}
            x1="10"
            y1="100"
            x2="260"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} stopOpacity="0" />
            <stop offset=".5" stopColor={color} stopOpacity=".5" />
            <stop offset="1" stopColor={color} stopOpacity=".95" />
          </linearGradient>
        </defs>
        <path d={`${wave}V130H0Z`} fill={`url(#${id}-area)`} />
        <path
          d={wave}
          transform="translate(0 13)"
          stroke={`url(#${id}-line)`}
          strokeWidth="1"
          opacity=".2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={wave}
          stroke={`url(#${id}-line)`}
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className={`fintech-stat-icon is-${kind}`} aria-hidden="true">
        <FintechStatIcon kind={kind} />
      </span>
    </>
  )
}
