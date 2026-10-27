import { useId } from 'react'
import { getBagColor } from '../bags'

const basketShape = 'M46 93q75-15 150 0l-13 48q-3 12-15 12H75q-14 0-18-12Z'

function TravelCase({ palette, front, side }) {
  const { ink, paper, body } = palette
  return (
    <>
      <g transform="rotate(-13 66 55)">
        <path
          d="m44 31 17 5 17-5 17 5v48l-17-5-17 5-17-5Z"
          fill="#f8f8e9"
          stroke="#a8b48b"
          strokeWidth="1.4"
        />
        <path d="M61 36v48m17-53v48" stroke="#cad3b3" strokeWidth="1.1" />
        <path d="m48 66 10-9 10 4 9-12 12 7" stroke="#b4c898" strokeWidth="2" />
        <circle cx="78" cy="48" r="2.7" fill="#e4ad91" stroke="#b9856b" strokeWidth="1" />
      </g>
      <g transform="rotate(12 189 62)">
        <path
          d="M177 29h22v59l-4-2-3 2-4-2-4 2-3-2-4 2Z"
          fill="#fffcf1"
          stroke="#c3ad85"
          strokeWidth="1.2"
        />
        <path d="M182 38h12m-12 5h9m-9 27h12" stroke="#cbb58f" strokeWidth="1.2" />
        <path
          d="m188 49 2 6 5 4-1 2-5-2v6h-2v-7l-5-3 1-2 4 2v-6Z"
          fill={body}
          stroke={ink}
          strokeWidth=".9"
        />
        <path d="M182 76h1m3 0h1m3 0h1m3 0h1" stroke="#b9a078" strokeWidth="1.4" />
      </g>
      <path d="M104 45V23m43 22V23" stroke={ink} strokeWidth="4.8" />
      <path d="M104 45V23m43 22V23" stroke="#fffdf6" strokeWidth="2" />
      <rect
        x="98"
        y="13"
        width="55"
        height="12"
        rx="5"
        fill={paper}
        stroke={ink}
        strokeWidth="1.7"
      />
      <path d="M109 18h32" stroke="#fffdf7" strokeWidth="2" />
      <rect x="74" y="141" width="13" height="19" rx="4.5" fill={ink} />
      <rect x="162" y="141" width="13" height="19" rx="4.5" fill={ink} />
      <path d="M79 152v4m88-4v4" stroke={body} strokeWidth="2" />
      <path d="M175 45h8q14 0 14 14v78q0 15-15 15h-7Z" fill={side} stroke={ink} strokeWidth="1.7" />
      <rect
        x="61"
        y="44"
        width="121"
        height="108"
        rx="14"
        fill={front}
        stroke={ink}
        strokeWidth="1.9"
      />
      <path
        d="M70 65v-7a6 6 0 0 1 6-6h6m78 0h6a7 7 0 0 1 7 7v6M70 131v7a6 6 0 0 0 6 6h6m78 0h6a7 7 0 0 0 7-7v-6"
        stroke={ink}
        strokeWidth="2.1"
        opacity=".48"
      />
      <path d="M83 67v63m77-63v63" stroke={ink} strokeWidth="2.5" opacity=".15" />
      <path d="M175 66v68" stroke={ink} strokeWidth="1.3" strokeDasharray="2 2.5" />
      <rect
        x="171.5"
        y="87"
        width="7"
        height="13"
        rx="2.5"
        fill="#fffdf6"
        stroke={ink}
        strokeWidth="1.1"
      />
      <circle cx="175" cy="96" r="1" fill={ink} />
      <rect x="107" y="50" width="30" height="7" rx="3.5" fill={ink} opacity=".65" />
      <path d="M61 111h121v9H61Z" fill={ink} opacity=".16" />
      <rect
        x="112"
        y="110"
        width="20"
        height="11"
        rx="3"
        fill="#fffaf0"
        stroke={ink}
        strokeWidth="1.2"
      />
      <path d="M117 115.5h10" stroke={ink} strokeWidth="1.3" />
      <g transform="rotate(-8 119 85)">
        <rect
          x="94"
          y="68"
          width="49"
          height="34"
          rx="5"
          fill="#fffdf1"
          stroke="#baa67f"
          strokeWidth="1.2"
        />
        <circle cx="132" cy="77" r="3.7" fill="#f3d887" />
        <path d="m98 95 12-17 10 12 8-9 11 14Z" fill="#bad0a0" stroke="#8da675" strokeWidth="1" />
        <path d="m106 84 4-6 5 6-5-2Z" fill="#fffef8" />
        <path d="M101 98h35" stroke="#d3c29c" strokeWidth="1" />
      </g>
      <path d="M90 141h58" stroke="#fffdf8" strokeWidth="1.5" opacity=".8" />
    </>
  )
}

