import { expect, test } from '@playwright/test'
import { createEmptyData, dateKey, isValidData, monthKey, STORAGE_KEY } from '../src/data.js'
import { closedMonthChangeError, isClosedMonth } from '../src/closedMonths.js'
import { getCategoryBudgets } from '../src/monthlyBudgets.js'
import { buildNotifications } from '../src/notifications.js'
import { selectMonth } from './helpers/month-picker.js'

const now = new Date()
const current = monthKey()
const previous = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
const next = monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1))
function book() {
  const data = createEmptyData()
  data.monthlyBudgets = { [previous]: 2000000, [current]: 3000000 }
  data.monthlyCategoryBudgets = { [previous]: { food: 100000 }, [current]: { food: 200000 } }
  data.moneySources = ['cash', 'bank'].map((id) => ({
    id,
    name: id,
    type: id,
    color: 'mint',
    openingDate: `${previous}-01`,
    openingBalance: 5000000,
    createdAt: Date.now(),
  }))
  data.transactions = [
    { id: 'old', date: `${previous}-05`, title: 'Bữa trưa tháng trước' },
    { id: 'current', date: dateKey(), title: 'Bữa trưa tháng này' },
  ].map((item) => ({
    ...item,
    amount: 50000,
    type: 'expense',
    category: 'food',
    sourceId: 'cash',
    wallet: 'Tiền mặt',
    note: 'Ghi chú được giữ nguyên',
    createdAt: Date.now(),
  }))
  data.sourceTransfers = [
    {
      id: 'old-transfer',
      fromSourceId: 'cash',
      toSourceId: 'bank',
      amount: 100000,
      date: `${previous}-10`,
      note: 'Chuyển nguồn tháng trước',
      createdAt: Date.now(),
    },
  ]
  return data
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
async function navigate(page, name) {
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name, exact: true }).click()
}
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
const budgetInput = (page) =>
  page.getByRole('spinbutton', { name: 'Ngân sách chi tiêu mỗi tháng (VND)', exact: true })

test('closed month policy protects both sides of a date change, all record fields, deletions and legacy defaults', () => {
  expect(isClosedMonth('2025-12-31', '2026-01')).toBeTruthy()
  expect(isClosedMonth('2026-01-01', '2026-01')).toBeFalsy()
  expect(isClosedMonth('2026-02-01', '2026-01')).toBeFalsy()
  const original = book()
  for (const change of [
    (data) => {
      data.transactions[0].amount++
    },
    (data) => {
      data.transactions[0].note = 'Sửa ghi chú cũ'
    },
    (data) => {
      data.transactions[0].date = `${next}-01`
    },
    (data) => {
      data.transactions[1].date = `${previous}-10`
    },
    (data) => {
      data.transactions.shift()
    },
    (data) => {
      data.transactions.push({ ...data.transactions[0], id: 'new-old' })
    },
    (data) => {
      data.sourceTransfers[0].amount++
    },
    (data) => {
      data.sourceTransfers = []
    },
    (data) => {
      data.monthlyBudgets[previous]++
    },
    (data) => {
      delete data.monthlyBudgets[previous]
    },
    (data) => {
      data.monthlyCategoryBudgets[previous].food++
    },
    (data) => {
      delete data.monthlyCategoryBudgets[previous]
    },
    (data) => {
      data.budgets.food++
    },
    (data) => {
      data.profile.budget++
    },
  ]) {
    const changed = structuredClone(original)
    change(changed)
    expect(closedMonthChangeError(original, changed, current)).toBeTruthy()
  }
  const editable = structuredClone(original)
  editable.transactions[1].amount++
  editable.monthlyBudgets[current]++
  editable.monthlyBudgets[next] = 4000000
  editable.monthlyCategoryBudgets[current].food++
  expect(closedMonthChangeError(original, editable, current)).toBe('')
  const reordered = structuredClone(original)
  reordered.transactions[0] = Object.fromEntries(
    Object.entries(reordered.transactions[0]).reverse(),
  )
  expect(closedMonthChangeError(original, reordered, current)).toBe('')
})

