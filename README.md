# English Tutor

English Tutor is a personal English-learning project for practical B2 communication in IT interviews, personal projects, and everyday conversation.

**[Open the web app](https://shved21.github.io/english-tutor/)** · **[Try the published sample lesson](https://shved21.github.io/english-tutor/daily_task_app/index.html)**

## Program view

The home page shows the kickoff session (Day 0) and the 50-day Work Mindset plan in one list. Every card shows its day number, English topic, Ukrainian topic translation, and a rating field. Open a card for the control question, language focus, task, and expected result. Future days display a lock and cannot be opened.

The public snapshot is at **Day 30 as of 2026-09-25**. Cards for Days 0–30 expose their *plan descriptions*; their availability does not mean the lessons were completed. Ratings are shown only when a result for that particular day is supported by a learner record. The current public snapshot has no such per-day ratings, so these cards say **“Немає запису”**. The browser cannot create grades by opening pages or clicking buttons.

The only full interactive lesson in this public repository is **Day 14**. Its card links directly to the trainer. Other cards currently show detailed plan descriptions. Local materials from the personal learning workspace are not automatically published or synchronized to GitHub Pages.

## Sample lesson

The Day 14 trainer has eight guided steps: context and text, sentence reconstruction, phrase selection, phrase dialogue, own answer, brief rehearsal, Voice preparation, and summary. It includes Ukrainian support, local answer checks, hidden hints, and draft recovery in this browser. The Voice conversation itself happens separately in ChatGPT.

## Technical structure

The web app uses HTML, CSS, and vanilla JavaScript on GitHub Pages. No account, backend, API key, or learner journal is published.

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Program list and day details |
| `data.js` | 50-day curriculum |
| `progress.js` | Public snapshot: current position and evidence-backed ratings |
| `daily_task_app/` | Published Day 14 trainer |
| `docs/` | Project notes and earlier portfolio screenshots |

To preview locally:

```bash
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/`.

The project does not call an LLM API or generate lessons automatically in the browser. In the personal workflow, GPT/Codex helps draft and revise learning materials separately. The app does not import Voice transcripts or infer learning progress from navigation.

## Verification

```bash
node --check app.js
node scripts/test-program.mjs
node scripts/check-links.mjs
node daily_task_app/qa_check.mjs
node daily_task_app/test_drafts.mjs
```

## Current limits

- Only Day 14 has a published interactive trainer. Other available cards show the curriculum description.
- No confirmed per-day ratings are present in the public snapshot.
- The public snapshot is updated manually; GitHub Pages does not sync with the local learning workspace.
- The trainer's rule-based checker cannot assess every valid English sentence or live speech.

See [project background](docs/case-study.md) and [verification notes](docs/verification.md) for more detail.