function GiftTote({ palette, front, side }) {
  const { ink, body } = palette
  return (
    <>
      <path
        d="m68 65-12-30 21 6 11-20 15 17 16-8 13 37Z"
        fill="#fff9e8"
        stroke="#c8b58e"
        strokeWidth="1.3"
      />
      <path
        d="m111 64 7-37 17 9 17-16 11 21 20-8-9 34Z"
        fill="#f6e4ed"
        stroke="#c49db1"
        strokeWidth="1.3"
      />
      <path d="m78 45 9 18m48-26 4 27m22-20-9 20" stroke="#d8bac9" strokeWidth="1.2" opacity=".7" />
      <path d="m175 61 15 8-6 77-7 9-4-20Z" fill={side} stroke={ink} strokeWidth="1.5" />
      <path d="M67 61h108l9 86q1 8-7 8H65q-8 0-7-8Z" fill={front} stroke={ink} strokeWidth="1.9" />
      <path d="M84 67V45c0-32 68-32 68 0v22" stroke={ink} strokeWidth="5" />
      <path d="M84 67V45c0-32 68-32 68 0v22" stroke="#fffdf7" strokeWidth="2.7" />
      <circle cx="84" cy="67" r="2.7" fill={ink} />
      <circle cx="152" cy="67" r="2.7" fill={ink} />
      <path d="m69 70 5 72-12 7m12-7h99l6 7" stroke={ink} strokeWidth="1.1" opacity=".3" />
      <g fill={ink} opacity=".16">
        <circle cx="77" cy="85" r="1.5" />
        <circle cx="96" cy="91" r="1.5" />
        <circle cx="162" cy="85" r="1.5" />
        <circle cx="80" cy="125" r="1.5" />
        <circle cx="98" cy="136" r="1.5" />
        <circle cx="145" cy="133" r="1.5" />
        <circle cx="165" cy="125" r="1.5" />
      </g>
      <path d="M115 62h12v92h-12Z" fill="#eac2d0" stroke="#b78ca0" strokeWidth="1.1" />
      <path d="m63 104-1 10h119l-1-10Z" fill="#eac2d0" stroke="#b78ca0" strokeWidth="1.1" />
      <path d="M119 64v18m0 43v25" stroke="#fff4f5" strokeWidth="2" />
      <path
        d="m116 91-17 24 13-4 3 11 8-30Zm8 0 19 24-13-4-3 11-7-30Z"
        fill="#e3adbf"
        stroke="#b68298"
        strokeWidth="1.2"
      />
      <path
        d="M116 88C91 91 78 82 84 73c6-10 23-3 32 15Zm9 0c25 3 38-6 32-15-6-10-23-3-32 15Z"
        fill="#f3d4df"
        stroke="#b68298"
        strokeWidth="1.4"
      />
      <path d="M90 77c6 0 16 6 21 9m40-9c-6 0-16 6-21 9" stroke="#fff5f6" strokeWidth="1.6" />
      <rect
        x="114"
        y="82"
        width="13"
        height="13"
        rx="5"
        fill="#dfadc0"
        stroke="#b68298"
        strokeWidth="1.3"
      />
      <path d="M156 69c13 3 23 12 25 23" stroke={ink} strokeWidth="1.2" />
      <g transform="rotate(13 182 105)">
        <path
          d="m173 93 9-7 9 7v22a3 3 0 0 1-3 3h-12a3 3 0 0 1-3-3Z"
          fill="#fffaf0"
          stroke={ink}
          strokeWidth="1.2"
        />
        <circle cx="182" cy="93" r="1.5" stroke={ink} strokeWidth="1" />
        <path
          d="M182 104c-5-7-12 0 0 8 12-8 5-15 0-8Z"
          fill="#e8b2bf"
          stroke="#b78596"
          strokeWidth="1"
        />
      </g>
      <path d="M80 148h25m33 0h24" stroke="#fffdf7" strokeWidth="1.5" opacity=".8" />
      <circle cx="194" cy="72" r="2" fill={body} />
    </>
  )
}

