export const REVIEW_OPTIONS = [
  { id: 'happy', label: 'Hài lòng', color: '#567649', background: '#f0f7e9' },
  { id: 'neutral', label: 'Bình thường', color: '#775b91', background: '#f5eefb' },
  { id: 'regret', label: 'Hơi tiếc', color: '#9a6551', background: '#fff1e8' },
]

export const getReviewOption = (rating) => REVIEW_OPTIONS.find((option) => option.id === rating)

export function isValidReview(review) {
  return Boolean(
    review &&
    !Array.isArray(review) &&
    getReviewOption(review.rating) &&
    typeof review.note === 'string' &&
    review.note.length <= 500 &&
    Number.isFinite(review.updatedAt) &&
    review.updatedAt > 0 &&
    review.updatedAt <= 8640000000000000,
  )
}

export function withReview(transaction, review, updatedAt = Date.now()) {
  const original = { ...transaction }
  delete original.review
  if (review === null || transaction.type !== 'expense') return original
  if (!getReviewOption(review.rating)) return transaction
  return {
    ...original,
    review: {
      rating: review.rating,
      note: String(review.note || '')
        .trim()
        .slice(0, 500),
      updatedAt,
    },
  }
}

export function summarizeReviews(transactions) {
  const result = {
    total: 0,
    reviewed: 0,
    pending: 0,
    ...Object.fromEntries(REVIEW_OPTIONS.map(({ id }) => [id, { count: 0, amount: 0 }])),
  }
  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    result.total++
    if (isValidReview(transaction.review)) {
      result.reviewed++
      result[transaction.review.rating].count++
      result[transaction.review.rating].amount += transaction.amount
    } else result.pending++
  }
  return result
}
