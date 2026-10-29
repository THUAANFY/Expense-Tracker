import { useId } from 'react'
import { getSourceColor } from './moneySources'

export default function SourceArt({ type = 'cash', color = 'lilac', className = '' }) {
  const id = useId().replaceAll(':', '')
  const c = getSourceColor(color)
  return (
    <svg className={`source-art ${className}`} viewBox="0 0 180 126" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="55" y1="35" x2="122" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffdf8" />
          <stop offset="1" stopColor={c.fill} />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="116" rx="63" ry="5" fill={c.ink} opacity=".12" />
      <circle cx="89" cy="64" r="49" fill={c.paper} />
      <g stroke={c.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {type === 'cash' ? (
          <>
            <g transform="rotate(-9 82 51)">
              <rect x="47" y="20" width="70" height="46" rx="5" fill="#e7eed6" stroke="#9aad83" />
              <rect
                x="52"
                y="25"
                width="60"
                height="36"
                rx="4"
                stroke="#b5c5a0"
                strokeDasharray="2 3"
              />
              <ellipse cx="82" cy="43" rx="10" ry="13" fill="#f5f8e9" stroke="#a8bb91" />
              <path d="M80 37h5m-6 5h5m-3-8v18" stroke="#a0b18a" />
            </g>
            <path d="M37 54c0-7 5-12 12-12h78v62H47c-6 0-10-4-10-10V54Z" fill={c.fill} />
            <rect x="33" y="51" width="108" height="60" rx="12" fill={`url(#${id})`} />
            <path d="M41 65v31c0 4 3 7 7 7h78" strokeDasharray="2 4" opacity=".6" />
            <path d="M125 69h21v25h-21c-7 0-12-5-12-12s5-13 12-13Z" fill={c.fill} />
            <circle cx="126" cy="81" r="3" fill="#fffdf7" />
            <path d="M61 77q3-4 6 0m15 0q3-4 6 0m-17 8q5 5 10 0" />
            <ellipse cx="60" cy="84" rx="5" ry="2.5" fill="#efc4c4" stroke="none" />
            <ellipse cx="91" cy="84" rx="5" ry="2.5" fill="#efc4c4" stroke="none" />
            <g stroke="#c8a56a">
              <ellipse cx="143" cy="108" rx="15" ry="5" fill="#f7dfa3" />
              <path d="M128 102v6m30-6v6" />
              <ellipse cx="143" cy="102" rx="15" ry="5" fill="#fff1c8" />
              <path d="M135 101h7m3 0h6" />
            </g>
          </>
        ) : type === 'bank' ? (
          <>
            <g transform="rotate(-10 87 53)">
              <rect x="31" y="25" width="112" height="65" rx="10" fill={c.fill} />
              <path d="M32 42h110" strokeWidth="9" opacity=".3" />
            </g>
            <g transform="rotate(5 94 77)">
              <rect x="34" y="45" width="116" height="66" rx="11" fill={`url(#${id})`} />
              <rect x="48" y="59" width="21" height="17" rx="4" fill="#f6e3ae" stroke="#c0a269" />
              <path d="M55 59v17m7-17v17m-14-9h21" stroke="#c0a269" strokeWidth="1" />
              <path d="M79 61q5 5 0 10m5-14q9 9 0 18" />
              <path d="M49 91h18m7 0h18m7 0h12" strokeWidth="3" opacity=".4" />
              <path d="M50 102h28" strokeWidth="2" opacity=".4" />
              <circle cx="127" cy="92" r="9" fill={c.fill} />
              <circle cx="138" cy="92" r="9" fill="#fff6df" fillOpacity=".8" />
            </g>
            <g transform="translate(117 9)">
              <circle cx="22" cy="22" r="20" fill="#fffaf0" stroke="#c9b18c" />
              <path d="m9 18 13-7 13 7H9Zm3 3v10m10-10v10m10-10v10M9 34h26" stroke="#b9a17e" />
              <path d="M17 40q5 4 10 0" stroke="#b9a17e" />
            </g>
          </>
        ) : (
          <>
            <g transform="rotate(-5 87 66)">
              <rect x="55" y="12" width="65" height="102" rx="14" fill={c.fill} />
              <rect x="60" y="18" width="55" height="89" rx="10" fill={`url(#${id})`} />
              <path d="M78 21h19" strokeWidth="3" />
              <path d="M80 102h15" strokeWidth="2" />
              <rect x="68" y="45" width="39" height="31" rx="8" fill={c.paper} />
              <path d="M95 54h13v14H95c-5 0-5-14 0-14Z" fill={c.fill} />
              <circle cx="99" cy="61" r="2" fill="#fffdf8" />
              <path d="M74 53q2-3 4 0m6 0q2-3 4 0m-10 8q4 4 7 0" />
              <path d="M71 84h32m-25 7h20" opacity=".45" />
            </g>
            <g stroke="#c3a56b">
              <circle cx="133" cy="76" r="17" fill="#f8e4b2" />
              <circle cx="133" cy="76" r="12" strokeDasharray="2 3" />
              <path d="m127 75 4 4 8-8" />
              <path
                d="M39 54c-6-8-16-1-10 6l10 10 10-10c6-7-4-14-10-6Z"
                fill="#f2d4df"
                stroke="#bb9ab0"
              />
            </g>
          </>
        )}
        <path d="m29 23 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffe8b8" stroke="#c4aa75" />
        <path d="m154 47 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4Z" fill={c.fill} />
        <path d="M22 89h6m-3-3v6m122-78h4m-2-2v4" opacity=".5" />
      </g>
    </svg>
  )
}
