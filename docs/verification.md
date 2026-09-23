# Portfolio release verification

Checked on 23 September 2026 with neutral demonstration inputs. These checks concern software behavior; they do not establish learner progress or a CEFR result.

## Repeatable checks

Run from the repository root with Node.js installed:

```sh
node --check app.js
node --check daily_task_app/app.js
node --check daily_task_app/draft-store.js
node --check daily_task_app/session.js
node daily_task_app/qa_check.mjs
node daily_task_app/test_drafts.mjs
node scripts/check-links.mjs
```

- The lesson QA covers the finite writing pool and selected semantic checker cases.
- Draft tests cover round trips, malformed data, invalid field types, bounds, and storage failures. They do not replace browser interaction checks.
- The link check verifies local Markdown targets and HTML assets exist. External services and fragment targets are outside its scope.

## Browser walkthrough

The local static server was tested in the Codex in-app browser, with desktop and narrow layouts. At a 390 CSS-pixel document width, the lesson had no horizontal document overflow. This is responsive browser testing, not a physical-phone compatibility claim.

| Action | Observed result |
| --- | --- |
| Open the roadmap, then the sample | The entry opens Day 14; the page identifies it as the one available complete lesson. |
| Mark four mission actions and complete the mission; refresh | The next day unlocks and the manual checklist/XP persist. These were synthetic test actions, not study evidence. |
| Type an incomplete writing answer | No feedback until Check; checking produces a specific incomplete-answer message. |
| Check “Some pressure gives me direction, while excessive pressure makes it harder to act.” | The supported alternative is accepted. |
| Refresh after writing | The draft and current step return; previous checker feedback is not restored. |
| Type literal HTML markup into a draft | It appears as text in the answer support panel, without creating markup. |
| Change phrase choices and write practice answers; refresh | Choices and practice drafts return. |
| Enter story, full-answer, and speaking-preparation drafts | Drafts remain available across navigation and refresh. |
| Copy the Voice prompt | The clipboard contains the prompt; the app does not start or record a conversation. |
| Check a repair item; refresh | The manual selection persists. |
| Navigate all eight screens | The flow remains usable; no JavaScript errors were observed during the walkthrough. |

The [screenshots](../README.md#screenshots) show the real interface with neutral demo data. The mobile image is a cropped view of the sample's header at the narrow layout.

## Scope remaining

Only one detailed lesson is implemented. Answer checks cover selected patterns rather than arbitrary English. Storage is per browser and origin, with no account, sync, or export. Voice behavior depends on the separate ChatGPT session and was not evaluated as an integrated app feature. Cross-browser and physical-device coverage remain future work.
