import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { isValidData, monthKey, STORAGE_KEY } from '../src/data.js'
import { createSampleData } from './helpers/fixtures.js'
import { RECOVERY_PREFIX } from '../src/bookStorage.js'

function book() {
  return {
    ...createSampleData(),
    bags: [],
    notes: [],
    transactions: [
      {
        id: 'original',
        title: 'Khoản gốc',
        amount: 10000,
        type: 'expense',
        category: 'food',
        date: `${monthKey()}-05`,
        wallet: 'Tiền mặt',
        note: '',
        createdAt: Date.now(),
      },
    ],
  }
}
async function ready(page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function seed(page, value = book()) {
  await ready(page)
  const raw = typeof value === 'string' ? value : JSON.stringify(value)
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: STORAGE_KEY, raw })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  return raw
}
const saved = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const original = (page) => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
async function prepareAdd(page, title, amount = 20000) {
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill(title)
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill(String(amount))
  return dialog
}
async function edit(page) {
  await page.locator('.recent-panel .transaction-row').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  return page.getByRole('dialog')
}
async function settings(page) {
  await page.locator('.sidebar').getByRole('button', { name: 'Cài đặt', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Theo cách của bạn.')
}
async function chooseBackup(page, data) {
  await page.locator('input[type="file"]').setInputFiles({
    name: 'book.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  })
  return page.getByRole('dialog', { name: 'Khôi phục bản sao lưu?' })
}
const archives = (page) =>
  page.evaluate(
    (prefix) =>
      Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .map((key) => localStorage.getItem(key)),
    RECOVERY_PREFIX,
  )

test('two open tabs synchronize and simultaneous additions keep both transactions', async ({
  page,
  context,
}) => {
  await seed(page)
  const second = await context.newPage()
  await ready(second)
  const a = await prepareAdd(page, 'Khoản từ tab A')
  const b = await prepareAdd(second, 'Khoản từ tab B', 30000)
  await Promise.all([
    a.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click(),
    b.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click(),
  ])
  await expect(a).not.toBeVisible()
  await expect(b).not.toBeVisible()
  await expect.poll(async () => (await saved(page)).transactions.length).toBe(3)
  for (const tab of [page, second]) {
    await expect(tab.locator('.recent-panel')).toContainText('Khoản từ tab A')
    await expect(tab.locator('.recent-panel')).toContainText('Khoản từ tab B')
  }
  await page.reload()
  expect((await saved(page)).transactions.map((item) => item.title)).toEqual(
    expect.arrayContaining(['Khoản gốc', 'Khoản từ tab A', 'Khoản từ tab B']),
  )
  expect(isValidData(await saved(page))).toBeTruthy()
})

test('stale forms merge edits to different fields of the same transaction', async ({
  page,
  context,
}) => {
  await seed(page)
  const second = await context.newPage()
  await ready(second)
  const a = await edit(page)
  const b = await edit(second)
  await a.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('45000')
  await b.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Tên mới từ tab B')
  await a.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(a).not.toBeVisible()
  await page.evaluate((key) => {
    const current = JSON.parse(localStorage.getItem(key))
    current.transactions[0].date = '2099-12-31'
    localStorage.setItem(key, JSON.stringify(current))
  }, STORAGE_KEY)
  await b.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(b).not.toBeVisible()
  expect((await saved(page)).transactions[0]).toMatchObject({
    amount: 45000,
    title: 'Tên mới từ tab B',
    date: '2099-12-31',
  })
  await expect(
    second.getByRole('button', { name: 'Chọn tháng thống kê', exact: true }),
  ).toContainText('Tháng 12, 2099')
})

test('conflicting edits retain the newer saved value and keep the unsaved form open', async ({
  page,
  context,
}) => {
  await seed(page)
  const second = await context.newPage()
  await ready(second)
  const a = await edit(page)
  const b = await edit(second)
  await a.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Đã lưu từ A')
  await b.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Đang nhập từ B')
  await a.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(a).not.toBeVisible()
  await b.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(b.getByRole('alert')).toContainText('tab khác')
  await expect(b.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toHaveValue(
    'Đang nhập từ B',
  )
  expect((await saved(page)).transactions[0].title).toBe('Đã lưu từ A')
})

test('deleting a transaction changed in another tab is rejected', async ({ page, context }) => {
  await seed(page)
  const second = await context.newPage()
  await ready(second)
  const a = await edit(page)
  const b = await edit(second)
  await a.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('95000')
  await a.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(a).not.toBeVisible()
  await b.getByRole('button', { name: 'Xóa giao dịch', exact: true }).click()
  await b.getByRole('button', { name: 'Xác nhận xóa', exact: true }).click()
  await expect(b.getByRole('alert')).toContainText('tab khác')
  expect((await saved(page)).transactions[0].amount).toBe(95000)
})

for (const kind of ['malformed JSON', 'invalid schema']) {
  test(`${kind}: lock writes, export original bytes and retain an isolated copy across reload`, async ({
    page,
  }) => {
    const damaged =
      kind === 'malformed JSON'
        ? '{"transactions":[{"title":"Khoản thật chưa được sửa"}'
        : JSON.stringify({ ...book(), notes: null })
    await seed(page, damaged)
    await expect(page.locator('.storage-alert')).toContainText('khóa lưu')
    await expect(page.locator('.page-actions .add-button')).toBeDisabled()
    await expect(page.locator('.recent-panel')).not.toContainText('Cà phê sáng')
    // Secondary entry points are also protected by the persistence layer.
    await page
      .locator('.recent-panel')
      .getByRole('button', { name: 'Thêm giao dịch', exact: true })
      .click()
    const dialog = page.getByRole('dialog')
    await dialog
      .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
      .fill('Không được ghi đè')
    await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('10000')
    await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
    await expect(dialog.getByRole('alert')).toContainText('khóa lưu')
    await expect(dialog).toBeVisible()
    expect(await original(page)).toBe(damaged)
    await dialog.getByRole('button', { name: 'Đóng', exact: true }).click()
    await settings(page)
    const recovery = page.getByRole('region', { name: 'Bản lưu gốc được bảo vệ' })
    const downloadPromise = page.waitForEvent('download')
    await recovery.getByRole('button', { name: 'Tải bản gốc', exact: true }).click()
    const download = await downloadPromise
    expect(await readFile(await download.path(), 'utf8')).toBe(damaged)
    await expect.poll(() => archives(page)).toEqual([damaged])
    await page.reload()
    await expect(page.locator('.storage-alert')).toContainText('khóa lưu')
    expect(await original(page)).toBe(damaged)
    expect(await archives(page)).toEqual([damaged])
  })
}

test('explicit recovery installs a valid backup only after archiving the exact original', async ({
  page,
}) => {
  const damaged = JSON.stringify({ ...book(), notes: null })
  await seed(page, damaged)
  await settings(page)
  const restored = book()
  restored.profile.name = 'Sổ được khôi phục'
  const dialog = await chooseBackup(page, restored)
  await expect(dialog).toBeVisible()
  expect(await original(page)).toBe(damaged)
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect(await saved(page)).toEqual(restored)
  expect(await archives(page)).toEqual([damaged])
  await expect(page.locator('.storage-alert')).toHaveCount(0)
  await page.reload()
  await expect(page.locator('.greeting')).toContainText('Sổ được khôi phục')
  await settings(page)
  await expect(page.getByRole('region', { name: 'Bản lưu gốc được bảo vệ' })).toContainText(
    'Bản gốc đã được giữ riêng',
  )
})

test('backup replacement cannot overwrite a change made after its confirmation opened', async ({
  page,
  context,
}) => {
  await seed(page)
  await settings(page)
  const backup = book()
  backup.transactions = []
  const dialog = await chooseBackup(page, backup)
  await expect(dialog).toBeVisible()
  const second = await context.newPage()
  await ready(second)
  const add = await prepareAdd(second, 'Khoản vừa thêm trước khi khôi phục')
  await add.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(add).not.toBeVisible()
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('tab khác')
  expect((await saved(page)).transactions).toHaveLength(2)
})

test('an archive failure keeps the damaged primary book untouched and recovery open', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const write = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(':recovery:')) throw new DOMException('Storage full', 'QuotaExceededError')
      return write.call(this, key, value)
    }
  })
  const damaged = '{"original":"Dữ liệu cần giữ nguyên"'
  await seed(page, damaged)
  await settings(page)
  const dialog = await chooseBackup(page, book())
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('Không thể lưu')
  expect(await original(page)).toBe(damaged)
  await expect(dialog).toBeVisible()
})

