import { defineConfig, devices } from '@playwright/test';

/**
 * Dedicated browser configuration for the Caption Studio export reliability audit.
 *
 * The dev server runs the production export-worker build step before Next.js starts,
 * ensuring the tests exercise the same worker entry point used by the application.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/caption-studio-e2e-reliability.spec.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 15_000
  },
  reporter: 'list',
  outputDir: 'test-results/caption-studio-e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000/video-caption-generator',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe'
  }
});
