import { expect, test } from '@playwright/test'
import { createSampleData } from '../helpers/fixtures.js'
import { selectMonth } from '../helpers/month-picker.js'

async function openChart(page, month, lastDay, expenseFactor = 1) {
  const data = createSampleData()
  const expense = (id, day, amount, type = 'expense') => ({
    id,
    date: `${month}-${String(day).padStart(2, '0')}`,
    amount: type === 'expense' ? amount * expenseFactor : amount,
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

test('dark chart bars use actual daily expenses and keep hover aligned across screen sizes', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
  })
  await openChart(page, '2026-10', 31)
  const bars = page.locator('.spending-bar')
  await expect(bars).toHaveCount(31)
  await expect(page.locator('.chart-axis-unit')).toHaveCount(0)
  await expect(page.locator('.chart-y-labels span')).toHaveText([
    '1 tr',
    '0,8 tr',
    '0,5 tr',
    '0,3 tr',
    '0',
  ])
  await expect(page.locator('.spending-bar[data-day="5"]')).toHaveAttribute('data-value', '200000')
  await expect(page.locator('.spending-bar[data-day="6"]')).toHaveAttribute('data-value', '660000')
  await expect(page.locator('.spending-bar[data-day="1"]')).toHaveAttribute('data-value', '0')
  for (const width of [320, 390, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.locator('.chart-x-labels span[data-day="5"]').hover()
    await expect(page.locator('.chart-tooltip > span')).toHaveText('05/10/2026')
    await expect(page.locator('.chart-tooltip > strong')).toContainText('200.000')
    await expect(page.locator('.spending-bar[data-day="5"]')).toHaveClass(/is-active/)
    await page.locator('.spending-bar[data-day="6"]').hover()
    await expect(page.locator('.chart-tooltip > span')).toHaveText('06/10/2026')
    await expect(page.locator('.chart-tooltip > strong')).toContainText('660.000')
  }
  await page.mouse.move(0, 0)
  await expect(page.locator('.chart-tooltip')).not.toBeVisible()
})

test('the dark chart switches between actual income and expenses and supports keyboard inspection', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
  })
  await openChart(page, '2026-10', 31)
  const panel = page.locator('.chart-panel')
  const income = panel.getByRole('button', { name: 'Thu nhập', exact: true })
  const expense = panel.getByRole('button', { name: 'Chi tiêu', exact: true })
  await expect(expense).toHaveAttribute('aria-pressed', 'true')
  await income.click()
  await expect(income).toHaveAttribute('aria-pressed', 'true')
  await expect(panel.locator('.chart-y-labels span').first()).toHaveText('9 tr')
  await expect(panel.getByRole('img')).toHaveAttribute(
    'aria-label',
    /Thu nhập mỗi ngày tháng 10: tổng 9.000.000/,
  )
  await expect(panel.locator('.spending-bar[data-day="5"]')).toHaveAttribute(
    'data-value',
    '9000000',
  )
  await expect(panel.locator('.spending-bar[data-day="6"]')).toHaveAttribute('data-value', '0')
  await panel.locator('.chart-drawing').focus()
  await panel.locator('.chart-drawing').press('Home')
  await expect(panel.locator('.chart-tooltip > span')).toHaveText('01/10/2026')
  for (let day = 1; day < 5; day++) await panel.locator('.chart-drawing').press('ArrowRight')
  await expect(panel.locator('.chart-tooltip > span')).toHaveText('05/10/2026')
  await expect(panel.locator('.chart-tooltip > strong')).toContainText('9.000.000')
  await panel.locator('.chart-drawing').press('End')
  await expect(panel.locator('.chart-tooltip > span')).toHaveText('31/10/2026')
  await panel.locator('.chart-drawing').press('Escape')
  await expect(panel.locator('.chart-tooltip')).not.toBeVisible()
  await expense.click()
  await expect(expense).toHaveAttribute('aria-pressed', 'true')
  await expect(panel.locator('.spending-bar[data-day="5"]')).toHaveAttribute('data-value', '200000')
  await expect(panel.locator('.spending-bar[data-day="6"]')).toHaveAttribute('data-value', '660000')
})

for (const [range, factor, labels, amount] of [
  ['small', 0.1, ['1 tr', '0,8 tr', '0,5 tr', '0,3 tr', '0'], '20.000'],
  ['large', 10000, ['6.600 tr', '4.950 tr', '3.300 tr', '1.650 tr', '0'], '2.000.000.000'],
]) {
  test(`dark axis uses the light format for ${range} amounts and keeps exact tooltips`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' }))
    })
    await openChart(page, '2026-10', 31, factor)
    await page.setViewportSize({ width: 320, height: 1080 })
    await expect(page.locator('.chart-axis-unit')).toHaveCount(0)
    await expect(page.locator('.chart-y-labels span')).toHaveText(labels)
    await page.locator('.chart-x-labels span[data-day="5"]').hover()
    await expect(page.locator('.chart-tooltip strong')).toContainText(amount)
    await expect(page.locator('.chart-tooltip span')).toHaveText('05/10/2026')
  })
}
