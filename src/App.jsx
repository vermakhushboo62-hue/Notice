import { useEffect, useMemo, useState } from 'react'
import { EXERCISES, EXERCISE_ORDER } from './lib/constants.js'
import { dateKey, dayNumber, diagnose, planForDay, streak, todaysResult, weeklyAccuracy } from './lib/engine.js'
import { clearState, emptyState, loadState, saveState } from './lib/storage.js'
import { sampleState } from './lib/sample.js'
import { EXERCISE_COMPONENTS } from './exercises/index.js'
import Dashboard from './components/Dashboard.jsx'
import Results from './components/Results.jsx'
import Programme from './components/Programme.jsx'
import { abilityLevels } from './lib/program.js'
import { Button, Card, Elapsed } from './components/ui.jsx'

export default function App() {
  const [state, setState] = useState(loadState)
  const [view, setView] = useState({ name: 'home' })
  const [today, setToday] = useState(dateKey())
  useEffect(() => { saveState(state) }, [state])
  useEffect(() => {
    const t = setInterval(() => setToday(dateKey()), 60000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [view.name])

  const day = dayNumber(state, today)
  const todayResult = todaysResult(state, today)
  const streakCount = streak(state, today)
  const weekly = weeklyAccuracy(state, today)

  const begin = (exercise, mode, { focusTrap = null, level, blind = false } = {}) => {
    const attempt = state.results.filter((r) => r.date === today && r.mode === mode).length
    const seed = mode === 'daily' ? `${today}:${exercise}:${attempt}` : `${Date.now()}:${exercise}`
    const lvl = level || abilityLevels(state)[exercise].level
    setView({ name: 'play', exercise, mode, focusTrap, level: lvl, blind, seed, startedAt: Date.now() })
  }
  const startDaily = () => {
    const plan = planForDay(state, day, today)
    begin(plan.exercise, 'daily', plan)
  }
  const recent = state.results.slice(-30).map((r) => r.contentId).filter(Boolean)
  const leave = () => {
    if (!confirm('Leave this challenge? It will be recorded as left early, and your next session will be a little lighter.')) return
    const r = { id: `${view.mode}-${Date.now()}`, date: today, day: view.mode === 'daily' ? day : null, mode: view.mode, exercise: view.exercise,
      level: view.level, abandoned: true, items: [], falseFlags: [], answerMs: 0, durationMs: Date.now() - view.startedAt }
    setState((s) => ({ ...s, results: [...s.results, r] }))
    setView({ name: 'home' })
  }
  const finish = (payload) => {
    const r = {
      id: `${view.mode}-${Date.now()}`, date: today, day: view.mode === 'daily' ? day : null, mode: view.mode,
      exercise: view.exercise, focusTrap: view.focusTrap, level: view.level, ...payload, durationMs: Date.now() - view.startedAt,
    }
    const diag = diagnose(r, r.day)
    r.summary = diag.summary
    setState((s) => ({ ...s, results: [...s.results, r], nextFocus: r.mode === 'daily' ? diag.nextFocus : s.nextFocus }))
    setView({ name: 'result', id: r.id })
  }

  const nav = [
    ['home', 'Today'],
    ['programme', 'Programme'],
    ['practice', 'Practice'],
    ['settings', 'Settings'],
  ]
  const result = view.name === 'result' ? state.results.find((r) => r.id === view.id) : null
  const Ex = view.name === 'play' ? EXERCISE_COMPONENTS[view.exercise] : null

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <button type="button" onClick={() => setView({ name: 'home' })} className="text-left">
          <div className="font-display text-3xl font-semibold tracking-[0.18em] sm:text-4xl">NOTICE</div>
          <div className="mt-1 text-sm text-ink-2">Daily practice · Train your eyes. Sharpen your mind.</div>
        </button>
        {view.name !== 'play' && (
          <nav className="flex w-full gap-0.5 rounded-full border border-line bg-surface p-1 text-[13px] sm:w-auto sm:gap-1 sm:text-sm" aria-label="Main">
            {nav.map(([k, label]) => (
              <button key={k} type="button" onClick={() => setView({ name: k })} aria-current={view.name === k ? 'page' : undefined}
                className={`flex-1 rounded-full px-2.5 py-1.5 font-medium transition sm:flex-none sm:px-4 ${view.name === k || (k === 'home' && view.name === 'result') ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink'}`}>{label}</button>
            ))}
          </nav>
        )}
      </header>

      {state.sample && view.name !== 'play' && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line px-4 py-3 text-sm">
          <span className="text-ink-2">You're looking at <b>sample data</b> so you can preview the dashboard.</span>
          <Button variant="ghost" className="!py-1.5" onClick={() => { clearState(); setState(emptyState()) }}>Clear and start fresh</Button>
        </div>
      )}

      {view.name === 'home' && (
        <Dashboard state={state} today={today} day={day} todayResult={todayResult} streakCount={streakCount} weekly={weekly}
          onStart={startDaily} onReview={(id) => setView({ name: 'result', id })} onProgramme={() => setView({ name: 'programme' })} />
      )}

      {view.name === 'play' && (
        <Card>
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="eyebrow">{view.mode === 'daily' ? `Day ${String(day).padStart(2, '0')} · Today's challenge` : 'Practice'}</div>
              <h2 className="mt-1 font-display text-2xl">{EXERCISES[view.exercise].name}</h2>
              <div className="text-sm text-accent">{EXERCISES[view.exercise].kind} · Level {view.level}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Elapsed since={view.startedAt} />
              <button type="button" className="text-xs text-muted hover:text-ink" onClick={leave}>Leave</button>
            </div>
          </div>
          <Ex key={view.seed} seed={view.seed} focusTrap={view.focusTrap} level={view.level} blind={view.blind} recent={recent} onDone={finish} />
        </Card>
      )}

      {view.name === 'result' && result && (
        <Results result={result} state={state} streakCount={streakCount} weekly={weekly} onHome={() => setView({ name: 'home' })}
          onPractice={() => setView({ name: 'practice' })} />
      )}

      {view.name === 'programme' && <Programme state={state} day={day} />}
      {view.name === 'practice' && <Practice onBegin={(ex) => begin(ex, 'practice')} />}
      {view.name === 'settings' && <Settings state={state} setState={setState} />}

      <footer className="mt-12 text-center text-xs text-muted">
        One challenge a day. No leaderboards, no badges — a quiet daily ritual. Your data stays on this device.
      </footer>
    </div>
  )
}

