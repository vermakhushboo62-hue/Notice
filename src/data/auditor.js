import { makeRng } from '../lib/rng.js'

// Base documents. Version A is the original; version B gets subtle mutations.
export const TABLES = [
  {
    id: 'budget', title: 'Q2 marketing budget', columns: ['Line item', 'Owner', 'Amount', 'Due'],
    rows: [
      ['Paid social', 'R. Patel', '£18,450', '14 Apr'],
      ['Search ads', 'M. Clarke', '£12,300', '21 Apr'],
      ['Influencers', 'J. Okafor', '£9,800', '02 May'],
      ['Events', 'S. Lindqvist', '£6,275', '16 May'],
      ['Content production', 'A. Moreno', '£7,960', '30 May'],
      ['Research', 'L. Brandt', '£3,140', '06 Jun'],
      ['Total', '—', '£57,925', '—'],
    ],
  },
  {
    id: 'spec', title: 'Product specification — Aero 2 headphones', columns: ['Attribute', 'Value', 'Notes'],
    rows: [
      ['Weight', '248 g', 'Without cable'],
      ['Battery life', '36 hours', 'ANC on'],
      ['Charging', 'USB-C, 2.5 hours', '10 min = 4 hours'],
      ['Driver size', '40 mm', 'Dynamic'],
      ['Frequency range', '20 Hz – 20 kHz', 'Wired mode'],
      ['Bluetooth', '5.3', 'Multipoint'],
      ['Colours', 'Graphite, Sand', 'Matte finish'],
      ['Warranty', '24 months', 'UK & EU'],
    ],
  },
  {
    id: 'plan', title: 'Project plan — CRM migration', columns: ['Phase', 'Lead', 'Start', 'End', 'Days'],
    rows: [
      ['Discovery', 'Hannah Wells', '03 Mar', '14 Mar', '10'],
      ['Data mapping', 'Omar Sayed', '17 Mar', '04 Apr', '15'],
      ['Build', 'Grace Liu', '07 Apr', '16 May', '30'],
      ['Testing', 'Peter Novak', '19 May', '06 Jun', '15'],
      ['Training', 'Hannah Wells', '09 Jun', '13 Jun', '5'],
      ['Go-live', 'Grace Liu', '16 Jun', '16 Jun', '1'],
    ],
  },
  {
    id: 'invoice', title: 'Supplier price list', columns: ['SKU', 'Item', 'Unit', 'Price', 'Min. order'],
    rows: [
      ['PK-1042', 'Kraft mailer box', 'each', '£0.84', '250'],
      ['PK-1047', 'Kraft mailer box (L)', 'each', '£1.12', '250'],
      ['TP-2210', 'Paper tape 48mm', 'roll', '£2.35', '36'],
      ['LB-0315', 'Shipping labels A6', 'pack of 500', '£18.90', '4'],
      ['FL-7781', 'Tissue paper', 'pack of 100', '£6.45', '10'],
      ['ST-5520', 'Sticker sheet', 'pack of 50', '£4.70', '20'],
    ],
  },
  {
    id: 'timesheet', title: 'Weekly timesheet', columns: ['Day', 'Project', 'Start', 'End', 'Hours'],
    rows: [
      ['Mon 12', 'Atlas rebrand', '08:45', '17:15', '7.5'],
      ['Tue 13', 'Atlas rebrand', '09:00', '17:30', '7.5'],
      ['Wed 14', 'Harbour app', '08:30', '16:00', '6.5'],
      ['Thu 15', 'Harbour app', '09:15', '18:45', '8.5'],
      ['Fri 16', 'Internal training', '09:00', '13:00', '4.0'],
      ['Sat 17', 'Harbour app', '10:00', '12:30', '2.5'],
      ['Total', '—', '—', '—', '36.5'],
    ],
  },
  {
    id: 'kpi', title: 'Monthly KPI report', columns: ['Metric', 'March', 'April', 'Change'],
    rows: [
      ['Website sessions', '48,210', '52,640', '+9.2%'],
      ['Sign-ups', '1,384', '1,512', '+9.2%'],
      ['Conversion rate', '2.87%', '2.87%', '0.0%'],
      ['Email open rate', '41.3%', '39.8%', '-1.5 pts'],
      ['Cost per lead', '£18.40', '£16.75', '-9.0%'],
      ['Churn', '2.4%', '2.1%', '-0.3 pts'],
      ['NPS', '46', '49', '+3'],
    ],
  },
  {
    id: 'contacts', title: 'Event guest list', columns: ['Name', 'Company', 'Email', 'Table'],
    rows: [
      ['Eleanor Whitfield', 'Marlow & Co', 'e.whitfield@marlow.co', '3'],
      ['Rafael Domingues', 'Bluepeak', 'rafael@bluepeak.io', '1'],
      ['Ingrid Halvorsen', 'Nordlys AS', 'ingrid.h@nordlys.no', '5'],
      ['Kwame Mensah', 'Asante Labs', 'kmensah@asantelabs.com', '2'],
      ['Sophie Laurent', 'Atelier 9', 'sophie@atelier9.fr', '4'],
      ['Tomasz Wójcik', 'Vistula Data', 't.wojcik@vistula.pl', '3'],
    ],
  },
]

