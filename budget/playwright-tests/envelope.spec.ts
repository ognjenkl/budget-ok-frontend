import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Budget Tracker/);
});

test('successfully adds new Envelope entry', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Fill in the envelope name and amount
  await page.getByPlaceholder('Name').fill('Groceries');
  await page.getByPlaceholder('Amount').fill('200');

  // Submit the form
  await page.getByRole('button', { name: 'Add New Envelope' }).click();

  // Verify that the new envelope appears in the list
  const envelopeList = await page.locator('.envelope-list');
  await expect(envelopeList).toContainText('Groceries');
  await expect(envelopeList).toContainText('$200');
})
