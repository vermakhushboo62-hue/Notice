import { makeRng } from '../lib/rng.js'

const COLORS = {
  blue: '#3e6ea8', green: '#4f8a5b', yellow: '#e2b93b', purple: '#7a5a9e', teal: '#2f8f8a',
  grey: '#8b8f96', navy: '#2b3a5c', orange: '#d9813a', red: '#c8372d', pink: '#d98aa6', brown: '#8a5a3b',
}
export const colorName = (k) => k
const NON_RED = ['blue', 'green', 'yellow', 'purple', 'teal', 'grey', 'navy', 'orange', 'pink', 'brown']
const WORDS = [['CALM', 'CLAM', 'CALL', 'COAL'], ['FOCUS', 'FOCAL', 'LOCUS', 'FOCUSED'], ['NORTH', 'NORTHS', 'WORTH', 'NOTCH'],
  ['MAPLE', 'MABLE', 'AMPLE', 'MAPLES'], ['ORBIT', 'ORBITS', 'OBIT', 'ROBIN'], ['STILL', 'STALL', 'SKILL', 'STILT'],
  ['BLOOM', 'BROOM', 'GLOOM', 'BLOOMS'], ['TIDES', 'TIDE', 'SIDES', 'TILES']]
const RED_CANDIDATES = ['mug', 'lamp', 'plant pot', 'clock frame', 'poster border', 'chair']

export function generateScene(seed) {
  const rng = makeRng(seed)
  const shelfSide = rng.pick(['left', 'right'])
  const bookCount = rng.int(4, 9)
  const books = Array.from({ length: bookCount }, () => ({ color: rng.pick(['blue', 'green', 'yellow', 'purple', 'teal', 'grey', 'navy']), h: rng.int(28, 46), w: rng.int(9, 13) }))
  const hour = rng.int(1, 12)
  const minute = rng.pick([0, 15, 30, 45])
  const wordSet = rng.pick(WORDS)
  const redObject = rng.pick(RED_CANDIDATES)
  const pick = (name) => (redObject === name ? 'red' : rng.pick(NON_RED))
  return {
    shelfSide, books, hour, minute, wordSet, word: wordSet[0], redObject,
    panes: rng.pick([4, 6, 9]),
    mug: pick('mug'), lamp: pick('lamp'), pot: pick('plant pot'), clockFrame: redObject === 'clock frame' ? 'red' : 'navy',
    posterBorder: pick('poster border'), chair: pick('chair'),
    lampSide: rng.pick(['left', 'right']),
    pencils: rng.int(2, 5),
    notes: rng.int(1, 4),
    leaves: rng.int(3, 7),
  }
}

const fmtTime = (h, m) => `${h}:${String(m).padStart(2, '0')}`
const near = (n, rng, lo = 1) => rng.shuffle([...new Set([n, n + 1, n - 1, n + 2, n - 2].filter((x) => x >= lo))].slice(0, 4))

