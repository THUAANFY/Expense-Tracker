import useAppearance from '../../app/theme/useAppearance'
import CategoryArt from '../../shared/illustrations/CategoryArt'
import DarkCategoryArt from '../../app/theme/DarkCategoryArt'

export default function SettingsCategoryMark({ category, size = 32 }) {
  const { theme } = useAppearance()
  return theme === 'dark' ? (
    <DarkCategoryArt category={category} size={size} className="settings-category-mark" />
  ) : (
    <CategoryArt category={category} size={size} />
  )
}
