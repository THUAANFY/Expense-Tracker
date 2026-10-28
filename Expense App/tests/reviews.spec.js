import { expect, test } from '@playwright/test'
import { createDemoData, dateKey, isValidData, monthKey } from '../src/data.js'
import { summarizeReviews, withReview } from '../src/reviews.js'
import { chooseHistoryFilter } from './helpers/history-filters.js'

const currentMonth = monthKey()
const now = new Date()
const previousDate = dateKey(new Date(now.getFullYear(), now.getMonth() - 1, 5))

function reviewData() {
  const data = createDemoData()
  const expense = (id, title, amount, category, date = `${currentMonth}-05`) => ({
    id,
    title,
    amount,
    category,
    date,
    type: 'expense',
    wallet: 'Chuyển khoản',
    note: '',
    createdAt: Date.now(),
  })
  data.transactions = [
    expense('lunch', 'Bữa trưa cùng bạn', 120000, 'food'),
    expense('bag', 'Túi vải mới', 450000, 'shopping'),
    expense('book', 'Sách cuối tuần', 180000, 'study'),
    { ...expense('salary', 'Lương tháng này', 5000000, 'other'), type: 'income' },
    expense('previous', 'Cà phê tháng trước', 70000, 'food', previousDate),
  ]
  return data
}

async function seed(page, data = reviewData()) {
  await page.addInitScript((value) => {
    if (!localStorage.getItem('may-expense-tracker-v1'))
      localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
  await page.goto('/')
}

async function navigate(page, label = 'Đáng tiền không?') {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page
    .locator('.sidebar')
    .getByRole('button', {
      name: label === 'Đáng tiền không?' ? 'Túi chi tiêu' : label,
      exact: true,
    })
    .click()
  if (label === 'Đáng tiền không?')
    await page.getByRole('button', { name: 'Cảm nhận đã lưu', exact: true }).click()
  await expect(page.locator('.page-content')).toBeVisible()
}

const row = (page, id) => page.locator(`.worth-row[data-transaction-id="${id}"]`)
const stored = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('may-expense-tracker-v1')))

