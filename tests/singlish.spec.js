const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, 'singlish_dataset.json'), 'utf8'));
const resultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
const resultsFile = path.join(resultsDir, 'singlish-results.csv');
if (!fs.existsSync(resultsFile)) fs.writeFileSync(resultsFile, 'id,singlish_input,status,actual_sinhala\n');

for (const entry of dataset) {
  test(`${entry.id} - ${entry.singlish_input.slice(0, 40)}`, async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');

    // Find an input area (textarea or text input)
    const inputHandle = await page.$('textarea, input[type="text"]');
    if (!inputHandle) throw new Error('No input element found on page');

    await inputHandle.fill(entry.singlish_input);

    // Try to click common translate buttons; fallback to Enter
    const buttonLabels = ['Translate', 'Convert', 'Translate Now', 'Translate »', 'Submit', 'go'];
    let clicked = false;
    for (const lbl of buttonLabels) {
      const btn = await page.$(`button:has-text("${lbl}")`);
      if (btn) { await btn.click(); clicked = true; break; }
    }
    if (!clicked) {
      try { await inputHandle.press('Enter'); } catch (e) { /* ignore */ }
    }

    // Wait for Sinhala characters to appear somewhere on the page
    let actual = '';
    try {
      await page.waitForFunction(() => /[\u0D80-\u0DFF]/.test(document.body.innerText), { timeout: 8000 });
      actual = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('*')).filter(n => n.innerText && /[\u0D80-\u0DFF]/.test(n.innerText));
        return nodes.map(n => n.innerText.trim()).join('\n\n');
      });
    } catch (e) {
      actual = '';
    }

    const safeInput = entry.singlish_input.replace(/"/g, '""');
    const safeActual = actual.replace(/"/g, '""').replace(/\n/g, '\\n');
    const status = actual.trim() ? 'OUTPUT' : 'NO_OUTPUT';
    fs.appendFileSync(resultsFile, `"${entry.id}","${safeInput}","${status}","${safeActual}"\n`);
    await page.screenshot({ path: path.join(resultsDir, `${entry.id}.png`) });
  });
}
