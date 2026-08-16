import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL,
		trace: 'on-first-retry',
	},

	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
		{ name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
		{ name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
	],

	/* Build once, then serve the real output the visitor gets.
	   `astro preview` daemonises when it has no TTY, which Playwright reads as
	   the server exiting early — vite's preview stays in the foreground. */
	webServer: {
		command: `npm run build && npx vite preview --outDir dist --port ${PORT} --strictPort`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
