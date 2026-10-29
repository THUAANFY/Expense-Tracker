import { expect, test } from '@playwright/test'
import { createEmptyData, monthKey, STORAGE_KEY } from '../../src/shared/storage/data.js'
import { chooseHistoryFilter } from '../helpers/history-filters.js'

const month = monthKey()
const now = new Date()
const previousMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
const actionName = 'Xem giao dịch vừa lưu'
function fixture() {
  const data = createEmptyData()
  data.bags = [
    {
      id: 'trip',
      name: 'Chuyến đi nhỏ',
      description: '',
      budget: 1000000,
      style: 'trip',
      color: 'lilac',
      status: 'active',
      createdAt: Date.now(),
    },
  ]
  const expense = (id, title, date, amount = 20000) => ({
    id,
    title,
    date,
    amount,
    type: 'expense',
    category: 'shopping',
    note: '',
    wallet: 'Tiền mặt',
    createdAt: Date.now(),
  })
  data.transactions = [
    ...Array.from({ length: 20 }, (_, i) => ({
      ...expense(`current-${i}`, `Đang lọc ${i}`, `${month}-01`, 20000 + i * 1000),
      createdAt: i + 1,
    })),
    ...Array.from({ length: 24 }, (_, i) =>
      expense(
        `old-${i}`,
        `Khoản tháng trước ${i}`,
        `${previousMonth}-${String(i + 3).padStart(2, '0')}`,
      ),
    ),
  ]
  return data
}
async function seed(page, data = fixture()) {
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function navigate(page, label) {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).click()
  await expect(page.locator('.page-content')).toBeVisible()
}
async function prepare(page, title) {
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill(title)
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('25000')
  return dialog
}
async function save(dialog) {
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const row = (page, id) =>
  page.locator(`.history-ledger .transaction-row[data-transaction-id="${id}"]`)
const action = (page) => page.getByRole('button', { name: actionName, exact: true })

test('saving preserves the current filters; the action reveals the saved record and resets all hiding controls', async ({
  page,
}) => {
  await seed(page)
  await navigate(page, 'Lịch sử giao dịch')
  await page
    .getByRole('group', { name: 'Loại giao dịch', exact: true })
    .getByRole('button', { name: 'Khoản chi', exact: true })
    .click()
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Mua sắm')
  await chooseHistoryFilter(page, 'Sắp xếp giao dịch', 'Số tiền cao nhất')
  await page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch' }).fill('đang lọc')
  await page.getByRole('button', { name: 'Trang sau', exact: true }).click()
  const dialog = await prepare(page, 'Khoản thu vừa lưu')
  await dialog.getByRole('button', { name: 'Khoản thu', exact: true }).click()
  await save(dialog)
  const saved = (await stored(page)).transactions.find((item) => item.title === 'Khoản thu vừa lưu')
  expect(saved.category).toBe('food')
  expect(saved.type).toBe('income')
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })).toContainText(
    'Mua sắm',
  )
  await expect(page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch' })).toHaveValue(
    'đang lọc',
  )
  await expect(page.locator('.pagination')).toContainText('Trang 2/3')
  await expect(row(page, saved.id)).toHaveCount(0)
  await action(page).click()
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })).toContainText(
    'Mọi danh mục',
  )
  await expect(
    page.getByRole('combobox', { name: 'Sắp xếp giao dịch', exact: true }),
  ).toContainText('Mới nhất')
  await expect(page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch' })).toHaveValue('')
  await expect(
    page
      .getByRole('group', { name: 'Loại giao dịch', exact: true })
      .getByRole('button', { name: 'Tất cả', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.pagination')).toContainText('Trang 1/3')
  await expect(row(page, saved.id)).toBeFocused()
  await expect(row(page, saved.id)).toBeInViewport({ ratio: 0.95 })
  await expect(row(page, saved.id)).toHaveAttribute('data-highlighted', 'true')
  expect((await stored(page)).transactions.filter((item) => item.id === saved.id)).toHaveLength(1)
})

test('a new record cannot use a closed month and its save action still reveals it', async ({
  page,
}) => {
  await seed(page)
  const dialog = await prepare(page, 'Khoản ghi lùi tháng')
  await dialog.getByRole('button', { name: /Ngày giao dịch/ }).click()
  const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
  await calendar.getByRole('button', { name: 'Tháng trước của lịch', exact: true }).click()
  await expect(calendar.locator(`[data-date="${previousMonth}-01"]`)).toBeDisabled()
  await calendar.getByRole('button', { name: 'Đóng lịch', exact: true }).click()
  await save(dialog)
  const saved = (await stored(page)).transactions.find(
    (item) => item.title === 'Khoản ghi lùi tháng',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await action(page).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mỗi khoản chi, một câu chuyện.')
  const [year, number] = month.split('-')
  await expect(
    page.getByRole('button', { name: 'Chọn tháng thống kê', exact: true }),
  ).toContainText(`Tháng ${number}, ${year}`)
  expect(saved.date.startsWith(month)).toBeTruthy()
  await expect(row(page, saved.id)).toBeFocused()
  await expect(row(page, saved.id)).toBeInViewport({ ratio: 0.95 })
})

test('an edited record hidden by its old category can be revealed without creating a duplicate', async ({
  page,
}) => {
  await seed(page)
  await navigate(page, 'Lịch sử giao dịch')
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Mua sắm')
  await row(page, 'current-19').click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('button', { name: 'Ăn uống', exact: true }).click()
  await dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Đã sửa danh mục')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(row(page, 'current-19')).toHaveCount(0)
  await expect(page.locator('.toast')).toContainText('Đã cập nhật giao dịch')
  await action(page).click()
  await expect(row(page, 'current-19')).toBeFocused()
  await expect(row(page, 'current-19')).toContainText('Đã sửa danh mục')
  expect((await stored(page)).transactions).toHaveLength(fixture().transactions.length)
})

test('saving inside a bag keeps its context until the action opens history with the same linked expense', async ({
  page,
}) => {
  await seed(page)
  await navigate(page, 'Túi chi tiêu')
  await page.getByRole('button', { name: 'Mở túi Chuyến đi nhỏ', exact: true }).click()
  await page.getByRole('button', { name: 'Thêm khoản chi', exact: true }).click()
  const dialog = page.locator('.transaction-dialog')
  await dialog
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Ăn uống trong chuyến đi')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('50000')
  await save(dialog)
  await expect(page.locator('.bag-detail')).toBeVisible()
  const saved = (await stored(page)).transactions.find(
    (item) => item.title === 'Ăn uống trong chuyến đi',
  )
  expect(saved.bagId).toBe('trip')
  await action(page).click()
  await expect(row(page, saved.id)).toBeFocused()
  expect((await stored(page)).transactions.find((item) => item.id === saved.id).bagId).toBe('trip')
})

for (const width of [320, 390]) {
  test(`the ${width}px toast fits and its action works by keyboard with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 568 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seed(page)
    await save(await prepare(page, 'Giao dịch trên màn hình nhỏ'))
    const toast = page.locator('.toast')
    await expect(toast).toBeVisible()
    await expect
      .poll(() =>
        toast.evaluate((e) => {
          const rect = e.getBoundingClientRect()
          return (
            rect.left >= 0 &&
            rect.right <= innerWidth &&
            rect.top >= 0 &&
            rect.bottom <= innerHeight &&
            e.scrollWidth <= e.clientWidth
          )
        }),
      )
      .toBeTruthy()
    await action(page).focus()
    await page.keyboard.press('Enter')
    const saved = (await stored(page)).transactions.find(
      (item) => item.title === 'Giao dịch trên màn hình nhỏ',
    )
    await expect(row(page, saved.id)).toBeFocused()
    await expect
      .poll(() =>
        row(page, saved.id).evaluate((e) => {
          const rect = e.getBoundingClientRect()
          return rect.top >= 60 && rect.bottom <= innerHeight
        }),
      )
      .toBeTruthy()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('the action stays available while focused or hovered and later dismisses automatically', async ({
  page,
}) => {
  await page.clock.install()
  await seed(page)
  await save(await prepare(page, 'Giao dịch kiểm tra bàn phím'))
  await action(page).focus()
  await page.clock.runFor(12000)
  await expect(action(page)).toBeVisible()
  await page.getByRole('heading', { level: 1 }).click()
  await action(page).hover()
  await page.clock.runFor(12000)
  await expect(action(page)).toBeVisible()
  await page.mouse.move(2, 2)
  await page.clock.runFor(11000)
  await expect(action(page)).toHaveCount(0)
})

test('the action handles a record deleted in another tab instead of opening an empty result', async ({
  page,
  context,
}) => {
  await seed(page)
  await save(await prepare(page, 'Khoản vừa bị xóa ở tab khác'))
  const saved = (await stored(page)).transactions.find(
    (item) => item.title === 'Khoản vừa bị xóa ở tab khác',
  )
  await action(page).focus()
  const other = await context.newPage()
  await other.goto('/')
  await other.evaluate(
    ({ key, id }) => {
      const data = JSON.parse(localStorage.getItem(key))
      data.transactions = data.transactions.filter((item) => item.id !== id)
      localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, id: saved.id },
  )
  await expect(page.locator(`.recent-panel [data-transaction-id="${saved.id}"]`)).toHaveCount(0)
  await action(page).click()
  await expect(page.getByRole('status')).toContainText('Giao dịch này không còn trong sổ hiện tại.')
  await expect(action(page)).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
})

test('a failed save retains the draft and never offers the success action', async ({ page }) => {
  await seed(page)
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Storage full', 'QuotaExceededError')
      return original.call(this, name, value)
    }
  }, STORAGE_KEY)
  const dialog = await prepare(page, 'Bản nháp chưa lưu được')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('Không thể lưu')
  await expect(action(page)).toHaveCount(0)
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toHaveValue(
    'Bản nháp chưa lưu được',
  )
  expect((await stored(page)).transactions).toHaveLength(fixture().transactions.length)
})
