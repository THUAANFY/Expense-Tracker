import { useId } from 'react'
import './SidebarArt.css'

export default function SidebarArt() {
  const id = useId().replaceAll(':', '')
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
          <stop stopColor="#eadbf4" />
          <stop offset="1" stopColor="#cdb4df" />
        </linearGradient>
        <linearGradient
          id={id + '-cloud'}
          x1="86"
          y1="36"
          x2="94"
          y2="78"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffef9" />
          <stop offset="1" stopColor="#f9edf5" />
        </linearGradient>
        <linearGradient
          id={id + '-pot'}
          x1="27"
          y1="92"
          x2="45"
          y2="111"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f7e1c3" />
          <stop offset="1" stopColor="#e6c29b" />
        </linearGradient>
        <linearGradient
          id={id + '-cup'}
          x1="151"
          y1="89"
          x2="171"
          y2="109"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffecdc" />
          <stop offset="1" stopColor="#f1cdb9" />
        </linearGradient>
      </defs>
      <ellipse cx="101" cy="69" rx="72" ry="40" fill="#f0e5f6" />
      <path d="M47 48c20-25 64-29 94-8" stroke="#d8c6e5" strokeWidth="1" strokeDasharray="2 4" />
      <ellipse cx="102" cy="113" rx="79" ry="4" fill="#d9c7d7" opacity=".38" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 111h147" stroke="#d8c1ad" strokeWidth="1.3" />
        <g className="sidebar-art-plant">
          <path d="M36 92V70m0 13-6-8m6 1 8-7" stroke="#86a17c" strokeWidth="1.5" />
          <path
            d="M35 82c-11 1-17-7-13-11 7-2 13 4 13 11Z"
            fill="#c2d9af"
            stroke="#86a17c"
            strokeWidth="1.3"
          />
          <path
            d="M37 74c1-12 11-18 16-13 0 8-7 13-16 13Z"
            fill="#d6e6c4"
            stroke="#86a17c"
            strokeWidth="1.3"
          />
          <path d="m26 75 7 5m7-10 8-5" stroke="#edf3df" strokeWidth="1.1" />
          <path
            d="M36 89c-7-4-11-2-10 2 4 3 8 1 10-2Z"
            fill="#dceacd"
            stroke="#93ab85"
            strokeWidth="1.1"
          />
        </g>
        <path
          d="m25 91 4 18q7 4 15 0l4-18Z"
          fill={'url(#' + id + '-pot)'}
          stroke="#b69a77"
          strokeWidth="1.4"
        />
        <rect
          x="23"
          y="88"
          width="27"
          height="6"
          rx="2.5"
          fill="#f7e5c9"
          stroke="#b69a77"
          strokeWidth="1.3"
        />
        <path
          d="M35 99c-4-5-8 0 0 5 8-5 4-10 0-5Z"
          fill="#fff7e4"
          stroke="#c1a27f"
          strokeWidth=".9"
        />
        <path d="M29 96v6" stroke="#fffaeb" strokeWidth="1.4" />

        <rect
          x="61"
          y="94"
          width="79"
          height="16"
          rx="5"
          fill={'url(#' + id + '-cover)'}
          stroke="#a68ab8"
          strokeWidth="1.5"
        />
        <path
          d="M65 98h73v8H65a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3Z"
          fill="#fffaf0"
          stroke="#b39bc3"
          strokeWidth="1.1"
        />
        <path d="M69 102h60" stroke="#e2d3d6" strokeWidth="1" />
        <path d="M122 95h7v15l-3.5-2-3.5 2Z" fill="#e7b9cb" stroke="#ba8ea7" strokeWidth="1" />
        <path
          d="M62 81q19-9 39 0v22q-20-8-39 0Z"
          fill="#fffdf3"
          stroke="#aa8fbb"
          strokeWidth="1.4"
        />
        <path
          d="M101 81q20-9 40 0v22q-20-8-40 0Z"
          fill="#fffaf1"
          stroke="#aa8fbb"
          strokeWidth="1.4"
        />
        <path d="M101 82v19" stroke="#baa1c8" strokeWidth="1.1" />
        <path
          d="M70 86q11-3 23 0m-23 5q11-3 23 0m-23 5q8-2 17-1"
          stroke="#dbc7dc"
          strokeWidth="1.1"
        />
        <path
          d="M115 85q9-1 18 1m-18 5q9-1 18 1m-18 5q7-1 13 0"
          stroke="#d7c6d8"
          strokeWidth="1.1"
        />
        <path
          d="m108 85 1.5 1.5 2-3m-3.5 8 1.5 1.5 2-3m-3.5 8 1.5 1.5 2-3"
          stroke="#91ab80"
          strokeWidth="1.1"
        />
        <ellipse
          className="sidebar-art-cloud-shadow"
          cx="94"
          cy="81"
          rx="25"
          ry="2.2"
          fill="#c4aacd"
          opacity=".2"
        />

        <g className="sidebar-art-cloud">
          <path
            d="M70 77c-8 0-13-5-13-11 0-5 3-9 8-10 0-11 8-20 19-20 9 0 16 6 19 14 7-3 15 2 16 9 7-1 12 4 12 10 0 5-4 8-10 8Z"
            fill={'url(#' + id + '-cloud)'}
            stroke="#a784b3"
            strokeWidth="1.6"
          />
          <path d="M73 51c2-5 7-9 12-9" stroke="#fff" strokeWidth="2.6" />
          <ellipse cx="75" cy="68" rx="4.2" ry="2.4" fill="#ecc0d1" />
          <ellipse cx="109" cy="68" rx="4.2" ry="2.4" fill="#ecc0d1" />
          <g stroke="#b69bc4" strokeWidth="1.1">
            <circle cx="82" cy="63" r="6" />
            <circle cx="101" cy="63" r="6" />
            <path d="M88 62q3.5-2 7 0m-19-1-6-2m37 2 7-2" />
          </g>
          <g className="sidebar-art-eyes" fill="#8f6c9c">
            <ellipse cx="82" cy="63" rx="1.35" ry="1.7" />
            <ellipse cx="101" cy="63" rx="1.35" ry="1.7" />
          </g>
          <path d="M88 70q4 4 8 0" stroke="#97739f" strokeWidth="1.3" />
          <g transform="translate(111 48)">
            <path
              d="M0-3c-4-5-7-1-4 2-6 1-3 7 1 5 0 6 6 5 6 0 5 2 7-4 2-5 3-5-3-7-5-2Z"
              fill="#ffe9b7"
              stroke="#c5a474"
              strokeWidth=".9"
            />
            <circle cx=".5" cy="1" r="1.7" fill="#edc88b" />
          </g>
          <path
            d="M70 73c-6-4-12 3-7 6 3 2 7 0 10-2"
            fill="#fffaf7"
            stroke="#a784b3"
            strokeWidth="1.3"
          />
          <g className="sidebar-art-wave">
            <path
              d="M121 72c4-5 10-3 10 1 7-2 11 3 7 6-5 4-12 0-17-3"
              fill="#fffaf7"
              stroke="#a784b3"
              strokeWidth="1.3"
            />
            <path d="m132 75 3 1" stroke="#e8c3d4" strokeWidth="1.2" />
          </g>
        </g>

        <g className="sidebar-art-coin">
          <circle cx="149" cy="45" r="8" fill="#ffe6a2" stroke="#c5a067" strokeWidth="1.2" />
          <circle
            cx="149"
            cy="45"
            r="5.6"
            stroke="#dfbd7a"
            strokeWidth=".9"
            strokeDasharray="1 2"
          />
          <path
            d="M149 49v-7m0 4c-5 0-6-4-3-4 3 0 3 4 3 4Zm0-2c1-4 5-5 6-3 0 2-3 4-6 3Z"
            fill="#f7d386"
            stroke="#b9975f"
            strokeWidth=".8"
          />
        </g>
        <ellipse
          cx="162"
          cy="110"
          rx="18"
          ry="3"
          fill="#f0d8c7"
          stroke="#c4a18b"
          strokeWidth="1.1"
        />
        <path
          d="M172 89h4a5.5 5.5 0 0 1 0 11h-4"
          fill="#fff0df"
          stroke="#bb9580"
          strokeWidth="1.4"
        />
        <path
          d="M149 88h24v12q0 9-12 9t-12-9Z"
          fill={'url(#' + id + '-cup)'}
          stroke="#bb9580"
          strokeWidth="1.4"
        />
        <ellipse
          cx="161"
          cy="88"
          rx="12"
          ry="3"
          fill="#fff2dc"
          stroke="#bb9580"
          strokeWidth="1.2"
        />
        <ellipse cx="161" cy="88" rx="8" ry="1.5" fill="#d4b487" opacity=".8" />
        <path d="M153 93v7" stroke="#fff8ed" strokeWidth="1.5" />
        <path
          d="M162 98c-4-5-9 0 0 6 9-6 4-11 0-6Z"
          fill="#fff4e4"
          stroke="#c09a83"
          strokeWidth=".9"
        />
        <path
          className="sidebar-art-steam"
          d="M155 80c-5-5 5-8 0-14"
          stroke="#c2a7bf"
          strokeWidth="1.3"
        />
        <path
          className="sidebar-art-steam is-second"
          d="M166 80c-5-5 5-8 0-14"
          stroke="#c2a7bf"
          strokeWidth="1.3"
        />

        <path
          className="sidebar-art-spark"
          d="m43 27 1.6 4.4L49 33l-4.4 1.6L43 39l-1.6-4.4L37 33l4.4-1.6Z"
          fill="#ffe9b7"
          stroke="#c4a16b"
          strokeWidth="1.1"
        />
        <path
          className="sidebar-art-spark is-second"
          d="m178 57 1.3 3.7L183 62l-3.7 1.3L178 67l-1.3-3.7L173 62l3.7-1.3Z"
          fill="#e4cfef"
          stroke="#b696c6"
          strokeWidth="1"
        />
        <path
          d="M121 23c-4-5-10 0 0 6 10-6 4-11 0-6Z"
          fill="#e9c0d3"
          stroke="#bc95b0"
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}
