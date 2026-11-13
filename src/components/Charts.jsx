import { useState } from 'react'
import { SKILLS, SKILL_ORDER, EXERCISES } from '../lib/constants.js'
import { CALIBRATION_MIN } from '../lib/engine.js'

// Attention Profile: one horizontal bar per skill (single series, one hue).
export function ProfileBars({ profile }) {
  return (
    <ul className="space-y-3.5">
      {SKILL_ORDER.map((k) => {
        const { score, n } = profile[k]
        const calibrating = n < CALIBRATION_MIN
        return (
          <li key={k} title={`${SKILLS[k].label}: ${score ?? '—'}% across ${n} items`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{SKILLS[k].label}</span>
              <span className="tabular font-semibold">{score == null ? '—' : `${score}%`}</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-surface-2">
              {score != null && (
                <div className="h-full rounded-full" style={{ width: `${Math.max(score, 2)}%`, background: 'var(--bar)', opacity: calibrating ? 0.45 : 1 }} />
              )}
            </div>
            <div className="mt-1 text-[11px] text-muted">
              {SKILLS[k].pillar} · {n === 0 ? 'not yet measured' : calibrating ? `calibrating (${n}/${CALIBRATION_MIN} items)` : `${n} items`}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// 14-day accuracy trend: one bar per day, gaps for days without practice.
export function TrendChart({ data }) {
  const [hover, setHover] = useState(null)
  const W = 380, H = 150, padL = 30, padB = 22, padT = 10
  const slot = (W - padL) / data.length
  const bw = Math.min(22, slot - 6)
  const y = (v) => padT + (H - padT - padB) * (1 - v / 100)
  const h = hover != null ? data[hover] : null
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Daily accuracy for the last 14 days">
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={padL} x2={W} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeWidth="1" />
            <text x={padL - 6} y={y(g) + 3} textAnchor="end" fontSize="10" fill="var(--muted)">{g}%</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = padL + slot * i + slot / 2
          const label = i % 2 === data.length % 2 ? '' : d.date.slice(8)
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(i)}>
              <rect x={cx - slot / 2} y={padT} width={slot} height={H - padT - padB} fill="transparent" />
              {d.acc == null
                ? <circle cx={cx} cy={y(0) - 3} r="2" fill="var(--line)" />
                : <path d={roundTop(cx - bw / 2, y(d.acc), bw, y(0) - y(d.acc))} fill="var(--bar)" opacity={hover == null || hover === i ? 1 : 0.5} />}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--muted)">{label}</text>
            </g>
          )
        })}
      </svg>
      {h && (
        <div className="pointer-events-none absolute top-0 right-0 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs shadow-sm">
          <b>{new Date(h.date + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</b>
          <span className="text-ink-2"> · {h.acc == null ? 'no practice' : `${h.acc}% · ${EXERCISES[h.exercise].name}`}</span>
        </div>
      )}
    </div>
  )
}
function roundTop(x, y, w, h) {
  if (h <= 0) return ''
  const r = Math.min(4, w / 2, h)
  return `M${x} ${y + h} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h} Z`
}

export function MissBars({ data }) {
  if (!data.length) return <p className="text-sm text-muted">No misses recorded yet.</p>
  const max = Math.max(...data.map((d) => d.n))
  return (
    <ul className="space-y-2.5">
      {data.map((d) => (
        <li key={d.trap} className="grid grid-cols-[minmax(0,12rem)_1fr_2rem] items-center gap-3 text-sm" title={`${d.label}: ${d.n} misses`}>
          <span className="text-ink-2 leading-snug">{d.label}</span>
          <div className="h-2 rounded-full bg-surface-2"><div className="h-full rounded-full" style={{ width: `${(d.n / max) * 100}%`, background: 'var(--bar)' }} /></div>
          <span className="tabular text-right font-semibold">{d.n}</span>
        </li>
      ))}
    </ul>
  )
}
