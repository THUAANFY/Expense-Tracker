import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createEmptyData, dateKey, isValidData, money, monthKey, STORAGE_KEY } from '../src/data.js'
import { previewSourceBalance, removeMoneySource, sourceSummary } from '../src/moneySources.js'
import { chooseHistoryFilter } from './helpers/history-filters.js'

const month = monthKey()
const source = (id, name, openingBalance, overrides = {}) => ({
  id,
  name,
  openingBalance,
  openingDate: `${month}-01`,
  type: id === 'bank' ? 'bank' : 'cash',
  color: id === 'bank' ? 'lilac' : 'mint',
  createdAt: Date.now(),
  ...overrides,
})
const transaction = (id, amount, overrides = {}) => ({
  id,
  title: id,
  amount,
  date: dateKey(),
  type: 'expense',
  category: 'food',
  note: '',
  wallet: 'Tiền mặt',
  createdAt: Date.now(),
  ...overrides,
})
function book() {
  return {
    ...createEmptyData(),
    moneySources: [
      source('cash', 'Tiền mặt của tôi', 2000000),
      source('bank', 'Ngân hàng của tôi', 5000000),
    ],
  }
}
async function seed(page, data = book()) {
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
async function navigate(page, label = 'Nguồn tiền') {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).click()
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const card = (page, id) => page.locator(`.source-card[data-source-id="${id}"]`)
const balance = (page, id) => card(page, id).locator('.source-card-balance > strong')
async function createSource(page, name, amount) {
  await page.getByRole('button', { name: 'Thêm nguồn tiền', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Thêm một nguồn tiền', exact: true })
  await dialog.getByRole('textbox', { name: 'Tên nguồn tiền', exact: true }).fill(name)
  await dialog
    .getByRole('spinbutton', { name: 'Số dư đầu ngày (VND)', exact: true })
    .fill(String(amount))
  return dialog
}
async function saveSource(dialog) {
  await dialog.getByRole('button', { name: 'Lưu nguồn tiền', exact: true }).click()
  await expect(dialog).not.toBeVisible()
}

test('source arithmetic counts opening once, gates dates and keeps transfers neutral to total funds', () => {
  const cash = source('cash', 'Cash', 2000000, { openingDate: '2026-10-10' })
  const bank = source('bank', 'Bank', 5000000, { openingDate: '2026-10-10' })
  const transactions = [
    transaction('income', 100000, { sourceId: 'cash', date: '2026-10-10', type: 'income' }),
    transaction('expense', 200000, { sourceId: 'cash', date: '2026-10-20' }),
    transaction('before', 999000, { sourceId: 'cash', date: '2026-10-09' }),
    transaction('future', 800000, { sourceId: 'cash', date: '2026-10-29' }),
    transaction('legacy', 900000, { date: '2026-10-20' }),
  ]
  const transfers = [
    {
      id: 'move',
      fromSourceId: 'cash',
      toSourceId: 'bank',
      amount: 300000,
      date: '2026-10-20',
      note: '',
      createdAt: Date.now(),
    },
  ]
  const c = sourceSummary(cash, transactions, transfers, '2026-10-28')
  const b = sourceSummary(bank, transactions, transfers, '2026-10-28')
  expect(c).toMatchObject({
    balance: 1600000,
    income: 100000,
    expense: 200000,
    beforeOpening: 1,
    upcoming: 1,
  })
  expect(b.balance).toBe(5300000)
  expect(c.balance + b.balance).toBe(6900000)
  expect(
    previewSourceBalance(
      cash,
      transactions,
      transfers,
      { ...transactions[1], amount: 50000 },
      '2026-10-28',
    ),
  ).toBe(1750000)
  expect(sourceSummary(cash, transactions, transfers, '2026-10-29').balance).toBe(800000)
  expect(sourceSummary(cash, transactions, transfers, '2026-10-09').balance).toBe(0)
})

test('backup validation accepts legacy books and rejects invalid sources, dangling links and unbalanced transfers', () => {
  const data = book()
  data.transactions = [transaction('expense', 20000, { sourceId: 'cash' })]
  data.sourceTransfers = [
    {
      id: 'move',
      fromSourceId: 'cash',
      toSourceId: 'bank',
      amount: 30000,
      date: dateKey(),
      note: '',
      createdAt: Date.now(),
    },
  ]
  expect(isValidData(data)).toBeTruthy()
  expect(isValidData(JSON.parse(JSON.stringify(data)))).toBeTruthy()
  for (const change of [
    (d) => {
      d.moneySources[0].openingBalance = -1
    },
    (d) => {
      d.moneySources[0].openingBalance = 1.5
    },
    (d) => {
      d.moneySources[0].openingDate = '2026-02-30'
    },
    (d) => {
      d.moneySources[1].id = 'cash'
    },
    (d) => {
      d.transactions[0].sourceId = 'missing'
    },
    (d) => {
      d.sourceTransfers[0].fromSourceId = 'missing'
    },
    (d) => {
      d.sourceTransfers[0].toSourceId = 'cash'
    },
    (d) => {
      d.sourceTransfers[0].amount = 0
    },
    (d) => {
      d.sourceTransfers[0].date = '1900-01-01'
    },
  ]) {
    const invalid = structuredClone(data)
    change(invalid)
    expect(isValidData(invalid)).toBeFalsy()
  }
  const legacy = createEmptyData()
  delete legacy.moneySources
  delete legacy.sourceTransfers
  expect(isValidData(legacy)).toBeTruthy()
  expect(removeMoneySource(data, 'cash')).toBeNull()
})

test('a source starts with declared funds without adding fake income; linked spending updates balance and persists', async ({
  page,
}) => {
  await seed(page, createEmptyData())
  await navigate(page)
  await expect(page.locator('.sources-total > strong')).toHaveText(money(0))
  await saveSource(await createSource(page, 'Tiền tiêu hằng ngày', 2000000))
  const data = await stored(page)
  const id = data.moneySources[0].id
  expect(data.transactions).toEqual([])
  await expect(balance(page, id)).toHaveText(money(2000000))
  await page
    .getByRole('button', { name: 'Ghi khoản chi từ Tiền tiêu hằng ngày', exact: true })
    .click()
  const dialog = page.locator('.transaction-dialog')
  await expect(
    dialog.getByRole('combobox', { name: 'Nguồn tiền của giao dịch', exact: true }),
  ).toContainText('Tiền tiêu hằng ngày')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('25000')
  await dialog
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Bữa sáng từ tiền mặt')
  await expect(dialog.locator('.transaction-source-preview strong')).toHaveText(money(1975000))
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, id)).toHaveText(money(1975000))
  expect((await stored(page)).transactions[0].sourceId).toBe(id)
  await page.reload()
  await navigate(page)
  await expect(balance(page, id)).toHaveText(money(1975000))
  await navigate(page, 'Tổng quan')
  await expect(page.locator('.overview-sources strong')).toHaveText(money(1975000))
  await expect(page.locator('.overview-income-card .stat-value')).toHaveText(money(0))
  await expect(page.locator('.overview-expense-card .stat-value')).toHaveText(money(25000))
})

test('creating a source inside a transaction preserves the draft and selects the new source', async ({
  page,
}) => {
  await seed(page, createEmptyData())
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const transactionDialog = page.locator('.transaction-dialog')
  await transactionDialog
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Khoản chi đang nhập')
  await transactionDialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('50000')
  await transactionDialog
    .getByRole('textbox', { name: 'Ghi chú Tùy chọn', exact: true })
    .fill('Nội dung cần giữ khi tạo nguồn')
  await transactionDialog.getByRole('button', { name: 'Thêm nguồn', exact: true }).click()
  const sourceDialog = page.getByRole('dialog', { name: 'Thêm một nguồn tiền', exact: true })
  await sourceDialog
    .getByRole('textbox', { name: 'Tên nguồn tiền', exact: true })
    .fill('Ví cá nhân')
  await sourceDialog
    .getByRole('spinbutton', { name: 'Số dư đầu ngày (VND)', exact: true })
    .fill('1000000')
  await saveSource(sourceDialog)
  await expect(transactionDialog).toBeVisible()
  await expect(
    transactionDialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }),
  ).toHaveValue('Khoản chi đang nhập')
  await expect(
    transactionDialog.getByRole('textbox', { name: 'Ghi chú Tùy chọn', exact: true }),
  ).toHaveValue('Nội dung cần giữ khi tạo nguồn')
  await expect(transactionDialog.locator('.transaction-source-preview strong')).toHaveText(
    money(950000),
  )
  expect((await stored(page)).transactions).toEqual([])
  await transactionDialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(transactionDialog).not.toBeVisible()
  const data = await stored(page)
  expect(data.transactions).toHaveLength(1)
  expect(data.transactions[0].sourceId).toBe(data.moneySources[0].id)
})