const SIMILAR_LETTERS = { a: 'e', e: 'a', i: 'l', l: 'i', o: 'c', c: 'o', m: 'n', n: 'm', r: 'n', u: 'v', v: 'u', s: 'z', g: 'q' }
const UNIT_SWAPS = [['kHz', 'Hz'], ['mm', 'cm'], [' g', ' kg'], ['hours', 'minutes'], ['months', 'years'], ['Mar', 'May'], ['Apr', 'Aug'], ['Jun', 'Jul'], ['each', 'pair'], ['ANC on', 'ANC off'], ['UK & EU', 'UK only']]

function digitPositions(s) {
  const out = []
  for (let i = 0; i < s.length; i++) if (/\d/.test(s[i])) out.push(i)
  return out
}

// Mutate a single cell value. Returns { value, trap, skill, how } or null if no mutation possible.
export function mutateCell(value, rng, prefer) {
  const options = []
  const digits = digitPositions(value)
  // transpose two adjacent digits
  for (let k = 0; k < digits.length - 1; k++) {
    const i = digits[k], j = digits[k + 1]
    if (j === i + 1 && value[i] !== value[j]) {
      options.push(() => ({
        value: value.slice(0, i) + value[j] + value[i] + value.slice(j + 1),
        trap: 'numbers', skill: 'numerical', how: 'Two digits were swapped',
      }))
    }
  }
  // change one digit by ±1
  if (digits.length) {
    options.push(() => {
      const i = rng.pick(digits)
      const d = Number(value[i])
      const nd = d === 9 ? 8 : d === 0 ? 1 : d + (rng.next() < 0.5 ? 1 : -1)
      return { value: value.slice(0, i) + nd + value.slice(i + 1), trap: 'numbers', skill: 'numerical', how: 'One digit changed' }
    })
  }
  // unit / month / qualifier swap
  for (const [a, b] of UNIT_SWAPS) {
    if (value.includes(a)) options.push(() => ({ value: value.replace(a, b), trap: 'small-print', skill: 'written', how: `"${a.trim()}" became "${b.trim()}"` }))
  }
  // similar-looking letter inside a word
  const letterIdx = []
  for (let i = 1; i < value.length; i++) if (SIMILAR_LETTERS[value[i]] && /[a-z]/.test(value[i - 1] || '')) letterIdx.push(i)
  if (letterIdx.length) {
    options.push(() => {
      const i = rng.pick(letterIdx)
      return { value: value.slice(0, i) + SIMILAR_LETTERS[value[i]] + value.slice(i + 1), trap: 'similar', skill: 'written', how: 'One letter changed' }
    })
  }
  if (!options.length) return null
  const fns = options.map((f) => f())
  const preferred = prefer ? fns.filter((o) => o.trap === prefer) : []
  return rng.pick(preferred.length ? preferred : fns)
}

export function generateAudit(seed, focusTrap, { diffs = 5, subtle = 0 } = {}) {
  const rng = makeRng(seed)
  const table = rng.pick(TABLES)
  const cells = []
  table.rows.forEach((row, r) => row.forEach((v, c) => { if (v !== '—') cells.push([r, c]) }))
  const changes = []
  const b = table.rows.map((row) => row.slice())
  const target = Math.min(diffs, cells.length)
  const onePerRow = target <= table.rows.length
  for (const [r, c] of rng.shuffle(cells)) {
    if (changes.length >= target) break
    if (onePerRow && changes.some((ch) => ch.r === r)) continue // one change per row when the table allows
    const prefer = focusTrap && rng.next() < 0.7 ? focusTrap : rng.next() < subtle ? rng.pick(['similar', 'small-print']) : null
    const m = mutateCell(table.rows[r][c], rng, prefer)
    if (!m || m.value === table.rows[r][c]) continue
    b[r][c] = m.value
    changes.push({ r, c, from: table.rows[r][c], to: m.value, trap: m.trap, skill: m.skill, how: m.how })
  }
  return { table, a: table.rows, b, changes }
}
