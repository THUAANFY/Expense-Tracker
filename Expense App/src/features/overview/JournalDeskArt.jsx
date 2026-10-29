import { useId } from 'react'

export default function JournalDeskArt() {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      className="journal-desk-art"
      viewBox="0 36 300 170"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-cloud`}
          x1="151"
          y1="73"
          x2="151"
          y2="147"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef8" />
          <stop offset="1" stopColor="#fcedf5" />
        </linearGradient>
        <linearGradient
          id={`${id}-wood`}
          x1="150"
          y1="151"
          x2="150"
          y2="167"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f8e6d2" />
          <stop offset="1" stopColor="#edd0b5" />
        </linearGradient>
        <linearGradient
          id={`${id}-leaves`}
          x1="44"
          y1="91"
          x2="68"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d8e9c9" />
          <stop offset="1" stopColor="#aecb9c" />
        </linearGradient>
        <linearGradient
          id={`${id}-cover`}
          x1="105"
          y1="151"
          x2="199"
          y2="175"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dac4eb" />
          <stop offset="1" stopColor="#bba0d1" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="107" rx="108" ry="66" fill="#eee6f6" opacity=".66" />
      <ellipse cx="155" cy="119" rx="88" ry="51" fill="#f7eff7" />
      <path
        d="M60 82c12-37 112-62 174-15"
        stroke="#d5c0e3"
        strokeWidth="1.2"
        strokeDasharray="2 5"
      />
      <ellipse cx="151" cy="197" rx="111" ry="5" fill="#d8cbdc" opacity=".32" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-10 89 104)">
          <path
            d="M77 82h28v44l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2-4-2Z"
            fill="#fffcf1"
            stroke="#ccb997"
            strokeWidth="1.1"
          />
          <path d="M84 90h14m-14 7h10m-10 7h14m-14 8h8" stroke="#d7c6ad" strokeWidth="1.3" />
          <path d="m94 114 2 2 4-5" stroke="#9eb88e" strokeWidth="1.2" />
          <path d="m83 80 12 1-1 6-12-1Z" fill="#eed4b6" opacity=".8" />
        </g>
        <g transform="rotate(7 226 104)">
          <rect
            x="211"
            y="83"
            width="34"
            height="43"
            rx="4"
            fill="#fbf7ff"
            stroke="#bda4d0"
            strokeWidth="1.2"
          />
          <path d="M211 96h34" stroke="#d6c3e5" />
          <path d="M220 80v7m16-7v7" stroke="#a48ab8" strokeWidth="2" />
          <path d="M218 103h5m7 0h7m-19 7h5m7 0h7m-19 7h5" stroke="#d2bfdf" strokeWidth="1.3" />
          <path d="m230 115 2 2 5-5" stroke="#a1b994" strokeWidth="1.5" />
        </g>
        <path
          d="M111 143c-5 14-8 26-8 43h91c-1-18-4-29-11-43"
          fill="#e8daee"
          stroke="#bca2c9"
          strokeWidth="1.3"
        />
        <path d="M113 182h70" stroke="#d2badf" strokeWidth="1.2" />
        <g className="journal-cloud">
          <path
            d="M104 142c-14 0-22-9-22-20 0-10 6-18 16-21-1-17 11-30 27-30 12 0 22 7 26 17 14-8 31-2 36 12 13-1 24 9 24 21 0 12-9 21-23 21Z"
            fill={`url(#${id}-cloud)`}
            stroke="#a287b3"
            strokeWidth="1.5"
          />
          <path d="M103 98c1-12 10-20 22-20" stroke="#fff" strokeWidth="3" />
          <path d="M162 85c-1-7 5-12 9-9 4 4-2 9-6 5" stroke="#b69bc5" strokeWidth="1.3" />
          <ellipse cx="122" cy="117" rx="6" ry="3.4" fill="#edc2d2" opacity=".75" />
          <ellipse cx="171" cy="117" rx="6" ry="3.4" fill="#edc2d2" opacity=".75" />
          <g className="journal-eyes" fill="#8b6c9e">
            <ellipse cx="132" cy="110" rx="2" ry="2.8" />
            <ellipse cx="160" cy="110" rx="2" ry="2.8" />
          </g>
          <path d="M142 118q4 5 8 0m-6-12 2 1 2-1" stroke="#9d7eac" strokeWidth="1.3" />
          <path d="m181 103 2 3 3-2" stroke="#c7accf" strokeWidth="1.2" />
        </g>
        <path
          d="M53 157 49 193q0 3 4 3h3l8-37m170 0 7 35q1 3 4 3h3q3 0 2-4l-5-36"
          fill="#f1d9c0"
          stroke="#bea087"
          strokeWidth="1.3"
        />
        <path
          d="M41 151h218q6 0 6 5v3q0 5-6 5H41q-6 0-6-5v-3q0-5 6-5Z"
          fill={`url(#${id}-wood)`}
          stroke="#c5a78f"
          strokeWidth="1.3"
        />
        <path d="M39 155h222m-215 5h36m145 0h28" stroke="#fff5e9" strokeWidth="1.2" />
        <path
          d="m94 156 55-9 57 8v13l-57 8-55-8Z"
          fill={`url(#${id}-cover)`}
          stroke="#a789ba"
          strokeWidth="1.4"
        />
        <path d="m97 151 50-8 1 28-51-7Z" fill="#fffaf0" stroke="#c1a9ca" strokeWidth="1.1" />
        <path d="m148 143 52 6v16l-52 6Z" fill="#fffcf5" stroke="#c1a9ca" strokeWidth="1.1" />
        <path d="m149 147 1 21m-49-9 44 7m9-1 42-6" stroke="#e0cedf" />
        <path d="m107 150 30 3m-30 3 8 1m9 1 13 2" stroke="#cfbacd" strokeWidth="1.2" />
        <path
          d="m158 150 4 1m-2-3v6m-2 5 4 1m6-8 21 2m-21 6 15 2"
          stroke="#9db58e"
          strokeWidth="1.2"
        />
        <path d="m175 169 1 13 4-3 3 2-1-13" fill="#c9dfbf" stroke="#a2bc96" />
        <path
          d="M104 131c-8-2-12 4-7 9 4 4 11 3 17 5"
          fill="#fff7f7"
          stroke="#a287b3"
          strokeWidth="1.3"
        />
        <g className="journal-writing-hand">
          <path
            d="m188 142 16-29 4 2-16 29-5 4Z"
            fill="#f3d597"
            stroke="#b89a6f"
            strokeWidth="1.1"
          />
          <path d="m187 148 2-6 3 2Z" fill="#d9b4c7" />
          <path d="m188 147-1 2" stroke="#8f7387" />
          <path
            d="m202 116 4 2m-1-7 3 2q2 1 0 3l-4-2q-1-1 1-3Z"
            fill="#e5b7c9"
            stroke="#b993a5"
            strokeWidth="1.1"
          />
          <path
            d="M188 128c7-4 12 0 10 6-1 4-5 7-11 8-5 1-8-4-5-7"
            fill="#fff8f7"
            stroke="#a287b3"
            strokeWidth="1.3"
          />
        </g>
        <g className="journal-plant-leaves">
          <path d="M57 131c-1-15 1-28 8-39m-7 28-12-12" stroke="#97af87" strokeWidth="1.5" />
          <path
            d="M61 105c-3-11 2-19 12-20 2 9-2 17-12 20Z"
            fill={`url(#${id}-leaves)`}
            stroke="#95af85"
            strokeWidth="1.2"
          />
          <path
            d="M54 117c-13 0-21-7-20-16 12-1 21 5 20 16Z"
            fill={`url(#${id}-leaves)`}
            stroke="#95af85"
            strokeWidth="1.2"
          />
          <path d="m62 102 6-11m-17 22-11-8" stroke="#b6cfa7" strokeWidth="1.1" />
          <path
            d="M59 119c4-10 12-13 18-9-3 9-10 12-18 9Z"
            fill="#d8e8ca"
            stroke="#95af85"
            strokeWidth="1.1"
          />
        </g>
        <path
          d="m42 128 4 21q1 4 5 4h13q4 0 5-4l4-21"
          fill="#f8e5cf"
          stroke="#c3a487"
          strokeWidth="1.2"
        />
        <rect
          x="40"
          y="125"
          width="35"
          height="7"
          rx="3"
          fill="#fff0dc"
          stroke="#c3a487"
          strokeWidth="1.2"
        />
        <path d="M51 142q2-3 4 0m6 0q2-3 4 0m-10 5q3 2 6 0" stroke="#b29278" strokeWidth="1.1" />
        <g stroke="#c9aa6b" strokeWidth="1.1">
          <path d="M222 146v6c0 4 24 4 24 0v-6" fill="#f5d996" />
          <ellipse cx="234" cy="146" rx="12" ry="3.6" fill="#fff0bb" />
          <path d="M222 149c5 4 19 4 24 0" />
          <path d="M225 140v5c0 4 20 4 20 0v-5" fill="#f9df9f" />
          <ellipse cx="235" cy="140" rx="10" ry="3.4" fill="#fff2c5" />
          <circle cx="234" cy="129" r="10" fill="#ffe6a8" />
          <circle cx="234" cy="129" r="7.2" strokeDasharray="1 2" />
          <path d="M236 123v11m-1-6c-7-4-7 8 0 4m-5-8h9" strokeWidth="1.2" />
        </g>
        <g className="journal-sparkles">
          <path
            d="m53 65 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z"
            fill="#ffedbc"
            stroke="#ccb17d"
            strokeWidth="1.1"
          />
          <path
            d="m249 95 1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5Z"
            fill="#e8d8f3"
            stroke="#b69ac9"
            strokeWidth="1.1"
          />
          <path
            d="M203 60c-5-7-12 1 0 7 12-6 5-14 0-7Z"
            fill="#edc9d7"
            stroke="#c39bad"
            strokeWidth="1.1"
          />
          <circle cx="91" cy="57" r="2" fill="#d2bddf" />
          <circle cx="236" cy="70" r="1.7" fill="#e4cb98" />
        </g>
        <path d="M74 184h17m123 0h13m-151 5h8m119 3h11" stroke="#dcd0e3" strokeWidth="1.1" />
      </g>
    </svg>
  )
}
