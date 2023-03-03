import { expect, test } from '@playwright/test';
import { check_recipe } from "./utils.mjs";

test('the name of the app is shown in the logo', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('span.logo')).toBe('ASP Chef');
});

test.describe("input/output interaction", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test("simple echo", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').fill('world.');
		await check_recipe(page, "hello. world.",  "hello.\nworld.");
	});
});