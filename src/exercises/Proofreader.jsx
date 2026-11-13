import { useMemo, useRef, useState } from 'react'
import { PROOF_DOCS, parseDoc } from '../data/proofreader.js'
import { makeRng } from '../lib/rng.js'
import { Button } from '../components/ui.jsx'

export function pickDoc(seed, focusTrap) {
  const rng = makeRng(seed)
  if (focusTrap) {
    const scored = PROOF_DOCS.map((d) => ({ d, n: parseDoc(d.text).filter((s) => s.trap === focusTrap).length }))
    const best = Math.max(...scored.map((x) => x.n))
    if (best > 0) return rng.pick(scored.filter((x) => x.n === best)).d
  }
  return rng.pick(PROOF_DOCS)
}

export default function Proofreader({ seed, focusTrap, onDone }) {
  const doc = useMemo(() => pickDoc(seed, focusTrap), [seed, focusTrap])
  // Flatten into tokens: whitespace (inert), words (tappable), errors (tappable).
  const tokens = useMemo(() => {
    const out = []
    for (const seg of parseDoc(doc.text)) {
      if (seg.type === 'error') out.push({ kind: 'error', text: seg.shown, seg })
      else for (const part of seg.value.split(/(\s+)/)) if (part) out.push({ kind: /^\s+$/.test(part) ? 'space' : 'word', text: part })
    }
    return out
  }, [doc])
  const errorCount = tokens.filter((t) => t.kind === 'error').length
  const [marked, setMarked] = useState(new Set())
  const start = useRef(Date.now())

  const toggle = (i) => {
    const s = new Set(marked)
    s.has(i) ? s.delete(i) : s.add(i)
    setMarked(s)
  }
  const finish = () => {
    const items = tokens.map((t, i) => ({ t, i })).filter(({ t }) => t.kind === 'error').map(({ t, i }) => ({
      id: t.seg.id, label: `“${t.seg.shown}” should be “${t.seg.correct}”`, skill: t.seg.skill, trap: t.seg.trap,
      correct: marked.has(i), why: t.seg.why,
    }))
    const falseFlags = [...marked].filter((i) => tokens[i].kind === 'word').map((i) => ({ label: `“${tokens[i].text}” was correct` }))
    onDone({ items, falseFlags, answerMs: Date.now() - start.current, meta: { docId: doc.id } })
  }

  return (
    <div className="space-y-4">
      <p className="text-ink-2">This {doc.kind.toLowerCase()} contains <b>{errorCount} errors</b> — spelling, numbers that don't add up, and details that contradict each other. Tap each wrong word or figure. Tap again to unmark.</p>
      <div className="rounded-xl border border-line bg-bg p-4 sm:p-5">
        <div className="eyebrow mb-3">{doc.title}</div>
        <div className="whitespace-pre-wrap text-[15px] leading-7">
          {tokens.map((t, i) => t.kind === 'space' ? <span key={i}>{t.text}</span> : (
            <span
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => toggle(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
              className={`cursor-pointer rounded px-0.5 -mx-0.5 transition ${marked.has(i) ? 'bg-accent-soft underline decoration-accent decoration-2 underline-offset-4' : 'hover:bg-surface-2'}`}
            >{t.text}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={finish}>Check document</Button>
        <span className="text-sm text-muted">{marked.size} marked · {errorCount} to find</span>
      </div>
    </div>
  )
}
