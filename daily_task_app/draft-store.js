/* Local drafts only. This module never records completion or sends network requests. */
(function (root) {
  "use strict";
  const KEY = "english-tutor-work-mindset-day-14-draft-v1";
  const empty = () => ({ version: 1, step: 0, writingCount: 10, drillCount: 5, fields: {} });
  function sanitize(value) {
    const draft = empty();
    if (!value || value.version !== 1) return draft;
    for (const [key, max] of [["step", 7], ["writingCount", 50], ["drillCount", 30]]) {
      if (Number.isInteger(value[key]) && value[key] >= 0) draft[key] = Math.min(max, value[key]);
    }
    if (value.fields && typeof value.fields === "object" && !Array.isArray(value.fields)) {
      for (const [key, field] of Object.entries(value.fields).slice(0, 200)) {
        if (!/^(writing|phrase|drill|activation|story|mission|answer):\d+$/.test(key)) continue;
        if (typeof field === "boolean" || typeof field === "string") {
          draft.fields[key] = typeof field === "string" ? field.slice(0, 20000) : field;
        }
      }
    }
    return draft;
  }
  function read(storage) {
    try { return sanitize(JSON.parse(storage.getItem(KEY))); }
    catch { return empty(); }
  }
  function write(storage, draft) {
    try { storage.setItem(KEY, JSON.stringify(sanitize(draft))); return true; }
    catch { return false; }
  }
  const api = { KEY, sanitize, read, write };
  root.TutorDraftStore = api;
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
