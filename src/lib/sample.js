import { makeRng } from './rng.js'
import { addDays, dateKey, planForDay, diagnose } from './engine.js'
import { EXERCISES } from './constants.js'

// Sample history so the dashboard can be previewed before real data exists.
const P = { visual: 0.78, numerical: 0.9, written: 0.66, critical: 0.82, recall: 0.7 }
const TRAPS_BY_SKILL = { visual: ['similar', 'small-print', 'spatial'], numerical: ['numbers'], written: ['small-print', 'similar'], critical: ['assuming', 'small-print'], recall: ['spatial', 'similar'] }

export function sampleState(days = 12) {
  const rng = makeRng('sample')
  const state = { version: 1, results: [], nextFocus: null, sample: true }
  const today = dateKey()
  for (let d = days; d >= 1; d--) {
    if (d === 5) continue // a missed day keeps it realistic
    const day = state.results.length + 1
    const plan = planForDay(state, day)
    const ex = EXERCISES[plan.exercise]
    const items = Array.from({ length: 5 }, (_, i) => {
      const skill = i < 3 ? ex.primarySkill : rng.pick(Object.keys(P))
      return { id: `s${i}`, label: 'Sample item', skill, trap: rng.pick(TRAPS_BY_SKILL[skill]), correct: rng.next() < P[skill] + day * 0.006, why: '' }
    })
    const r = { id: `sample-${d}`, date: addDays(today, -d), day, mode: 'daily', exercise: plan.exercise, focusTrap: plan.focusTrap,
      items, falseFlags: [], answerMs: 90000 + rng.int(0, 120000), durationMs: 150000 + rng.int(0, 150000) }
    const diag = diagnose(r, day)
    r.summary = diag.summary
    state.results.push(r)
    state.nextFocus = diag.nextFocus
  }
  return state
}
