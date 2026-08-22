# Daily Task App Standard

Current standards:

- **v1.07 - Visual Trainer Standard**
- **v1.08 - Interviewer Voice Prompt**
- **v1.10 - Quest Deck UI**
- **v1.11 - Meaningful Quest Tasks**
- **v1.12 - Mission and Trainer UX**
- **v1.14 - 50-Day Start Lab**

Every time the user asks for today's task, update `index.html` so the browser page works as a practical speaking trainer.

Visual mode:

- Use a quest/deck flow, not one long crowded page.
- Show one active task step at a time.
- Provide Back/Next navigation and progress.
- Every task step must have a stable `data-task-id`, a visible task title, and a short `Правила задачі` block.
- The current stage uses the eight-task contract in [`../lesson_program.md`](../lesson_program.md). The visual page must implement that contract rather than inventing a local sequence.
- The user should be able to refer to a specific task by id, for example `sentence_breakdown`, `phrase_trainer`, or `gpt_voice_prompt`.
- The first step should feel like a mission briefing: story context, win condition, English text, and hidden translation.
- Possible good versions in sentence breakdown must be meaningfully different, not 99% duplicates.
- Phrase selection must be a loadout task with semantic roles, not a passive list of micro-answers.
- User-facing pages should avoid unexplained English UX labels. If a concept is shown to the user, use clear Ukrainian or add the meaning directly.
- The first page must not be only a reading block. It should show the real situation, the trap, the working idea, and the concrete finish condition.
- When a content unit is active, show its unit day, phase, today's English skill, and today's concrete evidence item above the daily quest.
- The active Work Mindset unit uses four visible phases: `Зрозуміти -> Побудувати -> Сказати -> Перевірити`. Internal task ids may remain in HTML but are not user-facing labels.

Required page order:

1. Story context and control question.
2. One coherent English model text.
3. One full Ukrainian translation after the English text.
4. Sentence breakdown:
   - Ukrainian sentence;
   - target construction;
   - word bank;
   - input;
   - feedback after an explicit check;
   - possible good versions.
5. 30 micro-answers:
   - 10 required;
   - 10 useful;
   - 10 optional.
   - selectable into today's personal phrase set;
   - reused by the trainer and full-answer support.
6. Interactive phrase trainer:
   - Ukrainian cue;
   - input field;
   - check button;
   - hidden hint;
   - hidden answer.
   - compact rows instead of repeated card headings;
   - `Додати ще` adds another small batch and can start another recall round.
7. Answer assembly:
   - visible short questions;
   - hidden hint for every question;
   - one full-answer task that names the control question;
   - earlier drafts and selected phrases visible beside the textarea.
8. Practical cheat sheet:
   - answer route;
   - required phrases;
   - repair phrase list.
9. Copyable GPT Voice prompt aligned with the same questions and phrases.
10. Phrase table by question under the prompt.
11. Evidence-backed repair bank under the table. It shows recurring phrases from past speaking records, contextual help for today's questions, and a persistent `Вжив у Voice` marker.

GPT Voice prompt rule:

- The page teaches phrases before GPT Voice.
- The GPT Voice prompt must run interviewer mode, not coach mode.
- The prompt must not ask GPT to drill phrases during the voice session.
- Target phrases are a private scoring rubric for the final session record.
- GPT must not read, suggest, or use the user's target phrases during the interview.
- GPT must ask one question at a time and wait without interrupting.
- Corrections and phrase usage checks happen only after the interview part is finished.
- GPT must lead an adaptive dialogue. Prepared follow-up questions are a topic map, not a script.
- After each user answer, GPT should choose a natural move: ask for an example, clarify a vague phrase, challenge gently, ask for application, or compare old vs new thinking.
- GPT should stay on a useful idea for 2-3 turns instead of immediately moving to the next prepared topic.
- GPT should not accept short answers and move on; it should ask for a concrete example, reason, or application.
- GPT Voice sessions should last 10-15 minutes by default. The prompt must explicitly say not to finish after 3-5 minutes unless the user asks to stop.
- For self-development units, GPT should act as a mentor-interviewer: it should teach one useful content idea through questions, examples, and application, not run a scripted interrogation.
- The prompt should include time checkpoints: understand the user's example, explore the concept, apply it to the user's life, then post-test and feedback.

Do not repeat these mistakes:

- unclear labels like "закрий англійську";
- one long page where all sections are stacked and visually compete for attention;
- tasks without stable ids and task-specific rules;
- first page that looks like plain reading material without a clear mission or win condition;
- possible good versions that only change one small word;
- micro-answer page that does not explain why selection matters or how phrases will be reused;
- phrase-selection pages that do not change what happens later in the trainer, full answer, or GPT Voice evaluation;
- tasks that require searching for phrases elsewhere;
- hidden questions without hints;
- mixed Ukrainian/English translations when Ukrainian equivalents are natural;
- vague decorative cheat sheet columns;
- unexplained labels like "Pressure follow-ups" in the user-facing page;
- a GPT prompt that does not match the page content.
- a GPT prompt that mixes coach mode and interviewer mode.
- a GPT prompt that walks through a fixed list of questions without reacting to the user's answers.
- hints that only reveal the first words of the answer instead of explaining construction, word order, common traps, or meaning.
- route-only speaking cheat sheets for abstract topics;
- asking the user to translate or improvise whole answers before writing supported sentences;
- full-answer tasks without sentence starters, word banks, hidden examples, and a draft box.
- full-answer tasks that start from a large empty textarea on difficult topics. Use a guided text builder, cloze text, dropdown choices, or sentence reconstruction first.
- sentence-writing tasks without iterative checking of the user's current version.
- productivity or mindset maps that are disconnected from the English answer;
- visual blocks that explain an idea but do not produce user-specific English sentences.
- inconsistent translation placement between paragraphs;
- missing story context before the English model text;
- textarea instructions stored only in disappearing placeholder text;
- passive micro-answer lists that are not selected, drilled, or reused;
- instructions that make the user scroll back to another block;
- fixed writing or recall practice without an option to add more.
- hidden examples or sentence feedback cramped into a narrow side column. They must open below the input across the row.
- drill cards that look like repeated generic cards. The phrase trainer should feel like a compact practice console: cue, input, actions, feedback, hint, answer.
- possible good versions that feel identical. Good alternatives should teach a different structure, angle, or speaking use.

