# Laboratoire Bell-Magendie 🔬

Virtual biology lab for teaching Bell-Magendie's Law, with student tracking and teacher Excel export.

## Setup

```bash
npm install
npm start
```

Server runs at **http://localhost:3000**

## Teacher Access

Default password: `magendie2024`

Change it via environment variable:
```bash
TEACHER_PASSWORD=yourpassword npm start
```

To access the teacher panel, click **"👩‍🏫 Enseignant"** in the top-right corner of the lab.

## What gets stored (SQLite `lab.db`)

- Student name + session start/end time
- Each QCM answer: experiment zone, question text, answer given, correct/incorrect, number of attempts
- Final score per student

## Excel Export (3 sheets)

| Sheet | Contents |
|-------|----------|
| Résumé | One row per student — name, score, per-experiment result + attempt count |
| Réponses Détaillées | Every individual answer with timestamps |
| Statistiques Classe | Class averages and per-experiment success rates |

## Bug Fixes vs Original

1. Cut→stimulate observation now fires correctly (fixed broken `.click()` auto-switch flow)
2. `alert()` replaced with inline non-blocking message
3. Muscle animation fixed — now scales from center using SVG `<g>` with `transform-origin`
4. `position:absolute` overlay removed — interaction lock is JS-based (`lockInteraction` flag)
5. Progress indicator shows 0/3 → 1/3 → 2/3 → 3/3 live
6. "Carnet Scientific" typo fixed → "Carnet Scientifique"
7. Cuts are one-at-a-time by design but now reset cleanly with visual feedback
8. `body { overflow: hidden }` no longer clips notebook scroll panel

## Stack

- **Backend**: Node.js + Express
- **Excel**: exceljs
