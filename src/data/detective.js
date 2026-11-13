// Each case: an original source and a set of summary statements.
// verdict: 'match' | 'contradicts' | 'missing' (claim not supported by the source).
export const VERDICTS = {
  match: { label: 'Matches', hint: 'Supported by the original' },
  contradicts: { label: 'Contradicts', hint: 'The original says otherwise' },
  missing: { label: 'Not stated', hint: 'The original never says this' },
}

export const CASES = [
  {
    id: 'meeting-pricing',
    title: 'Meeting summary',
    sourceTitle: 'Original notes — Pricing review, Tuesday',
    source: `Attendees: Ana (Product), Ben (Sales), Chloe (Finance). Apologies: Dev.

1. Ben reported that 3 of the 5 enterprise prospects asked for annual billing.
2. The team agreed to test a 10% discount for annual plans, starting with new customers only.
3. Chloe will model the revenue impact and share it by Friday.
4. The decision on a mid-tier "Team" plan was postponed until the March review.
5. Next meeting: Tuesday, same time.`,
    statements: [
      { text: 'Most enterprise prospects asked for annual billing.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: '3 of 5 is a majority, so "most" is supported.' },
      { text: 'The 10% annual discount will be offered to all customers.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'The notes say new customers only.' },
      { text: 'Dev will model the revenue impact by Friday.', verdict: 'contradicts', trap: 'similar', skill: 'critical',
        why: 'Chloe owns the model. Dev wasn’t even at the meeting.' },
      { text: 'The team decided against launching a "Team" plan.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'The decision was postponed, not rejected.' },
      { text: 'Sales expects the discount to increase deal size.', verdict: 'missing', trap: 'assuming', skill: 'critical',
        why: 'Nobody said this. It sounds plausible, which is what makes it easy to accept.' },
    ],
  },
  {
    id: 'incident-report',
    title: 'Incident summary',
    sourceTitle: 'Original — Checkout outage report',
    source: `On Saturday 9 May, card payments failed for 47 minutes (14:12–14:59).
Cause: an expired security certificate on the payment gateway.
Impact: approximately 1,300 failed checkout attempts. About 60% of affected customers retried successfully within the hour.
PayPal payments were not affected.
Fix: the certificate was renewed manually. An automated renewal alert has been added.
Owner of follow-up actions: Priya Nair (Platform).`,
    statements: [
      { text: 'The outage lasted under an hour.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: '14:12 to 14:59 is 47 minutes.' },
      { text: 'All payment methods were down during the outage.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'PayPal payments kept working; only card payments failed.' },
      { text: 'Around 1,300 checkout attempts failed.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: 'Stated directly.' },
      { text: 'Most affected customers never completed their purchase.', verdict: 'contradicts', trap: 'numbers', skill: 'numerical',
        why: 'About 60% retried successfully — most did complete.' },
      { text: 'The certificate expired because of a vendor error.', verdict: 'missing', trap: 'assuming', skill: 'critical',
        why: 'The report gives no reason why the certificate expired.' },
    ],
  },
  {
    id: 'client-brief',
    title: 'Client call recap',
    sourceTitle: 'Original — Call with Halden Hotels, 12 Jan',
    source: `Halden wants a spring campaign for its three coastal hotels (Brixham, Salcombe, Fowey). Budget is capped at £25,000.
They want to target couples, not families.
Launch must be before the Easter weekend. Their marketing director, Ruth, signs off all creative.
They liked last year's photography but felt the copy was "too formal".
They asked whether we could include a video, but agreed it is optional.`,
    statements: [
      { text: 'The campaign covers three hotels.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: 'Brixham, Salcombe and Fowey.' },
      { text: 'Families are the primary audience.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'Couples, not families.' },
      { text: 'A video is required as part of the campaign.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'The video is optional.' },
      { text: 'Halden was happy with last year’s photography.', verdict: 'match', trap: 'similar', skill: 'critical',
        why: 'They liked the photography; it was the copy they wanted changed.' },
      { text: 'The budget can stretch if results are strong.', verdict: 'missing', trap: 'assuming', skill: 'critical',
        why: 'The budget is capped. Nothing suggests flexibility.' },
    ],
  },
  {
    id: 'policy-leave',
    title: 'Policy summary',
    sourceTitle: 'Original — Remote working policy (extract)',
    source: `Employees may work remotely up to 2 days per week after completing their 3-month probation.
Remote days must be agreed with your line manager at least one week in advance.
Team days (every Wednesday) are in the office for everyone.
Working from abroad is allowed for up to 10 working days per year, with HR approval.
Equipment for home working is provided on request.`,
    statements: [
      { text: 'New starters can work from home 2 days a week from day one.', verdict: 'contradicts', trap: 'small-print', skill: 'critical',
        why: 'Only after completing the 3-month probation.' },
      { text: 'Wednesday is an office day for everyone.', verdict: 'match', trap: 'small-print', skill: 'critical',
        why: 'Team days are every Wednesday, in the office.' },
      { text: 'You can work abroad for two working weeks a year with HR approval.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: '10 working days = two working weeks.' },
      { text: 'Remote days can be booked the day before.', verdict: 'contradicts', trap: 'small-print', skill: 'critical',
        why: 'They must be agreed at least one week in advance.' },
      { text: 'Employees receive a monthly allowance for home internet.', verdict: 'missing', trap: 'assuming', skill: 'critical',
        why: 'Only equipment on request is mentioned.' },
    ],
  },
  {
    id: 'survey-results',
    title: 'Research headline',
    sourceTitle: 'Original — Customer survey results (n = 420)',
    source: `68% of respondents said they use the mobile app at least weekly.
Of those weekly users, 45% said the search feature is "hard to use".
Satisfaction (scored 1–5) averaged 3.9, up from 3.6 last year.
Respondents were existing customers who opted into email research.
The most requested feature was dark mode (31% of free-text comments).`,
    statements: [
      { text: 'Nearly half of all respondents find search hard to use.', verdict: 'contradicts', trap: 'numbers', skill: 'numerical',
        why: '45% of weekly users (68%) is about 31% of all respondents, not nearly half.' },
      { text: 'Satisfaction improved compared with last year.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: '3.9, up from 3.6.' },
      { text: 'The results represent all of our customers.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: 'Only customers who opted into email research — a self-selected group.' },
      { text: 'Dark mode was the most requested feature.', verdict: 'match', trap: 'small-print', skill: 'critical',
        why: 'Stated directly (31% of free-text comments).' },
      { text: 'Weekly users are more satisfied than occasional users.', verdict: 'missing', trap: 'assuming', skill: 'critical',
        why: 'Satisfaction isn’t broken down by usage.' },
    ],
  },
  {
    id: 'stakeholder-thread',
    title: 'Decision log',
    sourceTitle: 'Original — Email thread, launch timing',
    source: `Mon (Jo, Product): Proposing we move launch from 3 June to 17 June to finish accessibility fixes.
Mon (Sam, Marketing): 17 June clashes with the industry conference. Could we do 10 June?
Tue (Jo): 10 June is too tight for QA. 24 June works.
Tue (Alex, Director): Agreed — 24 June. Marketing to move the press release; Jo to confirm with QA by Thursday.`,
    statements: [
      { text: 'The launch was moved to 17 June.', verdict: 'contradicts', trap: 'assuming', skill: 'critical',
        why: '17 June was proposed but the final decision was 24 June.' },
      { text: 'Accessibility fixes were the reason for the original delay.', verdict: 'match', trap: 'small-print', skill: 'critical',
        why: 'Jo’s first message gives that reason.' },
      { text: 'Sam approved the final date.', verdict: 'missing', trap: 'similar', skill: 'critical',
        why: 'Alex (the director) approved it. Sam’s view on 24 June isn’t recorded.' },
      { text: 'Jo will confirm with QA by Thursday.', verdict: 'match', trap: 'small-print', skill: 'critical',
        why: 'Stated in Alex’s message.' },
      { text: 'The new date is three weeks after the original.', verdict: 'match', trap: 'numbers', skill: 'numerical',
        why: '3 June to 24 June is exactly three weeks.' },
    ],
  },
]
