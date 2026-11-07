import { useId } from 'react'

export default function HistoryMoneyIcon({ kind }) {
  const id = useId().replaceAll(':', '')
  const income = kind === 'income'
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="history-money-icon"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-history-icon={kind}
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="15"
          y1="25"
          x2="54"
          y2="61"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#b1ffe7' : '#ffc0df'} />
          <stop offset=".45" stopColor={income ? '#56c9ad' : '#ec73ad'} />
          <stop offset="1" stopColor={income ? '#247a78' : '#a83e78'} />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="29"
          y1="13"
          x2="48"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#e4fff2' : '#fff1fa'} />
          <stop offset=".55" stopColor={income ? '#9fe9c7' : '#f4bedb'} />
          <stop offset="1" stopColor={income ? '#56af90' : '#d57ba8'} />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="15"
          y1="21"
          x2="54"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#e6fff7' : '#ffe9f6'} />
          <stop offset="1" stopColor={income ? '#63bba9' : '#c1649a'} />
        </linearGradient>
        <linearGradient
          id={`${id}-badge`}
          x1="44"
          y1="44"
          x2="62"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={income ? '#74f7c5' : '#ff9fce'} />
          <stop offset="1" stopColor={income ? '#1b9c80' : '#d4458a'} />
        </linearGradient>
        <linearGradient id={`${id}-silver`}>
          <stop stopColor="#fff6ff" />
          <stop offset="1" stopColor="#c9c1e7" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-20%"
          y="-20%"
          width="145%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="1.3" floodColor="#070e24" floodOpacity=".35" />
        </filter>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round" filter={paint('shadow')}>
        {income ? (
          <>
            <path d="m14 29 31-7q6-1 7 5v22H14Z" fill="#246b68" stroke="#65c8ab" strokeWidth=".8" />
            <g transform="rotate(-12 31 28)">
              <rect
                x="17"
                y="13"
                width="30"
                height="26"
                rx="4"
                fill={paint('paper')}
                stroke="#c5ffe6"
                strokeWidth=".7"
              />
              <rect
                x="20"
                y="16"
                width="24"
                height="20"
                rx="2"
                stroke="#53a48b"
                strokeWidth=".7"
                strokeDasharray="1 2"
              />
              <ellipse
                cx="32"
                cy="26"
                rx="6"
                ry="8"
                fill="#74cbae"
                stroke="#d7ffed"
                strokeWidth=".7"
              />
              <path d="M33 21v10m-1-6c-5-3-6 6 0 3m-2-5h5" stroke="#2d7b68" strokeWidth="1" />
            </g>
            <g transform="rotate(7 41 29)">
              <rect
                x="28"
                y="19"
                width="28"
                height="23"
                rx="3.5"
                fill={paint('paper')}
                stroke="#d2fff0"
                strokeWidth=".7"
              />
              <path d="M32 23h5m10 0h5M32 37h5m10 0h5" stroke="#4f9b85" strokeWidth=".9" />
              <circle cx="42" cy="30" r="5" fill="#6ec4a7" stroke="#beffe5" strokeWidth=".7" />
              <path d="M42 27v6m-3-3h6" stroke="#d9fff0" strokeWidth="1.1" />
            </g>
            <rect
              x="10"
              y="31"
              width="47"
              height="29"
              rx="8"
              fill={paint('body')}
              stroke={paint('edge')}
              strokeWidth=".9"
            />
            <path d="M13 40v-2q0-5 5-5h31q5 0 5 5c-13-3-27-3-41 2Z" fill="#e5fff3" opacity=".22" />
            <path
              d="M15 44v7q0 5 5 5h22"
              stroke="#c0f4dd"
              strokeOpacity=".55"
              strokeWidth=".8"
              strokeDasharray="1 2"
            />
            <path
              d="M50 38h10v15H50a7.5 7.5 0 0 1 0-15Z"
              fill="#246c68"
              stroke="#a2e9ce"
              strokeWidth=".8"
            />
            <circle cx="51" cy="45.5" r="2" fill={paint('silver')} />
            <path d="M20 45h11m-11 5h7" stroke="#d4ffeb" strokeOpacity=".6" strokeWidth="1.2" />
            <path d="M55 7v14m-5-5 5 5 5-5" stroke="#a2ffdf" strokeWidth="2.6" />
            <circle
              cx="57"
              cy="57"
              r="8.5"
              fill={paint('badge')}
              stroke="#baffdf"
              strokeWidth=".8"
            />
            <path d="M57 53v8m-4-4h8" stroke="#f1fff8" strokeWidth="1.9" />
          </>
        ) : (
          <>
            <g transform="rotate(-10 29 40)">
              <rect
                x="9"
                y="25"
                width="39"
                height="29"
                rx="6"
                fill={paint('body')}
                stroke={paint('edge')}
                strokeWidth=".8"
              />
              <path d="M10 34h37v6H10Z" fill="#87375d" opacity=".6" />
              <rect x="15" y="43" width="9" height="6" rx="1.5" fill={paint('silver')} />
              <path d="M18 44v4m3-4v4m-5-2h7" stroke="#ab8cb6" strokeWidth=".6" />
            </g>
            <path
              d="M34 11h16l9 9v34l-4-2-4 2-4-2-4 2-4-2-4 2-5-2V15q0-4 4-4Z"
              fill="#6b2b50"
              opacity=".3"
              transform="translate(1 2)"
            />
            <path
              d="M33 10h16l9 9v34l-4-2-4 2-4-2-4 2-4-2-4 2-5-2V14q0-4 4-4Z"
              fill={paint('paper')}
              stroke="#ffe1f0"
              strokeWidth=".7"
            />
            <path d="M49 10v9h9" fill="#cf77a3" stroke="#f7cadf" strokeWidth=".7" />
            <path d="M33 16v25" stroke="#fff8fc" strokeWidth="1.3" strokeOpacity=".7" />
            <path d="M37 25h13m-13 6h10m-10 7h13" stroke="#ba5b8b" strokeWidth="1.7" />
            <path d="M36 43h15" stroke="#bf6a94" strokeWidth=".8" strokeDasharray="1 2" />
            <path d="M38 47h5m4 0h4" stroke="#a65080" strokeWidth="1.3" />
            <circle
              cx="16"
              cy="56"
              r="8.5"
              fill={paint('badge')}
              stroke="#ffd1e6"
              strokeWidth=".8"
            />
            <path d="M12 56h8" stroke="#fff1f8" strokeWidth="2" />
            <path d="m48 60 15-15m-9 0h9v9" stroke="#ffacd3" strokeWidth="2.7" />
          </>
        )}
      </g>
    </svg>
  )
}
