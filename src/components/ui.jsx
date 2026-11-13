import { useEffect, useState } from 'react'

export function Card({ className = '', children, ...rest }) {
  return <section className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${className}`} {...rest}>{children}</section>
}

export function Button({ variant = 'primary', className = '', ...rest }) {
  const styles = {
    primary: 'bg-ink text-bg hover:opacity-90',
    accent: 'bg-accent text-accent-ink hover:opacity-90',
    ghost: 'border border-line text-ink hover:bg-surface-2',
    quiet: 'text-ink-2 hover:text-ink underline-offset-4 hover:underline',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...rest}
    />
  )
}

export function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-surface-2 px-4 py-3">
      <div className="font-display text-2xl sm:text-3xl tabular leading-tight">{value}</div>
      <div className="mt-1 text-xs font-medium text-ink-2">{label}</div>
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </div>
  )
}

// Countdown bar for timed study phases.
export function Countdown({ seconds, onEnd, label = 'seconds' }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const start = Date.now()
    const t = setInterval(() => {
      const l = Math.max(0, seconds - Math.floor((Date.now() - start) / 1000))
      setLeft(l)
      if (l <= 0) { clearInterval(t); onEnd() }
    }, 200)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="drain h-full rounded-full bg-accent" style={{ animationDuration: `${seconds}s` }} />
      </div>
      <span className="tabular text-sm font-semibold w-20 text-right">{left} {label}</span>
    </div>
  )
}

export function Elapsed({ since }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const s = Math.floor((now - since) / 1000)
  const over = s > 300
  return (
    <span className={`tabular text-sm font-semibold ${over ? 'text-bad' : 'text-ink-2'}`} title="Aim for about 5 minutes">
      {String(Math.floor(s / 60)).padStart(2, '0')}:{String(s % 60).padStart(2, '0')}
    </span>
  )
}

export function Choice({ selected, state, children, ...rest }) {
  // state: undefined | 'right' | 'wrong'
  const base = 'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition'
  const cls = state === 'right' ? 'border-good bg-good-soft' : state === 'wrong' ? 'border-bad bg-bad-soft'
    : selected ? 'border-ink bg-surface-2' : 'border-line hover:border-ink-2'
  return <button className={`${base} ${cls}`} {...rest}>{children}</button>
}
