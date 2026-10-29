import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { CATEGORIES, money, monthKey } from '../src/data.js'
import { createSampleData } from './helpers/fixtures.js'
import { chooseHistoryFilter } from './helpers/history-filters.js'

async function openHistory(page, records) {
  const data = createSampleData()
  const month = monthKey()
  data.transactions =
    records ||
    [
      ['old-food', 'Bữa sáng đầu tháng', 'food', 100000, '02'],
      ['high-food', 'Bữa tối cùng gia đình', 'food', 300000, '18'],
      ['shopping', 'Mua một cuốn sổ', 'shopping', 200000, '12'],
      ['new-food', 'Cà phê cuối tháng', 'food', 150000, '25'],
    ].map(([id, title, category, amount, day]) => ({
      id,
      title,
      category,
      amount,
      date: `${month}-${day}`,
      type: 'expense',
      wallet: 'Tiền mặt',
      note: '',
      createdAt: Date.now(),
    }))
  await page.addInitScript(
    (value) => localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value)),
    data,
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page
    .locator('.sidebar')
    .getByRole('button', { name: 'Lịch sử giao dịch', exact: true })
    .click()
  await expect(page.locator('.history-panel')).toBeVisible()
}

async function expectFitsViewport(panel) {
  await expect
    .poll(() =>
      panel.evaluate((element) => {
        const box = element.getBoundingClientRect()
        const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        return (
          box.left >= 0 &&
          box.top >= 0 &&
          box.right <= innerWidth + 1 &&
          box.bottom <= innerHeight + 1 &&
          element.scrollWidth <= element.clientWidth &&
          element.contains(target)
        )
      }),
    )
    .toBeTruthy()
}

test('custom category and sort filters update actual transactions and selected options', async ({
  page,
}) => {
  await openHistory(page)
  await expect(page.locator('.history-month-copy > strong')).toHaveText(`−${money(750000)}`)
  await expect(page.locator('.history-month-metric.is-income strong')).toHaveText(`+${money(0)}`)
  const rows = page.locator('.transaction-row')
  await expect(rows.first()).toContainText('Cà phê cuối tháng')
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Ăn uống')
  await expect(rows).toHaveCount(3)
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục' })).toContainText('Ăn uống')
  await chooseHistoryFilter(page, 'Sắp xếp giao dịch', 'Cũ nhất')
  await expect(rows.first()).toContainText('Bữa sáng đầu tháng')
  await expect(page.locator('.history-day-heading time').first()).toHaveAttribute(
    'datetime',
    `${monthKey()}-02`,
  )
  await chooseHistoryFilter(page, 'Sắp xếp giao dịch', 'Số tiền cao nhất')
  await expect(rows.first()).toContainText('Bữa tối cùng gia đình')
  await expect(page.locator('.history-day-group')).toHaveCount(0)
  await page.getByRole('combobox', { name: 'Sắp xếp giao dịch' }).click()
  await expect(page.getByRole('option', { name: 'Số tiền cao nhất', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.keyboard.press('Escape')
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Mua sắm')
  await expect(rows).toHaveCount(1)
  await expect(rows).toContainText('Mua một cuốn sổ')
  await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).click()
  await expect(rows).toHaveCount(4)
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục' })).toContainText('Mọi danh mục')
  await expect(page.locator('.history-panel select')).toHaveCount(0)
})

test('keyboard selection, typeahead, dismissal and switching between filter menus keep focus correctly', async ({
  page,
}) => {
  await openHistory(page)
  const sort = page.getByRole('combobox', { name: 'Sắp xếp giao dịch', exact: true })
  await sort.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('End')
  const high = page.getByRole('option', { name: 'Số tiền cao nhất', exact: true })
  await expect(sort).toHaveAttribute('aria-activedescendant', await high.getAttribute('id'))
  await page.keyboard.press('Enter')
  await expect(sort).toContainText('Số tiền cao nhất')
  await expect(sort).toBeFocused()
  await sort.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Escape')
  await expect(sort).toContainText('Số tiền cao nhất')
  await expect(sort).toBeFocused()
  await sort.click()
  const category = page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })
  await category.click()
  await expect(page.getByRole('listbox')).toHaveCount(1)
  await page.keyboard.press('a')
  await page.keyboard.press('n')
  const food = page.getByRole('option', { name: 'Ăn uống', exact: true })
  await expect(category).toHaveAttribute('aria-activedescendant', await food.getAttribute('id'))
  await page.keyboard.press('Enter')
  await expect(category).toContainText('Ăn uống')
  await category.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Enter')
  await expect(category).toContainText('Mọi danh mục')
  await category.click()
  await page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch' }).click()
  await expect(category).toHaveAttribute('aria-expanded', 'false')
  await sort.click()
  await page.keyboard.press('Tab')
  await expect(sort).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: 'Xuất CSV', exact: true })).toBeFocused()
})

