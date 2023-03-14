import { test } from '@playwright/test';
import { TestRecipe } from './utils.js';

async function check(recipe, input, expected_output) {
	await recipe.input(input);
    await recipe.sort_by_predicate_or_argument(0);
    await recipe.table(input);
	await recipe.output(expected_output);
}

test.describe("Table", () => {
    let recipe;

    test.beforeEach(async ({page}) => {
        recipe = await TestRecipe.create(page);
    });

    test("Display Sorted Table", async () => {
        await check(recipe, 
`uno(b,c).
dos(c,d).`
            ,
`dos(c,d).
uno(b,c).`);
    });
});