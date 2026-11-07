import { useId } from 'react'

// A dedicated ledger emblem: source card, bound register, cash flows and history seal.
export default function SourceLedgerMark() {
  const id = `ledger-mark-${useId().replaceAll(':', '')}`
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="source-ledger-illustration source-ledger-mark-art"
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-cover`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efdfff" />
          <stop offset=".24" stopColor="#c29af8" />
          <stop offset=".65" stopColor="#8e63d3" />
          <stop offset="1" stopColor="#553780" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbecff" />
          <stop offset=".35" stopColor="#c7a5f5" />
          <stop offset=".65" stopColor="#674594" />
          <stop offset="1" stopColor="#b991ee" />
        </linearGradient>
        <linearGradient id={`${id}-inset`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#65508b" />
          <stop offset=".5" stopColor="#3d315f" />
          <stop offset="1" stopColor="#292b4a" />
        </linearGradient>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d1eeff" />
          <stop offset=".36" stopColor="#7caef5" />
          <stop offset="1" stopColor="#3b538f" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff6ff" />
          <stop offset=".4" stopColor="#d4c7f2" />
          <stop offset=".65" stopColor="#8f86b9" />
          <stop offset="1" stopColor="#f0e1ff" />
        </linearGradient>
        <linearGradient id={`${id}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d9fff1" />
          <stop offset=".4" stopColor="#7ce5c4" />
          <stop offset="1" stopColor="#3d978e" />
        </linearGradient>
        <linearGradient id={`${id}-rose`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffe0ee" />
          <stop offset=".4" stopColor="#f296bd" />
          <stop offset="1" stopColor="#ad558e" />
        </linearGradient>
      </defs>

      <ellipse cx="66" cy="117" rx="45" ry="5" fill="#0b1025" fillOpacity=".6" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(10 76 31)">
          <rect
            x="51"
            y="16"
            width="49"
            height="31"
            rx="6"
            fill="#31466f"
            stroke="#6b8ac9"
            strokeWidth="1"
          />
          <rect
            x="49"
            y="13"
            width="49"
            height="31"
            rx="6"
            fill={paint('blue')}
            stroke="#cce8ff"
            strokeWidth="1"
          />
          <path d="M53 24v-3q0-4 4-4h30" stroke="#eff8ff" strokeWidth="1.2" strokeOpacity=".65" />
          <rect
            x="56"
            y="24"
            width="10"
            height="8"
            rx="2"
            fill={paint('metal')}
            stroke="#dbe3ff"
            strokeWidth=".6"
          />
          <path d="M60 24v8m-4-4h10" stroke="#8489b3" strokeWidth=".7" />
          <path d="M74 24q3 3 0 6m4-8q5 5 0 10" stroke="#e8f5ff" strokeWidth="1.1" />
          <path d="M56 38h13m5 0h8" stroke="#d1e8ff" strokeWidth="1.4" />
        </g>

        <g transform="rotate(-7 57 69)">
          <rect
            x="25"
            y="28"
            width="67"
            height="84"
            rx="11"
            fill="#42315d"
            stroke="#9770bf"
            strokeWidth="1.1"
          />
          <path
            d="M35 29h48q6 0 6 6v65q0 7-7 7H34"
            fill={paint('metal')}
            stroke="#d7c5ed"
            strokeWidth="1"
          />
          <path d="M40 105h41m-39 3h38" stroke="#8f7aa7" strokeWidth=".8" />
          <rect
            x="21"
            y="23"
            width="67"
            height="82"
            rx="11"
            fill={paint('edge')}
            stroke="#f1dbff"
            strokeWidth="1.2"
          />
          <rect
            x="24"
            y="26"
            width="61"
            height="76"
            rx="8.5"
            fill={paint('cover')}
            stroke="#a47ed4"
            strokeWidth=".8"
          />
          <path d="M27 43V35q0-6 6-6h40" stroke="#fff3ff" strokeWidth="1.3" strokeOpacity=".65" />
          <path d="M33 27v74" stroke="#705092" strokeWidth="1.5" />
          <path d="M35 29v69" stroke="#e3c4ff" strokeWidth=".7" strokeOpacity=".55" />

          {[40, 62, 84].map((y) => (
            <g key={y}>
              <ellipse cx="28" cy={y} rx="2.1" ry="2.6" fill="#634875" />
              <path d={`M28 ${y}c-12 2-13-9-2-10`} stroke="#6b5b90" strokeWidth="3.6" />
              <path d={`M27 ${y - 0.7}c-9 1-10-7-1-8`} stroke={paint('metal')} strokeWidth="2.4" />
            </g>
          ))}

          <rect
            x="40"
            y="36"
            width="39"
            height="58"
            rx="7"
            fill={paint('inset')}
            stroke="#ddbcff"
            strokeOpacity=".65"
            strokeWidth=".8"
          />
          <path d="M46 43h19m-19 4h12" stroke="#ddc3f4" strokeWidth="1.6" strokeOpacity=".85" />

          <rect x="46" y="54" width="12" height="12" rx="3.5" fill="#2c645e" />
          <rect
            x="45"
            y="52"
            width="12"
            height="12"
            rx="3.5"
            fill={paint('mint')}
            stroke="#ccffed"
            strokeWidth=".6"
          />
          <path d="m54 55-6 6m0-4v4h4" stroke="#276f63" strokeWidth="1.4" />
          <path d="M62 56h10m-10 5h7" stroke="#e0d3f0" strokeWidth="1.5" />

          <rect x="46" y="73" width="12" height="12" rx="3.5" fill="#793e67" />
          <rect
            x="45"
            y="71"
            width="12"
            height="12"
            rx="3.5"
            fill={paint('rose')}
            stroke="#ffe0ee"
            strokeWidth=".6"
          />
          <path d="m48 80 6-6m-4 0h4v4" stroke="#873b67" strokeWidth="1.4" />
          <path d="M62 75h10m-10 5h7" stroke="#e0d3f0" strokeWidth="1.5" />
          <path d="M46 89h17" stroke="#b39bcf" strokeWidth="1.2" strokeDasharray="1 2.5" />
          <path d="M73 25h9v20l-4.5-3.5L73 45V25Z" fill="#423355" fillOpacity=".35" />
          <path
            d="M71 23h9v20l-4.5-3.5L71 43V23Z"
            fill={paint('mint')}
            stroke="#d3ffec"
            strokeWidth=".7"
          />
          <path d="M74 26h3" stroke="#f0fff9" strokeWidth="1" />
        </g>

        <circle cx="96" cy="98" r="19" fill="#29375b" stroke="#6d9acd" strokeWidth="1.1" />
        <circle cx="94" cy="95" r="18" fill={paint('blue')} stroke="#d1e6ff" strokeWidth="1" />
        <circle cx="94" cy="95" r="14.5" fill="#283b60" stroke="#b6d0f3" strokeWidth=".7" />
        <path d="M84 93a10.5 10.5 0 1 1 3 10" stroke="#bdeee3" strokeWidth="2" />
        <path d="m80.5 91 3.5 4 4-4" stroke="#bdeee3" strokeWidth="2" />
        <path d="M94 89v6l4 2.5" stroke="#f1edff" strokeWidth="2" />
        <circle cx="94" cy="95" r="1.5" fill="#e3fff5" />
        <path d="M82 84q5-6 11-6" stroke="#f3f6ff" strokeWidth="1" strokeOpacity=".7" />

        <path d="M110 20q0 5 5 5-5 0-5 5 0-5-5-5 5 0 5-5Z" fill="#d7c6f6" />
        <circle cx="13" cy="70" r="2.5" fill={paint('mint')} />
      </g>
    </svg>
  )
}
