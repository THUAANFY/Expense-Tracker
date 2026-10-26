import { expect, test } from '@playwright/test'
import { createDemoData, dateKey } from '../src/data.js'

async function navigateToNotes(page) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Mở menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.locator('.sidebar').getByRole('button', { name: 'Sổ ghi chú', exact: true }).click()
  await expect(page.getByRole('tab', { name: /Ghi chú của tôi/ })).toBeVisible()
}

async function seedNotes(page, notes) {
  const data = createDemoData()
  data.notes = notes
  await page.addInitScript((value) => {
    if (!localStorage.getItem('may-expense-tracker-v1')) {
      localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
    }
  }, data)
  await page.goto('/')
  await navigateToNotes(page)
}

test('search, paper colors and pin filters find real notes and pin changes persist', async ({
  page,
}) => {
  await seedNotes(page, [
    {
      id: 'reminder',
      title: 'Lời nhắc đầu tháng',
      content: 'Giữ lại hóa đơn điện để đối chiếu.',
      color: 'yellow',
      pinned: true,
      date: dateKey(),
    },
    {
      id: 'travel',
      title: 'Dành cho chuyến đi Đà Lạt',
      content: 'Mỗi tháng để dành hai triệu.',
      color: 'purple',
      pinned: false,
      date: dateKey(),
    },
    {
      id: 'groceries',
      title: 'Đi chợ cuối tuần',
      content: 'Mua rau củ và trái cây theo mùa.',
      color: 'green',
      pinned: false,
      date: dateKey(),
    },
  ])
  const cards = page.locator('.notebook-grid .note-card')
  const search = page.getByRole('textbox', { name: 'Tìm trong sổ ghi chú' })
  const filters = page.getByRole('group', { name: 'Lọc ghi chú' })
  await search.fill('hoa don dien')
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText('Lời nhắc đầu tháng')
  await page.getByRole('button', { name: 'Xóa tìm kiếm ghi chú' }).click()
  await expect(search).toBeFocused()
  await filters.getByRole('button', { name: 'Tím', exact: true }).click()
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText('Đà Lạt')
  await search.fill('không có kết quả này')
  await expect(page.getByRole('heading', { name: 'Chưa tìm thấy ghi chú phù hợp' })).toBeVisible()
  await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).click()
  await expect(cards).toHaveCount(3)
  await filters.getByRole('button', { name: 'Đã ghim', exact: true }).click()
  await expect(cards).toHaveCount(1)
  await cards.getByRole('button', { name: 'Bỏ ghim ghi chú', exact: true }).click()
  await expect(cards).toHaveCount(0)
  await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).click()
  const travel = cards.filter({ hasText: 'Dành cho chuyến đi Đà Lạt' })
  await travel.getByRole('button', { name: 'Ghim ghi chú', exact: true }).click()
  await expect(cards.first()).toContainText('Đà Lạt')
  await page.reload()
  await navigateToNotes(page)
  await expect(cards.first()).toContainText('Đà Lạt')
  await expect(cards.first().getByRole('button', { name: 'Bỏ ghim ghi chú' })).toBeVisible()
})

test('transaction tab supports keyboard navigation, search, editing and changing months', async ({
  page,
}) => {
  await page.goto('/')
  await navigateToNotes(page)
  await page.getByRole('tab', { name: /Ghi chú của tôi/ }).focus()
  await page.keyboard.press('ArrowRight')
  const transactionTab = page.getByRole('tab', { name: /Từ giao dịch/ })
  await expect(transactionTab).toBeFocused()
  await expect(transactionTab).toHaveAttribute('aria-selected', 'true')
  const search = page.getByRole('textbox', { name: 'Tìm trong sổ ghi chú' })
  await search.fill('thiet ke giao dien')
  const cards = page.locator('.notebook-transaction-card')
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText('Dự án freelance')
  await cards.click()
  const dialog = page.locator('.transaction-dialog')
  await expect(dialog.getByRole('textbox', { name: 'Ghi chú' })).toHaveValue(
    'Thiết kế giao diện cho khách hàng.',
  )
  await dialog
    .getByRole('textbox', { name: 'Ghi chú' })
    .fill('Thiết kế giao diện, đã nhận đủ thanh toán.')
  await dialog.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()
  await expect(cards).toContainText('đã nhận đủ thanh toán')
  await page.getByRole('button', { name: 'Xóa tìm kiếm ghi chú' }).click()
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click()
  await expect(cards).toHaveCount(1)
  await expect(cards).toContainText('Sinh hoạt tháng trước')
  await transactionTab.focus()
  await page.keyboard.press('Home')
  await expect(page.getByRole('tab', { name: /Ghi chú của tôi/ })).toHaveAttribute(
    'aria-selected',
    'true',
  )
})

test.describe('small touch screen notebook', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })
  test('empty notebook can create, edit and delete a colored pinned note in a scrolling editor', async ({
    page,
  }) => {
    await seedNotes(page, [])
    await page.getByRole('button', { name: 'Viết ghi chú đầu tiên', exact: true }).tap()
    const dialog = page.locator('.note-dialog')
    await dialog.getByRole('textbox', { name: 'Tiêu đề' }).fill('Một kế hoạch nhỏ')
    await dialog
      .getByRole('textbox', { name: 'Nội dung' })
      .fill('Để dành một khoản mỗi tuần.\nGhi lại các khoản cần thiết.')
    await dialog.getByRole('button', { name: 'Xanh', exact: true }).tap()
    await dialog.getByRole('checkbox', { name: 'Ghim ghi chú', exact: true }).check()
    const save = dialog.getByRole('button', { name: 'Lưu ghi chú', exact: true })
    await expect(save).toBeInViewport()
    await save.tap()
    const card = page.locator('.notebook-grid .note-card').filter({ hasText: 'Một kế hoạch nhỏ' })
    await expect(card).toHaveClass(/green/)
    await expect(card.getByRole('button', { name: 'Bỏ ghim ghi chú' })).toBeVisible()
    await page
      .getByRole('group', { name: 'Lọc ghi chú' })
      .getByRole('button', { name: 'Xanh', exact: true })
      .tap()
    await expect(card).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
    await card.locator('.note-body').tap()
    await expect(dialog.getByRole('textbox', { name: 'Nội dung' })).toHaveValue(
      'Để dành một khoản mỗi tuần.\nGhi lại các khoản cần thiết.',
    )
    await dialog.getByRole('button', { name: 'Xóa ghi chú', exact: true }).tap()
    await dialog.getByRole('button', { name: 'Xác nhận xóa', exact: true }).tap()
    await expect(card).toHaveCount(0)
    await page.getByRole('button', { name: 'Xóa bộ lọc', exact: true }).tap()
    await expect(
      page.getByRole('button', { name: 'Viết ghi chú đầu tiên', exact: true }),
    ).toBeVisible()
  })
})
