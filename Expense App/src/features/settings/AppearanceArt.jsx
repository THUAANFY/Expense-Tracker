import DarkThemeArt from '../../app/theme/DarkThemeArt'
import { useId } from 'react'

export default function AppearanceArt({ dark = false, className = '' }) {
  const id = useId().replaceAll(':', '')
  if (dark) return <DarkThemeArt variant="desk" className={className} />
  return (
    <svg
      className={className}
      viewBox="0 0 250 176"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="125" cy="96" rx="95" ry="57" fill="#eee3f8" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M60 112V50q0-15 15-15h90q15 0 15 15v62"
          fill="#fcf9ff"
          stroke="#cab5de"
          strokeWidth="1.4"
        />
        <path d="M119 36v76M61 70h118" stroke="#e0d2ed" />
        <circle cx="149" cy="53" r="12" fill="#f8df9e" stroke="#d5b778" />
        <path
          d="M78 64c-11-5-13 8-3 8h26c9-1 9-11 0-12-3-12-19-11-23 4Z"
          fill="#fff"
          stroke="#d5c5e4"
        />
        <ellipse cx="123" cy="154" rx="92" ry="4" fill="#dfd1e7" opacity=".6" />
        <path d="M33 149h185" stroke="#d3b9a0" strokeWidth="1.5" />
        <g transform="rotate(-8 123 119)">
          <rect
            x="73"
            y="89"
            width="94"
            height="60"
            rx="7"
            fill="#d9c6ed"
            stroke="#a98bbb"
            strokeWidth="1.3"
          />
          <path d="M80 92v53m6-48h73v43H86Z" stroke="#b9a0cc" />
          <path
            d="M103 125c-7 0-10-4-10-8 0-5 3-8 7-9 1-7 7-11 13-10 6 0 10 4 11 8 7-2 13 4 13 9 7 2 6 11-1 11Z"
            fill="#fffbf5"
            stroke="#aa8cba"
          />
          <circle cx="109" cy="115" r="1.2" fill="#aa8cba" />
          <circle cx="123" cy="115" r="1.2" fill="#aa8cba" />
          <path d="M113 121q3 3 6 0" stroke="#aa8cba" />
          <path d="m142 146 1 11 4-3 3 2-1-11" fill="#c4dcb8" stroke="#9fb78e" />
          <path d="M86 150h72q6 0 6-4" stroke="#fff7ec" strokeWidth="2" />
        </g>
        <path
          d="M45 137c-2-18 2-31 11-40m-9 27c-11 0-17-8-16-15 10 0 17 6 16 15Zm3-10c-3-12 3-20 13-22 2 10-3 19-13 22Z"
          fill="#d5e6c7"
          stroke="#9db38d"
          strokeWidth="1.2"
        />
        <path d="m34 132 3 18h22l3-18Z" fill="#f6e0c3" stroke="#c3a584" />
        <path d="M32 131h32v5H32Z" fill="#fff0da" stroke="#c3a584" />
        <path
          d="M191 124v24m-12 1h25m-13-52c-5-9-16-2-11 6 4 6 10 7 11 11 2-5 12-6 13-13 2-8-9-12-13-4Z"
          fill="#eac8d6"
          stroke="#c59eaf"
          strokeWidth="1.2"
        />
        <path d="m204 66 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ffe6ad" stroke="#d2b37b" />
        <circle cx="43" cy="70" r="2" fill="#c8afd9" />
        <path d="m177 157 31-12" stroke="#d5b593" strokeWidth="4" />
        <path d="m209 144 6-2-5 5Z" fill="#aa8cba" />
      </g>
    </svg>
  )
}
