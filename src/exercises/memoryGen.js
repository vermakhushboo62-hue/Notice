import { makeRng } from '../lib/rng.js'

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond']
export const MEM_COLORS = { blue: '#3e6ea8', orange: '#d9813a', green: '#4f8a5b', purple: '#7a5a9e', yellow: '#e2b93b' }
const COLOR_KEYS = Object.keys(MEM_COLORS)
export function generateMemory(seed, focusTrap, { size = 4, objects = 8, changes: nChanges = 3 } = {}) {
  const SIZE = size
  const cellName = (idx) => `row ${Math.floor(idx / SIZE) + 1}, column ${(idx % SIZE) + 1}`
  const rng = makeRng(seed)
  const cells = rng.sample([...Array(SIZE * SIZE).keys()], objects)
  const before = Array(SIZE * SIZE).fill(null)
  for (const c of cells) before[c] = { shape: rng.pick(SHAPES), color: rng.pick(COLOR_KEYS) }
  const after = before.map((o) => (o ? { ...o } : null))

  let types
  if (focusTrap === 'spatial') types = ['moved', 'moved', 'moved', rng.pick(['recolored', 'reshaped'])]
  else if (focusTrap === 'similar') types = ['recolored', 'reshaped', 'recolored', 'moved']
  else types = rng.shuffle(['moved', 'recolored', 'reshaped', 'added', 'moved'])
  types = types.slice(0, nChanges)

  const changes = []
  const touched = new Set()
  for (const t of types) {
    const occupied = after.map((o, i) => (o && !touched.has(i) ? i : -1)).filter((i) => i >= 0)
    const empty = after.map((o, i) => (!o && !touched.has(i) ? i : -1)).filter((i) => i >= 0)
    if (t === 'moved') {
      const from = rng.pick(occupied), to = rng.pick(empty)
      after[to] = after[from]; after[from] = null
      touched.add(from); touched.add(to)
      const o = after[to]
      changes.push({ cell: to, alt: from, type: t, trap: 'spatial', label: `The ${o.color} ${o.shape} moved`, why: `It moved from ${cellName(from)} to ${cellName(to)}.` })
    } else if (t === 'recolored') {
      const c = rng.pick(occupied); const old = after[c].color
      after[c] = { ...after[c], color: rng.pick(COLOR_KEYS.filter((k) => k !== old)) }
      touched.add(c)
      changes.push({ cell: c, type: t, trap: 'similar', label: `The ${after[c].shape} at ${cellName(c)} changed colour`, why: `It was ${old}; it became ${after[c].color}.` })
    } else if (t === 'reshaped') {
      const c = rng.pick(occupied); const old = after[c].shape
      after[c] = { ...after[c], shape: rng.pick(SHAPES.filter((k) => k !== old)) }
      touched.add(c)
      changes.push({ cell: c, type: t, trap: 'similar', label: `The ${after[c].color} ${old} became a ${after[c].shape}`, why: `Same colour, different shape, at ${cellName(c)}.` })
    } else {
      const c = rng.pick(empty)
      after[c] = { shape: rng.pick(SHAPES), color: rng.pick(COLOR_KEYS) }
      touched.add(c)
      changes.push({ cell: c, type: t, trap: 'small-print', label: `A new ${after[c].color} ${after[c].shape} appeared`, why: `It was added at ${cellName(c)}.` })
    }
  }
  return { before, after, changes, size: SIZE }
}
