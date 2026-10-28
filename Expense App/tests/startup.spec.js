import { expect, test } from '@playwright/test'
import { createSampleData } from './helpers/fixtures.js'

test('startup and budget popup no longer depend on the stale Dialogs module', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/src/components/Dialogs.jsx*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'export {}',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await page
    .locator('.sidebar')
    .getByRole('button', { name: 'Danh mục & ngân sách', exact: true })
    .click()
  await page.getByRole('button', { name: 'Chỉnh ngân sách Ăn uống', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('spinbutton')).toHaveValue('3000000')
  expect(errors).toEqual([])
})

test('a failed entry import offers reload and recovers without clearing stored records', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  const data = createSampleData()
  data.profile.name = 'An'
  await page.evaluate(
    (value) => localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value)),
    data,
  )
  await page.route('**/src/components/dialogs/BudgetDialog.jsx*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'export {}',
    }),
  )
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('Chưa thể mở mây.')
  await expect(page.getByRole('button', { name: 'Tải lại trang', exact: true })).toBeVisible()
  await page.unroute('**/src/components/dialogs/BudgetDialog.jsx*')
  await page.getByRole('button', { name: 'Tải lại trang', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gọn chi tiêu. Nhẹ cuộc sống.')
  await expect(page.locator('.greeting')).toContainText('Chào An')
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('may-expense-tracker-v1')).transactions.length,
    ),
  ).toBe(data.transactions.length)
})
