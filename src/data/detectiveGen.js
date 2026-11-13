// Generated Detective cases: meeting notes built from a topic, with statements
// that restate (match), distort (contradict) or invent (not stated).
import { makeRng } from '../lib/rng.js'

const PEOPLE = ['Ana', 'Ben', 'Chloe', 'Dev', 'Femi', 'Grace', 'Hiro', 'Isla', 'Jonas', 'Kemi', 'Leo', 'Maya']
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const MONTHS = ['March', 'April', 'May', 'June', 'September', 'October']

const TOPICS = [
  { name: 'Product launch review', item: 'enterprise customers', thing: 'the new reporting feature', scope: 'existing customers', wider: 'all customers',
    deliverable: 'launch checklist', deferred: 'a free tier', metric: 'trial-to-paid conversion', unit: '%', budget: 'launch budget',
    invented: ['Sales expects the feature to increase deal size.', 'The feature was delayed because of a supplier issue.', 'Customers asked for a mobile version.'] },
  { name: 'Hiring plan meeting', item: 'shortlisted candidates', thing: 'the new interview process', scope: 'engineering roles', wider: 'every team',
    deliverable: 'job description', deferred: 'a graduate scheme', metric: 'offer acceptance rate', unit: '%', budget: 'recruitment budget',
    invented: ['The team plans to use an external agency.', 'Remote candidates will be prioritised.', 'Salaries will rise by 5% next year.'] },
  { name: 'Campaign planning session', item: 'test audiences', thing: 'the video ads', scope: 'the UK market', wider: 'all markets',
    deliverable: 'creative brief', deferred: 'a podcast sponsorship', metric: 'click-through rate', unit: '%', budget: 'media budget',
    invented: ['The agency recommended increasing spend on TikTok.', 'Last year’s campaign underperformed.', 'The CEO has approved the creative.'] },
  { name: 'Customer support review', item: 'escalated tickets', thing: 'the new chatbot', scope: 'billing questions', wider: 'all support questions',
    deliverable: 'help-centre update', deferred: 'weekend cover', metric: 'satisfaction score', unit: ' points', budget: 'tooling budget',
    invented: ['Customers prefer email to live chat.', 'Two agents are leaving next month.', 'The chatbot will replace the phone line.'] },
]

export function generateCase(seed, count = 5) {
  const rng = makeRng(seed)
  const t = rng.pick(TOPICS)
  const [p1, p2, p3, absent] = rng.sample(PEOPLE, 4)
  const total = rng.int(5, 9)
  const yes = rng.int(Math.ceil(total / 2) - 1 > 1 ? Math.ceil(total / 2) - 1 : 2, total - 1)
  const majority = yes > total / 2
  const day = rng.pick(WEEKDAYS)
  const otherDay = rng.pick(WEEKDAYS.filter((d) => d !== day))
  const month = rng.pick(MONTHS)
  const from = rng.int(12, 40), to = from + rng.int(3, 9)
  const budget = rng.pick([15, 20, 25, 40, 60]) * 1000
  const budgetStr = `£${budget.toLocaleString('en-GB')}`

  const source = `Attendees: ${p1}, ${p2}, ${p3}. Apologies: ${absent}.

1. ${p2} reported that ${yes} of ${total} ${t.item} responded positively.
2. Agreed to pilot ${t.thing} with ${t.scope} only, starting next month.
3. ${p3} will share the ${t.deliverable} by ${day}.
4. The decision on ${t.deferred} was postponed to the ${month} review.
5. ${t.metric[0].toUpperCase() + t.metric.slice(1)} rose from ${from}${t.unit} to ${to}${t.unit} last quarter.
6. The ${t.budget} is capped at ${budgetStr}.`

  // Each fact offers a true and a false/unstated variant.
  const facts = [
    () => majority
      ? { text: `Most ${t.item} responded positively.`, verdict: 'match', trap: 'numbers', skill: 'numerical', why: `${yes} of ${total} is a majority.` }
      : { text: `Most ${t.item} responded positively.`, verdict: 'contradicts', trap: 'numbers', skill: 'numerical', why: `${yes} of ${total} is not a majority.` },
    () => rng.next() < 0.5
      ? { text: `${t.thing[0].toUpperCase() + t.thing.slice(1)} will be piloted with ${t.wider}.`, verdict: 'contradicts', trap: 'assuming', skill: 'critical', why: `Only ${t.scope}.` }
      : { text: `The pilot of ${t.thing} is limited to ${t.scope}.`, verdict: 'match', trap: 'small-print', skill: 'critical', why: 'Stated in point 2.' },
    () => {
      const r = rng.next()
      if (r < 0.35) return { text: `${absent} will share the ${t.deliverable} by ${day}.`, verdict: 'contradicts', trap: 'similar', skill: 'critical', why: `${p3} owns it. ${absent} wasn’t at the meeting.` }
      if (r < 0.7) return { text: `${p3} will share the ${t.deliverable} by ${otherDay}.`, verdict: 'contradicts', trap: 'small-print', skill: 'critical', why: `The deadline is ${day}, not ${otherDay}.` }
      return { text: `${p3} owns the ${t.deliverable}.`, verdict: 'match', trap: 'similar', skill: 'critical', why: 'Stated in point 3.' }
    },
    () => rng.next() < 0.6
      ? { text: `The team decided against ${t.deferred}.`, verdict: 'contradicts', trap: 'assuming', skill: 'critical', why: 'It was postponed, not rejected.' }
      : { text: `A decision on ${t.deferred} is still to come.`, verdict: 'match', trap: 'assuming', skill: 'critical', why: `Postponed to the ${month} review.` },
    () => {
      const diff = to - from
      const wrong = diff + rng.pick([-2, 2, 3])
      return rng.next() < 0.5
        ? { text: `${t.metric[0].toUpperCase() + t.metric.slice(1)} improved by ${diff}${t.unit === '%' ? ' percentage points' : t.unit}.`, verdict: 'match', trap: 'numbers', skill: 'numerical', why: `${to} − ${from} = ${diff}.` }
        : { text: `${t.metric[0].toUpperCase() + t.metric.slice(1)} improved by ${wrong}${t.unit === '%' ? ' percentage points' : t.unit}.`, verdict: 'contradicts', trap: 'numbers', skill: 'numerical', why: `${to} − ${from} = ${diff}, not ${wrong}.` }
    },
    () => rng.next() < 0.5
      ? { text: `The ${t.budget} can increase if the pilot goes well.`, verdict: 'missing', trap: 'assuming', skill: 'critical', why: 'The budget is capped; nothing suggests flexibility.' }
      : { text: `The ${t.budget} is ${budgetStr} at most.`, verdict: 'match', trap: 'numbers', skill: 'numerical', why: 'Stated in point 6.' },
    () => ({ text: rng.pick(t.invented), verdict: 'missing', trap: 'assuming', skill: 'critical', why: 'Nobody said this. It sounds plausible, which is what makes it easy to accept.' }),
    () => ({ text: `${absent} agreed with the pilot plan.`, verdict: 'missing', trap: 'similar', skill: 'critical', why: `${absent} sent apologies; their view isn’t recorded.` }),
  ]
  // Always include one invented claim; fill the rest at random.
  const chosen = [facts[6], ...rng.sample([0, 1, 2, 3, 4, 5, 7].map((i) => facts[i]), count - 1)]
  const statements = chosen.map((f) => f())
  return { id: `gen-${t.name}`, title: 'Meeting summary', sourceTitle: `Original notes — ${t.name}`, source, statements }
}
