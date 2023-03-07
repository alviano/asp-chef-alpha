import { test } from '@playwright/test';
import { check_recipe } from "./utils.mjs";

test.describe("Search Model operation", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button').filter({ hasText: 'Accept and close' }).click();
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

	test("unsat without raise error produces no models", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('a.');
		await page.getByRole('button').filter({ hasText: 'Raise error' }).click();
		await check_recipe(page, "-a.",  "");
	});

	test("all models are computed if number of required models is 0", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('{a}.');
		await page.getByTestId('SearchModels-models').fill('0');
		await page.getByRole('button').filter({ hasText: 'Raise error' }).click();
		await check_recipe(page, "",  "EMPTY MODEL\n§\na.");
	});

	test("requiring 0 models with raise error active produces an error on sat programs", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('{a}.');
		await page.getByTestId('SearchModels-models').fill('0');
		await check_recipe(page, "",  "Error: Expecting 0 models, found 2.");
	});

	test("use constraints can be used to reconstruct a projected model", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill(`
{a(1,2); a(1,3); a(4,5); a(4,6)} = 1.
b(X) :- a(X,Y).
		`.trim());
		await page.getByTestId('SearchModels-models').fill('0');
		await page.getByRole('button').filter({ hasText: 'Raise error' }).click();
		await page.getByRole('button').filter({ hasText: 'Use constraints' }).click();
		await check_recipe(page, "b(1).",  `
b(1).
a(1,3).
§
b(1).
a(1,2).
		`.trim());
	});

	test("base64 input is decoded", async ({ page }) => {
		await page.getByRole('button').filter({ hasText: 'Search Models' }).click();
		await page.getByTestId('SearchModels-rules').getByRole('textbox').fill('world.');
		await check_recipe(page, '__base64__("aGVsbG8u").',  "hello.\nworld.");
	});
});