import { EXERCISES, SKILLS, TRAP_TO_EXERCISE } from '../lib/constants.js'
import { accuracyOf, diagnose, formatMs, scoreOf } from '../lib/engine.js'
import { abilityLevels } from '../lib/program.js'
import { Button, Card, Stat } from './ui.jsx'

export default function Results({ result, state, streakCount, weekly, onHome, onPractice }) {
  const idx = state.results.findIndex((r) => r.id === result.id)
  const before = abilityLevels({ results: state.results.slice(0, idx) })[result.exercise].level
  const after = abilityLevels({ results: state.results.slice(0, idx + 1) })[result.exercise].level
  const diag = diagnose(result, result.mode === 'daily' ? result.day : null)
  const { correct, total } = scoreOf(result)
  const acc = Math.round(accuracyOf(result) * 100)
  const ex = EXERCISES[result.exercise]
  return (
    <div className="space-y-5">
      <Card>
        <div className="eyebrow">{result.mode === 'daily' ? `Day ${String(result.day).padStart(2, '0')} · ` : 'Practice · '}{ex.name}{result.level ? ` · Level ${result.level}` : ''}</div>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{result.mode === 'daily' ? 'Your daily scorecard' : 'Your scorecard'}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Accuracy" value={`${correct}/${total}`} sub={result.falseFlags?.length ? `${acc}% · ${result.falseFlags.length} false flag${result.falseFlags.length > 1 ? 's' : ''}` : `${acc}%`} />
          <Stat label="Time taken" value={formatMs(result.durationMs)} />
          <Stat label="Day streak" value={streakCount} />
          <Stat label="Weekly accuracy" value={weekly == null ? '—' : `${weekly}%`} />
        </div>
        <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-[15px] leading-relaxed">{diag.summary}</p>
        {after !== before && (
          <p className={`mt-3 rounded-xl px-4 py-3 text-sm ${after > before ? 'bg-good-soft' : 'bg-surface-2'}`}>
            {after > before
              ? <><b>Level up.</b> Two strong sessions in a row: {ex.name} moves to level {after}.</>
              : <><b>{ex.name} eases to level {after}.</b> This one was a stretch — the next one will be a bit lighter so you can rebuild.</>}
          </p>
        )}
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg">What you noticed</h3>
          {diag.noticed.length ? (
            <ul className="mt-3 space-y-2.5">
              {diag.noticed.map((it) => (
                <li key={it.id} className="flex gap-2.5 text-sm"><span className="mt-0.5 text-good" aria-hidden>✓</span>
                  <span>{it.label}{it.answer && <span className="text-muted"> — {it.answer}</span>}</span></li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted">Nothing this time — that's useful information too.</p>}
        </Card>
        <Card>
          <h3 className="font-display text-lg">What you missed</h3>
          {diag.missed.length || result.falseFlags?.length ? (
            <ul className="mt-3 space-y-3">
              {diag.missed.map((it) => (
                <li key={it.id} className="flex gap-2.5 text-sm"><span className="mt-0.5 text-bad" aria-hidden>✗</span>
                  <div>
                    <div className="font-medium">{it.label}</div>
                    {it.yours != null && <div className="text-ink-2">You said <b>{it.yours}</b>; it was <b>{it.answer}</b>.</div>}
                    {it.why && <div className="text-muted">{it.why}</div>}
                    <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">{SKILLS[it.skill].label}</div>
                  </div></li>
              ))}
              {result.falseFlags?.map((f, i) => (
                <li key={'f' + i} className="flex gap-2.5 text-sm"><span className="mt-0.5 text-muted" aria-hidden>○</span>
                  <span className="text-ink-2">False flag: {f.label}</span></li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-muted">You didn't miss anything.</p>}
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-lg">Why you missed it</h3>
        {diag.reasons.length ? (
          <ul className="mt-3 space-y-3">
            {diag.reasons.map((r) => (
              <li key={r.trap} className="text-sm"><b>{r.label}</b> <span className="text-muted">· {r.n}</span><div className="text-ink-2">{r.why}</div></li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-ink-2">No pattern to correct today.</p>}
        <h3 className="mt-6 font-display text-lg">What to practise</h3>
        <p className="mt-2 text-sm text-ink-2">{diag.nextFocus
          ? <>{result.mode === 'daily' ? 'Your next targeted session will be' : 'Good next practice:'} <b>{EXERCISES[TRAP_TO_EXERCISE[diag.nextFocus.trap]].name}</b>{result.mode === 'daily' ? ', weighted toward the trap you fell for most.' : '.'}</>
          : <>Your next targeted session will go after your weakest skill in the Attention Profile.</>}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onHome}>Back to dashboard</Button>
          {onPractice && <Button variant="ghost" onClick={onPractice}>Practice room</Button>}
        </div>
      </Card>
    </div>
  )
}