test('expense categories exclude income carrying legacy category codes and coordinate with income tabs', async ({
  page,
}) => {
  const records = CATEGORIES.flatMap((category, index) =>
    ['expense', 'income'].map((type) => ({
      id: `${type}-${category.id}`,
      title: `${type === 'expense' ? 'Chi' : 'Thu'} thử nghiệm ${index + 1}`,
      type,
      category: category.id,
      amount: (index + 1) * 10000,
      date: `${monthKey()}-15`,
      note: '',
      wallet: 'Tiền mặt',
      createdAt: index + 1,
    })),
  )
  await openHistory(page, records)
  const rawBefore = await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))
  const categoryFilter = page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })
  const types = page.getByRole('group', { name: 'Loại giao dịch', exact: true })
  const rows = page.locator('.transaction-row')
  for (const category of CATEGORIES) {
    await chooseHistoryFilter(page, 'Lọc danh mục', category.name)
    await expect(rows).toHaveCount(1)
    await expect(rows).toHaveAttribute('data-transaction-id', `expense-${category.id}`)
    await expect(types.getByRole('button', { name: 'Khoản chi', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await types.getByRole('button', { name: 'Tất cả', exact: true }).click()
    await expect(rows).toHaveCount(1)
    await expect(rows).toHaveAttribute('data-transaction-id', `expense-${category.id}`)
    await types.getByRole('button', { name: 'Khoản thu', exact: true }).click()
    await expect(categoryFilter).toContainText('Mọi danh mục')
    await expect(rows).toHaveCount(CATEGORIES.length)
    expect(
      await rows.evaluateAll((elements) =>
        elements.every((element) => element.dataset.transactionId.startsWith('income-')),
      ),
    ).toBe(true)
  }
  await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).click()
  await expect(types.getByRole('button', { name: 'Tất cả', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('.history-workspace .pagination')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))).toBe(rawBefore)
})

test('income searches use its displayed category instead of a hidden expense code', async ({
  page,
}) => {
  const record = (id, title, type, category) => ({
    id,
    title,
    type,
    category,
    amount: 100000,
    date: `${monthKey()}-15`,
    note: '',
    wallet: 'Tiền mặt',
    createdAt: Date.now(),
  })
  await openHistory(page, [
    record('food', 'Bữa sáng', 'expense', 'food'),
    record('salary', 'Lương tháng', 'income', 'food'),
    record('bonus', 'Thưởng công việc', 'income', 'shopping'),
    record('refund', 'Hoàn tiền ăn uống', 'income', 'other'),
  ])
  const search = page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch', exact: true })
  const ids = () =>
    page
      .locator('.transaction-row')
      .evaluateAll((elements) => elements.map((element) => element.dataset.transactionId))
  await search.fill('an uong')
  await expect.poll(ids).toEqual(expect.arrayContaining(['food', 'refund']))
  await expect(page.locator('.transaction-row')).toHaveCount(2)
  await search.fill('thu nhap')
  await expect.poll(ids).toEqual(expect.arrayContaining(['salary', 'bonus', 'refund']))
  await expect(page.locator('.transaction-row')).toHaveCount(3)
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất CSV', exact: true }).click()
  const csv = await readFile(await (await downloading).path(), 'utf8')
  expect(csv.match(/"Thu nhập","Thu nhập"/g)).toHaveLength(3)
  expect(csv).not.toContain('"Thu nhập","Ăn uống"')
  expect(csv).not.toContain('"Thu nhập","Mua sắm"')
  await search.fill('mua sam')
  await expect(page.locator('.transaction-row')).toHaveCount(0)
})

test('the filtered empty state clears search, category and type without creating a transaction', async ({
  page,
}) => {
  await openHistory(page)
  const rawBefore = await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Ăn uống')
  const search = page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch', exact: true })
  await search.fill('không tồn tại trong sổ')
  const empty = page.getByRole('region', { name: 'Chưa có giao dịch phù hợp', exact: true })
  await expect(empty).toBeVisible()
  await empty.getByRole('button', { name: 'Xóa bộ lọc trong lịch sử', exact: true }).click()
  await expect(empty).not.toBeVisible()
  await expect(search).toHaveValue('')
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })).toContainText(
    'Mọi danh mục',
  )
  await expect(
    page
      .getByRole('group', { name: 'Loại giao dịch', exact: true })
      .getByRole('button', { name: 'Tất cả', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.transaction-row')).toHaveCount(4)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))).toBe(rawBefore)
})

test('an empty month offers adding a real transaction directly from its empty state', async ({
  page,
}) => {
  await openHistory(page, [])
  const empty = page.getByRole('region', { name: 'Một trang sổ còn trống', exact: true })
  await expect(empty).toBeVisible()
  await expect(
    empty.getByRole('button', { name: 'Xóa bộ lọc trong lịch sử', exact: true }),
  ).toHaveCount(0)
  await empty.getByRole('button', { name: 'Thêm giao dịch', exact: true }).click()
  const form = page.locator('.transaction-dialog')
  await form
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Ghi từ trang sổ trống')
  await form.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('35000')
  await form.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(form).not.toBeVisible()
  await expect(empty).not.toBeVisible()
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('Ghi từ trang sổ trống')
})

test.describe('touch history filters', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })
  test('scrollable category menu and sort choices work inside narrow and short viewports', async ({
    page,
  }) => {
    await openHistory(page)
    const category = page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })
    await category.tap()
    const categories = page.getByRole('listbox', { name: 'Lọc danh mục', exact: true })
    await expectFitsViewport(categories)
    await categories.getByRole('option', { name: 'Khác', exact: true }).tap()
    await expect(category).toContainText('Khác')
    await expect(page.locator('.transaction-row')).toHaveCount(0)
    await category.tap()
    await expect(categories.getByRole('option', { name: 'Khác', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await categories.getByRole('option', { name: 'Ăn uống', exact: true }).tap()
    const sort = page.getByRole('combobox', { name: 'Sắp xếp giao dịch', exact: true })
    await sort.tap()
    const sorts = page.getByRole('listbox', { name: 'Sắp xếp giao dịch', exact: true })
    await expectFitsViewport(sorts)
    await sorts.getByRole('option', { name: 'Cũ nhất', exact: true }).tap()
    await expect(page.locator('.transaction-row').first()).toContainText('Bữa sáng đầu tháng')
    await page.setViewportSize({ width: 320, height: 320 })
    await category.tap()
    await expectFitsViewport(categories)
    await categories.getByRole('option', { name: 'Mọi danh mục', exact: true }).tap()
    await expect(page.locator('.transaction-row')).toHaveCount(4)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  })
})
