import { useId, useRef, useState } from 'react'
import { money } from '../data'

export default function SpendingChart({ transactions, month }) {
  const gradient = useId().replaceAll(':', '')
  const svgRef = useRef(null)
  const [active, setActive] = useState(null)
  const [year, monthNumber] = month.split('-').map(Number)
  const days = new Date(year, monthNumber, 0).getDate()
  const values = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    total: transactions
      .filter((item) => item.type === 'expense' && Number(item.date.slice(-2)) === index + 1)
      .reduce((total, item) => total + item.amount, 0),
  }))
  const width = 700
  const height = 174
  const plotStart = 8
  const plotEnd = width - 8
  const xForDay = (day) => plotStart + ((day - 1) / (days - 1)) * (plotEnd - plotStart)
  const percentForDay = (day) => (xForDay(day) / width) * 100
  const max = Math.max(1000000, ...values.map((value) => value.total))
  const ceiling = Math.ceil(max / 1000000) * 1000000
  const coordinates = values.map((value) => ({
    x: xForDay(value.day),
    y: 14 + (1 - value.total / ceiling) * (height - 30),
    ...value,
  }))
  const line = coordinates
    .map((point, index) => {
      if (index === 0) return `M ${point.x},${point.y}`
      const previous = coordinates[index - 1]
      const center = (point.x + previous.x) / 2
      return `C ${center},${previous.y} ${center},${point.y} ${point.x},${point.y}`
    })
    .join(' ')
  const handlePointer = (event) => {
    const box = svgRef.current?.getBoundingClientRect()
    if (!box?.width) return
    const plotX = ((event.clientX - box.left) / box.width) * width
    setActive(
      Math.max(
        0,
        Math.min(days - 1, Math.round(((plotX - plotStart) / (plotEnd - plotStart)) * (days - 1))),
      ),
    )
  }
  return (
    <div className="spending-chart">
      <div className="chart-y-labels">
        {[1, 0.75, 0.5, 0.25, 0].map((value) => (
          <span key={value}>
            {value === 0
              ? '0'
              : `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format((ceiling * value) / 1000000)} tr`}
          </span>
        ))}
      </div>
      <div
        className="chart-drawing"
        onPointerMove={handlePointer}
        onPointerLeave={() => setActive(null)}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Chi tiêu mỗi ngày tháng ${monthNumber}: tổng ${money(values.reduce((total, value) => total + value.total, 0))}`}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ae9cdd" stopOpacity=".38" />
              <stop offset="100%" stopColor="#ae9cdd" stopOpacity=".015" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((value) => (
            <line
              key={value}
              x1="0"
              x2={width}
              y1={14 + value * (height - 30)}
              y2={14 + value * (height - 30)}
              stroke="#e9e9ef"
              strokeDasharray="4 5"
            />
          ))}
          <path
            d={`${line} L ${plotEnd},${height - 16} L ${plotStart},${height - 16} Z`}
            fill={`url(#${gradient})`}
          />
          <path
            d={line}
            fill="none"
            stroke="#9a84cc"
            strokeWidth="2.7"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
          {active !== null && (
            <>
              <line
                x1={coordinates[active].x}
                x2={coordinates[active].x}
                y1="0"
                y2={height - 16}
                stroke="#b4a3d8"
                strokeDasharray="4 3"
              />
              <circle
                cx={coordinates[active].x}
                cy={coordinates[active].y}
                r="5"
                fill="#8f75c5"
                stroke="white"
                strokeWidth="3"
              />
            </>
          )}
        </svg>
        {active !== null && (
          <div
            className="chart-tooltip"
            style={{
              left: `${Math.max(14, Math.min(84, percentForDay(coordinates[active].day)))}%`,
            }}
          >
            <span>
              Ngày {coordinates[active].day}/{monthNumber}
            </span>
            <strong>{money(coordinates[active].total)}</strong>
          </div>
        )}
        <div className="chart-x-labels">
          {[1, 5, 10, 15, 20, 25, days].map((day) => (
            <span key={day} data-day={day} style={{ left: `${percentForDay(day)}%` }}>
              {String(day).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
