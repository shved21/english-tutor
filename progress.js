// Public, manually reviewed snapshot. A position in the plan is not a completed lesson.
// Add a rating only after there is learner evidence for that specific day.
const publicProgress = Object.freeze({
  asOf: '2026-09-30',
  currentDay: 30,
  // User-reported completion, kept separate from evidence-based numeric ratings.
  selfReportedCompletedDays: Array.from({length: 29}, (_, index) => index + 1),
  ratings: {}
});
