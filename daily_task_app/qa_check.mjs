import fs from "node:fs";
import vm from "node:vm";

const root = new URL(".", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");
const failures = [];

const fail = (message) => failures.push(message);

const makeStub = () => ({
  dataset: { taskTitle: "test" },
  classList: { toggle() {} },
  style: {},
  addEventListener() {},
  appendChild() {},
  querySelector() { return makeStub(); },
  querySelectorAll() { return []; },
});

const source = read("app.js") + "\nthis.__qa = { validateSentence, writingPool, repairBank, takeWritingItems };";
const context = {
  document: {
    querySelector() { return makeStub(); },
    querySelectorAll(selector) { return selector === ".quest-step" ? [makeStub()] : []; },
    createElement() { return makeStub(); },
  },
  window: { scrollTo() {} },
  navigator: { clipboard: { writeText: async () => {} } },
  console,
  Set,
  Array,
  Math,
  RegExp,
};

vm.runInNewContext(source, context);
const { validateSentence, writingPool, repairBank, takeWritingItems } = context.__qa;

const firstWritingBatch = takeWritingItems(0, 10);
const secondWritingBatch = takeWritingItems(firstWritingBatch.length, 20);
if (firstWritingBatch.length !== Math.min(10, writingPool.length)) {
  fail("Writing exercise must open with a finite batch of up to ten rows");
}
if (firstWritingBatch.length + secondWritingBatch.length !== writingPool.length) {
  fail("Adding more writing rows must consume the finite pool without losing or repeating rows");
}
if (new Set(writingPool.map((item) => item.ua)).size !== writingPool.length) {
  fail("Writing pool contains duplicate Ukrainian prompts");
}

for (const [index, item] of writingPool.entries()) {
  for (const example of item.examples) {
    const result = validateSentence(example, item);
    if (!result.ok) fail(`Writing row ${index + 1} rejects its own example: ${example}`);
  }
}

const flexibleItem = writingPool.find((item) => item.ua.startsWith("Невеликий тиск"));
const flexibleVersion = "Some pressure gives me direction, while excessive pressure makes it harder to act.";
if (!validateSentence(flexibleVersion, flexibleItem).ok) {
  fail("Meaning-preserving alternative was rejected for the current lesson");
}

const scopeItem = writingPool.find((item) => item.ua.startsWith("Корисний тиск"));
const scopeVersion = "Pressure can point me toward action, while panic makes every option feel impossible.";
if (!validateSentence(scopeVersion, scopeItem).ok) {
  fail("Natural alternative was rejected for the scope sentence");
}

const html = read("index.html");
const css = read("styles.css");
const answerAssemblyQuestions = (html.match(/class="qa-card(?:\s|\")/g) || []).length;
if (!html.includes('data-task-id="pre_voice_questions"')) {
  fail("Answer assembly task is missing its stable task id");
}
if (answerAssemblyQuestions !== 6) {
  fail(`Story lab must contain six guided sentence slots, found ${answerAssemblyQuestions}`);
}
if (!html.includes('id="full-answer"') || !html.includes('id="check-full-answer"')) {
  fail("Answer assembly is missing the full-answer draft or explicit check action");
}
if ((html.match(/class="qa-card(?:\s|\")[\s\S]*?<details>/g) || []).length !== 6) {
  fail("Each story slot must have a hidden hint");
}
if (html.includes("Використай, щоб:")) {
  fail("Phrase cards still expose repetitive usage metadata");
}
if (!html.includes('id="repair-bank"') || !html.includes('id="repair-progress"')) {
  fail("Evidence-backed repair bank is missing from the final page");
}
if (repairBank.length !== 8 || repairBank.some((item) => !item.id || !item.answer || !item.source)) {
  fail("Repair bank must contain eight sourced, usable repair items");
}
if (!html.includes("Якщо завис") || !html.toLowerCase().includes("відкрий фразу")) {
  fail("Question-specific repair hints are missing or too generic");
}
if (!html.includes("Місія: використати фрази") || !html.includes("conversation_state")) {
  fail("Phrase transfer mission or Voice continuity rules are missing");
}
if (!html.includes("Personal Story Lab") || !html.includes("data-qa-groups") || !source.includes("qaGroupMatches")) {
  fail("Personal Story Lab constructor or semantic slot checker is missing");
}
if (!html.includes("When does pressure help me") || !html.includes("whereas") || !html.includes("rather than")) {
  fail("Day 14 topic or grammar contrast is missing from the page");
}
if (!html.includes('id="writing-status"') || !html.includes("Сьогодні все")) {
  fail("Writing exercise is missing its exhausted-pool status");
}
if (!html.includes('data-more-writing="20"')) {
  fail("Writing exercise is missing its capped add-all control");
}
if (source.includes("writingPool[writingCursor % writingPool.length]")) {
  fail("Writing rows still wrap around and can repeat after the pool is exhausted");
}
if (!source.includes('class="writing-hint"') || !source.includes('class="hint-content"')) {
  fail("Writing hints are not explicitly hidden behind the hint control");
}
if (!html.includes('id="mission-phrase-bank"') || (html.match(/class="mission-card"/g) || []).length !== 3) {
  fail("Phrase transfer mission must contain one phrase bank and three distinct situations");
}
if (!source.includes("validateActivation") || !source.includes("checkMission") || !source.includes("renderMissionPhraseBank")) {
  fail("Phrase transfer mission is missing its semantic checker or phrase-bank wiring");
}
if (source.includes("source[drillCursor % source.length]")) {
  fail("Phrase trainer still wraps around and can repeat phrases after the finite pool is exhausted");
}
if (!html.includes('id="drill-status"') || !source.includes("Сьогодні все — кожна вибрана фраза")) {
  fail("Phrase trainer is missing its finite exhausted-state status");
}
if (!css.includes(".writing-hint .hint-content") || !css.includes("filter: blur")) {
  fail("Writing hints are not blurred before opening");
}
if (source.includes('if (input.value.trim()) runCheck()')) {
  fail("Writing inputs still validate while the user is typing");
}
if (source.includes('input.addEventListener("input", runCheck)')) {
  fail("A phrase input still validates on every keystroke");
}
if (source.includes("Ця фраза потрібна, щоб") || !source.includes("phraseGrammarHelp") || !source.includes("phraseWordHelp")) {
  fail("Phrase drills still use the generic explanation instead of construction-specific word and grammar help");
}

if (failures.length) {
  console.error("English Tutor daily page QA failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`English Tutor daily page QA passed: ${writingPool.length} writing rows and semantic checker cases.`);
