export async function chooseHistoryFilter(page, label, option) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page
    .getByRole('listbox', { name: label, exact: true })
    .getByRole('option', { name: option, exact: true })
    .click()
}
