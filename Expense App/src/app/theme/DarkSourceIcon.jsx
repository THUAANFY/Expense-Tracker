import { useId } from 'react'

const palettes = {
  all: ['#e9e6ff', '#9eaaff', '#5560b3', '#263154'],
  bank: ['#ddfff4', '#72e2c2', '#32a58c', '#1c514c'],
  cash: ['#ffe9f1', '#ffa3c4', '#da679a', '#66344f'],
  ewallet: ['#f5e8ff', '#c5a2ff', '#9664dc', '#45316e'],
  unassigned: ['#e3edff', '#aac8ff', '#6a96df', '#294578'],
}

export default function DarkSourceIcon({ type, size = 24 }) {
  const kind = Object.hasOwn(palettes, type) ? type : 'unassigned'
  const id = 'source-mark-' + useId().replaceAll(':', '')
  const [light, bright, mid, deep] = palettes[kind]
  const paint = (name) => 'url(#' + id + '-' + name + ')'
  return (
    <svg
      className={'source-badge-icon source-badge-icon--' + kind + ' dark-source-icon'}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-theme-art={'source-' + kind}
    >
      <defs>
        <linearGradient id={id + '-face'} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor={light} />
          <stop offset=".32" stopColor={bright} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <linearGradient id={id + '-metal'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="white" />
          <stop offset=".38" stopColor="#dfdffa" />
          <stop offset=".66" stopColor="#99a4ce" />
          <stop offset="1" stopColor="#f1ecff" />
        </linearGradient>
        <linearGradient id={id + '-mint'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d9fff0" />
          <stop offset=".45" stopColor="#83e3c2" />
          <stop offset="1" stopColor="#359d89" />
        </linearGradient>
        <linearGradient id={id + '-lilac'} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#efdeff" />
          <stop offset=".4" stopColor="#c29aff" />
          <stop offset="1" stopColor="#8051c3" />
        </linearGradient>
        <linearGradient id={id + '-rose'} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#ffe5ef" />
          <stop offset=".4" stopColor="#ff9cc4" />
          <stop offset="1" stopColor="#bc5387" />
        </linearGradient>
      </defs>
      <g strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="20" cy="36.5" rx="14" ry="1.5" fill="#081225" fillOpacity=".5" />
        {kind === 'all' ? (
          <>
            <g transform="rotate(-12 17 16)">
              <rect
                x="4"
                y="5"
                width="26"
                height="19"
                rx="4"
                fill="#275a51"
                stroke="#7dceba"
                strokeWidth=".65"
              />
              <rect
                x="4"
                y="4"
                width="26"
                height="18"
                rx="4"
                fill={paint('mint')}
                stroke="#c5ffea"
                strokeWidth=".65"
              />
              <rect x="8" y="9" width="6" height="5" rx="1.5" fill="#407d6f" />
              <path d="M19 10h6m-6 4h4" stroke="#3b8a76" strokeWidth="1" />
            </g>
            <g transform="rotate(8 24 21)">
              <rect
                x="12"
                y="12"
                width="24"
                height="17"
                rx="4"
                fill="#523775"
                stroke="#c29aff"
                strokeWidth=".65"
              />
              <rect
                x="11"
                y="10"
                width="24"
                height="17"
                rx="4"
                fill={paint('lilac')}
                stroke="#efdcff"
                strokeWidth=".65"
              />
              <path d="M14 15h17" stroke="#62418f" strokeOpacity=".5" strokeWidth="2" />
              <rect x="15" y="20" width="5" height="3" rx="1" fill="#7652a8" />
            </g>
            <rect x="4" y="23" width="28" height="13" rx="4" fill="#6b3555" />
            <rect
              x="3"
              y="21"
              width="29"
              height="13"
              rx="4"
              fill={paint('rose')}
              stroke="#ffe0ec"
              strokeWidth=".7"
            />
            <path d="M7 25h12m-12 5h7" stroke="#a64372" strokeWidth="1" />
            <path
              d="M28 25h6v6h-6a3 3 0 0 1 0-6Z"
              fill="#7d3d64"
              stroke="#ffd3e7"
              strokeWidth=".6"
            />
            <circle cx="29.5" cy="28" r="1" fill="#ffe9f2" />
          </>
        ) : kind === 'bank' ? (
          <>
            <path d="m5 14 15-9 15 9v3H5Z" fill={deep} stroke="#3d9b88" strokeWidth=".7" />
            <path d="m4 12 16-9 16 9v3H4Z" fill={paint('face')} stroke="#c7ffeb" strokeWidth=".7" />
            <path d="m11 11 9-5 9 5H11Z" fill="#318f79" />
            <circle cx="20" cy="8.5" r="1.25" fill="#dcfff3" />
            <rect x="7" y="16" width="26" height="15" fill={deep} fillOpacity=".7" />
            {[11, 20, 29].map((x) => (
              <g key={x}>
                <rect
                  x={x - 2}
                  y="17"
                  width="4"
                  height="13"
                  rx=".6"
                  fill={paint('face')}
                  stroke="#baffdf"
                  strokeWidth=".5"
                />
                <path d={'M' + x + ' 18v11'} stroke="#2b8872" strokeWidth=".65" />
                <path d={'M' + (x - 3) + ' 16h6m-6 15h6'} stroke="#b0f7d8" strokeWidth="1.3" />
              </g>
            ))}
            <rect
              x="6"
              y="31"
              width="28"
              height="3"
              rx="1"
              fill={paint('face')}
              stroke="#c5ffe7"
              strokeWidth=".6"
            />
            <path d="M4 36h32" stroke="#55bfa2" strokeWidth="1.8" />
          </>
        ) : kind === 'cash' ? (
          <>
            <g transform="rotate(-11 19 13)">
              <rect
                x="9"
                y="5"
                width="23"
                height="16"
                rx="2.5"
                fill="#704168"
                stroke="#ce9cc4"
                strokeWidth=".6"
              />
              <rect x="12" y="8" width="17" height="10" rx="1" stroke="#e3b1d3" strokeWidth=".6" />
              <ellipse cx="20.5" cy="13" rx="3" ry="4" fill="#cca0cc" />
            </g>
            <path
              d="M5 21q0-7 7-7h21v18H10q-5 0-5-5Z"
              fill={deep}
              stroke="#df8aaf"
              strokeWidth=".7"
            />
            <rect x="4" y="17" width="30" height="19" rx="5.5" fill={deep} />
            <rect
              x="3"
              y="15"
              width="30"
              height="19"
              rx="5.5"
              fill={paint('face')}
              stroke="#ffd6e6"
              strokeWidth=".7"
            />
            <path
              d="M6 25v2q0 4 4 4h12m-15-12h17"
              stroke="#ffe0eb"
              strokeOpacity=".65"
              strokeWidth=".65"
              strokeDasharray="1 1.7"
            />
            <circle
              cx="16"
              cy="24"
              r="5"
              fill="#a94f7d"
              fillOpacity=".45"
              stroke="#ffc4dc"
              strokeWidth=".6"
            />
            <path
              d="M17.5 20.5V27m0-4c-3-2-5 1-3 2.5 1 .8 2 .5 3-.5m-1-3.5h3"
              stroke="#ffe5ef"
              strokeWidth="1"
            />
            <path d="M29 21h7v8h-7a4 4 0 0 1 0-8Z" fill={deep} stroke="#f5a6c9" strokeWidth=".65" />
            <circle cx="30" cy="25" r="1.7" fill={paint('metal')} />
          </>
        ) : kind === 'ewallet' ? (
          <>
            <rect
              x="10"
              y="4"
              width="21"
              height="32"
              rx="6"
              fill={deep}
              stroke="#9465bf"
              strokeWidth=".7"
            />
            <rect
              x="8"
              y="2"
              width="21"
              height="32"
              rx="6"
              fill={paint('face')}
              stroke="#f2dcff"
              strokeWidth=".7"
            />
            <rect
              x="11"
              y="5"
              width="15"
              height="26"
              rx="3.5"
              fill="#302148"
              stroke="#d7b8f5"
              strokeWidth=".6"
            />
            <path d="M16 6h5M17 29h3" stroke="#c6a2e5" strokeWidth="1.2" />
            <rect x="14" y="12" width="9" height="10" rx="1.5" fill="#efddff" />
            <path d="M16 14h2v2h-2zM20 14h1m-5 4v2h2m2-2h1v2" stroke="#5b3d80" strokeWidth=".85" />
            <path d="M12 14v-3h3m7 0h3v3m-13 7v3h3" stroke="#a9efce" strokeWidth=".85" />
            <circle cx="29" cy="28" r="7" fill="#23564d" stroke="#8cdcc5" strokeWidth=".6" />
            <circle cx="28" cy="27" r="6" fill={paint('mint')} stroke="#d3ffed" strokeWidth=".6" />
            <path d="m25 27 2 2 4-4.5" stroke="#286859" strokeWidth="1.6" />
          </>
        ) : (
          <>
            <path
              d="M10 5h14l9 9v22H10q-4 0-4-4V9q0-4 4-4Z"
              fill={deep}
              stroke="#7299cd"
              strokeWidth=".65"
            />
            <path
              d="M9 3h14l9 9v21H9q-4 0-4-4V7q0-4 4-4Z"
              fill={paint('face')}
              stroke="#d9e9ff"
              strokeWidth=".7"
            />
            <path d="M23 3v6q0 3 3 3h6" fill="#6b92cb" stroke="#d1e5ff" strokeWidth=".7" />
            <circle
              cx="18"
              cy="22"
              r="7"
              fill="#284d85"
              fillOpacity=".8"
              stroke="#c1d9ff"
              strokeWidth=".7"
            />
            <path
              d="M15.5 20c0-3 5-3 5 0 0 2-2.5 2-2.5 4m0 2h.05"
              stroke="#e1eeff"
              strokeWidth="1.5"
            />
          </>
        )}
      </g>
    </svg>
  )
}
