import { EXERCISES, TRAPS, WEEKS, PROGRAM_DAYS } from '../lib/constants.js'
import {
  attentionProfile, dailyResults, formatMs, missPatterns, planForDay, scoreOf, accuracyOf, trend, weekForDay,
} from '../lib/engine.js'
import { Button, Card, Stat } from './ui.jsx'
import { MissBars, ProfileBars, TrendChart } from './Charts.jsx'

export default function Dashboard({ state, today, day, todayResult, streakCount, weekly, onStart, onReview }) {
  const plan = planForDay(state, day)
  const ex = EXERCISES[plan.exercise]
  const profile = attentionProfile(state)
  const doneCount = dailyResults(state).length
  const tomorrow = todayResult ? planForDay(state, day + 1) : null
  const last = todayResult || state.results.filter((r) => r.mode === 'daily').at(-1)
  const lastScore = last ? scoreOf(last) : null

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <div className="eyebrow">Day {String(day).padStart(2, '0')} · 5 minutes{plan.week ? ` · Week ${plan.week.n}: ${plan.week.title}` : day > PROGRAM_DAYS ? ' · Maintenance' : ''}</div>
        {!todayResult ? (
          <>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Today's challenge: {ex.name}</h2>
            <p className="mt-1 text-sm font-medium text-accent">{ex.number} · {ex.kind}</p>
            <p className="mt-3 max-w-xl text-ink-2">{ex.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-surface-2 px-3 py-1 font-medium">{plan.adaptive ? 'Adaptive day' : 'Programme day'}</span>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-ink-2">{plan.reason}</span>
              {plan.focusTrap && !plan.adaptive && <span className="rounded-full bg-accent-soft px-3 py-1">Focus: {TRAPS[plan.focusTrap].focus}</span>}
            </div>
            <Button className="mt-5" onClick={onStart}>Begin today's challenge</Button>
          </>
        ) : (
          <>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Today's practice is done.</h2>
            <p className="mt-2 max-w-xl text-ink-2">{todayResult.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="ghost" onClick={() => onReview(todayResult.id)}>Review what you missed</Button>
              <span className="text-sm text-muted">Tomorrow: {EXERCISES[tomorrow.exercise].name}{tomorrow.focusTrap ? ` · focus on ${TRAPS[tomorrow.focusTrap].focus}` : ''}</span>
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg">Your daily scorecard</h3>
          {last && !todayResult && <span className="text-xs text-muted">Last session · {EXERCISES[last.exercise].name}</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Accuracy" value={lastScore ? `${lastScore.correct}/${lastScore.total}` : '—'} sub={last ? `${Math.round(accuracyOf(last) * 100)}%` : 'no sessions yet'} />
          <Stat label="Time taken" value={last ? formatMs(last.durationMs) : '—'} />
          <Stat label="Day streak" value={streakCount} />
          <Stat label="Weekly accuracy" value={weekly == null ? '—' : `${weekly}%`} />
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg">Attention Profile</h3>
          <p className="mt-1 mb-4 text-xs text-muted">Recency-weighted accuracy over your last 40 items per skill.</p>
          <ProfileBars profile={profile} />
          <p className="mt-4 text-[11px] leading-relaxed text-muted">Practice scores from short exercises, not a cognitive or health assessment. They become meaningful only after several sessions.</p>
        </Card>
        <div className="space-y-5">
          <Card>
            <h3 className="font-display text-lg">Accuracy, last 14 days</h3>
            <div className="mt-3"><TrendChart data={trend(state, 14, today)} /></div>
          </Card>
          <Card>
            <h3 className="font-display text-lg">Why you miss things</h3>
            <p className="mt-1 mb-4 text-xs text-muted">Missed items by cause, last 14 sessions.</p>
            <MissBars data={missPatterns(state)} />
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-lg">30-day progression</h3>
          <span className="tabular text-sm text-muted">{Math.min(doneCount, PROGRAM_DAYS)}/{PROGRAM_DAYS}</span>
        </div>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEEKS.reduce((acc, w) => { acc.push({ ...w, start: acc.length ? acc.at(-1).start + acc.at(-1).plan.length : 1 }); return acc }, []).map((w) => {
            const current = weekForDay(day)?.n === w.n
            return (
              <li key={w.n} className={`rounded-xl p-4 ${current ? 'bg-accent-soft' : 'bg-surface-2'}`}>
                <div className="eyebrow">Week {w.n}</div>
                <div className="mt-1 font-semibold">{w.title}</div>
                <p className="mt-1 text-xs text-ink-2">{w.detail}</p>
                <div className="mt-3 flex flex-wrap gap-1.5" aria-label={`Days ${w.start} to ${w.start + w.plan.length - 1}`}>
                  {w.plan.map((_, k) => {
                    const d = w.start + k
                    const done = d <= doneCount
                    const isToday = d === day && !todayResult
                    return <span key={k} title={`Day ${d}`} className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-ink' : isToday ? 'ring-2 ring-accent bg-surface' : 'bg-line'}`} />
                  })}
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      {doneCount > 0 && (
        <Card>
          <h3 className="font-display text-lg">Recent sessions</h3>
          <ul className="mt-3 divide-y divide-line">
            {state.results.slice(-7).reverse().map((r) => {
              const s = scoreOf(r)
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => onReview(r.id)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm hover:text-accent">
                    <span><span className="tabular text-muted">{r.date.slice(5)}</span> · {EXERCISES[r.exercise].name}{r.mode === 'practice' && <span className="text-muted"> (practice)</span>}</span>
                    <span className="tabular font-semibold">{s.correct}/{s.total}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
