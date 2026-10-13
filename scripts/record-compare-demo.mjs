// Records the /compare demo (screenshots + webm) against a running app on :3000.
// Usage: node scripts/record-compare-demo.mjs  (needs Ollama with qwen2.5:0.5b and smollm2:135m)
import { chromium } from '@playwright/test';
const out = process.env.OUT_DIR ?? './.recording';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 860 },
  recordVideo: { dir: out + '/video', size: { width: 1440, height: 860 } },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/compare', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// add a cloud model with no key, to show per-model error isolation
await page.getByLabel('Provider').selectOption('openai');
await page.getByLabel('Model').selectOption('gpt-6-luna');
await page.getByRole('button', { name: 'Add' }).click();
await page
  .getByTestId('compare-prompt')
  .fill(
    'In 3 short bullet points: what is "time to first token" (TTFT) and why does it matter for chat UX?'
  );
await page.screenshot({ path: out + '/01-setup.png' });
await page.waitForTimeout(800);
await page.getByTestId('compare-run').click();
await page.waitForTimeout(700);
await page.screenshot({ path: out + '/02-streaming.png' });
await page.getByTestId('compare-run').filter({ hasNotText: 'xx' }).waitFor();
await page.waitForFunction(
  () => !document.querySelector('.cc--streaming'),
  null,
  { timeout: 120000 }
);
await page.waitForTimeout(1500);
await page.screenshot({ path: out + '/03-results.png' });
await page.locator('.cmp__run-item').first().click();
await page.waitForTimeout(800);
await page.screenshot({ path: out + '/04-history.png' });
await ctx.close();
await browser.close();
