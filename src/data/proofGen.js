// Generated Proofreader documents. Each template exposes "error slots";
// the level decides how many are switched on. Every slot renders the
// correct value when off, so the document is always internally consistent.
import { makeRng } from '../lib/rng.js'

const E = (shown, correct, trap, skill, why) => `{{${shown}|${correct}|${trap}|${skill}|${why.replace(/[|}]/g, '')}}}`
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const fmtDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`
const fmtDay = (d) => `${DAYS[d.getDay()]} ${fmtDate(d)}`
const money = (n) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`
const swapDigits = (s) => {
  const m = [...s.matchAll(/\d(?=\d)/g)].map((x) => x.index).filter((i) => s[i] !== s[i + 1])
  if (!m.length) return null
  const i = m[m.length > 1 ? 1 : 0]
  return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2)
}

export const SPELLING = [
  ['receive', 'recieve'], ['separate', 'seperate'], ['accommodation', 'accomodation'], ['definitely', 'definately'],
  ['calendar', 'calender'], ['occurred', 'occured'], ['necessary', 'neccessary'], ['colleague', 'collegue'],
  ['guarantee', 'guarentee'], ['independent', 'independant'], ['address', 'adress'], ['beginning', 'begining'],
  ['committee', 'commitee'], ['environment', 'enviroment'], ['recommend', 'reccomend'], ['schedule', 'schedual'],
]
const NAMES = [['Daniel', 'Danielle'], ['Sophie', 'Sofie'], ['Rahul', 'Rahil'], ['Catherine', 'Katherine'], ['Marcus', 'Markus'],
  ['Aisha', 'Aysha'], ['Stephen', 'Steven'], ['Elena', 'Elaina'], ['Jonathan', 'Jonathon'], ['Fiona', 'Fionna']]
const SURNAMES = ['Ross', 'Patel', 'Okafor', 'Lindqvist', 'Moreno', 'Brandt', 'Chen', 'Walsh', 'Haddad', 'Novak']

function pickSlots(rng, slots, n) {
  return new Set(rng.sample(Object.keys(slots), Math.min(n, Object.keys(slots).length)))
}

// ---------------- Template: invoice ----------------
function invoice(rng, n) {
  const vendor = rng.pick(['Lumen Analytics', 'Harbour Print Co', 'Fieldstone Design', 'Brightline Studio', 'Kestrel Research'])
  const domain = vendor.toLowerCase().replace(/[^a-z]/g, '')
  const [client, clientTypo] = rng.pick([['Carter & Webb', 'Carter & Web'], ['Marlowe Foods', 'Marlow Foods'], ['Ashby Partners', 'Ashbey Partners'], ['Northgate Homes', 'Northgate Home']])
  const services = rng.sample(['Strategy workshop', 'Data audit', 'Dashboard build', 'Copywriting', 'User interviews', 'Design sprint', 'Report writing'], 3)
  const rate = rng.pick([450, 500, 550, 600, 650, 720])
  const qty = [rng.int(2, 6), rng.int(2, 8), rng.int(1, 4)]
  const totals = qty.map((q) => q * rate)
  const sub = totals.reduce((a, c) => a + c, 0)
  const vat = sub * 0.2
  const total = sub + vat
  const issued = new Date(2027, rng.int(0, 10), rng.int(1, 20))
  const terms = rng.pick([14, 30])
  const due = new Date(issued); due.setDate(due.getDate() + terms)
  const wrongDue = new Date(issued); wrongDue.setDate(wrongDue.getDate() + (terms === 30 ? 14 : 30))
  let inv
  do { inv = `INV-${rng.int(2100, 4899)}` } while (!swapDigits(inv))
  const [word, typo] = rng.pick(SPELLING)
  const wrongLine = totals[1] + rng.pick([-100, 100, 50, -50])
  const vatStr = money(vat)
  const vatWrong = swapDigits(vatStr) || money(vat + 10)
  const subWrong = sub + rng.pick([100, -100, 1000])

  const slots = {
    line: () => E(money(wrongLine), money(totals[1]), 'numbers', 'numerical', `${qty[1]} × ${money(rate)} = ${money(totals[1])}. (The subtotal is right; this line is wrong.)`),
    subtotal: () => E(money(subWrong), money(sub), 'numbers', 'numerical', `${totals.map(money).join(' + ')} = ${money(sub)}.`),
    vat: () => E(vatWrong, vatStr, 'numbers', 'numerical', `20% of ${money(sub)} is ${vatStr}.`),
    due: () => E(fmtDate(wrongDue), fmtDate(due), 'assuming', 'critical', `Issued ${fmtDate(issued)} with ${terms}-day terms, so payment is due ${fmtDate(due)}.`),
    ref: () => E(swapDigits(inv), inv, 'similar', 'written', `The invoice number is ${inv}; the reference swaps two digits.`),
    client: () => E(clientTypo, client, 'similar', 'written', `The client is ${client}, as in the "Billed to" line.`),
    spelling: () => E(typo, word, 'small-print', 'written', `Spelling: "${word}".`),
    email: () => E(`accounts@${domain.slice(0, 3)}${domain.slice(4)}.com`, `accounts@${domain}.com`, 'small-print', 'written', `The domain is missing a letter: ${domain}.com.`),
  }
  const on = pickSlots(rng, slots, n)
  const s = (k, ok) => (on.has(k) ? slots[k]() : ok)
  const sentence = {
    receive: 'Please confirm you receive this invoice.', separate: 'Expenses will be billed on a separate invoice.',
    accommodation: 'Travel and accommodation are included in the day rate.', definitely: 'We will definitely send the final report next week.',
    calendar: 'The next workshop is in our shared calendar.', occurred: 'No additional costs occurred this month.',
    necessary: 'No further action is necessary on your side.', colleague: 'My colleague will send the report separately.',
    guarantee: 'Our quality guarantee applies to all deliverables.', independent: 'The audit was carried out by an independent reviewer.',
    address: 'Please note our new address below.', beginning: 'Work on phase two is beginning next month.',
    committee: 'The steering committee has approved phase two.', environment: 'All data stayed in your secure environment.',
    recommend: 'We recommend reviewing the dashboard monthly.', schedule: 'Phase two will follow the agreed schedule.',
  }[word]
  return {
    id: 'gen-invoice', title: `Invoice ${inv}`, kind: 'Invoice',
    text: `Invoice ${inv} — ${vendor} Ltd

Billed to: ${client} · Issued: ${fmtDate(issued)} · Terms: ${terms} days

${services[0]} — ${qty[0]} days at ${money(rate)}/day = ${money(totals[0])}
${services[1]} — ${qty[1]} days at ${money(rate)}/day = ${s('line', money(totals[1]))}
${services[2]} — ${qty[2]} day${qty[2] === 1 ? '' : 's'} at ${money(rate)}/day = ${money(totals[2])}

Subtotal: ${s('subtotal', money(sub))}
VAT at 20%: ${s('vat', vatStr)}
Total due: ${money(total)}

Payment is due by ${s('due', fmtDate(due))}. Please quote ${s('ref', inv)} as your reference.

${sentence.replace(word, s('spelling', word))}

Questions? Email ${s('email', `accounts@${domain}.com`)}.

Thank you — it’s a pleasure working with the ${s('client', client)} team.`,
  }
}

