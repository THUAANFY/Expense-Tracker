import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDownWideNarrow,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CalendarDays,
  FileText,
  Layers,
  LayoutGrid,
  PencilLine,
  SlidersHorizontal,
  Sparkles,
  Tags,
  TrendingUp,
  Wallet,
  WalletCards,
  Zap,
} from 'lucide-react'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import useAppearance from '../../app/theme/useAppearance'
import { categoryThemeColor } from '../../app/theme/palette'
import BudgetFilterEmpty from './BudgetFilterEmpty'
import { money } from '../../shared/storage/data'
import './CategoriesView.css'
import './FintechBudgetOverview.css'
import './FintechBudgetLibrary.css'

const getState = (spent, budget) =>
  spent > budget
    ? 'over'
    : spent > 0 && spent >= budget * 0.8
      ? 'near'
      : spent > 0
        ? 'within'
        : 'empty'
const budgetPercent = (spent, budget) =>
  budget > 0 ? Math.round((spent / budget) * 100) : spent > 0 ? 100 : 0
const stateLabels = {
  over: 'Vượt hạn mức',
  near: 'Gần hạn mức',
  within: 'Trong hạn mức',
  empty: 'Chưa phát sinh',
}

function BudgetProgress({ spent, budget, label, color }) {
  const percent = budgetPercent(spent, budget)
  return (
    <div
      className="category-budget-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(100, percent)}
      aria-valuetext={
        budget === 0
          ? `Hạn mức 0 ₫ — đã chi ${money(spent)}`
          : `${percent}% — đã chi ${money(spent)} trên hạn mức ${money(budget)}`
      }
    >
      <span style={{ width: `${Math.min(100, percent)}%`, background: color }} />
    </div>
  )
}

function BudgetOrbit({ spent, budget }) {
  const { theme } = useAppearance()
  const id = `budget-orbit-${useId().replaceAll(':', '')}`
  const percent = budgetPercent(spent, budget)
  const percentLabel = percent.toLocaleString('vi-VN')
  const circumference = 2 * Math.PI * 43
  const ratio = Math.min(1, budget > 0 ? spent / budget : spent > 0 ? 1 : 0)
  const angle = ratio * Math.PI * 2 - Math.PI / 2
  const markerX = 52 + Math.cos(angle) * 43
  const markerY = 52 + Math.sin(angle) * 43
  return (
    <div
      className="category-budget-orbit"
      style={{ '--budget-percent-units': percentLabel.length * 0.7 + 1 }}
      role="progressbar"
      aria-label="Ngân sách tổng đã sử dụng"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(100, percent)}
      aria-valuetext={`${percent}% — đã chi ${money(spent)} trên ngân sách ${money(budget)}`}
    >
      {theme === 'dark' ? (
        <svg viewBox="-7 -7 118 118" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-progress`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#eccbff" />
              <stop offset=".4" stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".65" />
            </linearGradient>
            <radialGradient id={`${id}-light`}>
              <stop stopColor="#fff" />
              <stop offset=".2" stopColor="#fff1ff" stopOpacity=".95" />
              <stop offset=".45" stopColor="#deb5ff" stopOpacity=".75" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="category-budget-orbit-track" cx="52" cy="52" r="43" strokeWidth="10" />
          <circle
            className="category-budget-orbit-fill"
            cx="52"
            cy="52"
            r="43"
            stroke={`url(#${id}-progress)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
            transform="rotate(-90 52 52)"
          />
          <circle cx={markerX} cy={markerY} r="12" fill={`url(#${id}-light)`} />
          <circle cx={markerX} cy={markerY} r="3" fill="#fff1ff" />
        </svg>
      ) : (
        <svg viewBox="0 0 104 104" fill="none" aria-hidden="true">
          <circle
            cx="52"
            cy="52"
            r="50"
            stroke="currentColor"
            strokeOpacity=".15"
            strokeDasharray="1 5"
          />
          <circle
            cx="52"
            cy="52"
            r="43"
            stroke="currentColor"
            strokeOpacity=".13"
            strokeWidth="7"
          />
          <circle
            className="category-budget-orbit-fill"
            cx="52"
            cy="52"
            r="43"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.min(1, spent / budget))}
            transform="rotate(-90 52 52)"
          />
        </svg>
      )}
      <span aria-hidden="true">
        <strong>
          {percentLabel}
          <small>%</small>
        </strong>
        <span>đã dùng</span>
      </span>
    </div>
  )
}