test('a settings draft preserves a budget edited in another tab', async ({ page, context }) => {
  const data = book()
  data.moneySources = [
    {
      id: 'funds',
      name: 'Nguồn ngân sách',
      type: 'cash',
      color: 'mint',
      openingBalance: 25000000,
      openingDate: `${monthKey()}-01`,
      createdAt: Date.now(),
    },
  ]
  await seed(page, data)
  await settings(page)
  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('Tên đang nhập')
  const second = await context.newPage()
  await ready(second)
  await settings(second)
  await second.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng' }).fill('18000000')
  await second.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect.poll(async () => (await saved(second)).monthlyBudgets?.[monthKey()]).toBe(18000000)
  await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect.poll(async () => (await saved(page)).profile.name).toBe('Tên đang nhập')
  expect((await saved(page)).monthlyBudgets[monthKey()]).toBe(18000000)
  await expect(page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng' })).toHaveValue(
    '18000000',
  )
})

test('an externally removed book stays locked across focus refreshes instead of becoming demo data', async ({
  page,
  context,
}) => {
  await seed(page)
  const second = await context.newPage()
  await ready(second)
  await second.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY)
  await expect(page.locator('.storage-alert')).toContainText('bị xóa')
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'))
    window.dispatchEvent(new Event('focus'))
  })
  await expect(page.locator('.page-actions .add-button')).toBeDisabled()
  await expect(page.locator('.recent-panel')).toContainText('Khoản gốc')
  expect(await original(page)).toBeNull()
  await settings(page)
  const dialog = await chooseBackup(page, book())
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect(isValidData(await saved(page))).toBeTruthy()
})

test('unavailable write serialization does not save optimistically or close the draft', async ({
  page,
}) => {
  const raw = await seed(page)
  await page.evaluate(() => {
    indexedDB.open = () => {
      throw new DOMException('Blocked database', 'SecurityError')
    }
  })
  const dialog = await prepareAdd(page, 'Nội dung cần giữ khi không lưu được')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('Không thể lưu')
  expect(await original(page)).toBe(raw)
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toHaveValue(
    'Nội dung cần giữ khi không lưu được',
  )
})
