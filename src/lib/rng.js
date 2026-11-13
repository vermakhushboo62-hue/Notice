// Small deterministic RNG so a given day always produces the same challenge.
export function hashString(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return (h >>> 0) || 1
}

export function makeRng(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0
  const next = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min, max) => Math.floor(next() * (max - min + 1)) + min
  const pick = (arr) => arr[Math.floor(next() * arr.length)]
  const shuffle = (arr) => {
    const a2 = arr.slice()
    for (let i = a2.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1))
      ;[a2[i], a2[j]] = [a2[j], a2[i]]
    }
    return a2
  }
  const sample = (arr, n) => shuffle(arr).slice(0, n)
  return { next, int, pick, shuffle, sample }
}
