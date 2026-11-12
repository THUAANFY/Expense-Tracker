import useAppearance from '../theme/useAppearance'
import { useId } from 'react'
import './SidebarArt.css'

const DARK_ART_COLORS = {
  '#f0e5f6': '#302e4d',
  '#d8c6e5': '#6e6a9b',
  '#d9c7d7': '#0c1428',
  '#d8c1ad': '#66769d',
  '#86a17c': '#71b69f',
  '#93ab85': '#71b69f',
  '#c2d9af': '#79c4a8',
  '#d6e6c4': '#a0dac5',
  '#dceacd': '#a0dac5',
  '#edf3df': '#c7f1e2',
  '#f7e1c3': '#869bd0',
  '#ffecdc': '#869bd0',
  '#e6c29b': '#4d628f',
  '#f1cdb9': '#4d628f',
  '#b69a77': '#9eadd2',
  '#bb9580': '#9eadd2',
  '#c4a18b': '#9eadd2',
  '#c09a83': '#9eadd2',
  '#c1a27f': '#9eadd2',
  '#f7e5c9': '#526992',
  '#fff0df': '#526992',
  '#f0d8c7': '#526992',
  '#fff7e4': '#c6c9f4',
  '#fff4e4': '#c6c9f4',
  '#fffaeb': '#dfe5ff',
  '#fff8ed': '#dfe5ff',
  '#eadbf4': '#ad98e1',
  '#cdb4df': '#6863a8',
  '#a68ab8': '#afa0d4',
  '#aa8fbb': '#afa0d4',
  '#a784b3': '#afa0d4',
  '#fffaf0': '#2c3b59',
  '#fffdf3': '#2c3b59',
  '#fffaf1': '#2c3b59',
  '#b39bc3': '#a299cf',
  '#baa1c8': '#a299cf',
  '#e2d3d6': '#8296c3',
  '#dbc7dc': '#8296c3',
  '#d7c6d8': '#8296c3',
  '#e7b9cb': '#d69cc9',
  '#e8c3d4': '#d69cc9',
  '#e9c0d3': '#d69cc9',
  '#ba8ea7': '#a879a7',
  '#bc95b0': '#a879a7',
  '#91ab80': '#8bd8b9',
  '#c4aacd': '#10192d',
  '#fffef9': '#eee8ff',
  '#f9edf5': '#c2afe9',
  '#fffaf7': '#c2afe9',
  '#fff': '#fff6ff',
  '#ecc0d1': '#eaaed7',
  '#b69bc4': '#a58bc7',
  '#8f6c9c': '#443461',
  '#97739f': '#443461',
  '#ffe9b7': '#c8bcff',
  '#ffe6a2': '#c8bcff',
  '#c5a474': '#9b84c4',
  '#c5a067': '#9b84c4',
  '#c4a16b': '#9b84c4',
  '#edc88b': '#9c8ed6',
  '#dfbd7a': '#9c8ed6',
  '#f7d386': '#9c8ed6',
  '#d4b487': '#9c8ed6',
  '#b9975f': '#69649b',
  '#fff2dc': '#8a9ecb',
  '#c2a7bf': '#a296ca',
  '#e4cfef': '#b5d1ff',
  '#b696c6': '#8da4d2',
}

