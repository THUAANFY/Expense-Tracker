import { useId } from 'react'

export default function SourceTransferArt({ dark = true, className = '' }) {
  const id = `source-transfer-${useId().replaceAll(':', '')}`
  const paint = (name) => `url(#${id}-${name})`
  const purple = dark ? '#b4a0f8' : '#ab8acb'
  const blue = dark ? '#9bc9ff' : '#9cb7d9'
  return (
    <svg
      className={className}
      viewBox="0 0 160 128"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-source-transfer-art="true"
    >
      <defs>
        <linearGradient
          id={`${id}-wallet`}
          x1="17"
          y1="49"
          x2="66"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#bd9cff' : '#edddfa'} />
          <stop offset=".47" stopColor={dark ? '#9266dd' : '#d2b9e8'} />
          <stop offset="1" stopColor={dark ? '#57408e' : '#b89ace'} />
        </linearGradient>
        <linearGradient
          id={`${id}-bank`}
          x1="93"
          y1="46"
          x2="145"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#74b8f8' : '#e1effb'} />
          <stop offset=".46" stopColor={dark ? '#477bce' : '#bad2ec'} />
          <stop offset="1" stopColor={dark ? '#2e468d' : '#9bb8d9'} />
        </linearGradient>
        <linearGradient
          id={`${id}-in`}
          x1="43"
          y1="35"
          x2="119"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#5ab8ce' : '#a6cfcd'} />
          <stop offset="1" stopColor={dark ? '#98f0cc' : '#9bcbb2'} />
        </linearGradient>
        <linearGradient
          id={`${id}-out`}
          x1="47"
          y1="110"
          x2="120"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={dark ? '#bb9cf4' : '#c6acde'} />
          <stop offset="1" stopColor={dark ? '#718ee5' : '#b1c4e6'} />
        </linearGradient>
        <radialGradient id={`${id}-coin`} cx=".3" cy=".2" r=".9">
          <stop stopColor={dark ? '#e0fff3' : '#f4fbef'} />
          <stop offset=".55" stopColor={dark ? '#93dfc3' : '#d5ead6'} />
          <stop offset="1" stopColor={dark ? '#4d9f94' : '#adcbb5'} />
        </radialGradient>
        <radialGradient id={`${id}-ground`}>
          <stop stopColor={dark ? '#03091c' : '#aaa3bc'} stopOpacity={dark ? '.45' : '.2'} />
          <stop offset="1" stopColor={dark ? '#03091c' : '#aaa3bc'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="111" rx="65" ry="8" fill={paint('ground')} />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 35c17-22 52-23 72-2" stroke={paint('in')} strokeWidth="5.5" />
        <path d="M106 33l13 3-3-13Z" fill={paint('in')} />
        <path
          d="M49 30c16-15 41-18 59-4"
          stroke={dark ? '#d9fff4' : '#f4fff7'}
          strokeWidth="1"
          strokeOpacity=".65"
        />
        <path d="M119 103c-18 18-52 20-70 4" stroke={paint('out')} strokeWidth="5.5" />
        <path d="m49 117-3-14 14 4Z" fill={paint('out')} />
        <path
          d="M115 106c-16 12-38 15-55 6"
          stroke={dark ? '#e7dcff' : '#faf2ff'}
          strokeWidth="1"
          strokeOpacity=".65"
        />

        <g transform="rotate(-7 41 65)">
          <rect
            x="23"
            y="36"
            width="35"
            height="28"
            rx="5"
            fill={dark ? '#596c92' : '#dde8e9'}
            stroke={dark ? '#a0bdcf' : '#a8bec0'}
            strokeWidth="1"
          />
          <path
            d="M28 41h25v17H28Z"
            stroke={dark ? '#b8cbe3' : '#bfd2cf'}
            strokeWidth=".8"
            strokeDasharray="1.5 2"
          />
          <ellipse cx="40.5" cy="49.5" rx="4" ry="5.5" fill={dark ? '#b9d7dd' : '#f6faf1'} />
        </g>
        <rect
          x="14"
          y="50"
          width="56"
          height="44"
          rx="11"
          fill={paint('wallet')}
          stroke={purple}
          strokeWidth="1.3"
        />
        <path
          d="M20 57v24q0 6 6 6h32"
          stroke={dark ? '#d4b9f8' : '#f4e7ff'}
          strokeWidth="1"
          strokeDasharray="1 2.5"
        />
        <path
          d="M22 53h35q7 0 9 5"
          stroke={dark ? '#f3e1ff' : '#fff'}
          strokeOpacity=".6"
          strokeWidth="1.2"
        />
        <path
          d="M59 64h12v16H59a8 8 0 0 1 0-16Z"
          fill={dark ? '#634b9a' : '#d6c0e8'}
          stroke={purple}
          strokeWidth="1.1"
        />
        <circle
          cx="61"
          cy="72"
          r="2.5"
          fill={dark ? '#ebe2ff' : '#fff8ff'}
          stroke={dark ? '#a496cc' : '#b89dcd'}
          strokeWidth=".8"
        />
        <path d="M25 69h17m-17 6h11" stroke={dark ? '#dec9ff' : '#b496c8'} strokeWidth="1.4" />
        <path d="M19 84q1 6 7 6h26" stroke={dark ? '#7a58af' : '#b697cf'} strokeWidth=".9" />

        <rect
          x="91"
          y="46"
          width="55"
          height="51"
          rx="12"
          fill={paint('bank')}
          stroke={blue}
          strokeWidth="1.3"
        />
        <path
          d="M98 49h33q9 0 11 8"
          stroke={dark ? '#d6ecff' : '#fff'}
          strokeOpacity=".65"
          strokeWidth="1.2"
        />
        <path
          d="m102 64 16-10 16 10Z"
          fill={dark ? '#d7ebff' : '#f9fcff'}
          stroke={dark ? '#c4ddfb' : '#a3bddd'}
          strokeWidth=".8"
        />
        <path d="M104 68h28" stroke={dark ? '#aed3fc' : '#adc5e2'} strokeWidth="1.4" />
        <path
          d="M107 70v12m11-12v12m11-12v12"
          stroke={dark ? '#cce4ff' : '#f4f9ff'}
          strokeWidth="3.5"
        />
        <path d="M103 85h30m-31 4h32" stroke={dark ? '#d3e7ff' : '#eef7ff'} strokeWidth="2.4" />
        <path
          d="M95 69v17q0 7 8 7h27"
          stroke={dark ? '#87b3ed' : '#c7dff1'}
          strokeWidth=".8"
          strokeOpacity=".65"
        />

        <circle
          cx="80"
          cy="71"
          r="10"
          fill={paint('coin')}
          stroke={dark ? '#bce9d3' : '#b1ceb7'}
          strokeWidth="1"
        />
        <circle cx="80" cy="71" r="7.5" stroke={dark ? '#6cb9a4' : '#bed6be'} strokeWidth=".7" />
        <path d="M76.5 69h7m-7 4h7" stroke={dark ? '#3a8077' : '#7d9f86'} strokeWidth="1.5" />
        <path d="M74 66q2-3 5-3" stroke={dark ? '#f0fff7' : '#fff'} strokeWidth="1.1" />
        <circle
          cx="140"
          cy="93"
          r="6.5"
          fill={paint('coin')}
          stroke={dark ? '#b7e6d2' : '#adccb5'}
        />
        <path d="m137 93 2 2 4-4" stroke={dark ? '#397d70' : '#7b9c81'} strokeWidth="1.3" />
        <path
          d="m17 23 1.2 3.8L22 28l-3.8 1.2L17 33l-1.2-3.8L12 28l3.8-1.2Z"
          fill={dark ? '#b6a0ed' : '#d5c2e6'}
        />
        <circle cx="141" cy="32" r="2" fill={dark ? '#87b5e3' : '#b4cfe5'} />
      </g>
    </svg>
  )
}