function HomeBasket({ palette, front, weaveId }) {
  const { ink, body, paper } = palette
  return (
    <>
      <path d="M62 109C42 9 199 9 180 109" stroke={ink} strokeWidth="6" />
      <path d="M62 109C42 9 199 9 180 109" stroke={body} strokeWidth="3.4" />
      <path d="M67 68q10-10 25-2l20 8v47H63Z" fill="#f8f1e9" stroke="#b8a4bc" strokeWidth="1.3" />
      <path d="M73 68v43m8-45v45m9-41v41m9-38v38" stroke="#d0bdd9" strokeWidth="2.2" />
      <path d="M133 68c22-6 23 23 2 23" stroke="#b8a17c" strokeWidth="4" />
      <path d="M133 68c22-6 23 23 2 23" stroke="#fff8e7" strokeWidth="1.8" />
      <path d="M104 62h31v31q0 9-15 9t-16-9Z" fill="#fff9e9" stroke="#b8a17c" strokeWidth="1.4" />
      <ellipse
        cx="119.5"
        cy="62"
        rx="15.5"
        ry="4"
        fill="#e2c7a5"
        stroke="#b8a17c"
        strokeWidth="1.2"
      />
      <ellipse cx="119.5" cy="62" rx="11.5" ry="2" fill="#bba184" />
      <path d="M159 79V38m0 27-10-15m11 6 13-13" stroke="#839c6d" strokeWidth="1.6" />
      <path
        d="M158 58c-17-1-29-15-23-20 10-3 23 9 23 20Zm3-9c2-17 18-27 24-20 4 10-10 20-24 20Zm0 20c7-14 23-17 25-10-2 9-14 12-25 10Z"
        fill="#bdd3a7"
        stroke="#839c6d"
        strokeWidth="1.3"
      />
      <path d="m141 43 11 10m16-12 11-8m-11 31 11-4" stroke="#dce9c6" strokeWidth="1.2" />
      <path d="m145 75 4 27h26l5-27Z" fill="#e9c6ad" stroke="#b48c70" strokeWidth="1.3" />
      <rect
        x="142"
        y="70"
        width="41"
        height="8"
        rx="3"
        fill="#f2d8c2"
        stroke="#b48c70"
        strokeWidth="1.3"
      />
      <path d={basketShape} fill={front} stroke={ink} strokeWidth="1.9" />
      <g clipPath={'url(#' + weaveId + ')'} stroke={ink} strokeWidth="1.2" opacity=".27">
        <path d="M43 107q78-12 156 0M45 119q76-11 150 0M49 131q73-8 141 0M54 143q69-6 130 0" />
        <path d="m61 92 16 67m5-72 10 72m11-72 4 72m16-73-1 73m19-73-7 73m24-73-12 73m29-71-18 71m33-65-20 65" />
      </g>
      <ellipse cx="121" cy="93" rx="75" ry="11" fill={paper} stroke={ink} strokeWidth="1.6" />
      <path d="M52 95q69 14 138 0" stroke={ink} strokeWidth="1.1" opacity=".4" />
      <path
        d="M65 87q10-3 25 0l-2 45-8-3-8 3-9-3Z"
        fill="#fff9ef"
        stroke="#b8a4bc"
        strokeWidth="1.2"
      />
      <path d="M70 88v39m6-39v38m6-38v39m6-39v38" stroke="#d3c1dd" strokeWidth="1.6" />
      <ellipse cx="134" cy="124" rx="23" ry="13" fill="#fffaf0" stroke={ink} strokeWidth="1.2" />
      <path
        d="M133 132v-14m0 8c-10-1-13-9-8-10 6 0 8 10 8 10Zm1-5c1-9 10-13 12-8 1 5-6 8-12 8Z"
        fill="#c3d6af"
        stroke="#8b9f77"
        strokeWidth="1.1"
      />
      <path d="M81 147q30 3 59 0" stroke="#fffdf4" strokeWidth="1.5" opacity=".65" />
    </>
  )
}

