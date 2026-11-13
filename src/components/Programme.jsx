import { EXERCISES, EXERCISE_ORDER, TRAPS } from '../lib/constants.js'
import { BLOCKS, MONTHS, PROGRAM_DAYS, abilityLevels, blockForDay, completionStats } from '../lib/program.js'
import { LEVELS, LEVEL_SUMMARY } from '../exercises/levels.js'
import { Card } from './ui.jsx'

export function LevelPips({ level, max = 5 }) {
  return (
    <span className="inline-flex gap-1" aria-label={`Level ${level} of ${max}`}>
      {Array.from({ length: max }, (_, i) => <span key={i} className={`h-2 w-2 rounded-full ${i < level ? 'bg-ink' : 'bg-line'}`} />)}
    </span>
  )
}

// Compact 90-day map used on the dashboard.
export function ProgrammeMap({ day, doneCount, todayDone }) {
  const current = blockForDay(day)
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {MONTHS.map((m) => (
        <div key={m.n} className={`rounded-xl p-4 ${current?.month === m.n ? 'bg-accent-soft' : 'bg-surface-2'}`}>
          <div className="eyebrow">Month {m.n} · {m.tagline}</div>
          <div className="mt-1 font-semibold">{m.title}</div>
          <ul className="mt-3 space-y-2">
            {BLOCKS.filter((b) => b.month === m.n).map((b) => (
              <li key={b.n} className="text-xs">
                <div className={`flex items-baseline justify-between gap-2 ${current === b ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                  <span>{b.checkpoint ? '◆ ' : ''}{b.title}</span>
                  <span className="tabular text-muted">{b.start}–{b.start + b.days - 1}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {Array.from({ length: b.days }, (_, k) => {
                    const d = b.start + k
                    const done = d <= doneCount
                    const isToday = d === day && !todayDone
                    return <span key={k} title={`Day ${d}`} className={`h-2 w-2 rounded-full ${done ? 'bg-ink' : isToday ? 'bg-surface ring-2 ring-accent' : 'bg-line'}`} />
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Programme({ state, day }) {
  const levels = abilityLevels(state)
  const stats = completionStats(state)
  const current = blockForDay(day)
  return (
    <div className="space-y-5">
      <Card>
        <div className="eyebrow">{day > PROGRAM_DAYS ? 'Maintenance' : `Day ${day} of ${PROGRAM_DAYS}`}</div>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">The 90-day programme</h2>
        <p className="mt-3 max-w-2xl text-ink-2">Three months, thirteen blocks, one 5-minute challenge a day. Each block sets a theme and a mix of exercises. Every day NOTICE picks from that mix based on how you're doing: what you finish, how accurately, how quickly, and which traps catch you.</p>
      </Card>

      {MONTHS.map((m) => (
        <Card key={m.n}>
          <div className="eyebrow">Month {m.n} · Days {(m.n - 1) * 30 + 1}–{m.n * 30}</div>
          <h3 className="mt-1 font-display text-xl">{m.title} <span className="text-ink-2">— {m.tagline}</span></h3>
          <p className="mt-1 text-sm text-ink-2">{m.detail}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs text-muted">
                <tr><th className="py-2 pr-3 font-semibold">Days</th><th className="py-2 pr-3 font-semibold">Block</th><th className="py-2 pr-3 font-semibold">Exercise mix</th><th className="py-2 font-semibold">Up to</th></tr>
              </thead>
              <tbody>
                {BLOCKS.filter((b) => b.month === m.n).map((b) => {
                  const total = Object.values(b.pool).reduce((a, c) => a + c, 0)
                  return (
                    <tr key={b.n} className={`border-t border-line align-top ${current === b ? 'bg-accent-soft' : ''}`}>
                      <td className="py-2.5 pr-3 tabular text-ink-2 whitespace-nowrap">{b.start}–{b.start + b.days - 1}</td>
                      <td className="py-2.5 pr-3">
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-ink-2">{b.detail}</div>
                        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                          {b.checkpoint && <span className="rounded-full bg-surface-2 px-2 py-0.5">Checkpoint</span>}
                          {b.blind && <span className="rounded-full bg-surface-2 px-2 py-0.5">Counts hidden</span>}
                          {b.adaptive && <span className="rounded-full bg-surface-2 px-2 py-0.5">Fully adaptive</span>}
                          {b.focusTrap && <span className="rounded-full bg-surface-2 px-2 py-0.5">Bias: {TRAPS[b.focusTrap].focus}</span>}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-ink-2">
                        {Object.entries(b.pool).sort((x, y) => y[1] - x[1]).map(([ex, w]) => `${EXERCISES[ex].name.replace('The ', '')} ${Math.round((w / total) * 100)}%`).join(' · ')}
                      </td>
                      <td className="py-2.5 tabular">L{b.maxLevel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card>
        <h3 className="font-display text-xl">How the daily mix is chosen</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-2">
          <li><b className="text-ink">Start from the block's mix.</b> Each block weights its exercises (the percentages above are starting odds).</li>
          <li><b className="text-ink">Lean toward your last mistake.</b> The exercise that trains the trap you fell for most recently gets a strong boost.</li>
          <li><b className="text-ink">Lean toward your weakest skill</b> once you have 5 sessions, and much more strongly in block 12.</li>
          <li><b className="text-ink">Avoid repeats.</b> Yesterday's exercise is heavily discounted, the day before's slightly.</li>
          <li><b className="text-ink">Recovery days.</b> If you left a session early, struggled twice in a row, or were away 3+ days, you get a lighter session: one level easier, on the exercise you're doing best.</li>
          <li><b className="text-ink">Checkpoints</b> (days 29–30, 59–60, 89–90) benchmark the exercises you've practised least.</li>
        </ol>
      </Card>

      <Card>
        <h3 className="font-display text-xl">Your levels</h3>
        <p className="mt-1 text-sm text-ink-2">Two sessions in a row with ≥85% accuracy finished within 5 minutes moves you up a level. Under 50% accuracy, over 8 minutes, or leaving early moves you down one. The block caps how high a level can go.</p>
        {stats && <p className="mt-2 text-sm"><b>{stats.completionRate}%</b> of your last {stats.started} daily session{stats.started === 1 ? '' : 's'} finished · <b>{stats.onTimeRate}%</b> of those within 5 minutes.</p>}
        <ul className="mt-4 divide-y divide-line">
          {EXERCISE_ORDER.map((ex) => {
            const a = levels[ex]
            return (
              <li key={ex} className="grid gap-2 py-3 sm:grid-cols-[12rem_7rem_1fr] sm:items-center">
                <div><div className="font-semibold">{EXERCISES[ex].name}</div><div className="text-xs text-muted">{a.attempts} sessions</div></div>
                <div className="flex items-center gap-2"><LevelPips level={a.level} /><span className="text-xs tabular">L{a.level}</span></div>
                <div className="text-xs text-ink-2">
                  <div>Now: {LEVEL_SUMMARY[ex](LEVELS[ex][a.level - 1])}</div>
                  {a.level < 5 && <div className="text-muted">Next: {LEVEL_SUMMARY[ex](LEVELS[ex][a.level])}{a.ups ? ' · one more strong session to level up' : ''}</div>}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
