import { Plus } from 'lucide-react'
import Dialog from './Dialog'
import CategoryArt from '../CategoryArt'

export default function WelcomeDialog({ onClose, onStart }) {
  return (
    <Dialog
      title="Một khởi đầu nhẹ tênh"
      subtitle="Không gian nhỏ để bạn hiểu hơn về cách mình chi tiêu."
      onClose={onClose}
    >
      <div className="welcome-art">
        <CategoryArt category="income" size={120} />
      </div>
      <p className="welcome-copy">
        Bạn đang khám phá mây với dữ liệu mẫu. Khi sẵn sàng, hãy tạo sổ chi tiêu riêng — các giao
        dịch và ghi chú mẫu sẽ được xóa.
      </p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onClose}>
          Khám phá tiếp
        </button>
        <button className="button primary" onClick={onStart}>
          <Plus size={16} /> Tạo sổ của tôi
        </button>
      </div>
    </Dialog>
  )
}
