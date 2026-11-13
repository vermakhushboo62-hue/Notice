// NOTICE — the 90-day programme.
//
// Three months, thirteen blocks. Each block has a theme, a weighted pool of
// exercises and a level ceiling. Every day the engine mixes and matches from
// the current block's pool based on how you're doing: your ability level per
// exercise (earned by finishing on time with high accuracy), the trap you fell
// for last, your weakest skill, what you did yesterday, and whether you've
// been struggling to finish (which triggers a lighter "recovery" day).
import { makeRng } from './rng.js'
import { EXERCISE_ORDER, SKILL_TO_EXERCISE, TRAP_TO_EXERCISE, TRAPS, SKILLS, EXERCISES } from './constants.js'

export const PROGRAM_DAYS = 90
export const TARGET_MS = 5 * 60 * 1000 // "on time"
export const OVERTIME_MS = 8 * 60 * 1000 // clearly struggled to finish
export const MAX_LEVEL = 5

export const MONTHS = [
  { n: 1, title: 'Foundations', tagline: 'See clearly', detail: 'Build the habit. Slow, careful looking at levels 1–3.' },
  { n: 2, title: 'Depth', tagline: 'Hold more, faster', detail: 'Shorter study times, more items, subtler differences. Levels up to 4.' },
  { n: 3, title: 'Mastery', tagline: 'Apply it for real', detail: 'Workplace documents, hidden error counts, and a programme built around your weak spots. Up to level 5.' },
]

const b = (n, month, days, title, detail, pool, maxLevel, extra = {}) => ({ n, month, days, title, detail, pool, maxLevel, ...extra })

export const BLOCKS = [
  // Month 1 — Foundations
  b(1, 1, 7, 'Learn to notice', 'Slow observation, visual details and object recall.', { observer: 3, memory: 3, auditor: 1 }, 2),
  b(2, 1, 7, 'Learn to compare', 'Spot differences, inconsistencies and missing information.', { auditor: 3, memory: 2, detective: 2, observer: 1 }, 2),
  b(3, 1, 7, 'Learn to verify', 'Numbers, written details, assumptions and accuracy.', { proofreader: 3, auditor: 2, detective: 2 }, 3),
  b(4, 1, 7, 'Apply to real life', 'Emails, presentations, instructions, everyday decisions.', { proofreader: 3, detective: 3, auditor: 1, observer: 1 }, 3),
  b('C1', 1, 2, 'Month 1 checkpoint', 'Benchmark the exercises you’ve practised least.', { observer: 1, proofreader: 1, detective: 1, memory: 1, auditor: 1 }, 3, { checkpoint: true }),
  // Month 2 — Depth
  b(5, 2, 7, 'Faster eyes', 'Shorter study windows. Take in a whole scene quickly.', { observer: 3, memory: 3, auditor: 1 }, 4),
  b(6, 2, 7, 'Numbers that lie', 'Totals, percentages, dates and transposed digits.', { auditor: 3, proofreader: 2, detective: 2 }, 4, { focusTrap: 'numbers' }),
  b(7, 2, 7, 'Read between the lines', 'Separate what was said from what was assumed.', { detective: 3, proofreader: 3, memory: 1 }, 4, { focusTrap: 'assuming' }),
  b(8, 2, 7, 'Where things are', 'Spatial memory and position changes.', { memory: 3, observer: 3, auditor: 1 }, 4, { focusTrap: 'spatial' }),
  b('C2', 2, 2, 'Month 2 checkpoint', 'Benchmark the exercises you\u2019ve practised least.', { observer: 1, proofreader: 1, detective: 1, memory: 1, auditor: 1 }, 4, { checkpoint: true }),
  // Month 3 — Mastery
  b(9, 3, 7, 'Documents at work', 'Proposals, invoices, budgets and specs at full difficulty.', { proofreader: 3, auditor: 3, detective: 1 }, 5),
  b(10, 3, 7, 'Claims and decisions', 'Meeting notes, reports and claims you’d act on.', { detective: 3, proofreader: 2, auditor: 2 }, 5),
  b(11, 3, 7, 'No safety net', 'Error counts are hidden. Decide for yourself when you’re done.', { proofreader: 2, auditor: 2, detective: 1, memory: 1, observer: 1 }, 5, { blind: true }),
  b(12, 3, 7, 'Your weak spots', 'Fully adaptive: driven by your Attention Profile.', { observer: 1, proofreader: 1, detective: 1, memory: 1, auditor: 1 }, 5, { adaptive: true }),
  b('C3', 3, 2, 'Final checkpoint', 'Measure how far you’ve come since Month 1.', { observer: 1, proofreader: 1, detective: 1, memory: 1, auditor: 1 }, 5, { checkpoint: true }),
]

// Attach start days.
let cursor = 1
for (const blk of BLOCKS) { blk.start = cursor; cursor += blk.days }

export function blockForDay(day) {
  if (day > PROGRAM_DAYS) return null
  return BLOCKS.find((blk) => day >= blk.start && day < blk.start + blk.days) || null
}
export const monthForDay = (day) => (day > PROGRAM_DAYS ? null : MONTHS[Math.ceil(day / 30) - 1])

// Maintenance after Day 90: fully adaptive, all exercises, level 5 ceiling.
const MAINTENANCE = { n: 'M', month: null, title: 'Maintenance', detail: 'Keep the habit. Fully adaptive across all five exercises.',
  pool: { observer: 1, proofreader: 1, detective: 1, memory: 1, auditor: 1 }, maxLevel: 5, adaptive: true }

