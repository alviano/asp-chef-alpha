import {test} from '@playwright/test';
import {TestRecipe} from "./utils.js";

async function check(recipe, input, search_models, undo, expected_output) {
	await recipe.input(input);
	for (const content of search_models) {
		await recipe.search_models(content);
	}
	await recipe.undo(undo);
	await recipe.output(expected_output);
}

test.describe("Undo", () => {
	let recipe;

	test.beforeEach(async ({ page }) => {
		recipe = await TestRecipe.create(page);
	});

	test("back 1", async () => {
		await check(recipe, 'input.', ['model1.',], 1, 'input.');
	});

	test("back 2", async () => {
		await check(recipe, 'input.', ['model1.', 'model2.', 'model3.'], 2, 'input.\nmodel1.');
	});

	test("back 3", async () => {
		await check(recipe, 'input.', ['model1.', 'model2.', 'model3.'], 2, 'input.');
	});

});