export default function SidebarArt() {
  const id = useId().replaceAll(':', '')
  const { theme } = useAppearance()
  const tone = (light) => (theme === 'dark' ? DARK_ART_COLORS[light] || light : light)
  return (
    <svg
      className="sidebar-art"
      viewBox="0 0 200 128"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={id + '-cover'}
          x1="63"
          y1="94"
          x2="136"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#eadbf4')} />
          <stop offset="1" stopColor={tone('#cdb4df')} />
        </linearGradient>
        <linearGradient
          id={id + '-cloud'}
          x1="86"
          y1="36"
          x2="94"
          y2="78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#fffef9')} />
          <stop offset="1" stopColor={tone('#f9edf5')} />
        </linearGradient>
        <linearGradient
          id={id + '-pot'}
          x1="27"
          y1="92"
          x2="45"
          y2="111"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#f7e1c3')} />
          <stop offset="1" stopColor={tone('#e6c29b')} />
        </linearGradient>
        <linearGradient
          id={id + '-cup'}
          x1="151"
          y1="89"
          x2="171"
          y2="109"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={tone('#ffecdc')} />
          <stop offset="1" stopColor={tone('#f1cdb9')} />
        </linearGradient>
      </defs>
      <ellipse cx="101" cy="69" rx="72" ry="40" fill={tone('#f0e5f6')} />
      <path
        d="M47 48c20-25 64-29 94-8"
        stroke={tone('#d8c6e5')}
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <ellipse cx="102" cy="113" rx="79" ry="4" fill={tone('#d9c7d7')} opacity=".38" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 111h147" stroke={tone('#d8c1ad')} strokeWidth="1.3" />
        <g className="sidebar-art-plant">
          <path d="M36 92V70m0 13-6-8m6 1 8-7" stroke={tone('#86a17c')} strokeWidth="1.5" />
          <path
            d="M35 82c-11 1-17-7-13-11 7-2 13 4 13 11Z"
            fill={tone('#c2d9af')}
            stroke={tone('#86a17c')}
            strokeWidth="1.3"
          />
          <path
            d="M37 74c1-12 11-18 16-13 0 8-7 13-16 13Z"
            fill={tone('#d6e6c4')}
            stroke={tone('#86a17c')}
            strokeWidth="1.3"
          />
          <path d="m26 75 7 5m7-10 8-5" stroke={tone('#edf3df')} strokeWidth="1.1" />
          <path
            d="M36 89c-7-4-11-2-10 2 4 3 8 1 10-2Z"
            fill={tone('#dceacd')}
            stroke={tone('#93ab85')}
            strokeWidth="1.1"
          />
        </g>
        <path
          d="m25 91 4 18q7 4 15 0l4-18Z"
          fill={'url(#' + id + '-pot)'}
          stroke={tone('#b69a77')}
          strokeWidth="1.4"
        />
        <rect
          x="23"
          y="88"
          width="27"
          height="6"
          rx="2.5"
          fill={tone('#f7e5c9')}
          stroke={tone('#b69a77')}
          strokeWidth="1.3"
        />
        <path
          d="M35 99c-4-5-8 0 0 5 8-5 4-10 0-5Z"
          fill={tone('#fff7e4')}
          stroke={tone('#c1a27f')}
          strokeWidth=".9"
        />
        <path d="M29 96v6" stroke={tone('#fffaeb')} strokeWidth="1.4" />

        <rect
          x="61"
          y="94"
          width="79"
          height="16"
          rx="5"
          fill={'url(#' + id + '-cover)'}
          stroke={tone('#a68ab8')}
          strokeWidth="1.5"
        />
        <path
          d="M65 98h73v8H65a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3Z"
          fill={tone('#fffaf0')}
          stroke={tone('#b39bc3')}
          strokeWidth="1.1"
        />
        <path d="M69 102h60" stroke={tone('#e2d3d6')} strokeWidth="1" />
        <path
          d="M122 95h7v15l-3.5-2-3.5 2Z"
          fill={tone('#e7b9cb')}
          stroke={tone('#ba8ea7')}
          strokeWidth="1"
        />
        <path
          d="M62 81q19-9 39 0v22q-20-8-39 0Z"
          fill={tone('#fffdf3')}
          stroke={tone('#aa8fbb')}
          strokeWidth="1.4"
        />
        <path
          d="M101 81q20-9 40 0v22q-20-8-40 0Z"
          fill={tone('#fffaf1')}
          stroke={tone('#aa8fbb')}
          strokeWidth="1.4"
        />
        <path d="M101 82v19" stroke={tone('#baa1c8')} strokeWidth="1.1" />
        <path
          d="M70 86q11-3 23 0m-23 5q11-3 23 0m-23 5q8-2 17-1"
          stroke={tone('#dbc7dc')}
          strokeWidth="1.1"
        />
        <path
          d="M115 85q9-1 18 1m-18 5q9-1 18 1m-18 5q7-1 13 0"
          stroke={tone('#d7c6d8')}
          strokeWidth="1.1"
        />
        <path
          d="m108 85 1.5 1.5 2-3m-3.5 8 1.5 1.5 2-3m-3.5 8 1.5 1.5 2-3"
          stroke={tone('#91ab80')}
          strokeWidth="1.1"
        />
        <ellipse
          className="sidebar-art-cloud-shadow"
          cx="94"
          cy="81"
          rx="25"
          ry="2.2"
          fill={tone('#c4aacd')}
          opacity=".2"
        />

        <g className="sidebar-art-cloud">
          <path
            d="M70 77c-8 0-13-5-13-11 0-5 3-9 8-10 0-11 8-20 19-20 9 0 16 6 19 14 7-3 15 2 16 9 7-1 12 4 12 10 0 5-4 8-10 8Z"
            fill={'url(#' + id + '-cloud)'}
            stroke={tone('#a784b3')}
            strokeWidth="1.6"
          />
          <path d="M73 51c2-5 7-9 12-9" stroke={tone('#fff')} strokeWidth="2.6" />
          <ellipse cx="75" cy="68" rx="4.2" ry="2.4" fill={tone('#ecc0d1')} />
          <ellipse cx="109" cy="68" rx="4.2" ry="2.4" fill={tone('#ecc0d1')} />
          <g stroke={tone('#b69bc4')} strokeWidth="1.1">
            <circle cx="82" cy="63" r="6" />
            <circle cx="101" cy="63" r="6" />
            <path d="M88 62q3.5-2 7 0m-19-1-6-2m37 2 7-2" />
          </g>
          <g className="sidebar-art-eyes" fill={tone('#8f6c9c')}>
            <ellipse cx="82" cy="63" rx="1.35" ry="1.7" />
            <ellipse cx="101" cy="63" rx="1.35" ry="1.7" />
          </g>
          <path d="M88 70q4 4 8 0" stroke={tone('#97739f')} strokeWidth="1.3" />
          <g transform="translate(111 48)">
            <path
              d="M0-3c-4-5-7-1-4 2-6 1-3 7 1 5 0 6 6 5 6 0 5 2 7-4 2-5 3-5-3-7-5-2Z"
              fill={tone('#ffe9b7')}
              stroke={tone('#c5a474')}
              strokeWidth=".9"
            />
            <circle cx=".5" cy="1" r="1.7" fill={tone('#edc88b')} />
          </g>
          <path
            d="M70 73c-6-4-12 3-7 6 3 2 7 0 10-2"
            fill={tone('#fffaf7')}
            stroke={tone('#a784b3')}
            strokeWidth="1.3"
          />
          <g className="sidebar-art-wave">
            <path
              d="M121 72c4-5 10-3 10 1 7-2 11 3 7 6-5 4-12 0-17-3"
              fill={tone('#fffaf7')}
              stroke={tone('#a784b3')}
              strokeWidth="1.3"
            />
            <path d="m132 75 3 1" stroke={tone('#e8c3d4')} strokeWidth="1.2" />
          </g>
        </g>

        <g className="sidebar-art-coin">
          <circle
            cx="149"
            cy="45"
            r="8"
            fill={tone('#ffe6a2')}
            stroke={tone('#c5a067')}
            strokeWidth="1.2"
          />
          <circle
            cx="149"
            cy="45"
            r="5.6"
            stroke={tone('#dfbd7a')}
            strokeWidth=".9"
            strokeDasharray="1 2"
          />
          <path
            d="M149 49v-7m0 4c-5 0-6-4-3-4 3 0 3 4 3 4Zm0-2c1-4 5-5 6-3 0 2-3 4-6 3Z"
            fill={tone('#f7d386')}
            stroke={tone('#b9975f')}
            strokeWidth=".8"
          />
        </g>
        <ellipse
          cx="162"
          cy="110"
          rx="18"
          ry="3"
          fill={tone('#f0d8c7')}
          stroke={tone('#c4a18b')}
          strokeWidth="1.1"
        />
        <path
          d="M172 89h4a5.5 5.5 0 0 1 0 11h-4"
          fill={tone('#fff0df')}
          stroke={tone('#bb9580')}
          strokeWidth="1.4"
        />
        <path
          d="M149 88h24v12q0 9-12 9t-12-9Z"
          fill={'url(#' + id + '-cup)'}
          stroke={tone('#bb9580')}
          strokeWidth="1.4"
        />
        <ellipse
          cx="161"
          cy="88"
          rx="12"
          ry="3"
          fill={tone('#fff2dc')}
          stroke={tone('#bb9580')}
          strokeWidth="1.2"
        />
        <ellipse cx="161" cy="88" rx="8" ry="1.5" fill={tone('#d4b487')} opacity=".8" />
        <path d="M153 93v7" stroke={tone('#fff8ed')} strokeWidth="1.5" />
        <path
          d="M162 98c-4-5-9 0 0 6 9-6 4-11 0-6Z"
          fill={tone('#fff4e4')}
          stroke={tone('#c09a83')}
          strokeWidth=".9"
        />
        <path
          className="sidebar-art-steam"
          d="M155 80c-5-5 5-8 0-14"
          stroke={tone('#c2a7bf')}
          strokeWidth="1.3"
        />
        <path
          className="sidebar-art-steam is-second"
          d="M166 80c-5-5 5-8 0-14"
          stroke={tone('#c2a7bf')}
          strokeWidth="1.3"
        />

        <path
          className="sidebar-art-spark"
          d="m43 27 1.6 4.4L49 33l-4.4 1.6L43 39l-1.6-4.4L37 33l4.4-1.6Z"
          fill={tone('#ffe9b7')}
          stroke={tone('#c4a16b')}
          strokeWidth="1.1"
        />
        <path
          className="sidebar-art-spark is-second"
          d="m178 57 1.3 3.7L183 62l-3.7 1.3L178 67l-1.3-3.7L173 62l3.7-1.3Z"
          fill={tone('#e4cfef')}
          stroke={tone('#b696c6')}
          strokeWidth="1"
        />
        <path
          d="M121 23c-4-5-10 0 0 6 10-6 4-11 0-6Z"
          fill={tone('#e9c0d3')}
          stroke={tone('#bc95b0')}
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}
