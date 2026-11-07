import { useId } from 'react'

// All shading is static vector paint, without blur filters.
export default function NotesEmptyArt({ className = '', variant = 'notebook', dark = true }) {
  const id = 'notes-empty-' + useId().replaceAll(':', '')
  const paint = (name) => `url(#${id}-${name})`
  const ink = dark ? '#e3cfff' : '#8964ad'
  const ruled = dark ? '#9c9bc7' : '#d6c7e2'
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-notes-empty-art={variant}
    >
      <defs>
        <linearGradient id={id + '-cover'} x1=".1" y1="0" x2=".9" y2="1">
          <stop stopColor={dark ? '#d0a1ff' : '#e4d2f4'} />
          <stop offset=".4" stopColor={dark ? '#a568ed' : '#ceb0e8'} />
          <stop offset="1" stopColor={dark ? '#53449a' : '#ab8dca'} />
        </linearGradient>
        <linearGradient id={id + '-edge'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f6e8ff" />
          <stop offset=".45" stopColor="#b88ff7" />
          <stop offset="1" stopColor="#7dbaf5" />
        </linearGradient>
        <linearGradient id={id + '-paper'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={dark ? '#e8eaff' : '#fffcf6'} />
          <stop offset="1" stopColor={dark ? '#a7b5d9' : '#eee4f5'} />
        </linearGradient>
        <linearGradient id={id + '-mint'} x1=".2" y1="0" x2="1" y2="1">
          <stop stopColor={dark ? '#c2fff1' : '#ddf6eb'} />
          <stop offset=".4" stopColor={dark ? '#70ddce' : '#a7d9c4'} />
          <stop offset="1" stopColor={dark ? '#347c99' : '#77b3a5'} />
        </linearGradient>
        <linearGradient id={id + '-glass'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#84cfff" stopOpacity=".3" />
          <stop offset=".55" stopColor="#4e6fbb" stopOpacity=".08" />
          <stop offset="1" stopColor="#c599ff" stopOpacity=".35" />
        </linearGradient>
        <radialGradient id={id + '-ground'}>
          <stop stopColor="#9c7ad6" stopOpacity=".3" />
          <stop offset="1" stopColor="#8f6ae8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="160" rx="88" ry="12" fill={paint('ground')} />
      {variant === 'search' ? (
        <>
          <g transform="rotate(-13 103 88)">
            <rect
              x="54"
              y="35"
              width="89"
              height="112"
              rx="13"
              fill={paint('cover')}
              stroke={ink}
              strokeWidth="1.4"
            />
            <path d="M65 45v90" stroke={ink} strokeOpacity=".4" />
          </g>
          <g transform="rotate(5 117 93)">
            <rect
              x="76"
              y="35"
              width="85"
              height="113"
              rx="11"
              fill={paint('paper')}
              stroke={ink}
              strokeWidth="1.4"
            />
            <path
              d="M92 55h38M92 66h50M92 77h29m-29 48h28"
              stroke={ruled}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="90" y="94" width="10" height="10" rx="3" fill={paint('mint')} />
            <path d="M108 99h27m-27 11h20" stroke={ruled} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g transform="rotate(-8 162 104)">
            <path
              d="m178 119 24 27q5 6-1 10t-10-1l-23-27Z"
              fill={paint('cover')}
              stroke={ink}
              strokeWidth="1.5"
            />
            <path
              d="m183 133 14 16"
              stroke={ink}
              strokeOpacity=".7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="155"
              cy="95"
              r="36"
              fill={dark ? '#1a2b45' : '#f3f5fb'}
              stroke={paint('mint')}
              strokeWidth="7"
            />
            <circle
              cx="155"
              cy="95"
              r="31"
              fill={paint('glass')}
              stroke={dark ? '#a1eee1' : '#9acabb'}
              strokeWidth="1.3"
            />
            <path d="M136 83q7-12 22-11" stroke="#d0f9ff" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M143 95h23m-23 9h14"
              stroke={dark ? '#b8cfed' : '#a1b5d2'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <circle
            cx="58"
            cy="125"
            r="11"
            fill={paint('mint')}
            stroke={dark ? '#abf7df' : '#86bba8'}
          />
          <path
            d="M53 122h10m-8 4h6m-4 4h2"
            stroke="#2d6471"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <g transform="rotate(-9 117 91)">
            <rect
              x="63"
              y="26"
              width="107"
              height="128"
              rx="15"
              fill="#524380"
              stroke={paint('edge')}
              strokeWidth="1.5"
            />
            <rect
              x="70"
              y="33"
              width="99"
              height="114"
              rx="10"
              fill={paint('paper')}
              stroke="#c5c5e4"
            />
            <path d="M79 137h80m-80 4h79" stroke="#8d90b5" strokeOpacity=".65" />
            <rect
              x="58"
              y="23"
              width="104"
              height="121"
              rx="13"
              fill={paint('cover')}
              stroke={paint('edge')}
              strokeWidth="2"
            />
            <path d="M72 28v110" stroke="#eed6ff" strokeOpacity=".55" />
            <path
              d="M78 30h69q8 0 8 8v85"
              stroke="#f1dfff"
              strokeOpacity=".35"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="88"
              y="49"
              width="55"
              height="58"
              rx="13"
              fill="#472a7b"
              fillOpacity=".28"
              stroke="#d2b0ff"
              strokeOpacity=".65"
            />
            <path
              d="M101 85c-10 0-13-13-4-17 0-10 13-14 19-7 8-6 18 0 17 9 10 5 6 16-3 16Z"
              fill={paint('paper')}
              stroke="#f3e4ff"
              strokeWidth="1.2"
            />
            <path
              d="M99 119h30m-26 7h22"
              stroke="#e5d1ff"
              strokeOpacity=".7"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M131 24h16v28l-8-5-8 5Z"
              fill={paint('mint')}
              stroke="#b2fae6"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {[48, 71, 94, 117].map((y) => (
              <g key={y}>
                <circle cx="66" cy={y} r="2.6" fill="#584082" />
                <path
                  d={`M65 ${y}h-9q-7 0-7-5t7-5h6`}
                  stroke={paint('edge')}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
          <g transform="rotate(22 183 102)">
            <rect
              x="177"
              y="54"
              width="12"
              height="87"
              rx="5"
              fill={paint('mint')}
              stroke="#b6f3e6"
              strokeWidth="1.3"
            />
            <path
              d="M177 128h12v13l-6 13-6-13Z"
              fill={paint('paper')}
              stroke="#d3e5ed"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path d="m180 148 3 6 3-6" fill="#717699" />
            <path
              d="M181 63v57m7-55h5v24"
              stroke="#e0fff8"
              strokeOpacity=".7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        </>
      )}
      <path d="m192 30 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill={dark ? '#ddc3ff' : '#c7a8df'} />
      <path
        d="m37 82 1.5 4.5L43 88l-4.5 1.5L37 94l-1.5-4.5L31 88l4.5-1.5Z"
        fill={dark ? '#8acfe5' : '#97c8c5'}
      />
      <circle cx="202" cy="119" r="2" fill={dark ? '#bba0ff' : '#bca1d0'} />
    </svg>
  )
}
