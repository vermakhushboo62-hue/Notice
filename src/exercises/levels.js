// What each level (1–5) means for each exercise.
export const LEVELS = {
  observer: [
    { study: 25, questions: 4, hard: false },
    { study: 20, questions: 5, hard: false },
    { study: 18, questions: 5, hard: true },
    { study: 14, questions: 6, hard: true },
    { study: 10, questions: 6, hard: true },
  ],
  memory: [
    { size: 3, objects: 5, changes: 2, study: 20 },
    { size: 4, objects: 7, changes: 3, study: 15 },
    { size: 4, objects: 9, changes: 3, study: 12 },
    { size: 5, objects: 11, changes: 4, study: 12 },
    { size: 5, objects: 13, changes: 4, study: 10 },
  ],
  auditor: [
    { diffs: 3, subtle: 0 },
    { diffs: 4, subtle: 0.2 },
    { diffs: 5, subtle: 0.4 },
    { diffs: 6, subtle: 0.6 },
    { diffs: 7, subtle: 0.8 },
  ],
  proofreader: [
    { errors: 4, showCount: true },
    { errors: 5, showCount: true },
    { errors: 5, showCount: true },
    { errors: 6, showCount: true },
    { errors: 7, showCount: false },
  ],
  detective: [
    { statements: 4 },
    { statements: 5 },
    { statements: 5 },
    { statements: 6 },
    { statements: 7 },
  ],
}

export const LEVEL_SUMMARY = {
  observer: (p) => `${p.study}s to study · ${p.questions} questions${p.hard ? ' · finer details' : ''}`,
  memory: (p) => `${p.size}×${p.size} grid · ${p.objects} shapes · ${p.changes} changes · ${p.study}s`,
  auditor: (p) => `${p.diffs} differences${p.subtle ? ` · ${Math.round(p.subtle * 100)}% subtle` : ''}`,
  proofreader: (p) => `${p.errors}+ errors${p.showCount ? '' : ' · count hidden'}`,
  detective: (p) => `${p.statements} statements`,
}

export const levelParams = (exercise, level) => LEVELS[exercise][Math.max(1, Math.min(5, level)) - 1]
