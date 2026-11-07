import { useId } from 'react'
import { ArrowRight, ChevronRight, Plus } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import { DARK_CATEGORY_COLORS } from '../../app/theme/palette'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import { CATEGORIES } from '../../shared/storage/data'
import './QuickCategories.css'

const cardSurfaces = {
  food: { shadow: '#29272d', shade: '#1d222c', tint: '#50382c', glow: '#ad723f' },
  shopping: { shadow: '#29243b', shade: '#1c1e31', tint: '#38294e', glow: '#714b94' },
  transport: { shadow: '#152d35', shade: '#112631', tint: '#12473f', glow: '#087f6c' },
  home: { shadow: '#17283d', shade: '#142137', tint: '#1d3b6c', glow: '#315fae' },
  fun: { shadow: '#302334', shade: '#241d30', tint: '#4e2848', glow: '#923b65' },
}
const wavePath = 'M0 153C35 141 49 122 86 116S139 115 162 85S204 43 240 33'

export default function QuickCategories({ onCategory, onViewAll }) {
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  const id = useId().replaceAll(':', '')
  return (
    <section className={`category-strip quick-category-panel ${dark ? 'fintech-quick-panel' : ''}`}>
      <div className="section-heading">
        {dark ? (
          <div className="quick-section-intro">
            <svg
              className="quick-section-symbol"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient
                  id={`${id}-tile`}
                  x1="8"
                  y1="5"
                  x2="40"
                  y2="44"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#37365c" />
                  <stop offset="1" stopColor="#232b43" />
                </linearGradient>
                <linearGradient
                  id={`${id}-glyph`}
                  x1="15"
                  y1="13"
                  x2="33"
                  y2="35"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#eadfff" />
                  <stop offset=".5" stopColor="#ba9cfa" />
                  <stop offset="1" stopColor="#8f6ad7" />
                </linearGradient>
              </defs>
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="14"
                fill={`url(#${id}-tile)`}
                stroke="#af93f2"
                strokeOpacity=".18"
              />
              {[
                [13, 13],
                [25, 13],
                [13, 25],
                [25, 25],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <rect
                    x={x}
                    y={y + 1.5}
                    width="10"
                    height="10"
                    rx="3.5"
                    fill="#171d39"
                    opacity=".5"
                  />
                  <rect x={x} y={y} width="10" height="10" rx="3.5" fill={`url(#${id}-glyph)`} />
                  <path
                    d={`M${x + 2} ${y + 1.5}h4`}
                    stroke="#fff"
                    strokeOpacity=".4"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </svg>
            <div>
              <h2>
                Chi tiêu theo <span>cách của bạn</span>
              </h2>
              <p>Chọn danh mục, ghi chi tiêu nhanh.</p>
            </div>
          </div>
        ) : (
          <h2>Chi tiêu theo cách của bạn</h2>
        )}
        <button
          type="button"
          className={dark ? 'quick-all-categories' : 'text-button'}
          onClick={onViewAll}
          aria-label="Tất cả danh mục"
          title="Tất cả danh mục"
        >
          <span>Tất cả danh mục</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="quick-categories">
        {CATEGORIES.slice(0, 5).map((category) => (
          <button
            type="button"
            key={category.id}
            className={dark ? 'quick-category-card' : undefined}
            style={{
              '--quick-tint': category.background,
              '--quick-accent': dark ? DARK_CATEGORY_COLORS[category.id] : category.color,
              '--quick-glow': cardSurfaces[category.id].glow,
              '--quick-shadow': cardSurfaces[category.id].shadow,
            }}
            onClick={() => onCategory(category.id)}
            aria-label={category.name}
            title={`Ghi chi tiêu ${category.name}`}
          >
            {dark ? (
              <>
                <svg
                  className="quick-category-wave"
                  viewBox="0 0 240 160"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <radialGradient
                      id={`${id}-${category.id}-surface`}
                      cx="246"
                      cy="-14"
                      r="232"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={cardSurfaces[category.id].glow} />
                      <stop offset=".22" stopColor={cardSurfaces[category.id].glow} />
                      <stop offset=".55" stopColor={cardSurfaces[category.id].tint} />
                      <stop offset=".82" stopColor={cardSurfaces[category.id].shade} />
                      <stop offset="1" stopColor={cardSurfaces[category.id].shadow} />
                    </radialGradient>
                    <linearGradient
                      id={`${id}-${category.id}-edge`}
                      x1="0"
                      y1="153"
                      x2="240"
                      y2="33"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={DARK_CATEGORY_COLORS[category.id]} stopOpacity=".04" />
                      <stop
                        offset=".55"
                        stopColor={DARK_CATEGORY_COLORS[category.id]}
                        stopOpacity=".08"
                      />
                      <stop
                        offset="1"
                        stopColor={DARK_CATEGORY_COLORS[category.id]}
                        stopOpacity=".3"
                      />
                    </linearGradient>
                  </defs>
                  <path d={`${wavePath}V0H0Z`} fill={`url(#${id}-${category.id}-surface)`} />
                  <path
                    d={wavePath}
                    stroke={`url(#${id}-${category.id}-edge)`}
                    strokeWidth=".7"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <CategoryArt category={category.id} size={64} />
                <span className="quick-category-add" aria-hidden="true">
                  <Plus size={15} />
                </span>
                <span className="quick-category-footer">
                  <strong>{category.name}</strong>
                  <span className="quick-category-arrow" aria-hidden="true">
                    <ChevronRight size={18} />
                  </span>
                </span>
              </>
            ) : (
              <>
                <span style={{ background: category.background }}>
                  <CategoryArt category={category.id} size={58} />
                </span>
                <strong>{category.name}</strong>
                <span className="quick-category-plus">
                  <Plus size={13} />
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
