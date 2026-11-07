import { useId } from 'react'

export default function BudgetLedgerArt({ className = '' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className={className}
      viewBox="0 0 112 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-cover`}
          x1="25"
          y1="44"
          x2="83"
          y2="89"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#be9cff" />
          <stop offset=".5" stopColor="#8460dc" />
          <stop offset="1" stopColor="#48307f" />
        </linearGradient>
        <linearGradient
          id={`${id}-left`}
          x1="35"
          y1="41"
          x2="53"
          y2="81"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f0e3ff" />
          <stop offset=".5" stopColor="#c4a2ff" />
          <stop offset="1" stopColor="#9970ed" />
        </linearGradient>
        <linearGradient
          id={`${id}-right`}
          x1="65"
          y1="40"
          x2="84"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dac3ff" />
          <stop offset=".5" stopColor="#b28afa" />
          <stop offset="1" stopColor="#8053d6" />
        </linearGradient>
        <linearGradient
          id={`${id}-cloud`}
          x1="44"
          y1="18"
          x2="78"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f4e8ff" />
          <stop offset=".5" stopColor="#c4a0ff" />
          <stop offset="1" stopColor="#9558f0" />
        </linearGradient>
        <linearGradient
          id={`${id}-leaf`}
          x1="10"
          y1="37"
          x2="26"
          y2="67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a4fca4" />
          <stop offset="1" stopColor="#2f9b75" />
        </linearGradient>
        <linearGradient
          id={`${id}-pen`}
          x1="88"
          y1="42"
          x2="96"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f2e7ff" />
          <stop offset=".5" stopColor="#cfb2ff" />
          <stop offset="1" stopColor="#8f69d8" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-25%"
          y="-25%"
          width="150%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#08091e" floodOpacity=".45" />
        </filter>
      </defs>
      <ellipse cx="58" cy="88" rx="38" ry="3" fill="#080e20" opacity=".5" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 72C26 57 20 46 14 39" stroke="#5bbb8e" strokeWidth="2" />
        <path d="M22 54C10 53 7 45 7 37c10 1 17 7 15 17Z" fill={`url(#${id}-leaf)`} />
        <path d="M25 66c-10 2-17-3-19-10 10-2 17 2 19 10Z" fill={`url(#${id}-leaf)`} />
        <path d="M23 58c-2-11 2-18 10-22 3 10-1 18-10 22Z" fill={`url(#${id}-leaf)`} />
        <path d="m10 41 10 10m-8 8 10 5m7-23-5 13" stroke="#c1ffd0" strokeOpacity=".4" />
        <g filter={`url(#${id}-shadow)`}>
          <path
            d="M39 42c-10-1-14-13-5-19-1-9 9-15 17-10 4-13 23-12 27 1 12-2 21 13 12 22-3 4-7 6-13 6Z"
            fill={`url(#${id}-cloud)`}
          />
          <path
            d="M36 26c0-5 4-9 9-8m9-4c4-8 15-7 19 1"
            stroke="#fff"
            strokeOpacity=".65"
            strokeWidth="1.8"
          />
          <path
            d="m24 45 31 2 35-3 3 40c-15-2-27-2-37 3-12-4-23-5-36-3Z"
            fill={`url(#${id}-cover)`}
            stroke="#9d79e8"
            strokeWidth="1.2"
          />
          <path
            d="M26 43c11-4 21-3 30 2 11-5 22-6 33-3l-3 36c-11-1-21 0-30 5-9-5-20-6-33-5Z"
            fill="#6c47b6"
          />
          <path
            d="M28 41c11-3 20-2 28 3v36c-9-5-19-7-31-5Z"
            fill={`url(#${id}-left)`}
            stroke="#e0caff"
            strokeWidth=".7"
          />
          <path
            d="M56 44c10-5 21-6 31-3l-3 34c-10-1-20 0-28 5Z"
            fill={`url(#${id}-right)`}
            stroke="#ccb0ff"
            strokeWidth=".7"
          />
          <path d="M56 46v33" stroke="#7950c8" strokeWidth="1.7" />
          <path
            d="M30 45c7-1 14-1 21 2m10-1c7-3 14-3 21-2"
            stroke="#fff"
            strokeOpacity=".65"
            strokeWidth="1.3"
          />
          <path
            d="M32 51c6-1 11 0 16 2m-17 6c6-1 12 0 17 2m-18 6c5-1 10 0 14 1"
            stroke="#8e61d7"
            strokeWidth="3"
          />
          <path
            d="M64 52c5-2 10-2 15-2m-15 9c5-2 10-2 14-2m-14 9c4-2 8-2 11-2"
            stroke="#7750c7"
            strokeWidth="3"
          />
          <path d="M25 80c12-1 23 0 31 4 9-4 19-5 30-4" stroke="#d3b9ff" strokeWidth="1.1" />
          <g transform="rotate(27 89 59)">
            <rect
              x="85"
              y="36"
              width="7"
              height="39"
              rx="2"
              fill={`url(#${id}-pen)`}
              stroke="#e4d3ff"
              strokeWidth=".6"
            />
            <path d="m85 74 3.5 10 3.5-10" fill="#ceb1fc" />
            <path d="m87.5 81 1 3 1-3" fill="#6d469f" />
            <path d="M87 40v29" stroke="#fff" strokeOpacity=".65" />
            <path d="M86 40h5" stroke="#ad83e4" />
          </g>
        </g>
        <path d="m103 26 1.7 4.8 4.8 1.7-4.8 1.7L103 39l-1.7-4.8-4.8-1.7 4.8-1.7Z" fill="#c5a0ff" />
        <path d="m100 73 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4Z" fill="#bc8cf9" />
        <circle cx="29" cy="30" r="1.4" fill="#b699f2" />
      </g>
    </svg>
  )
}
