// Curated documents. Errors use {{shown|correct|trap|skill|why}} markup.
// The "shown" text is what the reader sees; tapping it counts as finding the error.
export const PROOF_DOCS = [
  {
    id: 'proposal-greenleaf',
    level: 3,
    title: 'Business proposal',
    kind: 'Proposal',
    week: 2,
    text: `Proposal: Website redesign for Greenleaf Organics

Prepared for: Maya Chen, Head of Marketing, Greenleaf Organics
Prepared by: Northline Studio · 3 March 2026

Dear Maya,

Thank you for meeting with us on 27 February. As discussed, Northline will redesign the Greenleaf website over a {{ten-week|twelve-week|numbers|numerical|The timeline below adds up to twelve weeks (2 + 4 + 4 + 2), not ten.}} engagement, starting on 6 April.

Timeline: Discovery (2 weeks), Design (4 weeks), Build (4 weeks), Launch and QA (2 weeks).

Budget: Discovery £4,500, Design £9,000, Build £12,500, Launch £2,000. Total: {{£27,500|£28,000|numbers|numerical|£4,500 + £9,000 + £12,500 + £2,000 = £28,000.}}

Your project lead will be Daniel Ross, who led our work for Hartwell Foods. {{David|Daniel|similar|written|The project lead is introduced as Daniel Ross; later he becomes David.}} will be your single point of contact throughout the project.

We will deliver {{responsive|responsive|none|written|}} page templates for the home, product, recipe and contact pages — {{five|four|numbers|numerical|Four pages are listed: home, product, recipe and contact.}} templates in total.

All work is covered by our standard {{60-day|30-day|assuming|critical|The terms section at the end says the warranty is 30 days.}} warranty after launch.

We look forward to {{workng|working|small-print|written|Spelling: "working" is missing an "i".}} with you and the Greenleaf team.

Terms: Invoices are payable within 14 days. Warranty: 30 days from launch.

Kind regards,
Northline Studio`,
  },
  {
    id: 'email-offsite',
    level: 2,
    title: 'Team email',
    kind: 'Email',
    week: 4,
    text: `Subject: Offsite logistics — Thursday 18 June

Hi all,

Quick logistics for next week's offsite. We meet at the Harbour Room, 4th floor, 22 Quay Street at 9:30 on {{Wednesday|Thursday|assuming|critical|The subject line says Thursday 18 June.}} 18 June.

Agenda:
9:30 — Coffee and welcome
10:00 — Q3 priorities (Priya)
11:30 — Customer research readout (Tom)
12:30 — Lunch
13:30 — Workshop led by {{Pryia|Priya|similar|written|The name is misspelled — she appears as Priya earlier in the agenda.}}
16:00 — Close

Lunch is booked for 14 people. With the 12 of us plus our two guests from Finance, that makes {{15|14|numbers|numerical|12 + 2 = 14, which matches the booking.}}, so we're covered.

Please send dietary requirements to {{Priya|Tom|assuming|critical|The final line asks you to reply to Tom, who is handling dietary needs.}} by Monday.

The nearest station is Quay Street, a {{5-minute|5-minute|none|written|}} walk.

Reminder: the room has a strict 16:00 finish, so the workshop can run until {{16:30|16:00|numbers|numerical|The room closes at 16:00, so nothing can run until 16:30.}} at the latest.

Tom is collecting dietary needs — reply to him directly.

Thanks,
Sam`,
  },
  {
    id: 'instructions-espresso',
    level: 2,
    title: 'Written instructions',
    kind: 'Instructions',
    week: 3,
    text: `Cleaning the Barista Pro espresso machine (monthly descaling)

You will need: one sachet of descaler, a 1.5-litre container, and about 25 minutes.

1. Turn the machine off and let it cool for 15 minutes.
2. Empty the water tank and dissolve one sachet of descaler in 1 litre of water.
3. Place the {{1-litre|1.5-litre|numbers|numerical|The equipment list asks for a 1.5-litre container, and step 5 runs 1.5 litres through.}} container under the steam wand and group head.
4. Press and hold the CLEAN button for {{3 seconds|5 seconds|small-print|written|The note at the bottom says to hold CLEAN for 5 seconds; 3 seconds won't start the cycle.}} until the light flashes.
5. The machine will run the solution through in cycles. This takes about 20 minutes.
6. When the light stops flashing, rinse the tank and fill it with {{descaler|fresh water|assuming|critical|After descaling you rinse with fresh water, not more descaler.}}.
7. Repeat steps {{3 and 4|3 and 4|none|written|}} to flush the system.
8. Turn the machine {{of|off|small-print|written|"of" should be "off".}} and wipe the drip tray.

Total time: about {{35|25|numbers|numerical|The introduction says about 25 minutes.}} minutes.

Note: Hold CLEAN for 5 seconds. A short press only switches the light on.`,
  },
  {
    id: 'update-q3',
    level: 4,
    title: 'Presentation notes',
    kind: 'Presentation',
    week: 4,
    text: `Slide 4 — Q3 performance summary

Revenue grew 18% year on year, from £2.4m to {{£2.73m|£2.83m|numbers|numerical|£2.4m × 1.18 = £2.83m.}}.

New customers: 340 in Q3 (Q2: 290), an increase of {{40|50|numbers|numerical|340 − 290 = 50.}}.

Our top channel was organic search (41% of sign-ups), followed by referrals (27%) and paid social (22%). The remaining {{12%|10%|numbers|numerical|41 + 27 + 22 = 90, so the remainder is 10%.}} came from events.

Churn fell to 2.1% — the lowest since we started reporting it in 2023.

Slide 5 — What changed

The onboarding redesign launched on 4 July. Since then, activation has risen from 54% to {{61%|61%|none|written|}}.

We hired three engineers and {{two|one|small-print|written|The team footnote lists a single new designer, Ana Ruiz.}} designer in Q3.

{{Accross|Across|small-print|written|Spelling: "Across".}} the quarter, support response time improved from 6 hours to {{under|under|none|written|}} 4 hours.

Recommendation: double investment in paid social, our {{strongest|third-largest|assuming|critical|Paid social was the third channel at 22% — not the strongest. Organic search was.}} channel.

Team footnote: New in Q3 — engineers Lee, Okafor, Brandt; designer Ana Ruiz.`,
  },
  {
    id: 'invoice-note',
    level: 3,
    title: 'Invoice cover note',
    kind: 'Finance',
    week: 3,
    text: `Invoice INV-2048 — Lumen Analytics Ltd

Billed to: Carter & Webb LLP, 14 Fenwick Row, Leeds LS1 4DP
Invoice date: 2 October · Payment due: 30 days

Services (September):
Data audit — 6 days at £650/day = £3,900
Dashboard build — 4 days at £650/day = {{£2,500|£2,600|numbers|numerical|4 × £650 = £2,600.}}
Training session (half day) = £325

Subtotal: £6,825
VAT at 20%: {{£1,356|£1,365|numbers|numerical|20% of £6,825 is £1,365 — the digits are transposed.}}
Total due: £8,190

Payment due by {{2 October|1 November|assuming|critical|Invoice date is 2 October with 30-day terms, so payment is due 1 November.}}.

Please pay by bank transfer to Lumen Analytics Ltd, sort code 20-45-77, account 31884260. Please quote {{INV-2084|INV-2048|similar|written|The invoice number is INV-2048; the reference reverses the last two digits.}} as your reference.

Questions? Contact {{accounts@lumenanalytcs.com|accounts@lumenanalytics.com|small-print|written|The email domain is missing an "i": lumenanalytics.}}.

Thank you for your business — it was a pleasure working with the {{Carter & Webb|Carter & Webb|none|written|}} team.`,
  },
  {
    id: 'campaign-brief',
    level: 4,
    title: 'Campaign brief',
    kind: 'Marketing',
    week: 4,
    text: `Campaign brief: "Fresh Start" spring launch

Product: Brightway Daily Planner (2027 edition)
Launch date: 1 March · Campaign runs for 6 weeks, ending {{29 March|12 April|numbers|numerical|Six weeks from 1 March ends on 12 April; 29 March is only four weeks.}}.

Audience: Professionals aged 25–40 who want calmer, more focused weeks.

Key message: "Plan less. Notice more."

Claims we can use:
— Recycled paper (certified)
— 12 months of weekly spreads
— Lay-flat binding

Claims we must NOT use: "eco-friendly" (not certified), "best-selling".

Headline options:
1. "Plan less. Notice more."
2. "The {{best-selling|go-to (no unproven claims)|assuming|critical|"Best-selling" is on the list of claims we must not use.}} planner for focused weeks"
3. "{{18|12|numbers|numerical|The product has 12 months of weekly spreads.}} months of calmer weeks"

Budget: £40,000 — paid social £18,000, influencer partnerships £12,000, search £{{8,000|10,000|numbers|numerical|£40,000 − £18,000 − £12,000 = £10,000 left for search.}}.

Approvals: copy to Lena (brand) by 10 February; legal review by {{17 Febuary|17 February|small-print|written|Spelling: "February".}}.

Tone: warm, {{unhurried|unhurried|none|written|}}, never pushy. Avoid {{exclamation marks|exclamation marks|none|written|}} and urgency language like "{{last chance|last chance|none|written|}}".`,
  },
]

// Parse markup into segments: { type: 'text', value } | { type: 'error', shown, correct, trap, skill, why, decoy }
// Segments marked trap "none" are decoys that look suspicious but are correct.
export function parseDoc(text) {
  const segs = []
  const re = /\{\{([^|}]*)\|([^|}]*)\|([^|}]*)\|([^|}]*)\|([^}]*)\}\}/g
  let last = 0
  let m
  let n = 0
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ type: 'text', value: text.slice(last, m.index) })
    const [, shown, correct, trap, skill, why] = m
    if (trap === 'none') segs.push({ type: 'text', value: shown })
    else segs.push({ type: 'error', id: `e${n++}`, shown, correct, trap, skill, why })
    last = m.index + m[0].length
  }
  if (last < text.length) segs.push({ type: 'text', value: text.slice(last) })
  return segs
}
