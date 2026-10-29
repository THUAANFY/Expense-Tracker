import { ArrowRight, LockKeyhole } from 'lucide-react'
import './ClosedMonthNotice.css'

export default function ClosedMonthNotice({ onCurrent }) {
  return (
    <div className="closed-month-notice" role="note">
      <LockKeyhole size={16} aria-hidden="true" />
      <p>
        <strong>Tháng đã qua · Chỉ xem</strong>
        <span>Giao dịch và ngân sách của tháng cũ đã được khóa.</span>
      </p>
      {onCurrent && (
        <button type="button" onClick={onCurrent}>
          Về tháng hiện tại <ArrowRight size={13} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
