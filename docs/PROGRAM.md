# NOTICE — The 90-day programme

One 5-minute challenge a day for three months. The **blocks** below set the theme and a weighted **mix** of exercises. The daily exercise and its **level** are then chosen by how well, and how reliably, you finish your sessions.

Everything in this document is implemented in `src/lib/program.js` (blocks, the daily picker, levels) and `src/exercises/levels.js` (what each level means).

---

## Month 1 — Foundations · *See clearly* (days 1–30, levels 1–3)

Build the habit with slow, careful looking.

| Days | Block | Mix (starting odds) | Max level |
|---|---|---|---|
| 1–7 | **Learn to notice** — slow observation, visual details, object recall | Observer 43% · Memory 43% · Auditor 14% | L2 |
| 8–14 | **Learn to compare** — differences, inconsistencies, missing information | Auditor 38% · Memory 25% · Detective 25% · Observer 13% | L2 |
| 15–21 | **Learn to verify** — numbers, written details, assumptions | Proofreader 43% · Auditor 29% · Detective 29% | L3 |
| 22–28 | **Apply to real life** — emails, presentations, instructions | Proofreader 38% · Detective 38% · Auditor 13% · Observer 13% | L3 |
| 29–30 | ◆ **Month 1 checkpoint** — benchmark the least-practised exercises | all five | L3 |

## Month 2 — Depth · *Hold more, faster* (days 31–60, levels up to 4)

Shorter study times, more items, subtler differences.

| Days | Block | Mix | Max | Bias |
|---|---|---|---|---|
| 31–37 | **Faster eyes** — take in a whole scene quickly | Observer 43% · Memory 43% · Auditor 14% | L4 | |
| 38–44 | **Numbers that lie** — totals, percentages, dates, transposed digits | Auditor 43% · Proofreader 29% · Detective 29% | L4 | numbers |
| 45–51 | **Read between the lines** — what was said vs. what was assumed | Detective 43% · Proofreader 43% · Memory 14% | L4 | assuming |
| 52–58 | **Where things are** — spatial memory, position changes | Memory 43% · Observer 43% · Auditor 14% | L4 | spatial |
| 59–60 | ◆ **Month 2 checkpoint** | all five | L4 | |

## Month 3 — Mastery · *Apply it for real* (days 61–90, levels up to 5)

Workplace documents, hidden error counts, and a programme built around your weak spots.

| Days | Block | Mix | Max | Rule |
|---|---|---|---|---|
| 61–67 | **Documents at work** — proposals, invoices, budgets, specs | Proofreader 43% · Auditor 43% · Detective 14% | L5 | |
| 68–74 | **Claims and decisions** — meeting notes, reports, claims you'd act on | Detective 43% · Proofreader 29% · Auditor 29% | L5 | |
| 75–81 | **No safety net** — you decide when you're done | Proofreader 29% · Auditor 29% · Detective, Memory, Observer 14% each | L5 | error counts hidden |
| 82–88 | **Your weak spots** — driven by your Attention Profile | all five, equal | L5 | fully adaptive |
| 89–90 | ◆ **Final checkpoint** — how far you've come since Month 1 | all five | L5 | |

After Day 90, NOTICE switches to **Maintenance**: fully adaptive across all five exercises, up to level 5.

---

## How each day is mixed and matched

Every morning the picker scores each exercise in the current block:

1. **Block weight.** Starts from the block's mix (3 = core, 2 = supporting, 1 = occasional), plus a little day-seeded randomness.
2. **Your last mistake: +2.5.** The exercise that trains the trap you fell for most in your last daily session (spatial → Memory, numbers → Auditor, assuming → Detective, small print / similar items → Observer, rushing → Proofreader).
3. **Your weakest skill: +1.5** (from 5 sessions on; +3 in block 12 and Maintenance).
4. **Block bias: +1** toward the exercise for the block's theme trap (Month 2).
5. **No repeats.** −4 if it was yesterday's exercise, −1.5 if it was the day before's.

The highest score wins. Two situations override this:

- **Recovery day.** Your last session was left early, *or* your last two were both a struggle, *or* you're back after 3+ days away. You get the exercise you've been doing best, **one level easier**, to rebuild momentum.
- **Checkpoint day.** It benchmarks the exercise you've practised least.

## Levels: earned by finishing

Every exercise has its own level from 1 to 5. Each finished session gets one of three outcomes:

| Outcome | Rule | Effect |
|---|---|---|
| **Mastered** | ≥ 85% accuracy *and* finished within 5:00 | two in a row → **level up** |
| **Steady** | anything in between | level holds |
| **Struggled** | < 50% accuracy, *or* over 8:00, *or* left early | **level down** (min 1) |

Today's level = your ability level, capped at the block's maximum (and −1 on a recovery day). Practice-room sessions count toward levels too.

Two numbers on the dashboard track your ability to finish:

- **Finished:** the share of your last 14 daily sessions you completed.
- **On time:** the share of those you completed within 5 minutes.

## What each level means

| Level | Observer | Memory Snapshot | Auditor | Proofreader | Detective |
|---|---|---|---|---|---|
| 1 | 25 s study · 4 questions | 3×3 grid · 5 shapes · 2 changes · 20 s | 3 differences | 4 errors | 4 statements |
| 2 | 20 s · 5 questions | 4×4 · 7 shapes · 3 changes · 15 s | 4 · 20% subtle | 5 errors | 5 statements |
| 3 | 18 s · 5 · finer details | 4×4 · 9 shapes · 3 changes · 12 s | 5 · 40% subtle | 5 errors | 5 statements |
| 4 | 14 s · 6 · finer details | 5×5 · 11 shapes · 4 changes · 12 s | 6 · 60% subtle | 6 errors | 6 statements |
| 5 | 10 s · 6 · finer details | 5×5 · 13 shapes · 4 changes · 10 s | 7 · 80% subtle | 7 errors · count hidden | 7 statements |

"Subtle" differences are look-alike letters and unit or label changes rather than changed digits. "Finer details" adds questions about leaf counts, the stool and pot colours, and relative positions.

## Content supply for 90 days

| Exercise | Source | Variety |
|---|---|---|
| Observer | generated room scenes | unlimited |
| Memory Snapshot | generated grids | unlimited |
| Auditor | 7 base tables (budget, spec, project plan, price list, timesheet, KPI report, guest list) × generated differences | unlimited |
| Proofreader | 6 curated documents (used when one fits your level and you haven't seen it in 30 sessions) + 3 generated templates: invoice, team email, product page | unlimited |
| Detective | 6 curated cases + generated meeting notes on 4 topics (launch review, hiring, campaign planning, support review) | unlimited |
