import { useId } from 'react'

export default function FooterArt() {
  const id = useId().replaceAll(':', '')
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
          <stop stopColor="#fffef9" />
          <stop offset="1" stopColor="#f8edf5" />
        </linearGradient>
        <linearGradient
          id={id + '-book'}
          x1="28"
          y1="42"
          x2="59"
          y2="57"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f3e9fb" />
          <stop offset="1" stopColor="#ddc9eb" />
        </linearGradient>
      </defs>
      <ellipse cx="42" cy="34" rx="29" ry="22" fill="#eee5f7" />
      <path
        d="M17 20c9-10 30-13 43-4"
        stroke="#d6c3e7"
        strokeDasharray="1.5 3.5"
        strokeLinecap="round"
      />
      <ellipse cx="43" cy="59" rx="24" ry="2.1" fill="#d6c5e1" opacity=".5" />
      <g className="footer-cloud-sparkle" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="m11 13 1.5 4.2L17 19l-4.5 1.6L11 25l-1.6-4.4L5 19l4.4-1.8Z"
          fill="#ffe9b9"
          stroke="#c6a46b"
          strokeWidth="1"
        />
        <path d="m70 17 .9 2.5 2.6 1-2.6 1-.9 2.5-1-2.5-2.5-1 2.5-1Z" fill="#e0ceef" />
        <circle cx="11" cy="39" r="1.3" fill="#c4d7b7" />
        <path
          d="M69 39c-1.6-2.2-4.5-.5-3.2 1.6L69 44l3.2-3.4c1.3-2.1-1.6-3.8-3.2-1.6Z"
          fill="#edc5d5"
          stroke="#bf98ad"
          strokeWidth=".8"
        />
      </g>
      <g className="footer-cloud-character" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M24 46c-6 0-10-4-10-9 0-5 3-8 7-9-1-8 5-14 12-14 6 0 11 4 12 9 7-2 13 3 13 9 5 0 9 4 9 8 0 4-4 8-9 8Z"
          fill={'url(#' + id + '-cloud)'}
          stroke="#aa8bb8"
          strokeWidth="1.4"
        />
        <path d="M24 25c0-5 4-8 9-8" stroke="#fff" strokeWidth="2" />
        <ellipse cx="26.5" cy="35" rx="2.5" ry="1.6" fill="#efd0da" />
        <ellipse cx="48" cy="35" rx="2.5" ry="1.6" fill="#efd0da" />
        <path d="M31 30.5v1.6m12-1.6v1.6" stroke="#83618f" strokeWidth="1.8" />
        <path d="M34.5 35.5q2.5 2.6 5 0" stroke="#96739f" strokeWidth="1.1" />
        <g className="footer-cloud-pencil" transform="translate(63 26) rotate(24)">
          <path d="M-2 0h4v19h-4Z" fill="#d1e2c8" stroke="#8faa82" strokeWidth="1" />
          <path d="M0 1v16" stroke="#edf4e7" />
          <path d="m-2 19 2 5 2-5Z" fill="#f5dfbd" stroke="#b99979" strokeWidth=".8" />
          <path d="m-.6 22.4.6 1.6.6-1.6" fill="#8a718b" />
          <rect
            x="-2"
            y="-3"
            width="4"
            height="4"
            rx="1.5"
            fill="#ecc8ce"
            stroke="#b58d9d"
            strokeWidth=".8"
          />
          <path d="M-2 1h4" stroke="#b3b199" />
        </g>
        <path
          d="M26 44c7-2 12-1 17 2 6-3 12-3 18-1v12c-7-2-12-2-18 .5-6-2.5-11-2.5-17-.5Z"
          fill={'url(#' + id + '-book)'}
          stroke="#a98cbd"
          strokeWidth="1.2"
        />
        <path
          d="M28 42c6-1 10 0 15 2.5 6-2.5 11-3 16-1.5v11c-6-1.5-11-1-16 1.5-5-2.5-9-3-15-1.5Z"
          fill="#fffdf7"
          stroke="#bca4c9"
          strokeWidth="1"
        />
        <path
          d="M43 45v10m-12-8c3-.3 6 .5 9 1.5m-9 1.5c3 0 6 .5 9 1.5m7-5 1.1 1.1 1.8-2m1.8.2 3.5-.2m-7 5.2 1.1 1.1 1.8-2m1.8.2 3.5-.2"
          stroke="#b3bfa0"
          strokeWidth=".9"
        />
        <path
          d="M25.5 43c-3.2-3.4-6-1.2-4.3 1.3l4.5 2.3"
          fill="#fffaf5"
          stroke="#aa8bb8"
          strokeWidth="1.1"
        />
        <path
          d="M55 38.5c-2-2.5-5-.5-3.4 2l3.2 2 2-2.8"
          fill="#fffaf5"
          stroke="#aa8bb8"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  )
}
