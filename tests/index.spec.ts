import { expect, test } from '@playwright/test';

declare global {
	interface Window {
		/** Set by the keyboard-capture probe below. */
		__prevented: boolean | null;
	}
}

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

	test('insert coin swaps the demo for a real game', async ({ page }) => {
		const overlay = page.locator('#galaga-overlay');
		await expect(overlay).toHaveAttribute('data-on', 'true');
		await expect(page.locator('#galaga-lives span')).toHaveCount(0);

		await page.getByRole('button', { name: /INSERT COIN/ }).click();

		await expect(overlay).toHaveAttribute('data-on', 'false');
		await expect(page.locator('#galaga-lives span')).toHaveCount(3);

		await page.keyboard.press('Escape');
		await expect(overlay).toHaveAttribute('data-on', 'true');
	});

	// The whole reason the game gates on an explicit start: arrows and space
	// have to keep scrolling the page everywhere else.
	//
	// Asserting on defaultPrevented rather than on scrollY — late-loading fonts
	// shift the layout and the browser's scroll anchoring moves the page on its
	// own, which made a scroll-based assertion flaky under load.
	test('only captures the keyboard while a game is running', async ({ page }) => {
		// Arm and read as two separate round-trips. Returning a pending promise
		// from evaluate does not guarantee the listener is attached before the
		// keypress lands, which timed out on the slower mobile emulation.
		const arm = () =>
			page.evaluate(() => {
				window.__prevented = null;
				// Registered after the game's own listener, so it sees the flag.
				window.addEventListener(
					'keydown',
					(e) => {
						window.__prevented = e.defaultPrevented;
					},
					{ once: true }
				);
			});
		const read = () => page.evaluate(() => window.__prevented);

		const press = async (key: string, captured: boolean) => {
			await arm();
			await page.keyboard.press(key);
			await expect.poll(read, { message: `${key} captured=${captured}` }).toBe(captured);
		};

		await press('ArrowDown', false);

		await page.getByRole('button', { name: /INSERT COIN/ }).click();
		for (const key of ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']) {
			await press(key, true);
		}

		await page.keyboard.press('Escape');
		await press('ArrowDown', false);
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
