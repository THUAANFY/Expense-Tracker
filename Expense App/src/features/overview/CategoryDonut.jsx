import { useId } from 'react'
import useAppearance from '../../app/theme/useAppearance'
import DarkCategoryArt from '../../app/theme/DarkCategoryArt'
import { categoryThemeColor } from '../../app/theme/palette'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import MonthPicker from '../../shared/components/MonthPicker'
import { compactMoney, money, monthKey } from '../../shared/storage/data'
import OverviewArt from './OverviewArt'
import './CategoryDonut.css'

const gradients = {
  food: ['#ffc2a0', '#ff9d72', '#f17d67'],
  shopping: ['#dac8ff', '#a78bfa', '#7958cf'],
  transport: ['#b7efdb', '#5ed6ad', '#319d89'],
  home: ['#bddcff', '#6aa4ff', '#3e6fd2'],
  fun: ['#f5c0ee', '#df75d4', '#ad46b3'],
  health: ['#ffd0e2', '#ff88b0', '#ce538e'],
  study: ['#c5f5f4', '#70d4e4', '#429ab9'],
  other: ['#dae5f7', '#acbddb', '#7589b0'],
}

export default function CategoryDonut({ totals, expense, onCategory, month, onMonthChange }) {
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  const id = useId().replaceAll(':', '')
  const sorted = [...totals]
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent - a.spent)
  let offset = 0
  const ringPoint = (radius, angle) =>
    `${87 + radius * Math.cos(angle)} ${87 + radius * Math.sin(angle)}`
  const slicePath = (start, end) => {
    const middle = (start + end) / 2
    return `M ${ringPoint(73.5, start)} A 73.5 73.5 0 0 1 ${ringPoint(73.5, middle)} A 73.5 73.5 0 0 1 ${ringPoint(73.5, end)} L ${ringPoint(54.5, end)} A 54.5 54.5 0 0 0 ${ringPoint(54.5, middle)} A 54.5 54.5 0 0 0 ${ringPoint(54.5, start)} Z`
  }
  const remaining = sorted.slice(3).reduce((sum, category) => sum + category.spent, 0)
  const rows = sorted.slice(0, 3)
  if (remaining > 0) rows.push({ id: 'all', name: 'Các danh mục khác', spent: remaining })
  const period =
    month === monthKey() ? 'Tháng này' : `Tháng ${Number(month.slice(-2))}/${month.slice(0, 4)}`
  const centerAmount =
    dark && expense >= 1e9
      ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(expense / 1e9)} tỷ`
      : compactMoney(expense)
  return (
    <section className={`panel category-panel ${dark ? 'fintech-category-panel' : ''}`}>
      <div className="panel-heading">
        <h2>Chi tiêu theo danh mục</h2>
        {dark ? (
          <MonthPicker
            value={month}
            onChange={onMonthChange}
            label="Chọn tháng chi tiêu theo danh mục"
            compact
            displayLabel={period}
          />
        ) : (
          <span className="tiny-label">THÁNG NÀY</span>
        )}
      </div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 174 174"
          role="img"
          aria-label={`Phân bổ chi tiêu: ${sorted.map((category) => `${category.name} ${money(category.spent)}`).join(', ') || 'chưa có chi tiêu'}`}
        >
          {dark && (
            <defs>
              {sorted.map((category) => {
                const colors = gradients[category.id] || gradients.other
                return (
                  <linearGradient
                    key={category.id}
                    id={`${id}-${category.id}`}
                    x1="20"
                    y1="87"
                    x2="154"
                    y2="87"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={colors[0]} />
                    <stop offset=".5" stopColor={colors[1]} />
                    <stop offset="1" stopColor={colors[2]} />
                  </linearGradient>
                )
              })}
            </defs>
          )}
          <circle cx="87" cy="87" r="64" fill="none" stroke="#f1eef6" strokeWidth="19" />
          {sorted.map((category) => {
            const fraction = category.spent / expense
            const start = offset * 2 * Math.PI - Math.PI / 2
            offset += fraction
            const end = offset * 2 * Math.PI - Math.PI / 2
            return (
              <path
                key={category.id}
                d={slicePath(start, end)}
                fill={dark ? `url(#${id}-${category.id})` : categoryThemeColor(category, theme)}
                data-category={category.id}
              />
            )
          })}
        </svg>
        <div className="donut-center">
          <span>Tổng chi tiêu</span>
          <strong title={money(expense)}>{centerAmount}</strong>
          <span>{sorted.length} danh mục</span>
        </div>
        {!dark && (
          <>
            <OverviewArt variant="flower" className="overview-donut-flower" />
            <span className="donut-spark two" aria-hidden="true">
              ✧
            </span>
          </>
        )}
      </div>
      <div className="donut-legend">
        {sorted.length ? (
          rows.map((category) => {
            const percentage = (category.spent / expense) * 100
            const percentLabel = percentage.toFixed(1).replace('.', ',')
            const colors = gradients[category.id] || gradients.other
            return dark ? (
              <button
                type="button"
                key={category.id}
                data-category={category.id}
                onClick={() => onCategory(category.id)}
                style={{
                  '--category-gradient': `linear-gradient(100deg, ${colors[2]}, ${colors[1]} 55%, ${colors[0]})`,
                }}
              >
                <span className="fintech-category-icon" aria-hidden="true">
                  <DarkCategoryArt
                    category={category.id === 'all' ? 'other' : category.id}
                    size={28}
                  />
                </span>
                <span className="fintech-category-details">
                  <span className="fintech-category-caption">
                    <span title={category.name}>{category.name}</span>
                    <b>{percentLabel}%</b>
                  </span>
                  <span className="fintech-category-track" aria-hidden="true">
                    <span style={{ width: `${percentage}%` }} />
                  </span>
                </span>
                <strong className="fintech-category-amount">{money(category.spent)}</strong>
              </button>
            ) : (
              <button key={category.id} onClick={() => onCategory(category.id)}>
                <span className="legend-name">
                  {category.id === 'all' ? (
                    <i style={{ background: '#c8cbd4' }} />
                  ) : (
                    <span
                      className="overview-legend-art"
                      style={{ background: category.background }}
                    >
                      <CategoryArt category={category.id} size={26} />
                    </span>
                  )}
                  {category.name}
                </span>
                <strong>
                  {percentLabel}
                  <span>%</span>
                </strong>
              </button>
            )
          })
        ) : (
          <p className="category-empty-message muted center">Chưa có chi tiêu trong tháng này.</p>
        )}
      </div>
    </section>
  )
}
