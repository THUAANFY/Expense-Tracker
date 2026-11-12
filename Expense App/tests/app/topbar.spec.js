import { expect, test } from '@playwright/test'
import { createEmptyData, dateKey, STORAGE_KEY } from '../../src/shared/storage/data.js'

for (const theme of ['light', 'dark']) {
  for (const width of [1440, 320]) {
    test(`${theme} topbar at ${width}px supports search, shortcuts and account controls`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      const data = createEmptyData()
      data.transactions = ['Cà phê đầu ngày', 'Bánh mì'].map((title, index) => ({
        id: `topbar-${index}`,
        title,
        type: 'expense',
        category: 'food',
        amount: 20000,
        date: dateKey(),
        note: '',
        wallet: 'Tiền mặt',
        createdAt: Date.now(),
      }))
      await page.addInitScript(
        ({ data, key, mode }) => {
          localStorage.setItem('may-appearance-v1', JSON.stringify({ version: 1, mode }))
          if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data))
        },
        { data, key: STORAGE_KEY, mode: theme },
      )
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
      const topbar = page.locator('.topbar')
      const input = topbar.getByRole('textbox', { name: 'Tìm giao dịch', exact: true })
      const toggle = topbar.getByRole('button', { name: 'Mở tìm kiếm giao dịch', exact: true })
      if (width <= 1050) {
        await expect(input).not.toBeVisible()
        await toggle.click()
        await expect(input).toBeFocused()
        await page.keyboard.press('Escape')
        await expect(toggle).toBeFocused()
        await expect(input).not.toBeVisible()
      }
      await page.getByRole('heading', { level: 1 }).click()
      await page.keyboard.press('Control+k')
      await expect(input).toBeVisible()
      await expect(input).toBeFocused()
      await expect
        .poll(() =>
          topbar.evaluate((element) => {
            const box = element.getBoundingClientRect()
            return (
              box.left >= 0 &&
              box.right <= innerWidth + 1 &&
              element.scrollWidth <= element.clientWidth
            )
          }),
        )
        .toBe(true)
      await input.fill('ca phe')
      await expect(page.locator('.history-ledger .transaction-row')).toHaveCount(1)
      await expect(page.locator('.history-ledger .transaction-row')).toContainText(
        'Cà phê đầu ngày',
      )
      if (width <= 1050) {
        await topbar.getByRole('button', { name: 'Đóng tìm kiếm', exact: true }).click()
        await expect(toggle).toBeFocused()
        await expect(input).not.toBeVisible()
      }
      const historySearch = page.getByRole('textbox', {
        name: 'Tìm trong lịch sử giao dịch',
        exact: true,
      })
      await page.keyboard.press('Control+k')
      await expect(historySearch).toBeFocused()
      const bell = topbar.getByRole('button', { name: 'Thông báo', exact: true })
      await bell.click()
      await expect(
        page.getByRole('dialog', { name: 'Thông báo của bạn', exact: true }),
      ).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(bell).toBeFocused()
      await topbar.getByRole('button', { name: 'Mở cài đặt cá nhân', exact: true }).click()
      await expect(
        page.getByRole('radiogroup', { name: 'Chế độ giao diện', exact: true }),
      ).toBeVisible()
      expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
    })
  }
}