When the topic is abstract or the user lacks improvisational English, add an assisted writing bridge before GPT Voice:

1. Ukrainian idea.
2. English sentence starter.
3. small word bank.
4. hidden example answer.
5. user draft field.
6. only then full spoken answer.

For full answers, prefer this progression:

```text
ready text with blanks -> choices / word bank -> assembled draft -> small personal edits -> speaking
```

Do not make the user write a 5-8 sentence answer from zero before enough sentence-level practice.

For mindset/productivity units, every visual map must answer:

- what real-life content the user should extract;
- what English sentence starter to use;
- what short example looks like;
- where the user writes the sentence that will later be used in speaking.
- which real-life experiment the user will run today and what evidence counts as completion.

Interaction standard:

1. Put 10 compact writing rows directly after the model material, with a finite pool behind the add-more controls.
2. Prefer controlled Ukrainian-to-English reconstruction: Ukrainian sentence, target construction, word bank, user input, feedback after an explicit check, and possible good versions.
3. Each row uses a construction or idea from the model.
4. Each row has 1-2 nearby hidden good versions, not one "correct" sentence. These versions must differ in structure or communicative use, not only one synonym.
5. Each writing row has a local checker that explains what is missing: subject, sentence length, target construction, linking word, or topic phrase. Do not treat the example as the only correct answer.
6. `Додати ще` consumes only unseen rows from a finite daily pool. The page opens 10 rows by default, never wraps around, and shows `Сьогодні все` with disabled controls when the pool is exhausted.
7. Keep sentence starters in a persistent side panel beside every long draft.
8. Selecting micro-answers updates a visible personal phrase set.
9. The final-answer panel live-mirrors the user's earlier drafts and personal phrase set, so no backward scrolling is required.
10. QA hints must be accepted by the checker when copied exactly. The checker may ask for a connector or fuller thought, but it must not reject a hint because it expected an unrelated internal keyword.
11. Do not make the correct answer the default value in dropdown builders. If a task uses choices, it must include wrong and extra distractors, a neutral default state, and a check step that marks the selected wrong answer red and the correct answer green.
12. Full-answer tasks should not start as a large empty textarea with a side list of phrases. For difficult topics, first use a practical lab: real task, visible cost, hidden cost, later price, and one small action. Then generate or assemble a draft from those inputs.
13. The pre-Voice support screen must not be a static cheat sheet that duplicates previous phrases. It should rehearse likely interviewer moves: ask for a real example, challenge a vague idea, ask for a concrete cost, ask what changes today, and provide emergency lines only as backup.
14. Short speaking text must not be assembled by a button from already-selected correct answers. Use a production exercise instead: 4-5 personal micro-sentences, each with a sentence role, target construction, word bank, user input, and live validation. The final draft should be assembled from what the user wrote.

Phrase selection standard:

- Explain the semantic job of the phrase page.
- Group or frame selected phrases by role: definition, contrast, action, result, personal proof, or repair.
- The user should understand that selected phrases feed the trainer, final answer, and GPT Voice rubric.

Mission and trainer UX standard:

1. Step 1 should create context: what is happening today, what trap the user is practicing against, what English answer this page should produce.
2. Use a concrete finish condition, for example: "say 60 seconds without reading the model text".
3. Sentence examples must show two different usable directions, for example direct/interview-style vs more natural/personal.
4. Phrase-selection pages must answer "why this page exists": these phrases are selected, drilled, reused in the answer, then scored after GPT Voice.
5. Phrase-trainer rows should support iteration. Feedback should say what is missing or wrong, not only "right/wrong".

## v1.13 - Work Mindset Unit

The daily page is the execution layer for `../units/work_mindset_50.md`.

The first screen must answer within a few seconds:

1. Which day of the 50-session unit is this?
2. What real work problem am I examining?
3. Which English skill am I practicing?
4. What written, spoken, and real-life evidence will exist at the end?

The page may keep the detailed eight-step trainer internally, but the user-facing progress should feel like four phases:

```text
Зрозуміти -> Побудувати -> Сказати -> Перевірити
```

The page must provide an actual answer field wherever it asks the user to write a short answer. A question list without a place to answer is a product bug.

## v1.14 - 50-Day Start Lab

The Work Mindset unit is now a start lab in English. The visual trainer must not present the day as passive productivity content.

Every page must show:

- the content mechanism of the day;
- the user's personal diagnosis or choice;
- 4-6 supported English sentences;
- one spoken answer;
- one real-world experiment;
- one proof/evidence item;
- 5 new chunks, 3 recycled chunks, and 1 repair phrase;
- progress toward the current master question and checkpoint.

Reject the page if it only asks the user to read, watch, or reflect without producing active English and a real behavior test.
