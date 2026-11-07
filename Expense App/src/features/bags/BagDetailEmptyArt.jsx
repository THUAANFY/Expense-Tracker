import { useId } from 'react'

export default function BagDetailEmptyArt({ filtered = false }) {
  const id = 'bag-inbox-' + useId().replaceAll(':', '')
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="bag-detail-empty-art"
      viewBox="0 0 180 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-front`} x1=".1" y1="0" x2=".8" y2="1">
          <stop stopColor="#c69aff" />
          <stop offset=".4" stopColor="#9255dc" />
          <stop offset="1" stopColor="#513b95" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efdbff" />
          <stop offset=".5" stopColor="#bb8af1" />
          <stop offset="1" stopColor="#8fa9ff" />
        </linearGradient>
        <radialGradient id={`${id}-floor`}>
          <stop stopColor="#a269e5" stopOpacity=".4" />
          <stop offset="1" stopColor="#8a55d3" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="90" cy="102" rx="69" ry="12" fill={paint('floor')} />
      {filtered && (
        <g transform="rotate(-9 83 54)">
          <rect x="66" y="22" width="37" height="49" rx="6" fill="#d8d6f4" stroke="#a8a0dd" />
          <path
            d="M74 33h19m-19 8h15m-15 8h17"
            stroke="#9294c0"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </g>
      )}
      <path
        d="m55 48 12-20h46l12 20 4 16v29q0 7-7 7H58q-7 0-7-7V64Z"
        fill={paint('front')}
        stroke="#cda7f7"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m57 58 13-25h40l13 25h-21l-5 9H83l-5-9Z"
        fill="#38255e"
        stroke={paint('rim')}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M52 60h25l6 10h15l6-10h24v30q0 7-7 7H59q-7 0-7-7Z"
        fill={paint('front')}
        stroke={paint('rim')}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M58 67v21q0 3 3 3h17m27 0h15"
        stroke="#edceff"
        strokeOpacity=".55"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M59 61h16m31 0h14" stroke="#f2dfff" strokeWidth="2.5" strokeLinecap="round" />
      {filtered ? (
        <g strokeLinecap="round">
          <path d="m130 47 12 13" stroke="#b69eee" strokeWidth="6" />
          <circle cx="119" cy="35" r="16" fill="#263b55" stroke="#8cddda" strokeWidth="3" />
          <path d="M111 32q3-5 8-5" stroke="#c4f6ff" strokeWidth="2" />
        </g>
      ) : (
        <g stroke={paint('rim')} strokeWidth="4" strokeLinecap="round">
          <path d="m126 23 7-10m3 22 11-3m-33-14 1-11" />
        </g>
      )}
    </svg>
  )
}
