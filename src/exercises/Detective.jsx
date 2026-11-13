import { useMemo, useRef, useState } from 'react'
import { CASES, VERDICTS } from '../data/detective.js'
import { makeRng } from '../lib/rng.js'
import { Button } from '../components/ui.jsx'
import { generateCase } from '../data/detectiveGen.js'
import { levelParams } from './levels.js'

export function pickCase(seed, focusTrap, count = 5, recent = []) {
  const rng = makeRng(seed)
  const fresh = CASES.filter((c) => !recent.includes(c.id))
  if (count > 5 || !fresh.length || rng.next() < 0.5) return generateCase(seed + ':gen', count)
  const kase = pickCurated(rng, fresh, focusTrap)
  return { ...kase, statements: rng.sample(kase.statements, count) }
}

function pickCurated(rng, CASES, focusTrap) {
  if (focusTrap) {
    const scored = CASES.map((c) => ({ c, n: c.statements.filter((s) => s.trap === focusTrap).length }))
    const best = Math.max(...scored.map((x) => x.n))
    if (best > 0) return rng.pick(scored.filter((x) => x.n === best)).c
  }
  return rng.pick(CASES)
}

export default function Detective({ seed, focusTrap, level = 2, recent = [], onDone }) {
  const kase = useMemo(() => pickCase(seed, focusTrap, levelParams('detective', level).statements, recent), [seed, focusTrap, level]) // eslint-disable-line react-hooks/exhaustive-deps
  const statements = useMemo(() => makeRng(seed + ':order').shuffle(kase.statements), [kase, seed])
  const [answers, setAnswers] = useState({})
  const start = useRef(Date.now())
  const done = statements.every((_, i) => answers[i])

  const finish = () => {
    const items = statements.map((s, i) => ({
      id: `d${i}`, label: s.text, skill: s.skill, trap: s.trap, correct: answers[i] === s.verdict,
      yours: VERDICTS[answers[i]].label, answer: VERDICTS[s.verdict].label, why: s.why,
    }))
    onDone({ items, falseFlags: [], answerMs: Date.now() - start.current, contentId: kase.id })
  }

  return (
    <div className="space-y-5">
      <p className="text-ink-2">Read the original, then judge each statement in the {kase.title.toLowerCase()}. Does it <b>match</b>, <b>contradict</b>, or claim something the original <b>never states</b>?</p>
      <div className="rounded-xl border border-line bg-bg p-4 sm:p-5">
        <div className="eyebrow mb-2">{kase.sourceTitle}</div>
        <div className="whitespace-pre-wrap text-[15px] leading-7">{kase.source}</div>
      </div>
      <ol className="space-y-3">
        {statements.map((s, i) => (
          <li key={i} className="rounded-xl border border-line p-4">
            <p className="font-medium">{i + 1}. {s.text}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Object.entries(VERDICTS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  title={v.hint}
                  aria-pressed={answers[i] === k}
                  onClick={() => setAnswers({ ...answers, [i]: k })}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold sm:text-sm transition ${answers[i] === k ? 'border-ink bg-ink text-bg' : 'border-line hover:border-ink-2'}`}
                >{v.label}</button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <Button onClick={finish} disabled={!done}>Check my verdicts</Button>
    </div>
  )
}
