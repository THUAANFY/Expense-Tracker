import { expect, test } from '@playwright/test'
import { CATEGORIES, dateKey } from '../../src/shared/storage/data.js'
import { createSampleData } from '../helpers/fixtures.js'
import { selectMonth } from '../helpers/month-picker.js'

async function openOverview(page, amounts, extraTransactions = []) {
  const data = createSampleData()
  data.transactions = amounts.map(([category, amount], index) => ({
    id: `donut-${index}`,
    title: CATEGORIES.find((item) => item.id === category).name,
    category,
    amount,
    date: dateKey(),
    type: 'expense',
    wallet: 'Tiền mặt',
    note: '',
    createdAt: index,
  }))
  data.transactions.push(...extraTransactions)
  await page.addInitScript((value) => {
    localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
  await page.goto('/')
  await expect(page.locator('.overview-workspace')).toBeVisible()
  return page.locator('.donut-wrap > svg[role="img"]')
}

// Measure the rendered ring, so a rounded cap cannot silently inflate a tiny category.
async function ringCoverage(svg) {
  return svg.evaluate(
    async (element, palette) => {
      const scale = 6
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 174 * scale
      const context = canvas.getContext('2d')
      const image = new Image()
      const loaded = new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(element))}`
      await loaded
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const colors = palette.map(([id, hex]) => ({
        id,
        rgb: [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)),
      }))
      const samples = 3600
      const coverage = Object.fromEntries(colors.map(({ id }) => [id, 0]))
      for (let index = 0; index < samples; index++) {
        const angle = (index / samples) * 2 * Math.PI
        const x = Math.floor((87 + 64 * Math.cos(angle)) * scale)
        const y = Math.floor((87 + 64 * Math.sin(angle)) * scale)
        const pixel = (y * canvas.width + x) * 4
        const closest = colors.reduce(
          (best, color) => {
            const distance = color.rgb.reduce((sum, channel, channelIndex) => {
              return sum + (channel - pixels[pixel + channelIndex]) ** 2
            }, 0)
            return distance < best.distance ? { id: color.id, distance } : best
          },
          { id: '', distance: Infinity },
        )
        coverage[closest.id] += 100 / samples
      }
      return coverage
    },
    [...CATEGORIES.map(({ id, color }) => [id, color]), ['empty', '#f1eef6']],
  )
}

test('a 0.8% expense occupies a narrow slice and its legend opens the correct transactions', async ({
  page,
}) => {
  const svg = await openOverview(page, [
    ['food', 1500000],
    ['shopping', 12000],
  ])
  const coverage = await ringCoverage(svg)
  expect(coverage.food).toBeCloseTo(99.206, 0)
  expect(coverage.shopping).toBeGreaterThan(0.55)
  expect(coverage.shopping).toBeLessThan(1.05)
  expect(coverage.empty).toBeLessThan(0.1)
  await expect(page.locator('.donut-legend')).toContainText('0,8')
  await page
    .locator('.donut-legend')
    .getByRole('button', { name: /Mua sắm/ })
    .click()
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục' })).toContainText('Mua sắm')
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('12.000')
})

test('one category fills the entire ring without an artificial gap', async ({ page }) => {
  const svg = await openOverview(page, [['food', 1500000]])
  const coverage = await ringCoverage(svg)
  expect(coverage.food).toBeGreaterThan(99.9)
  await expect(page.locator('.donut-legend')).toContainText('100,0')
})

test('a month without expenses displays only the empty ring', async ({ page }) => {
  const svg = await openOverview(page, [])
  const coverage = await ringCoverage(svg)
  expect(coverage.empty).toBeGreaterThan(99.9)
  await expect(page.locator('.donut-center')).toContainText('0 danh mục')
  await expect(page.locator('.category-empty-message')).toBeVisible()
})

test('dark gradients keep real category amounts and legend links open the matching expenses', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' })),
  )
  const svg = await openOverview(page, [
    ['food', 1500000],
    ['shopping', 12000],
  ])
  await expect(svg.locator('defs linearGradient')).toHaveCount(2)
  for (const category of ['food', 'shopping']) {
    const fill = await svg.locator(`path[data-category="${category}"]`).getAttribute('fill')
    expect(fill).toMatch(/^url\(#.+\)$/)
    const stops = await svg
      .locator(`linearGradient[id="${fill.slice(5, -1)}"] stop`)
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('stop-color')))
    expect(new Set(stops).size).toBe(3)
  }
  const row = page.locator('.donut-legend button[data-category="shopping"]')
  await expect(row).toContainText('0,8%')
  await expect(row.locator('.fintech-category-amount')).toContainText('12.000')
  await row.click()
  await expect(page.getByRole('combobox', { name: 'Lọc danh mục' })).toContainText('Mua sắm')
  await expect(page.locator('.transaction-row')).toHaveCount(1)
  await expect(page.locator('.transaction-row')).toContainText('12.000')
})

test('the compact category month picker keeps the overview and category breakdown on the same month', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode: 'dark' })),
  )
  await openOverview(
    page,
    [['food', 100000]],
    [
      {
        id: 'previous-period',
        title: 'Mua sắm tháng ba',
        category: 'shopping',
        amount: 449000,
        date: '2025-03-05',
        type: 'expense',
        wallet: 'Tiền mặt',
        note: '',
        createdAt: 1,
      },
    ],
  )
  await selectMonth(page, '2025-03', 'Chọn tháng chi tiêu theo danh mục')
  await expect(page.locator('.fintech-category-panel .month-picker-trigger')).toContainText(
    'Tháng 3/2025',
  )
  await expect(page.locator('.page-actions .month-picker-trigger')).toContainText('Tháng 03, 2025')
  await expect(page.locator('.overview-expense-card .stat-value')).toContainText('449.000')
  await expect(page.locator('.fintech-category-amount')).toContainText('449.000')
  await expect(page.locator('.recent-panel')).toContainText('Mua sắm tháng ba')
  await expect(page.locator('.donut-legend')).toContainText('100,0%')
})
