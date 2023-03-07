import { test } from '@playwright/test';
import { check_recipe } from "./utils.mjs";

test.describe("input/output interaction", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test("search for a single model", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('world.');
		await check_recipe(page, "hello.",  "hello.\nworld.");
	});

	test("search for a single model but unsat raises error", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('-hello.');
		await check_recipe(page, "hello.",  "Error: Expecting 1 models, found 0.");
	});

});