test('new records require a source once configured, while old unassigned records stay intact', async ({
  page,
}) => {
  const data = book()
  data.transactions = [transaction('legacy', 100000)]
  await seed(page, data)
  await expect(page.locator('.overview-sources strong')).toHaveText(money(7000000))
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true }).fill('Nguồn cần chọn')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('10000')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('Chọn nguồn tiền')
  expect((await stored(page)).transactions).toEqual(data.transactions)
  await chooseHistoryFilter(page, 'Nguồn tiền của giao dịch', 'Tiền mặt của tôi')
  await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect((await stored(page)).transactions.find((item) => item.id === 'legacy')).toEqual(
    data.transactions[0],
  )
})

test('assigning historical records respects the opening date; deleting a source keeps financial history', async ({
  page,
}) => {
  const data = book()
  data.moneySources = [data.moneySources[0]]
  const previous = dateKey(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5))
  data.transactions = [
    transaction('legacy', 100000, {
      review: { rating: 'happy', note: 'Cảm nhận cần giữ', updatedAt: Date.now() },
    }),
    transaction('before', 900000, { sourceId: 'cash', date: previous }),
    transaction('counted', 100000, { sourceId: 'cash' }),
  ]
  await seed(page, data)
  await navigate(page)
  await expect(balance(page, 'cash')).toHaveText(money(1900000))
  await page.getByRole('button', { name: /1 giao dịch chưa gán nguồn/ }).click()
  await page.getByRole('button', { name: 'Gán nguồn cho legacy', exact: true }).click()
  const dialog = page.locator('.transaction-dialog')
  await expect(
    dialog.getByRole('combobox', { name: 'Nguồn tiền của giao dịch', exact: true }),
  ).toContainText('Chưa gán nguồn')
  await chooseHistoryFilter(page, 'Nguồn tiền của giao dịch', 'Tiền mặt của tôi')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(1800000))
  expect((await stored(page)).transactions.find((item) => item.id === 'legacy')).toEqual({
    ...data.transactions[0],
    sourceId: 'cash',
  })
  await page.getByRole('button', { name: 'Sửa nguồn Tiền mặt của tôi', exact: true }).click()
  const editor = page.getByRole('dialog', { name: 'Chăm chút nguồn tiền', exact: true })
  await editor
    .getByRole('spinbutton', { name: 'Số dư đầu ngày (VND)', exact: true })
    .fill('3000000')
  await saveSource(editor)
  await expect(balance(page, 'cash')).toHaveText(money(2800000))
  await page.getByRole('button', { name: 'Sửa nguồn Tiền mặt của tôi', exact: true }).click()
  await editor.getByRole('button', { name: 'Xóa nguồn tiền', exact: true }).click()
  await editor.getByRole('button', { name: 'Xác nhận xóa nguồn', exact: true }).click()
  await expect(editor).not.toBeVisible()
  const after = await stored(page)
  expect(after.moneySources).toEqual([])
  expect(after.transactions).toEqual(
    data.transactions.map((item) => {
      const original = { ...item }
      delete original.sourceId
      return original
    }),
  )
  expect(isValidData(after)).toBeTruthy()
})

