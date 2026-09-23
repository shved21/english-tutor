# English Tutor

English Tutor is a personal prototype for structured English practice around career decisions, personal development, and everyday challenges. I built it to make each session clear and relevant: know what to do next, practise useful language, and prepare for a conversation.

The current version combines a **50-session learning roadmap with one fully worked lesson**. The lesson guides the learner through reading, writing, phrase practice, and preparation for a separate ChatGPT Voice conversation.

My learning goal is practical B2 communication for IT interviews, personal projects, and everyday life.

**[Try the live demo](https://shved21.github.io/english-tutor/)** · **[Open the sample lesson](https://shved21.github.io/english-tutor/daily_task_app/index.html)** · [Project story](docs/case-study.md)

## Why I built it

I wanted an English-learning routine that fits my interests, goals, and available time. Practising with topics I already care about makes the language useful during the session itself: I can explore a career decision or personal challenge while working on how to express it in English.

The intended experience has a manageable daily minimum and room for more practice when I have the time and energy. I use the project personally and continue to refine its instructions and learning flow based on that experience.

## Explore the prototype

Use the live demo above, or start the project locally using the instructions below:

1. Open the [detailed trainer](https://shved21.github.io/english-tutor/daily_task_app/index.html) to try the worked lesson for **Day 14: useful pressure and freezing under stress**.
2. Read the English text, reveal the Ukrainian translation if needed, and complete a guided writing exercise.
3. Check your answer, practise selected phrases, and build a longer response.
4. Copy the provided prompt into a separate ChatGPT Voice conversation for speaking practice.

To explore the broader learning plan, open the [challenge page](index.html). It contains 50 missions across 10 phases. Each mission has four actions to mark complete manually; later missions unlock as earlier ones are completed. All mission links currently lead to the same Day 14 lesson.

## What is implemented

| Component | Current functionality |
| --- | --- |
| Learning roadmap | 50 Work Mindset topics across 10 phases, sequential mission unlocking, and manually checked actions. |
| Challenge progress | Completed actions, XP, and achievements stored in the browser using `localStorage`. |
| Detailed lesson | Eight guided screens covering reading, sentence reconstruction, phrase selection and practice, answer building, speaking preparation, a Voice prompt, and a final phrase reference. |
| Writing feedback | Local JavaScript checks supported sentence patterns and selected meaning-preserving alternatives when the learner checks an answer. |
| Practice support | Hidden hints, a finite writing pool, and a repair phrase checklist. |
| Draft recovery | Writing, phrase choices, practice drafts, and the current lesson step restored from this browser after refresh. Automatic feedback is checked again. |
| Speaking handoff | A copyable prompt for continuing practice in ChatGPT Voice. |

## Screenshots

The main page offers direct access to the sample and the learning route.

![Entry to the sample lesson and learning roadmap](docs/screenshots/01-route.jpg)

Each mission presents a small set of actions to complete.

![A daily mission and its actions](docs/screenshots/02-mission.jpg)

The detailed trainer supports writing practice and preparation for speaking.

![A real writing attempt with feedback](docs/screenshots/03-trainer.jpg)

Speaking support and the separate Voice handoff:

![Speaking preparation](docs/screenshots/04-speaking.jpg)

The same lesson on a mobile viewport:

<img src="docs/screenshots/05-mobile.jpg" alt="Sample lesson header in the mobile layout" width="240">

## Technical structure

The public app uses **HTML, CSS, and vanilla JavaScript**. It runs as static pages without a framework, backend, account, or API key. Python is used only for the optional local server described below.

| Path | Purpose |
| --- | --- |
| `index.html`, `app.js`, `data.js` | Challenge interface, roadmap data, and browser state. |
| `daily_task_app/` | Day 14 lesson, prompts, and local answer checks. |
| `docs/` | Portfolio notes and screenshots. |

The app does not call an LLM API or generate lessons automatically. In my personal workflow, I use GPT/Codex separately to help prepare and revise learning materials. Speaking, any transcript, and the final reflection take place in ChatGPT; the app does not launch Voice or import its results.

The lesson includes [content and checker QA](daily_task_app/qa_check.mjs) and [draft storage tests](daily_task_app/test_drafts.mjs). See [verification notes](docs/verification.md) for commands and browser checks, and the [trainer guide](daily_task_app/README.md) for implementation details.

## Run locally

With Python 3 installed, run this command from the repository root:

```bash
python3 -m http.server 8766
```

Then open:

- [Challenge roadmap](http://127.0.0.1:8766/index.html)
- [Day 14 detailed trainer](http://127.0.0.1:8766/daily_task_app/index.html)

The optional speaking activity requires a separate ChatGPT conversation with Voice available.

## My contribution and AI-assisted development

My contribution has focused on defining the learning problem, setting requirements, and refining the learning experience through personal use.

I chose the topic priorities, defined the practice constraints and desired feedback, and iterated on the instructions and session flow. GPT/Codex assisted with lesson content, prompts, and software implementation.

The project documents my work on product requirements, learning workflows, and the review of AI-assisted outputs. The portfolio release also adds a direct sample entry, browser draft recovery, and desktop/mobile verification. See [CV and LinkedIn copy](docs/portfolio-copy.md) for a concise project description. Further design context is available in the [case study](docs/case-study.md) and [short presentation](docs/presentation.md).

## Current limitations

- **Lesson coverage:** the roadmap contains 50 planned sessions, while the detailed trainer implements one lesson.
- **Feedback coverage:** the rule-based checker supports a limited set of answers. It cannot assess every valid sentence or live speech.
- **Saved data:** the challenge saves progress locally in the browser. The trainer now saves written drafts, selected phrases, the current step, and repair checklist selections in the same browser. It does not import Voice records or sync between devices. Clearing site data removes these drafts.
- **Evidence of progress:** completion, XP, and achievements reflect self-reported activity. The project has no demonstrated external use or measured learning gains; B2 remains a learning goal.

## Next improvements

1. Add more detailed lessons and connect them to the corresponding roadmap missions.
2. Add an explicit export for drafts and manually supplied session evidence.
3. Use observed mistakes to improve review and exercise coverage.

These are planned improvements, not current features.
