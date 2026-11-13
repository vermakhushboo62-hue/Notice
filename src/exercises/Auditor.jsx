import { useMemo, useRef, useState } from 'react'
import { generateAudit } from '../data/auditor.js'
import { Button } from '../components/ui.jsx'

function Table({ title, columns, rows, onTap, selected }) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[480px] text-sm tabular">
          <thead className="bg-surface-2 text-left text-xs text-ink-2">
            <tr>{columns.map((c) => <th key={c} className="px-3 py-2 font-semibold">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-line">
                {row.map((v, c) => {
                  const key = `${r}:${c}`
                  const sel = selected?.has(key)
                  return (
                    <td key={c} className="p-0">
                      {onTap ? (
                        <button type="button" onClick={() => onTap(key)} aria-pressed={sel}
                          className={`w-full px-3 py-2 text-left transition ${sel ? 'bg-accent-soft underline decoration-accent decoration-2 underline-offset-4' : 'hover:bg-surface-2'}`}>{v}</button>
                      ) : <div className="px-3 py-2">{v}</div>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Auditor({ seed, focusTrap, onDone }) {
  const data = useMemo(() => generateAudit(seed, focusTrap), [seed, focusTrap])
  const [selected, setSelected] = useState(new Set())
  const start = useRef(Date.now())
  const toggle = (k) => { const s = new Set(selected); s.has(k) ? s.delete(k) : s.add(k); setSelected(s) }

  const finish = () => {
    const { columns } = data.table
    const items = data.changes.map((ch, i) => ({
      id: `a${i}`, label: `${data.a[ch.r][0]} · ${columns[ch.c]}: “${ch.from}” became “${ch.to}”`,
      skill: ch.skill, trap: ch.trap, correct: selected.has(`${ch.r}:${ch.c}`), why: `${ch.how}.`,
    }))
    const real = new Set(data.changes.map((c) => `${c.r}:${c.c}`))
    const falseFlags = [...selected].filter((k) => !real.has(k)).map((k) => {
      const [r, c] = k.split(':').map(Number)
      return { label: `${data.a[r][0]} · ${columns[c]} was identical` }
    })
    onDone({ items, falseFlags, answerMs: Date.now() - start.current, meta: { table: data.table.id } })
  }

  return (
    <div className="space-y-5">
      <p className="text-ink-2">Version B is meant to be a copy of Version A. It has <b>{data.changes.length} differences</b>. Tap each cell in Version B that differs.</p>
      <Table title={`Version A · ${data.table.title}`} columns={data.table.columns} rows={data.a} />
      <Table title="Version B · tap the differences" columns={data.table.columns} rows={data.b} onTap={toggle} selected={selected} />
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={finish} disabled={!selected.size}>Check differences</Button>
        <span className="text-sm text-muted">{selected.size} marked · {data.changes.length} to find</span>
      </div>
    </div>
  )
}
