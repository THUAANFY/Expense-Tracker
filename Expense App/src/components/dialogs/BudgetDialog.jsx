import { useState } from 'react'
import { CalendarDays, Check, CircleAlert, RefreshCcw, Sparkles } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'
import ClosedMonthNotice from '../ClosedMonthNotice'
import { compactMoney, money } from '../../data'
import '../BudgetDialog.css'

export default function BudgetDialog({
  category,
  budget,
  automaticBudget = budget,
  suggestedWeight,
  custom = false,
  spent = 0,
  month,
  readOnly = false,
  onSave,
  onAuto,
  onClose,
}) {
  const [value, setValue] = useState(budget)
  const [automatic, setAutomatic] = useState(!custom)
  const amount = automatic ? automaticBudget : Number(value)
  const valid =
    (automatic || value !== '') && Number.isSafeInteger(amount) && amount >= 0 && amount <= 1e12
  const remaining = amount - spent
  const percent = valid && amount > 0 ? Math.round((spent / amount) * 100) : spent > 0 ? 100 : 0
  const over = valid && remaining < 0
  const suggestions = [
    ...new Set(
      [0.8, 1, 1.2].map((factor) => Math.min(1e12, Math.max(1, Math.round(budget * factor)))),
    ),
  ]
  return (
    <Dialog
      title={`Ngân sách ${category.name.toLowerCase()}`}
      subtitle="Chọn một mức chi vừa vặn cho tháng này."
      onClose={onClose}
      className="budget-dialog"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (valid && !readOnly) {
            if (automatic && onAuto) onAuto()
            else onSave(amount)
          }
        }}
        className="budget-editor-form"
      >
        <div className="budget-editor-body">
          {readOnly && <ClosedMonthNotice />}
          <div className="budget-editor-category" style={{ background: category.background }}>
            <CategoryArt category={category.id} size={60} />
            <div>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </div>
          </div>
          <div className={`budget-editor-allocation ${automatic ? 'is-auto' : ''}`}>
            <div>
              <Sparkles size={14} />
              <strong>{automatic ? 'Đang tự chia' : 'Hạn mức đặt riêng'}</strong>
            </div>
            <p>
              Tỷ lệ phân bổ {suggestedWeight}%. Mục tự động chia phần ngân sách còn lại sau các mức
              đặt riêng.
            </p>
            <button
              type="button"
              disabled={readOnly || automatic}
              onClick={() => setAutomatic(true)}
            >
              {automatic
                ? 'Tự cập nhật theo ngân sách tháng'
                : `Dùng mức tự động · ${money(automaticBudget)}`}
            </button>
          </div>
          <label className="field">
            <span className="budget-editor-label">Hạn mức danh mục (VND)</span>
            <span className="budget-editor-control">
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                min="0"
                max="1000000000000"
                step="1"
                required
                value={automatic ? automaticBudget : value}
                readOnly={readOnly}
                onChange={(event) => {
                  setAutomatic(false)
                  setValue(event.target.value)
                }}
              />
              <span aria-hidden="true">VND</span>
            </span>
          </label>
          <div className="budget-editor-hint">
            <span>Chỉ áp dụng cho tháng đang chọn.</span>
            <button
              type="button"
              onClick={() => {
                setValue(budget)
                setAutomatic(!custom)
              }}
              disabled={readOnly || (amount === budget && automatic === !custom)}
            >
              <RefreshCcw size={11} /> Đặt lại
            </button>
          </div>
          <fieldset className="budget-editor-presets" disabled={readOnly}>
            <legend>Chọn nhanh</legend>
            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  aria-label={`Chọn ngân sách ${money(suggestion)}`}
                  aria-pressed={amount === suggestion}
                  onClick={() => {
                    setAutomatic(false)
                    setValue(suggestion)
                  }}
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
                  {amount === 0
                    ? 'Hạn mức 0 ₫: khoản chi phát sinh sẽ được báo vượt mức.'
                    : `${percent.toLocaleString('vi-VN')}% hạn mức đã được sử dụng`}
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
          <button type="submit" className="button primary" disabled={readOnly || !valid}>
            <Check size={16} /> Lưu ngân sách
          </button>
        </div>
      </form>
    </Dialog>
  )
}
