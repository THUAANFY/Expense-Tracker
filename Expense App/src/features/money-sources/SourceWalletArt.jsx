import { useId } from 'react'

const palettes = {
  ewallet: ['#f3e0ff', '#c297ff', '#8d50de', '#43246f'],
  bank: ['#ddf7ff', '#82d2ff', '#428ce9', '#213e88'],
  cash: ['#ddfff1', '#94ebc8', '#41af94', '#225f59'],
}

function CurrencyMark({ x, y, scale = 1, color = '#f4eeff' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth="1.7">
      <path d="M4-7V6M4-2C1-5-4-3-4 1s5 6 8 2M1-5h6" />
    </g>
  )
}

function Sparkle({ x, y, size = 5, color }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${size})`}
      d="M0-1Q0 0 1 0Q0 0 0 1Q0 0-1 0Q0 0 0-1Z"
      fill={color}
    />
  )
}

// Bevels, reflections and shadows use static vector gradients, without filter layers.
export default function SourceWalletArt({ type = 'cash', className = '' }) {
  const id = 'source-wallet-' + useId().replaceAll(':', '')
  const kind = Object.hasOwn(palettes, type) ? type : 'cash'
  const [light, bright, mid, deep] = palettes[kind]
  const paint = (name) => 'url(#' + id + '-' + name + ')'

  return (
    <svg
      className={'source-art source-wallet-art source-wallet-art--' + kind + ' ' + className}
      viewBox="0 0 180 136"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id + '-face'} x1=".12" y1="0" x2=".85" y2="1">
          <stop stopColor={light} />
          <stop offset=".24" stopColor={bright} />
          <stop offset=".67" stopColor={mid} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={id + '-edge'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="white" />
          <stop offset=".23" stopColor={light} />
          <stop offset=".5" stopColor={mid} />
          <stop offset=".78" stopColor={deep} />
          <stop offset="1" stopColor={bright} />
        </linearGradient>
        <linearGradient id={id + '-screen'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#413469" />
          <stop offset=".48" stopColor="#16182f" />
          <stop offset="1" stopColor="#392752" />
        </linearGradient>
        <linearGradient id={id + '-lilac'} x1=".1" y1="0" x2=".8" y2="1">
          <stop stopColor="#f7eaff" />
          <stop offset=".28" stopColor="#cfa5ff" />
          <stop offset=".72" stopColor="#9861da" />
          <stop offset="1" stopColor="#58348e" />
        </linearGradient>
        <linearGradient id={id + '-mint'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ddfff1" />
          <stop offset=".32" stopColor="#91f1d1" />
          <stop offset=".75" stopColor="#4bb89e" />
          <stop offset="1" stopColor="#276b65" />
        </linearGradient>
        <linearGradient id={id + '-metal'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff8ff" />
          <stop offset=".3" stopColor="#d9dafa" />
          <stop offset=".52" stopColor="#919dc8" />
          <stop offset=".68" stopColor="#f0f1ff" />
          <stop offset="1" stopColor="#8699be" />
        </linearGradient>
        <linearGradient id={id + '-paper'} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#b9e8d6" />
          <stop offset=".45" stopColor="#6fae98" />
          <stop offset="1" stopColor="#356e62" />
        </linearGradient>
        <linearGradient id={id + '-shine'} x1="0" y1="0" x2=".9" y2="1">
          <stop stopColor="white" stopOpacity=".55" />
          <stop offset=".48" stopColor="white" stopOpacity=".11" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id + '-ground'}>
          <stop stopColor={bright} stopOpacity=".32" />
          <stop offset="1" stopColor={bright} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id + '-pearl'} cx=".3" cy=".22" r=".8">
          <stop stopColor="white" />
          <stop offset=".35" stopColor="#e6e8ff" />
          <stop offset=".72" stopColor="#a6a3da" />
          <stop offset="1" stopColor="#5d5b96" />
        </radialGradient>
      </defs>

      <ellipse cx="91" cy="125" rx="75" ry="8" fill={paint('ground')} />
      <ellipse cx="91" cy="124" rx="55" ry="3.5" fill="#070c20" fillOpacity=".7" />

      <g strokeLinecap="round" strokeLinejoin="round">
        {kind === 'ewallet' ? (
          <>
            <path
              d="M127 28q18 6 20 25m-17-18q10 5 12 16"
              stroke="#c69cff"
              strokeWidth="1.5"
              opacity=".65"
            />
            <g transform="rotate(-7 77 65)">
              <rect x="46" y="9" width="68" height="114" rx="16" fill="#322049" stroke="#9060bb" />
              <rect
                x="42"
                y="6"
                width="68"
                height="114"
                rx="16"
                fill={paint('edge')}
                stroke="#f1d8ff"
                strokeWidth="1.1"
              />
              <rect
                x="45"
                y="9"
                width="62"
                height="108"
                rx="13"
                fill={paint('face')}
                stroke="#9c62ce"
                strokeWidth=".7"
              />
              <rect
                x="48"
                y="12"
                width="56"
                height="102"
                rx="10.5"
                fill={paint('screen')}
                stroke="#e3c9ff"
                strokeWidth=".7"
              />
              <path d="M49 37V24q0-10 10-10h27" stroke="white" strokeOpacity=".35" />
              <rect x="64" y="15" width="21" height="5" rx="2.5" fill="#141525" />
              <circle cx="89" cy="17.5" r="1.25" fill="#ad96d6" />
              <path d="M43 33v13m0 6v9m67-25v20" stroke="#e7c5ff" strokeWidth="1.8" />
              <path d="M55 27h6m-6 3h3m31-3h3m3 0h2" stroke="#bdaddd" strokeWidth="1" />

              <rect
                x="55"
                y="36"
                width="15"
                height="11"
                rx="3"
                fill={paint('lilac')}
                stroke="#efd9ff"
                strokeWidth=".6"
              />
              <path d="M65 40h6v5h-6a2.5 2.5 0 0 1 0-5Z" fill="#7950b4" />
              <circle cx="67" cy="42.5" r=".9" fill="white" />
              <path d="M76 39h18m-18 5h12" stroke="#c0a6e5" strokeWidth="1.5" />

              <rect
                x="57"
                y="54"
                width="37"
                height="36"
                rx="7"
                fill="#080e22"
                fillOpacity=".45"
                stroke="#ad88dc"
                strokeOpacity=".3"
              />
              <rect x="61" y="58" width="29" height="28" rx="3" fill="#f2eaff" />
              <g stroke="#4d3475" strokeWidth="1.7">
                <path d="M65 62h6v6h-6zM80 62h6v6h-6zM65 76h6v6h-6z" />
                <path
                  d="M75 62v4m0 5h5v4h5v7h-4m-6-6v6m-4-10h-7m17 0h5m-8-4v3m0 8h2"
                  strokeWidth="1.5"
                />
              </g>
              <path
                d="M54 62v-5q0-6 6-6h4m22 0h5q6 0 6 6v5M54 82v5q0 6 6 6h4m22 0h5q6 0 6-6v-5"
                stroke="#94f1d0"
                strokeWidth="1.7"
              />
              <path d="M59 71h33" stroke="#91f1d1" strokeWidth="1.2" />
              <path d="M59 72h33v3H59Z" fill="#63dfbc" fillOpacity=".2" />
              <rect x="58" y="99" width="35" height="7" rx="3.5" fill={paint('lilac')} />
              <path d="M70 102.5h11M68 110h15" stroke="#f0ddff" strokeWidth="1.5" />
            </g>

            <g transform="rotate(9 124 93)">
              <rect x="99" y="73" width="53" height="35" rx="9" fill="#205d55" stroke="#64b69d" />
              <rect
                x="97"
                y="70"
                width="53"
                height="35"
                rx="9"
                fill={paint('mint')}
                stroke="#c9ffec"
                strokeWidth="1"
              />
              <path d="M102 81v-3q0-4 4-4h34" stroke="white" strokeOpacity=".65" />
              <path d="M103 98h15m-15-5h9" stroke="#388e7b" strokeWidth="1.6" />
              <rect
                x="126"
                y="81"
                width="26"
                height="15"
                rx="5"
                fill="#397e74"
                stroke="#b2f5df"
                strokeWidth=".7"
              />
              <circle cx="133" cy="88.5" r="2.6" fill={paint('metal')} />
              <path d="M139 86q2 2.5 0 5m3-7q4 4.5 0 9" stroke="#d6fff0" strokeWidth="1" />
            </g>
            <circle cx="142" cy="111" r="13" fill="#225e56" stroke="#7ad8bb" />
            <circle cx="141" cy="109" r="11" fill={paint('mint')} stroke="#d6fff0" />
            <path d="m135.5 109 3.5 3.5 7-8" stroke="#226d5e" strokeWidth="2.4" />
            <path d="M132 106q2-5 7-5" stroke="white" strokeWidth="1" strokeOpacity=".75" />
            <Sparkle x={30} y={49} size={5} color={light} />
            <circle cx="32" cy="91" r="3" fill={paint('lilac')} stroke="#ebd5ff" strokeWidth=".7" />
          </>
        ) : kind === 'bank' ? (
          <>
            <g transform="translate(123 35)">
              <rect
                x="-26"
                y="-27"
                width="54"
                height="57"
                rx="16"
                fill="#183d73"
                stroke="#6ab3ed"
              />
              <rect
                x="-28"
                y="-29"
                width="54"
                height="57"
                rx="16"
                fill={paint('face')}
                stroke="#cdf0ff"
              />
              <rect
                x="-24"
                y="-25"
                width="46"
                height="49"
                rx="12"
                fill="#194078"
                fillOpacity=".55"
                stroke="#bedfff"
                strokeOpacity=".4"
                strokeWidth=".7"
              />
              <path
                d="m-19-9 18-11 18 11h-36Z"
                fill={paint('metal')}
                stroke="#dbf0ff"
                strokeWidth=".7"
              />
              <path d="m-12-11 11-6 11 6H-12Z" fill="#557fb6" />
              <circle cx="-1" cy="-13" r="1.5" fill="#e4f4ff" />
              <path d="M-19-7h36v4h-36Z" fill={paint('metal')} stroke="#e0edff" strokeWidth=".6" />
              {[-13, -1, 11].map((x) => (
                <g key={x}>
                  <path
                    d={'M' + (x - 2.5) + '-2h5v17h-5Z'}
                    fill={paint('metal')}
                    stroke="#bacfee"
                    strokeWidth=".6"
                  />
                  <path d={'M' + x + '-1v15'} stroke="#6985b3" strokeWidth=".8" />
                  <path d={'M' + (x - 4) + '-3h8m-8 18h8'} stroke="#eaf6ff" strokeWidth="1.5" />
                </g>
              ))}
              <path d="M-19 18h36v4h-36Z" fill={paint('metal')} stroke="#d2e6ff" strokeWidth=".7" />
              <path d="M-17-23q8-4 19-3" stroke="white" strokeOpacity=".65" />
            </g>

            <g transform="rotate(-12 81 84)">
              <rect x="21" y="49" width="121" height="73" rx="12" fill="#193366" stroke="#528dd6" />
              <rect
                x="18"
                y="45"
                width="121"
                height="73"
                rx="12"
                fill={paint('edge')}
                stroke="#ccefff"
                strokeWidth="1.1"
              />
              <rect
                x="21"
                y="48"
                width="115"
                height="67"
                rx="9"
                fill={paint('face')}
                stroke="#7fb7f1"
                strokeWidth=".7"
              />
              <path
                d="M23 65v-7q0-7 7-7h84"
                stroke="#f0fbff"
                strokeWidth="1.4"
                strokeOpacity=".75"
              />
              <path d="M24 75 75 50h28L24 93Z" fill={paint('shine')} />
              <path
                d="m96 55 31 23m-31-16 31 23m-31-16 31 23m-31-16 31 23m-31-16 31 23"
                stroke="#c5eaff"
                strokeOpacity=".18"
                strokeWidth=".65"
              />

              <rect x="34" y="65" width="27" height="22" rx="5" fill="#476ca1" />
              <rect
                x="33"
                y="63"
                width="27"
                height="22"
                rx="5"
                fill={paint('metal')}
                stroke="#e9f0ff"
                strokeWidth=".8"
              />
              <g stroke="#697ba6" strokeWidth=".85">
                <path d="M42 63v5l-4 3v6l4 3v5m9-22v5l4 3v6l-4 3v5M33 73h5m17 0h5M42 68h9v12h-9zM42 74h9" />
              </g>
              <path
                d="M68 67q4 5 0 10m4-13q7 8 0 16m4-19q10 11 0 22"
                stroke="#ecf7ff"
                strokeWidth="1.35"
              />

              <path
                d="M114 62c-4 3-8 4-8 4v7q0 8 8 12 8-4 8-12v-7s-4-1-8-4Z"
                fill="#3c6daf"
                stroke="#bce6ff"
                strokeWidth=".8"
              />
              <path d="m110 73 2.7 3 5.5-6" stroke="#deefff" strokeWidth="1.6" />
              <path
                d="M34 96h9m6 0h9m6 0h9m6 0h9"
                stroke="#143e77"
                strokeOpacity=".65"
                strokeWidth="2.4"
              />
              <path d="M34 95h9m6 0h9m6 0h9m6 0h9" stroke="#def3ff" strokeWidth="2" />
              <path d="M34 106h23m6 0h8" stroke="#cce6ff" strokeWidth="1.7" />
              <g transform="translate(117 101) rotate(45)">
                <rect
                  x="-9"
                  y="-5"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#c1e8ff"
                  fillOpacity=".75"
                />
                <rect
                  x="-1"
                  y="-5"
                  width="10"
                  height="10"
                  rx="2"
                  fill="#6facff"
                  stroke="#d7efff"
                  strokeWidth=".7"
                />
              </g>
              <path d="M30 118h96" stroke="#75a9e6" strokeWidth="1" />
            </g>
            <Sparkle x={28} y={35} size={6} color={light} />
            <Sparkle x={157} y={83} size={4} color={bright} />
            <circle cx="72" cy="26" r="2" fill="#9ddfff" />
          </>
        ) : (
          <>
            <g transform="rotate(-17 92 39)">
              <rect x="56" y="14" width="83" height="47" rx="5" fill="#473366" stroke="#c6a5ef" />
              <rect
                x="60"
                y="18"
                width="75"
                height="39"
                rx="3"
                fill="#74538f"
                stroke="#d8b7f2"
                strokeWidth=".7"
              />
              <path
                d="M66 23h62v29H66Z"
                stroke="#cda8e2"
                strokeWidth=".6"
                strokeDasharray="1.5 2"
              />
              <circle
                cx="98"
                cy="37"
                r="11"
                fill={paint('lilac')}
                stroke="#ead0ff"
                strokeWidth=".7"
              />
              <CurrencyMark x={98} y={37} scale={0.75} color="#704a93" />
              <path d="M68 29h13m-13 4h9m34 10h13m-9 4h9" stroke="#ddc1eb" strokeWidth="1" />
            </g>
            <g transform="rotate(-5 87 48)">
              <rect x="42" y="26" width="92" height="50" rx="5" fill="#326f60" stroke="#99d4b9" />
              <rect
                x="46"
                y="30"
                width="84"
                height="42"
                rx="3"
                fill={paint('paper')}
                stroke="#c7f1d6"
                strokeWidth=".7"
              />
              <path
                d="M50 38q6 0 6-5h64q0 5 6 5v25q-6 0-6 5H56q0-5-6-5V38Z"
                stroke="#cef2dd"
                strokeOpacity=".7"
                strokeWidth=".7"
              />
              <path d="M79 34v33m4-33v33" stroke="#bfefd8" strokeWidth="1.2" strokeOpacity=".4" />
              <ellipse
                cx="95"
                cy="50"
                rx="13"
                ry="15"
                fill="#629c7e"
                stroke="#bbdfbf"
                strokeWidth=".6"
              />
              <ellipse
                cx="95"
                cy="50"
                rx="10"
                ry="12"
                fill="#b6dec1"
                stroke="#477a64"
                strokeWidth=".7"
              />
              <CurrencyMark x={95} y={50} scale={0.85} color="#3f785f" />
              <path d="M58 40h12m-12 4h8m42 14h12m-8 4h8" stroke="#ddf5db" strokeWidth="1.1" />
              <circle cx="61" cy="58" r="4" stroke="#b1d8bc" strokeWidth=".8" />
              <circle cx="61" cy="58" r="1.7" fill="#b1d8bc" />
            </g>

            <path d="M27 63q0-17 18-17h92v61H44q-17 0-17-16V63Z" fill="#1e4d4b" stroke="#77b29f" />
            <path d="M35 53q4-3 12-3h85" stroke="#9ed9c0" strokeWidth="1.4" />
            <path d="M28 63q0-10 11-10h92" stroke="#0b3738" strokeWidth="2.7" />
            <rect x="25" y="59" width="119" height="61" rx="14" fill="#225951" stroke="#529c84" />
            <rect
              x="22"
              y="55"
              width="119"
              height="61"
              rx="14"
              fill={paint('edge')}
              stroke="#c4f7df"
              strokeWidth="1"
            />
            <rect
              x="25"
              y="58"
              width="113"
              height="55"
              rx="11"
              fill={paint('face')}
              stroke="#6ac5a2"
              strokeWidth=".7"
            />
            <path d="M28 75v-6q0-8 8-8h80" stroke="#e6fff1" strokeOpacity=".7" strokeWidth="1.3" />
            <path
              d="M30 80v19q0 9 9 9h75m11-42h4v39q0 3-3 3"
              stroke="#c1efd5"
              strokeOpacity=".8"
              strokeWidth=".8"
              strokeDasharray="1.5 2.7"
            />
            <path d="M38 68h20m-20 4h12" stroke="#d4ffe8" strokeWidth="1.5" strokeOpacity=".7" />
            <path
              d="M33 94q7 7 18 7h62q13 0 21-8v9q0 8-9 8H39q-6 0-6-7v-9Z"
              fill="#225e56"
              fillOpacity=".26"
            />
            <path d="M44 111h79q9 0 12-7" stroke="#173f40" strokeWidth="1.2" strokeOpacity=".5" />
            <g fill="#e0fff0" fillOpacity=".2">
              <circle cx="43" cy="85" r=".75" />
              <circle cx="50" cy="88" r=".75" />
              <circle cx="39" cy="93" r=".75" />
              <circle cx="53" cy="98" r=".75" />
              <circle cx="108" cy="72" r=".75" />
              <circle cx="114" cy="77" r=".75" />
            </g>
            <circle
              cx="83"
              cy="86"
              r="15"
              fill="#286f5c"
              fillOpacity=".5"
              stroke="#a5e5c4"
              strokeWidth=".8"
            />
            <circle
              cx="82"
              cy="84"
              r="12.7"
              fill={paint('mint')}
              stroke="#d3ffe5"
              strokeWidth=".6"
            />
            <circle cx="82" cy="84" r="10.5" stroke="#579e81" strokeWidth=".6" />
            <CurrencyMark x={82} y={84} scale={1} color="#357e65" />

            <path
              d="M127 76h24v27h-24q-13 0-13-13.5T127 76Z"
              fill="#153b3f"
              stroke="#609b91"
              strokeWidth=".8"
            />
            <path
              d="M125 72h24v27h-24q-13 0-13-13.5T125 72Z"
              fill={paint('mint')}
              stroke="#c6f7dd"
              strokeWidth=".8"
            />
            <path
              d="M125 76h20v19h-20q-9 0-9-9.5t9-9.5Z"
              stroke="#428477"
              strokeWidth=".7"
              strokeDasharray="1.5 2"
            />
            <circle cx="127" cy="85.5" r="6.5" fill="#25574f" stroke="#8cc9b0" strokeWidth=".7" />
            <circle
              cx="126"
              cy="84"
              r="4.7"
              fill={paint('pearl')}
              stroke="#eafff4"
              strokeWidth=".7"
            />
            <circle cx="124.5" cy="82.5" r="1" fill="white" fillOpacity=".9" />

            <g transform="translate(145 116)">
              <path
                d="M-14-7v8c0 6 28 6 28 0v-8"
                fill="#548c86"
                stroke="#acd8cf"
                strokeWidth=".7"
              />
              <path d="M-13-3q13 7 26 0m-26 3q13 7 26 0" stroke="#b9ded3" strokeWidth=".7" />
              <path d="M-10-4v6m4-4v6m5-5v6m5-6v6m5-8v6" stroke="#d3e9e2" strokeWidth=".7" />
              <ellipse
                cy="-7"
                rx="14"
                ry="5"
                fill={paint('metal')}
                stroke="#e9f8ef"
                strokeWidth=".7"
              />
              <ellipse cy="-7" rx="10" ry="3" stroke="#788da5" strokeWidth=".7" />
              <g transform="translate(-6 -9) rotate(-15)">
                <path
                  d="M-10-2v3c0 4 20 4 20 0v-3"
                  fill="#397f70"
                  stroke="#84c7ad"
                  strokeWidth=".7"
                />
                <ellipse
                  cy="-2"
                  rx="10"
                  ry="4"
                  fill={paint('mint')}
                  stroke="#c7ffe7"
                  strokeWidth=".7"
                />
                <ellipse cy="-2" rx="7" ry="2.1" stroke="#5c9c7c" strokeWidth=".6" />
              </g>
            </g>
            <Sparkle x={24} y={35} size={5.5} color={light} />
            <Sparkle x={157} y={59} size={4} color={bright} />
          </>
        )}
      </g>
    </svg>
  )
}
