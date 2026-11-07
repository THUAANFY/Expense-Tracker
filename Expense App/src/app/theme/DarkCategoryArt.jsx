import { useId } from 'react'
import { DARK_CATEGORY_COLORS } from './palette'

const mix = (color, target, amount) =>
  '#' +
  [1, 3, 5]
    .map((offset) => {
      const from = parseInt(color.slice(offset, offset + 2), 16)
      const to = parseInt(target.slice(offset, offset + 2), 16)
      return Math.round(from + (to - from) * amount)
        .toString(16)
        .padStart(2, '0')
    })
    .join('')

export default function DarkCategoryArt({ category = 'other', size = 56, className = '' }) {
  const id = useId().replaceAll(':', '')
  const color = DARK_CATEGORY_COLORS[category] || DARK_CATEGORY_COLORS.other
  const light = mix(color, '#ffffff', 0.62)
  const soft = mix(color, '#ffffff', 0.84)
  const shade = mix(color, '#172039', 0.42)
  const deep = mix(color, '#0a1427', 0.72)
  const paint = (name) => 'url(#' + id + '-' + name + ')'
  const drawings = {
    food: (
      <>
        <path
          d="M19 23c-4-5 4-7 1-12m8 9c-3-4 4-7 2-11"
          stroke={light}
          strokeWidth="1.5"
          opacity=".7"
        />
        <g transform="rotate(27 43 23)">
          <rect x="40" y="8" width="2.3" height="31" rx="1.15" fill="#d8b3a0" />
          <rect x="45" y="8" width="2.3" height="31" rx="1.15" fill="#9a675b" />
          <path d="M40.5 10v15m5-15v15" stroke="#fff1e4" strokeWidth=".6" opacity=".65" />
        </g>
        <path d="M11 32h42l-4 15q-2 7-17 7t-17-7Z" fill={paint('body')} />
        <path d="m42 34 8-1-3 15q-1 3-7 4Z" fill={shade} opacity=".45" />
        <ellipse cx="32" cy="32" rx="22" ry="7" fill={soft} />
        <ellipse cx="32" cy="32" rx="19" ry="5.3" fill="#ae6350" />
        <ellipse cx="32" cy="31.3" rx="18" ry="4.3" fill="#e8a872" />
        <path d="M18 32q3-5 6 0t6 0 6 0 6 0m-22-3q3-3 5 0t5 0" stroke="#ffe4ae" strokeWidth="1.5" />
        <g transform="rotate(-20 41 29)">
          <ellipse cx="41" cy="29" rx="5.8" ry="4.1" fill="#fff1d5" />
          <ellipse cx="41" cy="29" rx="2.5" ry="2" fill="#eeb661" />
        </g>
        <path d="M21 28q-3-8 4-8 5 5-4 8Z" fill="#73b99a" />
        <path d="m22 26 2-4m8 7 1-2m-5 5 1-2" stroke="#d2edb7" strokeWidth=".9" />
        <path d="M16 38q14 6 31 0" stroke={light} strokeWidth="1.1" opacity=".8" />
        <path d="M19 43q5 3 12 3" stroke={soft} strokeWidth="1.5" opacity=".6" />
        <path d="M25 53h14" stroke={shade} strokeWidth="2.5" />
      </>
    ),
    shopping: (
      <>
        <path d="M23 26V16a9 9 0 0 1 18 0v10" stroke={shade} strokeWidth="5" />
        <path d="M23 25V16a9 9 0 0 1 18 0v9" stroke={light} strokeWidth="2.7" />
        <path d="m17 23-4 27q0 5 5 6h29q5-1 4-6l-4-27Z" fill={paint('body')} />
        <path d="m42 24 5-1 4 28q0 4-4 5l-6-5Z" fill={shade} />
        <path d="M18 25h22l-3 25H16Z" fill={paint('gloss')} opacity=".55" />
        <path d="M17 51q12 3 24 0l6 5H18q-4-1-5-5Z" fill={shade} opacity=".45" />
        <circle cx="23" cy="26" r="2.2" fill={shade} />
        <circle cx="40" cy="26" r="2.2" fill={shade} />
        <path d="M23 26V17m17 9V17" stroke={soft} strokeWidth="2" />
        <path
          d="M25 36c-5-5-10 2-5 7l10 8 10-8c5-5 0-12-5-7l-5 5Z"
          transform="translate(3 -3) scale(.92)"
          fill={soft}
          opacity=".9"
        />
        <g transform="rotate(14 49 34)">
          <path d="m46 26 8 1v13h-11V30Z" fill={paint('metal')} />
          <circle cx="48" cy="30" r="1.2" fill={shade} />
          <path d="M46 34h5m-5 3h3" stroke={shade} strokeWidth=".8" />
        </g>
        <path d="m40 23 8 6" stroke={light} strokeWidth=".8" />
      </>
    ),
    transport: (
      <>
        <circle cx="18" cy="48" r="7.5" fill="#152131" />
        <circle cx="18" cy="48" r="4" fill={shade} />
        <circle cx="18" cy="48" r="1.8" fill={light} />
        <circle cx="47" cy="48" r="7.5" fill="#152131" />
        <circle cx="47" cy="48" r="4" fill={shade} />
        <circle cx="47" cy="48" r="1.8" fill={light} />
        <path d="M10 44q2-13 16-13h7v10h9v6H24q-6-11-14-3Z" fill={paint('body')} />
        <path d="M25 33h7v9h11v4H28q-7-9-14-6" fill={shade} opacity=".5" />
        <path d="M39 22h8l5 22q-7-3-12 1l-3-4 6-1Z" fill={paint('body')} />
        <path d="M44 24h3l4 16h-5Z" fill={light} opacity=".65" />
        <path d="M13 38q7-6 15-3" stroke={soft} strokeWidth="1.3" opacity=".7" />
        <rect x="21" y="27" width="15" height="5" rx="2.5" fill={deep} />
        <path d="M24 28h8" stroke={light} strokeWidth=".7" />
        <path d="m42 23-3-5h10m-7-2-1-5 5-2" stroke={shade} strokeWidth="2" />
        <ellipse cx="47" cy="9" rx="3" ry="2" fill={paint('metal')} />
        <ellipse cx="48" cy="22" rx="3.5" ry="2.7" fill={soft} />
        <path d="M39 48h10" stroke={light} strokeWidth="1.4" />
        <rect x="11" y="35" width="3" height="4" rx="1" fill="#e9a39a" />
      </>
    ),
    home: (
      <>
        <path d="M42 20V9h7v18Z" fill={shade} />
        <path d="M41 9h9v4h-9Z" fill={light} />
        <path d="m14 28 18-16 20 17v25H14Z" fill={paint('body')} />
        <path d="m39 24 13 5v25H39Z" fill={shade} opacity=".6" />
        <path d="M9 29 31 9q1-1 3 0l22 20-4 4-20-18-19 18Z" fill={shade} />
        <path d="M12 28 32 11l21 18" stroke={light} strokeWidth="1.7" />
        <path d="M17 31h19v20H17Z" fill={paint('gloss')} opacity=".35" />
        <path d="M28 54V41a5 5 0 0 1 10 0v13Z" fill={deep} />
        <path d="M30 53V42a3 3 0 0 1 6 0v11" fill={shade} />
        <circle cx="34.5" cy="47" r=".9" fill={soft} />
        <rect x="19" y="31" width="8" height="9" rx="1.5" fill="#e5e6d7" />
        <path d="M23 31v9m-4-4.5h8" stroke={shade} strokeWidth=".8" />
        <rect x="43" y="33" width="6" height="9" rx="1" fill={soft} opacity=".7" />
        <path d="M46 33v9" stroke={shade} strokeWidth=".8" />
        <path d="M25 53h15v3H25Z" fill={light} />
        <path d="M11 53q-4-7 1-10 4-2 5 2 5-1 5 4l-3 5Z" fill="#69a697" />
        <path d="M14 46v8m0-4-3-2" stroke="#b1d6b1" strokeWidth=".8" />
      </>
    ),
    fun: (
      <>
        <g transform="rotate(-12 32 22)">
          <rect x="17" y="10" width="31" height="27" rx="4" fill={shade} />
          <rect x="21" y="13" width="12" height="10" rx="1.5" fill={light} opacity=".6" />
          <path d="M36 14h7m-7 3h7m-7 3h4" stroke={light} strokeWidth=".8" />
        </g>
        <rect x="8" y="24" width="48" height="29" rx="9" fill={paint('body')} />
        <path d="M16 25h32v27H16Z" fill={deep} />
        <rect x="20" y="28" width="24" height="20" rx="2" fill="#26354f" />
        <path d="M21 29h22v6L21 43Z" fill={paint('gloss')} opacity=".16" />
        <path d="m31 33 2 3 4 .5-3 2.5 1 4-4-2-3 2 1-4-3-2.5 4-.5Z" fill="#b6e9e1" />
        <path d="M13 29v9m-4.5-4.5h9" stroke={soft} strokeWidth="2.5" />
        <circle cx="13" cy="44" r="2.5" fill={shade} />
        <circle cx="13" cy="44" r="1.3" fill={light} />
        <circle cx="50" cy="33" r="2" fill={soft} />
        <circle cx="46" cy="37" r="1.6" fill={light} />
        <circle cx="53" cy="37" r="1.6" fill={light} />
        <circle cx="50" cy="44" r="2.5" fill={shade} />
        <circle cx="50" cy="44" r="1.3" fill={light} />
        <path
          d="M11 27q2-2 5-2m33 0q4 0 5 4M23 50h18"
          stroke={soft}
          strokeWidth=".8"
          opacity=".55"
        />
      </>
    ),
    health: (
      <>
        <path d="M24 26v-8q0-3 3-3h10q3 0 3 3v8" stroke={shade} strokeWidth="5" />
        <path d="M24 25v-7q0-2 3-2h10q2 0 2 2v7" stroke={light} strokeWidth="2.6" />
        <rect x="11" y="24" width="42" height="30" rx="8" fill={paint('body')} />
        <path d="M15 26h22L18 51h-3Z" fill={paint('gloss')} opacity=".6" />
        <path d="M12 33h40v3H12Z" fill={shade} opacity=".28" />
        <rect x="19" y="29" width="26" height="21" rx="5" fill={shade} opacity=".28" />
        <path d="M29 31h6v5h5v6h-5v5h-6v-5h-5v-6h5Z" fill={soft} />
        <path d="M30 32h3v5h5v2h-8Z" fill="#fff" opacity=".45" />
        <g transform="rotate(-32 48 50)">
          <rect x="39" y="45" width="19" height="9" rx="4.5" fill={soft} />
          <path d="M48.5 45H54a4.5 4.5 0 0 1 0 9h-5.5Z" fill={shade} />
          <path d="M48.5 46v7m-5-6h3" stroke={light} strokeWidth=".8" />
        </g>
        <path d="M16 28h8m-8 22h7" stroke={soft} strokeWidth="1" opacity=".5" />
      </>
    ),
    study: (
      <>
        <path d="M9 22q12-5 23 2 11-7 23-2l2 30q-13-3-25 4-12-7-25-4Z" fill={shade} />
        <path d="M12 18q11-3 20 4 10-7 20-4l1 31q-11-3-21 4-10-7-21-4Z" fill={paint('body')} />
        <path d="M14 16q10-2 18 5v29q-9-6-19-4Z" fill={soft} />
        <path d="M32 21q9-7 18-5l1 30q-10-2-19 4Z" fill={light} />
        <path d="M32 22v28" stroke={shade} strokeWidth=".9" />
        <path
          d="m17 24 10 3m-10 3 10 3m-10 3 7 2m14-11 9-3m-9 9 9-3m-9 9 6-2"
          stroke={shade}
          strokeWidth="1"
          opacity=".6"
        />
        <path d="m40 17 6-1v15l-3-2-3 3Z" fill={shade} />
        <g transform="rotate(32 50 43)">
          <rect x="47" y="26" width="5" height="26" rx="1.3" fill={paint('body')} />
          <path d="M48 29v20" stroke={soft} strokeWidth="1" />
          <path d="m47 52 2.5 6 2.5-6Z" fill="#d9bca7" />
          <path d="m48.5 56 1 2 1-2Z" fill={deep} />
          <path d="M47 31h5" stroke={light} strokeWidth="1" />
        </g>
      </>
    ),
    other: (
      <>
        <g transform="rotate(-10 31 26)">
          <rect x="18" y="13" width="23" height="29" rx="3" fill={shade} />
          <rect x="23" y="10" width="24" height="31" rx="3" fill={light} />
          <path d="M28 17h13m-13 4h9m-9 4h13" stroke={shade} strokeWidth="1" opacity=".7" />
        </g>
        <path d="m12 30 28-8 14 10-29 10Z" fill={light} />
        <path d="m12 30 13 8v18l-13-8Z" fill={shade} />
        <path d="m25 38 29-6v18l-29 6Z" fill={paint('body')} />
        <path d="m13 31 27-8 3 2-27 8Z" fill={soft} opacity=".6" />
        <rect
          x="34"
          y="39"
          width="12"
          height="6"
          rx="2"
          fill={deep}
          opacity=".65"
          transform="rotate(-10 40 42)"
        />
        <path d="m37 41 6-1" stroke={soft} strokeWidth="1.4" />
        <path d="m29 51 17-4" stroke={light} strokeWidth=".8" opacity=".55" />
        <circle cx="18" cy="41" r="1.2" fill={light} opacity=".6" />
      </>
    ),
    income: (
      <>
        <g transform="rotate(-12 29 31)">
          <rect x="12" y="12" width="31" height="39" rx="4" fill={shade} />
          <rect x="16" y="9" width="31" height="39" rx="4" fill={paint('body')} />
          <rect
            x="20"
            y="13"
            width="23"
            height="30"
            rx="2.5"
            stroke={soft}
            strokeWidth=".8"
            opacity=".65"
          />
          <ellipse cx="31.5" cy="28" rx="6.5" ry="8" fill={light} />
          <path d="M33 22v12m-1-7c-7-4-8 8 0 4M30.5 24h5" stroke={shade} strokeWidth="1.2" />
          <path d="M24 17h4m-4 21h4m10-2h2" stroke={shade} strokeWidth="1" opacity=".65" />
        </g>
        <circle cx="44" cy="43" r="12" fill={shade} />
        <circle cx="43" cy="41" r="11" fill={paint('metal')} />
        <circle cx="43" cy="41" r="8" stroke={shade} strokeWidth=".8" opacity=".6" />
        <path d="M45 35v12m-1-7c-7-4-8 8 0 4M42.5 37h5" stroke={shade} strokeWidth="1.2" />
        <rect x="7" y="35" width="19" height="19" rx="6" fill={shade} />
        <path d="M14 49v-6h-4l6-6 6 6h-4v6Z" fill={soft} />
        <path d="M10 38q1-1 3-1h6" stroke={light} strokeWidth=".7" opacity=".7" />
      </>
    ),
  }

  return (
    <svg
      className={'category-art dark-category-art ' + className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-theme-art={'category-' + category}
    >
      <defs>
        <linearGradient
          id={id + '-body'}
          x1="15"
          y1="15"
          x2="49"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={light} />
          <stop offset=".44" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <linearGradient
          id={id + '-metal'}
          x1="30"
          y1="28"
          x2="52"
          y2="53"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset=".4" stopColor={soft} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient
          id={id + '-gloss'}
          x1="14"
          y1="19"
          x2="47"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".65" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={id + '-badge'}
          x1="8"
          y1="4"
          x2="56"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} stopOpacity=".19" />
          <stop offset="1" stopColor={color} stopOpacity=".045" />
        </linearGradient>
        <filter
          id={id + '-depth'}
          x="-8"
          y="-8"
          width="80"
          height="84"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.2"
            floodColor="#050a16"
            floodOpacity=".38"
          />
        </filter>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill={paint('badge')}
        stroke={color}
        strokeOpacity=".16"
        strokeWidth=".8"
      />
      <path
        d="M17 4h27q15 0 16 15"
        stroke={light}
        strokeOpacity=".14"
        strokeWidth=".9"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="56" rx="20" ry="2.2" fill="#030916" opacity=".25" />
      <g strokeLinecap="round" strokeLinejoin="round" filter={paint('depth')}>
        {drawings[category] || drawings.other}
      </g>
    </svg>
  )
}
