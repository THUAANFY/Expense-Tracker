import { expect, test } from '@playwright/test'
import { dateKey, isValidData, monthKey } from '../src/data.js'
import { createSampleData } from './helpers/fixtures.js'
import { withReview } from '../src/reviews.js'
import { bagSummary } from '../src/bags.js'
import { chooseHistoryFilter } from './helpers/history-filters.js'

const month = monthKey()
const now = new Date()
const previous = dateKey(new Date(now.getFullYear(), now.getMonth() - 1, 5))
const makeBag = (id, name, overrides = {}) => ({
  id,
  name,
  description: 'Một dịp thật vui.',
  budget: 300000,
  style: 'trip',
  color: 'lilac',
  status: 'active',
  createdAt: Date.now(),
  ...overrides,
})
const expense = (id, title, amount = 120000, overrides = {}) => ({
  id,
  title,
  amount,
  category: 'food',
  date: `${month}-05`,
  type: 'expense',
  wallet: 'Chuyển khoản',
  note: '',
  createdAt: Date.now(),
  ...overrides,
})

function fixture() {
  const data = createSampleData()
  data.bags = [
    makeBag('trip', 'Chuyến đi Đà Lạt'),
    makeBag('gift', 'Quà sinh nhật', { style: 'gift', color: 'peach', budget: 1000000 }),
  ]
  data.transactions = [
    expense('lunch', 'Bữa trưa cùng bạn'),
    expense('old', 'Vé xe tháng trước', 180000, { date: previous, category: 'transport' }),
    expense('other-bag', 'Bánh sinh nhật', 70000, { bagId: 'gift' }),
    expense('income', 'Lương tháng này', 5000000, { type: 'income' }),
  ]
  return data
}

async function seed(page, data = fixture()) {
  await page.addInitScript((value) => {
    if (!localStorage.getItem('may-expense-tracker-v1'))
      localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
  await page.goto('/')
}

async function navigate(page, label = 'Túi chi tiêu') {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).click()
  await expect(page.locator('.page-content')).toBeVisible()
}

const stored = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('may-expense-tracker-v1')))
const openBag = async (page, name = 'Chuyến đi Đà Lạt') => {
  await page.getByRole('button', { name: `Mở túi ${name}`, exact: true }).click()
  await expect(page.locator('.bag-detail')).toBeVisible()
}

