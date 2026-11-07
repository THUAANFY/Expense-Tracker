import { useId } from 'react'

const palettes = {
  income: { light: '#e4d5ff', middle: '#b28aef', dark: '#7244b4', edge: '#d5b9ff' },
  expense: { light: '#ffd3e3', middle: '#ee8eb4', dark: '#ba4e80', edge: '#ffc0d8' },
  balance: { light: '#d0eeff', middle: '#8ec6f7', dark: '#4a86cf', edge: '#b9e0ff' },
}

export default function FintechStatIcon({ kind, tone }) {
  const id = useId().replaceAll(':', '')
  const palette = palettes[tone] || palettes[kind] || palettes.balance
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="fintech-stat-art"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-stat-icon={kind}
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="18"
          y1="24"
          x2="58"
          y2="69"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.light} />
          <stop offset=".48" stopColor={palette.middle} />
          <stop offset="1" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="20"
          y1="25"
          x2="58"
          y2="69"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".8" />
          <stop offset=".45" stopColor={palette.edge} stopOpacity=".7" />
          <stop offset="1" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient
          id={`${id}-metal`}
          x1="21"
          y1="11"
          x2="54"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset=".42" stopColor={palette.light} />
          <stop offset="1" stopColor={palette.middle} />
        </linearGradient>
        <linearGradient
          id={`${id}-flap`}
          x1="50"
          y1="40"
          x2="68"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.middle} />
          <stop offset="1" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient
          id={`${id}-sheen`}
          x1="17"
          y1="34"
          x2="53"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".24" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-inflow`}
          x1="7"
          y1="32"
          x2="26"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9fe6cd" />
          <stop offset="1" stopColor="#389f8a" />
        </linearGradient>
        <linearGradient
          id={`${id}-outflow`}
          x1="55"
          y1="47"
          x2="74"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f7b7d1" />
          <stop offset="1" stopColor="#c16b97" />
        </linearGradient>
        <clipPath id={`${id}-wallet-clip`}>
          <rect x="9" y="31" width="57" height="36" rx="9" />
        </clipPath>
        <clipPath id={`${id}-card-clip`}>
          <rect x="9" y="30" width="60" height="36" rx="7" />
        </clipPath>
        <filter
          id={`${id}-depth`}
          x="-10"
          y="-10"
          width="100"
          height="104"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#080b24" floodOpacity=".28" />
        </filter>
      </defs>
      <ellipse cx="40" cy="71" rx="25" ry="2.5" fill="#090a22" opacity=".22" />
      <g strokeLinecap="round" strokeLinejoin="round" filter={paint('depth')}>
        {kind === 'income' ? (
          <>
            <path
              d="M13 31v-5q0-6 7-6h36q8 0 8 8v28H13Z"
              fill="#8057b4"
              stroke="#af8bdc"
              strokeWidth=".9"
            />
            <g transform="rotate(-12 39 26)">
              <rect
                x="17"
                y="11"
                width="44"
                height="30"
                rx="4"
                fill={paint('metal')}
                stroke="#b99be6"
              />
              <rect
                x="20.5"
                y="14.5"
                width="37"
                height="23"
                rx="2"
                stroke="#a88bcf"
                strokeWidth=".8"
              />
              <path
                d="M21 19q4 0 4-4m28 0q0 4 4 4M21 33q4 0 4 4m28 0q0-4 4-4"
                stroke="#b39bd6"
                strokeWidth=".8"
              />
              <ellipse
                cx="39"
                cy="26"
                rx="7.5"
                ry="9"
                fill="#ddcafa"
                stroke="#b69bd9"
                strokeWidth=".8"
              />
              <path d="M41 20v12m-1-7c-7-4-8 8 0 5M38.5 22h5" stroke="#9372ba" strokeWidth="1.05" />
              <path d="M25 26h3m22 0h3" stroke="#b69bd9" />
            </g>
            <path d="M11 34q0-6 7-6h43q7 0 7 7v22H11Z" fill="#9066c7" />
            <rect
              x="9"
              y="31"
              width="57"
              height="36"
              rx="9"
              fill={paint('body')}
              stroke={paint('edge')}
              strokeWidth="1.15"
            />
            <g clipPath={paint('wallet-clip')}>
              <path d="M9 31h27L16 67H9Z" fill={paint('sheen')} />
              <path d="M13 36q0-3 5-3h40" stroke="#f6eaff" strokeWidth="1.2" strokeOpacity=".55" />
              <path
                d="M15 41v14q0 6 6 6h35"
                stroke="#7645ac"
                strokeWidth=".9"
                strokeDasharray="1.2 2.7"
                strokeOpacity=".48"
              />
              <path d="M19 65h37" stroke="#6c3ca4" strokeOpacity=".3" />
            </g>
            <path
              d="M59 41h11v19H59q-10 0-10-9.5T59 41Z"
              fill={paint('flap')}
              stroke="#d3afff"
              strokeWidth=".9"
            />
            <path
              d="M58 43h9m-13 13q2 2 5 2h7"
              stroke="#e9ceff"
              strokeOpacity=".35"
              strokeWidth=".8"
            />
            <circle
              cx="59.5"
              cy="50.5"
              r="3.2"
              fill={paint('metal')}
              stroke="#e4caff"
              strokeWidth=".7"
            />
            <circle cx="59.5" cy="50.5" r="1.2" fill="#9670c5" />
            <path
              d="M27 51c-4 0-5-5-1-6 0-5 6-7 9-3 4-2 8 1 7 5 4 1 3 5 0 5Z"
              fill="#eddcff"
              fillOpacity=".5"
              stroke="#f2e1ff"
              strokeOpacity=".5"
              strokeWidth=".7"
            />
            <path d="m70 21 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="#e8d4ff" opacity=".8" />
          </>
        ) : kind === 'expense' ? (
          <>
            <g transform="rotate(-11 38 29)">
              <rect
                x="12"
                y="13"
                width="52"
                height="33"
                rx="6"
                fill="#b95686"
                stroke="#f2a4c6"
                strokeWidth="1"
              />
              <path d="M13 21h50v6H13Z" fill="#64254d" fillOpacity=".75" />
              <path
                d="M19 17h26m-26 17h10m-10 4h5"
                stroke="#ffc4dc"
                strokeWidth="1"
                strokeOpacity=".65"
              />
              <path d="M16 18q0-3 4-3h30" stroke="#ffe1ee" strokeOpacity=".4" />
            </g>
            <g transform="rotate(7 39 48)">
              <rect
                x="9"
                y="30"
                width="60"
                height="36"
                rx="7"
                fill={paint('body')}
                stroke={paint('edge')}
                strokeWidth="1.1"
              />
              <g clipPath={paint('card-clip')}>
                <path d="M9 30h33L20 66H9Z" fill={paint('sheen')} />
                <path
                  d="M15 34q1-2 4-2h41"
                  stroke="#ffeaf3"
                  strokeOpacity=".55"
                  strokeWidth="1.1"
                />
                <path d="M15 64h44" stroke="#9d3b6b" strokeOpacity=".4" />
              </g>
              <rect
                x="17"
                y="39"
                width="14"
                height="10"
                rx="2.5"
                fill={paint('metal')}
                stroke="#d998b6"
                strokeWidth=".7"
              />
              <path
                d="M22 39.5v9m4-9v9m-8.5-4.5h13M18 42h3m6 4h3"
                stroke="#b27298"
                strokeWidth=".7"
              />
              <path
                d="M38 40q4 3 0 6m3-8q6 5 0 10m3-12q9 7 0 14"
                stroke="#ffe3ee"
                strokeWidth="1.2"
                strokeOpacity=".8"
              />
              <g fill="#ae4777" fillOpacity=".8">
                <circle cx="18" cy="55" r="1" />
                <circle cx="22" cy="55" r="1" />
                <circle cx="26" cy="55" r="1" />
                <circle cx="30" cy="55" r="1" />
              </g>
              <path d="M18 60h17m5 0h8" stroke="#ffe0ec" strokeOpacity=".7" strokeWidth="1" />
            </g>
            <circle cx="64" cy="61" r="10" fill={paint('flap')} stroke="#ffc2d8" strokeWidth="1" />
            <circle cx="64" cy="61" r="7.7" stroke="#ffc7dd" strokeOpacity=".24" strokeWidth=".7" />
            <path d="m60.5 64.5 7-7m-5.5 0h5.5V63" stroke="#fff0f6" strokeWidth="1.8" />
            <path d="M60 53q4-2 7 0" stroke="#ffe1ee" strokeWidth="1.1" strokeOpacity=".5" />
          </>
        ) : (
          <>
            <g transform="rotate(-8 37 39)">
              <rect
                x="14"
                y="13"
                width="45"
                height="51"
                rx="10"
                fill="#3568b6"
                fillOpacity=".65"
                stroke="#89bbef"
                strokeWidth=".9"
              />
              <path d="M21 16h25m-29 9v24" stroke="#cce7ff" strokeOpacity=".35" strokeWidth="1.1" />
            </g>
            <g transform="rotate(5 42 42)">
              <rect
                x="20"
                y="18"
                width="44"
                height="49"
                rx="10"
                fill={paint('body')}
                stroke={paint('edge')}
                strokeWidth="1.1"
              />
              <rect
                x="23.5"
                y="21.5"
                width="37"
                height="42"
                rx="7"
                stroke="#daf0ff"
                strokeOpacity=".35"
                strokeWidth=".7"
              />
              <path d="M27 20h15L25 64q-3-1-3-5V27q0-7 5-7Z" fill={paint('sheen')} />
              <path d="M28 26h12m-12 3h7" stroke="#537fb8" strokeOpacity=".55" strokeWidth=".9" />
              <circle cx="54" cy="27" r="1.2" fill="#e1f3ff" />
              <circle
                cx="42"
                cy="43"
                r="10.5"
                fill={paint('metal')}
                stroke="#d4edff"
                strokeWidth=".9"
              />
              <circle
                cx="42"
                cy="43"
                r="8.2"
                stroke="#83a9d8"
                strokeOpacity=".5"
                strokeWidth=".7"
              />
              <path
                d="M44 36v14m-1-8c-8-5-9 10 0 5M41.25 38h5.5"
                stroke="#628fc5"
                strokeWidth="1.2"
              />
              <path d="M34 58h15m-15 3h15" stroke="#d9edff" strokeOpacity=".75" strokeWidth="1.4" />
              <path
                d="M24 33V28q0-6 6-6h20"
                stroke="#edfaff"
                strokeWidth="1.2"
                strokeOpacity=".5"
              />
            </g>
            <path d="M23 42h5q4 0 4-4" stroke="#c6f1e9" strokeWidth="1.4" strokeOpacity=".65" />
            <path d="M51 47q0 7 7 7h2" stroke="#d0e4ff" strokeWidth="1.4" strokeOpacity=".65" />
            <rect
              x="5"
              y="32"
              width="23"
              height="23"
              rx="7"
              fill={paint('inflow')}
              stroke="#b0f0db"
              strokeWidth=".9"
            />
            <path d="M10 35q1-1 3-1h9" stroke="#e0fff4" strokeOpacity=".45" strokeWidth="1" />
            <path d="m11 38 10 10m-8 0h8v-8" stroke="#effff8" strokeWidth="2" />
            <path d="M10 51h12" stroke="#258978" strokeOpacity=".35" strokeWidth=".8" />
            <rect
              x="53"
              y="47"
              width="23"
              height="23"
              rx="7"
              fill={paint('outflow')}
              stroke="#ffd1e4"
              strokeWidth=".9"
            />
            <path d="M58 50h9q4 0 4 3" stroke="#ffeaf3" strokeOpacity=".45" strokeWidth="1" />
            <path d="m59 64 10-10m-8 0h8v8" stroke="#fff0f6" strokeWidth="2" />
            <path d="M59 68h11" stroke="#9b4c72" strokeOpacity=".35" strokeWidth=".8" />
          </>
        )}
      </g>
    </svg>
  )
}
