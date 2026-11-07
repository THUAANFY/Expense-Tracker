import { useId } from 'react'

// A dedicated gift for the collection, with static vector reflections and foil details.
export default function BagsEmptyArt() {
  const id = `bags-gift-${useId().replaceAll(':', '')}`
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="bags-empty-art"
      viewBox="0 0 240 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#9958ff" stopOpacity=".35" />
          <stop offset="1" stopColor="#9958ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-stage`} cx=".5" cy=".4" r=".6">
          <stop stopColor="#a45fff" stopOpacity=".6" />
          <stop offset=".7" stopColor="#672ed1" stopOpacity=".5" />
          <stop offset="1" stopColor="#8f57ea" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${id}-front`}
          x1="70"
          y1="65"
          x2="173"
          y2="145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#759bff" />
          <stop offset=".25" stopColor="#8f64e8" />
          <stop offset=".7" stopColor="#633eab" />
          <stop offset="1" stopColor="#3e2c75" />
        </linearGradient>
        <linearGradient
          id={`${id}-side`}
          x1="166"
          y1="72"
          x2="189"
          y2="135"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9b65dd" />
          <stop offset="1" stopColor="#453071" />
        </linearGradient>
        <linearGradient
          id={`${id}-lid`}
          x1="60"
          y1="51"
          x2="186"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a8d4ff" />
          <stop offset=".35" stopColor="#ad88fa" />
          <stop offset="1" stopColor="#9050d7" />
        </linearGradient>
        <linearGradient
          id={`${id}-ribbon`}
          x1="114"
          y1="54"
          x2="135"
          y2="143"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f4dcff" />
          <stop offset=".45" stopColor="#d4a4fa" />
          <stop offset="1" stopColor="#a781e5" />
        </linearGradient>
        <linearGradient
          id={`${id}-bow`}
          x1="83"
          y1="23"
          x2="162"
          y2="57"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f5dbff" />
          <stop offset=".5" stopColor="#c9a0f3" />
          <stop offset="1" stopColor="#af71e8" />
        </linearGradient>
        <linearGradient
          id={`${id}-tag`}
          x1="155"
          y1="89"
          x2="178"
          y2="118"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f0cdff" />
          <stop offset="1" stopColor="#b27de4" />
        </linearGradient>
        <linearGradient
          id={`${id}-reflection`}
          x1="78"
          y1="74"
          x2="132"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d5eaff" stopOpacity=".4" />
          <stop offset="1" stopColor="#d5eaff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="122" cy="92" r="83" fill={paint('halo')} />
      <ellipse cx="122" cy="151" rx="89" ry="15" fill={paint('stage')} />
      <path d="M34 150c21 17 150 20 177 0" stroke="#b477ff" strokeOpacity=".7" />
      <ellipse cx="122" cy="148" rx="57" ry="5" fill="#1b153e" fillOpacity=".55" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M126 54c-11-22-27-35-39-28-19 13 9 33 39 28Z"
          fill={paint('bow')}
          stroke="#e4c3ff"
        />
        <path d="M119 49c-13-16-24-23-29-18-5 6 9 14 29 18Z" fill="#674399" />
        <path
          d="M127 54c10-23 25-35 37-27 17 13-7 32-37 27Z"
          fill={paint('bow')}
          stroke="#e4c3ff"
        />
        <path d="M133 49c12-16 23-23 28-17 3 6-9 12-28 17Z" fill="#7045a3" />
        <path
          d="M88 27c-5 2-7 6-6 9m76-9c4 0 7 2 9 5"
          stroke="#fff0ff"
          strokeOpacity=".75"
          strokeWidth="1.7"
        />
        <path d="m171 70 14-5v66c0 6-4 10-11 12l-14 1Z" fill={paint('side')} stroke="#b294e7" />
        <rect
          x="70"
          y="65"
          width="104"
          height="80"
          rx="11"
          fill={paint('front')}
          stroke="#ccb0ff"
          strokeWidth="1.6"
        />
        <path d="M78 73h87v60c0 3-2 5-5 5H83c-3 0-5-2-5-5Z" stroke="#d9d0ff" strokeOpacity=".32" />
        <path d="M73 76v57c0 5 3 8 8 8h17" stroke="#9fd4ff" strokeOpacity=".9" strokeWidth="2" />
        <path d="M80 76h28v58H80Z" fill={paint('reflection')} />
        <path d="M175 79v46" stroke="#c090f3" strokeOpacity=".6" />
        <path d="m64 56 11-5h108c5 0 7 3 7 7v7l-10 7Z" fill="#ba8af1" stroke="#c4a7fa" />
        <rect
          x="61"
          y="55"
          width="121"
          height="20"
          rx="6"
          fill={paint('lid')}
          stroke="#e5caff"
          strokeWidth="1.4"
        />
        <path d="M67 58h107" stroke="#e8edff" strokeOpacity=".7" strokeWidth="1.6" />
        <path d="M69 77h103" stroke="#392963" strokeOpacity=".5" strokeWidth="3" />
        <rect x="115" y="55" width="20" height="90" fill={paint('ribbon')} />
        <path d="M118 57v84m16-83v82" stroke="#f6e2ff" strokeOpacity=".55" />
        <rect
          x="114"
          y="48"
          width="23"
          height="12"
          rx="5"
          fill={paint('ribbon')}
          stroke="#efd6ff"
        />
        <path d="M137 67c19-3 30 7 29 22" stroke="#ddbcff" strokeWidth="1.5" />
        <g transform="rotate(-17 168 104)">
          <path d="m159 94 8-8 12 8v25h-20Z" fill={paint('tag')} stroke="#f0d6ff" />
          <circle cx="167" cy="94" r="2" fill="#7850a9" stroke="#f8e6ff" strokeWidth=".6" />
          <path
            d="m168 101 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5Z"
            fill="#f7e4ff"
          />
          <path d="M164 115h9" stroke="#ecd6ff" strokeOpacity=".6" />
        </g>
        <path d="m36 80 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z" fill="#e9dcff" />
        <path d="m204 107 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z" fill="#e5d0ff" />
        <circle cx="57" cy="117" r="3" fill="#a481ed" stroke="#d6bcff" />
        <circle cx="192" cy="49" r="2" fill="#b6d4ff" />
        <circle cx="45" cy="61" r="1.5" fill="#b993ee" />
      </g>
    </svg>
  )
}
