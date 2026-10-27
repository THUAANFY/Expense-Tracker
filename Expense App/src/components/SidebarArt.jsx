import { useId } from 'react'

export default function SidebarArt() {
  const id = useId().replaceAll(':', '')
  return (
    <svg viewBox="0 0 200 128" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={id + '-cover'}
          x1="60"
          y1="83"
          x2="143"
          y2="109"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e2d1ef" />
          <stop offset="1" stopColor="#c9b2de" />
        </linearGradient>
        <linearGradient
          id={id + '-cloud'}
          x1="87"
          y1="41"
          x2="87"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffefa" />
          <stop offset="1" stopColor="#f9edf5" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="73" rx="76" ry="39" fill="#efe3f5" />
      <ellipse cx="101" cy="112" rx="79" ry="4" fill="#e3d3df" opacity=".7" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M62 82h80a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5H62a5 5 0 0 1-5-5V87a5 5 0 0 1 5-5Z"
          fill={'url(#' + id + '-cover)'}
          stroke="#a085b4"
          strokeWidth="1.6"
        />
        <path
          d="M64 87h81v17H64a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5Z"
          fill="#fffaf1"
          stroke="#ad95bd"
          strokeWidth="1.3"
        />
        <path d="M66 93h71m-71 5h65" stroke="#e3d3d9" strokeWidth="1.2" />
        <path d="M126 85h8v19l-4-3-4 3Z" fill="#e9bfcf" stroke="#bd94ad" strokeWidth="1.2" />
        <path
          d="M69 79c-7 0-12-5-12-11 0-5 3-9 8-10 0-10 7-18 17-18 8 0 15 6 17 13 7-2 14 3 14 10 6 0 10 4 10 9 0 4-3 7-8 7Z"
          fill={'url(#' + id + '-cloud)'}
          stroke="#aa8ab5"
          strokeWidth="1.6"
        />
        <path d="M70 54c2-5 6-8 11-8" stroke="white" strokeWidth="2.6" />
        <ellipse cx="76" cy="69" rx="3.5" ry="2" fill="#edc4d3" />
        <ellipse cx="102" cy="69" rx="3.5" ry="2" fill="#edc4d3" />
        <g fill="#97759d">
          <circle cx="82" cy="64" r="1.25" />
          <circle cx="96" cy="64" r="1.25" />
        </g>
        <path d="M86 70q3 3 6 0" stroke="#97759d" strokeWidth="1.4" />
        <path d="M37 81c0-7 1-13 3-20" stroke="#86a082" strokeWidth="1.5" />
        <path
          d="M38 73c-9 1-14-5-12-9 6-2 11 2 12 9Z"
          fill="#cadfbd"
          stroke="#86a082"
          strokeWidth="1.3"
        />
        <path
          d="M39 66c1-7 7-11 12-8 0 5-5 9-12 8Z"
          fill="#d9e8cd"
          stroke="#86a082"
          strokeWidth="1.3"
        />
        <path d="m27 84 4 20h14l4-20Z" fill="#e9d2ad" stroke="#b69b78" strokeWidth="1.4" />
        <rect
          x="25"
          y="80"
          width="26"
          height="6"
          rx="2.5"
          fill="#f3dfbd"
          stroke="#b69b78"
          strokeWidth="1.4"
        />
        <path d="M34 92h8m-7 4h6" stroke="#d0b690" strokeWidth="1.2" />
        <ellipse
          cx="160"
          cy="108"
          rx="18"
          ry="3"
          fill="#ecd6c3"
          stroke="#c3a28d"
          strokeWidth="1.2"
        />
        <path d="M170 88h3a6 6 0 0 1 0 12h-3" fill="#fff3e4" stroke="#bd9787" strokeWidth="1.5" />
        <path
          d="M148 86h23v12a8 8 0 0 1-8 8h-7a8 8 0 0 1-8-8Z"
          fill="#f8decd"
          stroke="#bd9787"
          strokeWidth="1.5"
        />
        <ellipse
          cx="159.5"
          cy="86"
          rx="11.5"
          ry="2.7"
          fill="#fff0db"
          stroke="#bd9787"
          strokeWidth="1.3"
        />
        <path d="M154 72c-4-5 3-7 0-12m10 14c-4-5 3-7 0-12" stroke="#cab2c4" strokeWidth="1.4" />
        <path
          d="m37 32 1.6 4.4L43 38l-4.4 1.6L37 44l-1.6-4.4L31 38l4.4-1.6Z"
          fill="#ffe7b3"
          stroke="#c3a572"
          strokeWidth="1.2"
        />
        <path
          d="m135 35 1.3 3.7L140 40l-3.7 1.3L135 45l-1.3-3.7L130 40l3.7-1.3Z"
          fill="#e2cfee"
          stroke="#b89bc9"
          strokeWidth="1.1"
        />
        <path
          d="M111 24c-4-4-8 2 0 6 8-4 4-10 0-6Z"
          fill="#eac4d4"
          stroke="#c19cb4"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  )
}
