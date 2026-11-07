import { useId } from 'react'

export default function OverviewBagArt({ className = '' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className={className}
      viewBox="0 0 128 112"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-body`} cx=".25" cy=".12" r="1.08">
          <stop stopColor="#ecd9ff" />
          <stop offset=".24" stopColor="#c59afc" />
          <stop offset=".58" stopColor="#a06bee" />
          <stop offset=".85" stopColor="#8050c5" />
          <stop offset="1" stopColor="#613796" />
        </radialGradient>
        <linearGradient
          id={`${id}-bevel`}
          x1="25"
          y1="28"
          x2="95"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#efe0ff" />
          <stop offset=".3" stopColor="#b28be9" />
          <stop offset=".65" stopColor="#8d61cd" />
          <stop offset="1" stopColor="#492c79" />
        </linearGradient>
        <linearGradient
          id={`${id}-side`}
          x1="94"
          y1="32"
          x2="111"
          y2="94"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c3a0ff" />
          <stop offset=".35" stopColor="#935fe1" />
          <stop offset=".75" stopColor="#603a9f" />
          <stop offset="1" stopColor="#39235f" />
        </linearGradient>
        <linearGradient
          id={`${id}-metal`}
          x1="45"
          y1="11"
          x2="76"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fbf4ff" />
          <stop offset=".42" stopColor="#d5c6ff" />
          <stop offset=".7" stopColor="#a590e2" />
          <stop offset="1" stopColor="#e3d2ff" />
        </linearGradient>
        <linearGradient
          id={`${id}-gloss`}
          x1="52"
          y1="30"
          x2="65"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".65" />
          <stop offset=".5" stopColor="#e0c3ff" stopOpacity=".14" />
          <stop offset="1" stopColor="#cba8ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-enamel`}
          x1="51"
          y1="47"
          x2="72"
          y2="71"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff9ff" />
          <stop offset=".45" stopColor="#e9ddff" />
          <stop offset="1" stopColor="#bfa6ee" />
        </linearGradient>
        <linearGradient
          id={`${id}-mint`}
          x1="98"
          y1="42"
          x2="115"
          y2="71"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c9ffed" />
          <stop offset=".5" stopColor="#8ddfc5" />
          <stop offset="1" stopColor="#4da98d" />
        </linearGradient>
        <linearGradient
          id={`${id}-pocket`}
          x1="42"
          y1="73"
          x2="81"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c397fa" />
          <stop offset=".5" stopColor="#9a6ad8" />
          <stop offset="1" stopColor="#8050b8" />
        </linearGradient>
        <radialGradient id={`${id}-orb`} cx=".3" cy=".2" r=".8">
          <stop stopColor="#f1e3ff" />
          <stop offset=".5" stopColor="#bb92ff" />
          <stop offset="1" stopColor="#7652bf" />
        </radialGradient>
        <radialGradient id={`${id}-ground`}>
          <stop stopColor="#080b20" stopOpacity=".52" />
          <stop offset=".55" stopColor="#15122e" stopOpacity=".28" />
          <stop offset="1" stopColor="#15122e" stopOpacity="0" />
        </radialGradient>
        <filter
          id={`${id}-shadow`}
          x="-25%"
          y="-20%"
          width="150%"
          height="155%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="1.8"
            stdDeviation="1.4"
            floodColor="#08091f"
            floodOpacity=".32"
          />
        </filter>
      </defs>
      <ellipse cx="65" cy="105" rx="42" ry="4" fill={`url(#${id}-ground)`} />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-4 64 62)" filter={`url(#${id}-shadow)`}>
          <path d="M46 32V20q0-10 10-10h14q10 0 10 10v12" stroke="#8f73c7" strokeWidth="8" />
          <path
            d="M46 31V20q0-10 10-10h14q10 0 10 10v11"
            stroke={`url(#${id}-metal)`}
            strokeWidth="6"
          />
          <path
            d="M45 25v-5q0-10 11-10h14q5 0 8 4"
            stroke="#fff"
            strokeWidth="1.3"
            strokeOpacity=".7"
          />
          {[42, 92].map((x) => (
            <g key={x}>
              <rect x={x - 2.5} y="94" width="5" height="6" rx="1.5" fill="#70518e" />
              <circle cx={x} cy="101" r="4.8" fill="#35264f" stroke="#ad92d1" strokeWidth=".6" />
              <circle cx={x} cy="101" r="2.8" fill={`url(#${id}-metal)`} />
              <circle cx={x} cy="101" r=".9" fill="#8d72b1" />
              <path
                d={`M${x - 2.6} 99a3.3 3.3 0 0 1 4.3-.4`}
                stroke="#f4e9ff"
                strokeWidth=".65"
                strokeOpacity=".7"
              />
            </g>
          ))}
          <path
            d="m87 29 10-2q15-1 17 15l2 36q1 17-15 19l-13 1Z"
            fill={`url(#${id}-side)`}
            stroke="#b58ae9"
            strokeWidth="1.1"
          />
          <rect x="22" y="29" width="82" height="69" rx="17" fill={`url(#${id}-bevel)`} />
          <rect x="25" y="32" width="76" height="63" rx="14" fill={`url(#${id}-body)`} />
          <path
            d="M25 50v-4q0-14 14-14h48q14 0 14 14v4c-23-9-52-8-76 0Z"
            fill={`url(#${id}-gloss)`}
          />
          <rect
            x="30"
            y="37"
            width="67"
            height="53"
            rx="11"
            stroke="#663e9e"
            strokeWidth="1.2"
            strokeOpacity=".35"
          />
          <path d="M38 38v50m52-50v50" stroke="#69439f" strokeWidth="4" strokeOpacity=".3" />
          <path d="M36.5 38v50m52-50v50" stroke="#e5cfff" strokeWidth="2.3" strokeOpacity=".7" />
          <path d="M35.8 42v39m52-39v39" stroke="#fff0ff" strokeWidth=".7" strokeOpacity=".65" />
          <path
            d="M24 46q0-15 15-15h35m-48 20v22m8 20h40"
            stroke="#f2dfff"
            strokeWidth="1.6"
            strokeOpacity=".6"
          />
          <path
            d="M105 38q5 3 6 11l2 29q1 12-9 15"
            stroke="#d7b4ff"
            strokeOpacity=".4"
            strokeWidth="1.2"
          />
          <path
            d="M106 43v38"
            stroke="#e1c5ff"
            strokeWidth=".9"
            strokeDasharray="1 2.2"
            strokeOpacity=".6"
          />
          <path
            d="M48 70c-9 0-13-11-6-16 0-8 9-13 16-8 5-10 21-6 21 4 10 0 14 14 4 19-3 2-5 2-8 2Z"
            fill="#5a348e"
            opacity=".28"
            transform="translate(0 1.5)"
          />
          <path
            d="M48 68c-8 0-11-10-5-14 0-8 9-12 15-7 5-10 20-6 20 4 10-1 13 12 5 16-2 1-4 1-7 1Z"
            fill={`url(#${id}-enamel)`}
            stroke="#f3e7ff"
            strokeWidth=".9"
          />
          <path
            d="M45 55c0-5 6-9 11-6m5-2c4-5 11-3 13 1"
            stroke="#fff"
            strokeWidth="1.1"
            strokeOpacity=".85"
          />
          <path d="M46 65c9 4 27 4 35-1" stroke="#b5a0dc" strokeWidth=".8" strokeOpacity=".6" />
          <g transform="rotate(9 74 79)">
            <path
              d="M69 68h12v18l-2-1-2 1-2-1-2 1-2-1-2 1Z"
              fill="#eee4ff"
              stroke="#d6bff5"
              strokeWidth=".6"
            />
            <path d="M72 72h6m-6 3h4m-4 3h6" stroke="#a78bc7" strokeWidth="1" />
          </g>
          <path
            d="M42 77q20-4 42 0l-1 8q0 5-5 5H48q-5 0-5-5Z"
            fill="#563187"
            opacity=".25"
            transform="translate(0 1.5)"
          />
          <path
            d="M42 76q20-3 42 0l-1 8q0 5-5 5H48q-5 0-5-5Z"
            fill={`url(#${id}-pocket)`}
            stroke="#d8b5ff"
            strokeWidth=".65"
          />
          <path d="M45 79q18-2 36 0" stroke="#ead2ff" strokeWidth="1.1" strokeOpacity=".75" />
          <path d="M48 86h8m16 0h6" stroke="#dfc2fc" strokeWidth=".6" strokeDasharray="1 1.7" />
          <rect
            x="58"
            y="77"
            width="9"
            height="5"
            rx="2"
            fill={`url(#${id}-metal)`}
            stroke="#9b7cc1"
            strokeWidth=".5"
          />
          <path d="M61 79.5h3" stroke="#8d68ba" strokeWidth=".8" />
          <path d="M105 44c4 0 6 4 5 9" stroke="#dfcfff" strokeWidth="1.2" />
          <g transform="rotate(12 109 64)">
            <path
              d="m105 52 9 1 3 5-2 18-6 2-6-4 1-18Z"
              fill="#291b44"
              opacity=".22"
              transform="translate(1 1.5)"
            />
            <path
              d="m104 51 9 1 3 5-2 18-6 2-6-4 1-18Z"
              fill={`url(#${id}-mint)`}
              stroke="#c4ffe9"
              strokeWidth=".7"
            />
            <circle cx="108.5" cy="55" r="1.3" fill="#467e73" />
            <path d="M106 61h6m-6 3h4m-4 3h5" stroke="#4d9583" strokeWidth="1" />
            <path d="M105 71h1m2 0h1m2 0h1" stroke="#d6fff0" strokeWidth="1.2" />
          </g>
          <path
            d="M28 42h5m60-1h6m-70 40h5m59-1h6"
            stroke="#eedaff"
            strokeWidth="1.2"
            strokeOpacity=".6"
          />
          <path d="M38 95h45" stroke="#c9a5f3" strokeOpacity=".55" />
        </g>
        <circle
          cx="20"
          cy="28"
          r="3.2"
          fill={`url(#${id}-orb)`}
          stroke="#d7bbff"
          strokeWidth=".6"
        />
        <circle
          cx="122"
          cy="91"
          r="3.2"
          fill={`url(#${id}-orb)`}
          stroke="#d7bbff"
          strokeWidth=".6"
        />
        <circle cx="14" cy="78" r="3" stroke="#b18be9" strokeWidth="1.3" />
        <path d="m115 21 1.8 5.2 5.2 1.8-5.2 1.8L115 35l-1.8-5.2L108 28l5.2-1.8Z" fill="#d8b9ff" />
        <path
          d="m10 53 .9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9Z"
          fill="#c7abff"
          opacity=".75"
        />
      </g>
    </svg>
  )
}
