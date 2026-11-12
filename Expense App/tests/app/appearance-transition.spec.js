import { expect, test } from '@playwright/test'
import { createEmptyData, monthKey, STORAGE_KEY } from '../../src/shared/storage/data.js'
import { APPEARANCE_KEY } from '../../src/app/theme/appearance.js'

const option = (page, mode) =>
  page.locator('.appearance-option').nth({ light: 0, dark: 1, system: 2 }[mode])

async function openSettings(page, { mode = 'light', reduced = false, unsupported = false } = {}) {
  await page.emulateMedia({
    colorScheme: 'light',
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const data = createEmptyData()
  data.monthlyBudgets = { [monthKey()]: 1000000 }
  await page.addInitScript(
    ({ mode, data, unsupported, bookKey, appearanceKey }) => {
      if (!localStorage.getItem(bookKey)) localStorage.setItem(bookKey, JSON.stringify(data))
      if (!localStorage.getItem(appearanceKey))
        localStorage.setItem(appearanceKey, JSON.stringify({ version: 1, mode }))
      window.themeReveals = []
      window.themeTransitionCalls = 0
      const start = document.startViewTransition
      if (unsupported) document.startViewTransition = undefined
      else if (start)
        document.startViewTransition = function (...args) {
          window.themeTransitionCalls += 1
          return start.apply(this, args)
        }
      const animate = Element.prototype.animate
      Element.prototype.animate = function (frames, options) {
        const animation = animate.call(this, frames, options)
        if (options?.pseudoElement === '::view-transition-new(root)') {
          window.themeReveals.push({ frames, options })
          window.themeRevealAnimation = animation
          animation.pause()
          animation.currentTime = 100
        }
        return animation
      }
    },
    { mode, data, unsupported, bookKey: STORAGE_KEY, appearanceKey: APPEARANCE_KEY },
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'Mở cài đặt cá nhân', exact: true }).click()
  await expect(
    page.getByRole('radiogroup', { name: 'Chế độ giao diện', exact: true }),
  ).toBeVisible()
}

async function reveal(page, count) {
  await expect.poll(() => page.evaluate(() => window.themeReveals.length)).toBe(count)
  return page.evaluate(() => window.themeReveals.at(-1))
}

async function finish(page) {
  await page.evaluate(() => window.themeRevealAnimation?.finish())
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
}

function originOf(frame) {
  const match = frame.match(/circle\(0px at ([\d.]+)px ([\d.]+)px\)/)
  expect(match).not.toBeNull()
  return { x: Number(match[1]), y: Number(match[2]) }
}

test('pointer reveals grow from the pressed point in both directions and preserve drafts and finances', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await openSettings(page)
  test.skip(
    !(await page.evaluate(() => Boolean(document.startViewTransition))),
    'Native snapshots unavailable',
  )
  const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
  const name = page.getByRole('textbox', { name: 'Mây có thể gọi bạn là', exact: true })
  await name.fill('Bản nháp đang viết')
  let count = 0
  for (const mode of ['dark', 'light']) {
    const button = option(page, mode)
    await button.scrollIntoViewIfNeeded()
    await button.hover()
    await page.waitForTimeout(180)
    const box = await button.boundingBox()
    await button.click({ position: { x: 23, y: 29 } })
    const { frames, options } = await reveal(page, ++count)
    const origin = originOf(frames.clipPath[0])
    expect(Math.abs(origin.x - box.x - 23)).toBeLessThanOrEqual(1)
    expect(Math.abs(origin.y - box.y - 29)).toBeLessThanOrEqual(1)
    const radius = Number(frames.clipPath[1].match(/circle\(([\d.]+)px/)[1])
    expect(radius).toBeGreaterThanOrEqual(
      Math.hypot(Math.max(origin.x, 1440 - origin.x), Math.max(origin.y, 1000 - origin.y)),
    )
    expect(options.duration).toBe(500)
    await expect(page.locator('html')).toHaveAttribute('data-theme', mode)
    await expect(name).toHaveValue('Bản nháp đang viết')
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
    await finish(page)
  }
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('keyboard changes originate at the selected card center', async ({ page }) => {
  await openSettings(page)
  test.skip(
    !(await page.evaluate(() => Boolean(document.startViewTransition))),
    'Native snapshots unavailable',
  )
  await option(page, 'light').focus()
  const box = await option(page, 'dark').boundingBox()
  await page.keyboard.press('ArrowRight')
  const { frames } = await reveal(page, 1)
  const origin = originOf(frames.clipPath[0])
  expect(origin.x).toBeCloseTo(box.x + box.width / 2, 0)
  expect(origin.y).toBeCloseTo(box.y + box.height / 2, 0)
  await expect(option(page, 'dark')).toBeFocused()
  await finish(page)
})

test('rapid pending and running changes keep the latest selection without leaking transition state', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await openSettings(page)
  test.skip(
    !(await page.evaluate(() => Boolean(document.startViewTransition))),
    'Native snapshots unavailable',
  )
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('.appearance-option')
    buttons[1].click()
    buttons[0].click()
  })
  await expect(option(page, 'light')).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
  await option(page, 'dark').click()
  await reveal(page, 1)
  // Native snapshots suspend pointer hit testing; keyboard changes remain available.
  await option(page, 'light').focus()
  await page.keyboard.press('Enter')
  await reveal(page, 2)
  await finish(page)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).mode, APPEARANCE_KEY),
  ).toBe('light')
  expect(errors).toEqual([])
})

