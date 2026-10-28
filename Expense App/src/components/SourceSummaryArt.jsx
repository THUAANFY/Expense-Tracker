import { useId } from 'react'

export default function SourceSummaryArt({ variant = 'balance' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className={`source-summary-art source-summary-art--${variant}`}
      viewBox="0 0 96 76"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="23" y1="24" x2="69" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffdf5" />
          <stop offset="1" stopColor="#e5d5f2" />
        </linearGradient>
      </defs>
      <ellipse
        cx="48"
        cy="70"
        rx="32"
        ry="3.4"
        fill={variant === 'pending' ? '#d1ad70' : '#a38abc'}
        opacity=".13"
      />
      <g strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {variant === 'balance' ? (
          <>
            <circle cx="48" cy="36" r="29" fill="#e9ddf6" />
            <g transform="rotate(-9 38 25)" stroke="#b39bc5">
              <rect x="22" y="7" width="33" height="36" rx="4" fill="#fffaf0" />
              <path d="M28 14h19m-19 5h14m-14 5h17" stroke="#d2bddd" />
              <path
                d="M34 29c0-3 4-3 4 0 0-3 4-3 4 0 0 3-4 5-4 5s-4-2-4-5Z"
                fill="#edc8d9"
                stroke="#be98b4"
              />
            </g>
            <circle cx="67" cy="20" r="11" fill="#f6dfa5" stroke="#c5a16b" />
            <circle cx="67" cy="20" r="8" fill="#fff0c3" stroke="#d1b277" strokeDasharray="1 2" />
            <path d="M64 17h6m-6 4h5m-3-7v12" stroke="#b99a60" />
            <path
              d="M31 31c-5 3-8 7-8 13v13a9 9 0 0 0 9 9h28a9 9 0 0 0 9-9V44c0-6-3-10-8-13"
              fill={`url(#${id})`}
              stroke="#a78abb"
            />
            <rect x="29" y="27" width="34" height="8" rx="4" fill="#d9c2eb" stroke="#a78abb" />
            <path d="M34 31h24m-31 9v14c0 5 3 8 8 8" stroke="#c6b1d5" strokeDasharray="2 3" />
            <rect x="32" y="41" width="28" height="17" rx="6" fill="#fffaf1" stroke="#d4bfdf" />
            <path d="M38 47q2-2 4 0m9 0q2-2 4 0m-12 5q3 3 6 0" stroke="#9d7caf" />
            <path d="M36 51h3m15 0h3" stroke="#e5bbcf" strokeWidth="2" />
            <path
              d="M74 64c0-7 4-11 10-11 0 6-3 10-10 11Zm0 0 6-7"
              fill="#dce8cf"
              stroke="#9fb28b"
            />
            <path
              d="m12 33 1.4 4.6L18 39l-4.6 1.4L12 45l-1.4-4.6L6 39l4.6-1.4L12 33Z"
              fill="#fbe7b8"
              stroke="#cbb17c"
            />
          </>
        ) : variant === 'transfer' ? (
          <>
            <circle cx="48" cy="37" r="30" fill="#e9f2fa" />
            <path d="M20 23C24 6 52 5 66 15m-5-1 6 2-2-7" stroke="#9a80b6" strokeWidth="2" />
            <path d="M77 53C73 70 44 72 31 61m5 1-6-2 2 7" stroke="#7ea291" strokeWidth="2" />
            <g transform="rotate(-7 26 43)" stroke="#89a67b">
              <rect x="15" y="25" width="22" height="23" rx="3" fill="#e2edcf" />
              <path d="M20 29h12v14H20z" stroke="#b4c6a2" strokeDasharray="1 3" />
              <rect x="9" y="33" width="34" height="26" rx="6" fill="#f8fbed" />
              <path d="M13 40v11c0 3 2 4 5 4h10" stroke="#b8caa5" strokeDasharray="1 3" />
              <path d="M38 41h7v11h-7a5.5 5.5 0 0 1 0-11Z" fill="#dce9cf" />
              <circle cx="39" cy="46.5" r="1.2" fill="#a3bb91" stroke="none" />
              <path d="M18 44q1.5-2 3 0m8 0q1.5-2 3 0m-9 5q2 2 4 0" />
              <path d="M17 49h2m12 0h2" stroke="#e7c1c5" strokeWidth="2" />
            </g>
            <g transform="rotate(7 70 32)" stroke="#a088b7">
              <rect x="55" y="19" width="33" height="27" rx="6" fill="#e3d6f1" />
              <path d="M58 27h27" stroke="#c0a8d3" strokeWidth="3" />
              <rect x="52" y="26" width="34" height="26" rx="6" fill="#fdf7ff" />
              <rect x="58" y="32" width="7" height="6" rx="1.5" fill="#f9e5b7" stroke="#c7ac76" />
              <path d="M58 43h12m4 0h5" stroke="#c6b0d8" strokeWidth="2" />
              <circle cx="78" cy="45" r="3" fill="#e1d2ee" />
            </g>
            <path
              d="m85 6 1.1 3.8L90 11l-3.9 1.2L85 16l-1.1-3.8L80 11l3.9-1.2L85 6Z"
              fill="#fbe6b5"
              stroke="#c9ac73"
            />
            <circle cx="10" cy="63" r="2" fill="#ebc5d5" stroke="#c199b1" />
          </>
        ) : (
          <>
            <circle cx="48" cy="37" r="30" fill="#faedcd" />
            <g transform="rotate(9 59 32)" stroke="#c5a36b">
              <rect x="47" y="12" width="27" height="43" rx="4" fill="#f6e0b0" />
              <path d="M53 19h15m-15 5h10m-10 6h13" stroke="#d3b782" />
            </g>
            <g transform="rotate(-8 39 30)" stroke="#b79a6d">
              <path d="M26 8h22l7 7v37H26V8Z" fill="#fffdf4" />
              <path d="M48 8v7h7m-24 5h10" stroke="#d2b88a" />
              <path d="M35 24a5 5 0 0 1 9 3c0 3-5 3-5 5" stroke="#ba965d" strokeWidth="2" />
              <circle cx="39" cy="35" r="1.2" fill="#ba965d" stroke="none" />
            </g>
            <rect x="17" y="37" width="61" height="29" rx="6" fill="#f5e0b7" stroke="#bf9f6f" />
            <path d="m18 42 25 18c3 2 6 2 9 0l25-18" fill="#fff5dc" stroke="#bf9f6f" />
            <path d="m20 63 15-12m40 12L60 51" stroke="#d1b17e" />
            <path d="M24 61h10m29 0h8" stroke="#dbc297" strokeDasharray="1 3" />
            <path
              d="m82 15 1.2 3.8L87 20l-3.8 1.2L82 25l-1.2-3.8L77 20l3.8-1.2L82 15Z"
              fill="#e6d7f0"
              stroke="#b49ac6"
            />
            <path
              d="M7 51c0-3 4-3 4 0 0-3 4-3 4 0 0 3-4 5-4 5s-4-2-4-5Z"
              fill="#ecc8d9"
              stroke="#be98b0"
            />
          </>
        )}
      </g>
    </svg>
  )
}
