import { useEffect, useRef, useState } from 'react'
import { Check, ShoppingBag, Trash2 } from 'lucide-react'
import Dialog from '../../../shared/components/Dialog'
import BagArt from '../BagArt'
import { BAG_COLORS, BAG_STYLES } from '../bags'
import { uid } from '../../../shared/storage/data'
import './BagDialogs.css'

export default function BagDialog({ bag, deleteBlocked = false, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(
    bag || {
      name: '',
      description: '',
      budget: '',
      style: 'trip',
      color: 'lilac',
      status: 'active',
    },
  )
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmation = useRef(null)
  useEffect(() => {
    if (confirmDelete) confirmation.current?.scrollIntoView({ block: 'nearest' })
  }, [confirmDelete])
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  return (
    <Dialog
      title={bag ? 'Chăm chút chiếc túi' : 'Một chiếc túi cho dịp riêng'}
      subtitle="Gom những khoản chi cùng một câu chuyện."
      className="bag-dialog"
      onClose={onClose}
    >
      <form
        className="bag-form"
        onSubmit={(event) => {
          event.preventDefault()
          const budget = Number(form.budget)
          if (!form.name.trim() || !Number.isSafeInteger(budget) || budget < 0 || budget > 1e12) {
            setError('Nhập tên túi và ngân sách nguyên từ 0 đến 1.000 tỷ đồng.')
            return
          }
          onSave({
            ...form,
            id: bag?.id || uid(),
            name: form.name.trim(),
            description: form.description.trim(),
            budget,
            createdAt: bag?.createdAt || Date.now(),
          })
        }}
      >
        <div className="bag-form-body">
          <div className="bag-form-preview">
            <BagArt variant={form.style} color={form.color} />
            <span>
              <strong>{form.name.trim() || 'Chiếc túi của bạn'}</strong>
              <span>Một dịp riêng, một chỗ gọn gàng.</span>
            </span>
          </div>
          <div className="bag-form-fields">
            <label className="field">
              <span>Tên túi</span>
              <input
                required
                maxLength="60"
                value={form.name}
                placeholder="Ví dụ: Chuyến đi Đà Lạt"
                onChange={(event) => update('name', event.target.value)}
              />
            </label>
            <label className="field">
              <span>
                Ngân sách <small>Tùy chọn · VND</small>
              </span>
              <input
                aria-label="Ngân sách của túi"
                type="number"
                inputMode="numeric"
                min="0"
                max="1000000000000"
                step="1"
                value={form.budget}
                placeholder="Chưa đặt"
                onChange={(event) => update('budget', event.target.value)}
              />
            </label>
          </div>
          <fieldset className="bag-style-picker">
            <legend>Chọn kiểu túi</legend>
            <div role="group" aria-label="Kiểu túi">
              {BAG_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  aria-label={style.label}
                  aria-pressed={form.style === style.id}
                  onClick={() => update('style', style.id)}
                >
                  <BagArt variant={style.id} color={form.color} />
                  <span>{style.label}</span>
                  {form.style === style.id && <Check size={11} />}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="bag-color-picker" role="group" aria-label="Màu túi">
            <span>Màu giấy</span>
            {BAG_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                title={color.label}
                aria-label={color.label}
                aria-pressed={form.color === color.id}
                style={{ background: color.body, color: color.ink }}
                onClick={() => update('color', color.id)}
              >
                {form.color === color.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <label className="field">
            <span>
              Đôi dòng cho dịp này <small>Tùy chọn</small>
            </span>
            <textarea
              aria-label="Mô tả túi"
              maxLength="300"
              rows="2"
              value={form.description}
              placeholder="Bạn muốn dành chiếc túi này cho điều gì?"
              onChange={(event) => update('description', event.target.value)}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {deleteBlocked && (
            <p className="source-form-hint">Túi có giao dịch của tháng đã qua nên không thể xóa.</p>
          )}
          {confirmDelete && !deleteBlocked && (
            <div className="bag-delete-confirm" ref={confirmation}>
              <p>Xóa túi “{bag.name}”? Các giao dịch và cảm nhận vẫn được giữ trong lịch sử.</p>
              <button type="button" className="danger-text" onClick={() => onDelete(bag.id)}>
                Xác nhận xóa túi
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Giữ lại
              </button>
            </div>
          )}
        </div>
        <div className="dialog-actions">
          {bag && (
            <button
              type="button"
              className="icon-button danger-text"
              aria-label="Xóa túi"
              disabled={deleteBlocked}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button className="button primary" type="submit">
            <ShoppingBag size={15} />
            {bag ? 'Lưu túi' : 'Tạo túi'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
