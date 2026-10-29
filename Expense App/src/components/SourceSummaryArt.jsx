import { useId } from 'react'

export default function SourceSummaryArt({ variant = 'balance' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className={`source-summary-art source-summary-art--${variant}`}
      viewBox="0 0 128 104"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-wallet`}
          x1="22"
          y1="38"
          x2="98"
          y2="91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#faf3ff" />
          <stop offset="1" stopColor="#e5d4f2" />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="34"
          y1="23"
          x2="84"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef9" />
          <stop offset="1" stopColor="#fff1d5" />
        </linearGradient>
      </defs>
      <ellipse cx="64" cy="97" rx="49" ry="3" fill="#b8a5be" opacity=".15" />
      <g strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
        {variant === 'balance' ? (
          <>
            <path
              d="M18 48c-8-13 0-30 15-32 16-2 20 4 33 0s31-2 38 10c10 17-1 42-19 46H35Z"
              fill="#f0e8f7"
              stroke="none"
            />
            <g transform="rotate(-10 49 35)">
              <rect x="25" y="13" width="53" height="43" rx="4" fill="#e9f0db" stroke="#98ae84" />
              <path d="M32 19h39v30H32z" stroke="#bdcba9" strokeDasharray="2 3" />
              <ellipse cx="51.5" cy="34" rx="9" ry="11" fill="#f8fbea" stroke="#b2c399" />
              <path d="M48 32h7m-7 4h7m-4-10v16" stroke="#a1b786" />
              <path d="M36 24h4m23 20h4" stroke="#9db58a" />
            </g>
            <g transform="rotate(8 84 29)">
              <rect x="66" y="18" width="34" height="34" rx="4" fill="#fffaf0" stroke="#d3ba91" />
              <path d="M72 25h21m-21 5h15m-15 5h18" stroke="#e0caab" />
            </g>
            <path
              d="M22 40c0-6 5-10 11-10h57c8 0 13 5 13 12v9H22V40Z"
              fill="#cbb1df"
              stroke="#9d7ab9"
            />
            <path d="M28 35h61c5 0 8 3 8 7" stroke="#e8d6f4" />
            <rect
              x="16"
              y="39"
              width="91"
              height="53"
              rx="12"
              fill={`url(#${id}-wallet)`}
              stroke="#a07eb8"
            />
            <rect
              x="22"
              y="45"
              width="79"
              height="41"
              rx="8"
              stroke="#c1a6d3"
              strokeDasharray="2 3"
            />
            <path
              d="M77 54h28a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H77a10.5 10.5 0 0 1 0-21Z"
              fill="#dac4e9"
              stroke="#a07eb8"
            />
            <circle cx="81" cy="64.5" r="3.8" fill="#fff9ed" stroke="#b398c5" />
            <circle cx="81" cy="64.5" r="1" fill="#b398c5" stroke="none" />
            <path d="M38 61q2-3 4 0m13 0q2-3 4 0m-14 8q3.5 4 7 0" stroke="#86629f" />
            <path d="M35 67h4m19 0h4" stroke="#e3b5cb" strokeWidth="3" />
            <path d="M44 51c-2-5 4-8 6-4 4-2 7 2 5 5H44Z" fill="#fffdf8" stroke="#ccb5de" />
            <g className="desk-wallet-charm">
              <path d="M108 69c6 1 7 7 4 11" stroke="#bc9a65" />
              <path
                d="M105 80c-1-5 6-7 8-3 5-2 9 4 6 7h-14c-3-1-3-4 0-4Z"
                fill="#fff1c9"
                stroke="#c1a06b"
              />
              <path d="M108 81h.1m6 0h.1m-4 2h2" stroke="#a98958" />
            </g>
            <path
              d="m12 24 1.5 4.5L18 30l-4.5 1.5L12 36l-1.5-4.5L6 30l4.5-1.5L12 24Z"
              fill="#ffe9b1"
              stroke="#cfad70"
            />
            <path d="m106 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#e4c9e0" stroke="#b998bf" />
          </>
        ) : variant === 'transfer' ? (
          <>
            <path
              d="M17 38c4-21 30-29 49-22 13-7 36-2 43 14 11 25-3 49-28 52H43c-22 0-31-20-26-44Z"
              fill="#edf1eb"
              stroke="none"
            />
            <path
              d="M25 29c8-14 24-18 36-15m-4-4 5 4-5 3m43 64c-9 11-25 14-37 10m4 5-5-5 5-2"
              stroke="#c1adce"
              strokeDasharray="2 4"
            />
            <g transform="rotate(-9 31 61)">
              <rect x="18" y="30" width="31" height="38" rx="3" fill="#dce9ca" stroke="#91aa7b" />
              <path d="M23 35h21v27H23z" stroke="#b2c59d" strokeDasharray="1.5 3" />
              <circle cx="33.5" cy="45" r="5" fill="#f4f8e8" stroke="#b2c59d" />
              <rect x="8" y="47" width="48" height="38" rx="8" fill="#f3f8e8" stroke="#8fa77d" />
              <path d="M13 55v21c0 3 2 4 5 4h29" stroke="#bacda7" strokeDasharray="2 3" />
              <path d="M48 58h10v15H48a7.5 7.5 0 0 1 0-15Z" fill="#dbe8ca" stroke="#8fa77d" />
              <circle cx="49" cy="65.5" r="1.8" fill="#9bb588" stroke="none" />
              <path d="M20 63q1.5-2 3 0m9 0q1.5-2 3 0m-10 6q2 2 4 0" stroke="#7d9871" />
              <path d="M18 68h3m12 0h3" stroke="#e5bac5" strokeWidth="2.5" />
            </g>
            <g transform="rotate(8 94 61)">
              <rect x="76" y="34" width="40" height="34" rx="5" fill="#d9c5e9" stroke="#a286b5" />
              <path d="M80 42h31" stroke="#bba0d0" strokeWidth="4" />
              <rect x="73" y="48" width="46" height="37" rx="8" fill="#faf3ff" stroke="#a286b5" />
              <path d="M79 55v20c0 3 2 4 5 4h27" stroke="#d5c1e4" strokeDasharray="2 3" />
              <path d="M111 59h10v14h-10a7 7 0 0 1 0-14Z" fill="#e6d8ef" stroke="#a286b5" />
              <circle cx="112" cy="66" r="1.7" fill="#ae8bc4" stroke="none" />
              <path d="M84 64q1.5-2 3 0m9 0q1.5-2 3 0m-10 6q2 2 4 0" stroke="#9a78af" />
              <path d="M82 69h3m12 0h3" stroke="#e5bac5" strokeWidth="2.5" />
            </g>
            <g className="desk-transfer-coin">
              <circle cx="65" cy="31" r="14" fill="#f7dfa0" stroke="#c3a06b" />
              <circle
                cx="65"
                cy="31"
                r="10.3"
                fill="#fff0c4"
                stroke="#d4b77c"
                strokeDasharray="1 2.5"
              />
              <path d="M61 29h8m-8 5h8m-4-11v16" stroke="#b3935d" strokeWidth="1.6" />
              <path d="M59 22q4-3 8-2" stroke="#fff9e6" strokeWidth="2" />
            </g>
            <path
              d="m115 19 1.3 4.2L121 25l-4.7 1.5L115 31l-1.4-4.5L109 25l4.6-1.8 1.4-4.2Z"
              fill="#fff0c0"
              stroke="#cfb078"
            />
          </>
        ) : (
          <>
            <path
              d="M20 50c-4-24 11-37 35-35 14-5 35-2 44 12 11 18 4 46-14 55H39c-12-3-20-17-19-32Z"
              fill="#faf0dc"
              stroke="none"
            />
            <g transform="rotate(10 73 51)">
              <path
                d="M48 20h49v62l-5-3-5 4-5-3-5 4-5-3-5 4-5-3-5 4-4-2V20Z"
                fill="#ecd9b9"
                stroke="#c5a77c"
              />
              <path d="M56 30h32m-32 7h22m-22 7h29" stroke="#d3ba94" />
            </g>
            <g className="desk-pending-receipt" transform="rotate(-7 55 54)">
              <path
                d="M25 18h59v68l-5-3-5 4-5-3-5 4-5-3-5 4-5-3-5 4-5-3-5 4-4-2V18Z"
                fill={`url(#${id}-paper)`}
                stroke="#c4a578"
              />
              <path d="M32 27h45" stroke="#e0caac" strokeDasharray="1 3" />
              <path d="M34 37h19m-19 7h36m-36 7h28" stroke="#d4bc99" />
              <path d="M35 76h39" stroke="#dec8a8" strokeDasharray="2 3" />
              <path d="M46 60q1.6-2.5 3.2 0m11 0q1.6-2.5 3.2 0m-12 7q3 3 6 0" stroke="#ad8b5e" />
              <path d="M43 65h3m17 0h3" stroke="#e6bfc5" strokeWidth="2.8" />
              <path
                d="m70 34 1.4 2.8 3.1.5-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.5L70 34Z"
                fill="#edd8a1"
                stroke="#ccb078"
              />
            </g>
            <path
              d="M59 30V15a6 6 0 0 1 12 0v18a3.5 3.5 0 0 1-7 0V18"
              stroke="#9c83b4"
              strokeWidth="2.4"
            />
            <path d="M59 30V15a6 6 0 0 1 6-6" stroke="#d8c5e6" strokeWidth="1.1" />
            <path d="M102 62c-4-5 2-10 5-5 4-4 9 1 5 5l-6 5-4-5Z" fill="#eed0dc" stroke="#c499ae" />
            <path
              d="m16 26 1.2 3.8L21 31l-3.8 1.2L16 36l-1.2-3.8L11 31l3.8-1.2L16 26Z"
              fill="#e8daf1"
              stroke="#b49ac8"
            />
          </>
        )}
      </g>
    </svg>
  )
}
