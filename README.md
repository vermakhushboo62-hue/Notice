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

Observer, Memory Snapshot and Auditor content is generated from a seeded RNG, so every day is new but the same day always produces the same challenge. Proofreader and Detective use a curated question bank (`src/data/`).

## Learn from what you missed

Every question is tagged with a skill and the *trap* it sets. After each challenge you get:

- **What you noticed** — details you identified correctly.
- **What you missed** — each miss with the right answer and an explanation (plus any false flags).
- **Why you missed it** — rushing, assuming, overlooking small details, confusing similar items, missing position changes, or skimming numbers.
- **What to practise** — the next targeted session is chosen to train that weakness, e.g. *"You correctly identified most objects but missed 2 changes in their positioning. Tomorrow's exercise will focus on spatial relationships."*

## Dashboard and scoring

- **Daily scorecard** — accuracy (x/y, with false flags counted against the percentage), time taken, day streak, weekly accuracy.
- **Attention Profile** — recency-weighted accuracy over your last 40 items per skill: Visual observation, Written accuracy, Numerical accuracy, Critical evaluation, Recall. Skills show as *calibrating* until 8 items have been measured.
- **14-day accuracy trend**, **why you miss things** (misses by cause), **30-day progression** and recent sessions.
- *Load sample data* in Settings to preview a populated dashboard.

Scores reflect performance on these exercises only. They are not a cognitive, personality or health assessment.

## The adaptive engine — 30-day progression

| Week | Theme | Focus |
|---|---|---|
| 1 | Learn to notice | Slow observation, visual details and object recall |
| 2 | Learn to compare | Inconsistencies, differences and missing information |
| 3 | Learn to verify | Numbers, written details, assumptions and accuracy |
| 4 | Apply to real life | Emails, presentations, instructions, everyday decisions |

Odd days follow the programme. Even days (and every day after Day 30) are **adaptive**: they target the trap you fell for most in your last session, or your weakest skill if you made no mistakes. Programme days are also weighted toward your current focus.

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
