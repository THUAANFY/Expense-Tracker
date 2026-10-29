import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeftRight, Check, Trash2 } from 'lucide-react'
import Dialog from '../../../shared/components/Dialog'
import DatePicker from '../../../shared/components/DatePicker'
import MoneySourceSelect from '../MoneySourceSelect'
import { dateKey, isValidDate, money, uid } from '../../../shared/storage/data'
import { getMoneySource, isValidSourceTransfer, sourceSummary } from '../moneySources'
import { CLOSED_MONTH_MESSAGE, isClosedMonth } from '../../../shared/lib/closedMonths'
import ClosedMonthNotice from '../../../shared/components/ClosedMonthNotice'
import '../MoneySourcesView.css'

export default function SourceTransferDialog({
  transfer,
  sources,
  transactions,
  transfers,
  asOf = dateKey(),
  onSave,
  onDelete,
  onClose,
}) {
  const readOnly = Boolean(transfer && isClosedMonth(transfer.date, asOf.slice(0, 7)))
  const [form, setForm] = useState(
    transfer || {
      fromSourceId: sources[0]?.id || '',
      toSourceId: sources[1]?.id || '',
      amount: '',
      date: asOf,
      note: '',
    },
  )
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmation = useRef(null)
  const dateId = useId()
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  const from = getMoneySource(sources, form.fromSourceId)
  const to = getMoneySource(sources, form.toSourceId)
  const amount = Number(form.amount)
  const remaining = from
    ? sourceSummary(
        from,
        transactions,
        transfers.filter((item) => item.id !== transfer?.id),
        asOf,
      ).balance - (form.date <= asOf && Number.isFinite(amount) ? amount : 0)
    : 0
  useEffect(() => {
    if (confirmDelete) confirmation.current?.scrollIntoView({ block: 'nearest' })
  }, [confirmDelete])
  return (
    <Dialog
      title={
        readOnly
          ? 'Chi tiết chuyển nguồn'
          : transfer
            ? 'Sửa ghi nhận chuyển nguồn'
            : 'Ghi nhận chuyển nguồn'
      }
      subtitle="Di chuyển giữa hai nguồn trong sổ của bạn."
      className="source-dialog"
      onClose={onClose}
    >
      <form
        className="source-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (readOnly || isClosedMonth(form.date)) {
            setError(CLOSED_MONTH_MESSAGE)
            return
          }
          const next = {
            ...form,
            amount,
            note: form.note.trim(),
            id: transfer?.id || uid(),
            createdAt: transfer?.createdAt || Date.now(),
          }
          if (!isValidDate(form.date) || !isValidSourceTransfer(next, sources)) {
            setError(
              'Chọn hai nguồn khác nhau, số tiền nguyên dương không quá 1.000 tỷ và ngày không trước mốc bắt đầu của cả hai nguồn.',
            )
            return
          }
          onSave(next)
        }}
      >
        {readOnly && <ClosedMonthNotice />}
        <fieldset className="dialog-fields" disabled={readOnly}>
          <div className="source-form-body">
            <div className="source-transfer-note">
              <ArrowLeftRight size={20} />
              <p>
                Bản ghi này thay đổi số dư hai nguồn. Tổng thu, tổng chi và ngân sách chi tiêu vẫn
                giữ nguyên.
              </p>
            </div>
            <div className="source-form-grid">
              <div className="field">
                <span>Từ nguồn</span>
                <MoneySourceSelect
                  sources={sources}
                  transactions={transactions}
                  transfers={transfers}
                  asOf={asOf}
                  value={form.fromSourceId}
                  onChange={(value) => update('fromSourceId', value)}
                  label="Nguồn chuyển đi"
                />
              </div>
              <div className="field">
                <span>Đến nguồn</span>
                <MoneySourceSelect
                  sources={sources}
                  transactions={transactions}
                  transfers={transfers}
                  asOf={asOf}
                  value={form.toSourceId}
                  onChange={(value) => update('toSourceId', value)}
                  label="Nguồn nhận về"
                />
              </div>
            </div>
            <div className="source-form-grid">
              <label className="field">
                <span>Số tiền chuyển (VND)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="1000000000000"
                  step="1"
                  required
                  value={form.amount}
                  onChange={(event) => update('amount', event.target.value)}
                  placeholder="0"
                />
              </label>
              <label className="field">
                <span id={dateId}>Ngày ghi nhận</span>
                <DatePicker
                  min={`${asOf.slice(0, 7)}-01`}
                  value={form.date}
                  onChange={(value) => update('date', value)}
                  labelId={dateId}
                />
              </label>
            </div>
            {from && to && from.id !== to.id && (
              <p className={`source-form-hint ${remaining < 0 ? 'is-negative' : ''}`}>
                {form.date > asOf
                  ? 'Ghi nhận cho ngày tương lai, chưa tính vào số dư hôm nay.'
                  : `${from.name} còn ${money(remaining)} sau bản ghi này.${remaining < 0 ? ' Số dư âm: hãy kiểm tra số dư đầu ngày và các khoản thu.' : ''}`}
              </p>
            )}
            <label className="field">
              <span>
                Ghi chú chuyển nguồn <small>Tùy chọn</small>
              </span>
              <textarea
                rows={2}
                maxLength={300}
                value={form.note}
                onChange={(event) => update('note', event.target.value)}
                placeholder="Ví dụ: Rút tiền để chi tiêu trong tuần"
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {confirmDelete && !readOnly && (
              <div className="source-delete-confirm" ref={confirmation}>
                <p>Xóa bản ghi chuyển nguồn sẽ tính lại số dư cả hai nguồn.</p>
                <button type="button" className="danger-text" onClick={() => onDelete(transfer.id)}>
                  Xác nhận xóa chuyển nguồn
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}>
                  Hủy
                </button>
              </div>
            )}
          </div>
        </fieldset>
        <div className="dialog-actions">
          {transfer && !readOnly && (
            <button
              type="button"
              className="icon-button danger-text"
              aria-label="Xóa bản ghi chuyển nguồn"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            {readOnly ? 'Đóng chi tiết' : 'Để sau'}
          </button>
          {!readOnly && (
            <button type="submit" className="button primary">
              <Check size={15} /> Lưu chuyển nguồn
            </button>
          )}
        </div>
      </form>
    </Dialog>
  )
}
