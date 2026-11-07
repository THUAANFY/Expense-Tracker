import { CalendarDays, Heart, TrendingDown, TrendingUp } from 'lucide-react'
import useAppearance from '../../app/theme/useAppearance'
import FintechJournalArt from '../overview/FintechJournalArt'
import HistoryArt from './HistoryArt'
import HistoryCardDecor from './HistoryCardDecor'
import HistoryMoneyIcon from './HistoryMoneyIcon'
import HistoryMoneyScene from './HistoryMoneyScene'
import { money } from '../../shared/storage/data'
import './HistoryOverview.css'

export default function HistoryOverview({ month, transactions, income, expense }) {
  const { theme } = useAppearance()
  const [year, monthNumber] = month.split('-')
  const incomeCount = transactions.filter((item) => item.type === 'income').length
  const expenseCount = transactions.length - incomeCount
  const difference = income - expense
  if (theme === 'dark') {
    return (
      <section
        className={`history-month-overview fintech-history-overview ${income >= 1e9 || expense >= 1e9 ? 'has-large-totals' : ''}`}
        aria-label="Tổng quan giao dịch tháng"
      >
        <div
          className={`history-month-balance ${Math.abs(difference) >= 1e9 ? 'has-long-amount' : ''}`}
        >
          <HistoryCardDecor kind="balance" />
          <div className="history-month-copy">
            <span className="history-month-eyebrow">
              <span className="history-month-heart" aria-hidden="true">
                <Heart size={18} />
              </span>
              CHUYỆN CHI TIÊU CỦA MÌNH
            </span>
            <h2>Thu − chi trong tháng</h2>
            <strong className={difference < 0 ? 'is-negative' : ''}>
              {difference < 0 ? '−' : difference > 0 ? '+' : ''}
              {money(Math.abs(difference))}
            </strong>
            <span className="history-month-caption">
              <CalendarDays size={15} aria-hidden="true" />
              <span>
                Tháng {Number(monthNumber)}/{year} · {transactions.length} giao dịch đã ghi
              </span>
            </span>
          </div>
          <span className="history-journal-illustration" aria-hidden="true">
            <FintechJournalArt compact />
          </span>
        </div>
        {[
          {
            kind: 'income',
            label: 'Tổng khoản thu',
            amount: income,
            count: incomeCount,
            sign: '+',
          },
          {
            kind: 'expense',
            label: 'Tổng khoản chi',
            amount: expense,
            count: expenseCount,
            sign: '−',
          },
        ].map(({ kind, label, amount, count, sign }) => (
          <div
            key={kind}
            className={`history-month-metric is-${kind} ${amount >= 1e9 ? 'has-long-amount' : ''}`}
          >
            <HistoryCardDecor kind={kind} />
            <HistoryMoneyScene kind={kind} />
            <div className="history-fintech-metric-copy">
              <span className="history-metric-label">
                <span className="history-metric-icon" aria-hidden="true">
                  <HistoryMoneyIcon kind={kind} />
                </span>
                <span>{label}</span>
              </span>
              <strong>
                {sign}
                {money(amount)}
              </strong>
              <span className="history-metric-count">
                <span className="history-count-icon" aria-hidden="true">
                  {kind === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </span>
                {count} giao dịch
              </span>
            </div>
          </div>
        ))}
      </section>
    )
  }
  return (
    <section className="history-month-overview" aria-label="Tổng quan giao dịch tháng">
      <div className="history-month-balance">
        <div className="history-month-copy">
          <span className="history-month-eyebrow">
            <Heart size={12} aria-hidden="true" />
            CHUYỆN CHI TIÊU CỦA MÌNH
          </span>
          <h2>Thu − chi trong tháng</h2>
          <strong className={difference < 0 ? 'is-negative' : ''}>
            {difference < 0 ? '−' : difference > 0 ? '+' : ''}
            {money(Math.abs(difference))}
          </strong>
          <span className="history-month-caption">
            Tháng {Number(monthNumber)}/{year} · {transactions.length} giao dịch đã ghi
          </span>
        </div>
        <HistoryArt className="history-journal-art" />
      </div>
      <div className="history-month-metric is-income">
        <HistoryArt variant="income" className="history-metric-art" />
        <div>
          <span>Tổng khoản thu</span>
          <strong>+{money(income)}</strong>
          <span className="history-metric-count">{incomeCount} giao dịch</span>
        </div>
      </div>
      <div className="history-month-metric is-expense">
        <HistoryArt variant="expense" className="history-metric-art" />
        <div>
          <span>Tổng khoản chi</span>
          <strong>−{money(expense)}</strong>
          <span className="history-metric-count">{expenseCount} giao dịch</span>
        </div>
      </div>
    </section>
  )
}
