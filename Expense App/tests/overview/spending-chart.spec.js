import { expect, test } from '@playwright/test'
import { createSampleData } from '../helpers/fixtures.js'
import { selectMonth } from '../helpers/month-picker.js'

async function openChart(page, month, lastDay) {
  const data = createSampleData()
  const expense = (id, day, amount, type = 'expense') => ({
    id,
    date: `${month}-${String(day).padStart(2, '0')}`,
    amount,
    type,
    title: id,
    category: 'food',
    note: '',
    wallet: 'Tiền mặt',
    createdAt: 1,
  })
  data.transactions = [
    expense('day-five-first-expense', 5, 125000),
    expense('day-five-second-expense', 5, 75000),
    expense('day-six-expense', 6, 660000),
    expense('day-five-income', 5, 9000000, 'income'),
    expense('last-day-expense', lastDay, 333000),
  ]
  await page.goto('/')
  await page.evaluate((value) => {
    localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
  await page.reload()
  await selectMonth(page, month)
  await page.evaluate(() => document.fonts.ready)
}

test('each visible date label selects that date in months with 28, 29, 30 and 31 days', async ({
  page,
}) => {
  for (const [month, lastDay] of [
    ['2026-02', 28],
    ['2024-02', 29],
    ['2026-04', 30],
    ['2026-10', 31],
  ]) {
    await openChart(page, month, lastDay)
    const monthNumber = Number(month.slice(-2))
    for (const day of [1, 5, 10, 15, 20, 25, lastDay]) {
      await page
        .locator('.chart-x-labels span')
        .filter({ hasText: new RegExp(`^${String(day).padStart(2, '0')}$`) })
        .hover()
      await expect(page.locator('.chart-tooltip > span')).toHaveText(`Ngày ${day}/${monthNumber}`)
    }
    await expect(page.locator('.chart-tooltip > strong')).toContainText('333.000')
  }
})

test('hover follows the plotted day and expense total across responsive widths', async ({
  page,
}) => {
  await openChart(page, '2026-10', 31)
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1080 })
    const chart = page.locator('.chart-drawing > svg')
    await chart.scrollIntoViewIfNeeded()
    const tickFive = page.locator('.chart-x-labels span').filter({ hasText: /^05$/ })
    const tickTen = page.locator('.chart-x-labels span').filter({ hasText: /^10$/ })
    await tickFive.hover()
    await expect(page.locator('.chart-tooltip > span')).toHaveText('Ngày 5/10')
    await expect(page.locator('.chart-tooltip > strong')).toContainText('200.000')
    const five = await tickFive.boundingBox()
    const ten = await tickTen.boundingBox()
    const box = await chart.boundingBox()
    const xFive = five.x + five.width / 2
    const xTen = ten.x + ten.width / 2
    await page.mouse.move(xFive, box.y + box.height / 2)
    await expect(page.locator('.chart-tooltip > span')).toHaveText('Ngày 5/10')
    await expect(page.locator('.chart-tooltip > strong')).toContainText('200.000')
    await page.mouse.move(xFive + (xTen - xFive) / 5, box.y + box.height / 2)
    await expect(page.locator('.chart-tooltip > span')).toHaveText('Ngày 6/10')
    await expect(page.locator('.chart-tooltip > strong')).toContainText('660.000')
    await page.mouse.move(box.x + 1, box.y + box.height / 2)
    await expect(page.locator('.chart-tooltip > span')).toHaveText('Ngày 1/10')
    await page.mouse.move(box.x + box.width - 1, box.y + box.height / 2)
    await expect(page.locator('.chart-tooltip > span')).toHaveText('Ngày 31/10')
    await page.mouse.move(0, 0)
    await expect(page.locator('.chart-tooltip')).not.toBeVisible()
  }
})
