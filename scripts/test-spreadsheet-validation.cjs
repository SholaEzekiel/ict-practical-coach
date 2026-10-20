const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, filename);
const { validateSpreadsheetResult: validate, readSpreadsheetResult } = require('../src/lib/spreadsheet-result-checker.ts');
const { getSpreadsheetCardsForModule } = require('../src/lib/spreadsheet-instruction-cards.ts');
const { spreadsheetFormulaModules, getFormulaStarter } = require('../src/lib/spreadsheet-formula-modules.ts');
function snapshot(cells) {
  const cellData = {};
  for (const [address, data] of Object.entries(cells)) {
    const [, letters, row] = /^([A-Z]+)(\d+)$/.exec(address);
    const col = [...letters].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
    (cellData[row - 1] ||= {})[col] = data;
  }
  return { sheetOrder: ['sheet'], sheets: { sheet: { cellData } } };
}
let count = 0;
for (const group of spreadsheetFormulaModules) {
  for (const card of getSpreadsheetCardsForModule(group.id)) {
    const cells = Object.fromEntries(card.autoCheck.cells.map(e => [e.cell, { v: e.value, f: e.formula || (e.formulaIncludes ? '=' + e.formulaIncludes.join('') : undefined) }]));
    assert.equal(validate(card, snapshot(cells)).isCorrect, true, card.id);
    for (const expected of card.autoCheck.cells) {
      if (!expected.formula && !expected.formulaIncludes) continue;
      const original = cells[expected.cell];
      cells[expected.cell] = { v: expected.value };
      assert.equal(validate(card, snapshot(cells)).isCorrect, false, card.id + ': typed answer');
      cells[expected.cell] = { ...original, v: '#VALUE!' };
      assert.equal(validate(card, snapshot(cells)).isCorrect, false, card.id + ': wrong calculated result');
      cells[expected.cell] = { ...original, f: '=999' };
      assert.equal(validate(card, snapshot(cells)).isCorrect, false, card.id + ': wrong formula');
      cells[expected.cell] = original;
    }
    count++;
  }
}
const copy = getSpreadsheetCardsForModule('formula-copying').find(c => c.id.endsWith('copy-average'));
const values = { D4: 3, D5: 22 / 6, D6: 3.2, D7: 4 };
const raw = snapshot(Object.fromEntries(Object.entries(values).map(([cell, v]) => [cell, { v, si: 'shared' }])));
assert.equal(validate(copy, raw).isCorrect, false);
const resolved = readSpreadsheetResult(raw, copy.autoCheck.cells, { getRange: cell => ({ getFormula: () => `=B${cell.slice(1)}/C${cell.slice(1)}`, getValue: () => values[cell] }) });
assert.equal(validate(copy, resolved).isCorrect, true, 'shared copied formulas resolve through live API');
assert.equal(raw.sheets.sheet.cellData[6][3].f, undefined, 'snapshot is not mutated');
for (const moduleId of ['formula', 'formula-references', 'formula-lookups', 'formula-practice']) {
  assert.deepEqual(getFormulaStarter(moduleId), { cells: [], formulas: [] }, moduleId + ': student-built tables start blank');
}
for (const moduleId of ['formula-logic', 'formula-conditions', 'formula-copying']) {
  assert.equal(getFormulaStarter(moduleId).cells.some(([address]) => Number(address.match(/\d+/)[0]) >= 20), false, moduleId + ': no unrelated shop data');
}
assert.equal(getFormulaStarter('formula-shop-decisions').cells.some(([address]) => Number(address.match(/\d+/)[0]) < 20), false, 'shop practice has no unrelated club table');
console.log(`Passed ${count} lesson contracts, negative formula/value checks, and shared-formula regression.`);
