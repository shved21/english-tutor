import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const store = require("./draft-store.js");
let saved;
const storage = { getItem: () => saved, setItem: (_, value) => { saved = value; } };
const draft = { version: 1, step: 4, writingCount: 11, drillCount: 8,
  fields: { "writing:0": "A little pressure helps me focus.", "phrase:2": false,
    "answer:0": "<img src=x onerror=alert(1)>", "drill:4": "My own answer." } };
assert.equal(store.write(storage, draft), true);
assert.deepEqual(store.read(storage), draft);
assert.equal(store.read(storage).fields["answer:0"], "<img src=x onerror=alert(1)>", "Draft text must remain plain data");
saved = "{broken";
assert.equal(store.read(storage).step, 0);
saved = JSON.stringify({ version: 9, fields: { "writing:0": "old" } });
assert.deepEqual(store.read(storage).fields, {});
assert.deepEqual(store.sanitize({version:1,step:999,writingCount:-1,fields:{"constructor":"bad","writing:0":42,"phrase:0":false}}),
  {version:1,step:7,writingCount:10,drillCount:5,fields:{"phrase:0":false}});
const denied = { getItem() { throw Error("blocked"); }, setItem() { throw Error("quota"); } };
assert.equal(store.read(denied).step, 0);
assert.equal(store.write(denied, draft), false);
assert.equal(store.write(undefined, draft), false);
console.log("Draft tests passed: round trip, schema, corrupt storage, and unavailable storage.");
