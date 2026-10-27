import { useId } from 'react'

const colors = {
  happy: { top: '#f5fbea', bottom: '#deedcb', ink: '#829c70', blush: '#e4bcae' },
  neutral: { top: '#fbf6ff', bottom: '#e8d9f5', ink: '#a18ab4', blush: '#e5c0d5' },
  regret: { top: '#fff8ed', bottom: '#f5decc', ink: '#b5917c', blush: '#e7b5a9' },
}

export default function MoodArt({ mood = 'happy', className = '' }) {
  const id = useId().replaceAll(':', '')
  const color = colors[mood] || colors.happy
  return (
    <svg className={`mood-art ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="31" y1="20" x2="48" y2="67" gradientUnits="userSpaceOnUse">
          <stop stopColor={color.top} />
          <stop offset="1" stopColor={color.bottom} />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="27" ry="3" fill={color.ink} opacity=".13" />
      <g strokeLinecap="round" strokeLinejoin="round">
        {mood === 'happy' && (
          <>
            <path d="M40 22V12" stroke={color.ink} strokeWidth="1.4" />
            <path
              d="M39 17c-7 1-12-4-10-7 5-2 10 1 10 7Zm1-4c2-7 9-9 12-6-1 4-5 7-12 6Z"
              fill="#c6dda9"
              stroke={color.ink}
              strokeWidth="1.3"
            />
          </>
        )}
        {mood === 'neutral' && (
          <path
            d="M36 21c-6-7 0-12 4-7 4-5 10 0 4 7"
            fill="#e3caee"
            stroke={color.ink}
            strokeWidth="1.4"
          />
        )}
        {mood === 'regret' && (
          <path d="M34 20c-3-5 0-8 4-6m3 5c1-5 5-7 8-3" stroke={color.ink} strokeWidth="1.4" />
        )}
        <path
          d="M14 46c0-17 10-28 26-28s26 11 26 28c0 13-10 20-26 20S14 59 14 46Z"
          fill={'url(#' + id + ')'}
          stroke={color.ink}
          strokeWidth="1.6"
        />
        <path d="M23 33c2-5 6-8 11-8" stroke="#fffefa" strokeWidth="3" />
        <ellipse
          cx="29"
          cy="66"
          rx="8"
          ry="4"
          fill={color.bottom}
          stroke={color.ink}
          strokeWidth="1.4"
        />
        <ellipse
          cx="51"
          cy="66"
          rx="8"
          ry="4"
          fill={color.bottom}
          stroke={color.ink}
          strokeWidth="1.4"
        />
        <path
          d="M18 46c-8-5-12 2-6 6 2 1 5 0 7-1Z M62 46c8-5 12 2 6 6-2 1-5 0-7-1Z"
          fill={color.bottom}
          stroke={color.ink}
          strokeWidth="1.4"
        />
        <ellipse cx="24" cy="49" rx="4.2" ry="2.5" fill={color.blush} />
        <ellipse cx="56" cy="49" rx="4.2" ry="2.5" fill={color.blush} />
        {mood === 'happy' ? (
          <>
            <path d="M28 43q3-4 6 0m12 0q3-4 6 0" stroke="#73895f" strokeWidth="1.8" />
            <path
              d="M34 49q6 3 12 0c-1 10-11 10-12 0Z"
              fill="#efbfbd"
              stroke="#73895f"
              strokeWidth="1.3"
            />
            <path
              d="m67 18 1.2 3.3 3.3 1.2-3.3 1.2L67 27l-1.2-3.3-3.3-1.2 3.3-1.2Z"
              fill="#ffe6ac"
              stroke="#bd9d67"
              strokeWidth="1"
            />
          </>
        ) : mood === 'neutral' ? (
          <>
            <g fill="#8d779e">
              <circle cx="31" cy="43" r="1.5" />
              <circle cx="49" cy="43" r="1.5" />
            </g>
            <path d="M37 53h6" stroke="#8d779e" strokeWidth="1.8" />
            <path
              d="m68 24 1 2.8 2.8 1-2.8 1L68 32l-1-2.8-2.8-1 2.8-1Z"
              fill="#e8d4f2"
              stroke="#baa0ca"
              strokeWidth="1"
            />
          </>
        ) : (
          <>
            <g fill="#a57968">
              <circle cx="31" cy="44" r="1.5" />
              <circle cx="49" cy="44" r="1.5" />
            </g>
            <path d="m28 37 6 1m12 0 6-1m-16 17q4-4 8 0" stroke="#a57968" strokeWidth="1.5" />
            <path
              d="M64 23c-6 7-6 11-2 12 6 2 7-4 2-12Z"
              fill="#e3daf2"
              stroke="#ad98c2"
              strokeWidth="1.1"
            />
            <path d="m63 28-1 3" stroke="#fffcff" strokeWidth="1.4" />
          </>
        )}
      </g>
    </svg>
  )
}
