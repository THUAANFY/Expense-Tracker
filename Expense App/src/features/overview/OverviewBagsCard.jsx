import { useId } from 'react'
import { ArrowUpRight } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import BagArt from '../bags/BagArt'
import OverviewBagArt from './OverviewBagArt'
import './OverviewBagsCard.css'

export default function OverviewBagsCard({ activeCount = 0, onOpen }) {
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  const id = useId().replaceAll(':', '')
  return (
    <button
      type="button"
      className={`overview-bags-card ${dark ? 'fintech-bags-card' : ''}`}
      onClick={onOpen}
    >
      {dark ? (
        <>
          <svg
            className="overview-bags-wave"
            viewBox="0 0 240 112"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient
                id={`${id}-wave`}
                x1="0"
                y1="112"
                x2="240"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8b5cf6" stopOpacity="0" />
                <stop offset=".6" stopColor="#8051e8" stopOpacity=".16" />
                <stop offset="1" stopColor="#a573ff" stopOpacity=".22" />
              </linearGradient>
            </defs>
            <path
              d="M0 112c42-27 62-8 89-25s24-33 56-43S204 30 240 0v112Z"
              fill={`url(#${id}-wave)`}
            />
            <path
              d="M0 112c42-27 62-8 89-25s24-33 56-43S204 30 240 0"
              stroke="#a37dff"
              strokeOpacity=".4"
              strokeWidth=".9"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <OverviewBagArt className="overview-case-art" />
        </>
      ) : (
        <BagArt />
      )}
      <span className="overview-bags-copy">
        <strong>Túi chi tiêu</strong>
        <span>
          {activeCount
            ? `${activeCount} dịp đang được chăm chút`
            : 'Gom khoản chi cho từng dịp riêng'}
        </span>
      </span>
      {dark ? (
        <span className="overview-bags-arrow" aria-hidden="true">
          <ArrowUpRight size={21} />
        </span>
      ) : (
        <ArrowUpRight size={16} aria-hidden="true" />
      )}
    </button>
  )
}
