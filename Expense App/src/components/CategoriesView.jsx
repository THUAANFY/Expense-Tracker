import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDownWideNarrow,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  PencilLine,
  SlidersHorizontal,
  Tags,
  Wallet,
} from 'lucide-react'
import CategoryArt from './CategoryArt'
import { money } from '../data'
import './CategoriesView.css'

const getState = (spent, budget) =>
  spent > budget ? 'over' : spent >= budget * 0.8 ? 'near' : spent > 0 ? 'within' : 'empty'
const stateLabels = {
  over: 'Vượt hạn mức',
  near: 'Gần hạn mức',
  within: 'Trong hạn mức',
  empty: 'Chưa phát sinh',
}

function BudgetProgress({ spent, budget, label, color }) {
  const percent = Math.round((spent / budget) * 100)
  return (
    <div
      className="category-budget-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(100, percent)}
      aria-valuetext={`${percent}% — đã chi ${money(spent)} trên hạn mức ${money(budget)}`}
    >
      <span style={{ width: `${Math.min(100, percent)}%`, background: color }} />
    </div>
  )
}

function BudgetOrbit({ spent, budget }) {
  const percent = Math.round((spent / budget) * 100)
  const circumference = 2 * Math.PI * 43
  return (
    <div
      className="category-budget-orbit"
      role="progressbar"
      aria-label="Ngân sách tổng đã sử dụng"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(100, percent)}
      aria-valuetext={`${percent}% — đã chi ${money(spent)} trên ngân sách ${money(budget)}`}
    >
      <svg viewBox="0 0 104 104" fill="none" aria-hidden="true">
        <circle
          cx="52"
          cy="52"
          r="50"
          stroke="currentColor"
          strokeOpacity=".15"
          strokeDasharray="1 5"
        />
        <circle cx="52" cy="52" r="43" stroke="currentColor" strokeOpacity=".13" strokeWidth="7" />
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
      <span aria-hidden="true">
        <strong>
          {percent.toLocaleString('vi-VN')}
          <small>%</small>
        </strong>
        <span>đã dùng</span>
      </span>
    </div>
  )
}

function CategoryBudgetCard({ category, budget, count, number, onEdit, onView }) {
  const titleId = useId()
  const state = getState(category.spent, budget)
  const remaining = budget - category.spent
  const percent = Math.round((category.spent / budget) * 100)
  const progressColor = state === 'over' ? '#bb5265' : state === 'near' ? '#bb843f' : category.color
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`budget-category-card is-${state}`}
      style={{
        '--category-tint': category.background,
        '--category-accent': category.color,
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
          title="Điều chỉnh hạn mức"
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
            {category.spent === budget ? 'Đã dùng hết' : stateLabels[state]}
          </span>
          <strong>{money(category.spent)}</strong>
        </div>
        <div className="budget-category-limit">
          <span>
            Hạn mức <strong>{money(budget)}</strong>
          </span>
          <span>{percent.toLocaleString('vi-VN')}%</span>
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
          <FileText size={12} />
          {count} giao dịch
        </span>
        <button
          type="button"
          aria-label={`Xem giao dịch ${category.name}`}
          onClick={() => onView(category.id)}
        >
          Xem chi tiết <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.article>
  )
}

export default function CategoriesView({
  categories,
  budgets,
  totalBudget,
  spent,
  transactions,
  month,
  onEditBudget,
  onEditTotalBudget,
  onViewTransactions,
}) {
  const [filter, setFilter] = useState('all')
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
        <div className={`category-month-budget ${remaining < 0 ? 'is-over' : ''}`}>
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
              Đã chi <strong>{money(spent)}</strong>
            </span>
            <span>
              Ngân sách tháng <strong>{money(totalBudget)}</strong>
            </span>
          </div>
        </div>
        <div className={`category-limits-summary ${limitsExpanded ? 'is-expanded' : ''}`}>
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
          <span className="category-limits-eyebrow">
            <Tags size={13} /> HẠN MỨC THEO DANH MỤC
          </span>
          <div className="category-limits-total">
            <strong>{money(totalLimits)}</strong>
            <span>{categories.length} danh mục</span>
          </div>
          <div className="category-limits-details" id={limitsPanelId}>
            <div
              className="category-limits-distribution"
              role="img"
              aria-label={`Tổng hạn mức ${money(totalLimits)}. ${categories.map((category) => `${category.name}: ${money(budgets[category.id])}`).join(', ')}`}
            >
              {categories.map((category) => (
                <span
                  key={category.id}
                  style={{ flex: budgets[category.id], background: category.color }}
                  title={`${category.name}: ${money(budgets[category.id])}`}
                />
              ))}
            </div>
            <div className="category-limits-status">
              <span className="is-active">
                <strong>{activeCount.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot green" />
                  Có chi tiêu
                </span>
              </span>
              <span className="is-near">
                <strong>{near.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot amber" />
                  Gần hạn mức
                </span>
              </span>
              <span className="is-over">
                <strong>{over.toString().padStart(2, '0')}</strong>
                <span>
                  <span className="category-status-dot red" />
                  Đã vượt
                </span>
              </span>
            </div>
            <p>Ngân sách tổng và hạn mức danh mục được đặt riêng.</p>
          </div>
        </div>
      </section>

      <section className="category-budget-library" aria-labelledby="category-budget-library-title">
        <div className="category-library-heading">
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
                {key !== 'all' && <span className="category-status-dot" />}
                {label}
                <span className="category-filter-count">{count}</span>
              </button>
            ))}
          </div>
          <span className="category-results" role="status" aria-live="polite">
            {visibleCategories.length} danh mục
          </span>
        </div>
        {visibleCategories.length ? (
          <div className="category-budget-grid">
            <AnimatePresence initial={false}>
              {visibleCategories.map((category) => (
                <CategoryBudgetCard
                  key={category.id}
                  category={category}
                  budget={budgets[category.id]}
                  count={counts.get(category.id) || 0}
                  number={categories.findIndex((item) => item.id === category.id) + 1}
                  onEdit={onEditBudget}
                  onView={onViewTransactions}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="category-budget-empty">
            <span>
              <Check size={25} strokeWidth={1.5} />
            </span>
            <h3>
              {filter === 'over' ? 'Chưa có danh mục vượt hạn mức' : 'Chưa có danh mục gần hạn mức'}
            </h3>
            <p>Các khoản chi được cập nhật theo tháng bạn đang xem.</p>
            <button className="button secondary" onClick={() => setFilter('all')}>
              Xem tất cả danh mục
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
