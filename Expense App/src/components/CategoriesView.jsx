import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDownWideNarrow,
  ArrowUpRight,
  Check,
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

function CategoryBudgetCard({ category, budget, count, onEdit, onView }) {
  const titleId = useId()
  const state = getState(category.spent, budget)
  const remaining = budget - category.spent
  const percent = Math.round((category.spent / budget) * 100)
  const progressColor = state === 'over' ? '#cf777d' : state === 'near' ? '#d0a063' : category.color
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`budget-category-card is-${state}`}
      aria-labelledby={titleId}
    >
      <div className="budget-category-heading">
        <span className="budget-category-symbol" style={{ background: category.background }}>
          <CategoryArt category={category.id} size={49} />
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
  const totalLimits = categories.reduce((sum, category) => sum + budgets[category.id], 0)
  const near = categories.filter(
    (category) => getState(category.spent, budgets[category.id]) === 'near',
  ).length
  const over = categories.filter(
    (category) => getState(category.spent, budgets[category.id]) === 'over',
  ).length
  const activeCount = categories.filter((category) => category.spent > 0).length
  const remaining = totalBudget - spent
  const totalPercent = Math.round((spent / totalBudget) * 100)
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
          <div className="category-overview-remaining">
            <span>{remaining < 0 ? 'Đã vượt ngân sách' : 'Còn trong ngân sách'}</span>
            <strong>{money(Math.abs(remaining))}</strong>
          </div>
          <div className="category-overview-usage">
            <span>
              Đã chi <strong>{money(spent)}</strong> / {money(totalBudget)}
            </span>
            <span>{totalPercent.toLocaleString('vi-VN')}%</span>
          </div>
          <BudgetProgress spent={spent} budget={totalBudget} label="Ngân sách tổng đã sử dụng" />
        </div>
        <div className="category-limits-summary">
          <span className="category-limits-eyebrow">
            <Tags size={13} /> HẠN MỨC THEO DANH MỤC
          </span>
          <div className="category-limits-total">
            <strong>{money(totalLimits)}</strong>
            <span>{categories.length} danh mục</span>
          </div>
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
            <span>
              <span className="category-status-dot green" />
              {activeCount} có chi tiêu
            </span>
            <span>
              <span className="category-status-dot amber" />
              {near} gần hạn mức
            </span>
            <span>
              <span className="category-status-dot red" />
              {over} đã vượt
            </span>
          </div>
          <p>Ngân sách tổng và hạn mức danh mục được đặt riêng.</p>
        </div>
      </section>

      <section className="category-budget-library" aria-labelledby="category-budget-library-title">
        <div className="category-library-heading">
          <div>
            <h2 id="category-budget-library-title">
              Danh mục của bạn <span>{categories.length}</span>
            </h2>
            <p>Mỗi khoản chi có một chỗ riêng.</p>
          </div>
          <button
            type="button"
            className={`category-sort-button ${sortBySpent ? 'is-active' : ''}`}
            aria-label="Sắp xếp theo mức chi"
            aria-pressed={sortBySpent}
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
