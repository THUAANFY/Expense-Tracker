import { useId, useRef, useEffect, useState } from 'react'
import { Check, LockKeyhole, Trash2 } from 'lucide-react'
import Dialog from '../../../shared/components/Dialog'
import DialogChoice from '../../../shared/components/DialogChoice'
import SourceArt from '../SourceArt'
import SourceColorPicker from '../SourceColorPicker'
import DatePicker from '../../../shared/components/DatePicker'
import { dateKey, formatDate, isValidDate, money, uid } from '../../../shared/storage/data'
import { SOURCE_TYPES, sourceSummary, sourceColorStyle } from '../moneySources'
import '../MoneySourcesView.css'

export default function MoneySourceDialog({
  source,
  initialType = 'cash',
  transactions = [],
  transfers = [],
  asOf = dateKey(),
  onSave,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState(
    source || {
      name: SOURCE_TYPES.find((type) => type.id === initialType)?.label || 'Tiền mặt',
      type: initialType,
      color:
        initialType === 'cash' ? 'neon-mint' : initialType === 'bank' ? 'neon-blue' : 'neon-violet',
      openingBalance: '',
      openingDate: asOf,
    },
  )
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmation = useRef(null)
  const dateId = useId()
  const deleteReasonId = useId()
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  const linkedTransfers = transfers.filter(
    (item) => item.fromSourceId === source?.id || item.toSourceId === source?.id,
  )
  const earliestTransfer = linkedTransfers.map((item) => item.date).sort()[0]
  const amount = Number(form.openingBalance)
  const preview = sourceSummary(
    { ...form, id: source?.id || 'preview', openingBalance: Number.isFinite(amount) ? amount : 0 },
    transactions,
    transfers,
    asOf,
  )
  const count = transactions.filter((item) => item.sourceId === source?.id && source).length
  const deleteBlocked = count > 0 || linkedTransfers.length > 0
  const linkedRecords = [
    count > 0 ? `${count} giao dịch thu/chi` : '',
    linkedTransfers.length > 0 ? `${linkedTransfers.length} bản ghi chuyển nguồn` : '',
  ]
    .filter(Boolean)
    .join(' và ')
  useEffect(() => {
    if (deleteBlocked) {
      setConfirmDelete(false)
      return
    }
    if (confirmDelete) confirmation.current?.scrollIntoView({ block: 'nearest' })
  }, [confirmDelete, deleteBlocked])
  return (
    <Dialog
      title={source ? 'Chăm chút nguồn tiền' : 'Thêm một nguồn tiền'}
      className="source-dialog"
      onClose={onClose}
    >
      <form
        className="source-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (
            !form.name.trim() ||
            !Number.isSafeInteger(amount) ||
            amount < 0 ||
            amount > 1e12 ||
            !isValidDate(form.openingDate) ||
            form.openingDate > asOf
          ) {
            setError(
              'Nhập tên, số dư đầu ngày từ 0 đến 1.000 tỷ và ngày bắt đầu không sau hôm nay.',
            )
            return
          }
          if (earliestTransfer && form.openingDate > earliestTransfer) {
            setError(
              `Ngày bắt đầu cần từ ${formatDate(earliestTransfer)} trở về trước để giữ lịch sử chuyển nguồn.`,
            )
            return
          }
          onSave({
            ...form,
            id: source?.id || uid(),
            name: form.name.trim(),
            openingBalance: amount,
            createdAt: source?.createdAt || Date.now(),
          })
        }}
      >
        <div className="source-form-body">
          <div
            className="source-editor-preview"
            data-source-color={form.color}
            style={sourceColorStyle(form.color)}
          >
            <SourceArt type={form.type} />
            <div className="source-editor-preview-copy">
              <p title={form.name || 'Nguồn tiền của bạn'}>{form.name || 'Nguồn tiền của bạn'}</p>
              <span>Số dư hôm nay</span>
              <strong className={preview.balance < 0 ? 'is-negative' : ''}>
                {money(preview.balance)}
              </strong>
            </div>
          </div>
          <SourceColorPicker value={form.color} onChange={(color) => update('color', color)} />
          <div className="source-form-grid">
            <label className="field">
              <span>Tên nguồn tiền</span>
              <input
                required
                maxLength={60}
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Ví dụ: Tiền mặt của tôi"
              />
            </label>
            <label className="field">
              <span>Số dư đầu ngày (VND)</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="1000000000000"
                step="1"
                required
                value={form.openingBalance}
                placeholder="0"
                onChange={(event) => update('openingBalance', event.target.value)}
              />
            </label>
          </div>
          <fieldset className="source-type-picker">
            <legend>Loại nguồn</legend>
            <div>
              {SOURCE_TYPES.map((type) => (
                <DialogChoice
                  key={type.id}
                  selected={form.type === type.id}
                  onClick={() => update('type', type.id)}
                >
                  <SourceArt type={type.id} />
                  <span>{type.label}</span>
                </DialogChoice>
              ))}
            </div>
          </fieldset>
          <label className="field">
            <span id={dateId}>Ngày bắt đầu theo dõi</span>
            <DatePicker
              value={form.openingDate}
              onChange={(value) => update('openingDate', value)}
              labelId={dateId}
            />
          </label>
          <p className="source-form-hint">
            Nhập số tiền có vào <strong>đầu ngày {formatDate(form.openingDate)}</strong>. Các khoản
            đã gán từ ngày này đến hôm nay sẽ được cộng/trừ; khoản trước đó và giao dịch chưa gán
            nguồn không làm thay đổi số dư.
          </p>
          {source && (
            <p className="source-form-hint">
              Đổi số dư đầu ngày hoặc ngày bắt đầu sẽ tính lại số dư của {count} giao dịch đã gán.
            </p>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {confirmDelete && !deleteBlocked && (
            <div
              className="source-delete-confirm"
              ref={confirmation}
              role="group"
              aria-label="Xác nhận xóa nguồn"
            >
              <p>
                Xóa nguồn “<strong>{source.name}</strong>” khỏi danh sách theo dõi? Nguồn này chưa
                có giao dịch thu/chi hoặc bản ghi chuyển nguồn.
              </p>
              <button type="button" className="danger-text" onClick={() => onDelete(source.id)}>
                Xác nhận xóa nguồn
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Hủy
              </button>
            </div>
          )}
        </div>
        {source && deleteBlocked && (
          <div className="source-delete-note" id={deleteReasonId} role="note">
            <LockKeyhole size={15} aria-hidden="true" />
            <p>
              Không thể xóa nguồn đang có <strong>{linkedRecords}</strong>.
            </p>
          </div>
        )}
        <div className="dialog-actions">
          {source && (
            <button
              type="button"
              className="icon-button danger-text"
              aria-label="Xóa nguồn tiền"
              aria-describedby={deleteBlocked ? deleteReasonId : undefined}
              title={
                deleteBlocked ? 'Không thể xóa nguồn có giao dịch' : 'Xóa nguồn chưa có giao dịch'
              }
              disabled={deleteBlocked}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button type="submit" className="button primary">
            <Check size={15} /> Lưu nguồn tiền
          </button>
        </div>
      </form>
    </Dialog>
  )
}
