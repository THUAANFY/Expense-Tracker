import useAppearance from '../../app/theme/useAppearance'
import HistoryEmptyArt from './HistoryEmptyArt'
import { useId } from 'react'
import { BookOpen, Plus, RotateCcw, Search } from 'lucide-react'
import ActionButton from '../../shared/components/ActionButton'
import './HistoryEmptyState.css'

export default function HistoryEmptyState({ hasFilters, onClearFilters, onAdd }) {
  const titleId = useId()
  const { theme } = useAppearance()
  const dark = theme === 'dark'
  return (
    <section
      className={`history-empty ${dark ? 'fintech-history-empty' : ''}`}
      aria-labelledby={titleId}
    >
      {dark ? (
        <div className="history-empty-visual" aria-hidden="true">
          <HistoryEmptyArt dark searching={hasFilters} />
        </div>
      ) : (
        <HistoryEmptyArt searching={hasFilters} className="history-empty-art" />
      )}
      <div className="history-empty-copy">
        {dark && (
          <span className="history-empty-eyebrow">
            {hasFilters ? <Search size={12} /> : <BookOpen size={12} />}
            {hasFilters ? 'TÌM TRONG NHẬT KÝ' : 'MỘT KHỞI ĐẦU NHẸ NHÀNG'}
          </span>
        )}
        <h3 id={titleId}>{hasFilters ? 'Chưa có giao dịch phù hợp' : 'Một trang sổ còn trống'}</h3>
        <p>
          {hasFilters
            ? 'Thử từ khóa khác hoặc xóa bộ lọc nhé.'
            : dark
              ? 'Tháng đang xem chưa có giao dịch. Những khoản thu, chi sẽ được sắp gọn tại đây.'
              : 'Tháng đang xem chưa có giao dịch.'}
        </p>
        <div className="history-empty-actions">
          {hasFilters ? (
            <>
              <button
                className="button primary"
                type="button"
                onClick={onClearFilters}
                aria-label="Xóa bộ lọc trong lịch sử"
              >
                <RotateCcw size={14} aria-hidden="true" /> Xóa bộ lọc
              </button>
              <ActionButton onClick={onAdd} aria-label="Thêm giao dịch mới">
                <Plus size={14} aria-hidden="true" /> Ghi mới
              </ActionButton>
            </>
          ) : (
            <ActionButton onClick={onAdd}>
              <Plus size={14} aria-hidden="true" /> Thêm giao dịch
            </ActionButton>
          )}
        </div>
      </div>
    </section>
  )
}
