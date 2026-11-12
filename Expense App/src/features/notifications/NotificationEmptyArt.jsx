import { useId } from 'react'
import useAppearance from '../../app/theme/useAppearance'
import OverviewArt from '../overview/OverviewArt'

export default function NotificationEmptyArt({ read = false }) {
  const id = useId().replaceAll(':', '')
  const { theme } = useAppearance()
  if (theme !== 'dark') return <OverviewArt variant="cloud" className="notification-empty-art" />

  return (
    <svg
      className="notification-empty-art notification-empty-art-dark"
      viewBox="0 0 160 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-card`}
          x1="40"
          y1="18"
          x2="122"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3c4169" />
          <stop offset="1" stopColor="#222b47" />
        </linearGradient>
        <linearGradient
          id={`${id}-bell`}
          x1="59"
          y1="34"
          x2="104"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f0ddff" />
          <stop offset=".45" stopColor="#b39af5" />
          <stop offset="1" stopColor="#6e7ed9" />
        </linearGradient>
        <linearGradient
          id={`${id}-badge`}
          x1="105"
          y1="68"
          x2="132"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={read ? '#a0f3dc' : '#b6caff'} />
          <stop offset="1" stopColor={read ? '#48bda9' : '#7e8be8'} />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#9f82ed" stopOpacity=".24" />
          <stop offset="1" stopColor="#9f82ed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="103" rx="64" ry="12" fill={`url(#${id}-halo)`} />
      <rect
        x="40"
        y="18"
        width="77"
        height="82"
        rx="17"
        transform="rotate(-8 78 59)"
        fill="#232c48"
        stroke="#7a79aa"
        strokeOpacity=".45"
      />
      <rect
        x="43"
        y="20"
        width="77"
        height="80"
        rx="16"
        fill={`url(#${id}-card)`}
        stroke="#a7a4e1"
        strokeOpacity=".65"
      />
      <path
        d="M55 30h19m-19 5h10"
        stroke="#b8b9ea"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="82" cy="41" r="5" fill="#d9c9ff" stroke="#f4eaff" strokeWidth="1.4" />
      <path
        d="M62 61c0-13 7-21 20-21s20 8 20 21v8l6 9c1 2 0 4-3 4H59c-3 0-4-2-3-4l6-9v-8Z"
        fill={`url(#${id}-bell)`}
        stroke="#e0d7ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M69 60c0-7 3-11 8-13"
        stroke="#fff5ff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".8"
      />
      <path d="M75 87a7 7 0 0 0 14 0" fill="#c8b3ff" stroke="#ede0ff" strokeWidth="1.5" />
      <path
        d="M61 76h39"
        stroke="#f1e5ff"
        strokeOpacity=".65"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="119" cy="83" r="17" fill="#1d293e" />
      <circle
        cx="119"
        cy="82"
        r="14"
        fill={`url(#${id}-badge)`}
        stroke={read ? '#b7f6e8' : '#d3dcff'}
        strokeWidth="1.5"
      />
      {read ? (
        <g stroke="#174a49" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m109 82 4 4 9-9m-4 8 2 2 9-10" />
        </g>
      ) : (
        <path d="M123 73a9 9 0 1 0 5 15 10 10 0 0 1-5-15Z" fill="#f2edff" />
      )}
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="m28 47 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#d7c5ff" stroke="#ece1ff" />
        <path
          d="m130 26 1.5 4.5L136 32l-4.5 1.5L130 38l-1.5-4.5L124 32l4.5-1.5Z"
          fill="#9fcbff"
          stroke="#c5dfff"
        />
        <circle cx="32" cy="82" r="2" fill="#8edecf" />
        <circle cx="140" cy="57" r="1.7" fill="#b9a6f4" />
      </g>
    </svg>
  )
}
