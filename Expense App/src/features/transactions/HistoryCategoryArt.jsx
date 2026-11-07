import DarkCategoryArt from '../../app/theme/DarkCategoryArt'
import { getCategory } from '../../shared/storage/data'

// Define each visible illustration once. Rows and their badges share its SVG resources.
export function HistoryCategorySymbols({ prefix, transactions }) {
  const categories = [
    ...new Set(
      transactions.map((item) =>
        item.type === 'income' ? 'income' : getCategory(item.category).id,
      ),
    ),
  ]
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }}
    >
      <defs>
        {categories.map((category) => (
          <symbol key={category} id={`${prefix}-${category}`} viewBox="0 0 64 64">
            <DarkCategoryArt category={category} size={64} />
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

export default function HistoryCategoryArt({ prefix, category, size }) {
  return (
    <svg
      className="category-art dark-category-art"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-theme-art={`category-${category}`}
    >
      <use href={`#${prefix}-${category}`} width="64" height="64" />
    </svg>
  )
}
