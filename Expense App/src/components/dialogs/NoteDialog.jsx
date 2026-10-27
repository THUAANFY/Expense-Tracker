import { useEffect, useRef, useState } from 'react'
import { Check, PencilLine, Pin, Trash2 } from 'lucide-react'
import Dialog from './Dialog'
import { dateKey, uid } from '../../data'
import '../NoteDialog.css'

export default function NoteDialog({ note, onSave, onClose, onDelete }) {
  const [form, setForm] = useState(
    note || { title: '', content: '', color: 'yellow', pinned: false },
  )
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const confirmationRef = useRef(null)
  useEffect(() => {
    if (confirmDelete) confirmationRef.current?.scrollIntoView({ block: 'nearest' })
  }, [confirmDelete])
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  return (
    <Dialog
      title={note ? 'Chỉnh lại một chút' : 'Một ý nghĩ nhỏ'}
      subtitle="Lưu lại kế hoạch, lời nhắc hoặc điều bạn muốn nhớ."
      onClose={onClose}
      className={`note-dialog paper-${form.color}`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.title.trim() || !form.content.trim()) {
            setError('Viết thêm tiêu đề và nội dung cho ghi chú nhé.')
            return
          }
          onSave({
            ...form,
            title: form.title.trim(),
            content: form.content.trim(),
            id: note?.id || uid(),
            date: dateKey(),
          })
        }}
        className="note-form"
      >
        <div className="note-editor-body">
          <label className="field">
            <span className="note-editor-label">
              Tiêu đề <span aria-hidden="true">{form.title.length}/100</span>
            </span>
            <input
              autoFocus
              required
              maxLength="100"
              placeholder="Đặt tên cho ghi chú của bạn"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
            />
          </label>
          <label className="field">
            <span className="note-editor-label">
              Nội dung{' '}
              <span aria-hidden="true">{form.content.length.toLocaleString('vi-VN')}/3.000</span>
            </span>
            <textarea
              rows="4"
              required
              maxLength="3000"
              placeholder="Viết vài dòng ở đây…"
              value={form.content}
              onChange={(event) => update('content', event.target.value)}
            />
          </label>
          <div className="note-editor-options">
            <fieldset className="note-paper-colors">
              <legend>Màu giấy</legend>
              <div className="note-paper-swatches" role="group" aria-label="Màu ghi chú">
                {[
                  ['yellow', 'Vàng'],
                  ['purple', 'Tím'],
                  ['green', 'Xanh'],
                ].map(([color, name]) => (
                  <button
                    type="button"
                    key={color}
                    className={`note-paper-swatch ${color} ${form.color === color ? 'is-selected' : ''}`}
                    aria-label={name}
                    aria-pressed={form.color === color}
                    onClick={() => update('color', color)}
                  >
                    <span className="note-paper-color">
                      {form.color === color && <Check size={11} />}
                    </span>
                    {name}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="note-editor-pin">
              <span>
                <Pin size={14} />
                <span>
                  Ghim ghi chú<small>Mở sổ là thấy ngay</small>
                </span>
              </span>
              <input
                type="checkbox"
                aria-label="Ghim ghi chú"
                checked={form.pinned}
                onChange={(event) => update('pinned', event.target.checked)}
              />
            </label>
          </div>
          {confirmDelete && (
            <div className="delete-confirm" ref={confirmationRef}>
              <span>Xóa ghi chú này?</span>
              <button type="button" className="danger-text" onClick={() => onDelete(note.id)}>
                Xác nhận xóa
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                Hủy
              </button>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="dialog-actions">
          {note && (
            <button
              type="button"
              className="icon-button danger-text"
              aria-label="Xóa ghi chú"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={18} />
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            Để sau
          </button>
          <button type="submit" className="button primary">
            <PencilLine size={16} /> Lưu ghi chú
          </button>
        </div>
      </form>
    </Dialog>
  )
}
