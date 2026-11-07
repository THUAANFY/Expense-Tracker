import { useId } from 'react'

export default function FintechJournalArt({ compact = false }) {
  const id = useId().replaceAll(':', '')
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="journal-desk-art fintech-journal-art"
      viewBox="0 0 320 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#8b5cf6" stopOpacity=".24" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${id}-glass`}
          x1="87"
          y1="32"
          x2="235"
          y2="171"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#625af9" stopOpacity=".18" />
          <stop offset=".5" stopColor="#4c3e94" stopOpacity=".05" />
          <stop offset="1" stopColor="#894eff" stopOpacity=".18" />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="78"
          y1="28"
          x2="237"
          y2="173"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7b98ff" stopOpacity=".8" />
          <stop offset=".5" stopColor="#9476ff" stopOpacity=".25" />
          <stop offset="1" stopColor="#aa6dff" stopOpacity=".65" />
        </linearGradient>
        <radialGradient id={`${id}-cloud`} cx=".34" cy=".18" r=".92">
          <stop stopColor="#fffaff" />
          <stop offset=".38" stopColor="#e3d5ff" />
          <stop offset=".74" stopColor="#bb96f9" />
          <stop offset="1" stopColor="#925fdc" />
        </radialGradient>
        <linearGradient
          id={`${id}-cover`}
          x1="74"
          y1="117"
          x2="240"
          y2="203"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c18cff" />
          <stop offset=".45" stopColor="#7844d6" />
          <stop offset="1" stopColor="#433493" />
        </linearGradient>
        <linearGradient
          id={`${id}-left`}
          x1="77"
          y1="109"
          x2="148"
          y2="187"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dbafe5" />
          <stop offset=".32" stopColor="#9461c8" />
          <stop offset="1" stopColor="#51348e" />
        </linearGradient>
        <linearGradient
          id={`${id}-right`}
          x1="162"
          y1="112"
          x2="235"
          y2="185"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b28aeb" />
          <stop offset=".48" stopColor="#6c47b3" />
          <stop offset="1" stopColor="#443078" />
        </linearGradient>
        <linearGradient
          id={`${id}-silver`}
          x1="192"
          y1="110"
          x2="211"
          y2="153"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1ddff" />
          <stop offset=".5" stopColor="#c296fb" />
          <stop offset="1" stopColor="#8960d8" />
        </linearGradient>
        <linearGradient
          id={`${id}-pen`}
          x1="252"
          y1="107"
          x2="265"
          y2="176"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8edff" />
          <stop offset=".35" stopColor="#d8bbff" />
          <stop offset="1" stopColor="#a879ee" />
        </linearGradient>
        <radialGradient id={`${id}-ground`}>
          <stop stopColor="#8755ec" stopOpacity=".06" />
          <stop offset=".7" stopColor="#7347dc" stopOpacity=".12" />
          <stop offset="1" stopColor="#a273ff" stopOpacity=".32" />
        </radialGradient>
        <filter
          id={`${id}-relief`}
          x="-15%"
          y="-15%"
          width="130%"
          height="145%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0b0923" floodOpacity=".4" />
        </filter>
        <filter
          id={`${id}-glow`}
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      {!compact && <ellipse cx="160" cy="124" rx="134" ry="89" fill={paint('halo')} />}
      <g strokeLinecap="round" strokeLinejoin="round">
        {!compact && (
          <g>
            <path
              d="M8 196c-1-34 17-57 42-54 22 2 29 17 47 10 12-5 28 2 28 14 1 26-45 40-117 30Z"
              fill={paint('glass')}
              opacity=".6"
            />
            <path d="M9 199c7-41 30-68 64-56s38 16 66-5" stroke="#8050cf" strokeOpacity=".4" />
            <rect
              x="75"
              y="25"
              width="174"
              height="146"
              rx="24"
              fill={paint('glass')}
              stroke={paint('edge')}
              strokeWidth="1.2"
            />
            <path
              d="M78 65V51q0-23 23-23h119q18 0 24 16"
              stroke="#9f91ff"
              strokeOpacity=".2"
              strokeWidth="2"
            />
            <ellipse
              cx="161"
              cy="201"
              rx="141"
              ry="10"
              fill={paint('ground')}
              stroke="#9c67ff"
              strokeOpacity=".35"
              strokeWidth=".7"
            />
            <ellipse
              cx="161"
              cy="201"
              rx="110"
              ry="7"
              fill="#9255ff"
              opacity=".25"
              filter={paint('glow')}
            />
          </g>
        )}
        <g className="journal-cloud">
          <path
            d="M106 117C86 117 77 105 82 91 76 76 87 62 102 61c1-19 16-30 32-24 8-23 45-25 56 2 21-3 38 12 36 32 19 7 18 37-1 44Z"
            fill="#bd91ff"
            opacity=".36"
            filter={paint('glow')}
          />
          <path
            d="M106 117C86 117 77 105 82 91 76 76 87 62 102 61c1-19 16-30 32-24 8-23 45-25 56 2 21-3 38 12 36 32 19 7 18 37-1 44Z"
            fill={paint('cloud')}
            stroke="#f1e1ff"
            strokeWidth="1.3"
          />
          <path
            d="M87 91c-3-12 5-23 17-24m3-9c3-13 15-20 26-15m8-8c9-15 34-15 43 3"
            stroke="#fff"
            strokeWidth="2.5"
            strokeOpacity=".7"
          />
          <path
            d="M85 99c13 17 116 24 146-3-1 13-12 20-25 20h-96c-13 0-21-5-25-17Z"
            fill="#a779e9"
            opacity=".16"
          />
          <ellipse cx="124" cy="95" rx="6" ry="3.4" fill="#eeafe7" />
          <ellipse cx="181" cy="95" rx="6" ry="3.4" fill="#eeafe7" />
          <g className="journal-eyes" fill="#4a2d87">
            <ellipse cx="135" cy="86" rx="2.8" ry="4.2" />
            <ellipse cx="169" cy="86" rx="2.8" ry="4.2" />
          </g>
          <path d="M147 94q5 6 10 0" stroke="#50318d" strokeWidth="1.9" />
        </g>
        <g filter={paint('relief')}>
          <path
            d="M58 116c36-12 65-9 95 9 30-17 62-20 94-10l8 78c-36-8-69-6-94 7q-6 4-12 0c-31-13-63-16-99-5Z"
            fill={paint('cover')}
            stroke="#bd8cff"
            strokeWidth="1.2"
          />
          <path
            d="M65 111c32-9 60-5 88 12 28-17 58-19 89-11l7 73c-32-7-66-4-89 8q-6 3-12 0c-29-12-59-13-91-6Z"
            fill="#b38ce7"
            stroke="#e3c9ff"
            strokeWidth="1.1"
          />
          <path
            d="M69 108c32-6 59-2 84 11v69c-28-13-57-15-90-8Z"
            fill={paint('left')}
            stroke="#efd4ff"
            strokeWidth="1.4"
          />
          <path
            d="M153 119c25-14 54-17 85-10l5 71c-33-7-62-4-90 8Z"
            fill={paint('right')}
            stroke="#e1c7ff"
            strokeWidth="1.4"
          />
          <path d="M153 121v65" stroke="#dbc3fb" strokeWidth="1" strokeOpacity=".7" />
          <path d="M69 108c32-6 59-2 84 11 25-14 54-17 85-10" stroke="#fff0ff" strokeWidth="2.4" />
          <path d="M65 183c32-7 62-4 89 9 29-13 59-17 91-9" stroke="#d4a8ff" strokeWidth="1.3" />
          <path
            d="M58 191c34-6 65-4 91 8q5 3 10 0c29-12 56-15 87-9"
            stroke="#e5c2ff"
            strokeWidth=".9"
          />
          <path
            d="M84 132q25-5 47 2m-48 12q25-4 47 3m-48 11q24-3 47 3"
            stroke="#bd9ae5"
            strokeWidth="2.1"
          />
          <path
            d="M170 133q25-7 50-2m-49 16q24-6 50-2m-49 16q24-5 50-2"
            stroke="#b28bdf"
            strokeWidth="2.1"
          />
          <path
            d="m191 109 22-1 2 46-12-6-11 6Z"
            fill="#35235f"
            opacity=".22"
            transform="translate(1 2)"
          />
          <path
            d="m190 109 22-1 2 44-12-6-11 6Z"
            fill={paint('silver')}
            stroke="#d2b5ff"
            strokeWidth=".7"
          />
          <path d="m193 113 1 34 8-4 9 5" stroke="#f7e5ff" strokeOpacity=".35" />
        </g>
        <g className="journal-writing-hand">
          <g transform="rotate(32 258 147)" filter={paint('relief')}>
            <rect
              x="253"
              y="89"
              width="10"
              height="13"
              rx="3.5"
              fill="#d5a2f2"
              stroke="#f0d2ff"
              strokeWidth=".7"
            />
            <rect
              x="252"
              y="98"
              width="12"
              height="82"
              rx="4"
              fill={paint('pen')}
              stroke="#ead3ff"
              strokeWidth=".8"
            />
            <path d="M252 105h12" stroke="#a375d9" strokeWidth="1.7" />
            <path d="M255 111v60" stroke="#fff8ff" strokeWidth="2.1" strokeOpacity=".8" />
            <path d="m252 179 6 20 6-20Z" fill="#c8a0f0" stroke="#f1d9ff" strokeWidth=".7" />
            <path d="m256.5 194.5 1.5 4.5 1.5-4.5Z" fill="#62408f" />
          </g>
        </g>
        <g className="journal-sparkles">
          <g filter={paint('glow')} opacity=".55">
            <path d="m55 50 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffd3ad" />
            <path d="m274 48 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#c39aff" />
            <circle cx="292" cy="151" r="2.5" fill="#e4a8ff" />
          </g>
          <path d="m55 50 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffe0bb" />
          <path d="m274 48 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#cba4ff" />
          <circle cx="292" cy="151" r="2.3" fill="#e4b1ff" />
          <circle cx="61" cy="83" r="1.8" fill="#fff1d8" />
          <circle cx="37" cy="173" r="3.3" fill="#af7df7" />
          <circle cx="264" cy="78" r=".9" fill="#b47cff" />
        </g>
      </g>
    </svg>
  )
}
