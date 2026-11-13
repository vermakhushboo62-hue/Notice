import { describe, it, expect } from 'vitest'
import { BLOCKS, PROGRAM_DAYS, abilityLevels, blockForDay, outcomeOf } from './program.js'
import { planForDay } from './engine.js'
import { emptyState } from './storage.js'
import { generateProofDoc } from '../data/proofGen.js'
import { generateCase } from '../data/detectiveGen.js'
import { parseDoc } from '../data/proofreader.js'
import { generateMemory } from '../exercises/memoryGen.js'
import { LEVELS } from '../exercises/levels.js'

const res = (ex, acc, ms = 120000, extra = {}) => ({
  exercise: ex, mode: 'daily', date: '2027-01-01', durationMs: ms, falseFlags: [],
  items: Array.from({ length: 10 }, (_, i) => ({ correct: i < acc * 10, skill: 'visual', trap: 'similar' })), ...extra,
})

describe('programme structure', () => {
  it('covers exactly 90 days with three 30-day months', () => {
    expect(BLOCKS.reduce((a, b) => a + b.days, 0)).toBe(PROGRAM_DAYS)
    for (const m of [1, 2, 3]) expect(BLOCKS.filter((b) => b.month === m).reduce((a, b) => a + b.days, 0)).toBe(30)
    expect(blockForDay(29).checkpoint).toBe(true)
    expect(blockForDay(90).n).toBe('C3')
    expect(blockForDay(91)).toBe(null)
  })
})

describe('ability levels', () => {
  it('two strong sessions level up; a struggle levels down', () => {
    expect(outcomeOf(res('observer', 0.9))).toBe('mastered')
    expect(outcomeOf(res('observer', 0.9, 400000))).toBe('steady')
    expect(outcomeOf(res('observer', 0.9, 600000))).toBe('struggled')
    expect(outcomeOf(res('observer', 0, 1000, { abandoned: true }))).toBe('struggled')
    const s = { results: [res('observer', 0.9), res('observer', 1)] }
    expect(abilityLevels(s).observer.level).toBe(2)
    s.results.push(res('observer', 0.3))
    expect(abilityLevels(s).observer.level).toBe(1)
  })
  it('caps the level at the block ceiling and gives recovery days after leaving early', () => {
    const strong = Array.from({ length: 12 }, () => res('observer', 1))
    expect(abilityLevels({ results: strong }).observer.level).toBe(5)
    const s = { ...emptyState(), results: strong.map((r, i) => ({ ...r, date: `2027-01-${String(i + 1).padStart(2, '0')}` })) }
    const p = planForDay(s, 3, '2027-01-13')
    expect(p.level).toBeLessThanOrEqual(blockForDay(3).maxLevel)
    s.results.push({ ...res('observer', 0, 30000, { abandoned: true }), date: '2027-01-13' })
    const q = planForDay(s, 13, '2027-01-14')
    expect(q.recovery).toBe(true)
  })
})

describe('generated content', () => {
  it('proofreader docs have exactly the requested number of errors', () => {
    for (let i = 0; i < 150; i++) {
      const n = [4, 5, 6, 7][i % 4]
      const doc = generateProofDoc('p' + i, n)
      const errs = parseDoc(doc.text).filter((s) => s.type === 'error')
      expect(errs.length).toBe(n)
      for (const e of errs) expect(e.shown).not.toBe(e.correct)
      expect(doc.text).not.toMatch(/undefined|NaN/)
    }
  })
  it('detective cases have the requested statements with a mix of verdicts', () => {
    for (let i = 0; i < 150; i++) {
      const n = 4 + (i % 4)
      const c = generateCase('d' + i, n)
      expect(c.statements.length).toBe(n)
      expect(c.statements.some((s) => s.verdict === 'missing')).toBe(true)
      expect(c.source).not.toMatch(/undefined|NaN/)
    }
  })
  it('memory grids honour every level', () => {
    LEVELS.memory.forEach((p, i) => {
      for (let k = 0; k < 40; k++) {
        const g = generateMemory(`m${i}-${k}`, k % 3 === 0 ? 'spatial' : null, p)
        expect(g.after.length).toBe(p.size * p.size)
        expect(g.changes.length).toBe(p.changes)
        expect(new Set(g.changes.map((c) => c.cell)).size).toBe(p.changes)
      }
    })
  })
})