// ---------------- Template: team email ----------------
function teamEmail(rng, n) {
  const date = new Date(2027, rng.int(0, 10), rng.int(3, 25))
  const wrongDay = new Date(date); wrongDay.setDate(date.getDate() + 1)
  const [room, roomAlt] = rng.pick([['Cedar Room', 'Cedar Hall'], ['Harbour Room', 'Harbour Suite'], ['Atlas Room', 'Atlas Studio'], ['Orchard Room', 'Orchard Hall']])
  const people = rng.sample(NAMES, 3).map((p) => p.concat(rng.pick(SURNAMES)))
  const [lead, organiser, other] = people
  const team = rng.int(8, 14), guests = rng.int(2, 4)
  const start = rng.pick(['9:00', '9:30', '10:00'])
  const close = rng.pick(['16:00', '16:30', '17:00'])
  const closeLate = close === '16:00' ? '16:30' : close === '16:30' ? '17:00' : '17:30'
  const topic = rng.pick(['Q3 priorities', 'the pricing review', 'the brand refresh', 'next year’s roadmap'])
  const [word, typo] = rng.pick(SPELLING.filter(([w]) => ['separate', 'calendar', 'necessary', 'colleague', 'schedule', 'recommend', 'address', 'definitely'].includes(w)))
  const later = start === '9:00' ? '9:30' : start === '9:30' ? '10:00' : '10:30'
  const slots = {
    weekday: () => E(DAYS[wrongDay.getDay()], DAYS[date.getDay()], 'assuming', 'critical', `The subject line says ${fmtDay(date)}.`),
    start: () => E(later, start, 'numbers', 'numerical', `The agenda starts at ${start}.`),
    headcount: () => E(String(team + guests + 1), String(team + guests), 'numbers', 'numerical', `${team} + ${guests} = ${team + guests}.`),
    room: () => E(roomAlt, room, 'similar', 'written', `Everywhere else it’s the ${room}.`),
    owner: () => E(lead[0], organiser[0], 'assuming', 'critical', `The last line says ${organiser[0]} is collecting dietary needs.`),
    name: () => E(lead[1], lead[0], 'similar', 'written', `The presenter is ${lead[0]} — spelled ${lead[1]} here.`),
    spelling: () => E(typo, word, 'small-print', 'written', `Spelling: "${word}".`),
    close: () => E(closeLate, close, 'numbers', 'numerical', `The room closes at ${close}, so nothing can run later.`),
  }
  const on = pickSlots(rng, slots, n)
  const s = (k, ok) => (on.has(k) ? slots[k]() : ok)
  const line = {
    separate: `Parking details will follow in a separate email.`, calendar: `I’ve added it to everyone’s calendar.`,
    necessary: `No preparation is necessary.`, colleague: `Feel free to forward this to any colleague who should join.`,
    schedule: `The schedule is below.`, recommend: `I recommend arriving ten minutes early.`, address: `The address is on the invite.`,
    definitely: `Lunch is definitely included.`,
  }[word]
  return {
    id: 'gen-email', title: `Email: ${topic} day`, kind: 'Email',
    text: `Subject: ${topic[0].toUpperCase() + topic.slice(1)} day — ${fmtDay(date)}

Hi all,

We’ll meet in the ${room} at ${s('start', start)} on ${s('weekday', DAYS[date.getDay()])} ${fmtDate(date)}. ${line.replace(word, s('spelling', word))}

${start} — Coffee and welcome
${start === '9:00' ? '9:30' : start === '9:30' ? '10:00' : '10:30'} — ${topic[0].toUpperCase() + topic.slice(1)} (${s('name', lead[0])})
12:30 — Lunch
13:30 — Workshop (${other[0]})
${close} — Close. The ${s('room', room)} must be empty by ${close}, so the workshop can run until ${s('close', close)} at the latest.

Lunch is booked for ${team + guests}: the ${team} of us plus ${guests} guests makes ${s('headcount', String(team + guests))}.

Please send dietary requirements to ${s('owner', organiser[0])} by Friday.

${organiser[0]} is collecting dietary needs — reply to them directly.

Thanks,
${other[0]}`,
  }
}

