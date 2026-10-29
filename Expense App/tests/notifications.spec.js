import { expect, test } from '@playwright/test'
import { createSampleData } from './helpers/fixtures.js'
import { buildNotifications, NOTIFICATION_KEY } from '../src/notifications.js'

const NOW = new Date('2026-10-27T12:00:00+07:00')
test.use({ timezoneId: 'Asia/Ho_Chi_Minh' })

const transaction = (
  id,
  amount,
  category = 'food',
  date = '2026-10-20',
  type = 'expense',
  createdAt = '2026-10-23T12:00:00+07:00',
) => ({
  id,
  title: id,
  amount,
  category,
  date,
  type,
  wallet: 'Tiền mặt',
  note: '',
  createdAt: new Date(createdAt).getTime(),
})
function fixture() {
  const data = createSampleData()
  data.profile.budget = 1000000
  data.budgets = Object.fromEntries(Object.keys(data.budgets).map((id) => [id, 1000000]))
  data.monthlyCategoryBudgets = { '2026-10': { ...data.budgets } }
  data.transactions = [
    transaction('Ăn uống tháng này', 850000),
    transaction('Mua sắm tháng này', 350000, 'shopping'),
    transaction(
      'Chi tháng trước',
      200000,
      'food',
      '2026-09-10',
      'expense',
      '2026-09-10T12:00:00+07:00',
    ),
    transaction(
      'Thu tháng trước',
      5000000,
      'other',
      '2026-09-10',
      'income',
      '2026-09-10T12:00:00+07:00',
    ),
  ]
  return data
}
async function openApp(page, data = fixture(), metadata) {
  await page.clock.install({ time: NOW })
  await page.addInitScript(
    ({ data, metadata, key }) => {
      if (!localStorage.getItem('may-expense-tracker-v1')) {
        localStorage.setItem('may-expense-tracker-v1', JSON.stringify(data))
        if (metadata) localStorage.setItem(key, metadata)
      }
    },
    { data, metadata, key: NOTIFICATION_KEY },
  )
  await page.goto('/')
  await expect(page.locator('.overview-workspace')).toBeVisible()
}
async function openNotifications(page) {
  await page.getByRole('button', { name: 'Thông báo', exact: true }).click()
  const panel = page.getByRole('dialog', { name: 'Thông báo của bạn', exact: true })
  await expect(panel).toBeVisible()
  return panel
}
async function addExpense(page, amount, { shouldSave = true } = {}) {
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill(String(amount))
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill(`Khoản chi ${amount}`)
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  if (shouldSave) await expect(dialog).not.toBeVisible()
  else await expect(dialog.getByRole('alert')).toContainText('Không thể lưu')
}

test('rules distinguish budget thresholds and use recording dates for reminders', () => {
  const data = fixture()
  data.profile.budget = 10000000
  for (const [amount, expected] of [
    [799999, null],
    [800000, 'near'],
    [999999, 'near'],
    [1000000, 'full'],
    [1000001, 'over'],
  ]) {
    data.transactions = [
      transaction('Chi', amount, 'food', '2026-10-20', 'expense', '2026-10-27T12:00:00+07:00'),
    ]
    const items = buildNotifications(data, { now: NOW })
    expect(
      items.filter((item) => item.category === 'food').map((item) => item.id.split(':').at(-1)),
    ).toEqual(expected ? [expected] : [])
    expect(items.some((item) => item.kind === 'reminder')).toBe(false)
    if (amount === 999999) expect(items[0].description).toContain('99,9%')
  }
  data.transactions = [
    transaction(
      'Mới ghi một khoản cũ',
      100000,
      'food',
      '2026-09-01',
      'expense',
      '2026-10-27T12:00:03+07:00',
    ),
  ]
  expect(buildNotifications(data, { now: NOW }).some((item) => item.kind === 'reminder')).toBe(
    false,
  )
  data.transactions[0].createdAt = new Date('2026-10-24T23:50:00+07:00').getTime()
  expect(
    buildNotifications(data, { now: NOW }).find((item) => item.kind === 'reminder').description,
  ).toContain('3 ngày')
  expect(
    buildNotifications(data, { now: NOW, remindersEnabled: false }).some(
      (item) => item.kind === 'reminder',
    ),
  ).toBe(false)
})