test('the ledger paginates and searches, and opening unassigned records clears an unrelated search', async ({
  page,
}) => {
  const data = book()
  data.transactions = [
    ...Array.from({ length: 10 }, (_, index) =>
      transaction(`cash-${index}`, 10000, {
        sourceId: 'cash',
        createdAt: Date.now() - index * 1000,
      }),
    ),
    transaction('unassigned', 20000, { createdAt: Date.now() - 11000 }),
  ]
  await seed(page, data)
  await navigate(page)
  await expect(page.locator('.source-ledger-row')).toHaveCount(8)
  await page.getByRole('button', { name: 'Trang nguồn tiền sau', exact: true }).click()
  await expect(page.locator('.source-ledger-row')).toHaveCount(3)
  const search = page.getByRole('textbox', { name: 'Tìm trong nguồn tiền', exact: true })
  await search.fill('cash-0')
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await expect(page.locator('.source-ledger-row')).toHaveAttribute('data-transaction-id', 'cash-0')
  await page.getByRole('button', { name: /1 giao dịch chưa gán nguồn/ }).click()
  await expect(search).toHaveValue('')
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await expect(page.locator('.source-ledger-row')).toHaveAttribute(
    'data-transaction-id',
    'unassigned',
  )
  await search.fill('Không có khoản này')
  await expect(page.locator('.source-ledger-empty')).toHaveText('Chưa tìm thấy bản ghi phù hợp.')
  expect((await stored(page)).transactions).toEqual(data.transactions)
})

