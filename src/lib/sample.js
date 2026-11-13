import { makeRng } from './rng.js'
import { addDays, dateKey, planForDay, diagnose, dailyResults } from './engine.js'
import { EXERCISES } from './constants.js'

// Sample history so the dashboard can be previewed before real data exists.
const P = { visual: 0.9, numerical: 0.96, written: 0.72, critical: 0.88, recall: 0.76 }
const TRAPS_BY_SKILL = { visual: ['similar', 'small-print', 'spatial'], numerical: ['numbers'], written: ['small-print', 'similar'], critical: ['assuming', 'small-print'], recall: ['spatial', 'similar'] }

export function sampleState(days = 12) {
  const rng = makeRng('sample')
  const state = { version: 1, results: [], nextFocus: null, sample: true }
  const today = dateKey()
  for (let d = days; d >= 1; d--) {
    if (d === 5) continue // a missed day keeps it realistic
    const day = dailyResults(state).length + 1
    const date = addDays(today, -d)
    const plan = planForDay(state, day, date)
    if (d === 8) { // one session left early, to show how recovery days work
      state.results.push({ id: `sample-left-${d}`, date, day, mode: 'daily', exercise: plan.exercise, level: plan.level, abandoned: true, items: [], falseFlags: [], answerMs: 0, durationMs: 140000 })
    }
    const ex = EXERCISES[plan.exercise]
    const items = Array.from({ length: 5 }, (_, i) => {
      const skill = i < 3 ? ex.primarySkill : rng.pick(Object.keys(P))
      return { id: `s${i}`, label: 'Sample item', skill, trap: rng.pick(TRAPS_BY_SKILL[skill]), correct: rng.next() < P[skill] + day * 0.012, why: '' }
    })
    const r = { id: `sample-${d}`, date, day, mode: 'daily', exercise: plan.exercise, focusTrap: plan.focusTrap, level: plan.level,
      items, falseFlags: [], answerMs: 90000 + rng.int(0, 120000), durationMs: 150000 + rng.int(0, 170000) }
    const diag = diagnose(r, day)
    r.summary = diag.summary
    state.results.push(r)
    state.nextFocus = diag.nextFocus
  }
  return state
}