test('current-month notices link to the correct filtered transactions and read state survives reload', async ({
  page,
}) => {
  await openApp(page)
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  const panel = await openNotifications(page)
  await expect(panel.locator('.notification-card')).toHaveCount(4)
  await expect(panel).toContainText('Ngân sách tháng đã vượt hạn mức')
  await expect(panel).toContainText('200.000')
  await expect(panel).toContainText('Ăn uống sắp chạm ngân sách')
  await expect(panel).toContainText('Nhìn lại tháng 9/2026')
  await expect(panel).toContainText('Đã 4 ngày')
  const before = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    NOTIFICATION_KEY,
  )
  await panel.getByRole('button', { name: /Ăn uống sắp chạm ngân sách/ }).click()
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục' })).toContainText('Ăn uống')
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('Ăn uống tháng này')
  await expect(page.locator('.notification-center-badge')).toHaveText('3')
  await openNotifications(page)
  await panel.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }).click()
  await expect(page.locator('.notification-center-badge')).toHaveCount(0)
  await panel.getByRole('button', { name: /Chưa đọc/ }).click()
  await expect(panel).toContainText('Đã xem hết rồi!')
  await page.reload()
  await expect(page.locator('.notification-center-badge')).toHaveCount(0)
  await openNotifications(page)
  await expect(panel.locator('[data-unread="false"]')).toHaveCount(4)
  const after = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    NOTIFICATION_KEY,
  )
  for (const [id, entry] of Object.entries(before.entries)) {
    expect(after.entries[id].firstSeen).toBe(entry.firstSeen)
    expect(after.entries[id].readAt).toBeTruthy()
  }
  await panel.getByRole('button', { name: /Nhìn lại tháng 9\/2026/ }).click()
  await expect(page.locator('.overview-workspace')).toBeVisible()
  await expect(page.locator('.recent-panel')).toContainText('Chi tháng trước')
})

test('new expenses update budget stages immediately without repeating an already-read stage', async ({
  page,
}) => {
  const data = fixture()
  data.profile.budget = 10000000
  data.transactions = [
    transaction(
      'Khoản đã ghi',
      790000,
      'food',
      '2026-10-27',
      'expense',
      '2026-10-27T12:00:00+07:00',
    ),
  ]
  await openApp(page, data)
  await expect(page.locator('.notification-center-badge')).toHaveCount(0)
  await addExpense(page, 10000)
  let panel = await openNotifications(page)
  await expect(panel).toContainText('Ăn uống sắp chạm ngân sách')
  await expect(panel).toContainText('80%')
  await panel.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }).click()
  await panel.getByRole('button', { name: 'Đóng thông báo' }).click()
  await addExpense(page, 10000)
  await expect(page.locator('.notification-center-badge')).toHaveCount(0)
  await addExpense(page, 190000)
  panel = await openNotifications(page)
  await expect(panel).toContainText('Ăn uống đã dùng hết ngân sách')
  await expect(panel.locator('.notification-card')).toHaveCount(1)
  await panel.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }).click()
  await panel.getByRole('button', { name: 'Đóng thông báo' }).click()
  await addExpense(page, 1000)
  panel = await openNotifications(page)
  await expect(panel).toContainText('Ăn uống đã vượt hạn mức')
  await expect(page.locator('.notification-center-badge')).toHaveText('1')
})

test('reminder preference persists and recording a transaction removes a stale reminder', async ({
  page,
}) => {
  const data = fixture()
  data.transactions = [transaction('Ghi chép cũ', 100000)]
  await openApp(page, data)
  let panel = await openNotifications(page)
  await expect(panel).toContainText('Đã 4 ngày')
  await panel.getByRole('checkbox', { name: 'Nhắc ghi chép' }).uncheck()
  await expect(panel.locator('.notification-card')).toHaveCount(0)
  await page.reload()
  panel = await openNotifications(page)
  await expect(panel.getByRole('checkbox', { name: 'Nhắc ghi chép' })).not.toBeChecked()
  await panel.getByRole('checkbox', { name: 'Nhắc ghi chép' }).check()
  await panel.getByRole('button', { name: /Dành một phút cho sổ nhỏ/ }).click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền' }).fill('50000')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Đã ghi hôm nay')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  panel = await openNotifications(page)
  await expect(panel.locator('.notification-card')).toHaveCount(0)
  await expect(panel).toContainText('Mọi thứ đang nhẹ nhàng')
})

