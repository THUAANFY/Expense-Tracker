import { useState } from 'react'
import { CalendarDays, Check, CircleAlert, RefreshCcw } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'
import { compactMoney, money } from '../../data'
import '../BudgetDialog.css'

export default function BudgetDialog({ category, budget, spent = 0, month, onSave, onClose }) {
  const [value, setValue] = useState(budget)
  const amount = Number(value)
  const valid = Number.isSafeInteger(amount) && amount > 0 && amount <= 1e12
  const remaining = amount - spent
  const percent = valid ? Math.round((spent / amount) * 100) : 0
  const over = valid && remaining < 0
  const suggestions = [
    ...new Set(
      [0.8, 1, 1.2].map((factor) => Math.min(1e12, Math.max(1, Math.round(budget * factor)))),
    ),
  ]
  return (
    <Dialog
      title={`Ngân sách ${category.name.toLowerCase()}`}
      subtitle="Chọn một mức chi vừa vặn với bạn mỗi tháng."
      onClose={onClose}
      className="budget-dialog"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (valid) onSave(amount)
        }}
        className="budget-editor-form"
      >
        <div className="budget-editor-body">
          <div className="budget-editor-category" style={{ background: category.background }}>
            <CategoryArt category={category.id} size={60} />
            <div>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </div>
          </div>
          <label className="field">
            <span className="budget-editor-label">Ngân sách tháng (VND)</span>
            <span className="budget-editor-control">
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                min="1"
                max="1000000000000"
                step="1"
                required
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <span aria-hidden="true">VND</span>
            </span>
          </label>
          <div className="budget-editor-hint">
            <span>Hạn mức lặp lại mỗi tháng.</span>
            <button type="button" onClick={() => setValue(budget)} disabled={amount === budget}>
              <RefreshCcw size={11} /> Đặt lại
            </button>
          </div>
          <fieldset className="budget-editor-presets">
            <legend>Chọn nhanh</legend>
            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  aria-label={`Chọn ngân sách ${money(suggestion)}`}
                  aria-pressed={amount === suggestion}
                  onClick={() => setValue(suggestion)}
                >
                  {compactMoney(suggestion)}
                  {amount === suggestion && <Check size={12} />}
                </button>
              ))}
            </div>
          </fieldset>
          <section
            className={`budget-editor-preview ${over ? 'is-over' : ''}`}
            aria-label="Xem trước ngân sách"
            aria-live="polite"
          >
            <div className="budget-preview-heading">
              <span>
                <CalendarDays size={13} />
                {month
                  ? `Tháng ${Number(month.slice(5))}, ${month.slice(0, 4)}`
                  : 'Chi tiêu trong tháng'}
              </span>
              <span>Xem trước</span>
            </div>
            {valid ? (
              <>
                <div className="budget-preview-row">
                  <span>Đã chi</span>
                  <strong>{money(spent)}</strong>
                </div>
                <div className="budget-preview-row budget-preview-remaining">
                  <span>{over ? 'Vượt hạn mức' : 'Còn lại'}</span>
                  <strong>{money(Math.abs(remaining))}</strong>
                </div>
                <div
                  className="budget-preview-track"
                  role="progressbar"
                  aria-label={`Xem trước ngân sách ${category.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(100, percent)}
                  aria-valuetext={`${percent}% ngân sách đã sử dụng`}
                >
                  <span style={{ width: `${Math.min(100, percent)}%` }} />
                </div>
                <p>
                  {over ? <CircleAlert size={12} /> : <Check size={12} />}
                  {percent.toLocaleString('vi-VN')}% hạn mức đã được sử dụng
                </p>
              </>
            ) : (
              <p className="budget-preview-invalid">Nhập một hạn mức hợp lệ để xem trước.</p>
            )}
          </section>
        </div>
        <div className="dialog-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button type="submit" className="button primary" disabled={!valid}>
            <Check size={16} /> Lưu ngân sách
          </button>
        </div>
      </form>
    </Dialog>
  )
}
