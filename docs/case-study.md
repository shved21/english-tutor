# English Tutor: Case Study

## One-Line Summary

English Tutor is a small learning product that turns a daily English topic into a measurable path from understanding to usable speech.

## Context

The learner's main difficulty was not a lack of English content. It was the gap between recognizing a phrase and using it while speaking under pressure.

Random conversation practice produced repeated grammar errors, weak sentence structure, and little evidence of progress. A useful solution needed to be finite, personalized, interactive, and focused on output.

## Product Decision

The system is split into two layers:

1. A 50-day challenge layer that creates momentum and shows the whole route.
2. A detailed trainer that turns one daily idea into writing, correction, phrase reuse, and speaking preparation.

This separation keeps the overview motivating without making the detailed lesson feel like a long unstructured document.

## Core Learning Loop

```text
input -> comprehension -> sentence reconstruction -> feedback -> full answer -> adaptive dialogue -> evidence
```

Each step has a job:

- **Input** supplies useful meaning, not isolated vocabulary.
- **Reconstruction** makes the learner produce the target structure.
- **Feedback** identifies the most important next correction instead of demanding an exact answer.
- **Full answer** connects small sentences into a coherent thought.
- **Adaptive dialogue** tests whether the language survives a real conversation.
- **Evidence** makes progress visible and informs future repair practice.

## Interaction Design

The interface uses a quest/deck flow rather than one endless lesson page. One task is active at a time, with a clear next action and a visible finish condition.

Important interaction rules include:

- hints stay hidden until requested;
- typing does not trigger unwanted correction;
- feedback appears only after an explicit check;
- multiple good versions can be accepted;
- additional practice comes from a finite daily pool;
- the speaking prompt acts as an interviewer and keeps an adaptive conversation rather than reading a fixed list.

## Technical Implementation

The project is a static HTML, CSS, and JavaScript application. It uses no framework and no backend for the learning prototype.

- `data.js` stores the 50-day route;
- `app.js` manages challenge state and progression;
- `daily_task_app/app.js` powers the detailed trainer;
- browser `localStorage` preserves local progress;
- `qa_check.mjs` validates key writing and semantic-checker behavior.

The low-dependency approach keeps the prototype easy to run, inspect, and deploy as a static site.

## Why This Is More Than a Flashcard App

The product treats language as a skill performed in context. It does not only ask whether the learner remembers a word. It asks whether the learner can:

- understand an idea;
- rebuild a sentence;
- correct a meaningful attempt;
- connect several sentences;
- answer follow-up questions;
- keep speaking when the exact phrase is missing.

## What I Would Build Next

- persistent session records with privacy-safe exports;
- speech-to-text comparison for recorded answers;
- stronger spaced review based on actual errors;
- a recruiter-facing demo mode;
- analytics that show improvement in clarity, structure, and repair patterns.
