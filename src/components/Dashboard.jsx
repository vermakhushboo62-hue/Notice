import { EXERCISES, EXERCISE_ORDER, TRAPS } from '../lib/constants.js'
import { attentionProfile, dailyResults, formatMs, missPatterns, planForDay, scoreOf, accuracyOf, trend } from '../lib/engine.js'
import { PROGRAM_DAYS, abilityLevels, completionStats } from '../lib/program.js'
import { LEVELS, LEVEL_SUMMARY } from '../exercises/levels.js'
import { Button, Card, Stat } from './ui.jsx'
import { MissBars, ProfileBars, TrendChart } from './Charts.jsx'
import { LevelPips, ProgrammeMap } from './Programme.jsx'

export default function Dashboard({ state, today, day, todayResult, streakCount, weekly, onStart, onReview, onProgramme }) {
  const plan = planForDay(state, day, today)
  const ex = EXERCISES[plan.exercise]
  const profile = attentionProfile(state)
  const levels = abilityLevels(state)
  const stats = completionStats(state)
  const doneCount = dailyResults(state).length
  const tomorrow = todayResult ? planForDay(state, day + 1, today) : null
  const last = todayResult || dailyResults(state).at(-1)
  const lastScore = last ? scoreOf(last) : null
  const where = day > PROGRAM_DAYS ? 'Maintenance' : `Month ${plan.month.n} · ${plan.block.title}`

  return (
    <div className="space-y-5">
      <Card>
        <div className="eyebrow">Day {String(day).padStart(2, '0')} · 5 minutes · {where}</div>
        {!todayResult ? (
          <>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Today's challenge: {ex.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-accent">{ex.number} · {ex.kind} · Level {plan.level} <LevelPips level={plan.level} /></p>
            <p className="mt-3 max-w-xl text-ink-2">{ex.blurb}</p>
            <p className="mt-1 text-sm text-muted">{LEVEL_SUMMARY[plan.exercise](LEVELS[plan.exercise][plan.level - 1])}{plan.blind ? ' · counts hidden this week' : ''}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {plan.recovery && <span className="rounded-full bg-good-soft px-3 py-1 font-medium">Recovery day</span>}
              {plan.checkpoint && <span className="rounded-full bg-accent-soft px-3 py-1 font-medium">Checkpoint</span>}
              {plan.reasons.map((r) => <span key={r} className="rounded-full bg-surface-2 px-3 py-1 text-ink-2">{r}</span>)}
            </div>
            <Button className="mt-5" onClick={onStart}>Begin today's challenge</Button>
          </>
        ) : (
          <>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Today's practice is done.</h2>
            <p className="mt-2 max-w-xl text-ink-2">{todayResult.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="ghost" onClick={() => onReview(todayResult.id)}>Review what you missed</Button>
              <span className="text-sm text-muted">Likely tomorrow: {EXERCISES[tomorrow.exercise].name}, level {tomorrow.level}{tomorrow.focusTrap ? ` · leaning toward ${TRAPS[tomorrow.focusTrap].focus}` : ''}</span>
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg">Your daily scorecard</h3>
          {last && !todayResult && <span className="text-xs text-muted">Last session · {EXERCISES[last.exercise].name}</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Accuracy" value={lastScore ? `${lastScore.correct}/${lastScore.total}` : '—'} sub={last ? `${Math.round(accuracyOf(last) * 100)}%` : 'no sessions yet'} />
          <Stat label="Time taken" value={last ? formatMs(last.durationMs) : '—'} />
          <Stat label="Day streak" value={streakCount} />
          <Stat label="Weekly accuracy" value={weekly == null ? '—' : `${weekly}%`} />
          <Stat label="Finished" value={stats ? `${stats.completionRate}%` : '—'} sub={stats ? `${stats.finished} of last ${stats.started}` : 'sessions completed'} />
          <Stat label="On time" value={stats ? `${stats.onTimeRate}%` : '—'} sub="within 5 minutes" />
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
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg">Exercise levels</h3>
              <button type="button" onClick={onProgramme} className="text-xs text-ink-2 hover:text-ink underline-offset-4 hover:underline">How levels work</button>
            </div>
            <ul className="mt-3 space-y-2.5">
              {EXERCISE_ORDER.map((k) => (
                <li key={k} className="flex items-center justify-between gap-3 text-sm" title={LEVEL_SUMMARY[k](LEVELS[k][levels[k].level - 1])}>
                  <span>{EXERCISES[k].name}</span>
                  <span className="flex items-center gap-2"><LevelPips level={levels[k].level} /><span className="tabular w-6 text-right text-xs font-semibold">L{levels[k].level}</span></span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-display text-lg">Accuracy, last 14 days</h3>
            <div className="mt-3"><TrendChart data={trend(state, 14, today)} /></div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="font-display text-lg">Why you miss things</h3>
        <p className="mt-1 mb-4 text-xs text-muted">Missed items by cause, last 14 sessions.</p>
        <MissBars data={missPatterns(state)} />
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-lg">90-day programme</h3>
          <span className="flex items-center gap-3">
            <span className="tabular text-sm text-muted">{Math.min(doneCount, PROGRAM_DAYS)}/{PROGRAM_DAYS}</span>
            <button type="button" onClick={onProgramme} className="text-xs text-ink-2 hover:text-ink underline-offset-4 hover:underline">See full plan</button>
          </span>
        </div>
        <div className="mt-4"><ProgrammeMap day={day} doneCount={doneCount} todayDone={!!todayResult} /></div>
      </Card>

      {state.results.length > 0 && (
        <Card>
          <h3 className="font-display text-lg">Recent sessions</h3>
          <ul className="mt-3 divide-y divide-line">
            {state.results.slice(-7).reverse().map((r) => {
              const s = scoreOf(r)
              return (
                <li key={r.id}>
                  <button type="button" disabled={r.abandoned} onClick={() => onReview(r.id)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm enabled:hover:text-accent">
                    <span><span className="tabular text-muted">{r.date.slice(5)}</span> · {EXERCISES[r.exercise].name}{r.level ? <span className="text-muted"> · L{r.level}</span> : null}{r.mode === 'practice' && <span className="text-muted"> (practice)</span>}</span>
                    <span className="tabular font-semibold">{r.abandoned ? <span className="font-normal text-muted">left early</span> : `${s.correct}/${s.total}`}</span>
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
