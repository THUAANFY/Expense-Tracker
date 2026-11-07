export default function RecentReceiptArt({ id }) {
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="recent-empty-art recent-receipt-art"
      viewBox="0 0 184 156"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-sheet`}
          x1="64"
          y1="22"
          x2="127"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c1a0ff" />
          <stop offset=".46" stopColor="#8058d5" />
          <stop offset="1" stopColor="#47317d" />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="36"
          y1="28"
          x2="153"
          y2="135"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e6d5ff" />
          <stop offset=".5" stopColor="#a47cff" />
          <stop offset="1" stopColor="#71b4ff" />
        </linearGradient>
        <linearGradient
          id={`${id}-tray`}
          x1="42"
          y1="113"
          x2="139"
          y2="143"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3e387d" />
          <stop offset=".55" stopColor="#252d55" />
          <stop offset="1" stopColor="#314c79" />
        </linearGradient>
        <linearGradient
          id={`${id}-mint`}
          x1="24"
          y1="51"
          x2="58"
          y2="86"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#80ffe0" />
          <stop offset="1" stopColor="#23a98f" />
        </linearGradient>
        <linearGradient
          id={`${id}-pink`}
          x1="128"
          y1="81"
          x2="160"
          y2="113"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffb4d9" />
          <stop offset="1" stopColor="#ce478c" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#9866ff" stopOpacity=".45" />
          <stop offset="1" stopColor="#9866ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="93" cy="135" rx="77" ry="14" fill={paint('halo')} />
      <path
        d="M38 117 50 103h84l13 14v15c0 4-4 7-8 7H46c-4 0-8-3-8-7Z"
        fill={paint('tray')}
        stroke={paint('edge')}
        strokeWidth="1.4"
      />
      <path
        d="m39 117 25 1 6 8h43l7-8 26-1"
        stroke="#b5b8ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M63 30a8 8 0 0 1 8-8h41l16 16v82l-7-4-7 4-7-4-7 4-7-4-7 4-7-4-8 4-8-4Z"
        fill="#11182e"
        opacity=".5"
        transform="translate(4 4)"
      />
      <path
        d="M59 26a8 8 0 0 1 8-8h41l16 16v82l-7-4-7 4-7-4-7 4-7-4-7 4-7-4-8 4-8-4Z"
        fill={paint('sheet')}
        stroke={paint('edge')}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M108 19v11a5 5 0 0 0 5 5h10"
        fill="#d8c4ff"
        stroke="#e6d9ff"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M63 29v69"
        stroke="#f0e4ff"
        strokeOpacity=".45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="72" y="33" width="25" height="5" rx="2.5" fill="#efe4ff" />
      <path
        d="M72 45h35M71 95h41"
        stroke="#e0caff"
        strokeOpacity=".6"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
      <rect x="71" y="55" width="40" height="14" rx="4" fill="#251b51" fillOpacity=".38" />
      <path d="M77 62h6m-3-3v6" stroke="#88ffe0" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M90 62h14" stroke="#e2fff6" strokeWidth="2" strokeLinecap="round" />
      <rect x="71" y="75" width="40" height="14" rx="4" fill="#251b51" fillOpacity=".38" />
      <path d="M77 82h6" stroke="#ffadd5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M90 82h11" stroke="#ffe0ef" strokeWidth="2" strokeLinecap="round" />
      <path d="M85 103h23" stroke="#c6afff" strokeWidth="2" strokeLinecap="round" />
      <g transform="rotate(-9 41 67)">
        <rect
          x="24"
          y="50"
          width="34"
          height="34"
          rx="11"
          fill={paint('mint')}
          stroke="#a5ffe9"
          strokeWidth="1.3"
        />
        <path
          d="M29 59v-1a4 4 0 0 1 4-4h15"
          stroke="#e1fff7"
          strokeOpacity=".7"
          strokeLinecap="round"
        />
        <path
          d="m35 61 12 12m-9 0h9v-9"
          stroke="#154d50"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g transform="rotate(10 144 97)">
        <rect
          x="128"
          y="81"
          width="32"
          height="32"
          rx="10"
          fill={paint('pink')}
          stroke="#ffd0e9"
          strokeWidth="1.3"
        />
        <path
          d="m139 103 11-11m-9 0h9v9"
          stroke="#612343"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d="m144 27 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#d7b6ff" />
      <path d="m34 99 1.5 4.5L40 105l-4.5 1.5L34 111l-1.5-4.5L28 105l4.5-1.5Z" fill="#7bd5ff" />
      <circle cx="45" cy="32" r="2" fill="#91baff" />
      <circle cx="158" cy="65" r="2" fill="#ba96f6" />
      <path d="M51 133h19" stroke="#bca3ff" strokeOpacity=".55" strokeLinecap="round" />
    </svg>
  )
}