function TechSatchel({ palette, front, side }) {
  const { ink, body, paper } = palette
  return (
    <>
      <path d="M171 77c39-75 62 5 23 57" stroke={ink} strokeWidth="4.4" />
      <path d="M171 77c39-75 62 5 23 57" stroke={body} strokeWidth="2" />
      <path d="M47 69V53c0-31 38-31 38 0v16" stroke={ink} strokeWidth="6" />
      <path d="M47 69V53c0-31 38-31 38 0v16" stroke="#fffdf6" strokeWidth="2.8" />
      <rect
        x="41"
        y="60"
        width="11"
        height="21"
        rx="4.5"
        fill={body}
        stroke={ink}
        strokeWidth="1.5"
      />
      <rect
        x="79"
        y="60"
        width="11"
        height="21"
        rx="4.5"
        fill={body}
        stroke={ink}
        strokeWidth="1.5"
      />
      <g transform="rotate(-7 132 58)">
        <rect
          x="87"
          y="28"
          width="88"
          height="66"
          rx="6"
          fill="#f6f1fb"
          stroke="#9b86b3"
          strokeWidth="1.6"
        />
        <rect x="93" y="35" width="76" height="46" rx="3.5" fill="#d9d7ee" />
        <circle cx="131" cy="31.5" r="1.1" fill="#b29cc2" />
        <path
          d="m103 65 23-22m-13 28 26-25m14 14 6-6"
          stroke="#f9f7ff"
          strokeWidth="3"
          opacity=".85"
        />
        <path d="M84 87h94l-5 8H89Z" fill="#cabbdc" stroke="#9b86b3" strokeWidth="1.2" />
        <path d="M122 87h19" stroke="#f8f5fe" strokeWidth="2" />
      </g>
      <path d="M183 66h5q15 0 15 16v53q0 16-16 16h-4Z" fill={side} stroke={ink} strokeWidth="1.6" />
      <rect
        x="48"
        y="66"
        width="146"
        height="85"
        rx="15"
        fill={front}
        stroke={ink}
        strokeWidth="1.9"
      />
      <path
        d="M49 77q0-12 13-12h118q14 0 14 13l-10 30q-2 8-11 8H70q-9 0-11-8Z"
        fill={paper}
        stroke={ink}
        strokeWidth="1.6"
      />
      <path
        d="m57 79 10 27q1 3 5 3h99q4 0 5-3l10-27"
        stroke={ink}
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity=".45"
      />
      <rect
        x="77"
        y="104"
        width="13"
        height="31"
        rx="3"
        fill={body}
        stroke={ink}
        strokeWidth="1.2"
      />
      <rect
        x="151"
        y="104"
        width="13"
        height="31"
        rx="3"
        fill={body}
        stroke={ink}
        strokeWidth="1.2"
      />
      <rect
        x="74"
        y="114"
        width="19"
        height="14"
        rx="3"
        fill="#fffaf0"
        stroke={ink}
        strokeWidth="1.3"
      />
      <rect
        x="148"
        y="114"
        width="19"
        height="14"
        rx="3"
        fill="#fffaf0"
        stroke={ink}
        strokeWidth="1.3"
      />
      <path d="M79 121h9m65 0h9" stroke={ink} strokeWidth="1.4" />
      <rect
        x="108"
        y="79"
        width="28"
        height="25"
        rx="6"
        fill="#fffdf7"
        stroke={ink}
        strokeWidth="1.2"
      />
      <path d="M122 85v8m-4-6a6.5 6.5 0 1 0 8 0" stroke={ink} strokeWidth="1.6" />
      <rect
        x="101"
        y="130"
        width="39"
        height="13"
        rx="4"
        fill={body}
        stroke={ink}
        strokeWidth="1.1"
      />
      <path d="M106 135h28" stroke={ink} strokeWidth="1" strokeDasharray="1.5 2" />
      <rect
        x="131"
        y="134"
        width="5"
        height="8"
        rx="1.6"
        fill="#fffaf0"
        stroke={ink}
        strokeWidth=".9"
      />
      <path d="M64 143h25m63 0h25" stroke="#fffdf7" strokeWidth="1.5" />
    </>
  )
}

export default function BagArt({ variant = 'trip', color = 'lilac', className = '' }) {
  const id = useId().replaceAll(':', '')
  const palette = getBagColor(color)
  const front = 'url(#' + id + '-front)'
  const side = 'url(#' + id + '-side)'
  const weaveId = id + '-weave'
  const Drawing =
    { trip: TravelCase, gift: GiftTote, home: HomeBasket, tech: TechSatchel }[variant] || TravelCase
  return (
    <svg className={'bag-art ' + className} viewBox="0 0 240 172" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={id + '-front'}
          x1="82"
          y1="58"
          x2="148"
          y2="154"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.paper} />
          <stop offset="1" stopColor={palette.body} />
        </linearGradient>
        <linearGradient
          id={id + '-side'}
          x1="177"
          y1="65"
          x2="203"
          y2="144"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.body} />
          <stop offset="1" stopColor={palette.ink} stopOpacity=".35" />
        </linearGradient>
        <clipPath id={weaveId}>
          <path d={basketShape} />
        </clipPath>
      </defs>
      <ellipse
        cx="122"
        cy="159"
        rx={variant === 'home' || variant === 'tech' ? 83 : 77}
        ry="6"
        fill={palette.ink}
        opacity=".12"
      />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="m32 66 1.8 5.2 5.2 1.8-5.2 1.8L32 80l-1.8-5.2-5.2-1.8 5.2-1.8Z"
          fill="#f6e0a4"
          stroke="#baa06b"
          strokeWidth="1.1"
        />
        <path
          d="m203 23 1.4 4.2 4.2 1.4-4.2 1.4L203 34l-1.4-4.2-4.2-1.4 4.2-1.4Z"
          fill={palette.body}
          stroke={palette.ink}
          strokeWidth="1"
        />
        <path d="m38 124-4 3m164 15 5 2" stroke={palette.ink} strokeWidth="1.2" opacity=".4" />
        <Drawing palette={palette} front={front} side={side} weaveId={weaveId} />
      </g>
    </svg>
  )
}
