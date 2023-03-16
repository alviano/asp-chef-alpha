import {expect} from '@playwright/test';

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

	async input(input: string, trim = true, encode = false) {
		const the_input = trim ? input.trim() : input;
		if (encode) {
			await this.page.getByTestId('InputPanel').getByRole('button', { name: 'Encode' }).click();
		}
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

	async output(output: string, trim = true, decode = false) {
		const the_output = trim ? output.trim() : output;
		if (decode) {
			await this.page.getByTestId('OutputPanel').getByRole('button', { name: 'Decode' }).click();
			await this.page.waitForNavigation('.*', { waitUntil: 'networkidle' });
		}
		await with_d_test_elements(this.page.getByTestId("OutputPanel-textarea"), async () => {
			await expect(await this.page.getByTestId("OutputPanel-textarea").locator('.d-test')).toHaveText(the_output);
		});

		await this.page.goto('/headless#' + this.page.url().split('#')[1]);
		await expect(await this.page.getByTestId("Headless-output")).toHaveText(the_output);
	}

	async output_ingredient(output: string, trim = true) {
		const the_output = trim ? output.trim() : output;
		return this.ingredient_with_d_test_elements('Output', async ingredient => {
			await expect(await ingredient.getByTestId("Output-textarea").locator('.d-test')).toHaveText(the_output);
		});
	}

	async output_encoded_content(expected_output: string, trim = true, {
		predicate = '__base64__',
		echo = false,
	} = {}) {
		const the_output = trim ? expected_output.trim() : expected_output;
		return this.ingredient_with_d_test_elements('Output Encoded Content', async ingredient => {
			await ingredient.getByTestId('OutputEncodedContent-predicate').fill(predicate);
			if (echo) {
				await ingredient.getByRole('button').filter({ hasText: 'Echo' }).click();
			}
			await expect(await ingredient.getByTestId("OutputEncodedContent-textarea").locator('.d-test')).toHaveText(the_output);
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
				await ingredient.locator('div.input-group').filter({ hasText: predicate }).click();
			}
		});
	}

	async json_path(query: string, output_predicate: string, click_echo = false) {
		return await this.ingredient('JSON Path', async ingredient => {
			await ingredient.getByTestId('JSONPath-query').fill(query);
			await ingredient.getByTestId('JSONPath-output-predicate').fill(output_predicate);
			if (click_echo) {
				await ingredient.getByRole('button').filter({ hasText: 'Echo' }).click();
			}
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

	async index(predicate = '__index__') {
		return this.ingredient('Index', async ingredient => {
			await ingredient.getByTestId('Index-predicate').fill(predicate);
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

	async sort_by_decreasing_size() {
		return this.ingredient('Sort by Decreasing Size');
	}

	async sort_by_predicate_or_argument(sort_index, click_descending = false) {
		return this.ingredient('Sort by Predicate or Argument', async ingredient => {
			await ingredient.getByTestId('SortByPredicateOrArgument-sort-index').fill(`${sort_index}`);
			if (click_descending) {
				await ingredient.getByRole('button').filter({ hasText: 'Descending' }).click();
			}
		});
	}

	async sort_canonical() {
		return this.ingredient('Sort Canonical');
	}

	async sort_models_canonically(...predicates: string[]) {
		return this.ingredient('Sort Models Canonically', async ingredient => {
			for (const predicate of predicates) {
				await ingredient.locator('div.input-group').filter({ hasText: predicate }).click();
			}
		});
	}

	async unique(...predicates: string[]) {
		return this.ingredient('Unique', async ingredient => {
			for (const predicate of predicates) {
				await ingredient.locator('div.input-group').filter({ hasText: predicate }).click();
			}
		});
	}

	async undo(steps) {
		return this.ingredient('Undo', async ingredient => {
			await ingredient.getByTestId('Undo-steps').fill(`${steps}`);
		});
	}

	async symmetric_closure(input_predicate, closure_predicate, encode_predicate) {
		return this.ingredient('Symmetric Closure', async ingredient => {
			await ingredient.getByTestId('SymmetricClosure-input-predicate').fill(input_predicate);
			await ingredient.getByTestId('SymmetricClosure-closure-predicate').fill(closure_predicate);
			await ingredient.getByTestId('SymmetricClosure-encode-predicate').fill(encode_predicate);
		});
	}

	async transitive_closure(input_predicate, closure_predicate, encode_predicate) {
		return this.ingredient('Transitive Closure', async ingredient => {
			await ingredient.getByTestId('TransitiveClosure-input-predicate').fill(input_predicate);
			await ingredient.getByTestId('TransitiveClosure-closure-predicate').fill(closure_predicate);
			await ingredient.getByTestId('TransitiveClosure-encode-predicate').fill(encode_predicate);
		});
	}

	async extensional_relation(content, predicate = '__edb__') {
		return this.ingredient('Extensional Relation', async ingredient => {
			await ingredient.getByTestId('ExtensionalRelation-content').getByRole('textbox').fill(content);
			await ingredient.getByTestId('ExtensionalRelation-predicate').fill(predicate);
		});
	}

	async graph(predicate, click_echo = false) {
		return this.ingredient('Graph', async ingredient => {
			await ingredient.getByTestId('Graph-predicate').fill(predicate);
			if (click_echo) {
				await ingredient.getByRole('button').filter({ hasText: 'Echo' }).click();
			}
		});
	}

	async parse_csv({
		decode_predicate = '__base64__',
		click_echo = false,
		separator = 'TAB',
		output_predicate = '__cell__',
					} = {}) {
		return this.ingredient('Parse CSV', async ingredient => {
			await ingredient.getByTestId('ParseCSV-decode-predicate').fill(decode_predicate);
			await ingredient.getByTestId('ParseCSV-separator').fill(separator);
			if (click_echo) {
				await ingredient.getByRole('button').filter({ hasText: 'Echo' }).click();
			}
			await ingredient.getByTestId('ParseCSV-output-predicate').fill(output_predicate);
		});
	}

	async table({
		input_one_atom_per_line = undefined,
		search = [],
		order = [],
				} = {}) {
		const models: Array<Array<string>> = input_one_atom_per_line !== undefined ?
			input_one_atom_per_line.split('§').map(model => model.trim().split('\n')) : undefined;
		return this.ingredient('Table', async ingredient => {
			if (models !== undefined) {
				// expecting # of models + # of atoms rows
				const number_of_rows = models.reduce((count, model) => count + model.length, models.length);
				await expect(await ingredient.getByTestId("Table").locator('tr')).toHaveCount(number_of_rows);
			}
			for (const search_pair of search) {
				expect(models !== undefined);
				await ingredient.getByTestId('Table-search').fill(search_pair.string);
				await expect(await ingredient.getByTestId("Table").locator('tr')).toHaveCount(search_pair.expected + models.length);
			}
			for (const order_pair of order) {
				const id = order_pair.desc ? `Table-sort-desc-${order_pair.index}`
					: `Table-sort-asc-${order_pair.index}`;
				await ingredient.getByTestId(id).click();
			}
		});
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
	await page.getByTestId('OperationsPanel-list').getByRole('button', { name: operation, exact: true }).click();
	const locator = page.getByTestId('Operation').filter({ hasText: `#${operations + 1}.` });
	await expect(locator.getByText(`#${operations + 1}. ${operation}`)).toBeVisible();
	return locator;
}
