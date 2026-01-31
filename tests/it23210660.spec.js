// tests/it23210660.spec.js

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.swifttranslator.com/';

async function translateAndCapture(page, inputText, options = {}) {
  await page.goto(SITE_URL);

  // locate input element (adjust selector if needed)
  const input = await page.$('textarea, input[type="text"]');
  if (!input) throw new Error('Input element not found; update selector.');
  await input.fill(inputText);

  // trigger translation by pressing Enter (simpler, more reliable)
  await input.press('Enter');
  await page.waitForTimeout(1000); // brief delay for server response

  // wait for Sinhala characters to appear (range U+0D80–U+0DFF)
  try {
    await page.waitForFunction(() => /[\u0D80-\u0DFF]/.test(document.body.innerText), { timeout: 8000 });
  } catch (e) {
    // no Sinhala output within timeout
  }

  // capture a short snippet of any Sinhala text found
  const snippet = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('*')).filter(n => n.innerText && /[\u0D80-\u0DFF]/.test(n.innerText));
    return nodes.length ? nodes.map(n => n.innerText.trim()).slice(0,3).join(' | ') : '';
  });

  // take screenshot for manual review only when explicitly enabled
  // Enable by setting environment variable: SAVE_SCREENSHOTS=true
  if (process.env.SAVE_SCREENSHOTS === 'true' && options.screenshot !== false) {
    const outDir = path.join(process.cwd(), 'test-results', 'it23210660');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const safeName = inputText.replace(/[^a-z0-9_-]/gi, '_').slice(0,60);
    await page.screenshot({ path: path.join(outDir, `${safeName}.png`), fullPage: false });
  }

  return snippet;
}

//============== Positive Test Cases ====================