function Practice({ onBegin }) {
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-display text-2xl">Practice room</h2>
        <p className="mt-2 max-w-2xl text-ink-2">Try any exercise with fresh content. Practice runs at your current level for that exercise. It feeds your Attention Profile and levels, but doesn't count toward your streak or the 90-day programme.</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXERCISE_ORDER.map((k) => {
          const ex = EXERCISES[k]
          return (
            <Card key={k} className="flex flex-col">
              <div className="eyebrow">{ex.number} · {ex.kind}</div>
              <h3 className="mt-2 font-display text-xl">{ex.name}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-2">{ex.blurb}</p>
              <Button variant="ghost" className="mt-4 self-start" onClick={() => onBegin(k)}>Start</Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Settings({ state, setState }) {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('notice.theme') || 'system' } catch { return 'system' } })
  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('notice.theme', theme) } catch { /* ignore */ }
  }, [theme])
  const exportUrl = useMemo(() => URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })), [state])

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-display text-2xl">Settings</h2>
        <div className="mt-5 space-y-6 text-sm">
          <div>
            <div className="font-semibold">Appearance</div>
            <div className="mt-2 flex gap-2">
              {['system', 'light', 'dark'].map((t) => (
                <Button key={t} variant={theme === t ? 'primary' : 'ghost'} className="!py-1.5 capitalize" onClick={() => setTheme(t)}>{t}</Button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold">Your data</div>
            <p className="mt-1 text-ink-2">{state.results.length} sessions stored locally in this browser.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={exportUrl} download={`notice-${dateKey()}.json`} className="inline-flex items-center rounded-full border border-line px-4 py-1.5 font-semibold hover:bg-surface-2">Export JSON</a>
              <Button variant="ghost" className="!py-1.5" onClick={() => setState(sampleState())}>Load sample data</Button>
              <Button variant="ghost" className="!py-1.5 text-bad" onClick={() => { if (confirm('Delete all sessions and start over?')) { clearState(); setState(emptyState()) } }}>Reset everything</Button>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="font-display text-lg">How NOTICE works</h3>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-2">
          <p><b className="text-ink">One 5-minute challenge a day</b> across a 90-day programme: Foundations, Depth, Mastery. Each day's exercise and level are mixed and matched from how well — and how reliably — you finish your sessions.</p>
          <p><b className="text-ink">Noticing more vs. making fewer mistakes.</b> NOTICE trains four related abilities: visual attention (noticing a small inconsistency), critical evaluation (catching a claim that doesn't hold), recall (remembering what you saw), and analytical accuracy (checking one number against another).</p>
          <p><b className="text-ink">Every result explains itself:</b> what you noticed, what you missed, why you probably missed it, and what you'll practise next.</p>
          <p className="text-xs text-muted">Scores reflect performance on these exercises only. They are not a cognitive, personality or health assessment.</p>
        </div>
      </Card>
    </div>
  )
}