// ---------- outcomes & ability ----------
export function outcomeOf(r) {
  if (r.abandoned) return 'struggled'
  const total = r.items.length + (r.falseFlags?.length || 0)
  const acc = total ? r.items.filter((i) => i.correct).length / total : 0
  if (acc < 0.5 || r.durationMs > OVERTIME_MS) return 'struggled'
  if (acc >= 0.85 && r.durationMs <= TARGET_MS) return 'mastered'
  return 'steady'
}

// Level per exercise: two "mastered" sessions in a row move you up a level;
// one "struggled" session (low accuracy, way over time, or left early) moves you down.
export function abilityLevels(state) {
  const out = {}
  for (const ex of EXERCISE_ORDER) out[ex] = { level: 1, ups: 0, attempts: 0, last: null }
  for (const r of state.results) {
    const a = out[r.exercise]
    if (!a) continue
    a.attempts++
    const o = outcomeOf(r)
    a.last = o
    if (o === 'mastered') { a.ups++; if (a.ups >= 2) { a.level = Math.min(MAX_LEVEL, a.level + 1); a.ups = 0 } }
    else if (o === 'struggled') { a.level = Math.max(1, a.level - 1); a.ups = 0 }
  }
  return out
}

// Finishing behaviour over the last 14 daily starts.
export function completionStats(state, lastN = 14) {
  const daily = state.results.filter((r) => r.mode === 'daily').slice(-lastN)
  if (!daily.length) return null
  const finished = daily.filter((r) => !r.abandoned)
  return {
    started: daily.length,
    finished: finished.length,
    completionRate: Math.round((finished.length / daily.length) * 100),
    onTimeRate: finished.length ? Math.round((finished.filter((r) => r.durationMs <= TARGET_MS).length / finished.length) * 100) : 0,
  }
}

function needsRecovery(state, today, addDays) {
  const daily = state.results.filter((r) => r.mode === 'daily')
  if (!daily.length) return null
  const last = daily.at(-1)
  if (last.abandoned) return 'You left your last session early'
  const last2 = daily.slice(-2)
  if (last2.length === 2 && last2.every((r) => outcomeOf(r) === 'struggled')) return 'The last two sessions were a struggle'
  if (last.date < addDays(today, -3)) return 'Welcome back after a few days off'
  return null
}

// ---------- the daily mix ----------
export function planDay(state, day, { today, addDays, weakestSkill, profile }) {
  const block = blockForDay(day) || MAINTENANCE
  const levels = abilityLevels(state)
  const daily = state.results.filter((r) => r.mode === 'daily' && !r.abandoned)
  const recent = daily.slice(-2).map((r) => r.exercise)
  const focus = state.nextFocus?.trap || null
  const rng = makeRng(`plan:${today}:${day}`)
  const sessions = daily.length
  const weak = sessions >= 5 ? weakestSkill(profile) : null
  const recovery = day > 1 ? needsRecovery(state, today, addDays) : null
  const exercises = Object.keys(block.pool)

  let exercise
  let why = []
  if (day === 1) {
    exercise = 'observer'
    why.push('Every programme starts with The Observer')
  } else if (recovery) {
    // Confidence-building: the exercise you do best in this block's pool.
    exercise = exercises.slice().sort((a, b2) => recentAcc(state, b2) - recentAcc(state, a))[0]
    why.push(`${recovery} — a lighter session on something you do well`)
  } else if (block.checkpoint) {
    // Benchmark the least-practised exercise (ties: weakest level).
    exercise = exercises.slice().sort((a, b2) => levels[a].attempts - levels[b2].attempts || levels[a].level - levels[b2].level || rng.next() - 0.5)
      .find((e) => e !== recent.at(-1)) || exercises[0]
    why.push(`Checkpoint: benchmarking ${EXERCISES[exercise].name}, your least-practised exercise`)
  } else {
    const scores = exercises.map((ex) => {
      let s = block.pool[ex] + rng.next()
      const reasons = []
      if (focus && TRAP_TO_EXERCISE[focus] === ex) { s += 2.5; reasons.push(`targets ${TRAPS[focus].focus}`) }
      if (block.focusTrap && TRAP_TO_EXERCISE[block.focusTrap] === ex) s += 1
      if (weak && SKILL_TO_EXERCISE[weak] === ex) { s += block.adaptive ? 3 : 1.5; reasons.push(`trains ${SKILLS[weak].label.toLowerCase()}, your weakest skill`) }
      if (recent.at(-1) === ex) s -= 4
      if (recent.at(-2) === ex) s -= 1.5
      return { ex, s, reasons }
    }).sort((x, y) => y.s - x.s)
    exercise = scores[0].ex
    why = scores[0].reasons.length ? scores[0].reasons.map((r) => r[0].toUpperCase() + r.slice(1)) : [`Part of this week’s mix: ${block.title.toLowerCase()}`]
  }

  const ability = levels[exercise].level
  let level = Math.min(ability, block.maxLevel)
  if (recovery) level = Math.max(1, level - 1)
  const focusTrap = focus || block.focusTrap || null
  return {
    exercise, level, ability, focusTrap, block, month: monthForDay(day), recovery: !!recovery,
    blind: !!block.blind, checkpoint: !!block.checkpoint, adaptive: !!block.adaptive || !!focus,
    reasons: why,
  }
}

function recentAcc(state, ex) {
  const list = state.results.filter((r) => r.exercise === ex && !r.abandoned).slice(-3)
  if (!list.length) return 0.5
  return list.reduce((s, r) => s + r.items.filter((i) => i.correct).length / Math.max(1, r.items.length + (r.falseFlags?.length || 0)), 0) / list.length
}
