import path from 'node:path';
import process from 'node:process';
import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

process.env.NODE_ENV = 'test';

const appPath = path.resolve(import.meta.dirname, '..');

test('Pear Desktop App - With default settings, app is launched and visible', async () => {
  test.setTimeout(60 * 1000);

  const app = await electron.launch({
    cwd: appPath,
    args: [
      appPath,
      '--no-sandbox',
      '--disable-gpu',
      '--whitelisted-ips=',
      '--disable-dev-shm-usage',
    ],
  });

  const window = await app.firstWindow();

  await window.waitForLoadState('domcontentloaded');

  const consentForm = window.locator(
    "form[action='https://consent.youtube.com/save']",
  );

  if (await consentForm.isVisible({ timeout: 5000 })) {
    await consentForm.locator('button').click();
  }
  await expect(window).toHaveURL(/^https:\/\/music\.youtube\.com/);

  await app.close();
});