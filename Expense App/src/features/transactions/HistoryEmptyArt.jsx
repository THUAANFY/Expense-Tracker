import { useId } from 'react'

export default function HistoryEmptyArt({
  dark = false,
  searching = false,
  className = 'history-empty-illustration',
}) {
  const id = `empty-tray-${useId().replaceAll(':', '')}`
  const paint = (name) => `url(#${id}-${name})`
  const ink = dark ? '#7870b8' : '#aa8cbe'
  const paperInk = dark ? '#8a8eb9' : '#a995b9'
  return (
    <svg
      className={className}
      viewBox="0 0 240 184"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-history-empty-art={searching ? 'search' : 'first-entry'}
    >
      <defs>
        <linearGradient
          id={`${id}-tray`}
          x1="57"
          y1="102"
          x2="179"
          y2="163"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#b69bff' : '#e0cef3'} />
          <stop offset=".42" stopColor={dark ? '#8970e0' : '#c5abe4'} />
          <stop offset="1" stopColor={dark ? '#514595' : '#a789ca'} />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="42"
          y1="106"
          x2="199"
          y2="158"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#eee5ff' : '#faf2ff'} />
          <stop offset=".5" stopColor={dark ? '#af96ee' : '#c5a8df'} />
          <stop offset="1" stopColor={dark ? '#6b6ac1' : '#aa8bc9'} />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="105"
          y1="22"
          x2="171"
          y2="121"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#faf8ff" />
          <stop offset="1" stopColor={dark ? '#c5d0ef' : '#eee2f6'} />
        </linearGradient>
        <linearGradient id={`${id}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={dark ? '#c4ffeb' : '#dcf4e6'} />
          <stop offset="1" stopColor={dark ? '#4dc6a8' : '#99ceb7'} />
        </linearGradient>
        <linearGradient
          id={`${id}-glass`}
          x1="171"
          y1="110"
          x2="211"
          y2="155"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#b7c8ff' : '#ece5ff'} stopOpacity=".95" />
          <stop offset=".45" stopColor={dark ? '#7979d5' : '#c8b6e8'} stopOpacity=".9" />
          <stop offset="1" stopColor={dark ? '#454982' : '#b49bd5'} />
        </linearGradient>
        <linearGradient
          id={`${id}-handle`}
          x1="202"
          y1="143"
          x2="224"
          y2="165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#d2c7ff' : '#e1cff1'} />
          <stop offset=".5" stopColor={dark ? '#8d7bd0' : '#bba0d3'} />
          <stop offset="1" stopColor={dark ? '#555799' : '#9e81be'} />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor={dark ? '#080b22' : '#baa6ca'} stopOpacity={dark ? '.65' : '.28'} />
          <stop offset="1" stopColor={dark ? '#080b22' : '#baa6ca'} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="122" cy="166" rx="91" ry="11" fill={paint('shadow')} />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M29 110c-10-24 1-49 22-57m135 6c18 7 25 21 26 34"
          stroke={dark ? '#777cb4' : '#c6b4d8'}
          strokeDasharray="2 5"
          strokeOpacity=".55"
        />
        <path
          d="m33 45 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
          fill={dark ? '#bdacff' : '#d5bae9'}
          stroke={dark ? '#ded0ff' : '#bca0d0'}
          strokeWidth=".8"
        />
        <path
          d="m208 84 1.3 3.5 3.5 1.3-3.5 1.3L208 94l-1.3-3.9-3.5-1.3 3.5-1.3Z"
          fill={dark ? '#93bfff' : '#bccfe7'}
        />
        <circle cx="48" cy="27" r="2.1" fill={dark ? '#a28ee5' : '#ceb9de'} />
        <circle cx="192" cy="22" r="1.7" fill={dark ? '#70cbb9' : '#a5cdb8'} />

        <rect x="59" y="154" width="16" height="8" rx="3" fill={dark ? '#434274' : '#a38ab9'} />
        <rect x="169" y="154" width="16" height="8" rx="3" fill={dark ? '#393b6c' : '#a38ab9'} />
        <path
          d="m41 107 15-15h129l16 15-9 42H51Z"
          fill={dark ? '#38345f' : '#c5b1d8'}
          stroke={ink}
          strokeWidth="1.3"
        />
        <path
          d="m48 107 12-10h121l12 10-6 32H55Z"
          fill={dark ? '#242c48' : '#b9a5cd'}
          stroke={dark ? '#625a91' : '#b39bc9'}
        />

        <g transform="rotate(-13 90 81)">
          <path
            d="M64 30q0-6 6-6h52q6 0 6 6v94l-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3Z"
            fill={dark ? '#c1e7dd' : '#f2faf3'}
            stroke={dark ? '#8ab7b5' : '#a6c2ae'}
            strokeWidth="1.3"
          />
          <path d="M69 32h53" stroke="#fff" strokeOpacity=".75" strokeWidth="1.4" />
          <rect x="74" y="37" width="44" height="17" rx="5" fill={paint('mint')} />
          <path
            d="M83 42v7m-3.5-3.5h7m6-2h16m-16 5h11"
            stroke={dark ? '#378c79' : '#6c9b83'}
            strokeWidth="1.4"
          />
          <path
            d="M76 66h29m-29 6h22m-22 8h35m-35 6h25"
            stroke={dark ? '#84a6a3' : '#b3c8b7'}
            strokeWidth="1.2"
          />
          <path
            d="M79 108V99m10 9V94m10 14V89"
            stroke={dark ? '#80b4a2' : '#a5c9af'}
            strokeWidth="5"
          />
          <path d="M74 113h39" stroke={dark ? '#80a39c' : '#b7cdbb'} />
        </g>

        <g transform="rotate(8 142 77)">
          <path
            d="M112 21q0-6 6-6h52q6 0 6 6v108l-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3-5 3-5-3Z"
            fill={paint('paper')}
            stroke={dark ? '#a8abd9' : '#b6a1cc'}
            strokeWidth="1.3"
          />
          <path d="M117 24h52m-52 3v79" stroke="#fff" strokeOpacity=".75" strokeWidth="1.4" />
          <rect x="124" y="28" width="24" height="6" rx="3" fill={dark ? '#9698d3' : '#c7afd9'} />
          <path d="M124 41h39" stroke={paperInk} strokeWidth="1.2" strokeDasharray="1 3" />
          <rect x="123" y="51" width="12" height="12" rx="4" fill={dark ? '#80c5af' : '#c0dcc6'} />
          <path d="M129 54v6m-3-3h6" stroke={dark ? '#edfef8' : '#719680'} strokeWidth="1.2" />
          <path d="M141 54h22m-22 6h14" stroke={paperInk} strokeWidth="1.6" />
          <rect x="123" y="74" width="12" height="12" rx="4" fill={dark ? '#d8a5bd' : '#eccad7'} />
          <path d="M126 80h6" stroke={dark ? '#fff0f6' : '#ae859d'} strokeWidth="1.3" />
          <path d="M141 77h22m-22 6h17M124 97h39m-39 7h22" stroke={paperInk} strokeWidth="1.5" />
          <path d="M156 31h7m-3.5-3.5v7" stroke={dark ? '#8988bc' : '#b59cc9'} strokeWidth="1.2" />
        </g>

        <path
          d="M47 104h29l11 13h67l11-13h30q6 0 6 6l-8 41q-1 7-9 7H58q-8 0-9-7l-8-41q-1-6 6-6Z"
          fill={paint('tray')}
          stroke={paint('edge')}
          strokeWidth="1.6"
        />
        <path
          d="M45 109h29l11 13h71l11-13h30"
          stroke={dark ? '#ece2ff' : '#f3e7ff'}
          strokeOpacity=".65"
          strokeWidth="1.5"
        />
        <path
          d="m46 116 6 34q1 4 6 4h126"
          stroke={dark ? '#d4baf8' : '#e4cff1'}
          strokeOpacity=".5"
          strokeWidth="1.1"
        />
        <path
          d="m195 115-7 34q-1 4-6 4h-17"
          stroke={dark ? '#3e3c7b' : '#9e80bd'}
          strokeWidth="1.2"
          strokeOpacity=".6"
        />
        <path d="M56 126h28l-6 22H58Z" fill="#fff" fillOpacity={dark ? '.08' : '.15'} />
        <rect
          x="96"
          y="131"
          width="49"
          height="17"
          rx="6"
          fill={dark ? '#d7d2f5' : '#efe4fa'}
          stroke={dark ? '#c2b0ee' : '#c1a4d9'}
        />
        <path
          d="m106 136-3 3 3 3m-3-3h12m17-3 3 3-3 3m3-3h-12"
          stroke={dark ? '#7662b5' : '#a084bb'}
          strokeWidth="1.2"
        />
        <circle cx="120" cy="139" r="1.5" fill={dark ? '#9b8ac7' : '#c3a9d6'} />

        {searching ? (
          <g>
            <path
              d="m205 146 17 16q3 3 0 6t-6 0l-17-17"
              fill={paint('handle')}
              stroke={dark ? '#a69bd8' : '#ad91c7'}
              strokeWidth="1.2"
            />
            <path
              d="m208 150 12 12"
              stroke={dark ? '#e4dbff' : '#f4e9ff'}
              strokeWidth="1.4"
              strokeOpacity=".8"
            />
            <circle
              cx="188"
              cy="132"
              r="26"
              fill={paint('glass')}
              stroke={dark ? '#cfceff' : '#bda0d6'}
              strokeWidth="1.5"
            />
            <circle
              cx="188"
              cy="132"
              r="20.5"
              fill={dark ? '#333b65' : '#f2eefa'}
              fillOpacity=".65"
              stroke={dark ? '#a4a9e3' : '#d2bee3'}
            />
            <path
              d="M173 128c1-7 7-11 13-11"
              stroke={dark ? '#eef0ff' : '#fff'}
              strokeOpacity=".8"
              strokeWidth="2.2"
            />
            <path
              d="M180 135h.1m8 0h.1m8 0h.1"
              stroke={dark ? '#d6d5f7' : '#b397c9'}
              strokeWidth="2.8"
            />
          </g>
        ) : (
          <g transform="rotate(12 202 64)">
            <rect
              x="185"
              y="46"
              width="34"
              height="34"
              rx="11"
              fill={paint('mint')}
              stroke={dark ? '#b4f1db' : '#9ec8af'}
              strokeWidth="1.2"
            />
            <path d="M193 50h14q5 0 6 4" stroke="#f1fff8" strokeWidth="1.3" strokeOpacity=".75" />
            <path d="M202 56v14m-7-7h14" stroke={dark ? '#2c8a79' : '#709a83'} strokeWidth="2.2" />
          </g>
        )}
      </g>
    </svg>
  )
}