test('a new book has a useful first-entry action and storage failures provide a backup action', async ({
  page,
}) => {
  const data = fixture()
  data.transactions = []
  await openApp(page, data)
  let panel = await openNotifications(page)
  await expect(panel.locator('.notification-card')).toHaveCount(1)
  await panel.getByRole('button', { name: /Sổ nhỏ đang chờ trang đầu tiên/ }).click()
  const dialog = page.locator('.transaction-dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Thông báo', exact: true })).toBeFocused()
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError')
    }
  })
  await addExpense(page, 10000, { shouldSave: false })
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch' })).toHaveValue(
    'Khoản chi 10000',
  )
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click()
  panel = await openNotifications(page)
  await expect(panel).toContainText('Dữ liệu cần được sao lưu')
  await expect(panel).toContainText('Trạng thái thông báo chưa lưu được')
  await panel.getByRole('button', { name: /Dữ liệu cần được sao lưu/ }).click()
  await expect(page.getByRole('button', { name: 'Xuất bản sao lưu', exact: true })).toBeVisible()
})

test('bounded metadata and invalid notification settings do not prevent loading the app', async ({
  page,
}) => {
  const entries = Object.fromEntries(
    Array.from({ length: 160 }, (_, index) => [
      `old-${index}`,
      { firstSeen: NOW.getTime() + 99999999, readAt: null },
    ]),
  )
  await openApp(page, fixture(), JSON.stringify({ version: 1, remindersEnabled: true, entries }))
  const panel = await openNotifications(page)
  await expect(panel.locator('.notification-card')).toHaveCount(4)
  await expect
    .poll(() =>
      page.evaluate(
        (key) => Object.keys(JSON.parse(localStorage.getItem(key)).entries).length,
        NOTIFICATION_KEY,
      ),
    )
    .toBeLessThanOrEqual(160)
  await page.evaluate((key) => localStorage.setItem(key, '{invalid'), NOTIFICATION_KEY)
  await page.reload()
  await openNotifications(page)
  await expect(panel.locator('.notification-card')).toHaveCount(4)
})

test.describe('small-screen notifications', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })
  test('popup fits short viewports, scrolls independently and restores keyboard focus', async ({
    page,
  }) => {
    await openApp(page)
    const bell = page.getByRole('button', { name: 'Thông báo', exact: true })
    for (const height of [568, 320]) {
      await page.setViewportSize({ width: 320, height })
      const panel = await openNotifications(page)
      await expect(panel.getByRole('button', { name: 'Đóng thông báo' })).toBeFocused()
      await expect
        .poll(() =>
          panel.evaluate((element) => {
            const box = element.getBoundingClientRect()
            return (
              box.left >= 0 &&
              box.top >= 0 &&
              box.right <= innerWidth + 1 &&
              box.bottom <= innerHeight + 1 &&
              element.scrollWidth <= element.clientWidth
            )
          }),
        )
        .toBeTruthy()
      const list = panel.locator('.notification-center-list')
      await list.evaluate((element) => {
        element.scrollTop = element.scrollHeight
      })
      await expect(panel.getByRole('checkbox', { name: 'Nhắc ghi chép' })).toBeInViewport()
      await page.keyboard.press('Escape')
      await expect(bell).toBeFocused()
      await expect(panel).not.toBeVisible()
    }
    const panel = await openNotifications(page)
    await page.keyboard.press('Shift+Tab')
    await expect(panel).not.toBeVisible()
    await expect(bell).toBeFocused()
    await openNotifications(page)
    await panel.getByRole('checkbox', { name: 'Nhắc ghi chép' }).focus()
    await page.keyboard.press('Tab')
    await expect(panel).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Mở cài đặt cá nhân' })).toBeFocused()
  })
})
