import { useId } from 'react'

const colors = {
  total: ['#493575', '#251e41', '#f0e6ff', '#ad8be8', '#9c71e6'],
  bank: ['#296950', '#123c35', '#d7ffeb', '#7bd7b2', '#5ed6ad'],
  cash: ['#77364f', '#402437', '#ffe4ee', '#ef9dbd', '#ff789d'],
  ewallet: ['#53418d', '#2e2655', '#f1eaff', '#b59aee', '#a78bfa'],
}

export default function FintechSourceIcon({ type = 'total' }) {
  const id = useId().replaceAll(':', '')
  const [top, bottom, light, middle, edge] = colors[type] || colors.total
  return (
    <svg
      className={`fintech-source-icon is-${type}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-face`}
          x1="7"
          y1="3"
          x2="32"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient
          id={`${id}-ink`}
          x1="13"
          y1="11"
          x2="27"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={light} />
          <stop offset="1" stopColor={middle} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-face)`} stroke={edge} strokeOpacity=".2" />
      <path d="M7 15A14 14 0 0 1 24 6" stroke={light} strokeOpacity=".12" strokeLinecap="round" />
      <g strokeLinecap="round" strokeLinejoin="round">
        {type === 'bank' ? (
          <>
            <path d="m10 16 10-6 10 6Z" fill={`url(#${id}-ink)`} />
            <circle cx="20" cy="14" r="1.1" fill={top} />
            <path d="M14 19v7m6-7v7m6-7v7" stroke={light} strokeWidth="2.8" />
            <path d="M11 18h18M11 28h18m-20 2h22" stroke={middle} strokeWidth="1.7" />
          </>
        ) : type === 'cash' ? (
          <>
            <path d="M12 16v-2q0-2 2-2h12v5" fill={middle} stroke={light} strokeWidth=".7" />
            <path d="m16 12 7-3 2 5" fill={light} stroke={middle} strokeWidth=".7" />
            <rect x="10" y="16" width="21" height="14" rx="4" fill={`url(#${id}-ink)`} />
            <path
              d="M27 20h5v6h-5a3 3 0 0 1 0-6Z"
              fill={top}
              fillOpacity=".7"
              stroke={light}
              strokeWidth=".65"
            />
            <circle cx="28" cy="23" r=".9" fill={light} />
            <path d="M13 19h9m-9 8h6" stroke={top} strokeOpacity=".35" strokeWidth=".8" />
          </>
        ) : type === 'ewallet' ? (
          <>
            <rect
              x="11"
              y="11"
              width="19"
              height="14"
              rx="3"
              fill={middle}
              fillOpacity=".5"
              stroke={light}
              strokeWidth=".7"
            />
            <rect x="9" y="16" width="22" height="14" rx="3.5" fill={`url(#${id}-ink)`} />
            <path d="M10 20h20" stroke={bottom} strokeOpacity=".6" strokeWidth="2.1" />
            <rect x="12" y="23" width="5" height="3.5" rx="1" fill={bottom} fillOpacity=".8" />
            <circle cx="25" cy="25" r="1.8" fill={top} fillOpacity=".6" />
            <path d="M14 13h11" stroke={light} strokeOpacity=".45" strokeWidth=".8" />
          </>
        ) : (
          <>
            <path
              d="M11 16v-2q0-3 3-3h13v6"
              fill={middle}
              fillOpacity=".6"
              stroke={light}
              strokeWidth=".7"
            />
            <rect x="9" y="15" width="22" height="15" rx="4" fill={`url(#${id}-ink)`} />
            <path
              d="M27 19h5v7h-5a3.5 3.5 0 0 1 0-7Z"
              fill={top}
              fillOpacity=".8"
              stroke={light}
              strokeWidth=".7"
            />
            <circle cx="28" cy="22.5" r="1" fill={light} />
            <path d="M12 18h10" stroke="#fff" strokeOpacity=".45" strokeWidth=".8" />
            <rect x="12" y="23" width="5" height="3" rx="1" fill={bottom} fillOpacity=".45" />
          </>
        )}
      </g>
    </svg>
  )
}
