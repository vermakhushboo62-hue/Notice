import { useMemo, useRef, useState } from 'react'
import { generateMemory } from './memoryGen.js'
import { levelParams } from './levels.js'
import Shape from './Shape.jsx'
import { Button, Countdown } from '../components/ui.jsx'

function Grid({ cells, size, selected, onTap, reveal }) {
  const SIZE = size
  return (
    <div className="mx-auto grid max-w-sm gap-1.5 rounded-xl bg-surface-2 p-1.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
      {cells.map((o, i) => {
        const sel = selected?.has(i)
        const mark = reveal?.[i]
        return (
          <button
            key={i}
            type="button"
            disabled={!onTap}
            onClick={() => onTap?.(i)}
            aria-label={o ? `${o.color} ${o.shape}` : 'empty cell'}
            aria-pressed={sel || undefined}
            className={`aspect-square rounded-lg bg-surface transition ${onTap ? 'cursor-pointer' : 'cursor-default'} ${sel ? 'ring-2 ring-ink' : ''} ${mark === 'hit' ? 'ring-2 ring-good' : mark === 'miss' ? 'ring-2 ring-bad ring-dashed' : ''}`}
          >
            {o && <svg viewBox="0 0 100 100" className="h-full w-full"><Shape {...o} /></svg>}
          </button>
        )
      })}
    </div>
  )
}

export default function Memory({ seed, focusTrap, level = 2, onDone }) {
  const params = levelParams('memory', level)
  const STUDY_SECONDS = params.study
  const SIZE = params.size
  const N = params.changes
  const data = useMemo(() => generateMemory(seed, focusTrap, params), [seed, focusTrap, level]) // eslint-disable-line react-hooks/exhaustive-deps
  const [phase, setPhase] = useState('ready')
  const [selected, setSelected] = useState(new Set())
  const start = useRef(0)

  if (phase === 'ready') {
    return (
      <div className="space-y-5">
        <p className="text-ink-2">Study an arrangement of shapes for <b>{STUDY_SECONDS} seconds</b>. Then you'll see it again with <b>{N} changes</b> — something moved, changed colour, changed shape or appeared. Tap the {N} that changed.</p>
        <Button onClick={() => setPhase('study')}>I'm ready</Button>
      </div>
    )
  }
  if (phase === 'study') {
    return (
      <div className="space-y-4">
        <Countdown seconds={STUDY_SECONDS} onEnd={() => setPhase('gap')} />
        <Grid cells={data.before} size={SIZE} />
      </div>
    )
  }
  if (phase === 'gap') {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="font-display text-xl">Hold it in mind…</p>
        <Countdown seconds={3} label="sec" onEnd={() => { start.current = Date.now(); setPhase('find') }} />
      </div>
    )
  }

  const toggle = (i) => {
    const s = new Set(selected)
    if (s.has(i)) s.delete(i)
    else if (s.size < N + 2) s.add(i)
    setSelected(s)
  }
  const finish = () => {
    const used = new Set()
    const items = data.changes.map((c, k) => {
      const hit = selected.has(c.cell) ? c.cell : c.alt != null && selected.has(c.alt) ? c.alt : null
      if (hit != null) used.add(hit)
      return { id: `m${k}`, label: c.label, skill: 'recall', trap: c.trap, correct: hit != null, why: c.why }
    })
    const falseFlags = [...selected].filter((i) => !used.has(i)).map((i) => ({ label: `Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1} hadn't changed` }))
    onDone({ items, falseFlags, answerMs: Date.now() - start.current, contentId: null })
  }
  return (
    <div className="space-y-4">
      <p className="text-ink-2">{N} things changed. Tap them <span className="text-muted">({selected.size} selected)</span>.</p>
      <Grid cells={data.after} size={SIZE} selected={selected} onTap={toggle} />
      <Button onClick={finish} disabled={!selected.size}>Check my answer</Button>
    </div>
  )
}
