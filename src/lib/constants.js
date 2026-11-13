// Skills make up the Attention Profile. They map to four kinds of attention:
// noticing (visual), recall, critical evaluation and analytical accuracy.
export const SKILLS = {
  visual: { label: 'Visual observation', pillar: 'Noticing small visual details' },
  written: { label: 'Written accuracy', pillar: 'Catching errors in text' },
  numerical: { label: 'Numerical accuracy', pillar: 'Checking figures against each other' },
  critical: { label: 'Critical evaluation', pillar: 'Spotting claims that don’t hold up' },
  recall: { label: 'Recall', pillar: 'Remembering what you saw' },
}
export const SKILL_ORDER = ['visual', 'written', 'numerical', 'critical', 'recall']

// "Why you missed it" — each question is tagged with the trap it sets.
export const TRAPS = {
  rushing: {
    label: 'Rushing',
    why: 'You answered quickly and the misses clustered where a second look would have caught them.',
    focus: 'slowing down before you commit',
  },
  assuming: {
    label: 'Assuming',
    why: 'You read what you expected to be there rather than what was actually written.',
    focus: 'checking claims against the source',
  },
  'small-print': {
    label: 'Overlooking small details',
    why: 'The misses were in small text, labels or units — details that sit outside the main focus.',
    focus: 'small text and fine print',
  },
  similar: {
    label: 'Confusing similar items',
    why: 'You mixed up items that look alike — near-identical names, colours or shapes.',
    focus: 'telling similar items apart',
  },
  spatial: {
    label: 'Missing position changes',
    why: 'You recognised the objects but not where they were.',
    focus: 'spatial relationships',
  },
  numbers: {
    label: 'Skimming numbers',
    why: 'The misses were in figures — transposed digits, totals or dates that didn’t add up.',
    focus: 'numbers and totals',
  },
}

export const EXERCISES = {
  observer: {
    number: '01',
    name: 'The Observer',
    kind: 'Visual attention',
    blurb: 'Study a scene for 20 seconds. It disappears. Answer 5 questions about tiny details.',
    primarySkill: 'visual',
  },
  proofreader: {
    number: '02',
    name: 'The Proofreader',
    kind: 'Accuracy',
    blurb: 'Find the errors hidden in a real-world document. Tap every word or figure that’s wrong.',
    primarySkill: 'written',
  },
  detective: {
    number: '03',
    name: 'The Detective',
    kind: 'Logical observation',
    blurb: 'Read the original. Then decide which summary statements match, contradict or invent.',
    primarySkill: 'critical',
  },
  memory: {
    number: '04',
    name: 'The Memory Snapshot',
    kind: 'Observation recall',
    blurb: 'Study an arrangement of shapes. Then find what moved, changed or appeared.',
    primarySkill: 'recall',
  },
  auditor: {
    number: '05',
    name: 'The Auditor',
    kind: 'Analytical attention',
    blurb: 'Compare two versions of a document and find the subtle differences.',
    primarySkill: 'numerical',
  },
}
export const EXERCISE_ORDER = ['observer', 'proofreader', 'detective', 'memory', 'auditor']

// Which exercise best trains each trap — used by the adaptive engine.
export const TRAP_TO_EXERCISE = {
  spatial: 'memory',
  similar: 'observer',
  'small-print': 'observer',
  numbers: 'auditor',
  assuming: 'detective',
  rushing: 'proofreader',
}
export const SKILL_TO_EXERCISE = {
  visual: 'observer',
  written: 'proofreader',
  numerical: 'auditor',
  critical: 'detective',
  recall: 'memory',
}
