// Separate budget illustrations: a monitoring dial and a protected envelope.
// All highlights are vector gradients, without filters or continuous animation.
export default function BudgetFilterEmptyArt({ over, id }) {
  const paint = (name) => `url(#${id}-${name})`
  return (
    <svg
      className="category-empty-art category-empty-fintech-art"
      viewBox="0 0 240 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-budget-empty-art={over ? 'protected-envelope' : 'budget-monitor'}
    >
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor={over ? '#41d7c5' : '#8a68ed'} stopOpacity=".22" />
          <stop offset="1" stopColor={over ? '#41d7c5' : '#8a68ed'} stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${id}-platform`}
          x1="43"
          y1="145"
          x2="198"
          y2="162"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6251a9" stopOpacity=".05" />
          <stop offset=".5" stopColor={over ? '#4ab7b4' : '#9b78ec'} stopOpacity=".35" />
          <stop offset="1" stopColor="#6251a9" stopOpacity=".05" />
        </linearGradient>
        <linearGradient
          id={`${id}-paper`}
          x1="65"
          y1="26"
          x2="143"
          y2="136"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dde0ff" />
          <stop offset=".16" stopColor="#b2a2f4" />
          <stop offset="1" stopColor="#6552ad" />
        </linearGradient>
        <linearGradient
          id={`${id}-pocket`}
          x1="48"
          y1="94"
          x2="166"
          y2="151"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6751ac" />
          <stop offset=".45" stopColor="#3a386f" />
          <stop offset="1" stopColor="#252c52" />
        </linearGradient>
        <linearGradient
          id={`${id}-rim`}
          x1="118"
          y1="35"
          x2="192"
          y2="114"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={over ? '#c4fff0' : '#e7dbff'} />
          <stop offset=".35" stopColor={over ? '#65dcca' : '#a894ef'} />
          <stop offset="1" stopColor={over ? '#318b99' : '#4d60ac'} />
        </linearGradient>
        <linearGradient
          id={`${id}-dial`}
          x1="126"
          y1="35"
          x2="177"
          y2="107"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#383f6c" />
          <stop offset="1" stopColor="#141d34" />
        </linearGradient>
        <linearGradient
          id={`${id}-arc`}
          x1="130"
          y1="73"
          x2="178"
          y2="73"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#68e1d3" />
          <stop offset=".5" stopColor="#7eafff" />
          <stop offset="1" stopColor="#c29bff" />
        </linearGradient>
        <linearGradient
          id={`${id}-shield`}
          x1="130"
          y1="48"
          x2="185"
          y2="132"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#87f1d1" />
          <stop offset=".45" stopColor="#32abac" />
          <stop offset="1" stopColor="#294c77" />
        </linearGradient>
        <linearGradient
          id={`${id}-sheen`}
          x1="59"
          y1="45"
          x2="156"
          y2="118"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity=".33" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="89" r="86" fill={paint('halo')} />
      <ellipse cx="121" cy="155" rx="87" ry="12" fill={paint('platform')} />
      <path
        d="M48 155c25 7 118 10 146-1"
        stroke={over ? '#63c9d3' : '#a896eb'}
        strokeOpacity=".35"
      />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M43 104c-14-31 12-66 47-66m81 3c30 10 43 43 29 70"
          stroke="#827dd0"
          strokeOpacity=".2"
          strokeDasharray="3 7"
        />
        {over ? (
          <>
            <g transform="rotate(9 112 85)">
              <rect x="71" y="28" width="82" height="110" rx="12" fill="#2b3d60" stroke="#6089bf" />
              <path
                d="M81 39h62v87H81z"
                stroke="#a0beef"
                strokeOpacity=".25"
                strokeDasharray="2 4"
              />
            </g>
            <g transform="rotate(-7 95 87)">
              <rect
                x="55"
                y="38"
                width="83"
                height="105"
                rx="11"
                fill={paint('paper')}
                stroke="#d5c5ff"
              />
              <path d="M66 51h29" stroke="#f4ebff" strokeWidth="3" />
              <path d="M66 61h47" stroke="#e0d6ff" strokeOpacity=".6" strokeWidth="2" />
              <rect
                x="66"
                y="74"
                width="49"
                height="28"
                rx="6"
                fill="#493c81"
                fillOpacity=".5"
                stroke="#c6b1f2"
                strokeOpacity=".5"
              />
              <path d="m74 91 8-7 8 4 13-9" stroke="#a7f1e2" strokeWidth="2" />
              <path d="M67 113h43m-43 8h27" stroke="#ded3ff" strokeOpacity=".6" />
            </g>
            <rect
              x="46"
              y="101"
              width="111"
              height="48"
              rx="12"
              fill={paint('pocket')}
              stroke="#ac97e5"
            />
            <path d="m49 106 43 23a13 13 0 0 0 13 0l47-24" stroke="#c8b1f6" />
            <path d="m51 142 21-17m76 17-19-16" stroke="#b8a1ec" strokeOpacity=".5" />
            <path d="M55 110v27c0 3 2 5 5 5h14" stroke="#dac6ff" strokeOpacity=".3" />
            <path
              d="m155 43 37 14v30c0 24-17 40-37 49-20-9-37-25-37-49V57z"
              fill={paint('shield')}
              stroke={paint('rim')}
              strokeWidth="2"
            />
            <path
              d="m155 51 29 11v25c0 18-12 33-29 41-17-8-29-23-29-41V62z"
              stroke="#d3fff0"
              strokeOpacity=".4"
            />
            <path d="m155 44-36 14v28c0 8 2 14 5 20l47-56z" fill={paint('sheen')} />
            <circle
              cx="155"
              cy="85"
              r="22"
              fill="#122e53"
              fillOpacity=".25"
              stroke="#b7ffee"
              strokeOpacity=".3"
            />
            <path d="m143 85 8 8 17-19" stroke="#e0fff6" strokeWidth="5" />
            <path d="M142 115c4 4 9 7 13 9" stroke="#b7ffed" strokeOpacity=".55" strokeWidth="2" />
            <circle cx="77" cy="30" r="5" fill="#9c85f0" stroke="#dcc9ff" />
          </>
        ) : (
          <>
            <g transform="rotate(-9 96 87)">
              <rect
                x="56"
                y="28"
                width="83"
                height="111"
                rx="11"
                fill={paint('paper')}
                stroke="#d8c9ff"
              />
              <path d="M68 40h23" stroke="#f2ebff" strokeWidth="3" />
              <circle cx="125" cy="41" r="3" fill="#e5dbff" />
              <path d="M68 53h47" stroke="#f1e8ff" strokeOpacity=".6" strokeWidth="2" />
              <rect
                x="67"
                y="65"
                width="51"
                height="17"
                rx="5"
                fill="#61509a"
                stroke="#c7b4ed"
                strokeOpacity=".65"
              />
              <path d="M73 73h17" stroke="#d6fff5" strokeWidth="3" />
              <path d="M68 95h43m-43 10h29m-29 10h35" stroke="#ded2ff" strokeOpacity=".65" />
            </g>
            <rect
              x="45"
              y="99"
              width="113"
              height="50"
              rx="12"
              fill={paint('pocket')}
              stroke="#b29cea"
            />
            <path d="m48 104 44 25a14 14 0 0 0 14 0l48-26" stroke="#d0bafa" />
            <path d="m50 143 22-18m79 18-22-18" stroke="#aa92db" strokeOpacity=".6" />
            <path d="M53 111v25c0 3 2 5 5 5h13" stroke="#ead5ff" strokeOpacity=".35" />
            <circle cx="154" cy="72" r="42" fill="#10192d" fillOpacity=".55" />
            <circle
              cx="154"
              cy="69"
              r="40"
              fill={paint('rim')}
              stroke="#d9d5ff"
              strokeWidth="1.2"
            />
            <circle
              cx="154"
              cy="69"
              r="35"
              fill={paint('dial')}
              stroke="#c3b6f9"
              strokeOpacity=".5"
            />
            <path d="M128 76a27 27 0 0 1 52 0" stroke="#505677" strokeWidth="5" />
            <path
              d="M128 76a27 27 0 0 1 52 0"
              stroke={paint('arc')}
              strokeWidth="5"
              strokeDasharray="64 24"
            />
            <path
              d="m129 58 4 2m6-13 3 4m12-8v5m15-1-3 4m13 7-4 2"
              stroke="#d3dcff"
              strokeOpacity=".7"
              strokeWidth="1.5"
            />
            <path d="m154 73-12-13" stroke="#e4f8ff" strokeWidth="3" />
            <circle cx="154" cy="73" r="5" fill="#a8d4ff" stroke="#f3f3ff" />
            <rect x="143" y="84" width="22" height="6" rx="3" fill="#4d6581" />
            <path d="M149 87h10" stroke="#a1f0dc" strokeWidth="2" />
            <path
              d="M125 43c10-12 28-16 42-9"
              stroke="#f3e9ff"
              strokeOpacity=".75"
              strokeWidth="2"
            />
            <g transform="rotate(10 177 119)">
              <rect x="159" y="108" width="36" height="23" rx="8" fill="#284664" stroke="#85cce1" />
              <circle cx="169" cy="119" r="3" fill="#84ead5" />
              <path d="M177 117h10m-10 5h6" stroke="#bbd8fa" strokeWidth="1.5" />
            </g>
          </>
        )}
        <path
          d="m37 67 2-6 2 6 6 2-6 2-2 6-2-6-6-2z"
          fill="#cdb1ff"
          stroke="#e7d6ff"
          strokeWidth=".8"
        />
        <path
          d="m202 41 1.5-5 1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5z"
          fill={over ? '#88e6d5' : '#a3caff'}
        />
        <circle cx="205" cy="112" r="3" stroke="#8ba5da" strokeWidth="1.5" />
        <circle cx="47" cy="135" r="2" fill="#b9a1f2" />
        <circle cx="183" cy="152" r="2" fill={over ? '#7ee1d2' : '#af8bfa'} />
      </g>
    </svg>
  )
}
