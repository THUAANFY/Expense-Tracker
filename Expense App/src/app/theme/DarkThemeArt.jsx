import { useId } from 'react'

// Glossy finance illustrations for the Midnight theme.
export default function DarkThemeArt({
  variant = 'journal',
  className = '',
  size,
  tone = 'lilac',
}) {
  const id = useId().replaceAll(':', '')
  const face = `url(#${id}-face)`
  const silver = `url(#${id}-silver)`
  const tones = {
    lilac: ['#c8aaff', '#8957df', '#392564'],
    mint: ['#a6f1d5', '#48b695', '#194d49'],
    peach: ['#ffb5d0', '#d55f93', '#692d54'],
    butter: ['#afd7ff', '#568fdf', '#263e75'],
  }
  const toneKey = ['bag', 'gift', 'basket', 'tech'].includes(variant)
    ? tone
    : ['cash', 'income', 'savings'].includes(variant)
      ? 'mint'
      : ['bank', 'balance', 'cloud'].includes(variant)
        ? 'butter'
        : variant === 'expense'
          ? 'peach'
          : 'lilac'
  const palette = tones[toneKey] || tones.lilac
  const edge = palette[0]
  const seam = '#9b86d0'
  const coin = (x, y, r = 16) => (
    <g transform={`translate(${x} ${y}) scale(${r / 16})`}>
      <circle r="16" fill={silver} stroke="#cbd0ea" strokeWidth=".8" />
      <circle r="12.5" stroke="#7e85a8" strokeWidth=".8" strokeDasharray=".7 2" />
      <path d="M3-8V8M2-2C-7-7-8 10 2 5M0-6H6" stroke="#6b4da3" strokeWidth="1.5" />
      <path d="M-10-6a12 12 0 0 1 10-6" stroke="#f0f2ff" strokeWidth="1.2" opacity=".65" />
    </g>
  )
  const journal = (
    <>
      <path d="M31 54q24-7 48 3 25-10 49-3l3 46q-26-5-51 4-25-9-52-4Z" fill={face} stroke={edge} />
      <path
        d="M35 49q23-5 44 5 24-10 45-5l3 45q-25-4-47 5-23-9-48-5Z"
        fill="#5a4787"
        stroke="#ccbcff"
      />
      <path
        d="M79 55v43M39 60q16-2 31 4m-31 6q16-2 31 4m-30 6q13-1 24 3m26-19q13-4 27-4m-27 14q13-4 27-4m-26 14q12-4 23-4"
        stroke="#b9a9ee"
        strokeWidth="1.15"
      />
      <path d="M94 50v22l5-4 5 2V48" fill={silver} stroke="#9784d6" />
      <path d="M36 99q23-3 44 5 23-8 46-5" stroke="#e7deff" opacity=".5" />
      <g transform="rotate(34 122 82)">
        <rect x="119" y="48" width="6" height="53" rx="2.5" fill={silver} stroke="#d0c6f1" />
        <path d="m119 100 3 9 3-9m-5-46h4m-1 4v35" stroke="#7464b0" />
      </g>
    </>
  )
  let drawing
  if (['wallet', 'cash', 'balance', 'income'].includes(variant)) {
    drawing = (
      <>
        <g transform="rotate(-12 76 43)">
          <rect x="38" y="20" width="74" height="46" rx="6" fill="#48426d" stroke={edge} />
          <rect
            x="44"
            y="26"
            width="62"
            height="34"
            rx="3"
            stroke="#929cbe"
            strokeDasharray="2 3"
          />
          <ellipse cx="75" cy="43" rx="10" ry="13" fill={face} stroke="#929cbe" />
          <path d="M72 39h6m-6 5h6m-3-10v18" stroke="#bdc6e4" />
        </g>
        <rect x="26" y="44" width="107" height="57" rx="13" fill={face} stroke={edge} />
        <path d="M33 55v30q0 8 8 8h77" stroke="#a392dd" strokeDasharray="1 3" />
        <path d="M120 62h17v24h-17a12 12 0 0 1 0-24Z" fill="#454d65" stroke="#a5afce" />
        <circle cx="123" cy="74" r="3" fill={silver} />
        <path d="M44 66h22m-22 6h13" stroke="#9da8cb" />
        {coin(83, 73, 15)}
        {variant === 'income' && (
          <path d="M109 14v21m-7-7 7 7 7-7" stroke="#aad3c8" strokeWidth="2.5" />
        )}
      </>
    )
  } else if (variant === 'bank') {
    drawing = (
      <g transform="rotate(-8 80 65)">
        <rect x="25" y="31" width="111" height="71" rx="12" fill={face} stroke={edge} />
        <path d="M35 42h91M35 89h39m-39 5h20" stroke="#a392dd" />
        <rect x="39" y="54" width="22" height="17" rx="4" fill={silver} stroke="#aab5d5" />
        <path d="M46 55v15m8-15v15m-14-7h20m11-9q9 6 0 12m6-16q15 10 0 20" stroke="#747e9e" />
        <circle cx="111" cy="85" r="9" stroke="#b3bdd9" />
        <circle cx="119" cy="85" r="9" fill="#8b91b6" fillOpacity=".35" stroke="#9aa5c7" />
        <path d="m102 27 8-5 8 5m-14 3v7m6-7v7m6-7v7m-15 3h18" stroke="#c7cbea" strokeWidth="1.3" />
      </g>
    )
  } else if (variant === 'ewallet') {
    drawing = (
      <>
        <rect x="48" y="12" width="58" height="98" rx="13" fill={face} stroke={edge} />
        <rect x="54" y="21" width="46" height="75" rx="7" fill="#30384c" stroke="#7785a7" />
        <path d="M69 17h16m-11 86h8" stroke="#bdc4df" strokeWidth="2" />
        <circle cx="77" cy="51" r="17" fill={face} stroke="#8f9bbb" />
        <path d="m68 50 7 7 13-14" stroke="#b5b0ed" strokeWidth="2.5" />
        <path d="M62 80h29m-29 6h18" stroke="#7785a7" />
        {coin(111, 88, 18)}
      </>
    )
  } else if (variant === 'gift') {
    drawing = (
      <>
        <path
          d="M55 45c-20-1-26-18-12-22 11-3 27 17 37 21-9-17-2-29 9-25 11 4 3 19-9 25m0 0c17-19 33-21 35-10 3 11-18 14-35 10Z"
          fill={silver}
          stroke={edge}
        />
        <rect x="38" y="47" width="85" height="60" rx="9" fill={face} stroke={edge} />
        <rect x="32" y="42" width="97" height="17" rx="6" fill={face} stroke="#bbc2dc" />
        <path d="M72 43v64h16V43" fill={silver} stroke="#9ba5c6" />
        <path d="M44 65v31q0 5 5 5h16m27 0h22" stroke="#9ba5c6" />
        <path d="m99 68 7 2 4 9-7 4-6-12Z" fill={silver} stroke={edge} />
        <circle cx="103" cy="73" r="1" fill="#616d8c" />
      </>
    )
  } else if (variant === 'basket') {
    drawing = (
      <>
        <path d="M47 55q-1-34 33-34t33 34" stroke="#9faaca" strokeWidth="5" />
        <path d="M47 55q-1-34 33-34t33 34" stroke="#d4d9ed" strokeWidth="1.2" />
        <path d="m29 51 10 46q2 11 13 11h56q11 0 13-11l10-46Z" fill={face} stroke={edge} />
        <rect x="26" y="47" width="108" height="11" rx="5.5" fill={silver} stroke={edge} />
        <path
          d="m42 64 7 35m8-35 4 35m18-35v35m22-35-4 35m21-35-7 35M39 76h83m-80 12h77m-74 12h70"
          stroke="#99a7c6"
          opacity=".7"
        />
        <rect x="65" y="66" width="30" height="22" rx="5" fill="#4a566f" stroke="#b2bfdc" />
        <path d="m71 77 9-7 9 7m-15-2v9h12v-9" stroke="#c7ceea" />
      </>
    )
  } else if (variant === 'tech') {
    drawing = (
      <>
        <path d="M56 37v-9q0-6 6-6h36q6 0 6 6v9" stroke="#b6bfdc" strokeWidth="4" />
        <rect x="26" y="36" width="108" height="66" rx="13" fill={face} stroke={edge} />
        <path d="M31 58h98M39 87h16m-16 6h23m57-49h6" stroke="#94a1c3" />
        <rect x="57" y="56" width="47" height="31" rx="4" fill="#162039" stroke="#a7b6d8" />
        <path d="m66 68 6-5-6-5m28 10-6 5 6 5m-12-19-5 19M53 90h55" stroke="#b6b6ed" />
        <circle cx="116" cy="87" r="6" fill={silver} stroke={edge} />
        <path d="M116 83v8m-4-4h8" stroke="#717d9e" />
      </>
    )
  } else if (variant === 'bag' || variant === 'expense') {
    drawing = (
      <>
        <path d="M61 34V23q0-8 8-8h23q8 0 8 8v11" stroke="#acb5d2" strokeWidth="4" />
        <path d="M64 34V23q0-5 5-5h23q5 0 5 5v11" stroke="#5e6989" />
        <rect x="44" y="100" width="10" height="10" rx="3" fill="#7c86a8" />
        <rect x="106" y="100" width="10" height="10" rx="3" fill="#7c86a8" />
        <rect x="31" y="33" width="98" height="72" rx="15" fill={face} stroke={edge} />
        <rect x="39" y="41" width="82" height="56" rx="10" stroke="#7d88ab" />
        <path d="M50 43v52m59-52v52M35 52h8m74 0h8m-90 33h8m74 0h8" stroke="#97a1c2" />
        <rect x="62" y="54" width="36" height="28" rx="5" fill="#444b64" stroke="#9ca7c9" />
        <path d="m68 73 9-9 6 5 6-7 5 11H68Z" fill="#8795b7" />
        <circle cx="71" cy="61" r="2.2" fill="#c5c8ef" />
        <path d="M73 88h14" stroke="#a8b0cf" strokeWidth="2" />
      </>
    )
  } else if (variant === 'savings') {
    drawing = (
      <>
        <path
          d="M79 36V16m0 11c-17 1-22-7-20-15 12-1 20 5 20 15Zm1-8c0-12 9-17 19-16 0 11-7 17-19 16Z"
          fill="#6f91a0"
          stroke="#a6c1c9"
        />
        <rect x="61" y="34" width="38" height="8" rx="4" fill={silver} stroke={edge} />
        <path
          d="M65 42v9c-15 12-19 30-17 45q1 10 12 10h40q11 0 12-10c2-15-2-33-17-45v-9Z"
          fill={face}
          stroke={edge}
        />
        <path d="M56 93q-2-23 13-37m-9 42h40" stroke="#929fbe" />
        {coin(80, 78, 18)}
        <path d="M71 40h19" stroke="#eef0ff" opacity=".4" />
      </>
    )
  } else if (variant === 'workspace') {
    drawing = (
      <>
        <circle cx="80" cy="60" r="49" fill="#8b5cf6" opacity=".09" />
        <path d="M135 15a10 10 0 0 0 10 14 13 13 0 1 1-10-14Z" fill="#adccff" stroke="#d7e6ff" />
        <path
          d="M54 71c-15 0-19-15-8-23-2-15 16-25 27-14 15-10 34 1 31 17 17 1 22 22 5 25Z"
          fill="#eee5ff"
          stroke="#bcb0ec"
        />
        <path d="M49 48q0-10 10-12m9-3q8-5 15 1" stroke="#fff" strokeWidth="2" />
        <circle cx="70" cy="53" r="1.5" fill="#6b4ea5" />
        <circle cx="85" cy="53" r="1.5" fill="#6b4ea5" />
        <path d="m75 58 2 2 2-2m-2 2v2m-5 0q5 5 10 0" stroke="#8e6cbb" />
        <ellipse cx="65" cy="59" rx="4" ry="2" fill="#cda7e6" />
        <ellipse cx="91" cy="59" rx="4" ry="2" fill="#cda7e6" />
        <path d="M47 95c-10-1-16-11-7-15l17 5" fill="#e9dfff" stroke="#b3a1df" />
        <g transform="rotate(-5 94 81)">
          <rect x="70" y="61" width="60" height="40" rx="6" fill={face} stroke="#c0a3f7" />
          <rect x="74" y="65" width="52" height="32" rx="3.5" stroke="#c2a9f5" strokeOpacity=".4" />
          <path d="M64 101h73l-5 5H69Z" fill="#9a80d8" stroke="#c0a3f7" />
          <path d="m94 79 4-3 4 3-4 4Z" fill="#eee3ff" />
          <path d="M93 103h14" stroke="#e0d1ff" />
        </g>
        <path
          d="M26 96V71m0 13c-12 0-16-8-14-15 9 0 14 6 14 15Zm1-10c0-12 7-18 15-18 1 10-5 17-15 18Z"
          fill="#64c7a8"
          stroke="#a5e8cf"
        />
        <path d="m18 92 2 16h15l3-16Z" fill="#39446d" stroke="#7d94cf" />
        <path d="M16 91h24v5H16Z" fill="#6876ab" stroke="#a0b3e1" />
        <path d="M13 109h135" stroke="#70649e" />
        <path
          d="m38 25 1.5 4.5L44 31l-4.5 1.5L38 37l-1.5-4.5L32 31l4.5-1.5ZM117 43l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"
          fill="#d9b9ff"
        />
        <circle cx="49" cy="18" r="1.3" fill="#9476dc" />
      </>
    )
  } else if (variant === 'cloud') {
    drawing = (
      <>
        <circle cx="80" cy="57" r="40" fill="#303442" stroke="#535d79" />
        <path d="M88 20a23 23 0 0 0 28 30A28 28 0 1 1 88 20Z" fill={silver} stroke="#bfc8e8" />
        <path
          d="M39 94c-12 0-17-7-17-15 0-10 7-16 16-17 3-14 14-21 27-19 11 1 17 7 20 15 15-4 26 4 27 15 13 1 17 19 4 21Z"
          fill={face}
          stroke={edge}
        />
        <path d="M39 85h56m-32-7h39" stroke="#808caf" />
        <path d="m37 32 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill={silver} />
        <circle cx="128" cy="65" r="2" fill="#b5b0ed" />
      </>
    )
  } else if (variant === 'flower') {
    drawing = (
      <>
        <path
          d="M80 64v42m0-14c-17 0-24-9-23-18 14 0 23 6 23 18Zm1-10c0-15 9-22 22-22-1 14-10 22-22 22Z"
          fill="#587384"
          stroke="#94adbd"
        />
        <g fill={silver} stroke="#a1accb">
          <ellipse cx="80" cy="38" rx="12" ry="25" />
          <ellipse cx="80" cy="38" rx="12" ry="25" transform="rotate(60 80 45)" />
          <ellipse cx="80" cy="38" rx="12" ry="25" transform="rotate(120 80 45)" />
          <ellipse cx="80" cy="38" rx="12" ry="25" transform="rotate(180 80 45)" />
          <ellipse cx="80" cy="38" rx="12" ry="25" transform="rotate(240 80 45)" />
          <ellipse cx="80" cy="38" rx="12" ry="25" transform="rotate(300 80 45)" />
        </g>
        <circle cx="80" cy="45" r="14" fill={face} stroke="#bac2de" />
        <circle cx="80" cy="45" r="8" stroke="#99a3c6" strokeDasharray="1 2" />
      </>
    )
  } else if (variant === 'unassigned') {
    drawing = (
      <>
        <path d="M51 16h43l20 20v69H45V22q0-6 6-6Z" fill={face} stroke={edge} />
        <path d="M94 16v20h20M57 84h44m-44 8h28" stroke="#94a0c3" />
        <circle cx="79" cy="58" r="18" fill="#333c53" stroke="#949fc7" />
        <path d="M74 52c0-8 13-8 13 0 0 6-8 5-8 11m0 6h.1" stroke="#c1bafa" strokeWidth="2" />
      </>
    )
  } else {
    drawing = (
      <>
        {variant === 'desk' && (
          <path d="M42 56V28q0-12 12-12h52q12 0 12 12v28M80 17v30m-37-8h74" stroke="#64708f" />
        )}
        <path
          d="M58 46c-10-1-12-12-4-17 0-10 10-16 18-12 8-8 24-1 23 9 11-2 18 10 11 17-2 3-4 3-9 3Z"
          fill={face}
          stroke="#97a3c5"
        />
        <path d="M69 35h.1m17 0h.1m-13 6h9" stroke="#b9c2dc" strokeWidth="1.8" />
        {journal}
      </>
    )
  }
  return (
    <svg
      className={`dark-theme-art ${className}`}
      width={size}
      height={size}
      viewBox="0 0 160 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-theme-art={variant}
    >
      <defs>
        <linearGradient
          id={`${id}-face`}
          x1="35"
          y1="20"
          x2="122"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette[0]} />
          <stop offset=".45" stopColor={palette[1]} />
          <stop offset="1" stopColor={palette[2]} />
        </linearGradient>
        <linearGradient id={`${id}-silver`} x1=".15" y1="0" x2=".9" y2="1">
          <stop stopColor="#f4eeff" />
          <stop offset=".45" stopColor="#c6b1ff" />
          <stop offset="1" stopColor="#8770ca" />
        </linearGradient>
        <filter
          id={`${id}-relief`}
          x="-30%"
          y="-30%"
          width="170%"
          height="175%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="3" dy="4" stdDeviation="2.4" floodColor="#040815" floodOpacity=".6" />
          <feDropShadow dx="-1" dy="-1" stdDeviation=".6" floodColor="#c6d0ee" floodOpacity=".18" />
        </filter>
      </defs>
      <ellipse cx="80" cy="108" rx="58" ry="3" fill="#030713" opacity=".45" />
      <g
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-relief)`}
      >
        {drawing}
      </g>
      <path d="m139 29 1.2 3.8L144 34l-3.8 1.2L139 39l-1.2-3.8L134 34l3.8-1.2Z" stroke={seam} />
    </svg>
  )
}
