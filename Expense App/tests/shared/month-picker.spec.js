import { expect, test } from '@playwright/test'
import { monthKey } from '../../src/shared/storage/data.js'
import { createSampleData } from '../helpers/fixtures.js'
import { selectMonth } from '../helpers/month-picker.js'

test('custom month and year selection updates real totals, navigation and current month', async ({
  page,
}) => {
  const data = createSampleData()
  data.transactions = [
    {
      id: 'march-expense',
      title: 'Giao dịch tháng ba',
      type: 'expense',
      category: 'food',
      date: '2025-03-05',
      amount: 449000,
      note: '',
      wallet: 'Chuyển khoản',
      createdAt: 1,
    },
  ]
  await page.goto('/')
  await page.evaluate(
    (value) => localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value)),
    data,
  )
  await page.reload()
  await selectMonth(page, '2025-03')
  await expect(page.locator('.month-picker-trigger')).toContainText('Tháng 03, 2025')
  await expect(page.locator('.stat-card').nth(2).locator('.stat-value')).toContainText('449.000')
  await expect(page.locator('.recent-panel')).toContainText('Giao dịch tháng ba')
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  await expect(page.locator('.month-picker-trigger')).toContainText('Tháng 02, 2025')
  await expect(page.locator('.recent-panel .transaction-row')).toHaveCount(0)
  await page.getByRole('button', { name: 'Tháng sau', exact: true }).click()
  await expect(page.locator('.recent-panel .transaction-row')).toHaveCount(1)
  await page.getByRole('button', { name: 'Chọn tháng thống kê' }).click()
  await page
    .getByRole('dialog', { name: 'CHỌN THÁNG & NĂM' })
    .getByRole('button', { name: 'Tháng này', exact: true })
    .click()
  const [year, month] = monthKey().split('-')
  await expect(page.locator('.month-picker-trigger')).toContainText(`Tháng ${month}, ${year}`)
  await expect(page.getByRole('dialog')).not.toBeVisible()
  expect(await page.locator('input[type="month"]').count()).toBe(0)
})

test('month and year grids support keyboard selection, Escape and outside dismissal', async ({
  page,
}) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Chọn tháng thống kê' })
  const picker = page.getByRole('dialog', { name: 'CHỌN THÁNG & NĂM' })
  const [year, month] = monthKey().split('-').map(Number)
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(
    picker.getByRole('button', { name: `Tháng ${month} năm ${year}`, exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Home')
  await expect(
    picker.getByRole('button', { name: `Tháng 1 năm ${year}`, exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(trigger).toContainText(`Tháng 01, ${year}`)
  await trigger.click()
  await picker.getByRole('button', { name: 'Chọn năm', exact: true }).click()
  await expect(picker.getByRole('button', { name: `Năm ${year}`, exact: true })).toBeFocused()
  const lastYear = Number(await picker.locator('.month-option:not(:disabled)').last().innerText())
  const nextYear = Math.min(year + 1, lastYear)
  await page.keyboard.press('ArrowRight')
  await expect(picker.getByRole('button', { name: `Năm ${nextYear}`, exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    picker.getByRole('button', { name: `Tháng 1 năm ${nextYear}`, exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(trigger).toContainText(`Tháng 01, ${nextYear}`)
  await trigger.click()
  await page.keyboard.press('Escape')
  await expect(picker).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.getByRole('heading', { level: 1 }).click()
  await expect(picker).not.toBeVisible()
})

test('year pages can move to a different range and select a month', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Chọn tháng thống kê' }).click()
  const picker = page.getByRole('dialog', { name: 'CHỌN THÁNG & NĂM' })
  await picker.getByRole('button', { name: 'Chọn năm', exact: true }).click()
  const firstYear = Number(await picker.locator('.month-option').first().innerText())
  await picker.getByRole('button', { name: '12 năm trước', exact: true }).click()
  const targetYear = firstYear - 12
  await picker.getByRole('button', { name: `Năm ${targetYear}`, exact: true }).click()
  await picker.getByRole('button', { name: `Tháng 2 năm ${targetYear}`, exact: true }).click()
  await expect(page.locator('.month-picker-trigger')).toContainText(`Tháng 02, ${targetYear}`)
})

test('popover fits small viewports and can switch to the year grid', async ({ page }) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1440, 900],
    [320, 320],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.getByRole('button', { name: 'Chọn tháng thống kê' }).click()
    const picker = page.getByRole('dialog', { name: 'CHỌN THÁNG & NĂM' })
    await expect(picker.locator('.month-option')).toHaveCount(12)
    await picker.getByRole('button', { name: 'Chọn năm', exact: true }).click()
    await expect(picker.getByRole('group', { name: 'Danh sách năm' })).toBeVisible()
    await expect
      .poll(() =>
        picker.evaluate((element) => {
          const box = element.getBoundingClientRect()
          return (
            box.x >= 0 &&
            box.y >= 0 &&
            box.right <= innerWidth &&
            box.bottom <= innerHeight &&
            element.scrollWidth <= element.clientWidth
          )
        }),
      )
      .toBeTruthy()
    await page.keyboard.press('Escape')
    await expect(picker).not.toBeVisible()
  }
})