export function buildQuestions(scene, seed, focusTrap, count = 5, hard = false) {
  const rng = makeRng(seed + ':q')
  const opposite = (s) => (s === 'left' ? 'right' : 'left')
  const pool = [
    { id: 'books', trap: 'similar', prompt: 'How many books were on the shelf?', answer: String(scene.books.length),
      options: near(scene.books.length, rng, 2).map(String), why: `There were ${scene.books.length} books. Counting similar items in a row is where people slip.` },
    { id: 'clock', trap: 'small-print', prompt: 'What time did the wall clock show?', answer: fmtTime(scene.hour, scene.minute),
      options: rng.shuffle([...new Set([fmtTime(scene.hour, scene.minute), fmtTime(scene.hour % 12 + 1, scene.minute), fmtTime(scene.hour, (scene.minute + 30) % 60), fmtTime(((scene.hour + 10) % 12) + 1, (scene.minute + 15) % 60)])]),
      why: `The clock read ${fmtTime(scene.hour, scene.minute)}. Small dials are easy to glance past.` },
    { id: 'mug', trap: 'similar', prompt: 'What colour was the mug on the desk?', answer: scene.mug,
      options: rng.shuffle([scene.mug, ...rng.sample(Object.keys(COLORS).filter((c) => c !== scene.mug), 3)]), why: `The mug was ${scene.mug}.` },
    { id: 'poster', trap: 'small-print', prompt: 'What word was printed on the poster?', answer: scene.word,
      options: rng.shuffle(scene.wordSet.slice()), why: `It said ${scene.word}. Similar-looking words are easy to substitute when text is small.` },
    { id: 'panes', trap: 'similar', prompt: 'How many panes of glass did the window have?', answer: String(scene.panes),
      options: ['4', '6', '8', '9'], why: `The window had ${scene.panes} panes.` },
    { id: 'lamp', trap: 'spatial', prompt: 'Which end of the desk was the lamp on?', answer: scene.lampSide === 'left' ? 'Left end' : 'Right end',
      options: ['Left end', 'Right end', 'In the middle', 'There was no lamp'], why: `The lamp stood on the ${scene.lampSide} end of the desk.` },
    { id: 'pencils', trap: 'small-print', prompt: 'How many pencils were in the pencil cup?', answer: String(scene.pencils),
      options: near(scene.pencils, rng, 1).map(String), why: `There were ${scene.pencils} pencils.` },
    { id: 'shelf', trap: 'spatial', prompt: 'Which side of the room was the bookshelf on?', answer: scene.shelfSide === 'left' ? 'Left' : 'Right',
      options: ['Left', 'Right'], why: `The shelf was on the ${scene.shelfSide}, with the clock on the ${opposite(scene.shelfSide)}.` },
    { id: 'red', trap: 'assuming', prompt: 'Which object was red?', answer: scene.redObject,
      options: rng.shuffle([scene.redObject, ...rng.sample(RED_CANDIDATES.filter((c) => c !== scene.redObject), 3)]), why: `Only the ${scene.redObject} was red.` },
    { id: 'notes', trap: 'small-print', prompt: 'How many sticky notes were on the wall?', answer: String(scene.notes),
      options: ['1', '2', '3', '4'], why: `There were ${scene.notes} sticky notes beside the window.` },
  ]
  if (hard) {
    pool.push(
      { id: 'leaves', trap: 'small-print', prompt: 'How many leaves did the plant have?', answer: String(scene.leaves),
        options: near(scene.leaves, rng, 2).map(String), why: `The plant had ${scene.leaves} leaves.` },
      { id: 'chair', trap: 'similar', prompt: 'What colour was the stool under the desk?', answer: scene.chair,
        options: rng.shuffle([scene.chair, ...rng.sample(Object.keys(COLORS).filter((c) => c !== scene.chair), 3)]), why: `The stool was ${scene.chair}.` },
      { id: 'pot', trap: 'similar', prompt: 'What colour was the plant pot?', answer: scene.pot,
        options: rng.shuffle([scene.pot, ...rng.sample(Object.keys(COLORS).filter((c) => c !== scene.pot), 3)]), why: `The pot was ${scene.pot}.` },
      { id: 'mugside', trap: 'spatial', prompt: 'Was the mug to the left or right of the pencil cup?', answer: scene.lampSide === 'left' ? 'Right' : 'Left',
        options: ['Left', 'Right'], why: `The mug was to the ${scene.lampSide === 'left' ? 'right' : 'left'} of the pencil cup.` },
    )
  }
  let chosen = []
  if (focusTrap) chosen = rng.shuffle(pool.filter((q) => q.trap === focusTrap)).slice(0, 3)
  const rest = rng.shuffle(pool.filter((q) => !chosen.includes(q)))
  chosen = rng.shuffle([...chosen, ...rest].slice(0, count))
  return chosen.map((q) => ({ ...q, skill: 'visual' }))
}

export { COLORS }
