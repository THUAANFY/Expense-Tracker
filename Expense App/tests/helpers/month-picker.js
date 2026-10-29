export async function selectMonth(page, value, label = 'Chọn tháng thống kê') {
  const [year, month] = value.split('-').map(Number)
  await page.getByRole('button', { name: label, exact: true }).click()
  const picker = page.getByRole('dialog', { name: 'CHỌN THÁNG & NĂM' })
  await picker.getByRole('button', { name: 'Chọn năm', exact: true }).click()
  const yearButton = picker.getByRole('button', { name: `Năm ${year}`, exact: true })
  for (let attempt = 0; attempt < 18 && !(await yearButton.isVisible()); attempt++) {
    const firstYear = Number(await picker.locator('.month-option').first().innerText())
    await picker
      .getByRole('button', { name: year < firstYear ? '12 năm trước' : '12 năm sau', exact: true })
      .click()
  }
  await yearButton.click()
  await picker.getByRole('button', { name: `Tháng ${month} năm ${year}`, exact: true }).click()
}
