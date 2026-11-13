# NOTICE

**A daily practice for sharper observation and attention to detail.**

Every day you get one 5-minute challenge. You observe, identify, compare or investigate something, and NOTICE evaluates how accurately you noticed the details — then tells you what you missed, *why* you probably missed it, and what you'll practise next.

No leaderboards, no social sharing, no badges, no endless levels. A quiet daily ritual.

## The five exercises

| # | Exercise | Trains | How it works |
|---|---|---|---|
| 01 | **The Observer** | Visual attention | Study a generated room scene for 20 s. It disappears. Answer 5 questions about counts, colours, positions and small text. |
| 02 | **The Proofreader** | Accuracy | Tap every error in a real-world document (proposal, email, invoice, instructions, presentation, campaign brief). |
| 03 | **The Detective** | Logical observation | Read an original source, then judge each summary statement: *Matches*, *Contradicts* or *Not stated*. |
| 04 | **The Memory Snapshot** | Observation recall | Study a grid of shapes for 15 s, then find the three things that moved, changed colour, changed shape or appeared. |
| 05 | **The Auditor** | Analytical attention | Compare two versions of a budget, spec, project plan, price list or guest list and find the 5 subtle differences. |

Every exercise scales from level 1 to 5 (study time, items, number and subtlety of errors). Content is generated from a seeded RNG, plus curated documents and cases in `src/data/`.

## Learn from what you missed

Every question is tagged with a skill and the *trap* it sets. After each challenge you get:

- **What you noticed** — details you identified correctly.
- **What you missed** — each miss with the right answer and an explanation (plus any false flags).
- **Why you missed it** — rushing, assuming, overlooking small details, confusing similar items, missing position changes, or skimming numbers.
- **What to practise** — the next targeted session is chosen to train that weakness, e.g. *"You correctly identified most objects but missed 2 changes in their positioning. Tomorrow's exercise will focus on spatial relationships."*

## Dashboard and scoring

- **Daily scorecard**: accuracy (x/y, with false flags counted against the percentage), time taken, day streak, weekly accuracy, plus **Finished** and **On time** rates.
- **Exercise levels**: your current level (1–5) in each exercise.
- **Attention Profile** — recency-weighted accuracy over your last 40 items per skill: Visual observation, Written accuracy, Numerical accuracy, Critical evaluation, Recall. Skills show as *calibrating* until 8 items have been measured.
- **14-day accuracy trend**, **why you miss things** (misses by cause), the **90-day map** and recent sessions. The **Programme** tab shows the full plan and what your next level unlocks.
- *Load sample data* in Settings to preview a populated dashboard.

Scores reflect performance on these exercises only. They are not a cognitive, personality or health assessment.

## The 90-day programme

Three months, thirteen blocks, mixed and matched daily by your ability to finish. Full design: **[docs/PROGRAM.md](docs/PROGRAM.md)**.

| Month | Theme | Blocks | Levels |
|---|---|---|---|
| 1 · Foundations | See clearly | Learn to notice → Learn to compare → Learn to verify → Apply to real life → checkpoint | 1–3 |
| 2 · Depth | Hold more, faster | Faster eyes → Numbers that lie → Read between the lines → Where things are → checkpoint | up to 4 |
| 3 · Mastery | Apply it for real | Documents at work → Claims and decisions → No safety net → Your weak spots → final checkpoint | up to 5 |

- **Daily mix:** each block weights its exercises. The picker then boosts the exercise that trains your most recent trap and your weakest skill, and avoids repeating yesterday's exercise.
- **Levels 1–5 per exercise:** two sessions in a row at ≥85% within 5 minutes moves you up a level. Under 50%, over 8 minutes, or leaving early moves you down one.
- **Recovery days:** after leaving a session early, two struggles in a row, or 3+ days away, you get a lighter session on the exercise you're doing best.
- **Content for 90 days:** Observer, Memory and Auditor are generated. Proofreader and Detective combine curated documents with generated invoices, emails, product pages and meeting notes.

NOTICE trains four related abilities, because noticing more and making fewer mistakes are not the same thing: **visual attention** (spotting a small inconsistency), **critical evaluation** (catching a claim that doesn't hold up), **recall** (remembering what you saw), and **analytical accuracy** (checking one number against another).

## Tech

- React 18 + Tailwind CSS 4, built with Vite
- Mobile-first installable PWA (manifest + offline service worker)
- Data stored in `localStorage` on the device; export as JSON from Settings
- Light and dark themes
- Vitest for engine, generator and content checks

```bash
npm install
npm run dev      # local dev server
npm test         # unit tests
npm run build    # production build in dist/
```

### Deploying

`.github/workflows/deploy.yml` builds, tests and deploys to GitHub Pages on every push to `main`. Enable it once under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Project layout

```
src/
  lib/          engine (scheduling, scoring, diagnosis, profile), RNG, storage, constants
  data/         Proofreader documents, Detective cases, Auditor tables + mutation generator
  exercises/    the five exercise components + Observer scene and Memory grid generators
  components/   dashboard, results, charts, shared UI
```

## Adding content

- **Proofreader**: add a document to `src/data/proofreader.js`. Mark errors as `{{shown|correct|trap|skill|explanation}}`.
- **Detective**: add a case to `src/data/detective.js` with five statements, each `match`, `contradicts` or `missing`.
- **Auditor**: add a table to `src/data/auditor.js`; differences are generated automatically.
