# English Tutor — project case study

**Author:** Vadym Sherstiak
**Type:** Independent personal project; AI-assisted product development
**[Live demo](https://shved21.github.io/english-tutor/)** · **[Sample lesson](https://shved21.github.io/english-tutor/daily_task_app/index.html)** · **[Source](https://github.com/shved21/english-tutor)**

## Problem and motivation

I wanted English practice that fits my interests and available time, with a clear next action. My goal is practical B2 communication for interviews, personal projects, and everyday life. I wanted to practise through useful topics such as career decisions and work habits, while producing my own sentences and preparing for conversation.

## My contribution

I defined the learning goal, topic priorities, practice constraints, and feedback requirements. I used the project personally and requested changes to instructions and lesson flow. GPT/Codex helped author the content, prompts, and application code. This is an example of defining and refining an AI-assisted product; the code alone does not establish independent programming proficiency or commercial engineering experience.

## Current product

The public prototype has a 50-session roadmap and one detailed Day 14 lesson. The lesson moves through reading, sentence writing, phrase selection and practice, an answer draft, speaking preparation, and a copied prompt for ChatGPT Voice. Instructions are primarily Ukrainian and practice is in English. A short English guide helps a visitor try a writing exercise.

The app is static HTML, CSS, and vanilla JavaScript. Local rules check supported answer patterns. Browser storage holds challenge checklists and lesson drafts. The Voice conversation is started manually in ChatGPT; there is no LLM API, audio capture, or transcript import in the public app.

## A concrete iteration: making the sample usable from a portfolio link

Before the September 2026 portfolio update, the main call to action opened the first roadmap mission, while every trainer link led to Day 14 without clearly explaining the mismatch. The trainer also lost written answers on refresh.

The update added a direct sample-lesson entry, visible lesson coverage, navigation back to the roadmap, and an English first-visit guide. Draft recovery now preserves writing, phrase choices, practice fields, and the current step in this browser. Feedback is deliberately recalculated after reload. A fixed 28% bar in the sample was replaced with a lesson-position label because the number was not learner evidence.

Implementation checks cover malformed or unavailable storage. Typed answers are escaped before appearing in the answer support panel. A browser walkthrough checks refresh recovery, explicit answer feedback, the Voice copy action, and a mobile viewport. These are observed software behaviors, not measured learning gains. The [verification record](verification.md) documents the checks.

## Scope and trade-offs

A static deployment makes the sample easy to inspect without an account or API key. The trade-off is limited answer checking and a manual handoff to ChatGPT. The route's completion and XP are self-reports. The prototype has not demonstrated external use, learning gains, or a B2 outcome.

The next product decisions are broader lesson coverage, explicit export of drafts and session evidence, and better treatment of valid answers the rules cannot recognize. An API-connected version would require its own implementation and evaluation.