function CategoryBudgetCard({
  category,
  budget,
  count,
  number,
  onEdit,
  onView,
  readOnly,
  automatic,
  weight,
  legacy,
}) {
  const titleId = useId()
  const { theme } = useAppearance()
  const state = getState(category.spent, budget)
  const remaining = budget - category.spent
  const percent = budgetPercent(category.spent, budget)
  const progressColor = state === 'over' ? '#bb5265' : state === 'near' ? '#bb843f' : category.color
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`budget-category-card is-${state}`}
      data-category={category.id}
      style={{
        '--category-tint': category.background,
        '--category-accent': categoryThemeColor(category, theme),
        '--category-ink': category.textColor,
      }}
      aria-labelledby={titleId}
    >
      <div className="budget-category-heading">
        <span className="budget-category-symbol">
          <CategoryArt category={category.id} size={58} />
          <span className="budget-category-number" aria-hidden="true">
            {String(number).padStart(2, '0')}
          </span>
        </span>
        <div>
          <h3 id={titleId}>{category.name}</h3>
          <p>{category.description}</p>
        </div>
        <button
          type="button"
          className="budget-category-edit"
          aria-label={`Chỉnh ngân sách ${category.name}`}
          title={readOnly ? 'Tháng đã qua chỉ được xem' : 'Điều chỉnh hạn mức'}
          disabled={readOnly}
          onClick={() => onEdit(category)}
        >
          <PencilLine size={15} />
        </button>
      </div>
      <div className="budget-category-main">
        <div className="budget-category-spent">
          <span>Đã chi trong tháng</span>
          <span className={`budget-state is-${state}`}>
            <span aria-hidden="true" />
            {category.spent > 0 && category.spent === budget ? 'Đã dùng hết' : stateLabels[state]}
          </span>
          <strong>{money(category.spent)}</strong>
        </div>
        <div className="budget-category-limit">
          <span>
            Hạn mức <strong>{money(budget)}</strong>
          </span>
          <span>{budget > 0 ? `${percent.toLocaleString('vi-VN')}%` : '—'}</span>
        </div>
        <BudgetProgress
          spent={category.spent}
          budget={budget}
          label={`Ngân sách ${category.name}`}
          color={progressColor}
        />
        <p className={`budget-category-remaining ${state === 'over' ? 'is-over' : ''}`}>
          {remaining < 0 ? (
            <CircleAlert size={12} />
          ) : (
            <span className="budget-remaining-dot" aria-hidden="true" />
          )}
          {remaining < 0 ? 'Vượt' : 'Còn'} <strong>{money(Math.abs(remaining))}</strong>
        </p>
      </div>
      <div className="budget-category-footer">
        <span>
          <span
            className={`budget-allocation-mode ${automatic ? 'is-auto' : ''}`}
            title={
              automatic
                ? `Tỷ lệ phân bổ ${weight}%; chia theo phần ngân sách còn lại sau các mức đặt riêng.`
                : 'Hạn mức đã đặt riêng cho tháng này'
            }
          >
            {automatic ? (
              theme === 'dark' ? (
                <Zap size={12} />
              ) : (
                <Sparkles size={11} />
              )
            ) : (
              <PencilLine size={11} />
            )}
            {automatic ? 'Tự động' : legacy ? 'Đã lưu' : 'Đặt riêng'}
          </span>
          <span className="budget-transaction-count">
            {theme !== 'dark' && <FileText size={11} />}
            {count} giao dịch
          </span>
        </span>
        <button
          type="button"
          aria-label={`Xem giao dịch ${category.name}`}
          onClick={() => onView(category.id)}
        >
          Xem chi tiết {theme === 'dark' ? <ArrowRight size={14} /> : <ArrowUpRight size={14} />}
        </button>
      </div>
    </motion.article>
  )
}

