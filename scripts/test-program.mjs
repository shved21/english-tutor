import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = name => readFile(new URL(`../${name}`, import.meta.url), 'utf8');
const [data, progress, app] = await Promise.all([read('data.js'), read('progress.js'), read('app.js')]);
const declarations = `${data}\n${progress}\n${app.split("const list = document.getElementById('day-list');")[0]}\n({ allDays, topicUk, questionUk, detailsUk, today, publicProgress })`;
const { allDays, topicUk, questionUk, detailsUk, today, publicProgress } = vm.runInNewContext(declarations);

assert.equal(allDays.length, 51, 'Day 0 plus Days 1–50');
assert.deepEqual(Array.from(allDays, day => day.day), Array.from({ length: 51 }, (_, day) => day));
assert.equal(topicUk.length, 51, 'Every day has a Ukrainian topic');
assert.equal(questionUk.length, 51, 'Every day has a Ukrainian question');
assert.equal(detailsUk.length, 31, 'Every open day has Ukrainian detail translations');
assert.equal(today, 30, 'Public position matches the reviewed local current lesson');
assert.equal(allDays[30].topic, 'Debating My Attention Protocol');
assert.equal(allDays[14].topic, 'Stress: mobilization or paralysis');
assert.deepEqual(Object.keys(publicProgress.ratings), [], 'No unsupported public grades');
console.log('Program data passed: Days 0–50, translations, current day, and grades.');
