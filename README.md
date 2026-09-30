# English Tutor

**[Open English Tutor](https://shved21.github.io/english-tutor/)**

A personal English-learning program for practical B2 communication in IT interviews, projects, and everyday conversation.

## Program

The page keeps the kickoff as a separate **Start** card and numbers the 50 course days from 01 to 50. Cards use color only for state: green for learner-reported completion, red for unfinished or low-scoring days, and gray for locked days. A numeric score appears only when one is recorded; the current public snapshot has no numeric ratings.

The progress bar reflects the learner-reported completion of Days 1–29. Day 30 is the current unfinished lesson. This display does not add evidence-backed scores to the learning journal.

## Saved lesson material

- Day 14 and Day 30 have interactive trainers.
- Days 20 and 22–29 have full, read-only lesson pages.
- Other days remain in the curriculum list; their full lesson content is not currently in this public repository.

Opening or reading a lesson does not mark it complete. The browser keeps lesson drafts locally; this static site has no account or backend.

## Technical structure

The site uses HTML, CSS, and vanilla JavaScript on GitHub Pages. It does not call an LLM API or import the learner’s local journal.

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Minimal program overview and day cards |
| `data.js` | 50-day curriculum and translations |
| `progress.js` | Public completion snapshot and numeric ratings |
| `daily_task_app/` | Interactive trainers and saved lesson pages |

To preview locally:

```bash
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/`.