export default function CategoriesView({
  categories,
  budgets,
  plan,
  totalBudget,
  spent,
  transactions,
  month,
  readOnly = false,
  onEditBudget,
  onEditTotalBudget,
  onResetBudgets,
  onViewTransactions,
}) {
  const [filter, setFilter] = useState('all')
  const { theme } = useAppearance()
  const [sortBySpent, setSortBySpent] = useState(false)
  const [limitsExpanded, setLimitsExpanded] = useState(false)
  const limitsPanelId = useId()
  const totalLimits = categories.reduce((sum, category) => sum + budgets[category.id], 0)
  const near = categories.filter(
    (category) => getState(category.spent, budgets[category.id]) === 'near',
  ).length
  const over = categories.filter(
    (category) => getState(category.spent, budgets[category.id]) === 'over',
  ).length
  const activeCount = categories.filter((category) => category.spent > 0).length
  const remaining = totalBudget - spent
  const counts = new Map()
  for (const transaction of transactions)
    counts.set(transaction.category, (counts.get(transaction.category) || 0) + 1)
  const visibleCategories = categories.filter(
    (category) => filter === 'all' || getState(category.spent, budgets[category.id]) === filter,
  )
  if (sortBySpent) visibleCategories.sort((a, b) => b.spent - a.spent)
  const monthCaption = `Tháng ${Number(month.slice(5))}, ${month.slice(0, 4)}`

  return (
    <div className="categories-workspace">
      <section className="category-budget-overview" aria-label="Tổng quan ngân sách">
        <div
          className={`category-month-budget ${remaining < 0 ? 'is-over' : ''}`}
          data-budget-state={getState(spent, totalBudget)}
          data-large-amounts={Math.max(totalBudget, spent) >= 1e10 || undefined}
        >
          <div className="category-overview-heading">
            <span className="category-overview-icon">
              <Wallet size={19} />
            </span>
            <div>
              <h2>Ngân sách tháng</h2>
              <span>{monthCaption}</span>
            </div>
            <button
              type="button"
              aria-label="Điều chỉnh ngân sách tháng"
              title="Điều chỉnh ngân sách tổng"
              disabled={readOnly}
              onClick={onEditTotalBudget}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
          <div className="category-overview-balance">
            <div className="category-overview-remaining">
              <span>{remaining < 0 ? 'Đã vượt ngân sách' : 'Còn trong ngân sách'}</span>
              <strong>{money(Math.abs(remaining))}</strong>
            </div>
            <BudgetOrbit spent={spent} budget={totalBudget} />
          </div>
          <div className="category-overview-usage">
            <span>
              <span className="category-overview-usage-label">
                {theme === 'dark' && <ArrowDownToLine size={15} aria-hidden="true" />}Đã chi
              </span>
              <strong>{money(spent)}</strong>
            </span>
            <span>
              <span className="category-overview-usage-label">
                {theme === 'dark' && <Layers size={15} aria-hidden="true" />}Ngân sách tháng
              </span>
              <strong>{money(totalBudget)}</strong>
            </span>
          </div>
        </div>
        <div
          className={`category-limits-summary ${limitsExpanded ? 'is-expanded' : ''}`}
          data-large-total={totalLimits >= 1e10 || undefined}
        >
          <button
            type="button"
            className="category-limits-toggle"
            aria-label="Chi tiết hạn mức danh mục"
            aria-expanded={limitsExpanded}
            aria-controls={limitsPanelId}
            onClick={() => setLimitsExpanded(!limitsExpanded)}
          >
            <ChevronDown size={16} />
          </button>
          {theme === 'dark' ? (
            <div className="category-limits-topline">
              <span className="category-limits-eyebrow">
                <Tags size={18} />
                Hạn mức theo danh mục
              </span>
              <span className="category-limits-count">
                <Layers size={16} aria-hidden="true" />
                {categories.length} danh mục
              </span>
            </div>
          ) : (
            <span className="category-limits-eyebrow">
              <Tags size={13} /> HẠN MỨC THEO DANH MỤC
            </span>
          )}
          <div className="category-limits-total">
            <strong>{money(totalLimits)}</strong>
            {theme !== 'dark' && <span>{categories.length} danh mục</span>}
          </div>
          <div className="category-limits-details" id={limitsPanelId}>
            <div
              className="category-limits-distribution"
              role="img"
              aria-label={`Tổng hạn mức ${money(totalLimits)}. ${categories.map((category) => `${category.name}: ${money(budgets[category.id])}`).join(', ')}`}
            >
              {categories
                .filter((category) => budgets[category.id] > 0)
                .map((category) => (
                  <span
                    key={category.id}
                    style={{
                      flex: budgets[category.id],
                      '--distribution-color': categoryThemeColor(category, theme),
                    }}
                    title={`${category.name}: ${money(budgets[category.id])}`}
                  />
                ))}
            </div>
            <div className="category-limits-status">
              <span className="is-active">
                {theme === 'dark' && (
                  <span className="category-limit-status-icon" aria-hidden="true">
                    <CircleCheck size={22} />
                  </span>
                )}
                <strong>{activeCount.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot green" />
                  Có chi tiêu
                </span>
              </span>
              <span className="is-near">
                {theme === 'dark' && (
                  <span className="category-limit-status-icon" aria-hidden="true">
                    <CalendarDays size={22} />
                  </span>
                )}
                <strong>{near.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot amber" />
                  Gần hạn mức
                </span>
              </span>
              <span className="is-over">
                {theme === 'dark' && (
                  <span className="category-limit-status-icon" aria-hidden="true">
                    <TrendingUp size={23} />
                  </span>
                )}
                <strong>{over.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot red" />
                  Đã vượt
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="category-budget-library" aria-labelledby="category-budget-library-title">
        <div className="category-library-heading">
          {theme === 'dark' && (
            <span className="category-library-mark" aria-hidden="true">
              <WalletCards size={23} />
            </span>
          )}
          <div>
            <h2 id="category-budget-library-title">
              Phong bì của bạn <span>{categories.length}</span>
            </h2>
            <p>Một danh mục, một hạn mức. Gọn gàng từng khoản chi.</p>
          </div>
          <button
            type="button"
            className={`category-sort-button ${sortBySpent ? 'is-active' : ''}`}
            aria-label="Sắp xếp theo mức chi"
            aria-pressed={sortBySpent}
            title={sortBySpent ? 'Trở về thứ tự mặc định' : 'Sắp xếp theo mức chi'}
            onClick={() => setSortBySpent(!sortBySpent)}
          >
            <ArrowDownWideNarrow size={15} />
            Chi nhiều nhất{sortBySpent && <Check size={12} />}
          </button>
        </div>
        <div className="category-library-toolbar">
          <div
            className="category-status-filters"
            data-filter-tabs
            role="group"
            aria-label="Lọc trạng thái ngân sách"
          >
            {[
              { key: 'all', label: 'Tất cả', count: categories.length },
              { key: 'near', label: 'Gần hạn mức', count: near },
              { key: 'over', label: 'Đã vượt', count: over },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                className={`is-${key} ${filter === key ? 'is-active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {key === 'all' ? (
                  theme === 'dark' && <LayoutGrid size={13} aria-hidden="true" />
                ) : (
                  <span className="category-status-dot" aria-hidden="true" />
                )}
                {label}
                <span data-filter-count className="category-filter-count">
                  {count}
                </span>
              </button>
            ))}
          </div>
          <div className="category-library-options">
            {plan.mode === 'auto' && plan.customIds.length > 0 && !readOnly && (
              <button type="button" className="category-reset-button" onClick={onResetBudgets}>
                <Sparkles size={13} aria-hidden="true" />
                Dùng tỷ lệ tự động
              </button>
            )}
            <span className="category-results" role="status" aria-live="polite">
              {visibleCategories.length} danh mục
            </span>
          </div>
        </div>
        {visibleCategories.length ? (
          <div className="category-budget-grid">
            <AnimatePresence initial={false}>
              {visibleCategories.map((category) => (
                <CategoryBudgetCard
                  key={category.id}
                  category={category}
                  budget={budgets[category.id]}
                  readOnly={readOnly}
                  automatic={plan.mode === 'auto' && !plan.customIds.includes(category.id)}
                  weight={plan.weights[category.id]}
                  legacy={plan.mode === 'legacy'}
                  count={counts.get(category.id) || 0}
                  number={categories.findIndex((item) => item.id === category.id) + 1}
                  onEdit={onEditBudget}
                  onView={onViewTransactions}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <BudgetFilterEmpty filter={filter} onShowAll={() => setFilter('all')} />
        )}
      </section>
    </div>
  )
}
