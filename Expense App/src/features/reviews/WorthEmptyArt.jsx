import { useId } from 'react'
import MoodArt from './MoodArt'

const accents = { happy: '#8ce9d0', neutral: '#cba7ff', regret: '#f4add2' }

export default function WorthEmptyArt({ mood = 'happy', variant = 'start' }) {
  const id = 'worth-empty-' + useId().replaceAll(':', '')
  const accent = accents[mood] || accents.happy
  const paint = (name) => `url(#${id}-${name})`
  return (
    <div
      className="worth-empty-scene"
      aria-hidden="true"
      data-empty-art={variant}
      data-empty-mood={mood}
    >
      <svg className="worth-empty-stage" viewBox="0 0 210 140" fill="none" focusable="false">
        <defs>
          <radialGradient id={id + '-ground'}>
            <stop stopColor={accent} stopOpacity=".25" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id + '-paper'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d9d8fa" />
            <stop offset=".45" stopColor="#9294cd" />
            <stop offset="1" stopColor="#5c6098" />
          </linearGradient>
          <linearGradient id={id + '-frame'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={accent} />
            <stop offset=".5" stopColor="#807cba" />
            <stop offset="1" stopColor="#6bb1df" />
          </linearGradient>
          <linearGradient id={id + '-glass'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a9bcff" stopOpacity=".25" />
            <stop offset="1" stopColor="#5572ae" stopOpacity=".06" />
          </linearGradient>
        </defs>
        <ellipse cx="105" cy="125" rx="83" ry="12" fill={paint('ground')} />
        {variant === 'filter' ? (
          <>
            <g transform="rotate(-12 89 75)">
              <rect
                x="50"
                y="28"
                width="69"
                height="88"
                rx="10"
                fill="#54447d"
                stroke="#a392d4"
                strokeWidth="1.2"
              />
              <path
                d="M61 43h33m-33 10h27"
                stroke="#b6a5d9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
            <g transform="rotate(5 110 76)">
              <path
                d="M79 23h49l14 14v73q0 8-8 8H79q-8 0-8-8V31q0-8 8-8Z"
                fill={paint('paper')}
                stroke="#c0b8ef"
                strokeWidth="1.3"
              />
              <path
                d="M128 24v13h13"
                fill="#787db4"
                stroke="#cec8f7"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M85 47h29M85 57h38m-38 11h21m-21 33h25"
                stroke="#555f94"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <rect x="84" y="79" width="10" height="10" rx="3" fill={accent} />
              <path d="m87 84 2 2 3-4" stroke="#3c5673" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <path
              d="m147 99 20 22q4 5 9 0t0-9l-21-21Z"
              fill={paint('frame')}
              stroke="#b9bcf0"
              strokeWidth="1.2"
            />
            <circle
              cx="137"
              cy="80"
              r="27"
              fill="#253750"
              stroke={paint('frame')}
              strokeWidth="5"
            />
            <circle
              cx="137"
              cy="80"
              r="23"
              fill={paint('glass')}
              stroke="#c1d8eb"
              strokeOpacity=".5"
            />
            <path d="M123 73q5-8 14-8" stroke="#dcf4ff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M128 82h18m-15 7h12" stroke="#b1c8df" strokeWidth="2" strokeLinecap="round" />
            <circle cx="43" cy="100" r="10" fill="#344568" stroke={accent} />
            <path
              d="M38 97h10m-8 4h6m-4 4h2"
              stroke={accent}
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <rect
              x="60"
              y="14"
              width="90"
              height="104"
              rx="24"
              fill="#29324f"
              fillOpacity=".55"
              stroke={paint('frame')}
              strokeOpacity=".55"
              transform="rotate(-6 105 66)"
            />
            <path d="m34 57 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#d9c7fa" />
            <circle cx="170" cy="45" r="2.5" fill={accent} />
            {variant === 'complete' && (
              <g transform="translate(148 101)">
                <circle r="15" fill="#32695f" stroke="#9cebd4" strokeWidth="1.5" />
                <path
                  d="m-6 0 4 4 8-9"
                  stroke="#cefff0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </>
        )}
      </svg>
      {variant !== 'filter' && (
        <span className="worth-empty-sticker">
          <MoodArt mood={mood} />
        </span>
      )}
    </div>
  )
}