test('monthly category limits validate and preserve the historical fallback', () => {
  const data = book()
  expect(isValidData(data)).toBeTruthy()
  expect(getCategoryBudgets(data, previous).food).toBe(100000)
  expect(getCategoryBudgets(data, current).food).toBe(200000)
  expect(getCategoryBudgets(data, next).food).toBe(data.budgets.food)
  data.monthlyCategoryBudgets[current].food = 40000
  const notice = buildNotifications(data, { remindersEnabled: false }).find(
    (item) => item.category === 'food',
  )
  expect(notice.title).toContain('vượt hạn mức')
  expect(notice.description).toContain('40.000')
  for (const value of [
    null,
    [],
    { '2026-13': { food: 1 } },
    { [current]: { missing: 1 } },
    { [current]: { food: -1 } },
    { [current]: null },
  ])
    expect(isValidData({ ...data, monthlyCategoryBudgets: value })).toBeFalsy()
})

for (const width of [320, 1440])
  test(`past transactions and budgets remain readable with editing locked at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 1080 })
    await seed(page)
    const before = await stored(page)
    await navigate(page, 'Lịch sử giao dịch')
    await selectMonth(page, previous)
    await expect(page.locator('.closed-month-notice')).toContainText('Chỉ xem')
    await page.getByRole('button', { name: /^Xem giao dịch Bữa trưa tháng trước/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch', exact: true })
    await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toBeDisabled()
    await expect(dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true })).toHaveValue(
      '50000',
    )
    await expect(dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true })).toBeDisabled()
    await expect(dialog.getByRole('button', { name: 'Xóa giao dịch', exact: true })).toHaveCount(0)
    await expect(dialog.locator('button[type="submit"]')).toHaveCount(0)
    await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
    await navigate(page, 'Cài đặt')
    await expect(budgetInput(page)).toHaveValue('2000000')
    await expect(budgetInput(page)).toHaveAttribute('readonly', '')
    await expect(page.getByRole('button', { name: '5 triệu', exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Lưu thay đổi', exact: true })).toBeDisabled()
    await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('Mây nhỏ')
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
    await expect.poll(async () => (await stored(page)).profile.name).toBe('Mây nhỏ')
    await navigate(page, 'Danh mục & ngân sách')
    await expect(
      page.getByRole('button', { name: 'Điều chỉnh ngân sách tháng', exact: true }),
    ).toBeDisabled()
    await expect(
      page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }),
    ).toBeDisabled()
    await expect(page.getByRole('article', { name: 'Ăn uống', exact: true })).toContainText(
      '100.000',
    )
    await expect(
      page.getByRole('button', { name: 'Xem giao dịch Ăn uống', exact: true }),
    ).toBeEnabled()
    await page.getByRole('button', { name: /Về tháng hiện tại/ }).click()
    await expect(
      page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }),
    ).toBeEnabled()
    const after = await stored(page)
    expect(after.transactions).toEqual(before.transactions)
    expect(after.monthlyBudgets).toEqual(before.monthlyBudgets)
    expect(after.monthlyCategoryBudgets).toEqual(before.monthlyCategoryBudgets)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy()
  })

test('storage rejects edits, deletes, insertions and moved dates in closed months without writing bytes', async ({
  page,
}) => {
  await seed(page)
  const result = await page.evaluate(
    async ({ key, previous, current, next }) => {
      const { persistBook } = await import('/src/bookStorage.js')
      const raw = localStorage.getItem(key)
      const base = JSON.parse(raw)
      const results = []
      for (const mutate of [
        (data) => {
          data.transactions[0].title = 'Đổi tên tháng cũ'
        },
        (data) => {
          data.transactions[0].sourceId = 'bank'
        },
        (data) => {
          data.transactions[0].date = `${current}-01`
        },
        (data) => {
          data.transactions[1].date = `${previous}-01`
        },
        (data) => {
          data.transactions.shift()
        },
        (data) => {
          data.transactions.push({ ...data.transactions[0], id: 'new-past' })
        },
        (data) => {
          data.sourceTransfers[0].date = `${next}-01`
        },
        (data) => {
          data.sourceTransfers = []
        },
        (data) => {
          data.monthlyBudgets[previous]++
        },
        (data) => {
          delete data.monthlyCategoryBudgets[previous]
        },
        (data) => {
          data.budgets.food++
        },
      ]) {
        const changed = structuredClone(base)
        mutate(changed)
        try {
          await persistBook(base, changed, { baseRaw: raw })
          results.push('saved')
        } catch (error) {
          results.push(error.code)
        }
        if (localStorage.getItem(key) !== raw) throw new Error('Closed-month rejection wrote data')
      }
      const changed = structuredClone(base)
      changed.transactions[1].title = 'Đổi tên tháng hiện tại'
      await persistBook(base, changed, { baseRaw: raw })
      return results
    },
    { key: STORAGE_KEY, previous, current, next },
  )
  expect(result).toEqual(Array(11).fill('closed-month'))
  expect((await stored(page)).transactions[1].title).toBe('Đổi tên tháng hiện tại')
})

test('past transfers and unassigned records open read-only from the source ledger', async ({
  page,
}) => {
  const data = book()
  delete data.transactions[0].sourceId
  await seed(page, data)
  await navigate(page, 'Nguồn tiền')
  await page.locator('.source-ledger-row[data-transfer-id="old-transfer"]').click()
  let dialog = page.getByRole('dialog', { name: 'Chi tiết chuyển nguồn', exact: true })
  await expect(
    dialog.getByRole('spinbutton', { name: 'Số tiền chuyển (VND)', exact: true }),
  ).toBeDisabled()
  await expect(
    dialog.getByRole('button', { name: 'Xóa bản ghi chuyển nguồn', exact: true }),
  ).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  await page.locator('.source-ledger-row[data-transaction-id="old"]').click()
  dialog = page.getByRole('dialog', { name: 'Chi tiết giao dịch', exact: true })
  await expect(dialog.getByRole('combobox', { name: /Nguồn tiền/ })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  expect((await stored(page)).transactions).toEqual(data.transactions)
})

test('a dialog and the monthly budget become read-only when the calendar month rolls over', async ({
  page,
}) => {
  await page.clock.install({ time: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 58) })
  await seed(page)
  const before = await stored(page)
  await page.locator('.recent-panel .transaction-row[data-transaction-id="current"]').click()
  const dialog = page.locator('.transaction-dialog')
  await dialog
    .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
    .fill('Bản nháp chưa lưu')
  await page.clock.setSystemTime(new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 1))
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(dialog.getByRole('textbox', { name: 'Tên giao dịch', exact: true })).toBeDisabled()
  await expect(dialog.locator('button[type="submit"]')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Đóng chi tiết', exact: true }).click()
  await navigate(page, 'Cài đặt')
  await expect(budgetInput(page)).toHaveAttribute('readonly', '')
  expect(await stored(page)).toEqual(before)
  await page.getByRole('button', { name: /Về tháng hiện tại/ }).click()
  await expect(budgetInput(page)).not.toHaveAttribute('readonly', '')
})

test('a budget drafted before rollover cannot save before the screen refreshes its month', async ({
  page,
}) => {
  await page.clock.install({ time: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 58) })
  await seed(page)
  await navigate(page, 'Cài đặt')
  await budgetInput(page).fill('2500000')
  const before = await stored(page)
  await expect(page.getByRole('button', { name: 'Lưu thay đổi', exact: true })).toBeEnabled()
  await page.clock.setSystemTime(new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 1))
  await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(page.locator('.storage-alert')).toContainText('chỉ được xem')
  expect(await stored(page)).toEqual(before)
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(budgetInput(page)).toHaveAttribute('readonly', '')
  await expect(budgetInput(page)).toHaveValue('3000000')
})

test('bag links and saved reviews cannot mutate closed-month expenses', async ({ page }) => {
  const data = book()
  data.bags = [
    {
      id: 'bag',
      name: 'Chuyến đi nhỏ',
      description: '',
      budget: 1000000,
      style: 'trip',
      color: 'lilac',
      status: 'active',
      createdAt: Date.now(),
    },
  ]
  data.transactions[0].bagId = 'bag'
  data.transactions[0].review = {
    rating: 'neutral',
    note: 'Cảm nhận cũ được giữ',
    updatedAt: Date.now(),
  }
  data.transactions.push({
    ...data.transactions[0],
    id: 'old-unlinked',
    bagId: undefined,
    title: 'Khoản cũ chưa gom',
  })
  await seed(page, data)
  await navigate(page, 'Túi chi tiêu')
  await page.getByRole('button', { name: 'Mở túi Chuyến đi nhỏ', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Bỏ Bữa trưa tháng trước khỏi túi', exact: true }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Chọn giao dịch', exact: true }).click()
  let dialog = page.getByRole('dialog')
  await expect(
    dialog.getByRole('checkbox', { name: 'Bữa trưa tháng trước', exact: true }),
  ).toBeChecked()
  await expect(
    dialog.getByRole('checkbox', { name: 'Bữa trưa tháng trước', exact: true }),
  ).toBeDisabled()
  await expect(
    dialog.getByRole('checkbox', { name: 'Khoản cũ chưa gom', exact: true }),
  ).toBeDisabled()
  await dialog.getByRole('checkbox', { name: 'Bữa trưa tháng này', exact: true }).check()
  await dialog.getByRole('button', { name: 'Lưu vào túi', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await page.getByRole('button', { name: 'Sửa túi', exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Xóa túi', exact: true })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Đóng', exact: true }).click()
  await navigate(page, 'Túi chi tiêu')
  await page.getByRole('button', { name: 'Cảm nhận đã lưu', exact: true }).click()
  await selectMonth(page, previous)
  const row = page.locator('.worth-row[data-transaction-id="old"]')
  for (const button of await row.locator('.worth-rating-choices button').all())
    await expect(button).toBeDisabled()
  await row.getByRole('button', { name: 'Xem cảm nhận Bữa trưa tháng trước', exact: true }).click()
  dialog = page.getByRole('dialog', { name: 'Khoản chi này thế nào?', exact: true })
  await expect(dialog.getByRole('textbox', { name: 'Lý do của bạn', exact: true })).toHaveAttribute(
    'readonly',
    '',
  )
  await expect(dialog.getByRole('button', { name: 'Lưu cảm nhận', exact: true })).toBeDisabled()
  const saved = await stored(page)
  expect(saved.transactions.find((item) => item.id === 'old')).toEqual(data.transactions[0])
  expect(saved.transactions.find((item) => item.id === 'old-unlinked').bagId).toBeUndefined()
  expect(saved.transactions.find((item) => item.id === 'current').bagId).toBe('bag')
})

test('category edits save only the chosen month and concurrent category edits merge safely', async ({
  page,
}) => {
  await seed(page)
  await navigate(page, 'Danh mục & ngân sách')
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Ngân sách ăn uống', exact: true })
  await dialog
    .getByRole('spinbutton', { name: 'Hạn mức danh mục (VND)', exact: true })
    .fill('250000')
  await dialog.getByRole('button', { name: 'Lưu ngân sách', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  let saved = await stored(page)
  expect(saved.monthlyCategoryBudgets[current].food).toBe(250000)
  expect(saved.monthlyCategoryBudgets[previous].food).toBe(100000)
  expect(getCategoryBudgets(saved, next).food).toBe(saved.budgets.food)
  await page.evaluate(
    async ({ key, next }) => {
      const { persistBook } = await import('/src/bookStorage.js')
      const raw = localStorage.getItem(key)
      const base = JSON.parse(raw)
      const one = structuredClone(base),
        two = structuredClone(base)
      one.monthlyCategoryBudgets[next] = { food: 300000 }
      two.monthlyCategoryBudgets[next] = { shopping: 400000 }
      await Promise.all([
        persistBook(base, one, { baseRaw: raw }),
        persistBook(base, two, { baseRaw: raw }),
      ])
    },
    { key: STORAGE_KEY, next },
  )
  saved = await stored(page)
  expect(saved.monthlyCategoryBudgets[next]).toEqual({ food: 300000, shopping: 400000 })
})

test('backup replacement cannot change existing closed months and can recover historical data into an empty book', async ({
  page,
}) => {
  await seed(page)
  const codes = await page.evaluate(
    async ({ key, previous }) => {
      const { persistBook } = await import('/src/bookStorage.js')
      const raw = localStorage.getItem(key),
        base = JSON.parse(raw)
      const changed = structuredClone(base)
      changed.monthlyBudgets[previous]++
      let code
      try {
        await persistBook(base, changed, { baseRaw: raw, replace: true })
      } catch (error) {
        code = error.code
      }
      if (localStorage.getItem(key) !== raw)
        throw new Error('Rejected backup changed historical data')
      const preserved = structuredClone(base)
      preserved.profile.name = 'Tên mới từ bản sao lưu'
      await persistBook(base, preserved, { baseRaw: raw, replace: true })
      localStorage.removeItem(key)
      await persistBook(base, changed, { baseRaw: null, replace: true })
      return { code, restored: JSON.parse(localStorage.getItem(key)).monthlyBudgets[previous] }
    },
    { key: STORAGE_KEY, previous },
  )
  expect(codes).toEqual({ code: 'closed-month', restored: 2000001 })
})
