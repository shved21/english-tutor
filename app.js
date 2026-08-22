(function () {
  "use strict";

  const STORAGE_KEY = "english-tutor-start-lab-v1";
  const STEP_NAMES = ["understand", "build", "speak", "prove"];
  const state = loadState();
  let activeDay = nextIncompleteDay();
  let activeFilter = "all";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function loadState() {
    const fallback = { completed: [], xp: 0, steps: {} };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return fallback;
      return {
        completed: Array.isArray(saved.completed)
          ? saved.completed.filter((day) => Number.isInteger(day) && day >= 1 && day <= challengeDays.length)
          : [],
        xp: Number.isFinite(saved.xp) ? saved.xp : 0,
        steps: saved.steps && typeof saved.steps === "object" ? saved.steps : {},
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const status = $("#save-status");
    status.textContent = "Saved just now";
    window.clearTimeout(saveState.timer);
    saveState.timer = window.setTimeout(() => { status.textContent = "Saved locally"; }, 1600);
  }

  function getDay(dayNumber) {
    return challengeDays.find((item) => item.day === dayNumber) || challengeDays[0];
  }

  function phaseFor(dayNumber) {
    return challengePhases.find((phase) => dayNumber >= phase.range[0] && dayNumber <= phase.range[1]) || challengePhases[0];
  }

  function nextIncompleteDay() {
    return challengeDays.find((item) => !state.completed.includes(item.day))?.day || challengeDays.length;
  }

  function isComplete(dayNumber) {
    return state.completed.includes(dayNumber);
  }

  function isUnlocked(dayNumber) {
    return dayNumber === 1 || isComplete(dayNumber - 1);
  }

  function stepKey(dayNumber, stepName) {
    return `${dayNumber}-${stepName}`;
  }

  function stepDone(dayNumber, stepName) {
    return state.steps[stepKey(dayNumber, stepName)] === true;
  }

  function allStepsDone(dayNumber) {
    return STEP_NAMES.every((stepName) => stepDone(dayNumber, stepName));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    }[character]));
  }

  function renderRoadmap() {
    const roadmap = $("#roadmap");
    const currentPhaseName = phaseFor(nextIncompleteDay()).name;
    roadmap.innerHTML = challengePhases.map((phase) => {
      const visible = activeFilter === "all" || phase.name === currentPhaseName;
      const days = challengeDays.filter((item) => item.day >= phase.range[0] && item.day <= phase.range[1]);
      return `<section class="phase-row ${visible ? "" : "is-hidden"}" style="--phase-color: var(--${phase.color})">
        <div class="phase-head"><div class="phase-title"><span class="phase-swatch"></span><strong>${escapeHtml(phase.name)}</strong></div><small>Days ${phase.range[0]}-${phase.range[1]}</small></div>
        <div class="day-row">${days.map((item) => {
          const completed = isComplete(item.day);
          const locked = !isUnlocked(item.day) && !completed;
          const current = item.day === nextIncompleteDay();
          return `<button class="day-button ${completed ? "is-complete" : ""} ${current ? "is-current" : ""} ${locked ? "is-locked" : ""}" type="button" data-day="${item.day}" ${locked ? "disabled" : ""}>
            <span class="day-number">DAY ${String(item.day).padStart(2, "0")}</span><span class="day-topic">${escapeHtml(item.topic)}</span>${completed ? '<span class="day-check">CLEARED</span>' : current ? '<span class="day-check">NEXT</span>' : ""}
          </button>`;
        }).join("")}</div>
      </section>`;
    }).join("");
    $$(".day-button").forEach((button) => button.addEventListener("click", () => openMission(Number(button.dataset.day))));
  }

  function renderProgress() {
    const completedCount = state.completed.length;
    const percent = Math.round((completedCount / challengeDays.length) * 100);
    const unlockedCount = challengeAchievements.filter((achievement) => achievement.test(state)).length;
    $("#progress-percent").textContent = `${percent}%`;
    $("#progress-fill").style.width = `${percent}%`;
    $("#completed-count").textContent = completedCount;
    $("#achievement-count").textContent = unlockedCount;
    $("#achievement-summary").textContent = `${unlockedCount} / ${challengeAchievements.length}`;
    $("#xp-copy").textContent = `${state.xp} XP`;
    $("#progress-copy").textContent = completedCount === 0 ? "Day 1 is waiting." : completedCount === challengeDays.length ? "The full lab is cleared." : `Day ${nextIncompleteDay()} is ready.`;
    $("#hero-day-number").textContent = String(nextIncompleteDay()).padStart(2, "0");
  }

  function renderToday() {
    const day = getDay(nextIncompleteDay());
    const phase = phaseFor(day.day);
    $("#today-day-badge").textContent = `DAY ${String(day.day).padStart(2, "0")}`;
    $("#today-phase").textContent = phase.name.toUpperCase();
    $("#today-topic").textContent = day.topic;
    $("#today-question").textContent = day.question;
    $("#today-focus-value").textContent = day.focus;
    $("#today-evidence").textContent = day.evidence;
    $("#continue-button").innerHTML = day.day === challengeDays.length ? "Review final mission <span>-></span>" : `Continue day ${day.day} <span>-></span>`;
  }

  function renderAchievements() {
    $("#achievement-list").innerHTML = challengeAchievements.map((achievement) => {
      const unlocked = achievement.test(state);
      return `<article class="achievement ${unlocked ? "is-unlocked" : ""}"><span class="achievement-icon">${achievement.icon}</span><div><strong>${escapeHtml(achievement.title)}</strong><small>${escapeHtml(achievement.detail)}</small></div><span class="achievement-state">${unlocked ? "UNLOCKED" : "LOCKED"}</span></article>`;
    }).join("");
  }

  function renderDialog() {
    const day = getDay(activeDay);
    const phase = phaseFor(day.day);
    const completedSteps = STEP_NAMES.filter((stepName) => stepDone(day.day, stepName)).length;
    $("#dialog-phase").textContent = `${phase.name.toUpperCase()} / DAY ${String(day.day).padStart(2, "0")}`;
    $("#dialog-day").textContent = `DAY ${String(day.day).padStart(2, "0")}`;
    $("#mission-title").textContent = day.topic;
    $("#dialog-question").textContent = day.question;
    $("#dialog-output-question").textContent = day.question;
    $("#dialog-output-evidence").textContent = `Finish with: ${day.evidence}`;
    $("#mission-progress-fill").style.width = `${completedSteps * 25}%`;
    $("#mission-progress-copy").textContent = `${completedSteps} / 4 actions complete`;
    $("#mission-status").textContent = completedSteps === 4 ? "Ready to clear this day." : "Build the next piece of evidence.";
    $("#dialog-evidence").textContent = day.evidence;
    $$(".mission-step").forEach((step) => {
      const name = step.dataset.step;
      const done = stepDone(day.day, name);
      step.classList.toggle("is-complete", done);
      const button = step.querySelector(".step-button");
      button.textContent = done ? "Done" : "Mark done";
      button.setAttribute("aria-pressed", String(done));
    });
    $("#complete-day").disabled = !allStepsDone(day.day) || isComplete(day.day);
    $("#previous-day").disabled = day.day <= 1;
  }

  function openMission(dayNumber) {
    if (!isUnlocked(dayNumber) && !isComplete(dayNumber)) return;
    activeDay = dayNumber;
    renderDialog();
    const dialog = $("#mission-dialog");
    if (dialog.open) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeMission() {
    const dialog = $("#mission-dialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function renderAll() {
    renderRoadmap();
    renderProgress();
    renderToday();
    renderAchievements();
    if ($("#mission-dialog").open) renderDialog();
  }

  $("#continue-button").addEventListener("click", () => openMission(nextIncompleteDay()));
  $("#open-day").addEventListener("click", () => openMission(nextIncompleteDay()));
  $("#close-dialog").addEventListener("click", closeMission);
  $("#previous-day").addEventListener("click", () => openMission(Math.max(1, activeDay - 1)));

  $("#mission-steps").addEventListener("click", (event) => {
    const button = event.target.closest(".step-button");
    if (!button) return;
    const step = button.closest(".mission-step").dataset.step;
    const key = stepKey(activeDay, step);
    state.steps[key] = !state.steps[key];
    saveState();
    renderDialog();
  });

  $("#complete-day").addEventListener("click", () => {
    if (!allStepsDone(activeDay) || isComplete(activeDay)) return;
    state.completed = Array.from(new Set([...state.completed, activeDay])).sort((a, b) => a - b);
    state.xp += 100;
    saveState();
    renderAll();
    closeMission();
    if (state.completed.length < challengeDays.length) {
      window.setTimeout(() => openMission(nextIncompleteDay()), 250);
    }
  });

  $("#reset-progress").addEventListener("click", () => {
    if (!window.confirm("Reset all challenge progress?")) return;
    state.completed = [];
    state.xp = 0;
    state.steps = {};
    saveState();
    renderAll();
  });

  $("#phase-filter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-phase]");
    if (!button) return;
    activeFilter = button.dataset.phase;
    $$(".filter-button").forEach((item) => item.classList.toggle("is-active", item === button));
    renderRoadmap();
  });

  renderAll();
})();
