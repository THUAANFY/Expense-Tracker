import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'
import { isClosedMonth } from '../../closedMonths'
import ClosedMonthNotice from '../ClosedMonthNotice'
import MoodArt from '../MoodArt'
import { formatDate, getCategory, money } from '../../data'
import { REVIEW_OPTIONS } from '../../reviews'
import '../WorthView.css'

export default function ReviewDialog({ transaction, onSave, onClear, onClose }) {
  const [rating, setRating] = useState(transaction.review?.rating || '')
  const [note, setNote] = useState(transaction.review?.note || '')
  const [error, setError] = useState('')
  const category = getCategory(transaction.category)
  const readOnly = isClosedMonth(transaction.date)
  return (
    <Dialog
      title="Khoản chi này thế nào?"
      subtitle="Một cảm nhận ngắn cho lần nhìn lại sau."
      className="review-dialog"
      onClose={onClose}
    >
      <div className="review-dialog-transaction">
        <span style={{ background: category.background }}>
          <CategoryArt category={category.id} size={34} />
        </span>
        <div>
          <strong>{transaction.title}</strong>
          <span>
            {formatDate(transaction.date)} · {category.name}
          </span>
        </div>
        <strong>{money(transaction.amount)}</strong>
      </div>
      <form
        className="review-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (readOnly) return
          if (!rating) {
            setError('Chọn một cảm nhận trước khi lưu nhé.')
            return
          }
          onSave({ rating, note: note.trim() })
        }}
      >
        <div className="review-form-body">
          {readOnly && <ClosedMonthNotice />}
          <div className="review-dialog-choices" role="group" aria-label="Cảm nhận về khoản chi">
            {REVIEW_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={readOnly}
                data-mood={option.id}
                aria-pressed={rating === option.id}
                onClick={() => {
                  setRating(option.id)
                  setError('')
                }}
              >
                <MoodArt mood={option.id} />
                <span>{option.label}</span>
                {rating === option.id && <Check size={12} />}
              </button>
            ))}
          </div>
          <label className="review-note-field">
            <span>
              Lý do của bạn <span>Tùy chọn · {note.length}/500</span>
            </span>
            <textarea
              aria-label="Lý do của bạn"
              rows="3"
              maxLength="500"
              value={note}
              readOnly={readOnly}
              placeholder="Điều gì khiến bạn cảm thấy như vậy?"
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="dialog-actions">
          {transaction.review && !readOnly && (
            <button type="button" className="text-button review-clear" onClick={onClear}>
              <RotateCcw size={13} /> Bỏ đánh giá
            </button>
          )}
          <button type="button" className="button secondary" onClick={onClose}>
            {readOnly ? 'Đóng chi tiết' : 'Để sau'}
          </button>
          <button type="submit" className="button primary" disabled={readOnly}>
            <Check size={15} /> Lưu cảm nhận
          </button>
        </div>
      </form>
    </Dialog>
  )
}
