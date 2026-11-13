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
  it('a recent trap pulls in the exercise that trains it', () => {
    const s = { ...emptyState(), nextFocus: { trap: 'assuming' } }
    // Block 4 includes The Detective; across many dates it should be picked most often.
    const counts = {}
    for (let i = 1; i <= 28; i++) {
      const ex = planForDay(s, 23, `2027-02-${String(i).padStart(2, '0')}`).exercise
      counts[ex] = (counts[ex] || 0) + 1
    }
    expect(Math.max(...Object.values(counts))).toBe(counts.detective)
  })
  it('diagnoses spatial misses with the promised message', () => {
    const d = diagnose(r('2026-01-01', [true, false, false]), 1)
    expect(d.nextFocus.trap).toBe('spatial')
    expect(d.summary).toMatch(/positioning.*will lean toward spatial relationships/)
  })
  it('counts streaks and day numbers', () => {
    const s = { ...emptyState(), results: [r('2026-01-01', [true]), r('2026-01-02', [true]), r('2026-01-04', [true])] }
    expect(streak(s, '2026-01-04')).toBe(1)
    expect(streak(s, '2026-01-03')).toBe(2)
    expect(dayNumber(s, '2026-01-05')).toBe(4)
  })
})
