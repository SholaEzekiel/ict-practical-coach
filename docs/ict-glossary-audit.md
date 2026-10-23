# ICT Glossary and Practice Audit

## Source Review

The user supplied `ICT GLOSSARY.zip`, containing 34 photographed images of coursebook glossary pages 565-582. All images were processed locally. Most pages have two overlapping photographs; the first and last have one. The original photographs and temporary OCR output are not published with the application.

`ictGlossarySourcePhotos` in `src/lib/ict-coursebook-glossary.ts` records every photograph and its page. Each reviewed entry records its page, primary study area, study topic, definition and relevant aliases. The import contains 673 reviewed source entries; synonyms and repeated headings are consolidated when the live glossaries are assembled.

Definitions are concise paraphrases, not unchecked OCR. Context-dependent terms remain distinct: spreadsheet cell versus cellular coverage cell; database orphan versus layout orphan; document bookmark versus web bookmark; spreadsheet function versus program/database function.

Source inaccuracies have not been reproduced. Examples include the source's gridlines/guidelines confusion, claims that ordinary FTP is secure, HTTP described as page formatting, a certificate implying trustworthiness, NFC implying all devices need no power, and compressed data implying all discarded information can be restored. Memory-unit wording distinguishes decimal and binary prefixes. Validation is distinguished from proof of accuracy, and verification from validation.

## Allocation

Terms are assigned to the project's existing theory areas: computer systems, input/output, storage, networks, social/economic effects, applications, systems life cycle, safety/security and communication. Practical vocabulary belongs in Word Processing, Presentations, Spreadsheets, Databases, Web Authoring or the added Image Editing theory area. These are project study areas, not a claim that application numbers are official syllabus chapter numbers.

Shared concepts have explicit related-area links. For example, validation is available in systems analysis, databases and spreadsheets; copyright and personal-data vocabulary also appear in the social/economic area. Source entries are not counted as new unique concepts each time they are cross-linked.

The resulting bank currently has 761 module-level glossary placements, including existing terms and related-area placements, 1,572 knowledge MCQs and 90 case-study questions. The case bank has 30 independently written scenarios, two per study area, with three questions each. Case choices address the scenario and provide explanatory feedback rather than recycled advice. Existing repeated manual questions are removed by question text within a module.

Glossaries have search (including aliases), topic filters and related-area links. Knowledge MCQs can be filtered into smaller topics. Case practice is separate; its scenario remains visible, cases are shuffled as groups, and each case's questions keep their sequence. Existing answer-option shuffling is retained.

## Spreadsheet Teaching

Division is introduced in Basic Formulae before copying and absolute-reference practice. First introductions may demonstrate a complete formula. Later practice in multiplication, SUM, AVERAGE, absolute references and discounts asks students to construct it from named inputs and operations instead.

The absolute-reference task explains that the dollar signs lock the referenced column and row, names G4 as the destination, asks for Drama sold divided by total sold, and identifies which reference remains relative. The discount task names F22 first, explains 0.15 as 15%, describes the remaining payable fraction, and tells students not to overwrite H25. The complete answer remains in validation data, not the practice steps.

## Regression Checks

- `scripts/test-ict-curriculum.cjs`: every source photo/page and source-to-study-area mapping; aliases, related links, unique question IDs/text, four distinct options, case ownership and complete feedback.
- `scripts/test-ict-browser.cjs`: search/no-results/topic filters, all 90 case answers, topic-filtered knowledge scoring, navigation and mobile overflow.
- `scripts/test-spreadsheet-validation.cjs`: all 48 formula contracts, negative results, shared-formula resolution, starter policy and guidance without complete later answers.
- `scripts/test-spreadsheet-browser.cjs`: real Univer calculation, autofill, source updates and rejection of manually typed results.

Browser scripts require Playwright (available in the Codex runtime via `NODE_PATH`) and Chrome, and use `TEST_URL` for a running local or deployed application. `TEST_MODULE` limits a browser run to one study area.
