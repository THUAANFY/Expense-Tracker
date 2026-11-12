import { useId, useState } from 'react'
import { Check, CheckCircle2, CircleAlert, ChartPie, RotateCcw } from 'lucide-react'
import { CATEGORIES, money } from '../../shared/storage/data'
import { isClosedMonth } from '../../shared/lib/closedMonths'
import {
  CATEGORY_BUDGET_WEIGHTS,
  getCategoryBudgetPlan,
  getCategoryBudgetWeights,
  isValidCategoryWeights,
} from '../budgets/categoryBudgets'
import SettingsCategoryMark from './SettingsCategoryMark'
import ActionButton from '../../shared/components/ActionButton'
import './CategoryRatiosSettings.css'

export default function CategoryRatiosSettings({
  data,
  dataRaw,
  month,
  asOf,
  storageBlocked,
  onSave,
}) {
  const id = useId()
  const [drafts, setDrafts] = useState({})
  const [saveError, setSaveError] = useState('')
  const readOnly = isClosedMonth(month, asOf.slice(0, 7))
  const legacy = month < (data.categoryBudgetPolicy?.fromMonth || asOf.slice(0, 7))
  const draft = drafts[month]
  const base = draft?.base || data
  const savedWeights = getCategoryBudgetWeights(data, month)
  const values = readOnly ? savedWeights : draft?.values || savedWeights
  const weights = Object.fromEntries(
    CATEGORIES.map((category) => [category.id, Number(values[category.id])]),
  )
  const total = Object.values(weights).reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0,
  )
  const valid =
    Object.values(values).every((value) => value !== '') && isValidCategoryWeights(weights)
  const changed =
    !readOnly &&
    Boolean(
      !Object.hasOwn(base.monthlyCategoryWeights || {}, month) ||
      (draft &&
        CATEGORIES.some(
          (category) => weights[category.id] !== getCategoryBudgetWeights(base, month)[category.id],
        )),
    )
  const preview = valid
    ? getCategoryBudgetPlan(
        { ...data, monthlyCategoryWeights: { ...data.monthlyCategoryWeights, [month]: weights } },
        month,
      )
    : null
  const caption = `tháng ${Number(month.slice(5))}/${month.slice(0, 4)}`
  const hint =
    total !== 100
      ? `${total < 100 ? `Còn thiếu ${100 - total}%` : `Đang dư ${total - 100}%`}.`
      : 'Mỗi tỷ lệ cần là số nguyên từ 0 đến 100.'
  const previewTotal = preview?.total ?? data.monthlyBudgets?.[month] ?? data.profile.budget
  function change(values) {
    if (readOnly || storageBlocked) return
    setDrafts((previous) => ({
      ...previous,
      [month]: {
        values,
        base: previous[month]?.base || data,
        baseRaw: previous[month] ? previous[month].baseRaw : dataRaw,
      },
    }))
    setSaveError('')
  }
  return (
    <form
      className="settings-section settings-ratios-section"
      aria-label="Tỷ lệ phân bổ danh mục"
      onSubmit={async (event) => {
        event.preventDefault()
        if (readOnly || storageBlocked || !valid || !changed) return
        setSaveError('')
        const saved = await onSave(
          {
            ...base,
            monthlyCategoryWeights: {
              ...base.monthlyCategoryWeights,
              [month]: weights,
            },
          },
          `Đã lưu tỷ lệ danh mục từ ${caption}`,
          { base, baseRaw: draft ? draft.baseRaw : dataRaw },
        )
        if (!saved) {
          setSaveError('Chưa lưu tỷ lệ. Bản nháp vẫn được giữ; hãy xem thông báo lưu phía trên.')
          return
        }
        setDrafts((previous) => {
          const remaining = { ...previous }
          delete remaining[month]
          return remaining
        })
      }}
    >
      <div className="settings-section-heading">
        <span className="settings-section-icon">
          <ChartPie size={17} aria-hidden="true" />
        </span>
        <div>
          <h2>Tỷ lệ danh mục</h2>
        </div>
      </div>
      <div className="settings-section-content">
        <dl className="settings-allocation-metrics">
          <div>
            <dt>Ngân sách tháng</dt>
            <dd>{money(previewTotal)}</dd>
          </div>
          <div>
            <dt>Danh mục</dt>
            <dd>{CATEGORIES.length}</dd>
          </div>
          <div>
            <dt>Tổng tỷ lệ</dt>
            <dd>{legacy ? '—' : `${total.toLocaleString('vi-VN')}%`}</dd>
          </div>
        </dl>
        <div className="settings-ratios-grid">
          {CATEGORIES.map((category) => (
            <div
              className="settings-ratio-row"
              key={category.id}
              style={{ '--ratio-color': category.color }}
            >
              <SettingsCategoryMark category={category.id} size={32} />
              <label htmlFor={`${id}-${category.id}`}>{category.name}</label>
              <div className="settings-ratio-control">
                <input
                  id={`${id}-${category.id}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="100"
                  step="1"
                  required
                  aria-label={`Tỷ lệ ${category.name}`}
                  aria-describedby={`${id}-status`}
                  value={legacy ? '' : values[category.id]}
                  placeholder={legacy ? '—' : undefined}
                  readOnly={readOnly || storageBlocked}
                  onChange={(event) => change({ ...values, [category.id]: event.target.value })}
                />
                <span aria-hidden="true">%</span>
              </div>
              <span className="settings-ratio-amount">
                {preview ? money(preview.budgets[category.id]) : '—'}
                {Object.hasOwn(data.monthlyCategoryBudgets?.[month] || {}, category.id) && (
                  <small>Đặt riêng</small>
                )}
              </span>
              <span className="settings-ratio-bar" aria-hidden="true">
                <span
                  style={{
                    width: `${legacy ? 0 : Math.max(0, Math.min(100, weights[category.id] || 0))}%`,
                  }}
                />
              </span>
            </div>
          ))}
        </div>
        <div
          className={`settings-ratios-status ${valid ? 'is-valid' : 'is-invalid'}`}
          id={`${id}-status`}
          role="status"
        >
          {valid ? (
            <CheckCircle2 size={17} aria-hidden="true" />
          ) : (
            <CircleAlert size={17} aria-hidden="true" />
          )}
          <strong>
            {legacy
              ? 'Hạn mức lịch sử'
              : valid
                ? 'Phân bổ hợp lệ'
                : `Tổng ${total.toLocaleString('vi-VN')}%`}
          </strong>
          {legacy ? <span>Chỉ xem.</span> : !valid && <span>{hint}</span>}
        </div>
        {preview?.unallocated > 0 && (
          <p className="settings-ratios-warning">
            Còn {money(preview.unallocated)} chưa phân bổ: các mục tự động còn lại có tỷ lệ 0% hoặc
            mọi mục đã đặt riêng.
          </p>
        )}
        {preview?.excess > 0 && (
          <p className="settings-ratios-warning">
            Các hạn mức đặt riêng vượt ngân sách {money(preview.excess)}. Chỉnh lại hạn mức trong
            Danh mục & ngân sách.
          </p>
        )}
        {saveError && (
          <p className="form-error" role="alert">
            {saveError}
          </p>
        )}
        <div className="settings-ratios-actions">
          <button
            type="button"
            className="settings-ratios-reset"
            disabled={readOnly || storageBlocked}
            onClick={() => change({ ...CATEGORY_BUDGET_WEIGHTS })}
          >
            <RotateCcw size={13} />
            Tỷ lệ ban đầu
          </button>
          <ActionButton type="submit" disabled={readOnly || storageBlocked || !valid || !changed}>
            <Check size={15} />
            Lưu tỷ lệ
          </ActionButton>
        </div>
      </div>
    </form>
  )
}
