export const DARK_CATEGORY_COLORS = {
  food: '#ff9d72',
  shopping: '#a78bfa',
  transport: '#5ed6ad',
  home: '#4f8cff',
  fun: '#df75d4',
  health: '#ff789d',
  study: '#63cfe8',
  other: '#a8b6d4',
  income: '#5ed6ad',
}

export const categoryThemeColor = (category, theme) =>
  theme === 'dark'
    ? DARK_CATEGORY_COLORS[category.id] || DARK_CATEGORY_COLORS.other
    : category.color
