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
})

test('successfully views Envelopes', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Verify the envelopes are displayed
  await expect(page.getByText('Food')).toBeVisible();
  await expect(page.getByText('150')).toBeVisible();
  await expect(page.getByText('Books')).toBeVisible();
  await expect(page.getByText('100')).toBeVisible();
  await expect(page.getByText('Transport')).toBeVisible();
  await expect(page.getByText('80')).toBeVisible();
});
