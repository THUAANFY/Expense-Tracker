import { test, expect } from '@playwright/test'
import { chooseHistoryFilter } from './helpers/history-filters.js'
import { createSampleData, seedSampleBook } from './helpers/fixtures.js'

test('development CSS and Vietnamese fonts load without a Vite error overlay', async ({ page }) => {
  const assetErrors = []
  const startupErrors = []
  page.on('pageerror', (error) => startupErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400 && /\.(css|woff2?)(?:\?|$)/.test(response.url())) {
      assetErrors.push(`${response.status()} ${response.url()}`)
    }
  })
  const css = await page.request.get('/src/index.css')
  expect(css.status()).toBe(200)
  expect(await css.text()).not.toContain('[plugin:vite:css]')
  await page.goto('/')
  expect(startupErrors).toEqual([])
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  const loadedFonts = await page.evaluate(async () => {
    const faces = await Promise.all(
      [400, 500, 600, 700].map((weight) =>
        document.fonts.load(`${weight} 14px "Be Vietnam Pro"`, 'Quản lý lịch sử chi tiêu'),
      ),
    )
    return faces.map((group) => group.length > 0 && group.every((font) => font.status === 'loaded'))
  })
  expect(loadedFonts).toEqual([true, true, true, true])
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)
  expect(assetErrors).toEqual([])
})

async function navigate(page, label) {
  await page
    .locator('.sidebar')
    .getByRole('button', { name: label === 'Sổ ghi chú' ? 'Túi chi tiêu' : label, exact: true })
    .click()
  if (label === 'Sổ ghi chú')
    await page.getByRole('button', { name: 'Ghi chú đã lưu', exact: true }).click()
  await expect(page.locator('.page-content')).toBeVisible()
}

test('expense lifecycle, filters, CSV, persistence and deletion', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('125000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Bữa trưa kiểm thử')
  await dialog
    .getByRole('textbox', { name: 'Ghi chú' })
    .fill('Ghi chú cần được giữ sau khi tải lại')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await page.reload()
  await navigate(page, 'Lịch sử giao dịch')
  await page.getByRole('textbox', { name: 'Tìm trong lịch sử giao dịch' }).fill('bua trua kiem thu')
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('125.000')
  await page.locator('.transaction-row').click()
  await expect(dialog.getByRole('textbox', { name: 'Ghi chú' })).toHaveValue(
    'Ghi chú cần được giữ sau khi tải lại',
  )
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('150000')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(page.locator('.transaction-row')).toContainText('150.000')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất CSV' }).click()
  expect((await download).suggestedFilename()).toMatch(/may-giao-dich-.*\.csv/)
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Mua sắm')
  await expect(page.locator('.transaction-row')).toHaveCount(0)
  await chooseHistoryFilter(page, 'Lọc danh mục', 'Ăn uống')
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await page.locator('.transaction-row').click()
  await dialog.getByRole('button', { name: 'Xóa giao dịch', exact: true }).click()
  await dialog.getByRole('button', { name: 'Xác nhận xóa' }).click()
  await page.reload()
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('may-expense-tracker-v1')),
  )
  expect(stored.transactions.find((item) => item.title === 'Bữa trưa kiểm thử')).toBeUndefined()
  expect(errors).toEqual([])
})

test('income changes totals and month navigation changes the actual data', async ({ page }) => {
  await seedSampleBook(page)
  await page.goto('/')
  const before = await page.locator('.stat-card').nth(1).locator('.stat-value').innerText()
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Khoản thu' }).click()
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('5000000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Thu nhập kiểm thử')
  await dialog.getByRole('button', { name: 'Lưu giao dịch' }).click()
  await expect(page.locator('.stat-card').nth(1).locator('.stat-value')).not.toHaveText(before)
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  await expect(page.locator('.recent-panel')).toContainText('Lương tháng trước')
  await expect(page.locator('.recent-panel')).not.toContainText('Thu nhập kiểm thử')
})

test('notes can be created, pinned, edited, persisted and removed', async ({ page }) => {
  await page.goto('/')
  await navigate(page, 'Sổ ghi chú')
  await page.getByRole('button', { name: 'Viết ghi chú', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Tiêu đề' }).fill('Kế hoạch kiểm thử')
  await dialog.getByRole('textbox', { name: 'Nội dung' }).fill('Để dành 500.000 đồng mỗi tuần.')
  await dialog.getByRole('button', { name: 'Xanh', exact: true }).click()
  await dialog.getByRole('checkbox', { name: 'Ghim ghi chú' }).check()
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click()
  const note = page.locator('.notes-grid .note-card').filter({ hasText: 'Kế hoạch kiểm thử' })
  await expect(note).toHaveClass(/green/)
  await expect(note.getByRole('button', { name: 'Bỏ ghim ghi chú' })).toBeVisible()
  await page.reload()
  await navigate(page, 'Sổ ghi chú')
  await expect(note).toContainText('500.000 đồng')
  await note.locator('.note-body').click()
  await dialog.getByRole('textbox', { name: 'Tiêu đề' }).fill('Kế hoạch đã cập nhật')
  await dialog.getByRole('button', { name: 'Lưu ghi chú' }).click()
  const edited = page.locator('.notes-grid .note-card').filter({ hasText: 'Kế hoạch đã cập nhật' })
  await edited.locator('.note-body').click()
  await dialog.getByRole('button', { name: 'Xóa ghi chú', exact: true }).click()
  await dialog.getByRole('button', { name: 'Xác nhận xóa' }).click()
  await expect(edited).toHaveCount(0)
})

test('category budget and profile persist without clearing saved records', async ({ page }) => {
  const original = createSampleData()
  await seedSampleBook(page, original)
  await page.goto('/')
  await navigate(page, 'Danh mục & ngân sách')
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('spinbutton').fill('4500000')
  await dialog.getByRole('button', { name: 'Lưu ngân sách' }).click()
  await navigate(page, 'Cài đặt')
  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('An')
  await page.getByRole('button', { name: '15 triệu', exact: true }).click()
  await expect(page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng' })).toHaveValue(
    '15000000',
  )
  await page.getByRole('button', { name: 'Lưu thay đổi' }).click()
  await page.reload()
  await expect(page.locator('.greeting')).toContainText('Chào An')
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('may-expense-tracker-v1')))
  expect(data.budgets.food).toBe(4500000)
  expect(data.profile.budget).toBe(15000000)
  expect(data.transactions).toEqual(original.transactions)
  expect(data.notes).toEqual(original.notes)
  expect(data.bags).toEqual(original.bags)
  await navigate(page, 'Cài đặt')
  await expect(page.getByRole('button', { name: 'Tạo sổ của tôi' })).toHaveCount(0)
})

