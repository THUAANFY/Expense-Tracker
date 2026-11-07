import { useId } from 'react'

export default function HistoryMoneyScene({ kind }) {
  const id = useId().replaceAll(':', '')
  const income = kind === 'income'
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className={`history-money-scene is-${kind}`}
      viewBox="0 0 140 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-money-scene={kind}
    >
      <defs>
        <radialGradient id={`${id}-metal`} cx=".28" cy=".18" r=".95">
          <stop stopColor={income ? '#e7fff6' : '#ffe5f4'} />
          <stop offset=".38" stopColor={income ? '#9bf3ce' : '#ffabd3'} />
          <stop offset=".78" stopColor={income ? '#4cc79d' : '#e65b9f'} />
          <stop offset="1" stopColor={income ? '#208c78' : '#a63876'} />
        </radialGradient>
        <linearGradient
          id={`${id}-rim`}
          x1="49"
          y1="40"
          x2="113"
          y2="102"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#c9ffe7' : '#ffcee7'} />
          <stop offset=".4" stopColor={income ? '#3eaa89' : '#b94880'} />
          <stop offset="1" stopColor={income ? '#176459' : '#772d57'} />
        </linearGradient>
        <linearGradient
          id={`${id}-top`}
          x1="70"
          y1="80"
          x2="105"
          y2="107"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#ccffe8' : '#ffd2e8'} />
          <stop offset=".6" stopColor={income ? '#6adaae' : '#ec7bae'} />
          <stop offset="1" stopColor={income ? '#389d81' : '#b74e84'} />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="52"
          y1="25"
          x2="99"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#dbfff4' : '#fff5fb'} />
          <stop offset=".5" stopColor={income ? '#a2e7cd' : '#fbd0e3'} />
          <stop offset="1" stopColor={income ? '#55ad93' : '#db8db6'} />
        </linearGradient>
        <linearGradient
          id={`${id}-case`}
          x1="39"
          y1="65"
          x2="102"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d873a8" />
          <stop offset=".45" stopColor="#9e4879" />
          <stop offset="1" stopColor="#5d2d50" />
        </linearGradient>
        <radialGradient id={`${id}-aura`}>
          <stop stopColor={income ? '#51e2af' : '#ef6db2'} stopOpacity=".25" />
          <stop offset="1" stopColor={income ? '#51e2af' : '#ef6db2'} stopOpacity="0" />
        </radialGradient>
        <filter
          id={`${id}-relief`}
          x="-20%"
          y="-20%"
          width="145%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="1.5"
            floodColor="#061424"
            floodOpacity=".38"
          />
        </filter>
      </defs>
      <ellipse cx="87" cy="84" rx="48" ry="34" fill={paint('aura')} />
      <ellipse
        cx="86"
        cy="110"
        rx="40"
        ry="5"
        fill={income ? '#062e32' : '#34162e'}
        opacity=".35"
      />
      <g strokeLinecap="round" strokeLinejoin="round" filter={paint('relief')}>
        {income ? (
          <>
            <g transform="rotate(-17 61 63)">
              <rect x="43" y="31" width="35" height="58" rx="5" fill={paint('rim')} />
              <rect
                x="41"
                y="29"
                width="35"
                height="58"
                rx="5"
                fill={paint('paper')}
                stroke="#b7ffe4"
                strokeWidth=".8"
              />
              <rect
                x="45"
                y="34"
                width="27"
                height="48"
                rx="3"
                stroke="#4b9c86"
                strokeWidth=".7"
                strokeDasharray="1 2.5"
              />
              <ellipse
                cx="58.5"
                cy="58"
                rx="8"
                ry="11"
                fill="#73c6a8"
                stroke="#caffeb"
                strokeWidth=".8"
              />
              <path d="M60 51v14m-1-8c-7-4-8 9 0 4m-3-7h6" stroke="#327b68" strokeWidth="1.5" />
              <path d="M50 40h7m-7 35h7m8-35h3m-3 35h3" stroke="#e1fff1" strokeWidth="1.4" />
            </g>
            {[99, 91, 83].map((y) => (
              <g key={y}>
                <path
                  d={`M65 ${y}v5c0 9 54 9 54 0v-5Z`}
                  fill={paint('rim')}
                  stroke="#43ac8a"
                  strokeWidth=".7"
                />
                <ellipse
                  cx="92"
                  cy={y}
                  rx="27"
                  ry="7"
                  fill={paint('top')}
                  stroke="#b1f7d6"
                  strokeWidth=".7"
                />
                <path
                  d={`M69 ${y + 5}q23 8 46 0`}
                  stroke="#9ee8c6"
                  strokeWidth=".8"
                  strokeOpacity=".6"
                />
                <path
                  d={`M78 ${y + 6}v3m9-1v3m10-3v3m9-5v3`}
                  stroke="#185f52"
                  strokeWidth=".7"
                  strokeOpacity=".5"
                />
              </g>
            ))}
            <g transform="rotate(10 91 62)">
              <circle
                cx="94"
                cy="64"
                r="24"
                fill={paint('rim')}
                stroke="#42b18d"
                strokeWidth=".8"
              />
              <circle
                cx="91"
                cy="62"
                r="24"
                fill={paint('metal')}
                stroke="#dcfff0"
                strokeWidth="1.1"
              />
              <circle cx="91" cy="62" r="18.5" stroke="#50a98a" strokeWidth="1.1" />
              <circle
                cx="91"
                cy="62"
                r="16.4"
                stroke="#c4ffe4"
                strokeWidth=".6"
                strokeDasharray="1 2.7"
              />
              <path d="M91 53v18m-9-9h18" stroke="#257c64" strokeWidth="4.2" />
              <path d="M90 52v18m-9-9h18" stroke="#e7fff5" strokeWidth="2.5" strokeOpacity=".75" />
              <path
                d="M72 53a21 21 0 0 1 25-11"
                stroke="#fff"
                strokeWidth="1.7"
                strokeOpacity=".75"
              />
            </g>
            <g transform="rotate(-13 49 96)">
              <circle cx="50.5" cy="97.5" r="12" fill={paint('rim')} />
              <circle
                cx="49"
                cy="96"
                r="12"
                fill={paint('metal')}
                stroke="#c7ffe4"
                strokeWidth=".8"
              />
              <circle cx="49" cy="96" r="8.5" stroke="#4eac89" strokeWidth=".8" />
              <path d="M50 90v12m-1-7c-5-3-6 7 0 4m-2-6h5" stroke="#377b64" strokeWidth="1.3" />
            </g>
            <path
              d="m119 28 1.5 4.5L125 34l-4.5 1.5L119 40l-1.5-4.5L113 34l4.5-1.5Z"
              fill="#c3ffe1"
            />
            <circle cx="35" cy="72" r="2.5" fill="#7ee7bc" />
            <path d="m68 17 .9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9Z" fill="#a1f5d2" />
          </>
        ) : (
          <>
            <g transform="rotate(-13 78 80)">
              <rect
                x="38"
                y="64"
                width="66"
                height="40"
                rx="8"
                fill={paint('case')}
                stroke="#e89abe"
                strokeWidth=".8"
              />
              <path d="M40 74h62v8H40Z" fill="#66334f" opacity=".65" />
              <rect x="45" y="87" width="13" height="9" rx="2" fill="#e9c7e3" />
              <path d="M49 89v5m5-5v5m-7-2.5h9" stroke="#ac80a2" strokeWidth=".7" />
              <path d="M73 94h18" stroke="#eda9cc" strokeWidth="1.2" />
            </g>
            <g transform="rotate(-8 77 57)">
              <path
                d="M59 27h41q12 0 12 13v8H95V39q0-12-12-12Z"
                fill={paint('rim')}
                stroke="#e68ab5"
                strokeWidth=".7"
              />
              <path
                d="M58 25h39v60l-6-3-6 3-6-3-6 3-6-3-6 3-6-3-7 3V39q0-14 10-14Z"
                fill="#7d315b"
                opacity=".3"
                transform="translate(2 2)"
              />
              <path
                d="M56 24h40v59l-6-3-6 3-6-3-6 3-6-3-6 3-6-3-8 3V38q0-14 10-14Z"
                fill={paint('paper')}
                stroke="#ffe5f2"
                strokeWidth=".8"
              />
              <path
                d="M56 24h42q12 0 12 13v6H96v-6q0-13-12-13"
                fill={paint('paper')}
                stroke="#f5c0da"
                strokeWidth=".7"
              />
              <ellipse
                cx="104"
                cy="37"
                rx="5"
                ry="6"
                fill="#b95f91"
                stroke="#ffd1e8"
                strokeWidth=".8"
              />
              <ellipse cx="104" cy="37" rx="2.4" ry="3.2" fill="#7b3c62" />
              <path d="M50 41v32" stroke="#fffaff" strokeWidth="1.8" strokeOpacity=".75" />
              <path d="M57 43h28m-28 8h21m-21 9h28" stroke="#be6792" strokeWidth="2.3" />
              <path d="M57 67h28" stroke="#c57da0" strokeWidth=".8" strokeDasharray="1 2.4" />
              <path d="M59 73h6m11 0h7" stroke="#9d4a77" strokeWidth="1.8" />
            </g>
            <g transform="rotate(12 109 95)">
              <circle
                cx="111"
                cy="97"
                r="16"
                fill={paint('rim')}
                stroke="#bf588d"
                strokeWidth=".7"
              />
              <circle
                cx="109"
                cy="95"
                r="16"
                fill={paint('metal')}
                stroke="#ffe1f0"
                strokeWidth="1"
              />
              <circle cx="109" cy="95" r="11.8" stroke="#c56595" strokeWidth=".8" />
              <path d="M102 95h14" stroke="#a03b70" strokeWidth="3.2" />
              <path d="M102 94h14" stroke="#fff1f8" strokeWidth="1.5" />
              <path
                d="M97 88a13 13 0 0 1 16-5"
                stroke="#fff"
                strokeOpacity=".7"
                strokeWidth="1.2"
              />
            </g>
            <path
              d="m121 17 1.4 4.2 4.2 1.4-4.2 1.4-1.4 4.2-1.4-4.2-4.2-1.4 4.2-1.4Z"
              fill="#ffd0e8"
            />
            <circle cx="30" cy="86" r="2.2" fill="#f1a6ce" />
            <path d="m123 60 .9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9Z" fill="#ed8bc1" />
          </>
        )}
      </g>
    </svg>
  )
}