test('following the same system color skips the effect; an automatic color change cancels a stale reveal', async ({
  page,
}) => {
  await openSettings(page)
  test.skip(
    !(await page.evaluate(() => Boolean(document.startViewTransition))),
    'Native snapshots unavailable',
  )
  await option(page, 'system').click()
  expect(await page.evaluate(() => window.themeTransitionCalls)).toBe(0)
  await option(page, 'dark').click()
  await reveal(page, 1)
  await option(page, 'system').focus()
  await page.keyboard.press('Enter')
  await reveal(page, 2)
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
  await expect(option(page, 'system')).toHaveAttribute('aria-checked', 'true')
})

for (const fallback of ['reduced motion', 'unsupported browser']) {
  test(`${fallback} changes colors immediately and saves the choice`, async ({ page }) => {
    await openSettings(page, {
      reduced: fallback === 'reduced motion',
      unsupported: fallback === 'unsupported browser',
    })
    await option(page, 'dark').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(option(page, 'dark')).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
    expect(await page.evaluate(() => window.themeReveals.length)).toBe(0)
    expect(await page.evaluate(() => window.themeTransitionCalls)).toBe(0)
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).mode, APPEARANCE_KEY),
    ).toBe('dark')
  })
}

test.describe('lightweight touch appearance', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test.setTimeout(60000)
  test('portrait and landscape changes skip snapshots and preserve drafts and financial data', async ({
    page,
  }) => {
    const cpu = await page.context().newCDPSession(page)
    await openSettings(page)
    await cpu.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    const name = page.getByRole('textbox', { name: 'Mây có thể gọi bạn là', exact: true })
    await name.fill('Bản nháp trên điện thoại')
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(viewport)
      for (const mode of ['dark', 'light', 'dark']) {
        await option(page, mode).tap()
        await expect(page.locator('html')).toHaveAttribute('data-theme', mode)
        await expect(option(page, mode)).toHaveAttribute('aria-checked', 'true')
        await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
        await expect(name).toHaveValue('Bản nháp trên điện thoại')
      }
    }
    expect(await page.evaluate(() => window.themeTransitionCalls)).toBe(0)
    expect(await page.evaluate(() => window.themeReveals.length)).toBe(0)
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
    await cpu.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.getByRole('button', { name: 'Mở cài đặt cá nhân', exact: true }).click()
    await expect(option(page, 'dark')).toHaveAttribute('aria-checked', 'true')
  })

  test('dark navigation avoids whole-page blur and preserves the book under CPU throttling', async ({
    page,
  }) => {
    await openSettings(page, { mode: 'dark' })
    const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    const cpu = await page.context().newCDPSession(page)
    await cpu.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.evaluate(() => {
      window.blurredPageFrames = []
      const check = () => {
        const content = document.querySelector('.page-content')
        if (content) {
          const filter = getComputedStyle(content).filter
          if (filter !== 'none') window.blurredPageFrames.push(filter)
        }
        window.motionFrame = requestAnimationFrame(check)
      }
      check()
    })
    for (const [label, selector] of [
      ['Lịch sử giao dịch', '.history-workspace'],
      ['Nguồn tiền', '.sources-workspace'],
      ['Túi chi tiêu', '.bags-workspace'],
      ['Tổng quan', '.overview-workspace'],
    ]) {
      await page.getByRole('button', { name: 'Mở menu', exact: true }).tap()
      await page.locator('.sidebar').getByRole('button', { name: label, exact: true }).tap()
      await expect(page.locator(`.page-content ${selector}`)).toBeVisible()
      await expect(page.locator('.sidebar')).not.toHaveClass(/is-open/)
      await expect(page.locator('.page-content')).toHaveCount(1)
    }
    await page.locator('.overview-sources-add').tap()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    expect(await dialog.evaluate((el) => getComputedStyle(el, '::backdrop').backdropFilter)).toBe(
      'none',
    )
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    expect(await page.evaluate(() => window.blurredPageFrames)).toEqual([])
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before)
    await page.evaluate(() => cancelAnimationFrame(window.motionFrame))
  })
})

test('a narrow viewport with a mouse also skips full-screen theme snapshots', async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 900 })
  await openSettings(page)
  await option(page, 'dark').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => window.themeTransitionCalls)).toBe(0)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await option(page, 'light').click()
  if (await page.evaluate(() => Boolean(document.startViewTransition))) {
    await reveal(page, 1)
    await finish(page)
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
