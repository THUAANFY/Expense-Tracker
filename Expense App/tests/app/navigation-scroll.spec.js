import { expect, test } from '@playwright/test'
import {
  CATEGORIES,
  createEmptyData,
  isValidData,
  monthKey,
  STORAGE_KEY,
} from '../../src/shared/storage/data.js'

async function seed(page) {
  const data = createEmptyData()
  const month = monthKey()
  data.bags = Array.from({ length: 12 }, (_, index) => ({
    id: `bag-${index}`,
    name: `Dịp số ${index + 1}`,
    description: 'Một dịp nhỏ để ghi chép.',
    budget: 2000000,
    style: ['trip', 'gift', 'home', 'tech'][index % 4],
    color: ['lilac', 'mint', 'peach'][index % 3],
    status: 'active',
    createdAt: Date.now() - index,
  }))
  data.transactions = Array.from({ length: 24 }, (_, index) => ({
    id: `transaction-${index}`,
    title: `Khoản chi ${index + 1}`,
    amount: 25000,
    type: 'expense',
    category: CATEGORIES[index % CATEGORIES.length].id,
    date: `${month}-${String(index + 1).padStart(2, '0')}`,
    note: 'Ghi chép trong dịp này.',
    wallet: 'Tiền mặt',
    bagId: 'bag-11',
    createdAt: Date.now() - index,
  }))
  data.notes = Array.from({ length: 20 }, (_, index) => ({
    id: `note-${index}`,
    title: `Ghi chú số ${index + 1}`,
    content: 'Một kế hoạch nhỏ cần nhớ.\nGhi lại điều cần làm cho dịp này.',
    color: ['yellow', 'purple', 'green'][index % 3],
    date: `${month}-01`,
    pinned: false,
  }))
  expect(isValidData(data)).toBeTruthy()
  await page.addInitScript(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)), {
    key: STORAGE_KEY,
    data,
  })
  await page.goto('/')
  await expect(page.locator('.overview-workspace')).toBeVisible()
  await expect(page.locator('.page-content')).toHaveCSS('opacity', '1')
}
async function navigate(page, name) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name, exact: true }).click()
}
async function expectTop(page, content) {
  await expect(page.locator(content).first()).toBeVisible()
  await expect(page.locator('.page-content')).toHaveCSS('opacity', '1')
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2)
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
}
async function revealDeepLink(page, link) {
  await link.scrollIntoViewIfNeeded()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
}

for (const width of [390, 1440]) {
  test.describe(`${width}px navigation scroll`, () => {
    test.use({ viewport: { width, height: 720 }, reducedMotion: 'reduce' })

    test('overview and category links open history at the top while pagination stays in context', async ({
      page,
    }) => {
      await seed(page)
      const viewAll = page
        .locator('.recent-panel')
        .getByRole('button', { name: 'Xem tất cả', exact: true })
      await revealDeepLink(page, viewAll)
      await viewAll.click()
      await expectTop(page, '.history-workspace')
      const nextPage = page.getByRole('button', { name: 'Trang sau', exact: true })
      await revealDeepLink(page, nextPage)
      await nextPage.click()
      await expect(page.locator('.pagination')).toContainText('Trang 2/3')
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
      await navigate(page, 'Danh mục & ngân sách')
      await expectTop(page, '.category-budget-overview')
      const category = page.getByRole('button', { name: 'Xem giao dịch Khác', exact: true })
      await revealDeepLink(page, category)
      await category.click()
      await expectTop(page, '.history-workspace')
      await expect(page.getByRole('combobox', { name: 'Lọc danh mục', exact: true })).toContainText(
        'Khác',
      )
      await expect(page.locator('.transaction-row')).toHaveCount(3)
      await page.evaluate(() => window.scrollTo(0, 350))
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
      await navigate(page, 'Lịch sử giao dịch')
      await expectTop(page, '.history-workspace')
    })

    test('bag details and footer links start at the top while saving a transaction keeps its position', async ({
      page,
    }) => {
      await seed(page)
      await navigate(page, 'Túi chi tiêu')
      await expectTop(page, '.bags-workspace')
      const bag = page.getByRole('button', { name: 'Mở túi Dịp số 12', exact: true })
      await revealDeepLink(page, bag)
      await bag.click()
      await expectTop(page, '.bag-detail')
      await expect(page.locator('.bags-workspace')).toHaveCSS('opacity', '1')
      const edit = page.getByRole('button', { name: /^Sửa khoản chi Khoản chi / }).last()
      await revealDeepLink(page, edit)
      await edit.click()
      const form = page.locator('.transaction-dialog')
      await form.getByRole('spinbutton', { name: 'Số tiền', exact: true }).fill('26000')
      await form.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
      await expect(form).not.toBeVisible()
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
      await page.getByRole('button', { name: 'Tất cả túi', exact: true }).click()
      await expect(page.locator('.bag-detail')).toHaveCount(0)
      await expectTop(page, '.bags-workspace')
      const notes = page.getByRole('button', { name: 'Ghi chú đã lưu', exact: true })
      await revealDeepLink(page, notes)
      await notes.click()
      await expectTop(page, '.notebook-card')
      await page.locator('.notes-parent-link').click()
      await expectTop(page, '.bags-workspace')
    })
  })
}
