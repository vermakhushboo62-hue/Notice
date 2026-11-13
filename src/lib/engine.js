import { SKILL_ORDER, TRAPS, EXERCISES, TRAP_TO_EXERCISE } from './constants.js'
import { planDay } from './program.js'

// ---------- dates ----------
export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d + n))
}

// ---------- results helpers ----------
// Completed results only; abandoned sessions are kept for the ability model.
export const finished = (state) => state.results.filter((r) => !r.abandoned)
export const dailyResults = (state) => state.results.filter((r) => r.mode === 'daily' && !r.abandoned)
export const todaysResult = (state, today = dateKey()) =>
  state.results.find((r) => r.mode === 'daily' && !r.abandoned && r.date === today) || null

export function accuracyOf(result) {
  const total = result.items.length + (result.falseFlags?.length || 0)
  if (!total) return 0
  return result.items.filter((i) => i.correct).length / total
}
export const scoreOf = (result) => ({
  correct: result.items.filter((i) => i.correct).length,
  total: result.items.length,
})

// Day number in the 90-day programme = completed daily sessions before today + 1.
export function dayNumber(state, today = dateKey()) {
  const before = dailyResults(state).filter((r) => r.date < today).length
  return before + 1
}

// ---------- profile ----------
// Recency-weighted accuracy per skill across individual question items.
export function attentionProfile(state, window = 40) {
  const items = []
  for (const r of finished(state)) for (const it of r.items) items.push({ ...it, date: r.date })
  const out = {}
  for (const skill of SKILL_ORDER) {
    const list = items.filter((i) => i.skill === skill).slice(-window)
    let w = 0, s = 0
    list.forEach((it, idx) => {
      const weight = 0.5 + (idx + 1) / list.length // newer items count more
      w += weight
      s += it.correct ? weight : 0
    })
    out[skill] = { score: list.length ? Math.round((s / w) * 100) : null, n: list.length }
  }
  return out
}
export const CALIBRATION_MIN = 8

export function weakestSkill(profile) {
  const ranked = SKILL_ORDER.map((k) => ({ k, ...profile[k] }))
  const untested = ranked.find((r) => r.n === 0)
  if (untested) return untested.k
  ranked.sort((a, b) => a.score - b.score)
  return ranked[0].k
}

// ---------- scheduling ----------
// The 90-day programme lives in program.js; this wraps it with today's context.
export function planForDay(state, day, today = dateKey()) {
  return planDay(state, day, { today, addDays, weakestSkill, profile: attentionProfile(state) })
}

// ---------- diagnosis ----------
const MIN_EXPECTED_MS = { observer: 20000, proofreader: 60000, detective: 45000, memory: 8000, auditor: 45000 }

export function diagnose(result, day) {
  const noticed = result.items.filter((i) => i.correct)
  const missed = result.items.filter((i) => !i.correct)
  const acc = accuracyOf(result)
  const rushed = result.answerMs < (MIN_EXPECTED_MS[result.exercise] || 30000) && acc < 0.8

  const counts = {}
  for (const m of missed) counts[m.trap] = (counts[m.trap] || 0) + 1
  if ((result.falseFlags?.length || 0) >= 2) counts.assuming = (counts.assuming || 0) + 1
  if (rushed) counts.rushing = (counts.rushing || 0) + 2
  const reasons = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([trap, n]) => ({ trap, n, ...TRAPS[trap] }))

  const top = reasons[0]?.trap || null
  const when = 'Your next sessions'
  let summary
  let nextFocus
  if (top) {
    nextFocus = { trap: top, fromExercise: result.exercise }
    const ex = EXERCISES[TRAP_TO_EXERCISE[top]].name
    summary = day
      ? `${headline(result, noticed, missed)} ${when} will lean toward ${TRAPS[top].focus} (${ex}).`
      : `${headline(result, noticed, missed)} Practice doesn’t change your daily plan, but ${TRAPS[top].focus} is the pattern to watch — try ${ex}.`
  } else {
    nextFocus = null
    summary = day ? `Clean sweep — you caught every detail. ${when} will lean toward your weakest skill.` : 'Clean sweep — you caught every detail.'
  }
  return { noticed, missed, reasons, nextFocus, summary, rushed }
}

function headline(result, noticed, missed) {
  if (!missed.length) return 'You caught every detail.'
  const traps = new Set(missed.map((m) => m.trap))
  if (traps.size === 1 && traps.has('spatial'))
    return `You correctly identified ${noticed.length ? 'most objects' : 'what you could'} but missed ${missed.length === 1 ? 'a change' : `${missed.length} changes`} in their positioning.`
  return `You noticed ${noticed.length} of ${result.items.length} details and missed ${missed.length}.`
}

// ---------- dashboard metrics ----------
export function streak(state, today = dateKey()) {
  const days = new Set(dailyResults(state).map((r) => r.date))
  let cursor = days.has(today) ? today : addDays(today, -1)
  let n = 0
  while (days.has(cursor)) { n++; cursor = addDays(cursor, -1) }
  return n
}

export function weeklyAccuracy(state, today = dateKey()) {
  const from = addDays(today, -6)
  const list = finished(state).filter((r) => r.date >= from && r.date <= today)
  if (!list.length) return null
  return Math.round((list.reduce((s, r) => s + accuracyOf(r), 0) / list.length) * 100)
}

export function trend(state, days = 14, today = dateKey()) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i)
    const r = state.results.find((x) => x.mode === 'daily' && !x.abandoned && x.date === d)
    out.push({ date: d, acc: r ? Math.round(accuracyOf(r) * 100) : null, exercise: r?.exercise })
  }
  return out
}

export function missPatterns(state, lastN = 14) {
  const recent = finished(state).slice(-lastN)
  const counts = {}
  for (const r of recent) for (const it of r.items) if (!it.correct) counts[it.trap] = (counts[it.trap] || 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([trap, n]) => ({ trap, n, label: TRAPS[trap].label }))
}

export function formatMs(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
