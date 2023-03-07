import { expect } from '@playwright/test';

export async function with_d_test_elements(location, callback) {
	await location.locator('.d-test').evaluateAll(elements => elements.forEach(element => element.style.display = 'block'));
	await callback();
	await location.locator('.d-test').evaluateAll(elements => elements.forEach(element => element.style.display = 'none'));
}

export async function check_recipe(page, input, expected_output) {
	await page.getByTestId("InputPanel-textarea").getByRole('textbox').fill(input);
	await with_d_test_elements(page.getByTestId("InputPanel-textarea"), async () => {
		console.log(await page.getByTestId("InputPanel-textarea").locator('.d-test'))
		await expect(await page.getByTestId("InputPanel-textarea").locator('.d-test')).toHaveText(input);
	});
	await with_d_test_elements(page.getByTestId("OutputPanel-textarea"), async () => {
		await expect(await page.getByTestId("OutputPanel-textarea").locator('.d-test')).toHaveText(expected_output);
	});
}
