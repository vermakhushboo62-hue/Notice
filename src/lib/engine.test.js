import { describe, it, expect } from 'vitest'
import { planForDay, diagnose, streak, dayNumber } from './engine.js'
import { emptyState } from './storage.js'

const r = (date, correctFlags, trap = 'spatial') => ({
  id: date, date, mode: 'daily', exercise: 'memory', day: 1, answerMs: 60000, durationMs: 90000, falseFlags: [],
  items: correctFlags.map((c, i) => ({ id: 'i' + i, skill: 'recall', trap, correct: c })),
})

describe('engine', () => {
  it('day 1 follows the plan and starts with The Observer', () => {
    expect(planForDay(emptyState(), 1).exercise).toBe('observer')
  })
  it('adaptive days target the last trap', () => {
    const s = { ...emptyState(), nextFocus: { trap: 'numbers' } }
    expect(planForDay(s, 2)).toMatchObject({ exercise: 'auditor', adaptive: true })
  })
  it('diagnoses spatial misses with the promised message', () => {
    const d = diagnose(r('2026-01-01', [true, false, false]), 1)
    expect(d.nextFocus.trap).toBe('spatial')
    expect(d.summary).toMatch(/positioning.*Tomorrow’s exercise will focus on spatial relationships/)
  })
  it('counts streaks and day numbers', () => {
    const s = { ...emptyState(), results: [r('2026-01-01', [true]), r('2026-01-02', [true]), r('2026-01-04', [true])] }
    expect(streak(s, '2026-01-04')).toBe(1)
    expect(streak(s, '2026-01-03')).toBe(2)
    expect(dayNumber(s, '2026-01-05')).toBe(4)
  })
})
