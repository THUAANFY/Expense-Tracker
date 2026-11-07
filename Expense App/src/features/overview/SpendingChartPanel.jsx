import { useState } from 'react'
import useAppearance from '../../app/theme/useAppearance'
import { money } from '../../shared/storage/data'
import OverviewArt from './OverviewArt'
import SpendingChart from './SpendingChart'
import './SpendingChart.css'

export default function SpendingChartPanel({ transactions, month, expense }) {
  const { theme } = useAppearance()
  const [type, setType] = useState('expense')
  const dark = theme === 'dark'
  const [year, monthNumber] = month.split('-').map(Number)
  return (
    <section className={`panel chart-panel ${dark ? 'fintech-chart-panel' : ''}`}>
      <div className="panel-heading">
        <div>
          <h2>Dòng chảy chi tiêu {!dark && <span className="subtle-dot" />}</h2>
          <p>Mỗi ngày một chút, nhìn lại cả tháng.</p>
        </div>
        {dark ? (
          <div className="chart-mode-switch" role="group" aria-label="Loại dòng tiền">
            {[
              ['expense', 'Chi tiêu'],
              ['income', 'Thu nhập'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={type === value}
                className={type === value ? 'is-active' : ''}
                onClick={() => setType(value)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="overview-chart-corner">
            <OverviewArt variant="cloud" className="overview-cloud-art" />
            <span className="chart-legend">
              <i /> Chi tiêu
            </span>
          </div>
        )}
      </div>
      {!dark && (
        <div className="chart-summary">
          <strong>{money(expense)}</strong>
          <span>trong tháng {monthNumber}</span>
          <span className="chart-period">
            01 — {new Date(year, monthNumber, 0).getDate()} THÁNG {monthNumber}
          </span>
        </div>
      )}
      <SpendingChart
        key={`${month}-${dark ? type : 'expense'}-${theme}`}
        transactions={transactions}
        month={month}
        type={dark ? type : 'expense'}
      />
    </section>
  )
}
