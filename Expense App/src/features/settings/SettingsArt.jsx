import { useId } from 'react'

export default function SettingsArt({ variant = 'personal', className = '' }) {
  const id = useId().replaceAll(':', '')
  if (variant === 'archive') {
    return (
      <svg className={className} viewBox="0 0 200 150" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id={id + '-box'}
            x1="45"
            y1="76"
            x2="155"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e9f1dc" />
            <stop offset="1" stopColor="#c6dbb8" />
          </linearGradient>
        </defs>
        <ellipse cx="103" cy="87" rx="77" ry="48" fill="#dfebd5" />
        <ellipse cx="103" cy="134" rx="74" ry="5" fill="#bdcfae" opacity=".5" />
        <g strokeLinecap="round" strokeLinejoin="round">
          <g transform="rotate(-12 82 65)">
            <rect
              x="57"
              y="28"
              width="52"
              height="70"
              rx="5"
              fill="#fffaf0"
              stroke="#b49b87"
              strokeWidth="1.6"
            />
            <path d="M67 42h30m-30 7h19m-19 35h30" stroke="#dec9b4" strokeWidth="1.4" />
            <path
              d="M77 60c-5-6-12 2 0 10 12-8 5-16 0-10Z"
              fill="#e8bfd0"
              stroke="#bd96aa"
              strokeWidth="1.3"
            />
            <path d="M62 35v48" stroke="white" strokeWidth="2" />
          </g>
          <g transform="rotate(9 124 65)">
            <rect
              x="99"
              y="35"
              width="48"
              height="64"
              rx="5"
              fill="#f4e9fa"
              stroke="#aa8bbc"
              strokeWidth="1.6"
            />
            <path d="M109 48h27m-27 6h18m-18 26h25m-25 6h17" stroke="#cdb4de" strokeWidth="1.3" />
            <path d="M125 35v17l4-3 4 3V35" fill="#e8b8ca" stroke="#b88fa6" strokeWidth="1.2" />
          </g>
          <path
            d="M45 76h110v47a8 8 0 0 1-8 8H53a8 8 0 0 1-8-8Z"
            fill={'url(#' + id + '-box)'}
            stroke="#87a17a"
            strokeWidth="1.6"
          />
          <rect
            x="40"
            y="73"
            width="120"
            height="12"
            rx="4"
            fill="#d5e5c4"
            stroke="#87a17a"
            strokeWidth="1.6"
          />
          <path d="M48 77h103" stroke="#f7fbed" strokeWidth="2" />
          <rect
            x="76"
            y="96"
            width="49"
            height="23"
            rx="6"
            fill="#fffaf0"
            stroke="#9db18b"
            strokeWidth="1.3"
          />
          <circle cx="91" cy="104" r="1.1" fill="#8c9c78" />
          <circle cx="110" cy="104" r="1.1" fill="#8c9c78" />
          <path d="M97 110q3.5 4 7 0" stroke="#8c9c78" strokeWidth="1.5" />
          <ellipse cx="86" cy="110" rx="3" ry="1.7" fill="#e9c5bb" />
          <ellipse cx="115" cy="110" rx="3" ry="1.7" fill="#e9c5bb" />
          <path d="M52 94v26q0 4 4 4" stroke="#f4faeb" strokeWidth="2.6" />
          <path
            d="m168 48 2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2Z"
            fill="#ffe8b8"
            stroke="#c2a473"
            strokeWidth="1.2"
          />
          <path
            d="m28 91 1.3 3.7L33 96l-3.7 1.3L28 101l-1.3-3.7L23 96l3.7-1.3Z"
            fill="#e5d0ef"
            stroke="#b89bc8"
            strokeWidth="1.1"
          />
          <path
            d="M112 19c-3-4-8 1 0 6 8-5 3-10 0-6Z"
            fill="#e9c5d2"
            stroke="#bf9bb0"
            strokeWidth="1.1"
          />
        </g>
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 200 150" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={id + '-cover'}
          x1="54"
          y1="53"
          x2="143"
          y2="128"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8effc" />
          <stop offset="1" stopColor="#dfccee" />
        </linearGradient>
      </defs>
      <ellipse cx="101" cy="86" rx="74" ry="48" fill="#e6d8f2" />
      <ellipse cx="105" cy="133" rx="71" ry="5" fill="#cbb5de" opacity=".5" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-7 98 85)">
          <rect
            x="50"
            y="39"
            width="90"
            height="90"
            rx="9"
            fill="#bfa0d6"
            stroke="#a181b5"
            strokeWidth="1.6"
          />
          <rect
            x="57"
            y="35"
            width="87"
            height="90"
            rx="8"
            fill={'url(#' + id + '-cover)'}
            stroke="#a181b5"
            strokeWidth="1.6"
          />
          <path d="M68 37v86" stroke="#c5a5db" strokeWidth="1.3" />
          <path d="M53 49h9m-9 14h9m-9 14h9m-9 14h9m-9 14h9" stroke="#9470aa" strokeWidth="2.5" />
          <rect
            x="79"
            y="49"
            width="51"
            height="43"
            rx="7"
            fill="#fffaf1"
            stroke="#ccb3d9"
            strokeWidth="1.3"
          />
          <path
            d="M91 79c-5 0-8-3-8-7 0-3 2-6 5-7 0-6 4-10 10-10 5 0 9 3 10 8 5-1 9 2 9 6 4 0 6 3 6 5 0 3-3 5-6 5Z"
            fill="#fffdf7"
            stroke="#b294c0"
            strokeWidth="1.2"
          />
          <circle cx="96" cy="70" r="1" fill="#a081ad" />
          <circle cx="109" cy="70" r="1" fill="#a081ad" />
          <path d="M100 75q2.5 2.5 5 0" stroke="#a081ad" strokeWidth="1.1" />
          <path d="M82 104h43m-43 7h27" stroke="#c7a9d9" strokeWidth="1.4" />
          <path d="M119 35v17l4-3 4 3V35" fill="#eabfcf" stroke="#bc92ab" strokeWidth="1.2" />
          <path d="M62 43v34" stroke="#fffcff" strokeWidth="2.2" />
        </g>
        <g transform="rotate(16 158 93)">
          <path d="M153 58h10v59l-5 11-5-11Z" fill="#ffe1af" stroke="#b5966f" strokeWidth="1.5" />
          <path
            d="M153 58v-7a5 5 0 0 1 10 0v7Z"
            fill="#e7b9cd"
            stroke="#b5966f"
            strokeWidth="1.5"
          />
          <path d="M153 63h10m-5 4v44m-5 6h10m-5 11v-5" stroke="#c4a078" strokeWidth="1.1" />
        </g>
        <path
          d="m34 51 2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2Z"
          fill="#ffe7b1"
          stroke="#c3a36e"
          strokeWidth="1.2"
        />
        <path
          d="M151 25c-4-4-8 2 0 6 8-4 4-10 0-6Z"
          fill="#ecc8d6"
          stroke="#c19ab0"
          strokeWidth="1.1"
        />
        <path
          d="m176 89 1.3 3.7L181 94l-3.7 1.3L176 99l-1.3-3.7L171 94l3.7-1.3Z"
          fill="#e7d5f1"
          stroke="#b497c7"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  )
}
