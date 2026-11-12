import useAppearance from '../theme/useAppearance'
import { useId } from 'react'

const DARK_ART_COLORS = {
  '#fffef9': '#f0eaff',
  '#f8edf5': '#c7b3ee',
  '#f3e9fb': '#ac8ae4',
  '#ddc9eb': '#60448e',
  '#eee5f7': '#25243e',
  '#d6c3e7': '#756296',
  '#d6c5e1': '#161b30',
  '#ffe9b9': '#d1bdff',
  '#c6a46b': '#9c7fce',
  '#e0ceef': '#b99be8',
  '#c4d7b7': '#8fd6bc',
  '#edc5d5': '#e6a6cd',
  '#bf98ad': '#a97ea8',
  '#aa8bb8': '#ad92d1',
  '#fff': '#ffffff',
  '#efd0da': '#e6a6cd',
  '#83618f': '#51406d',
  '#96739f': '#674b82',
  '#d1e2c8': '#83c6af',
  '#8faa82': '#4e9a86',
  '#edf4e7': '#d5f5ea',
  '#f5dfbd': '#c8c3e3',
  '#b99979': '#9285ac',
  '#8a718b': '#4b3a67',
  '#ecc8ce': '#daa4d1',
  '#b58d9d': '#9e71a6',
  '#b3b199': '#9fa7c4',
  '#a98cbd': '#b299d6',
  '#fffdf7': '#302a49',
  '#bca4c9': '#a48acb',
  '#b3bfa0': '#a5cbbf',
  '#fffaf5': '#dfc9f4',
}

export default function FooterArt() {
  const id = useId().replaceAll(':', '')
  const { theme } = useAppearance()
  const tone = (light) => (theme === 'dark' ? DARK_ART_COLORS[light] || light : light)
  return (
    <svg className="footer-cloud-art" viewBox="0 0 84 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={id + '-cloud'}
          x1="38"
          y1="13"
          x2="42"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#fffef9')} />
          <stop offset="1" stopColor={tone('#f8edf5')} />
        </linearGradient>
        <linearGradient
          id={id + '-book'}
          x1="28"
          y1="42"
          x2="59"
          y2="57"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#f3e9fb')} />
          <stop offset="1" stopColor={tone('#ddc9eb')} />
        </linearGradient>
      </defs>
      <ellipse cx="42" cy="34" rx="29" ry="22" fill={tone('#eee5f7')} />
      <path
        d="M17 20c9-10 30-13 43-4"
        stroke={tone('#d6c3e7')}
        strokeDasharray="1.5 3.5"
        strokeLinecap="round"
      />
      <ellipse cx="43" cy="59" rx="24" ry="2.1" fill={tone('#d6c5e1')} opacity=".5" />
      <g className="footer-cloud-sparkle" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="m11 13 1.5 4.2L17 19l-4.5 1.6L11 25l-1.6-4.4L5 19l4.4-1.8Z"
          fill={tone('#ffe9b9')}
          stroke={tone('#c6a46b')}
          strokeWidth="1"
        />
        <path d="m70 17 .9 2.5 2.6 1-2.6 1-.9 2.5-1-2.5-2.5-1 2.5-1Z" fill={tone('#e0ceef')} />
        <circle cx="11" cy="39" r="1.3" fill={tone('#c4d7b7')} />
        <path
          d="M69 39c-1.6-2.2-4.5-.5-3.2 1.6L69 44l3.2-3.4c1.3-2.1-1.6-3.8-3.2-1.6Z"
          fill={tone('#edc5d5')}
          stroke={tone('#bf98ad')}
          strokeWidth=".8"
        />
      </g>
      <g className="footer-cloud-character" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M24 46c-6 0-10-4-10-9 0-5 3-8 7-9-1-8 5-14 12-14 6 0 11 4 12 9 7-2 13 3 13 9 5 0 9 4 9 8 0 4-4 8-9 8Z"
          fill={'url(#' + id + '-cloud)'}
          stroke={tone('#aa8bb8')}
          strokeWidth="1.4"
        />
        <path d="M24 25c0-5 4-8 9-8" stroke={tone('#fff')} strokeWidth="2" />
        <ellipse cx="26.5" cy="35" rx="2.5" ry="1.6" fill={tone('#efd0da')} />
        <ellipse cx="48" cy="35" rx="2.5" ry="1.6" fill={tone('#efd0da')} />
        <path d="M31 30.5v1.6m12-1.6v1.6" stroke={tone('#83618f')} strokeWidth="1.8" />
        <path d="M34.5 35.5q2.5 2.6 5 0" stroke={tone('#96739f')} strokeWidth="1.1" />
        <g className="footer-cloud-pencil" transform="translate(63 26) rotate(24)">
          <path
            d="M-2 0h4v19h-4Z"
            fill={tone('#d1e2c8')}
            stroke={tone('#8faa82')}
            strokeWidth="1"
          />
          <path d="M0 1v16" stroke={tone('#edf4e7')} />
          <path
            d="m-2 19 2 5 2-5Z"
            fill={tone('#f5dfbd')}
            stroke={tone('#b99979')}
            strokeWidth=".8"
          />
          <path d="m-.6 22.4.6 1.6.6-1.6" fill={tone('#8a718b')} />
          <rect
            x="-2"
            y="-3"
            width="4"
            height="4"
            rx="1.5"
            fill={tone('#ecc8ce')}
            stroke={tone('#b58d9d')}
            strokeWidth=".8"
          />
          <path d="M-2 1h4" stroke={tone('#b3b199')} />
        </g>
        <path
          d="M26 44c7-2 12-1 17 2 6-3 12-3 18-1v12c-7-2-12-2-18 .5-6-2.5-11-2.5-17-.5Z"
          fill={'url(#' + id + '-book)'}
          stroke={tone('#a98cbd')}
          strokeWidth="1.2"
        />
        <path
          d="M28 42c6-1 10 0 15 2.5 6-2.5 11-3 16-1.5v11c-6-1.5-11-1-16 1.5-5-2.5-9-3-15-1.5Z"
          fill={tone('#fffdf7')}
          stroke={tone('#bca4c9')}
          strokeWidth="1"
        />
        <path
          d="M43 45v10m-12-8c3-.3 6 .5 9 1.5m-9 1.5c3 0 6 .5 9 1.5m7-5 1.1 1.1 1.8-2m1.8.2 3.5-.2m-7 5.2 1.1 1.1 1.8-2m1.8.2 3.5-.2"
          stroke={tone('#b3bfa0')}
          strokeWidth=".9"
        />
        <path
          d="M25.5 43c-3.2-3.4-6-1.2-4.3 1.3l4.5 2.3"
          fill={tone('#fffaf5')}
          stroke={tone('#aa8bb8')}
          strokeWidth="1.1"
        />
        <path
          d="M55 38.5c-2-2.5-5-.5-3.4 2l3.2 2 2-2.8"
          fill={tone('#fffaf5')}
          stroke={tone('#aa8bb8')}
          strokeWidth="1.1"
        />
      </g>
    </svg>
  )
}