test('ledger kinds compose with source and search filters without changing any balances', async ({
  page,
}) => {
  const data = book()
  data.transactions = [
    transaction('coffee', 45000, { sourceId: 'cash', date: `${month}-02` }),
    transaction('salary', 1500000, { sourceId: 'bank', type: 'income', date: `${month}-03` }),
    transaction('legacy', 30000),
  ]
  data.sourceTransfers = [
    {
      id: 'transfer',
      fromSourceId: 'bank',
      toSourceId: 'cash',
      amount: 300000,
      date: dateKey(),
      note: 'Rút để chi trong tuần',
      createdAt: Date.now(),
    },
  ]
  await seed(page, data)
  await navigate(page)
  const filters = page.getByRole('group', { name: 'Loại bản ghi nguồn tiền', exact: true })
  await expect(page.locator('.source-ledger-day')).toHaveCount(3)
  await filters.getByRole('button', { name: 'Khoản thu', exact: true }).click()
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await expect(page.locator('.source-ledger-row')).toHaveAttribute('data-transaction-id', 'salary')
  await chooseHistoryFilter(page, 'Lọc nhật ký nguồn tiền', 'Tiền mặt của tôi')
  await expect(page.locator('.source-ledger-row')).toHaveCount(0)
  await filters.getByRole('button', { name: 'Chuyển nguồn', exact: true }).click()
  await expect(page.locator('.source-ledger-row')).toHaveAttribute('data-transfer-id', 'transfer')
  await expect(page.locator('.source-ledger-route')).toContainText('Ngân hàng của tôi')
  await expect(page.locator('.source-ledger-route')).toContainText('Tiền mặt của tôi')
  await page.getByRole('textbox', { name: 'Tìm trong nguồn tiền', exact: true }).fill('rUt de chi')
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await page.getByRole('button', { name: /1 giao dịch chưa gán nguồn/ }).click()
  await expect(filters.getByRole('button', { name: 'Tất cả', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('.source-ledger-row')).toHaveAttribute('data-transaction-id', 'legacy')
  await chooseHistoryFilter(page, 'Lọc nhật ký nguồn tiền', 'Mọi nguồn')
  await page
    .getByRole('textbox', { name: 'Tìm trong nguồn tiền', exact: true })
    .fill('chua gan nguon')
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await expect(balance(page, 'cash')).toHaveText(money(2255000))
  await expect(balance(page, 'bank')).toHaveText(money(6200000))
  expect(await stored(page)).toEqual(data)
})

test('deleting the currently filtered source returns the ledger to all sources and preserves records', async ({
  page,
}) => {
  const data = book()
  data.transactions = [
    transaction('cash-entry', 10000, { sourceId: 'cash' }),
    transaction('bank-entry', 20000, { sourceId: 'bank' }),
  ]
  await seed(page, data)
  await navigate(page)
  await chooseHistoryFilter(page, 'Lọc nhật ký nguồn tiền', 'Tiền mặt của tôi')
  await expect(page.locator('.source-ledger-row')).toHaveCount(1)
  await page.getByRole('button', { name: 'Sửa nguồn Tiền mặt của tôi', exact: true }).click()
  const editor = page.getByRole('dialog', { name: 'Chăm chút nguồn tiền', exact: true })
  await editor.getByRole('button', { name: 'Xóa nguồn tiền', exact: true }).click()
  await editor.getByRole('button', { name: 'Xác nhận xóa nguồn', exact: true }).click()
  await expect(editor).not.toBeVisible()
  await expect(
    page.getByRole('combobox', { name: 'Lọc nhật ký nguồn tiền', exact: true }),
  ).toContainText('Mọi nguồn')
  await expect(page.locator('.source-ledger-row')).toHaveCount(2)
  const saved = await stored(page)
  expect(saved.transactions[0].sourceId).toBeUndefined()
  expect(saved.transactions[1].sourceId).toBe('bank')
  expect(isValidData(saved)).toBeTruthy()
})

test('editing amounts, converting expense to income and deleting recalculate instead of double counting', async ({
  page,
}) => {
  const data = book()
  data.transactions = [transaction('entry', 100000, { sourceId: 'cash' })]
  await seed(page, data)
  await navigate(page)
  await page.getByRole('button', { name: 'Sửa giao dịch entry', exact: true }).click()
  const dialog = page.locator('.transaction-dialog')
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('150000')
  await expect(dialog.locator('.transaction-source-preview strong')).toHaveText(money(1850000))
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(1850000))
  await page.getByRole('button', { name: 'Sửa giao dịch entry', exact: true }).click()
  await dialog.getByRole('button', { name: 'Khoản thu', exact: true }).click()
  await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('500000')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(2500000))
  await page.getByRole('button', { name: 'Sửa giao dịch entry', exact: true }).click()
  await dialog.getByRole('button', { name: 'Xóa giao dịch', exact: true }).click()
  await dialog.getByRole('button', { name: 'Xác nhận xóa', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(2000000))
})

test('internal transfers can be recorded, edited and removed without changing income or expenses', async ({
  page,
}) => {
  const data = book()
  await seed(page, data)
  await navigate(page)
  await page.getByRole('button', { name: 'Ghi chuyển nguồn', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Ghi nhận chuyển nguồn', exact: true })
  await dialog.getByRole('spinbutton', { name: 'Số tiền chuyển (VND)', exact: true }).fill('300000')
  await dialog.getByRole('button', { name: 'Lưu chuyển nguồn', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(1700000))
  await expect(balance(page, 'bank')).toHaveText(money(5300000))
  await expect(page.locator('.sources-total > strong')).toHaveText(money(7000000))
  expect((await stored(page)).transactions).toEqual(data.transactions)
  const transfer = (await stored(page)).sourceTransfers[0]
  await page.locator(`[data-transfer-id="${transfer.id}"]`).click()
  const edit = page.getByRole('dialog', { name: 'Sửa ghi nhận chuyển nguồn', exact: true })
  await edit.getByRole('spinbutton', { name: 'Số tiền chuyển (VND)', exact: true }).fill('200000')
  await edit.getByRole('button', { name: 'Lưu chuyển nguồn', exact: true }).click()
  await expect(edit).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(1800000))
  await page.getByRole('button', { name: 'Sửa nguồn Tiền mặt của tôi', exact: true }).click()
  const sourceDialog = page.getByRole('dialog', { name: 'Chăm chút nguồn tiền', exact: true })
  await sourceDialog.getByRole('button', { name: 'Xóa nguồn tiền', exact: true }).click()
  await expect(sourceDialog.locator('.source-delete-confirm')).toContainText('bản ghi chuyển nguồn')
  await expect(
    sourceDialog.getByRole('button', { name: 'Xác nhận xóa nguồn', exact: true }),
  ).toHaveCount(0)
  await sourceDialog.getByRole('button', { name: 'Đóng', exact: true }).click()
  await page.locator(`[data-transfer-id="${transfer.id}"]`).click()
  await edit.getByRole('button', { name: 'Xóa bản ghi chuyển nguồn', exact: true }).click()
  await edit.getByRole('button', { name: 'Xác nhận xóa chuyển nguồn', exact: true }).click()
  await expect(edit).not.toBeVisible()
  await expect(balance(page, 'cash')).toHaveText(money(2000000))
  await expect(balance(page, 'bank')).toHaveText(money(5000000))
  expect((await stored(page)).sourceTransfers).toEqual([])
  expect((await stored(page)).transactions).toEqual(data.transactions)
})

test('a transfer cannot use the same source twice', async ({ page }) => {
  await seed(page)
  await navigate(page)
  await page.getByRole('button', { name: 'Ghi chuyển nguồn', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Ghi nhận chuyển nguồn', exact: true })
  await chooseHistoryFilter(page, 'Nguồn nhận về', 'Tiền mặt của tôi')
  await dialog.getByRole('spinbutton', { name: 'Số tiền chuyển (VND)', exact: true }).fill('100000')
  await dialog.getByRole('button', { name: 'Lưu chuyển nguồn', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('hai nguồn khác nhau')
  expect((await stored(page)).sourceTransfers).toEqual([])
})

test('source balances update at the next day and include a previously future expense', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-28T12:00:00+07:00') })
  const data = book()
  data.moneySources = [source('cash', 'Tiền mặt của tôi', 2000000, { openingDate: '2026-10-01' })]
  data.transactions = [transaction('future', 200000, { sourceId: 'cash', date: '2026-10-29' })]
  await seed(page, data)
  await navigate(page)
  await expect(balance(page, 'cash')).toHaveText(money(2000000))
  await expect(page.locator('.source-ledger-state')).toContainText('Dự kiến')
  await page.clock.fastForward(86400000)
  await expect(balance(page, 'cash')).toHaveText(money(1800000))
})

test('JSON restores sources and transfers, while CSV names the actual source', async ({ page }) => {
  const data = book()
  data.transactions = [transaction('entry', 100000, { sourceId: 'cash' })]
  data.sourceTransfers = [
    {
      id: 'move',
      fromSourceId: 'cash',
      toSourceId: 'bank',
      amount: 300000,
      date: dateKey(),
      note: 'Rút để chi tiêu',
      createdAt: Date.now(),
    },
  ]
  await seed(page, data)
  await navigate(page, 'Cài đặt')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất bản sao lưu', exact: true }).click()
  const download = await downloadPromise
  expect(JSON.parse(await readFile(await download.path(), 'utf8'))).toEqual(data)
  await page.locator('input[type="file"]').setInputFiles(await download.path())
  const dialog = page.getByRole('dialog', { name: 'Khôi phục bản sao lưu?', exact: true })
  await expect(dialog).toContainText('2 nguồn tiền')
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect(await stored(page)).toEqual(data)
  await navigate(page, 'Lịch sử giao dịch')
  const csvPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất CSV', exact: true }).click()
  const csv = await csvPromise
  expect(await readFile(await csv.path(), 'utf8')).toContain('Tiền mặt của tôi')
  await navigate(page)
  await expect(balance(page, 'cash')).toHaveText(money(1600000))
})

test('two tabs can create independent sources without replacing each other', async ({
  page,
  context,
}) => {
  await seed(page, createEmptyData())
  await navigate(page)
  const other = await context.newPage()
  await other.goto('/')
  await navigate(other)
  const a = await createSource(page, 'Tiền mặt tab A', 2000000)
  const b = await createSource(other, 'Nguồn tab B', 5000000)
  await Promise.all([
    a.getByRole('button', { name: 'Lưu nguồn tiền', exact: true }).click(),
    b.getByRole('button', { name: 'Lưu nguồn tiền', exact: true }).click(),
  ])
  await expect(a).not.toBeVisible()
  await expect(b).not.toBeVisible()
  await expect.poll(async () => (await stored(page)).moneySources.length).toBe(2)
  expect((await stored(page)).transactions).toEqual([])
  await expect(page.locator('.sources-total > strong')).toHaveText(money(7000000))
})

for (const width of [320, 390]) {
  test(`sources and the source/date/select dialogs fit a ${width}px phone`, async ({ page }) => {
    await page.setViewportSize({ width, height: 568 })
    await seed(page)
    await navigate(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await page.getByRole('button', { name: 'Sửa nguồn Tiền mặt của tôi', exact: true }).click()
    const sourceDialog = page.getByRole('dialog', { name: 'Chăm chút nguồn tiền', exact: true })
    await expect(sourceDialog).toBeVisible()
    expect(await sourceDialog.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBeTruthy()
    await sourceDialog.getByRole('button', { name: /Ngày bắt đầu theo dõi/ }).click()
    const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
    await expect(calendar).toBeVisible()
    expect(
      await calendar.evaluate((e) => {
        const r = e.getBoundingClientRect()
        return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight
      }),
    ).toBeTruthy()
    await page.keyboard.press('Escape')
    await saveSource(sourceDialog)
    await page.getByRole('button', { name: 'Ghi chuyển nguồn', exact: true }).click()
    const transferDialog = page.getByRole('dialog', { name: 'Ghi nhận chuyển nguồn', exact: true })
    await chooseHistoryFilter(page, 'Nguồn chuyển đi', 'Ngân hàng của tôi')
    await chooseHistoryFilter(page, 'Nguồn nhận về', 'Tiền mặt của tôi')
    await transferDialog
      .getByRole('spinbutton', { name: 'Số tiền chuyển (VND)', exact: true })
      .fill('500000')
    const save = transferDialog.getByRole('button', { name: 'Lưu chuyển nguồn', exact: true })
    const rect = await save.boundingBox()
    expect(rect.y + rect.height).toBeLessThanOrEqual(568)
    await save.click()
    await expect(transferDialog).not.toBeVisible()
    await expect(balance(page, 'cash')).toHaveText(money(2500000))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}
