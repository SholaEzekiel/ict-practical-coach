const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, filename);
const { ictTheoryModules } = require('../src/lib/ict-theory-data.ts');
const { ictCaseStudies } = require('../src/lib/ict-case-study-data.ts');
const { ictCoursebookGlossary, ictGlossarySourcePhotos, ictTermKey } = require('../src/lib/ict-coursebook-glossary.ts');
const photos = ictGlossarySourcePhotos.flatMap(page => page.files);
assert.equal(photos.length, 34);
assert.equal(new Set(photos).size, 34);
assert.deepEqual(ictGlossarySourcePhotos.map(page => page.page), Array.from({ length: 18 }, (_, index) => 565 + index));
for (const page of ictGlossarySourcePhotos) assert(ictCoursebookGlossary.some(entry => entry.sourcePages.includes(page.page)), 'Unreviewed page ' + page.page);
for (const source of ictCoursebookGlossary) {
  const module = ictTheoryModules.find(module => module.id === source.moduleId);
  assert(module, source.term + ': missing unit/application');
  const names = new Set([source.term, ...(source.aliases || [])].map(ictTermKey));
  const mapped = module.glossary.find(entry => [entry.term, ...(entry.aliases || [])].some(name => names.has(ictTermKey(name))));
  assert(mapped, source.term + ': missing mapped glossary entry');
  assert(mapped.sourcePages?.some(page => source.sourcePages.includes(page)), source.term + ': missing provenance');
  assert(source.definition.trim().length >= 20 && source.topic, source.term + ': incomplete definition/topic');
}
const ids = new Set();
let knowledge = 0, caseQuestions = 0, placements = 0;
for (const module of ictTheoryModules) {
  const names = new Set();
  placements += module.glossary.length;
  for (const entry of module.glossary) {
    const key = ictTermKey(entry.term);
    assert(!names.has(key), module.id + ': duplicate term ' + entry.term);
    names.add(key);
    for (const id of entry.alsoStudyIn || []) assert(ictTheoryModules.some(other => other.id === id), 'Broken related-topic link ' + id);
  }
  const questions = new Set();
  for (const question of module.quiz) {
    assert(!ids.has(question.id), 'Repeated question ID ' + question.id);
    ids.add(question.id);
    assert(!questions.has(question.question), module.id + ': repeated question ' + question.question);
    questions.add(question.question);
    assert.equal(question.options.length, 4, question.id);
    assert.equal(new Set(question.options.map(option => option.toLowerCase().trim())).size, 4, question.id + ': duplicate options');
    assert(question.correctIndex >= 0 && question.correctIndex < 4, question.id);
    assert(!question.options.some(option => /needs evidence from the scenario|relevant case evidence|lowest-risk approach/i.test(option)), question.id + ': placeholder option');
    if (question.caseStudy) {
      caseQuestions++;
      assert(question.caseStudy.scenario.length > 100 && question.feedback.length > 40, question.id + ': incomplete case/feedback');
      assert(ictCaseStudies.some(study => study.id === question.caseStudy.id && study.moduleId === module.id), question.id + ': cross-unit case');
    } else knowledge++;
  }
  assert.equal(module.quiz.filter(question => question.caseStudy).length, 6, module.id + ': case coverage');
}
assert.equal(ictCaseStudies.length, 30);
assert.equal(caseQuestions, 90);
console.log(`Passed: ${photos.length} source photos, ${ictCoursebookGlossary.length} source entries, ${placements} module placements, ${knowledge} knowledge MCQs and ${caseQuestions} case questions across ${ictTheoryModules.length} study areas.`);