// ---------------- Template: product listing ----------------
function productListing(rng, n) {
  const [name, model] = rng.pick([['Aero 2 headphones', 'AX-240'], ['Lumo desk lamp', 'LD-310'], ['Trail 30 backpack', 'TB-630'], ['Brew One kettle', 'BK-170']])
  const modelWrong = model.replace(/\d(?=\d$)/, (d) => String((Number(d) + 1) % 10))
  const price = rng.pick([80, 120, 150, 180, 240])
  const pct = rng.pick([20, 25, 30])
  const sale = Math.round(price * (100 - pct)) / 100
  const colours = rng.sample(['Graphite', 'Sand', 'Sage', 'Navy', 'Clay', 'Chalk'], 3)
  const weight = (rng.int(4, 18) / 10).toFixed(1)
  const warranty = rng.pick([1, 2, 3])
  const height = rng.int(18, 48)
  const [word, typo] = rng.pick(SPELLING.filter(([w]) => ['guarantee', 'recommend', 'independent', 'environment', 'definitely'].includes(w)))
  const slots = {
    sale: () => E(money(sale + rng.pick([5, 10, -5])), money(sale), 'numbers', 'numerical', `${pct}% off ${money(price)} is ${money(sale)}.`),
    colours: () => E('four', 'three', 'numbers', 'numerical', `Three colours are listed: ${colours.join(', ')}.`),
    unit: () => E(`${weight} g`, `${weight} kg`, 'small-print', 'written', `The spec table gives the weight as ${weight} kg.`),
    height: () => E(`${height + 2} cm`, `${height} cm`, 'numbers', 'numerical', `The spec table says ${height} cm.`),
    warranty: () => E(`${warranty + 1}-year`, `${warranty}-year`, 'assuming', 'critical', `The spec table gives a ${warranty}-year warranty.`),
    model: () => E(modelWrong, model, 'similar', 'written', `The model number is ${model}, as in the title.`),
    spelling: () => E(typo, word, 'small-print', 'written', `Spelling: "${word}".`),
  }
  const on = pickSlots(rng, slots, n)
  const s = (k, ok) => (on.has(k) ? slots[k]() : ok)
  const line = {
    guarantee: 'Every order comes with our 30-day money-back guarantee.', recommend: 'We recommend the matching travel case.',
    independent: 'Tested by an independent lab.', environment: 'Packaged with the environment in mind.', definitely: 'You will definitely want the travel case.',
  }[word]
  return {
    id: 'gen-product', title: `Product page: ${name}`, kind: 'Product page',
    text: `${name} — model ${model}

Now ${pct}% off: was ${money(price)}, now ${s('sale', money(sale))}.

Available in ${s('colours', 'three')} colours: ${colours.join(', ')}. At just ${s('unit', `${weight} kg`)} and ${s('height', `${height} cm`)} tall, the ${s('model', model)} goes anywhere. Backed by our ${s('warranty', `${warranty}-year`)} warranty.

${line.replace(word, s('spelling', word))}

Specifications
Model: ${model}
Weight: ${weight} kg
Height: ${height} cm
Colours: ${colours.join(', ')}
Warranty: ${warranty} years`,
  }
}

export const PROOF_TEMPLATES = { invoice, teamEmail, productListing }

export function generateProofDoc(seed, errors) {
  const rng = makeRng(seed)
  const key = rng.pick(Object.keys(PROOF_TEMPLATES))
  return PROOF_TEMPLATES[key](rng, errors)
}
