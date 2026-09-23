# Day 14 sample trainer

This is the public static lesson for English Tutor. It contains eight screens with English practice and Ukrainian instructions. It is maintained directly in these files; the separate private authoring workspace is not required to run it.

## Run and inspect

From the repository root:

```sh
python3 -m http.server 8766
```

Open [the sample](http://127.0.0.1:8766/daily_task_app/index.html), or use the [live version](https://shved21.github.io/english-tutor/daily_task_app/index.html).

- `index.html`: lesson text, guided answer fields, speaking support, and the copyable Voice prompt.
- `app.js`: writing and phrase pools, explicit checks, eight-step navigation, and repair checklist.
- `styles.css`: desktop and responsive layout.
- `draft-store.js`: versioned local draft validation and storage failure handling.
- `session.js`: binds rendered fields to draft storage and restores the lesson step without replaying feedback.
- `qa_check.mjs`: existing content and checker checks.
- `test_drafts.mjs`: storage round trips, invalid data, and unavailable storage.
- `useful_leisure_mobile.html`: an earlier standalone exercise, retained as historical material and not linked from the current sample.

## Data and feedback

The lesson saves writing, phrase selection, practice answers, and the current step under `english-tutor-work-mindset-day-14-draft-v1` in browser `localStorage`. Repair checkboxes use their existing separate key. The roadmap uses its own key. Nothing is sent to a server by the app. Drafts are specific to this browser and site address; clearing site data removes them. On a shared device, remember that saved drafts remain accessible there.

Changing a phrase selection rebuilds the practice cards; saved answers are matched by phrase so they can be recovered when the phrase returns. Reloading never recreates accepted feedback or awards progress. If storage is blocked or full, the current exercise remains usable and the page warns that the draft could not be saved.

The checker is a set of local heuristics and accepted patterns. It can reject a valid paraphrase or miss a mistake. Its feedback is not a complete language assessment. Checks run only after an explicit action. The Voice prompt asks for an adaptive dialogue, but the conversation runs in ChatGPT and its behavior is outside this app's control.

## Checks

```sh
node --check daily_task_app/app.js
node --check daily_task_app/session.js
node daily_task_app/qa_check.mjs
node daily_task_app/test_drafts.mjs
node scripts/check-links.mjs
```

See the [browser verification record](../docs/verification.md). Test with neutral data, separately from personal learning records.
