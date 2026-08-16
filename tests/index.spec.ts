import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('page shell', () => {
	test('renders every section', async ({ page }) => {
		await expect(page).toHaveTitle(/Jeremias Muriette/);
		await expect(page.getByTestId('header')).toBeVisible();

		for (const section of ['hero', 'about', 'experience', 'projects', 'contact', 'footer']) {
			await expect(page.getByTestId(section)).toBeAttached();
		}
	});

	test('exposes a skip link as the first tab stop', async ({ page }) => {
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'SKIP TO CONTENT' })).toBeFocused();
	});
});

test.describe('section navigation', () => {
	test('nav tiles jump to their section', async ({ page }) => {
		await page.locator('.nav-tile[data-nav="projects"]').click();
		await expect(page).toHaveURL(/#projects$/);
		await expect(page.getByTestId('projects')).toBeInViewport();
	});

	test('the tile for the visible section becomes active', async ({ page }) => {
		await page.getByTestId('contact').scrollIntoViewIfNeeded();
		await expect(page.locator('.nav-tile[data-nav="contact"]')).toHaveClass(/active/);
	});
});

test.describe('stage select tabs', () => {
	test('clicking a tab swaps the visible panel', async ({ page }) => {
		const darwoft = page.getByRole('tab', { name: 'DARWOFT' });
		await darwoft.click();

		await expect(darwoft).toHaveAttribute('aria-selected', 'true');
		await expect(page.locator('#panel-darwoft')).toBeVisible();
		await expect(page.locator('#panel-tech-house')).toBeHidden();
	});

	test('arrow keys move between tabs', async ({ page }) => {
		const first = page.getByRole('tab', { name: 'TECH-HOUSE' });
		await first.focus();
		await page.keyboard.press('ArrowDown');

		await expect(page.getByRole('tab', { name: 'DARWOFT' })).toBeFocused();
		await expect(page.locator('#panel-darwoft')).toBeVisible();
	});
});

test.describe('galaga screen', () => {
	test('the attract loop is actually animating', async ({ page }) => {
		await page.getByTestId('hero').scrollIntoViewIfNeeded();

		const canvas = page.locator('#galaga-canvas');
		await expect(canvas).toBeVisible();

		// Comparing two frames beats asserting on the score, which depends on a
		// shot connecting; the starfield guarantees motion every frame.
		const sample = () =>
			page.evaluate(() => {
				const c = document.getElementById('galaga-canvas') as HTMLCanvasElement;
				return c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data.join(',');
			});

		const before = await sample();
		await page.waitForTimeout(600);
		expect(await sample()).not.toBe(before);
	});
});

test.describe('back to top', () => {
	test('appears only after scrolling, then returns to the top', async ({ page }) => {
		const button = page.getByTestId('back-to-top-button');
		await expect(button).toBeHidden();

		await page.getByTestId('contact').scrollIntoViewIfNeeded();
		await expect(button).toBeVisible();

		await button.click();
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
	});
});
