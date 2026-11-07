import { useId } from 'react'

const palettes = {
  happy: {
    light: '#dcfff2',
    middle: '#7de0c0',
    deep: '#368b9b',
    edge: '#aeffe2',
    ink: '#234d58',
    blush: '#f4a8bd',
  },
  neutral: {
    light: '#f5eaff',
    middle: '#b79aed',
    deep: '#7954b5',
    edge: '#e2c3ff',
    ink: '#463466',
    blush: '#e99bd0',
  },
  regret: {
    light: '#ffe9f2',
    middle: '#eea0c4',
    deep: '#aa568b',
    edge: '#ffd0e6',
    ink: '#69374f',
    blush: '#f47faf',
  },
}

export default function DarkMoodArt({ mood = 'happy', className = '' }) {
  const id = 'mood-' + useId().replaceAll(':', '')
  const kind = Object.hasOwn(palettes, mood) ? mood : 'happy'
  const p = palettes[kind]
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className={`mood-art dark-mood-art ${className}`}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-mood-art={kind}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx=".3" cy=".18" r=".95">
          <stop stopColor={p.light} />
          <stop offset=".42" stopColor={p.middle} />
          <stop offset="1" stopColor={p.deep} />
        </radialGradient>
        <linearGradient id={`${id}-limb`} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor={p.middle} />
          <stop offset="1" stopColor={p.deep} />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d2ffcf" />
          <stop offset="1" stopColor="#65c99e" />
        </linearGradient>
        <radialGradient id={`${id}-ground`}>
          <stop stopColor={p.middle} stopOpacity=".3" />
          <stop offset="1" stopColor={p.middle} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-tear`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e0f7ff" />
          <stop offset="1" stopColor="#6fbaef" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="84" rx="32" ry="6" fill={paint('ground')} />
      <g strokeLinecap="round" strokeLinejoin="round">
        {kind === 'happy' ? (
          <>
            <path d="M48 29V17" stroke="#84d6af" strokeWidth="2.5" />
            <path
              d="M47 23C34 24 29 14 34 11c9-1 14 5 13 12ZM49 18c0-10 9-15 16-11 0 7-7 13-16 11Z"
              fill={paint('leaf')}
              stroke="#aff0c6"
              strokeWidth="1"
            />
          </>
        ) : kind === 'neutral' ? (
          <>
            <path d="M48 28q-6-8-2-14" stroke={p.edge} strokeWidth="2" />
            <path d="M47 20c0-8 9-13 14-9 0 6-7 10-14 9Z" fill={paint('body')} stroke={p.edge} />
          </>
        ) : (
          <path
            d="M47 27q-3-10 4-11 10-1 12 7-10 2-15-5"
            fill={paint('body')}
            stroke={p.edge}
            strokeWidth="1.3"
          />
        )}
        <ellipse
          cx="34"
          cy="78"
          rx="10"
          ry="5"
          fill={paint('limb')}
          stroke={p.edge}
          strokeWidth="1.1"
        />
        <ellipse
          cx="62"
          cy="78"
          rx="10"
          ry="5"
          fill={paint('limb')}
          stroke={p.edge}
          strokeWidth="1.1"
        />
        <path
          d="M19 55C17 36 29 24 48 24s31 12 29 31c-1 17-13 23-29 23S20 72 19 55Z"
          fill={paint('body')}
          stroke={p.edge}
          strokeWidth="1.3"
        />
        <path d="M29 40q4-8 13-9" stroke="#fff" strokeOpacity=".75" strokeWidth="3" />
        <path
          d="M24 57c-9-7-15 1-8 6q5 3 10-1M72 57c9-7 15 1 8 6q-5 3-10-1"
          fill={paint('limb')}
          stroke={p.edge}
          strokeWidth="1.2"
        />
        <ellipse cx="31" cy="59" rx="5" ry="3" fill={p.blush} fillOpacity=".8" />
        <ellipse cx="65" cy="59" rx="5" ry="3" fill={p.blush} fillOpacity=".8" />
        {kind === 'happy' ? (
          <>
            <path d="M32 51q4-6 8 0m16 0q4-6 8 0" stroke={p.ink} strokeWidth="2.8" />
            <path d="M42 58q6 3 12 0c0 12-12 12-12 0Z" fill={p.ink} />
            <path d="M44 65q4-4 8 0-4 4-8 0Z" fill="#f6b5cc" />
            <path d="m80 26 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#b6ffe2" />
          </>
        ) : kind === 'neutral' ? (
          <>
            <ellipse cx="36" cy="52" rx="2.5" ry="3" fill={p.ink} />
            <ellipse cx="60" cy="52" rx="2.5" ry="3" fill={p.ink} />
            <path d="M44 63h8" stroke={p.ink} strokeWidth="2.6" />
            <circle cx="81" cy="34" r="2.5" fill={p.edge} />
            <circle cx="86" cy="26" r="1.5" fill={p.edge} fillOpacity=".6" />
          </>
        ) : (
          <>
            <path d="m31 44 7-2m20 0 7 2" stroke={p.ink} strokeWidth="2" />
            <ellipse cx="36" cy="53" rx="2.4" ry="2.8" fill={p.ink} />
            <ellipse cx="60" cy="53" rx="2.4" ry="2.8" fill={p.ink} />
            <path d="M43 65q5-5 10 0" stroke={p.ink} strokeWidth="2.6" />
            <path
              d="M75 39c-6 8-7 12-2 14s9-3 2-14Z"
              fill={paint('tear')}
              stroke="#cdefff"
              strokeWidth="1"
            />
            <path d="m74 45-1 3" stroke="#fff" strokeWidth="1.5" />
          </>
        )}
      </g>
    </svg>
  )
}
