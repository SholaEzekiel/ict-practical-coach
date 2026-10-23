const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { chromium } = require('playwright');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, filename);
const { ictTheoryModules } = require('../src/lib/ict-theory-data.ts');
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1050 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto((process.env.TEST_URL || 'http://localhost:3012') + '/subjects/ict/theory', { timeout: 120000 });
    const modules = process.env.TEST_MODULE ? ictTheoryModules.filter(module => module.id === process.env.TEST_MODULE) : ictTheoryModules;
    let answered = 0;
    for (const module of modules) {
      await page.getByRole('button', { name: new RegExp('^[0-9]+ lessons.*' + escape(module.moduleTitle) + '$') }).click();
      await page.getByRole('button', { name: /^Module glossary/ }).click();
      await page.getByText(`${module.glossary.length} of ${module.glossary.length} terms`, { exact: true }).waitFor();
      const term = module.glossary.find(entry => entry.sourcePages?.length);
      await page.getByLabel('Search terms').fill(term.term);
      await page.getByText(term.term, { exact: true }).waitFor();
      await page.getByLabel('Search terms').fill('no-such-ict-term-987');
      await page.getByText('No matching terms.', { exact: true }).waitFor();
      await page.getByLabel('Search terms').fill('');
      const topic = term.topic;
      await page.getByLabel('Study topic', { exact: true }).selectOption(topic);
      const expectedCount = module.glossary.filter(entry => entry.topic === topic).length;
      await page.getByText(`${expectedCount} of ${module.glossary.length} terms`, { exact: true }).waitFor();
      await page.getByRole('button', { name: /^Case study practice \(/ }).click();
      const caseIds = new Set();
      for (let index = 0; index < 6; index++) {
        const card = page.locator('[data-quiz-id]');
        const id = await card.getAttribute('data-quiz-id');
        const question = module.quiz.find(question => question.id === id);
        assert(question?.caseStudy, id + ': missing case mapping');
        assert.equal(id, `${question.caseStudy.id}-q${index % 3 + 1}`, 'case questions must keep their teaching sequence');
        assert(!caseIds.has(id), id + ': repeated case question');
        caseIds.add(id);
        await card.getByText(question.caseStudy.scenario, { exact: true }).waitFor();
        await card.getByRole('button', { name: question.options[question.correctIndex], exact: true }).click();
        await card.getByText('Correct', { exact: true }).waitFor();
        const next = card.getByRole('button', { name: 'Next', exact: true });
        if (index < 5) {
          await next.click();
          await page.waitForFunction(previous => document.querySelector('[data-quiz-id]')?.getAttribute('data-quiz-id') !== previous, id);
        } else assert.equal(await next.isDisabled(), true);
        answered++;
      }
      await page.getByRole('button', { name: /^Multiple choice questions \(/ }).click();
      const knowledgeTopic = module.quiz.find(question => !question.caseStudy && question.studyTopic)?.studyTopic;
      await page.getByLabel('Study topic', { exact: true }).selectOption(knowledgeTopic);
      const allowed = module.quiz.filter(question => !question.caseStudy && question.studyTopic === knowledgeTopic).map(question => question.id);
      await page.waitForFunction(ids => ids.includes(document.querySelector('[data-quiz-id]')?.getAttribute('data-quiz-id')), allowed);
      const card = page.locator('[data-quiz-id]');
      let id = await card.getAttribute('data-quiz-id');
      let current = module.quiz.find(question => question.id === id);
      if (module.id === modules[0].id) {
        await card.getByRole('button', { name: current.options[(current.correctIndex + 1) % 4], exact: true }).click();
        await card.getByText(`Correct answer: ${current.options[current.correctIndex]}`, { exact: true }).waitFor();
        assert.equal(await card.getByText('Correct', { exact: true }).count(), 0, 'wrong answer must not be marked correct');
        await page.getByRole('button', { name: 'Reset module score', exact: true }).click();
        await page.waitForFunction(() => !document.querySelector('[data-quiz-id]')?.textContent.includes('Correct answer:'));
        id = await card.getAttribute('data-quiz-id');
        current = module.quiz.find(question => question.id === id);
      }
      await card.getByRole('button', { name: current.options[current.correctIndex], exact: true }).click();
      await card.getByText('Correct', { exact: true }).waitFor();
      console.log('PASS glossary, topic filters, six case questions and knowledge scoring:', module.id);
    }
    await page.getByRole('button', { name: /^Module glossary/ }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'mobile horizontal overflow');
    const artifacts = process.env.TEST_ARTIFACT_DIR || path.join(os.tmpdir(), 'peak-ict-qa');
    fs.mkdirSync(artifacts, { recursive: true });
    await page.getByRole('heading', { name: /glossary$/ }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(artifacts, 'ict-glossary-mobile.png') });
    await page.setViewportSize({ width: 1500, height: 1050 });
    await page.getByRole('heading', { name: /glossary$/ }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(artifacts, 'ict-glossary-desktop.png') });
    const lastModule = modules[modules.length - 1];
    const linked = lastModule.glossary.find(entry => entry.alsoStudyIn?.length);
    if (linked) {
      await page.getByLabel('Search terms').fill(linked.term);
      const destination = ictTheoryModules.find(module => module.id === linked.alsoStudyIn[0]);
      await page.getByRole('button', { name: destination.moduleTitle, exact: true }).click();
      await page.getByRole('heading', { name: `${destination.moduleTitle} glossary`, exact: true }).waitFor();
      assert.equal(await page.getByLabel('Search terms').inputValue(), linked.term);
      await page.getByText(linked.term, { exact: true }).waitFor();
      console.log('PASS related-area glossary navigation');
    }
    assert.deepEqual(errors, [], 'browser runtime errors');
    console.log(`Passed ${answered} real case answers, knowledge scoring, glossary filtering and mobile layout.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
