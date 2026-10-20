const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { chromium } = require('playwright');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, filename);
const { getSpreadsheetCardsForModule } = require('../src/lib/spreadsheet-instruction-cards.ts');
const { spreadsheetFormulaModules } = require('../src/lib/spreadsheet-formula-modules.ts');
const formulas = {
  countif: '=COUNTIF(B4:B7,">=20")', sumif: '=SUMIF(B4:B7,">=20",B4:B7)', averageif: '=AVERAGEIF(B4:B7,">=18")',
  'if-simple': '=IF(B4>=20,"Good","Review")', 'if-copy': '=IF(B7>=20,"Good","Review")',
  'nested-if': '=IF(B5>=22,"Excellent",IF(B5>=18,"Good","Review"))',
  ifs: '=IFS(B7>=22,"Excellent",B7>=18,"Good",TRUE,"Review")',
  vlookup: '=VLOOKUP("Robotics",$J$4:$K$7,2,FALSE)', hlookup: '=HLOOKUP("B",$J$10:$M$11,2,FALSE)',
  xlookup: '=XLOOKUP("Coding",$J$4:$J$7,$K$4:$K$7)',
  'task-shop-copy-revenue': '=B23*C23', 'task-shop-countif': '=COUNTIF(C21:C23,">=20")',
  'task-shop-sumif': '=SUMIF(C21:C23,">=15",D21:D23)', 'task-shop-if': '=IF(C21>=20,"High","Check")',
  'task-shop-nested-if': '=IF(C23>=25,"Excellent",IF(C23>=15,"Good","Check"))',
  'task-vlookup-discount': '=VLOOKUP("B",$G$21:$H$23,2,FALSE)', 'task-absolute-discount': '=B22*(1-$H$25)'
};
async function findApi(page) {
  await page.waitForFunction(() => {
    for (const node of document.querySelectorAll('*')) {
      const key = Object.keys(node).find(k => k.startsWith('__reactFiber'));
      if (!key) continue;
      for (let fiber = node[key]; fiber; fiber = fiber.return) {
        for (let hook = fiber.memoizedState; hook; hook = hook.next) {
          if (hook.memoizedState?.current?.getActiveWorkbook) {
            window.qaApi = hook.memoizedState.current;
            return true;
          }
        }
      }
    }
    return false;
  }, { timeout: 60000 });
}
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    let passed = 0;
    const groups = process.env.TEST_MODULE ? spreadsheetFormulaModules.filter(group => group.id === process.env.TEST_MODULE) : spreadsheetFormulaModules;
    for (const group of groups) {
      await page.goto((process.env.TEST_URL || 'http://localhost:3012') + '/subjects/ict/spreadsheets/' + group.id, { timeout: 120000 });
      await findApi(page);
      if (['formula', 'formula-references', 'formula-lookups', 'formula-practice'].includes(group.id)) {
        const populated = await page.evaluate(() => {
          const book = window.qaApi.getActiveWorkbook().save();
          return Object.values(book.sheets[book.sheetOrder[0]].cellData || {}).flatMap(row => Object.values(row)).filter(cell => cell.f || (cell.v !== undefined && cell.v !== null && cell.v !== ''));
        });
        assert.equal(populated.length, 0, group.id + ': no preloaded student-built table');
        console.log('PASS blank starter', group.id);
      }
      for (const card of getSpreadsheetCardsForModule(group.id)) {
        const slug = card.id.replace('sheet-formula-', '');
        await page.evaluate(async ({ card, slug, formula }) => {
          const api = window.qaApi;
          const sheet = api.getActiveWorkbook().getSheets()[0];
          if (['copy-average', 'reference-copy', 'if-copy', 'task-shop-copy-revenue'].includes(slug)) {
            const [from, to] = { 'copy-average': ['D4', 'D4:D7'], 'reference-copy': ['D4', 'D4:D6'], 'if-copy': ['E4', 'E4:E7'], 'task-shop-copy-revenue': ['D21', 'D21:D23'] }[slug];
            await sheet.getRange(from).autoFill(sheet.getRange(to));
          } else {
            for (const expected of card.autoCheck.cells) {
              // The update lesson edits only the source, leaving existing formulas intact.
              if (slug === 'reference-update' && expected.cell !== 'B4') continue;
              await sheet.getRange(expected.cell).setValue(expected.formula || (expected.formulaIncludes ? formula : expected.value));
            }
          }
          await api.getFormula().whenComputingCompleteAsync(10000);
          await new Promise(resolve => setTimeout(resolve, 500));
          await api.getFormula().whenComputingCompleteAsync(10000);
        }, { card, slug, formula: formulas[slug] });
        if (slug === 'reference-link' || slug === 'copy-average') {
          const address = slug === 'reference-link' ? 'B9' : 'D5';
          const value = slug === 'reference-link' ? 2 : 22 / 6;
          await page.evaluate(async ({ address, value }) => {
            await window.qaApi.getActiveWorkbook().getSheets()[0].getRange(address).setValue(value);
          }, { address, value });
          await page.getByRole('button', { name: 'Check my result', exact: true }).click();
          await page.getByText(`${address} should contain the formula`, { exact: false }).waitFor();
          await page.evaluate(async ({ slug, address }) => {
            const sheet = window.qaApi.getActiveWorkbook().getSheets()[0];
            if (slug === 'copy-average') {
              await sheet.getRange('D4').autoFill(sheet.getRange('D4:D7'));
            } else await sheet.getRange(address).setValue('=B4');
          }, { slug, address });
          console.log('PASS real typed-answer rejection', slug);
        }
        await page.getByRole('button', { name: 'Check my result', exact: true }).click();
        try { await page.getByText('Correct result.', { exact: true }).waitFor({ timeout: 15000 }); }
        catch (error) {
          console.error(await page.evaluate(cells => cells.map(e => { const r = window.qaApi.getActiveWorkbook().getSheets()[0].getRange(e.cell); return [e.cell, r.getFormula(), r.getValue()]; }), card.autoCheck.cells));
          console.error(card.id, await page.locator('body').innerText());
          throw error;
        }
        console.log('PASS', card.id);
        passed++;
        const next = page.getByRole('button', { name: 'Next', exact: true });
        if (await next.count() && await next.isEnabled()) await next.click();
      }
    }
    assert.equal(passed, groups.reduce((total, group) => total + group.cards.length, 0));
    console.log(`All ${passed} lessons passed using real Univer calculations, including auto-fill and source updates.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
