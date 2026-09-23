/* Progressive enhancement for the shipped Day 14 lesson. Feedback is never restored. */
(function () {
  "use strict";
  let storage;
  try { storage = window.localStorage; } catch { /* The lesson also works without storage. */ }
  const draft = TutorDraftStore.read(storage);
  const status = document.querySelector("#draft-status");

  function bindFields() {
    const groups = [[".writing-input", "writing"], ["#phrase-list input", "phrase"],
      [".qa-input", "story"], [".mission-input", "mission"], ["#full-answer", "answer"]];
    for (const [selector, prefix] of groups) {
      document.querySelectorAll(selector).forEach((input, i) => {
        input.dataset.draftKey = `${prefix}:${i}`;
        if (!input.hasAttribute("aria-label") && prefix === "story") {
          input.setAttribute("aria-label", input.closest(".qa-card").querySelector(".q").textContent.trim());
        }
      });
    }
    document.querySelectorAll(".drill-card").forEach((card) => {
      const answer = card.querySelector(".answer-key").textContent;
      const index = phraseItems.findIndex((phrase) => phrase.answer === answer);
      card.querySelector(".drill-input").dataset.draftKey = `drill:${index}`;
      card.querySelector(".activation-input").dataset.draftKey = `activation:${index}`;
    });
  }
  function restoreFields() {
    bindFields();
    document.querySelectorAll("[data-draft-key]").forEach((input) => {
      const value = draft.fields[input.dataset.draftKey];
      if (input.type === "checkbox" && typeof value === "boolean") input.checked = value;
      else if (input.type !== "checkbox" && typeof value === "string") input.value = value;
    });
  }
  function save() {
    bindFields();
    document.querySelectorAll("[data-draft-key]").forEach((input) => {
      draft.fields[input.dataset.draftKey] = input.type === "checkbox" ? input.checked : input.value;
    });
    draft.step = currentStep;
    draft.writingCount = writingCursor;
    draft.drillCount = drillCursor;
    status.textContent = TutorDraftStore.write(storage, draft)
      ? "Чернетку збережено в цьому браузері. Це не оцінка прогресу."
      : "Браузер не зберігає чернетку. Скопіюй важливі відповіді перед закриттям.";
  }

  if (draft.writingCount > writingCursor) appendWritingRows(draft.writingCount - writingCursor);
  restoreFields();
  renderDrills(0, true);
  if (draft.drillCount > drillCursor) renderDrills(draft.drillCount - drillCursor);
  restoreFields();
  updateMirrors();
  updateStoryPreview();
  renderMissionPhraseBank();
  if (draft.step) showStep(draft.step);
  if (!storage) status.textContent = "Браузер не зберігає чернетку. Скопіюй важливі відповіді перед закриттям.";

  // Capture before a phrase change rebuilds its practice cards.
  document.addEventListener("input", save, true);
  document.addEventListener("change", save, true);
  for (const container of [writingRows, drillGrid]) {
    new MutationObserver(restoreFields).observe(container, { childList: true });
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest("#prev-step, #next-step, [data-more-writing], [data-more-drills]")) {
      restoreFields();
      save();
    }
  });
})();