test('keyboard dialog focus and Escape; storage failure is visible', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  await expect(page.getByRole('dialog').getByRole('spinbutton', { name: 'Số tiền' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError')
    }
  })
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('10000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Khoản chưa lưu')
  await dialog.getByRole('button', { name: 'Lưu giao dịch' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Không thể lưu')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch' })).toHaveValue('Khoản chưa lưu')
})

test('backup restore requires confirmation and rejects an impossible calendar date', async ({
  page,
}) => {
  await seedSampleBook(page)
  await page.goto('/')
  await navigate(page, 'Cài đặt')
  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('Bình')
  await page.getByRole('button', { name: 'Lưu thay đổi' }).click()
  const backup = await page.evaluate(() => localStorage.getItem('may-expense-tracker-v1'))
  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('Châu')
  await page.getByRole('button', { name: 'Lưu thay đổi' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  })
  await expect(page.getByRole('dialog')).toContainText('Khôi phục bản sao lưu?')
  await expect(page.locator('.settings-import-preview')).toContainText('backup.json')
  await expect(page.locator('.settings-import-preview')).toContainText('Bình')
  await expect(page.locator('.settings-import-preview')).toContainText(
    `${JSON.parse(backup).transactions.length} giao dịch`,
  )
  await expect(page.locator('.greeting')).toContainText('Chào Châu')
  await page.getByRole('dialog').getByRole('button', { name: 'Khôi phục dữ liệu' }).click()
  await expect(page.locator('.greeting')).toContainText('Chào Bình')
  const invalid = JSON.parse(backup)
  invalid.transactions[0].date = '2026-02-31'
  await page.locator('input[type="file"]').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(invalid)),
  })
  await expect(page.getByRole('alert')).toContainText('không đúng định dạng')
  await expect(page.locator('.greeting')).toContainText('Chào Bình')
})

test('mobile drawer contains keyboard focus and saved toast fits the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const sidebar = page.locator('.sidebar')
  await expect(sidebar).toHaveAttribute('inert', '')
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await expect(sidebar.getByRole('button', { name: 'Tổng quan', exact: true })).toBeFocused()
  for (let count = 0; count < 12; count++) {
    await page.keyboard.press('Tab')
    expect(
      await sidebar.evaluate((element) => element.contains(document.activeElement)),
    ).toBeTruthy()
  }
  await page.keyboard.press('Escape')
  await expect(sidebar).not.toHaveClass(/is-open/)
  await expect(page.getByRole('button', { name: 'Mở menu' })).toBeFocused()
  const add = page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first()
  await add.click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('50000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Giao dịch trên điện thoại')
  await dialog.getByRole('button', { name: 'Lưu giao dịch' }).click()
  await expect(add).toBeFocused()
  await expect(page.getByRole('status')).toContainText('Đã lưu một giao dịch mới')
  await page.waitForTimeout(400)
  const box = await page.getByRole('status').boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(390)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
})

for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
  test(`responsive layout at ${width}px has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(450)
    for (const view of [
      'Tổng quan',
      'Lịch sử giao dịch',
      'Danh mục & ngân sách',
      'Túi chi tiêu',
      'Cài đặt',
    ]) {
      if (width <= 760) await page.getByRole('button', { name: 'Mở menu' }).click()
      await navigate(page, view)
      await page.waitForTimeout(380)
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
      }))
      expect(dimensions.scroll, `${view} at ${width}px`).toBeLessThanOrEqual(dimensions.inner)
    }
    if (width <= 760) await page.getByRole('button', { name: 'Mở menu' }).click()
    await navigate(page, 'Tổng quan')
    await page.waitForTimeout(400)
    await page.screenshot({ path: `test-results/overview-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(
      await page
        .getByRole('dialog')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBeTruthy()
  })
}

test('short phone viewport can reach settings and save a scrolling dialog', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Mở menu' }).click()
  const settings = page.locator('.sidebar').getByRole('button', { name: 'Cài đặt', exact: true })
  await settings.scrollIntoViewIfNeeded()
  const box = await settings.boundingBox()
  expect(box.y + box.height).toBeLessThanOrEqual(568)
  await settings.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Theo cách của bạn.')
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('25000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Giao dịch màn hình nhỏ')
  await dialog.getByRole('button', { name: 'Lưu giao dịch' }).click()
  await expect(dialog).not.toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
})
