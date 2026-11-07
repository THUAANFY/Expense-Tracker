import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { formatDate, money } from '../../shared/storage/data'
import useAppearance from '../../app/theme/useAppearance'

const tickFormatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export default function SpendingChart({ transactions, month, type = 'expense' }) {
  const { theme } = useAppearance()
  const bars = theme === 'dark'
  const gradient = useId().replaceAll(':', '')
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const [active, setActive] = useState(null)
  const seriesType = bars ? type : 'expense'
  const seriesLabel = seriesType === 'income' ? 'Thu nhập' : 'Chi tiêu'
  const [year, monthNumber] = month.split('-').map(Number)
  const days = new Date(year, monthNumber, 0).getDate()
  // Hover changes only the selected day; aggregate the financial series once per input change.
  const values = useMemo(() => {
    const daily = Array.from({ length: days }, (_, index) => ({ day: index + 1, total: 0 }))
    for (const item of transactions) {
      if (item.type !== seriesType || !item.date.startsWith(`${month}-`)) continue
      const day = daily[Number(item.date.slice(-2)) - 1]
      if (day) day.total += item.amount
    }
    return daily
  }, [days, month, seriesType, transactions])
  const width = 700
  const height = 174
  const plotTop = bars ? 28 : 14
  const plotBottom = height - 16
  const plotHeight = plotBottom - plotTop
  const plotStart = 8
  const plotEnd = width - 8
  const xForDay = (day) => plotStart + ((day - 1) / (days - 1)) * (plotEnd - plotStart)
  const percentForDay = (day) => (xForDay(day) / width) * 100
  const max = Math.max(1000000, ...values.map((value) => value.total))
  const ceiling = Math.ceil(max / 1000000) * 1000000
  const ticks = [1, 0.75, 0.5, 0.25, 0]
  const formatTick = (value) => {
    if (value === 0) return '0'
    return `${tickFormatter.format((ceiling * value) / 1000000)} tr`
  }
  const coordinates = values.map((value) => ({
    x: xForDay(value.day),
    y: plotTop + (1 - value.total / ceiling) * plotHeight,
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
  const handleKey = (event) => {
    if (!bars || !['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Escape') setActive(null)
    else if (event.key === 'Home') setActive(0)
    else if (event.key === 'End') setActive(days - 1)
    else
      setActive((day) =>
        Math.max(0, Math.min(days - 1, (day ?? 0) + (event.key === 'ArrowRight' ? 1 : -1))),
      )
  }
  const tooltipVisible = active !== null
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current
    if (!bars || !tooltip) return
    const measure = () => tooltip.style.setProperty('--tooltip-width', `${tooltip.offsetWidth}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(tooltip)
    return () => observer.disconnect()
  }, [bars, tooltipVisible])
  return (
    <div
      className={`spending-chart ${bars ? 'is-bar-chart' : ''}`}
      data-series={seriesType}
      style={
        bars
          ? {
              '--chart-axis-width': `${Math.max(...ticks.map((value) => formatTick(value).length))}ch`,
            }
          : undefined
      }
    >
      <div className="chart-y-labels">
        {ticks.map((value) => (
          <span
            key={value}
            style={
              bars
                ? { top: `${((plotTop + (1 - value) * plotHeight) / height) * 100}%` }
                : undefined
            }
          >
            {formatTick(value)}
          </span>
        ))}
      </div>
      <div
        className="chart-drawing"
        tabIndex={bars ? 0 : undefined}
        role={bars ? 'group' : undefined}
        aria-label={bars ? 'Chi tiết theo ngày. Dùng phím mũi tên để xem các ngày.' : undefined}
        onPointerMove={handlePointer}
        onPointerDown={bars ? handlePointer : undefined}
        onPointerLeave={() => setActive(null)}
        onFocus={bars ? () => setActive((day) => day ?? 0) : undefined}
        onBlur={bars ? () => setActive(null) : undefined}
        onKeyDown={handleKey}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${seriesLabel} mỗi ngày tháng ${monthNumber}: tổng ${money(values.reduce((total, value) => total + value.total, 0))}`}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ae9cdd" stopOpacity=".38" />
              <stop offset="100%" stopColor="#ae9cdd" stopOpacity=".015" />
            </linearGradient>
            <linearGradient id={`${gradient}-bar`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#9c83da" stopOpacity=".85" />
              <stop offset="1" stopColor="#6a509c" stopOpacity=".22" />
            </linearGradient>
            <linearGradient id={`${gradient}-active`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ecdfff" />
              <stop offset=".25" stopColor="#b68aff" />
              <stop offset="1" stopColor="#8355d5" stopOpacity=".4" />
            </linearGradient>
            <linearGradient id={`${gradient}-lane`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#b790ff" stopOpacity="0" />
              <stop offset="1" stopColor="#ad81ff" stopOpacity=".14" />
            </linearGradient>
          </defs>
          {ticks.map((value) => (
            <line
              key={value}
              x1="0"
              x2={width}
              y1={plotTop + (1 - value) * plotHeight}
              y2={plotTop + (1 - value) * plotHeight}
              stroke="#e9e9ef"
              strokeDasharray="4 5"
            />
          ))}
          {bars && active !== null && (
            <rect
              x={Math.max(0, Math.min(width - 22, coordinates[active].x - 11))}
              y="0"
              width="22"
              height={height - 16}
              rx="5"
              fill={`url(#${gradient}-lane)`}
            />
          )}
          {bars ? (
            coordinates.map((point, index) => (
              <rect
                key={point.day}
                className={`spending-bar ${active === index ? 'is-active' : ''}`}
                data-day={point.day}
                data-value={point.total}
                x={point.x - 6}
                y={point.total ? point.y : height - 17.5}
                width="12"
                height={Math.max(1.5, height - 16 - point.y)}
                rx="4"
                opacity={point.total ? (active === null || active === index ? 1 : 0.75) : 0.15}
                fill={`url(#${gradient}-${active === index ? 'active' : 'bar'})`}
              />
            ))
          ) : (
            <>
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
            </>
          )}
          {!bars && active !== null && (
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
        {bars && active !== null && (
          <span
            className="chart-active-dot"
            aria-hidden="true"
            style={{
              left: `${percentForDay(coordinates[active].day)}%`,
              top: `calc(var(--chart-height) * ${coordinates[active].y / height})`,
            }}
          />
        )}
        {active !== null && (
          <div
            ref={tooltipRef}
            className="chart-tooltip"
            role="tooltip"
            style={{
              left: bars
                ? `clamp(0px, calc(${percentForDay(coordinates[active].day)}% - var(--tooltip-width, 96px) / 2), calc(100% - var(--tooltip-width, 96px)))`
                : `${Math.max(14, Math.min(84, percentForDay(coordinates[active].day)))}%`,
              top: bars
                ? `calc(var(--chart-height) * ${coordinates[active].y / height} - 8px)`
                : undefined,
            }}
          >
            {bars && <strong>{money(coordinates[active].total)}</strong>}
            <span>
              {bars
                ? formatDate(`${month}-${String(coordinates[active].day).padStart(2, '0')}`)
                : `Ngày ${coordinates[active].day}/${monthNumber}`}
            </span>
            {!bars && <strong>{money(coordinates[active].total)}</strong>}
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
