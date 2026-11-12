import { useId } from 'react'

export default function SettingsBackupArt({ className = '' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-folder`}
          x1="25"
          y1="48"
          x2="115"
          y2="122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d28aff" />
          <stop offset=".5" stopColor="#9b4de1" />
          <stop offset="1" stopColor="#5834ae" />
        </linearGradient>
        <linearGradient
          id={`${id}-cloud`}
          x1="86"
          y1="74"
          x2="127"
          y2="127"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d1b5ff" />
          <stop offset=".55" stopColor="#9366e9" />
          <stop offset="1" stopColor="#6848c7" />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="48"
          y1="21"
          x2="98"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff5ff" />
          <stop offset="1" stopColor="#adadff" />
        </linearGradient>
      </defs>
      <ellipse cx="81" cy="126" rx="62" ry="6" fill="#9164cc" opacity=".18" />
      <path
        d="M24 49q0-7 7-7h28l10 10h54q8 0 8 8v49q0 9-9 9H32q-8 0-8-8Z"
        fill="#6432b6"
        stroke="#ad76f0"
        strokeWidth="1.5"
      />
      <g transform="rotate(-8 64 64)">
        <rect
          x="40"
          y="19"
          width="59"
          height="75"
          rx="6"
          fill={`url(#${id}-paper)`}
          stroke="#e5d0ff"
        />
        <path
          d="M50 32h22m-22 9h36m-36 8h29"
          stroke="#a282d1"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="49" y="60" width="10" height="19" rx="2" fill="#aa6fe7" />
        <rect x="64" y="53" width="10" height="26" rx="2" fill="#9260d9" />
        <rect x="79" y="46" width="10" height="33" rx="2" fill="#7551c5" />
      </g>
      <path
        d="M22 66q0-7 7-7h33l9 8h57q8 0 7 9l-7 39q-1 7-9 7H30q-8 0-8-8Z"
        fill={`url(#${id}-folder)`}
        stroke="#ddb7ff"
        strokeWidth="1.5"
      />
      <path
        d="M29 70v41q0 4 4 4m0-48h25"
        stroke="#f4d6ff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M83 123c-13 0-17-15-8-22 0-10 10-16 19-13 8-17 32-13 35 4 17 0 24 24 8 30Z"
        fill={`url(#${id}-cloud)`}
        stroke="#d7beff"
        strokeWidth="1.5"
      />
      <path
        d="M107 114V96m-8 8 8-8 8 8"
        stroke="#fff4ff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m132 26 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#d6a6ff" />
      <circle cx="20" cy="34" r="2" fill="#a97dea" />
    </svg>
  )
}
