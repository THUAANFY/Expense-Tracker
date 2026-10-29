import { useId } from 'react'

// Each category has its own detailed SVG rather than a generic UI icon.
export default function CategoryArt({ category = 'other', size = 56, className = '' }) {
  const id = useId().replaceAll(':', '')
  const drawings = {
    food: (
      <>
        <ellipse cx="32" cy="49" rx="22" ry="4" fill="#e9b097" opacity=".25" />
        <path d="M12 29h39l-4 14c-2 7-27 7-30 0Z" fill="#f6aa89" />
        <path d="M15 34h33M20 40h24" stroke="#df886b" />
        <ellipse cx="31.5" cy="29" rx="19.5" ry="6" fill="#ffdfad" />
        <path d="M19 28c4-7 6 4 10-3s5 6 9 0 6 2 7 3" stroke="#d19a4e" fill="none" />
        <path d="m29 23 9-14m-3 15L46 9" stroke="#92614c" strokeWidth="2.5" />
        <path
          d="M20 17c-4-5 4-5 0-9m6 9c-4-5 4-5 0-9"
          stroke="#d5a892"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="20" cy="28" r="2" fill="#87a77d" />
        <circle cx="38" cy="29" r="2" fill="#87a77d" />
      </>
    ),
    shopping: (
      <>
        <ellipse cx="33" cy="52" rx="21" ry="3" fill="#baabdc" opacity=".28" />
        <path d="m16 22-3 28c9 4 27 4 36 0l-3-28Z" fill="#b5a0e1" />
        <path d="m16 22 5-4h22l3 4" fill="#d8caf3" />
        <path d="M24 26V16c0-10 15-10 15 0v10" fill="none" stroke="#7459ad" strokeWidth="2.8" />
        <path d="m13 50 6-5 2-23" fill="none" stroke="#9179c1" />
        <path d="M30 33c4-6 11-1 6 4l-5 5-5-5c-5-5 2-10 5-4Z" fill="#eee5fb" />
        <circle cx="24" cy="27" r="2" fill="#7459ad" />
        <circle cx="39" cy="27" r="2" fill="#7459ad" />
      </>
    ),
    transport: (
      <>
        <path d="M8 52h48" stroke="#b6d7ce" />
        <circle cx="17" cy="44" r="8" fill="#486e69" />
        <circle cx="17" cy="44" r="4" fill="#e7f3ed" />
        <circle cx="48" cy="44" r="8" fill="#486e69" />
        <circle cx="48" cy="44" r="4" fill="#e7f3ed" />
        <path d="M12 37c6-12 16-10 22-2h9l-4-16h7l4 20H33c-3-8-13-8-16 2H9Z" fill="#8cc4b0" />
        <path d="M25 34h10l4-14" fill="none" stroke="#4f9382" strokeWidth="3" />
        <path d="M25 28h11" stroke="#405c57" strokeWidth="4" strokeLinecap="round" />
        <path d="M38 18h8l3 5" fill="none" stroke="#4e7a70" strokeWidth="2.5" />
        <path d="M47 21h4v5h-4" fill="#edca79" />
        <path d="M9 25h8m-5-5h9" stroke="#b3d4c7" strokeLinecap="round" />
      </>
    ),
    home: (
      <>
        <ellipse cx="32" cy="53" rx="25" ry="3" fill="#adc2e4" opacity=".3" />
        <path d="M15 27 32 12l18 15v25H15Z" fill="#a7bddf" />
        <path d="m10 28 22-20 23 20-4 4-19-17-18 17Z" fill="#718fb9" />
        <path d="M22 35h10v17H22Z" fill="#f5e6cc" />
        <path d="M37 33h8v9h-8Z" fill="#edf3fc" />
        <path d="M41 33v9m-4-4.5h8" stroke="#96afcf" />
        <circle cx="29" cy="44" r="1" fill="#9e805c" />
        <path d="M42 9h6v12l-6-5Z" fill="#718fb9" />
        <path d="M9 48c-7-8 3-15 5-5 8-7 10 5 1 7" fill="#86ae97" />
        <path d="M13 47v7" stroke="#648a74" />
      </>
    ),
    fun: (
      <>
        <ellipse cx="32" cy="52" rx="23" ry="3" fill="#dabe82" opacity=".25" />
        <g transform="rotate(-13 32 32)">
          <path d="M10 18h43v10a5 5 0 0 0 0 10v9H10v-9a5 5 0 0 0 0-10Z" fill="#edca7a" />
          <path d="M40 19v27" stroke="#b89447" strokeDasharray="3 3" />
          <path d="m25 23 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#fff2ca" />
          <path d="M44 26h5m-5 16h5" stroke="#c59c4d" strokeLinecap="round" />
        </g>
        <path
          d="m11 9 2 4m39 1-3 3M39 7l-1 5"
          stroke="#d6af5d"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    health: (
      <>
        <ellipse cx="32" cy="52" rx="22" ry="3" fill="#d9a7b6" opacity=".25" />
        <rect x="11" y="22" width="43" height="29" rx="7" fill="#dfa1b2" />
        <path d="M25 22v-6h16v6" fill="none" stroke="#a65f77" strokeWidth="3" />
        <path d="M11 32h43" stroke="#cb869a" />
        <path
          d="M28 29h9v6h6v9h-6v6h-9v-6h-6v-9h6Z"
          fill="#fff0f2"
          transform="translate(5 8) scale(.7)"
        />
        <path d="M17 27v18" stroke="#ecc1cd" strokeWidth="2" strokeLinecap="round" />
        <path d="M46 8c3-5 9-1 5 3l-5 5-5-5c-4-4 2-8 5-3" fill="#c77d95" />
      </>
    ),
    study: (
      <>
        <ellipse cx="32" cy="53" rx="24" ry="3" fill="#a7ccd9" opacity=".25" />
        <path
          d="M10 19c8-3 15-1 22 3 7-4 14-6 22-3v29c-8-2-15-1-22 3-7-4-14-5-22-3Z"
          fill="#7cabbf"
        />
        <path
          d="M13 15c8-2 14 1 19 4 5-3 11-6 19-4v29c-8-2-14 0-19 4-5-4-11-6-19-4Z"
          fill="#edf5f4"
        />
        <path d="M32 19v29" stroke="#91b5c4" />
        <path
          d="m17 23 10 3m-10 3 10 3m-10 3 7 2m13-11 10-3m-10 9 10-3m-10 9 7-2"
          stroke="#b0c9ce"
          strokeLinecap="round"
        />
        <path d="M40 15v15l4-3 3 1V14" fill="#e0bb73" />
      </>
    ),
    other: (
      <>
        <ellipse cx="32" cy="52" rx="21" ry="3" fill="#b4bccf" opacity=".25" />
        <path d="m12 24 20-10 20 10v23L32 56 12 46Z" fill="#aab3c9" />
        <path d="m12 24 20 10 20-10-20-10Z" fill="#d2d8e5" />
        <path d="M32 34v22" stroke="#7f8ba8" />
        <path d="m22 19 20 10v9l-6 3V32L17 22" fill="#ece4cc" />
        <path d="m40 46 7-3m-7-1 7-3" stroke="#dbe1eb" strokeLinecap="round" />
      </>
    ),
    income: (
      <>
        <ellipse cx="32" cy="53" rx="22" ry="3" fill="#a1c4ae" opacity=".25" />
        <path d="M22 33h22l-3 19H25Z" fill="#a5bf94" />
        <path d="M20 32h26v5H20Z" fill="#7e9f73" />
        <path d="M33 33V17" stroke="#557d60" strokeWidth="2.5" />
        <path d="M32 26C18 28 16 18 17 13c11-1 16 5 15 13Z" fill="#91b899" />
        <path d="M33 20C31 8 42 7 48 9c1 10-6 15-15 11Z" fill="#6e9e7a" />
        <path d="m24 20 9 8m1-9 8-5" stroke="#557d60" strokeWidth="1.4" />
        <path d="M28 42h10m-9 4h8" stroke="#d2dfc8" strokeLinecap="round" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`category-art ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-shadow`}>
          <feDropShadow dx="0" dy="1" stdDeviation=".5" floodOpacity=".05" />
        </filter>
      </defs>
      <g strokeLinejoin="round" filter={`url(#${id}-shadow)`}>
        {drawings[category] || drawings.other}
      </g>
    </svg>
  )
}
