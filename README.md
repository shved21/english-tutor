# English Tutor

English Tutor is a personal project for practising English that I can use in IT interviews, personal projects, and everyday conversations. My goal is practical B2 communication; the project does not demonstrate that I have reached B2.

## Why I built it

I wanted practice connected to subjects I already care about: work, career decisions, personal development, and everyday challenges. A focused daily task is easier for me to return to than an open-ended study plan. The intended routine has a manageable minimum and leaves room for a longer conversation when I have the time and energy. I refine the flow through personal use and feedback.

## How to use this version

The public repository contains two linked interfaces. The [challenge page](index.html) shows a 50-session Work Mindset route. Choose a mission, follow its four actions, and mark them done yourself. The [detailed trainer](daily_task_app/index.html) is a **single worked lesson for Day 14**, about useful pressure and freezing under stress. Challenge missions all link to this same lesson; the repository does not contain 50 detailed lessons.

In that lesson, read the English text and reveal the Ukrainian translation if needed. Write sentences from guided Ukrainian prompts, check them, choose and practise phrases, then build a longer answer. The page provides a prompt to copy into a **separate ChatGPT Voice conversation**. Speaking, any transcript, and the final reflection happen outside the app; the page neither starts Voice nor imports its results.

In my personal workflow, I also use GPT/Codex in chat to help prepare and revise learning material. This public bundle is a static snapshot of the interface and lesson. Its JavaScript does not call an LLM API or generate a new lesson on its own.

## What is implemented

- The challenge shows all 50 topics across 10 phases, locks later missions until earlier ones are marked complete, and stores the user's checked steps, XP, and achievements in browser `localStorage`. These are self-reported interface indicators, not measured English ability.
- The Day 14 trainer has eight guided screens: context and reading, sentence reconstruction, phrase selection, phrase practice, answer building, speaking preparation, a copyable Voice prompt, and a final phrase reference. It offers hidden hints and finite additional writing practice.
- Local JavaScript checks known sentence patterns and some meaning-preserving alternatives when the learner presses a check button. It provides feedback for the supported exercises; it cannot judge every valid answer or assess live speech.
- The trainer includes a repair phrase list with checkboxes. Only those checkbox selections persist in its browser storage; written drafts and Voice records are not saved by this public version.
- [`daily_task_app/qa_check.mjs`](daily_task_app/qa_check.mjs) checks parts of the sample lesson, including the finite writing pool and accepted examples. It is a code check, not evidence of learning outcomes.

## Product flow

![The 50-day route](docs/screenshots/01-route.png)

![A daily mission](docs/screenshots/02-mission.png)

![The detailed writing and speaking trainer](docs/screenshots/03-trainer.png)

## Technical structure and local run

```text
index.html + app.js + data.js    Challenge route and browser state
daily_task_app/                 Day 14 lesson, prompts, and local checks
docs/                           Portfolio notes and screenshots
```

The static pages use HTML, CSS, and vanilla JavaScript. They need no framework, backend, account, or API key to run. Python 3 is used below only to serve the files locally. The optional ChatGPT Voice conversation takes place in ChatGPT.

From the repository root:

```bash
python3 -m http.server 8766
```

Open:

- `http://127.0.0.1:8766/index.html` for the 50-day challenge;
- `http://127.0.0.1:8766/daily_task_app/index.html` for the detailed trainer.

## My contribution and AI assistance

I set the learning goal, topic priorities, practice constraints, and the kind of feedback I wanted. I have iterated on the instructions and product flow while using the project. GPT/Codex has assisted with lesson content, prompts, and software implementation. This repository shows the resulting prototype, not that I independently wrote every JavaScript component. The [case study](docs/case-study.md) and [short presentation](docs/presentation.md) give more design context.

## Current limits and next improvements

This is a personal prototype, with no demonstrated external use or measured learning gains. The public trainer covers one detailed lesson; the 50-session route is a plan and navigation layer. Challenge completion is self-reported, and the rule-based checker has limited coverage. The next useful steps are to connect more detailed lessons to the route, preserve session evidence with appropriate privacy controls, and use observed mistakes to improve review. Those capabilities are not implemented in this public version.

The project does not replace a teacher or verify a CEFR level. B2 remains my learning goal.
