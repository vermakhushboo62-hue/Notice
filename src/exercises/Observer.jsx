import { useMemo, useRef, useState } from 'react'
import { generateScene, buildQuestions } from './observerScene.js'
import ObserverScene from './ObserverScene.jsx'
import { Button, Choice, Countdown } from '../components/ui.jsx'
import { levelParams } from './levels.js'

export default function Observer({ seed, focusTrap, level = 2, onDone }) {
  const { study: STUDY_SECONDS, questions: Q, hard } = levelParams('observer', level)
  const scene = useMemo(() => generateScene(seed), [seed])
  const questions = useMemo(() => buildQuestions(scene, seed, focusTrap, Q, hard), [scene, seed, focusTrap, Q, hard])
  const [phase, setPhase] = useState('ready') // ready | study | quiz
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const [picked, setPicked] = useState(null)
  const answerStart = useRef(0)

  if (phase === 'ready') {
    return (
      <div className="space-y-5">
        <p className="text-ink-2">You'll see a room for <b>{STUDY_SECONDS} seconds</b>. Then it disappears and you answer {Q} questions about small details. Look at everything — counts, colours, positions, text.</p>
        <Button onClick={() => setPhase('study')}>I'm ready — show the scene</Button>
      </div>
    )
  }
  if (phase === 'study') {
    return (
      <div className="space-y-4">
        <Countdown seconds={STUDY_SECONDS} onEnd={() => { answerStart.current = Date.now(); setPhase('quiz') }} />
        <ObserverScene s={scene} />
        <p className="text-sm text-muted">Study this scene carefully.</p>
      </div>
    )
  }

  const q = questions[i]
  const submit = () => {
    const next = [...answers, picked]
    setAnswers(next)
    setPicked(null)
    if (i + 1 < questions.length) { setI(i + 1); return }
    const items = questions.map((qq, k) => ({
      id: qq.id, label: qq.prompt, skill: qq.skill, trap: qq.trap, correct: next[k] === qq.answer,
      yours: next[k], answer: qq.answer, why: qq.why,
    }))
    onDone({ items, falseFlags: [], answerMs: Date.now() - answerStart.current, contentId: null })
  }
  return (
    <div className="space-y-4">
      <div className="eyebrow">Question {i + 1} of {questions.length}</div>
      <h3 className="font-display text-xl">{q.prompt}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((o) => (
          <Choice key={o} selected={picked === o} onClick={() => setPicked(o)}>
            <span className="capitalize">{o}</span>
          </Choice>
        ))}
      </div>
      <Button onClick={submit} disabled={picked == null}>{i + 1 < questions.length ? 'Next' : 'Finish'}</Button>
    </div>
  )
}
