export default function HistoryArt({ variant = 'journal', className = '' }) {
  if (variant === 'income' || variant === 'expense') {
    const income = variant === 'income'
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <ellipse cx="32" cy="56" rx="22" ry="3" fill={income ? '#cfe6d6' : '#efd5c8'} />
        <g
          stroke={income ? '#56836c' : '#aa735d'}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {income ? (
            <>
              <path d="m14 22 30-7a4 4 0 0 1 5 4v29H15Z" fill="#c4e5ce" />
              <path
                d="M18 21h29a5 5 0 0 1 5 5v23a5 5 0 0 1-5 5H17a6 6 0 0 1-6-6V27a6 6 0 0 1 7-6Z"
                fill="#e5f4e8"
              />
              <path d="M16 28h30M16 48h30" strokeDasharray="1 4" opacity=".55" />
              <path d="M43 32h11v13H43a6.5 6.5 0 0 1 0-13Z" fill="#aaceb5" />
              <circle cx="45" cy="38.5" r="1.7" fill="#56836c" stroke="none" />
              <circle cx="29" cy="15" r="10" fill="#ffe5a0" stroke="#bd9247" />
              <circle cx="29" cy="15" r="6.8" stroke="#d6ad57" strokeDasharray="1 2.5" />
              <path d="m26 15 2 2 4-4" stroke="#a57d36" />
              <path d="M22 37v1m9-1v1m-7 3q2.5 3 5 0" />
              <path d="m8 11 1-3 1 3 3 1-3 1-1 3-1-3-3-1Z" fill="#d8b7ec" stroke="#b392ca" />
            </>
          ) : (
            <>
              <path d="M16 23h32l4 27a4 4 0 0 1-4 5H16a4 4 0 0 1-4-5Z" fill="#ffe5d5" />
              <path d="M23 26V18a9 9 0 0 1 18 0v8" strokeWidth="2.5" />
              <path d="M19 29v18m26-18 2 20" stroke="#efbfa7" strokeDasharray="2 4" />
              <circle cx="23" cy="26" r="2" fill="#d3977a" stroke="none" />
              <circle cx="41" cy="26" r="2" fill="#d3977a" stroke="none" />
              <path d="M26 36v1m12-1v1m-10 4q4 4 8 0" />
              <ellipse cx="23" cy="40" rx="3" ry="1.7" fill="#efae9e" stroke="none" />
              <ellipse cx="41" cy="40" rx="3" ry="1.7" fill="#efae9e" stroke="none" />
              <path d="m49 10 2-4 2 4 4 2-4 2-2 4-2-4-4-2Z" fill="#e2cbf1" stroke="#b799ce" />
              <path d="M8 24c-4-3-5 3 0 5 5-2 4-8 0-5Z" fill="#eeb9c7" stroke="#c58c9e" />
            </>
          )}
        </g>
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" aria-hidden="true">
      <path
        d="M31 104c-7-35 12-66 42-66 19-29 67-26 86-5 38-3 64 23 58 54 19 34-9 67-48 64H76c-31 8-62-13-45-47Z"
        fill="#e9ddf7"
      />
      <circle cx="188" cy="46" r="21" fill="#f9eadb" />
      <ellipse cx="124" cy="157" rx="87" ry="9" fill="#dcd0ec" opacity=".6" />
      <g stroke="#80618f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-12 68 112)">
          <path d="M47 73h47v73l-6-4-6 4-6-4-6 4-6-4-6 4-5-4-6 4Z" fill="#fffdf5" />
          <path d="M57 86h27m-27 7h18m-18 28h27m-27 7h12" stroke="#c4b3cc" />
          <path d="M70 105c-7-7-12 5 0 10 12-5 7-17 0-10Z" fill="#edb9ce" stroke="#bf8ca5" />
        </g>
        <g className="history-bunny">
          <path
            d="M129 64c-13-13-18-39-10-43 10-5 21 22 21 36m8 2c-1-18 6-40 15-36 10 4 0 29-8 39"
            fill="#fffcf5"
          />
          <path d="M125 32c1 7 4 14 7 18m25-15-4 15" stroke="#e6b4c7" strokeWidth="4" />
          <path
            d="M115 84c0-24 15-34 30-32 18-1 33 13 31 31 0 17-12 28-29 28-20 0-32-10-32-27Z"
            fill="#fffcf5"
          />
          <ellipse cx="130" cy="86" rx="5" ry="3" fill="#edbfcc" stroke="none" />
          <ellipse cx="161" cy="86" rx="5" ry="3" fill="#edbfcc" stroke="none" />
          <path d="M134 78v3m23-3v3" strokeWidth="2.5" />
          <path d="m143 85 3 2 3-2m-3 2v3m-5 0q2 3 5 0 3 3 5 0" />
        </g>
        <g transform="rotate(6 136 127)">
          <rect x="93" y="100" width="91" height="53" rx="8" fill="#bba2d9" />
          <rect x="101" y="96" width="84" height="54" rx="7" fill="#f1e6fb" />
          <path d="M112 98v51" stroke="#c8acdf" />
          <path d="M98 107h8m-8 11h8m-8 11h8m-8 11h8" strokeWidth="2.5" />
          <path d="M123 113h38m-38 7h22m-22 16h30" stroke="#c1a7d4" />
          <path d="m164 128 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#ffe5a0" stroke="#b89a59" />
          <path d="M149 96v16l4-3 4 3V96" fill="#e7b2c7" stroke="#c68ba7" />
        </g>
        <path
          d="M117 109c-10-9-20 3-10 10 7 4 14-4 10-10Zm58 7c10-7 17 5 8 10-7 4-13-5-8-10Z"
          fill="#fffcf5"
        />
        <g transform="rotate(20 197 125)">
          <path d="M193 99h8v47l-4 9-4-9Z" fill="#f8d2a5" stroke="#b28c64" />
          <path d="M193 99v-6a4 4 0 0 1 8 0v6Z" fill="#e8b5c7" stroke="#b28c64" />
          <path d="M193 103h8m-4 3v34m-4 6h8m-4 9v-4" stroke="#b28c64" />
        </g>
        <path
          d="M34 151v-21m0 13c-12 0-16-9-12-13 6-3 12 8 12 13Zm1-8c-1-12 8-18 12-13 3 5-5 12-12 13Z"
          fill="#c4dfce"
          stroke="#7ca38b"
        />
        <path d="m44 49 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" fill="#ffe6a9" stroke="#c3a267" />
        <path d="m207 76 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#f3c6d4" stroke="#c494ad" />
        <path d="M184 25c-7-6-11 4 0 9 11-5 7-15 0-9Z" fill="#edbdd0" stroke="#bf92ab" />
        <path d="m72 35 2 3m-15 80-4 1m163-6 3 2" stroke="#b398c6" />
        <circle cx="81" cy="53" r="2.5" fill="#c4a6df" stroke="none" />
        <circle cx="202" cy="148" r="2" fill="#e2b46f" stroke="none" />
        <path d="M71 158q5 5 10 0m129-58q4 4 8 0" stroke="#bfa7cf" />
      </g>
    </svg>
  )
}
