import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createEmptyData, isValidData, STORAGE_KEY } from '../../src/shared/storage/data.js'
import { createSampleData } from '../helpers/fixtures.js'

async function navigate(page, label) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).click()
}
const saved = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)

for (const width of [320, 1440]) {
  test(`a fresh ${width}px book starts empty and persists its first real transaction without a setup reset`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 1000 })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(isValidData(createEmptyData())).toBeTruthy()
    await expect(page.locator('.recent-panel .transaction-row')).toHaveCount(0)
    await expect(page.locator('.donut-center strong')).toContainText('0')
    await expect(page.getByRole('button', { name: 'Dữ liệu mẫu', exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Tạo sổ của tôi', exact: true })).toHaveCount(0)

    const empty = page
      .locator('.recent-panel')
      .getByRole('region', { name: 'Chưa có giao dịch trong tháng', exact: true })
    await expect(empty).toBeVisible()
    const initialRaw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    await empty.getByRole('button', { name: 'Thêm giao dịch', exact: true }).click()
    const emptyDraft = page.locator('.transaction-dialog')
    await expect(emptyDraft).toBeVisible()
    await expect(
      emptyDraft.getByRole('textbox', { name: 'Tên giao dịch', exact: true }),
    ).toHaveValue('')
    await emptyDraft.getByRole('button', { name: 'Để sau', exact: true }).click()
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(initialRaw)

    await page.getByRole('button', { name: 'Thông báo', exact: true }).click()
    const notices = page.getByRole('dialog', { name: 'Thông báo của bạn', exact: true })
    await expect(notices.locator('.notification-card')).toHaveCount(1)
    await notices.getByRole('button', { name: /Sổ nhỏ đang chờ trang đầu tiên/ }).click()
    const dialog = page.locator('.transaction-dialog')
    await dialog.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('25000')
    await dialog
      .getByRole('textbox', { name: 'Tên giao dịch', exact: true })
      .fill('Khoản chi đầu tiên của tôi')
    await dialog.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
    await expect(dialog).not.toBeVisible()
    const data = await saved(page)
    expect(data.transactions).toHaveLength(1)
    expect(data.transactions[0]).toMatchObject({
      title: 'Khoản chi đầu tiên của tôi',
      amount: 25000,
    })
    expect(data.notes).toEqual([])
    expect(data.bags).toEqual([])
    expect(data).not.toHaveProperty('isDemo')
    await page.reload()
    await expect(page.locator('.recent-panel')).toContainText('Khoản chi đầu tiên của tôi')
    expect(await saved(page)).toEqual(data)
    await navigate(page, 'Túi chi tiêu')
    await expect(page.locator('.bag-card')).toHaveCount(0)
    await page.getByRole('button', { name: 'Ghi chú đã lưu', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ghi chú đã lưu.')
    await expect(page.locator('.notebook-card')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('retired mode flags do not erase existing records and old backups still restore all content', async ({
  page,
}) => {
  const legacy = { ...createSampleData(), isDemo: true }
  legacy.transactions.unshift({
    ...legacy.transactions[0],
    id: 'user-record-before-upgrade',
    title: 'Khoản do tôi tự ghi trước cập nhật',
    amount: 123000,
    createdAt: Date.now() + 1,
    review: { rating: 'happy', note: 'Cảm nhận cần giữ', updatedAt: Date.now() },
  })
  await page.addInitScript(
    ({ key, data }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data: legacy },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await saved(page)).toEqual(legacy)
  await expect(page.getByRole('button', { name: 'Dữ liệu mẫu', exact: true })).toHaveCount(0)
  await navigate(page, 'Cài đặt')
  await expect(page.getByRole('button', { name: 'Tạo sổ của tôi', exact: true })).toHaveCount(0)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Xuất bản sao lưu', exact: true }).click()
  const download = await downloadPromise
  const exported = JSON.parse(await readFile(await download.path(), 'utf8'))
  const expected = { ...legacy }
  delete expected.isDemo
  expect(exported).toEqual(expected)

  await page.getByRole('textbox', { name: 'Mây có thể gọi bạn là' }).fill('Tên của tôi')
  await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect.poll(async () => (await saved(page)).profile.name).toBe('Tên của tôi')
  const updated = await saved(page)
  expect(updated.transactions).toEqual(legacy.transactions)
  expect(updated.notes).toEqual(legacy.notes)
  expect(updated.bags).toEqual(legacy.bags)
  expect(updated).not.toHaveProperty('isDemo')

  await page.locator('input[type="file"]').setInputFiles({
    name: 'legacy-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(legacy)),
  })
  const restore = page.getByRole('dialog', { name: 'Khôi phục bản sao lưu?', exact: true })
  await restore.getByRole('button', { name: 'Khôi phục dữ liệu', exact: true }).click()
  await expect(restore).not.toBeVisible()
  expect(await saved(page)).toEqual(expected)
  await page.reload()
  expect(await saved(page)).toEqual(expected)
})
