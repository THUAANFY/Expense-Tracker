import { useId } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, SlidersHorizontal, TrendingUp } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import { compactMoney, money } from '../../shared/storage/data'
import OverviewArt from './OverviewArt'
import BudgetLedgerArt from './BudgetLedgerArt'
import './MonthlyBudgetCard.css'

export default function MonthlyBudgetCard({
  expense,
  monthlyBudget,
  budgetPercent,
  remaining,
  onAdjust,
  onDetails,
}) {
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  const id = useId().replaceAll(':', '')
  const over = remaining < 0
  const level = over ? 'over' : expense >= monthlyBudget * 0.8 ? 'near' : 'within'
  const long = `${compactMoney(expense)} ${compactMoney(monthlyBudget)}`.length > 24
  const status = (
    <>
      <span className={over ? 'over-dot' : 'online-dot'} aria-hidden="true" />
      {dark ? (
        <span className="budget-status-copy">
          <span>{over ? 'Vượt ngân sách' : 'Còn lại'}</span>
          <strong>{money(Math.abs(remaining))}</strong>
        </span>
      ) : over ? (
        <>
          Vượt ngân sách <strong>{money(-remaining)}</strong>.
        </>
      ) : (
        <>
          Còn <strong>{money(remaining)}</strong> để chi tiêu.
        </>
      )}
    </>
  )

  return (
    <section
      className={`panel budget-panel ${dark ? 'fintech-budget-panel' : ''} ${expense ? 'is-used' : 'is-empty'} ${long ? 'has-long-budget' : ''}`}
      aria-labelledby={`${id}-title`}
      data-budget-level={level}
    >
      <div className="panel-heading">
        <div className="overview-budget-intro">
          {dark ? (
            <BudgetLedgerArt className="overview-budget-art" />
          ) : (
            <OverviewArt variant="jar" className="overview-budget-art" />
          )}
          <div>
            <span>TÍCH TỪNG CHÚT NHỎ</span>
            <h2 id={`${id}-title`}>Ngân sách tháng</h2>
          </div>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Điều chỉnh ngân sách tháng"
          onClick={onAdjust}
        >
          <SlidersHorizontal size={dark ? 18 : 16} aria-hidden="true" />
        </button>
      </div>
      <div className="budget-numbers">
        <strong title={money(expense)}>{compactMoney(expense)}</strong>
        <span title={money(monthlyBudget)}>/ {compactMoney(monthlyBudget)}</span>
        <span className={`budget-percent${over ? ' over-budget' : ''}`}>
          {dark && <TrendingUp size={15} aria-hidden="true" />}
          {budgetPercent}%
        </span>
      </div>
      <div
        className={`progress-track ${level}`}
        role="progressbar"
        aria-label="Ngân sách đã sử dụng"
        aria-valuenow={Math.min(budgetPercent, 100)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuetext={`Đã sử dụng ${budgetPercent}% ngân sách`}
      >
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, budgetPercent)}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {dark ? (
        <button
          type="button"
          className="budget-status"
          onClick={onDetails}
          aria-label={`Xem ngân sách theo danh mục: ${over ? 'vượt ngân sách' : 'còn lại'} ${money(Math.abs(remaining))}`}
        >
          <svg
            className="budget-status-wave"
            viewBox="0 0 160 48"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient
                id={`${id}-status`}
                x1="0"
                y1="48"
                x2="160"
                y2="5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8b5cf6" stopOpacity="0" />
                <stop offset="1" stopColor="#7953ef" stopOpacity=".38" />
              </linearGradient>
            </defs>
            <path
              d="M0 48c36 0 38-21 56-15s20 6 41-13S133 4 160 0v48Z"
              fill={`url(#${id}-status)`}
            />
            <path
              d="M0 48c36 0 38-21 56-15s20 6 41-13S133 4 160 0"
              stroke="#9770ff"
              strokeOpacity=".45"
              strokeWidth="1.2"
            />
          </svg>
          {status}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      ) : (
        <p>{status}</p>
      )}
    </section>
  )
}
