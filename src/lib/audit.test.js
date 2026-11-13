import { describe, it, expect } from 'vitest'
import { generateAudit } from '../data/auditor.js'
import { PROOF_DOCS, parseDoc } from '../data/proofreader.js'

describe('auditor generator', () => {
  it('is deterministic and produces 5 real changes, one per row', () => {
    for (let i = 0; i < 200; i++) {
      const g1 = generateAudit('seed-' + i)
      const g2 = generateAudit('seed-' + i)
      expect(g1.b).toEqual(g2.b)
      expect(g1.changes.length).toBe(5)
      const rows = new Set(g1.changes.map((c) => c.r))
      expect(rows.size).toBe(5)
      for (const ch of g1.changes) expect(g1.b[ch.r][ch.c]).not.toBe(g1.a[ch.r][ch.c])
    }
  })
})

describe('proofreader docs', () => {
  it('every doc has 5–8 errors with explanations', () => {
    for (const d of PROOF_DOCS) {
      const errs = parseDoc(d.text).filter((s) => s.type === 'error')
      expect(errs.length).toBeGreaterThanOrEqual(5)
      expect(errs.length).toBeLessThanOrEqual(8)
      for (const e of errs) { expect(e.why.length).toBeGreaterThan(5); expect(e.shown).not.toBe(e.correct) }
    }
  })
})
