import { Plus, WalletCards } from 'lucide-react'
import SourceArt from './SourceArt'
import { SOURCE_TYPES } from './moneySources'
import './SourcesEmptyState.css'

const descriptions = {
  cash: 'Tiền trong ví của bạn',
  bank: 'Số dư tài khoản',
  ewallet: 'Ví thanh toán cá nhân',
}

export default function SourcesEmptyState({ onCreate }) {
  return (
    <section className="sources-empty sources-start" aria-labelledby="sources-start-title">
      <header className="sources-start-intro">
        <span className="sources-start-eyebrow">
          <WalletCards size={15} aria-hidden="true" /> Nguồn đầu tiên của bạn
        </span>
        <h2 id="sources-start-title">
          Một chỗ cho <span>từng nguồn tiền.</span>
        </h2>
        <p>Thêm số dư hiện có để biết tiền đang ở đâu và theo dõi từng khoản thu, chi.</p>
      </header>
      <ul className="sources-start-options" aria-label="Chọn loại nguồn tiền để bắt đầu">
        {SOURCE_TYPES.map((type) => (
          <li key={type.id}>
            <button
              className="sources-start-option"
              data-source-type={type.id}
              type="button"
              onClick={() => onCreate(type.id)}
              aria-label={`Thêm nguồn ${type.label}`}
            >
              <span className="sources-start-art" aria-hidden="true">
                <SourceArt type={type.id} />
              </span>
              <span className="sources-start-copy">
                <strong>{type.label}</strong>
                <span>{descriptions[type.id]}</span>
              </span>
              <span className="sources-start-add" aria-hidden="true">
                <Plus size={16} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
