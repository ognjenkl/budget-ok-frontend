import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Budget Tracker/);
});

test('successfully adds new Envelope entry', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Fill in the envelope name and budget
  await page.getByPlaceholder('Name').fill('Rent');
  await page.getByPlaceholder('Budget').fill('1200');

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();

  const successMessageText = 'Envelope created successfully!';
  // Verify success message appears
  await expect(page.getByText(successMessageText)).toBeVisible();

  // // Verify that the new envelope appears on the screen
  // const envelopeName = page.getByText('Rent');
  // await expect(envelopeName).toBeVisible();
  //
  // const envelopeBudget = page.getByText('$1200');
  // await expect(envelopeBudget).toBeVisible();
})