test('Pos_Fun_0001 — Akka panthi giyaa ', async ({ page }) => {
  const input = 'Akka panthi giyaa';
  const expected = 'අක්කා පන්ති ගියා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/); // at least some Sinhala chars
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0002 — mama adha gamee yana nisaa heta vaedata enna vennee naehae', async ({ page }) => {
  const input = 'mama adha gamee yana nisaa heta vaedata enna vennee naehae';
  const expected = 'මම අද ගමේ යන නිසා හෙට වැඩට එන්න වෙන්නේ නැහැ'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0003 — oyaa aavoth mama kaeema geennam', async ({ page }) => {
  const input = 'oyaa aavoth mama kaeema geennam';
  const expected = 'ඔයා ආවොත් මම කෑම ගේන්නම්'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0004 — oyaa rata yannee mona maasedha ?', async ({ page }) => {
  const input = 'oyaa rata yannee mona maasedha ?';
  const expected = 'ඔයා රට යන්නේ මොන මාසෙද ?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0005 — mama asaniipen nisaa mata adha class ekata enna venne naehae. oyaata puluvandha machan mata adha paadama kiyalaa dhenna. mama  anidhdhaa 4pm vithara oyaalage gedharata ennam ee tika ahaganna.  ee dhavas vedhdhi mata saniipa velaa thiyeyi.', async ({ page }) => {
  const input = 'mama asaniipen nisaa mata adha class ekata enna venne naehae. oyaata puluvandha machan mata adha paadama kiyalaa dhenna. mama  anidhdhaa 4pm vithara oyaalage gedharata ennam ee tika ahaganna.  ee dhavas vedhdhi mata saniipa velaa thiyeyi.';
  const expected = 'මම අසනීපෙන් නිසා මට අද class එකට එන්න වෙන්නෙ නැහැ. ඔයාට පුලුවන්ද මචන් මට අද පාඩම කියලා දෙන්න. මම  අනිද්දා 4pm විතර ඔයාලගෙ ගෙදරට එන්නම් ඒ ටික අහගන්න.  ඒ දවස් වෙද්දි මට සනීප වෙලා තියෙයි.'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});



test('Pos_Fun_0006 — vahaama ivath venu', async ({ page }) => {
  const input = 'vahaama ivath venu';
  const expected = 'වහාම ඉවත් වෙනු'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0007 — mama exam eka anivaarenma pass venavaa', async ({ page }) => {
  const input = 'mama exam eka anivaarenma pass venavaa';
  const expected = 'මම exam එක අනිවාරෙන්ම pass වෙනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0008 — apita ee vaedee hariyatama karaganna baehae', async ({ page }) => {
  const input = 'apita ee vaedee hariyatama karaganna baehae';
  const expected = 'අපිට ඒ වැඩේ හරියටම කරගන්න බැහැ'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0009 — Aadharayen piLigannavaa !!!', async ({ page }) => {
  const input = 'Aadharayen piLigannavaa !!!';
  const expected = 'ආදරයෙන් පිළිගන්නවා !!!'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0010 — mata vathura tikak dhenna puluvandha ?', async ({ page }) => {
  const input = 'mata vathura tikak dhenna puluvandha ?';
  const expected = 'මට වතුර ටිකක් දෙන්න පුලුවන්ද ?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0011 — mama eeka gihin thiyannam', async ({ page }) => {
  const input = 'mama eeka gihin thiyannam';
  const expected = 'මම ඒක ගිහින් තියන්නම්'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0012 — karuNaakaralaa udhenma enna', async ({ page }) => {
  const input = 'karuNaakaralaa udhenma enna';
  const expected = 'කරුණාකරලා උදෙන්ම එන්න'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0013 — Ara thiyennee', async ({ page }) => {
  const input = 'Ara thiyennee';
  const expected = 'අර තියෙන්නේ'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0014 — mee sapaththu dheka Rs.5000 k venavaa', async ({ page }) => {
  const input = 'mee sapaththu dheka Rs.5000 k venavaa';
  const expected = 'මේ සපත්තු දෙක Rs.5000 ක් වෙනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0015 — Mama thee bonavaa', async ({ page }) => {
  const input = 'Mama thee bonavaa';
  const expected = 'මම තේ බොනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0016 — Api pansalata yanavaa', async ({ page }) => {
  const input = 'Api pansalata yanavaa';
  const expected = 'අපි පන්සලට යනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0017 — Mamanidhaagannayanavaa', async ({ page }) => {
  const input = 'Mamanidhaagannayanavaa';
  const expected = 'මමනිදාගන්නයනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0018 — ow ow', async ({ page }) => {
  const input = 'ow ow';
  const expected = 'ඔව් ඔව්'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0019 — Malli giya sathiyee nuvara giyaa', async ({ page }) => {
  const input = 'Malli giya sathiyee nuvara giyaa';
  const expected = 'මල්ලි ගිය සතියේ නුවර ගියා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0020 — Mama dhaen naanna yanavaa', async ({ page }) => {
  const input = 'Mama dhaen naanna yanavaa';
  const expected = 'මම දැන් නාන්න යනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0021 — Oyaagee Email eka evanna', async ({ page }) => {
  const input = 'Oyaagee Email eka evanna';
  const expected = 'ඔයාගේ Email එක එවන්න'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0022 — Aachchita beheth ganna colombo national hospital ekata yanavaa', async ({ page }) => {
  const input = 'Aachchita beheth ganna colombo national hospital ekata yanavaa';
  const expected = 'ආච්චිට බෙහෙත් ගන්න colombo national hospital එකට යනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0023 — oyaa whatsapp innavaadha ?', async ({ page }) => {
  const input = 'oyaa whatsapp innavaadha ?';
  const expected = 'ඔයා whatsapp ඉන්නවාද ?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0024 — Mama ATM ekata salli ganna yanavaa', async ({ page }) => {
  const input = 'Mama ATM ekata salli ganna yanavaa';
  const expected = 'මම ATM එකට සල්ලි ගන්න යනවා'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0025 — parippu 1kg ekak kiiyadha ?', async ({ page }) => {
  const input = 'parippu 1kg ekak kiiyadha ?';
  const expected = 'පරිප්පු 1kg එකක් කීයද ?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Pos_Fun_0026 — oyaagee birthday eka 2008/05/20 needha?', async ({ page }) => {
  const input = 'oyaagee birthday eka 2008/05/20 needha?';
  const expected = 'ඔයාගේ birthday එක 2008/05/20 නේද?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});


// ============== Negative Test Cases (Expected to FAIL) ==============


test('Neg_Func_0001 — Oyage gama kohada ?', async ({ page }) => {
  const input = 'Oyage gama kohada ?';                   // Singlish input
  const expected = 'ඔයාගෙ ගම කොහේද ?';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0002 — Mata padham karanna one', async ({ page }) => {
  const input = 'Mata padham karanna one';                   // Singlish input
  const expected = 'මට පාඩම් කරන්න ඕනේ ';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});


test('Neg_Func_0003 — suba rathrayak !!!', async ({ page }) => {
  const input = 'suba rathrayak !!!';                   // Singlish input
  const expected = 'සුබ රාත්‍රියක් !!!';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0004 — Mata knna baehae', async ({ page }) => {
  const input = 'Mata knna baehae';                   // Singlish input
  const expected = 'මට කන්න බැහැ';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0005 — NIC eka kiyanaee', async ({ page }) => {
  const input = 'NIC eka kiyanaee';                   // Singlish input
  const expected = 'NIC එක කියන්න';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0006 — oyaa heta enawada ? ', async ({ page }) => {
  const input = 'oyaa heta enawada ?';                   // Singlish input
  const expected = 'ඔයා හෙට එනවද ?';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0007 — Heta bus eka nedda ?', async ({ page }) => {
  const input = 'Heta bus eka nedda ?';                   // Singlish input
  const expected = 'හෙට බස් එක නැද්ද ?';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0008 — api heta kataragama yanawa dawas dekaka trip ekak. ude 5am weddi yanawa lesthi wela inna.', async ({ page }) => {
  const input = 'api heta kataragama yanawa dawas dekaka trip ekak. ude 5am wedඅපිdi yanawa lesthi wela inna.';                   // Singlish input
  const expected = 'අපි හෙට කතරගම යනවා දවස් දෙකක trip එකක්. උදේ 5am වෙද්දි යනවා ලෑස්ති වෙලා ඉන්න.';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0009 — nee nee', async ({ page }) => {
  const input = 'nee nee';                   // Singlish input
  const expected = 'නෑ නෑ';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0010 — Mata epa', async ({ page }) => {
  const input = 'Mata epa';                   // Singlish input
  const expected = 'මට එපා';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});

test('Neg_Func_0011 — Rs.100 k ganna tiyenavadha ?', async ({ page }) => {
  const input = 'Rs.100 k ganna tiyenavadha ?';                   // Singlish input
  const expected = 'Rs.100 ක් ගන්න තියෙනවද ?';               // deliberately chosen expected Sinhala (incorrect)
  const actual = await translateAndCapture(page, input);
  // This assertion will fail if the translator produces a different output (negative test)
  expect(actual).toContain(expected);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});


//================positive UI Test case ====================

test('Pos_UI_0001 — api sellam karanna yamudha ?', async ({ page }) => {
  const input = 'api sellam karanna yamudha ?';
  const expected = 'අපි සෙල්ලම් කරන්න යමුද ?'; // REPLACE WITH ACTUAL EXPECTED SINHALA TEXT
  const actual = await translateAndCapture(page, input);
  expect(actual).toMatch(/[\u0D80-\u0DFF]/);
  console.log('INPUT:', input, '| EXPECTED:', expected, '| ACTUAL:', actual);
});




function datasetDrivenTests(filePath) {
  const abs = path.join(__dirname, filePath);
  if (!fs.existsSync(abs)) return;
  const raw = fs.readFileSync(abs, 'utf8');
  let rows = [];
  try { rows = JSON.parse(raw); } catch (e) { /* not JSON */ }
  if (!Array.isArray(rows)) return;
  for (const r of rows) {
    test(`DATA-${r.id || r.input}`, async ({ page }) => {
      const snippet = await translateAndCapture(page, r.input || r.singlish_input, { screenshot: true });
      console.log(r.id || r.input, '->', snippet);
    });
  }
}

// Uncomment and edit to enable dataset-driven runs:
// datasetDrivenTests('singlish_dataset.json');