test('legacy data can create a styled bag, group open-month expenses and preserve closed-month records', async ({
  page,
}) => {
  const data = fixture()
  data.transactions = data.transactions.filter((item) => item.id !== 'other-bag')
  delete data.bags
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await seed(page, data)
  await navigate(page)
  await expect(page.locator('.bags-empty')).toBeVisible()
  await page.getByRole('button', { name: 'Tạo túi', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Tên túi', exact: true }).fill('Đi chơi cuối tuần')
  await dialog.getByRole('spinbutton', { name: 'Ngân sách của túi' }).fill('300000')
  await dialog.getByRole('button', { name: 'Quà tặng', exact: true }).click()
  await dialog.getByRole('button', { name: 'Đào hồng', exact: true }).click()
  await dialog.getByRole('textbox', { name: 'Mô tả túi' }).fill('Gom những kỷ niệm nhỏ.')
  await dialog.getByRole('button', { name: 'Tạo túi', exact: true }).click()
  await page.getByRole('button', { name: 'Chọn giao dịch', exact: true }).click()
  await expect(dialog.getByRole('checkbox', { name: 'Lương tháng này', exact: true })).toHaveCount(
    0,
  )
  await dialog.getByRole('checkbox', { name: 'Bữa trưa cùng bạn', exact: true }).check()
  await expect(
    dialog.getByRole('checkbox', { name: 'Vé xe tháng trước', exact: true }),
  ).toBeDisabled()
  await dialog.getByRole('button', { name: 'Lưu vào túi' }).click()
  await expect(page.locator('.bag-detail-hero')).toContainText('300.000')
  await expect(page.locator('.bag-detail-hero')).toContainText('120.000')
  await expect(page.locator('.bag-expense-row')).toHaveCount(1)
  const saved = await stored(page)
  expect(saved.bags[0]).toMatchObject({
    name: 'Đi chơi cuối tuần',
    style: 'gift',
    color: 'peach',
    budget: 300000,
  })
  expect(saved.transactions.map(({ bagId, ...item }) => item)).toEqual(data.transactions)
  expect(saved.notes).toEqual(data.notes)
  expect(isValidData(saved)).toBeTruthy()
  await page.reload()
  await navigate(page)
  await openBag(page, 'Đi chơi cuối tuần')
  await expect(page.locator('.bag-expense-row')).toHaveCount(1)
  expect(errors).toEqual([])
})

test('new expenses preselect the bag; editing budget and amount updates the actual totals', async ({
  page,
}) => {
  await seed(page)
  await navigate(page)
  await openBag(page)
  await page.getByRole('button', { name: 'Thêm khoản chi', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('combobox', { name: 'Túi chi tiêu của giao dịch' })).toContainText(
    'Chuyến đi Đà Lạt',
  )
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('450000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Bữa tối chuyến đi')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(page.locator('.bag-detail-hero')).toContainText('Vượt 150.000')
  expect((await stored(page)).transactions).toHaveLength(5)
  await page.getByRole('button', { name: 'Sửa khoản chi Bữa tối chuyến đi', exact: true }).click()
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('250000')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(page.locator('.bag-detail-hero')).toContainText('Còn 50.000')
  await page.getByRole('button', { name: 'Sửa túi', exact: true }).click()
  await dialog.getByRole('spinbutton', { name: 'Ngân sách của túi' }).fill('0')
  await dialog.getByRole('button', { name: 'Lưu túi', exact: true }).click()
  await expect(page.locator('.bag-detail-hero .bag-no-budget')).toHaveText('Chưa đặt ngân sách')
  expect(isValidData(await stored(page))).toBeTruthy()
})

test('moving an expense updates both bags and income conversion removes its bag and review', async ({
  page,
}) => {
  const data = fixture()
  data.transactions[0] = withReview(
    { ...data.transactions[0], bagId: 'trip' },
    { rating: 'happy', note: 'Vui và ngon' },
  )
  const review = data.transactions[0].review
  await seed(page, data)
  await navigate(page)
  await openBag(page)
  await page.getByRole('button', { name: 'Sửa khoản chi Bữa trưa cùng bạn', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await chooseHistoryFilter(page, 'Túi chi tiêu của giao dịch', 'Quà sinh nhật')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(page.locator('.bag-expense-row')).toHaveCount(0)
  const moved = await stored(page)
  expect(moved.transactions[0].review).toEqual(review)
  expect(bagSummary(moved.bags[0], moved.transactions).spent).toBe(0)
  expect(bagSummary(moved.bags[1], moved.transactions).spent).toBe(190000)
  await page.getByRole('button', { name: 'Tất cả túi', exact: true }).click()
  await openBag(page, 'Quà sinh nhật')
  await page.getByRole('button', { name: 'Sửa khoản chi Bữa trưa cùng bạn', exact: true }).click()
  await dialog.getByRole('button', { name: 'Khoản thu', exact: true }).click()
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  const saved = await stored(page)
  expect(saved.transactions[0].bagId).toBeUndefined()
  expect(saved.transactions[0].review).toBeUndefined()
  expect(isValidData(saved)).toBeTruthy()
  await page.reload()
  await expect(page.locator('.storage-alert')).toHaveCount(0)
})

test('completion, reopening, unlinking and deleting a bag preserve financial records and saved notes', async ({
  page,
}) => {
  const data = fixture()
  data.transactions[0] = withReview(
    { ...data.transactions[0], bagId: 'trip' },
    { rating: 'neutral', note: 'Ổn' },
  )
  await seed(page, data)
  await navigate(page)
  await openBag(page)
  await page.getByRole('button', { name: 'Đánh dấu hoàn tất', exact: true }).click()
  await page.getByRole('button', { name: 'Tất cả túi', exact: true }).click()
  await page
    .getByRole('group', { name: 'Trạng thái túi' })
    .getByRole('button', { name: 'Hoàn tất', exact: true })
    .click()
  await expect(page.locator('.bag-card')).toHaveCount(1)
  await openBag(page)
  await page.getByRole('button', { name: 'Mở lại túi', exact: true }).click()
  await page.getByRole('button', { name: 'Bỏ Bữa trưa cùng bạn khỏi túi', exact: true }).click()
  await expect(page.locator('.bag-expense-row')).toHaveCount(0)
  await page.getByRole('button', { name: 'Chọn giao dịch', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('checkbox', { name: 'Bữa trưa cùng bạn', exact: true }).check()
  await dialog.getByRole('button', { name: 'Lưu vào túi' }).click()
  await page.getByRole('button', { name: 'Sửa túi', exact: true }).click()
  await dialog.getByRole('button', { name: 'Xóa túi', exact: true }).click()
  await expect(dialog).toContainText('Các giao dịch và cảm nhận vẫn được giữ')
  await dialog.getByRole('button', { name: 'Xác nhận xóa túi', exact: true }).click()
  const saved = await stored(page)
  expect(saved.bags.map((bag) => bag.id)).toEqual(['gift'])
  expect(saved.transactions.map(({ bagId, ...item }) => item)).toEqual(
    data.transactions.map(({ bagId, ...item }) => item),
  )
  expect(saved.transactions[0].bagId).toBeUndefined()
  expect(saved.transactions[2].bagId).toBe('gift')
  expect(saved.notes).toEqual(data.notes)
  expect(isValidData(saved)).toBeTruthy()
})

test('picker selection survives search and pagination and excludes expenses in another bag', async ({
  page,
}) => {
  const data = fixture()
  data.transactions.push(
    ...Array.from({ length: 12 }, (_, i) =>
      expense(`extra-${i + 1}`, `Khoản chi ${i + 1}`, 10000, { createdAt: Date.now() + i * 1000 }),
    ),
  )
  await seed(page, data)
  await navigate(page)
  await openBag(page)
  await page.getByRole('button', { name: 'Chọn giao dịch', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('checkbox', { name: 'Bánh sinh nhật', exact: true })).toHaveCount(0)
  await dialog.getByRole('checkbox', { name: 'Khoản chi 12', exact: true }).check()
  await dialog.getByRole('button', { name: 'Trang giao dịch sau', exact: true }).click()
  await dialog.getByRole('checkbox', { name: 'Khoản chi 1', exact: true }).check()
  await dialog.getByRole('textbox', { name: 'Tìm giao dịch để thêm vào túi' }).fill('bua trua')
  await expect(dialog.getByRole('checkbox')).toHaveCount(1)
  await dialog.getByRole('checkbox', { name: 'Bữa trưa cùng bạn', exact: true }).check()
  await expect(dialog.locator('.bag-selection-total')).toContainText('3 khoản')
  await dialog.getByRole('button', { name: 'Lưu vào túi' }).click()
  const saved = await stored(page)
  expect(
    saved.transactions
      .filter((item) => item.bagId === 'trip')
      .map((item) => item.id)
      .sort(),
  ).toEqual(['extra-1', 'extra-12', 'lunch'])
  expect(saved.transactions.find((item) => item.id === 'other-bag').bagId).toBe('gift')
  await expect(page.locator('.bag-detail-hero')).toContainText('140.000')
})

test('backup validates bag links, supports old books and restores bags with their transactions', async ({
  page,
}) => {
  const data = fixture()
  data.transactions[0].bagId = 'trip'
  expect(isValidData(data)).toBeTruthy()
  const legacy = structuredClone(data)
  delete legacy.bags
  legacy.transactions.forEach((item) => delete item.bagId)
  expect(isValidData(legacy)).toBeTruthy()
  for (const mutate of [
    (value) => {
      value.bags.push({ ...value.bags[0] })
    },
    (value) => {
      value.bags[0].budget = -1
    },
    (value) => {
      value.bags[0].style = 'unknown'
    },
    (value) => {
      value.transactions[0].bagId = 'missing'
    },
    (value) => {
      value.transactions[3].bagId = 'trip'
    },
  ]) {
    const invalid = structuredClone(data)
    mutate(invalid)
    expect(isValidData(invalid)).toBeFalsy()
  }
  await seed(page, data)
  await navigate(page, 'Cài đặt')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất bản sao lưu', exact: true }).click()
  const download = await downloadPromise
  await navigate(page)
  await openBag(page)
  await page.getByRole('button', { name: 'Bỏ Bữa trưa cùng bạn khỏi túi', exact: true }).click()
  await navigate(page, 'Cài đặt')
  await page.locator('input[type="file"]').setInputFiles(await download.path())
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.settings-import-preview')).toContainText('2 túi')
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await navigate(page)
  await openBag(page)
  await expect(page.locator('.bag-expense-row')).toHaveCount(1)
  expect((await stored(page)).bags).toEqual(data.bags)
  expect((await stored(page)).transactions).toEqual(data.transactions)
})

for (const width of [320, 390]) {
  test(`bag editing, selection and detail fit a short ${width}px phone`, async ({ page }) => {
    await page.setViewportSize({ width, height: 568 })
    await seed(page)
    await navigate(page)
    await page.getByRole('button', { name: 'Tạo túi', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await dialog
      .getByRole('textbox', { name: 'Tên túi', exact: true })
      .fill('Chăm chút góc làm việc và những điều mình yêu')
    await dialog.getByRole('spinbutton', { name: 'Ngân sách của túi' }).fill('1000000000000')
    await dialog.getByRole('button', { name: 'Công nghệ', exact: true }).click()
    await dialog.getByRole('button', { name: 'Vàng kem', exact: true }).click()
    await dialog
      .getByRole('textbox', { name: 'Mô tả túi' })
      .fill('Một chiếc túi dành cho những điều nhỏ.'.repeat(6))
    expect(
      await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBeTruthy()
    await dialog.getByRole('button', { name: 'Tạo túi', exact: true }).click()
    await expect(page.locator('.bag-detail')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await page.getByRole('button', { name: 'Chọn giao dịch', exact: true }).click()
    await dialog.getByRole('checkbox', { name: 'Bữa trưa cùng bạn', exact: true }).focus()
    await page.keyboard.press('Space')
    await dialog.getByRole('button', { name: 'Lưu vào túi', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Chọn giao dịch', exact: true })).toBeFocused()
    await expect(page.locator('.bag-expense-row')).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    expect(isValidData(await stored(page))).toBeTruthy()
  })
}
