import { expect, test } from '@playwright/test'
import { dateKey } from '../src/data.js'
import { selectMonth } from './helpers/month-picker.js'

async function openTransaction(page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Thêm giao dịch', exact: true }).first().click()
  return page.locator('.transaction-dialog')
}

async function expectFitsViewport(popup) {
  await expect
    .poll(() =>
      popup.evaluate((element) => {
        const box = element.getBoundingClientRect()
        const target = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
        return (
          box.x >= 0 &&
          box.y >= 0 &&
          box.right <= innerWidth + 1 &&
          box.bottom <= innerHeight + 1 &&
          element.scrollWidth <= element.clientWidth &&
          element.contains(target)
        )
      }),
    )
    .toBeTruthy()
}

test('custom calendar handles leap days and persists the chosen date and payment method', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(2024, 1, 15, 12))
  const form = await openTransaction(page)
  const date = form.getByRole('button', { name: /Ngày giao dịch/ })
  const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
  await date.click()
  await calendar.getByRole('button', { name: 'Chọn tháng và năm', exact: true }).click()
  await calendar.getByRole('button', { name: 'Chọn năm của lịch', exact: true }).click()
  await calendar.getByRole('button', { name: 'Năm 2024', exact: true }).click()
  await calendar.getByRole('button', { name: 'Tháng 3 năm 2024', exact: true }).click()
  await calendar.locator('[data-date="2024-03-31"]').click()
  await expect(date).toContainText('31/03/2024')
  await date.click()
  await page.keyboard.press('PageUp')
  await expect(calendar.locator('[data-date="2024-02-29"]')).toBeFocused()
  await expect(calendar.locator('[data-date="2024-02-30"]')).toHaveCount(0)
  await page.keyboard.press('Enter')
  await expect(date).toContainText('29/02/2024')
  const payment = form.getByRole('combobox', { name: /Thanh toán/ })
  await payment.click()
  await page
    .getByRole('listbox', { name: 'Phương thức thanh toán' })
    .getByRole('option', { name: 'Tiền mặt', exact: true })
    .click()
  await expect(payment).toContainText('Tiền mặt')
  await expect(form.locator('input[type="date"], select[name="wallet"]')).toHaveCount(0)
  await form.getByRole('spinbutton', { name: 'Số tiền' }).fill('235000')
  await form.getByRole('textbox', { name: 'Tên giao dịch' }).fill('Ngày nhuận và tiền mặt')
  await form.getByRole('button', { name: 'Lưu giao dịch', exact: true }).click()
  await expect(form).not.toBeVisible()
  await page.reload()
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('may-expense-tracker-v1')).transactions.find(
      (item) => item.title === 'Ngày nhuận và tiền mặt',
    ),
  )
  expect(saved.date).toBe('2024-02-29')
  expect(saved.wallet).toBe('Tiền mặt')
  await selectMonth(page, '2024-02')
  await page
    .locator('.recent-panel .transaction-row')
    .filter({ hasText: 'Ngày nhuận và tiền mặt' })
    .click()
  await expect(
    page.locator('.transaction-dialog').getByRole('button', { name: /Ngày giao dịch/ }),
  ).toContainText('29/02/2024')
  await expect(
    page.locator('.transaction-dialog').getByRole('combobox', { name: /Thanh toán/ }),
  ).toContainText('Tiền mặt')
})

test('Escape and outside clicks dismiss a field popup without closing its transaction dialog', async ({
  page,
}) => {
  const form = await openTransaction(page)
  const date = form.getByRole('button', { name: /Ngày giao dịch/ })
  const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
  await date.click()
  await page.keyboard.press('Escape')
  await expect(calendar).not.toBeVisible()
  await expect(form).toBeVisible()
  await expect(date).toBeFocused()
  await date.click()
  await form.getByRole('textbox', { name: 'Ghi chú' }).click()
  await expect(calendar).not.toBeVisible()
  await expect(form).toBeVisible()
  const payment = form.getByRole('combobox', { name: /Thanh toán/ })
  const list = page.getByRole('listbox', { name: 'Phương thức thanh toán' })
  await payment.click()
  await page.keyboard.press('ArrowDown')
  await expect(payment).toHaveAttribute(
    'aria-activedescendant',
    await list.getByRole('option', { name: 'Tiền mặt', exact: true }).getAttribute('id'),
  )
  await page.keyboard.press('Enter')
  await expect(payment).toContainText('Tiền mặt')
  await expect(payment).toBeFocused()
  await payment.click()
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await expect(payment).toContainText('Thẻ ngân hàng')
  await payment.click()
  await page.keyboard.press('Escape')
  await expect(list).not.toBeVisible()
  await expect(form).toBeVisible()
  await expect(payment).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(form).not.toBeVisible()
})

test('calendar and payment popups stay visible above the scrolling form at all viewport sizes', async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1440, 900],
    [320, 320],
  ]) {
    await page.setViewportSize({ width, height })
    const form = await openTransaction(page)
    await form.getByRole('button', { name: /Ngày giao dịch/ }).click()
    const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
    await expect(calendar).toBeVisible()
    await expectFitsViewport(calendar)
    await page.keyboard.press('Escape')
    await form.getByRole('combobox', { name: /Thanh toán/ }).click()
    const list = page.getByRole('listbox', { name: 'Phương thức thanh toán' })
    await expect(list).toBeVisible()
    await expectFitsViewport(list)
    await page.keyboard.press('Escape')
    await expect(form).toBeVisible()
  }
})

test.describe('touch controls', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  test('today and a payment option can be selected by touch', async ({ page }) => {
    const form = await openTransaction(page)
    const date = form.getByRole('button', { name: /Ngày giao dịch/ })
    await date.tap()
    const calendar = page.getByRole('dialog', { name: 'Chọn ngày giao dịch', exact: true })
    await expectFitsViewport(calendar)
    await calendar.getByRole('button', { name: 'Hôm nay', exact: true }).tap()
    await expect(date).toContainText(dateKey().split('-').reverse().join('/'))
    const payment = form.getByRole('combobox', { name: /Thanh toán/ })
    await payment.tap()
    const list = page.getByRole('listbox', { name: 'Phương thức thanh toán' })
    await expectFitsViewport(list)
    await list.getByRole('option', { name: 'Thẻ ngân hàng', exact: true }).tap()
    await expect(payment).toContainText('Thẻ ngân hàng')
    await expect(form).toBeVisible()
  })
})
