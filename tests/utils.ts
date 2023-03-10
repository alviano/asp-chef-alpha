import { expect } from '@playwright/test';

export class TestRecipe {
	private readonly page;

	private constructor(page) {
		this.page = page;
	}

	static async create(page) {
		const res = new TestRecipe(page);
		await visit_homepage_and_accept_privacy_policy(page);
		return res;
	}

	async pause() {
		return await this.page.pause();
	}

	async input(input: string, trim = true) {
		const the_input = trim ? input.trim() : input;
		await this.page.getByTestId("InputPanel-textarea").getByRole('textbox').fill(the_input);
		await with_d_test_elements(this.page.getByTestId("InputPanel-textarea"), async () => {
			await expect(await this.page.getByTestId("InputPanel-textarea").locator('.d-test')).toHaveText(the_input);
		});
	}

	async ingredient(operation: string, callback: (ingredient) => Promise<void> = async () => { /* empty */ }) {
		const locator = add_ingredient(this.page, operation);
		await locator.then(callback);
		return locator;
	}

	async ingredient_with_d_test_elements(operation: string, callback: (ingredient) => Promise<void> = async () => { /* empty */ }) {
		const locator = add_ingredient(this.page, operation);
		await locator.then(async (locator) => {
			await with_d_test_elements(locator, async ingredient => {
				await callback(ingredient);
			});
		});
		return locator;
	}

	async output(output: string, trim = true) {
		const the_output = trim ? output.trim() : output;
		await with_d_test_elements(this.page.getByTestId("OutputPanel-textarea"), async () => {
			await expect(await this.page.getByTestId("OutputPanel-textarea").locator('.d-test')).toHaveText(the_output);
		});
	}

	async output_ingredient(output: string, trim = true) {
		const the_output = trim ? output.trim() : output;
		return this.ingredient_with_d_test_elements('Output', async ingredient => {
			await expect(await ingredient.getByTestId("Output-textarea").locator('.d-test')).toHaveText(the_output);
		});
	}

	async encode(content: string, trim = true) {
		return await this.ingredient('Encode', async ingredient => {
			await ingredient.getByTestId('Encode-content').getByRole('textbox').fill(trim ? content.trim() : content);
		});
	}

	async select_predicates(...predicates: string[]) {
		return await this.ingredient('Select Predicates', async ingredient => {
			for (const predicate of predicates) {
				await ingredient.getByLabel(predicate).click();
			}
		});
	}

	async json_path(query: string, output_predicate: string) {
		return await this.ingredient('JSON Path', async ingredient => {
			await ingredient.getByTestId('JSONPath-query').fill(query);
			await ingredient.getByTestId('JSONPath-output-predicate').fill(output_predicate);
		});
	}

	async wrap(predicate: string) {
		return await this.ingredient('Wrap', async wrap => {
			await wrap.getByTestId('Wrap-predicate').fill(predicate);
		});
	}

	async unwrap(predicate: string) {
		return await this.ingredient('Unwrap', async ingredient => {
			await ingredient.getByTestId('Unwrap-predicate').fill(predicate);
		});
	}

	async search_models(rules: string, {
		number = 1,
		click_raise_error = false,
		click_use_constraints = false,
		decode_predicate = '__base64__'
	} = {}) {
		return this.ingredient('Search Models', async ingredient => {
			await ingredient.getByTestId('SearchModels-rules').getByRole('textbox').fill(rules.trim());
			await ingredient.getByTestId('SearchModels-models').fill(`${number}`);
			await ingredient.getByTestId('SearchModels-decode-predicate').fill(decode_predicate);
			if (click_raise_error) {
				await ingredient.getByRole('button').filter({ hasText: 'Raise error' }).click();
			}
			if (click_use_constraints) {
				await ingredient.getByRole('button').filter({ hasText: 'Use constraints' }).click();
			}
		});
	}

	async optimize(rules: string, {
		number = 1,
		click_raise_error = false,
		click_use_constraints = false,
		decode_predicate = '__base64__'
	} = {}) {
		return this.ingredient('Optimize', async ingredient => {
			await ingredient.getByTestId('Optimize-rules').getByRole('textbox').fill(rules.trim());
			await ingredient.getByTestId('Optimize-models').fill(`${number}`);
			await ingredient.getByTestId('Optimize-decode-predicate').fill(decode_predicate);
			if (click_raise_error) {
				await ingredient.getByRole('button').filter({ hasText: 'Raise error' }).click();
			}
			if (click_use_constraints) {
				await ingredient.getByRole('button').filter({ hasText: 'Use constraints' }).click();
			}
		});
	}

	async lua(content: string, encode_predicate = '__base64__') {
		return this.ingredient('Lua', async ingredient => {
			await ingredient.getByTestId('Lua-content').getByRole('textbox').fill(content.trim());
			await ingredient.getByTestId('Lua-encode-predicate').fill(encode_predicate);
		});
	}

	async merge(predicate = '__model__') {
		return this.ingredient('Merge', async ingredient => {
			await ingredient.getByTestId('Merge-predicate').fill(predicate);
		});
	}

	async split(predicate = '__model__') {
		return this.ingredient('Split', async ingredient => {
			await ingredient.getByTestId('Split-predicate').fill(predicate);
		});
	}
	async sort_by_increasing_size() {
		return this.ingredient('Sort by Increasing Size');
	}
}

export async function visit_homepage_and_accept_privacy_policy(page) {
	await page.goto('/');
	await page.getByRole('button').filter({ hasText: 'Accept and close' }).click();
}

export async function with_d_test_elements(location, callback) {
	await location.locator('.d-test').evaluateAll(elements => elements.forEach(element => element.style.display = 'block'));
	await callback(location);
	await location.locator('.d-test').evaluateAll(elements => elements.forEach(element => element.style.display = 'none'));
}

export async function check_recipe(page, input, expected_output) {
	await page.getByTestId("InputPanel-textarea").getByRole('textbox').fill(input);
	await with_d_test_elements(page.getByTestId("InputPanel-textarea"), async () => {
		await expect(await page.getByTestId("InputPanel-textarea").locator('.d-test')).toHaveText(input);
	});
	await with_d_test_elements(page.getByTestId("OutputPanel-textarea"), async () => {
		await expect(await page.getByTestId("OutputPanel-textarea").locator('.d-test')).toHaveText(expected_output);
	});
}

export async function add_ingredient(page, operation) {
	const operations = await page.getByTestId('Operation').count();
	await page.getByRole('button', { name: operation, exact: true }).click();
	const locator = page.getByTestId('Operation').filter({ hasText: `#${operations + 1}.` });
	await expect(locator.getByText(`#${operations + 1}. ${operation}`)).toBeVisible();
	return locator;
}
