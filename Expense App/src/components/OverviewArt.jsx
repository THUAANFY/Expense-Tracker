import { useId } from 'react'

export default function OverviewArt({ variant = 'savings', className = '' }) {
  const id = useId().replaceAll(':', '')
  const ink = '#89677e'

  if (variant === 'flower') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id={id + '-petal'}
            x1="27"
            y1="2"
            x2="27"
            y2="51"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff1d8" />
            <stop offset="1" stopColor="#ffdbad" />
          </linearGradient>
        </defs>
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 39c0 7 5 10 6 19" stroke="#8ca282" strokeWidth="1.6" />
          <path
            d="M33 52c-7 1-12-3-12-7 5-2 11 1 12 7Z"
            fill="#d6e5c7"
            stroke="#8ca282"
            strokeWidth="1.3"
          />
          <path
            d="M32 47c1-6 6-9 10-7 0 4-4 8-10 7Z"
            fill="#c4d9b6"
            stroke="#8ca282"
            strokeWidth="1.3"
          />
          <path
            d="M19.113 12.339A8 8 0 1 1 34.887 12.339A8 8 0 1 1 42.774 26A8 8 0 1 1 34.887 39.661A8 8 0 1 1 19.113 39.661A8 8 0 1 1 11.226 26A8 8 0 1 1 19.113 12.339Z"
            fill={'url(#' + id + '-petal)'}
            stroke="#b58b67"
            strokeWidth="1.4"
          />
          <circle cx="27" cy="26" r="10.5" fill="#fff1bd" stroke="#b58b67" strokeWidth="1.4" />
          <path d="M21 21a8 8 0 0 1 9-2" stroke="#fffaf0" strokeWidth="1.8" />
          <ellipse cx="20.5" cy="29" rx="2" ry="1.3" fill="#edbb9f" />
          <ellipse cx="33.5" cy="29" rx="2" ry="1.3" fill="#edbb9f" />
          <g fill="#99734f">
            <circle cx="23.5" cy="25.5" r=".95" />
            <circle cx="30.5" cy="25.5" r=".95" />
          </g>
          <path d="M24.5 30q2.5 2.5 5 0" stroke="#99734f" strokeWidth="1.2" />
          <path
            d="m53 43 1.7 4.3L59 49l-4.3 1.7L53 55l-1.7-4.3L47 49l4.3-1.7Z"
            fill="#e9dcf4"
            stroke="#b69bc9"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    )
  }

  if (variant === 'cloud') {
    const cloud =
      'M28 79c-7 0-12-5-12-11 0-6 4-11 10-12 0-9 6-16 15-16 8 0 14 5 16 12 7-2 15 3 15 10 5 0 9 4 9 8 0 5-4 9-9 9Z'
    return (
      <svg className={className} viewBox="0 0 128 92" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id={id + '-cloud'}
            x1="48"
            y1="40"
            x2="48"
            y2="79"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fffefa" />
            <stop offset="1" stopColor="#fcf2f8" />
          </linearGradient>
        </defs>
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 58a34 34 0 0 1 68 0" stroke="#e8b9cb" strokeWidth="8" />
          <path d="M36 58a26 26 0 0 1 52 0" stroke="#f7d8a1" strokeWidth="7" />
          <path d="M43 58a19 19 0 0 1 38 0" stroke="#c9dbc4" strokeWidth="6" />
          <path
            d="M89 70c-4 0-7-3-7-7 0-3 2-6 5-7 0-5 4-9 9-9s9 4 9 8c5-1 10 3 10 7 0 5-4 8-8 8Z"
            fill="#fffaf5"
            stroke="#b39abf"
            strokeWidth="1.4"
          />
          <path d={cloud} stroke="#fffaf8" strokeWidth="4" />
          <path d={cloud} fill={'url(#' + id + '-cloud)'} stroke="#9f81ae" strokeWidth="1.5" />
          <path d="M30 55c1-6 5-10 10-10" stroke="white" strokeWidth="2.5" />
          <ellipse cx="34" cy="68" rx="3.5" ry="2" fill="#efc6d5" />
          <ellipse cx="60" cy="68" rx="3.5" ry="2" fill="#efc6d5" />
          <g fill="#97739d">
            <circle cx="40" cy="63.5" r="1.25" />
            <circle cx="54" cy="63.5" r="1.25" />
          </g>
          <path d="M44 69q3 3 6 0" stroke="#97739d" strokeWidth="1.4" />
          <path d="m105 24 16 7-17 9 1-16Z" fill="#f1e7f8" stroke="#a58aba" strokeWidth="1.35" />
          <path d="m105 24 6 9-7 7m7-7 10-2" stroke="#a58aba" strokeWidth="1.2" />
          <path
            d="M104 44c-1 3-4 5-8 5"
            stroke="#bda5ce"
            strokeWidth="1.2"
            strokeDasharray="2 3.5"
          />
          <path
            d="m15 23 1.8 4.7L22 29.5l-5.2 1.8L15 36l-1.8-4.7L8 29.5l5.2-1.8Z"
            fill="#ffe9b8"
            stroke="#c4a36e"
            strokeWidth="1.2"
          />
          <path
            d="m82 11 1.2 3.2 3.3 1.3-3.3 1.2L82 20l-1.2-3.3-3.3-1.2 3.3-1.3Z"
            fill="#e5d4f1"
            stroke="#bba2cd"
            strokeWidth="1"
          />
        </g>
      </svg>
    )
  }

  if (variant === 'receipt') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id={id + '-paper'}
            x1="32"
            y1="8"
            x2="32"
            y2="55"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fffdf7" />
            <stop offset="1" stopColor="#fff1dc" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="58" rx="19" ry="2.5" fill="#e9dfee" />
        <g strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22 8h20a4 4 0 0 1 4 4v43l-4-3-4 3-4-3-4 3-4-3-4 3-4-3V12a4 4 0 0 1 4-4Z"
            fill={'url(#' + id + '-paper)'}
            stroke="#ab8db5"
            strokeWidth="1.5"
          />
          <path d="M24 18h16m-16 5h10m-10 22h16" stroke="#d0b9cf" strokeWidth="1.5" />
          <path d="M21 14v29" stroke="white" strokeWidth="1.7" />
          <ellipse cx="24" cy="36" rx="2.4" ry="1.5" fill="#edbfd0" />
          <ellipse cx="40" cy="36" rx="2.4" ry="1.5" fill="#edbfd0" />
          <g fill="#9d7ca6">
            <circle cx="27" cy="32" r="1" />
            <circle cx="37" cy="32" r="1" />
          </g>
          <path d="M29 37q3 3 6 0" stroke="#9d7ca6" strokeWidth="1.3" />
          <path
            d="m53 14 1.3 3.7L58 19l-3.7 1.3L53 24l-1.3-3.7L48 19l3.7-1.3Z"
            fill="#ffe6af"
            stroke="#c3a575"
            strokeWidth="1.1"
          />
          <path
            d="M11 35c-3-3-6 2 0 5 6-3 3-8 0-5Z"
            fill="#e2cdea"
            stroke="#b69ac5"
            strokeWidth="1.1"
          />
        </g>
      </svg>
    )
  }

  if (variant === 'jar') {
    const jar = 'M27 30h26v7c7 4 11 10 11 19v7a7 7 0 0 1-7 7H23a7 7 0 0 1-7-7v-7c0-9 4-15 11-19Z'
    return (
      <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id={id + '-glass'}
            x1="20"
            y1="34"
            x2="62"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f8fcf1" />
            <stop offset="1" stopColor="#d7e9c9" />
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="73" rx="25" ry="3" fill="#ccddc2" opacity=".7" />
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d={jar} fill={'url(#' + id + '-glass)'} stroke="#829b74" strokeWidth="1.5" />
          <path d="M22 51c0-4 2-7 5-9m-5 15v6" stroke="#fffef5" strokeWidth="3" />
          <circle cx="41" cy="54" r="11.5" fill="#ffedb3" stroke="#b69b65" strokeWidth="1.4" />
          <circle cx="41" cy="54" r="8.3" stroke="#dfc48b" strokeWidth="1" />
          <g fill="#a08751">
            <circle cx="37.5" cy="52" r=".8" />
            <circle cx="44.5" cy="52" r=".8" />
          </g>
          <path d="M38 57q3 3 6 0" stroke="#a08751" strokeWidth="1.2" />
          <rect
            x="23"
            y="23"
            width="34"
            height="8"
            rx="3.5"
            fill="#bbd2a7"
            stroke="#829b74"
            strokeWidth="1.5"
          />
          <path d="M29 26h22" stroke="#dce9d1" strokeWidth="1.6" />
          <path d="M40 23c0-5 0-9 2-14" stroke="#829b74" strokeWidth="1.4" />
          <path
            d="M40 17C31 18 26 12 29 8c5-2 11 2 11 9Z"
            fill="#bed5aa"
            stroke="#829b74"
            strokeWidth="1.3"
          />
          <path
            d="M41 13C43 5 50 3 53 6c0 5-5 9-12 7Z"
            fill="#d2e2bc"
            stroke="#829b74"
            strokeWidth="1.3"
          />
          <path
            d="m67 28 1.4 3.6L72 33l-3.6 1.4L67 38l-1.4-3.6L62 33l3.6-1.4Z"
            fill="#ffe8b5"
            stroke="#bfa374"
            strokeWidth="1.1"
          />
        </g>
      </svg>
    )
  }

  const jar =
    'M117 85h56v9c10 6 15 15 15 27v23a10 10 0 0 1-10 10h-66a10 10 0 0 1-10-10v-23c0-12 5-21 15-27Z'
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={id + '-fur'}
          x1="40"
          y1="58"
          x2="87"
          y2="145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef7" />
          <stop offset="1" stopColor="#faeede" />
        </linearGradient>
        <linearGradient
          id={id + '-glass'}
          x1="105"
          y1="93"
          x2="186"
          y2="152"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff7fd" />
          <stop offset="1" stopColor="#e5d2f1" />
        </linearGradient>
        <linearGradient id={id + '-coin'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff0bb" />
          <stop offset="1" stopColor="#ffdb82" />
        </linearGradient>
        <clipPath id={id + '-jar'}>
          <path d={jar} />
        </clipPath>
      </defs>
      <ellipse cx="121" cy="103" rx="101" ry="59" fill="#e5d6f2" opacity=".7" />
      <ellipse cx="121" cy="159" rx="101" ry="7" fill="#cdb8df" opacity=".45" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g stroke={ink} strokeWidth="1.8">
          <circle cx="91" cy="131" r="10" fill="#fff9ee" />
          <path
            d="M47 106c-12 10-15 31-5 43 8 10 34 12 44 0 11-14 3-35-7-43Z"
            fill={'url(#' + id + '-fur)'}
          />
          <ellipse cx="64" cy="131" rx="13" ry="18" fill="#f4e4de" stroke="none" />
          <path d="M46 66C38 57 35 34 43 30c8-4 17 22 15 34Z" fill={'url(#' + id + '-fur)'} />
          <path d="M67 63c-2-13 3-35 11-33 9 2 3 25-2 36Z" fill={'url(#' + id + '-fur)'} />
          <path d="M46 57c-4-7-6-18-3-19 3-1 7 11 8 19Z" fill="#ecc6d1" stroke="none" />
          <path d="M71 57c0-8 3-19 6-19 3 1 0 13-3 20Z" fill="#ecc6d1" stroke="none" />
          <ellipse cx="65" cy="85" rx="28" ry="25" fill={'url(#' + id + '-fur)'} />
          <path d="M45 76c2-5 6-8 11-9" stroke="#fffefb" strokeWidth="3" />
          <ellipse cx="47" cy="90" rx="5" ry="3" fill="#eec4d0" stroke="none" />
          <ellipse cx="83" cy="90" rx="5" ry="3" fill="#eec4d0" stroke="none" />
          <g fill="#806478" stroke="none">
            <ellipse cx="55" cy="81" rx="1.6" ry="2.1" />
            <ellipse cx="75" cy="81" rx="1.6" ry="2.1" />
          </g>
          <path d="M62.5 87q2.5-2 5 0L65 89Z" fill="#c996a9" stroke="#c996a9" strokeWidth=".7" />
          <path d="M65 89v3m-4 0q2 3 4 0 2 3 4 0" strokeWidth="1.2" />
          <ellipse cx="46" cy="151" rx="11" ry="6" fill="#fff7ea" />
          <ellipse cx="78" cy="152" rx="11" ry="6" fill="#fff7ea" />
          <path d="M41 151h2m31 1h2" stroke="#d4bdc4" strokeWidth="1" />
        </g>
        <path d={jar} fill={'url(#' + id + '-glass)'} stroke="#9c7bb0" strokeWidth="1.8" />
        <g clipPath={'url(#' + id + '-jar)'}>
          <path d="M104 132q40-13 82-1v25h-82Z" fill="#ccb1e2" opacity=".25" />
          <g stroke="#c09a50" strokeWidth="1.4" fill={'url(#' + id + '-coin)'}>
            <circle cx="130" cy="138" r="11" />
            <circle cx="157" cy="138" r="11" />
            <circle cx="144" cy="122" r="12" fill="#ffe9a5" />
          </g>
          <g stroke="#d6b875" strokeWidth="1" fill="none">
            <circle cx="130" cy="138" r="7.8" />
            <circle cx="157" cy="138" r="7.8" />
            <circle cx="144" cy="122" r="8.7" />
          </g>
          <path d="m140 122 3 3 5-6m-21 19h6m21 0h6" stroke="#b38d48" strokeWidth="1.5" />
          <path d="M111 111c1-6 4-10 9-13m-9 21v15" stroke="#fffcff" strokeWidth="4" opacity=".9" />
          <path d="M180 120v22" stroke="#c6addb" strokeWidth="1.4" />
        </g>
        <rect
          x="113"
          y="75"
          width="64"
          height="12"
          rx="5"
          fill="#bc9dd5"
          stroke="#9171a5"
          strokeWidth="1.8"
        />
        <path d="M120 79h50" stroke="#decbe9" strokeWidth="1.5" />
        <path d="M134 82h22" stroke="#80608f" strokeWidth="2" />
        <path
          d="M85 114c7-4 15-3 21 2 7 7-3 13-11 10-6-2-10-7-10-12Z"
          fill="#fff7ec"
          stroke={ink}
          strokeWidth="1.7"
        />
        <path d="m100 118 3 1m-5 2 3 1" stroke="#d5bcc4" strokeWidth="1.1" />
        <circle
          cx="146"
          cy="50"
          r="11"
          fill={'url(#' + id + '-coin)'}
          stroke="#c09a50"
          strokeWidth="1.4"
        />
        <circle cx="146" cy="50" r="7.6" stroke="#d6b875" strokeWidth="1" />
        <path d="m142.5 50 2.5 2.5 4.5-5" stroke="#b38d48" strokeWidth="1.4" />
        <path d="M146 25v7m-8-4 2 5m14-5-2 5" stroke="#b496c6" strokeWidth="1.3" />
        <path d="M210 153c-2-9-2-17 0-25" stroke="#8ba284" strokeWidth="1.5" />
        <path
          d="M209 143c-9 0-14-5-11-9 6-2 10 3 11 9Zm0-7c1-8 7-13 12-10 1 5-5 10-12 10Z"
          fill="#c8ddbe"
          stroke="#8ba284"
          strokeWidth="1.3"
        />
        <path
          d="m204 47 2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2Z"
          fill="#ffe7b0"
          stroke="#c2a06b"
          strokeWidth="1.2"
        />
        <path
          d="M105 38c-4-5-10 1 0 7 10-6 4-12 0-7Z"
          fill="#e9bfd1"
          stroke="#b992ac"
          strokeWidth="1.2"
        />
        <path
          d="m24 89 1.4 3.6L29 94l-3.6 1.4L24 99l-1.4-3.6L19 94l3.6-1.4Z"
          fill="#eadcf5"
          stroke="#b79aca"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  )
}
