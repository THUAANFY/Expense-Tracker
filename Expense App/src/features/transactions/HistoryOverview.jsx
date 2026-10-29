import { Heart } from 'lucide-react'
import HistoryArt from './HistoryArt'
import { money } from '../../shared/storage/data'

export default function HistoryOverview({ month, transactions, income, expense }) {
  const [year, monthNumber] = month.split('-')
  const incomeCount = transactions.filter((item) => item.type === 'income').length
  const expenseCount = transactions.length - incomeCount
  const difference = income - expense
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
