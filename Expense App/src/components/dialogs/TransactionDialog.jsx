import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Check, ShoppingBag, Trash2 } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'
import DatePicker from '../DatePicker'
import PaymentSelect from '../PaymentSelect'
import FilterSelect from '../FilterSelect'
import { CATEGORIES, dateKey, isValidDate, money, uid } from '../../data'

export default function TransactionDialog({
  transaction,
  initialCategory,
  initialBagId,
  bags = [],
  onSave,
  onClose,
  onDelete,
}) {
  const dateLabelId = useId()
  const walletLabelId = useId()
  const [form, setForm] = useState(
    transaction || {
      title: '',
      amount: '',
      type: 'expense',
      category: initialCategory || 'food',
      date: dateKey(),
      wallet: 'Chuyển khoản',
      note: '',
      bagId: initialBagId,
    },
  )
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmationRef = useRef(null)
  useEffect(() => {
    if (confirmDelete) confirmationRef.current?.scrollIntoView({ block: 'nearest' })
  }, [confirmDelete])
  function submit(event) {
    event.preventDefault()
    const amount = Number(form.amount)
    if (
      !form.title.trim() ||
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      amount > 1e12 ||
      !isValidDate(form.date)
    ) {
      setError('Vui lòng nhập tên, ngày và số tiền nguyên dương không quá 1.000 tỷ đồng.')
      return
    }
    const saved = {
      ...form,
      title: form.title.trim(),
      note: form.note.trim(),
      amount,
      id: transaction?.id || uid(),
      createdAt: transaction?.createdAt || Date.now(),
    }
    if (saved.type === 'income') delete saved.review
    if (saved.type !== 'expense' || !bags.some((bag) => bag.id === saved.bagId)) delete saved.bagId
    onSave(saved)
  }
  return (
    <Dialog
      title={transaction ? 'Một giao dịch, một câu chuyện' : 'Ghi lại một giao dịch'}
      subtitle="Để những khoản nhỏ luôn trong tầm tay."
      onClose={onClose}
      wide
      className="transaction-dialog"
    >
      <form onSubmit={submit} className="transaction-form">
        <div className="transaction-form-body">
          <div className="type-toggle" role="group" aria-label="Loại giao dịch">
            <button
              type="button"
              className={form.type === 'expense' ? 'active expense' : ''}
              aria-pressed={form.type === 'expense'}
              onClick={() => update('type', 'expense')}
            >
              <ArrowUpRight size={17} /> Khoản chi
            </button>
            <button
              type="button"
              className={form.type === 'income' ? 'active income' : ''}
              aria-pressed={form.type === 'income'}
              onClick={() => update('type', 'income')}
            >
              <ArrowDownLeft size={17} /> Khoản thu
            </button>
          </div>
          <div className="transaction-primary-fields">
            <label className="field">
              <span className="field-label">Số tiền</span>
              <span className="transaction-control transaction-amount-control">
                <input
                  autoFocus
                  type="number"
                  name="amount"
                  inputMode="numeric"
                  min="1"
                  max="1000000000000"
                  step="1"
                  required
                  value={form.amount}
                  placeholder="0"
                  onChange={(event) => update('amount', event.target.value)}
                />
                <span className="transaction-currency" aria-hidden="true">
                  VND
                </span>
              </span>
            </label>
            <label className="field">
              <span className="field-label">Tên giao dịch</span>
              <input
                name="title"
                required
                maxLength="100"
                placeholder="Ví dụ: Cà phê sáng"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
              />
            </label>
          </div>
          {form.type === 'expense' && (
            <fieldset className="category-field">
              <legend>Danh mục</legend>
              <div className="category-picker">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={form.category === category.id}
                    className={form.category === category.id ? 'selected' : ''}
                    onClick={() => update('category', category.id)}
                  >
                    <CategoryArt category={category.id} size={43} />
                    <span>{category.name}</span>
                    {form.category === category.id && (
                      <Check size={12} className="category-check" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="form-row">
            <label className="field">
              <span className="field-label" id={dateLabelId}>
                Ngày giao dịch
              </span>
              <DatePicker
                value={form.date}
                onChange={(value) => update('date', value)}
                labelId={dateLabelId}
              />
            </label>
            <label className="field">
              <span className="field-label" id={walletLabelId}>
                Thanh toán
              </span>
              <PaymentSelect
                value={form.wallet}
                onChange={(value) => update('wallet', value)}
                labelId={walletLabelId}
              />
            </label>
          </div>
          {form.type === 'expense' && bags.length > 0 && (
            <div className="field transaction-bag-field">
              <span className="field-label">
                Túi chi tiêu <span className="optional">Tùy chọn</span>
              </span>
              <FilterSelect
                label="Túi chi tiêu của giao dịch"
                caption="GOM VÀO TÚI"
                value={form.bagId || ''}
                options={[
                  { value: '', label: 'Không thuộc túi', icon: ShoppingBag },
                  ...bags.map((bag) => ({
                    value: bag.id,
                    label: bag.name,
                    description: bag.status === 'done' ? 'Đã hoàn tất' : 'Đang mở',
                    icon: ShoppingBag,
                  })),
                ]}
                onChange={(value) => update('bagId', value)}
              />
            </div>
          )}
          <label className="field">
            <span className="field-label">
              Ghi chú <span className="optional">Tùy chọn</span>
            </span>
            <textarea
              name="note"
              rows="2"
              maxLength="1000"
              placeholder="Có điều gì bạn muốn nhớ về khoản này?"
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {confirmDelete && (
            <div className="delete-confirm" ref={confirmationRef}>
              <span>Xóa giao dịch {money(Number(form.amount))} này?</span>
              <button
                type="button"
                className="danger-text"
                onClick={() => onDelete(transaction.id)}
              >
                Xác nhận xóa
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Hủy
              </button>
            </div>
          )}
        </div>
        <div className="dialog-actions">
          {transaction && (
            <button
              type="button"
              className="icon-button danger-text"
              aria-label="Xóa giao dịch"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={18} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button className="button primary" type="submit">
            <Check size={16} /> {transaction ? 'Lưu thay đổi' : 'Lưu giao dịch'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