test('one-click feelings update totals and persist without changing finance or notes', async ({
  page,
}) => {
  const data = reviewData()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await seed(page, data)
  await navigate(page)
  await expect(page.locator('.worth-row')).toHaveCount(3)
  await expect(page.locator('.worth-workspace')).not.toContainText('Lương tháng này')
  await row(page, 'lunch').getByRole('button', { name: 'Hài lòng', exact: true }).click()
  await row(page, 'bag').getByRole('button', { name: 'Hơi tiếc', exact: true }).click()
  await row(page, 'book').getByRole('button', { name: 'Bình thường', exact: true }).click()
  await expect(page.locator('.worth-progress-label')).toContainText('3/3')
  await expect(page.locator('.worth-summary > button[data-mood="happy"]')).toContainText('120')
  await expect(page.locator('.sidebar [data-section="bags"]')).toHaveAttribute(
    'aria-current',
    'page',
  )
  const saved = await stored(page)
  expect(saved.notes).toEqual(data.notes)
  expect(saved.transactions.map(({ review, ...transaction }) => transaction)).toEqual(
    data.transactions,
  )
  expect(summarizeReviews(saved.transactions).reviewed).toBe(3)
  await page.reload()
  await navigate(page)
  await expect(
    row(page, 'lunch').getByRole('button', { name: 'Hài lòng', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    row(page, 'bag').getByRole('button', { name: 'Hơi tiếc', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('reason dialog validates, edits and removes a review while preserving the transaction', async ({
  page,
}) => {
  await seed(page)
  await navigate(page)
  const trigger = row(page, 'lunch').getByRole('button', {
    name: 'Thêm lý do cho Bữa trưa cùng bạn',
  })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Khoản chi này thế nào?' })
  await dialog.getByRole('button', { name: 'Lưu cảm nhận' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Chọn một cảm nhận')
  await dialog.getByRole('button', { name: 'Hài lòng', exact: true }).click()
  await dialog
    .getByRole('textbox', { name: 'Lý do của bạn', exact: true })
    .fill('  Bữa ăn ngon, có thời gian trò chuyện.  ')
  await dialog.getByRole('button', { name: 'Lưu cảm nhận' }).click()
  await expect(row(page, 'lunch')).toContainText('Bữa ăn ngon, có thời gian trò chuyện.')
  const edit = row(page, 'lunch').getByRole('button', { name: 'Sửa cảm nhận Bữa trưa cùng bạn' })
  await expect(edit).toBeFocused()
  await edit.click()
  await expect(dialog.getByRole('textbox', { name: 'Lý do của bạn', exact: true })).toHaveValue(
    'Bữa ăn ngon, có thời gian trò chuyện.',
  )
  await dialog.getByRole('button', { name: 'Bình thường', exact: true }).click()
  await dialog.getByRole('button', { name: 'Lưu cảm nhận' }).click()
  await expect(
    row(page, 'lunch').getByRole('button', { name: 'Bình thường', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await edit.click()
  await dialog.getByRole('button', { name: 'Bỏ đánh giá' }).click()
  expect(
    (await stored(page)).transactions.find((item) => item.id === 'lunch').review,
  ).toBeUndefined()
  await expect(row(page, 'lunch')).not.toContainText('Bữa ăn ngon')
  await expect(page.locator('.worth-progress-label')).toContainText('0/3')
})

test('month, feeling, status, category and accent-free reason search filter the same records', async ({
  page,
}) => {
  const data = reviewData()
  data.transactions[0] = withReview(data.transactions[0], {
    rating: 'happy',
    note: 'Đáng nhớ vì được gặp bạn',
  })
  await seed(page, data)
  await navigate(page)
  await page.getByRole('textbox', { name: 'Tìm khoản chi để đánh giá' }).fill('dang nho')
  await expect(page.locator('.worth-row')).toHaveCount(1)
  await expect(row(page, 'lunch')).toBeVisible()
  await page.getByRole('button', { name: 'Xóa tìm kiếm đánh giá' }).click()
  await chooseHistoryFilter(page, 'Lọc danh mục đánh giá', 'Mua sắm')
  await expect(page.locator('.worth-row')).toHaveCount(1)
  await expect(row(page, 'bag')).toBeVisible()
  await chooseHistoryFilter(page, 'Lọc danh mục đánh giá', 'Mọi danh mục')
  await page.locator('.worth-summary > button[data-mood="happy"]').click()
  await expect(page.locator('.worth-row')).toHaveCount(1)
  const status = page.getByRole('group', { name: 'Trạng thái đánh giá' })
  await status.getByRole('button', { name: 'Chưa đánh giá' }).click()
  await expect(page.locator('.worth-row')).toHaveCount(2)
  await status.getByRole('button', { name: 'Đã đánh giá', exact: true }).click()
  await expect(row(page, 'lunch')).toBeVisible()
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  await expect(page.locator('.worth-row')).toHaveCount(1)
  await expect(row(page, 'previous')).toBeVisible()
  await page.getByRole('button', { name: 'Tháng sau', exact: true }).click()
  await expect(page.locator('.worth-row')).toHaveCount(3)
})

test('financial edits keep the review; converting to income clears it and remains reloadable', async ({
  page,
}) => {
  const data = reviewData()
  data.transactions[0] = withReview(data.transactions[0], { rating: 'happy', note: 'Ngon và vui' })
  const review = data.transactions[0].review
  await seed(page, data)
  await navigate(page)
  await row(page, 'lunch')
    .getByRole('button', { name: 'Sửa giao dịch Bữa trưa cùng bạn', exact: true })
    .click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('150000')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  expect((await stored(page)).transactions[0].review).toEqual(review)
  await expect(row(page, 'lunch')).toContainText('150.000')
  await row(page, 'lunch')
    .getByRole('button', { name: 'Sửa giao dịch Bữa trưa cùng bạn', exact: true })
    .click()
  await dialog.getByRole('button', { name: 'Khoản thu', exact: true }).click()
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(row(page, 'lunch')).toHaveCount(0)
  const saved = await stored(page)
  expect(saved.transactions[0].review).toBeUndefined()
  expect(isValidData(saved)).toBeTruthy()
  expect(saved.notes).toEqual(data.notes)
  await page.reload()
  await expect(page.locator('.storage-alert')).toHaveCount(0)
  await navigate(page)
  await expect(page.locator('.worth-row')).toHaveCount(2)
})

test('backup accepts legacy books and validates optional reviews; JSON round-trip keeps feelings', async ({
  page,
}) => {
  const data = reviewData()
  expect(isValidData(data)).toBeTruthy()
  data.transactions[0] = withReview(data.transactions[0], {
    rating: 'regret',
    note: 'Lần sau chọn quán khác',
  })
  expect(isValidData(data)).toBeTruthy()
  for (const review of [
    null,
    [],
    { rating: 'bad', note: '', updatedAt: Date.now() },
    { rating: 'happy', note: 'x'.repeat(501), updatedAt: Date.now() },
    { rating: 'happy', note: '', updatedAt: -1 },
  ]) {
    const invalid = structuredClone(data)
    invalid.transactions[0].review = review
    expect(isValidData(invalid)).toBeFalsy()
  }
  const invalidIncome = structuredClone(data)
  invalidIncome.transactions[0].type = 'income'
  expect(isValidData(invalidIncome)).toBeFalsy()
  await seed(page, data)
  await navigate(page, 'Cài đặt')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất bản sao lưu' }).click()
  const download = await downloadPromise
  await page.locator('input[type="file"]').setInputFiles(await download.path())
  const preview = page.getByRole('dialog')
  await expect(preview).toContainText('Khôi phục')
  await preview.getByRole('button', { name: 'Khôi phục dữ liệu' }).click()
  await navigate(page)
  await expect(
    row(page, 'lunch').getByRole('button', { name: 'Hơi tiếc', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect((await stored(page)).transactions[0].review).toEqual(data.transactions[0].review)
})

test('saved notes stay available through the secondary entry and keep all their content', async ({
  page,
}) => {
  const data = reviewData()
  await seed(page, data)
  await navigate(page)
  await page.getByRole('button', { name: 'Ghi chú đã lưu', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ghi chú đã lưu.')
  await expect(page.locator('.notebook-grid .note-card')).toHaveCount(data.notes.length)
  expect((await stored(page)).notes).toEqual(data.notes)
  await page.locator('.notes-parent-link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Túi chi tiêu theo dịp')
})

for (const width of [320, 390]) {
  test(`review controls and dialog fit a ${width}px phone and save by keyboard`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 568 })
    await seed(page)
    await navigate(page)
    await expect(row(page, 'lunch')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await row(page, 'lunch')
      .getByRole('button', { name: 'Thêm lý do cho Bữa trưa cùng bạn' })
      .click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Hài lòng', exact: true }).focus()
    await page.keyboard.press('Space')
    await dialog
      .getByRole('textbox', { name: 'Lý do của bạn', exact: true })
      .fill('Đáng tiền trên điện thoại')
    await dialog.getByRole('button', { name: 'Lưu cảm nhận' }).click()
    await expect(dialog).not.toBeVisible()
    await expect(row(page, 'lunch')).toContainText('Đáng tiền trên điện thoại')
    await expect(
      row(page, 'lunch').getByRole('button', { name: 'Sửa cảm nhận Bữa trưa cùng bạn' }),
    ).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}
