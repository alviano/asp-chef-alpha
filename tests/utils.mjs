import { expect } from '@playwright/test';

export async function check_recipe(page, input, expected_output) {
	await page.getByTestId("InputPanel-textarea").fill(input);
	expect(await page.getByTestId("InputPanel-textarea").inputValue()).toBe(input);
	await expect(await page.getByTestId("OutputPanel-textarea")).toHaveValue(expected_output, { timeout: 1000 });
}
