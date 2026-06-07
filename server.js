require('dotenv').config();
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// ─── DB SETUP ───────────────────────────────────────────────────────────────
const db = new DatabaseSync('lab.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    score INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    experiment TEXT NOT NULL,
    question TEXT NOT NULL,
    answer_given TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 1,
    answered_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );
`);

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'magendie2024';

// ─── STUDENT ROUTES ──────────────────────────────────────────────────────────

// Start session — student registers their name
app.post('/api/session/start', (req, res) => {
  const { studentName } = req.body;
  if (!studentName || !studentName.trim()) {
    return res.status(400).json({ error: 'Student name is required' });
  }
  const stmt = db.prepare('INSERT INTO sessions (student_name, started_at) VALUES (?, ?)');
  const info = stmt.run(studentName.trim(), new Date().toISOString());
  res.json({ sessionId: info.lastInsertRowid });
});

// Record an answer
app.post('/api/session/answer', (req, res) => {
  const { sessionId, experiment, question, answerGiven, isCorrect, attempts } = req.body;
  if (!sessionId || !experiment || !question || !answerGiven) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Upsert — replace previous attempt for same session+experiment
  const existing = db.prepare(
    'SELECT id FROM answers WHERE session_id = ? AND experiment = ?'
  ).get(sessionId, experiment);

  if (existing) {
    db.prepare(`
      UPDATE answers SET answer_given = ?, is_correct = ?, attempts = ?, answered_at = ?
      WHERE session_id = ? AND experiment = ?
    `).run(answerGiven, isCorrect ? 1 : 0, attempts, new Date().toISOString(), sessionId, experiment);
  } else {
    db.prepare(`
      INSERT INTO answers (session_id, experiment, question, answer_given, is_correct, attempts, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(sessionId, experiment, question, answerGiven, isCorrect ? 1 : 0, attempts, new Date().toISOString());
  }

  res.json({ ok: true });
});

// Finish session
app.post('/api/session/finish', (req, res) => {
  const { sessionId } = req.body;
  const answers = db.prepare('SELECT is_correct FROM answers WHERE session_id = ?').all(sessionId);
  const score = answers.filter(a => a.is_correct).length;
  db.prepare('UPDATE sessions SET finished_at = ?, score = ?, total = ? WHERE id = ?')
    .run(new Date().toISOString(), score, answers.length, sessionId);
  res.json({ ok: true, score, total: answers.length });
});

// ─── TEACHER ROUTES ──────────────────────────────────────────────────────────

app.post('/api/teacher/login', (req, res) => {
  const { password } = req.body;
  if (password === TEACHER_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' });
  }
});

app.get('/api/teacher/stats', (req, res) => {
  const { password } = req.query;
  if (password !== TEACHER_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  const sessions = db.prepare(`
    SELECT s.id, s.student_name, s.started_at, s.finished_at, s.score, s.total
    FROM sessions s ORDER BY s.started_at DESC
  `).all();

  const allAnswers = db.prepare(`
    SELECT a.*, s.student_name FROM answers a
    JOIN sessions s ON a.session_id = s.id
  `).all();

  res.json({ sessions, answers: allAnswers });
});

app.get('/api/teacher/export', async (req, res) => {
  const { password } = req.query;
  if (password !== TEACHER_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  const sessions = db.prepare(`
    SELECT s.id, s.student_name, s.started_at, s.finished_at, s.score, s.total
    FROM sessions s ORDER BY s.student_name ASC
  `).all();

  const answers = db.prepare(`
    SELECT * FROM answers ORDER BY session_id, experiment
  `).all();

  const answerMap = {};
  for (const a of answers) {
    if (!answerMap[a.session_id]) answerMap[a.session_id] = {};
    answerMap[a.session_id][a.experiment] = a;
  }

  const experiments = ['dorsal', 'ventral', 'nerf'];
  const expLabels = {
    dorsal: 'Racine Dorsale',
    ventral: 'Racine Ventrale',
    nerf: 'Nerf Rachidien'
  };

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Laboratoire Bell-Magendie';
  wb.created = new Date();

  // ── Sheet 1: Summary ───────────────────────────────────────────────────────
  const summary = wb.addWorksheet('Résumé');
  summary.columns = [
    { header: 'Étudiant', key: 'name', width: 25 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Score', key: 'score', width: 10 },
    { header: 'Terminé', key: 'finished', width: 12 },
    { header: 'Racine Dorsale', key: 'dorsal', width: 20 },
    { header: 'Tentatives Dorsale', key: 'dorsal_att', width: 20 },
    { header: 'Racine Ventrale', key: 'ventral', width: 20 },
    { header: 'Tentatives Ventrale', key: 'ventral_att', width: 22 },
    { header: 'Nerf Rachidien', key: 'nerf', width: 20 },
    { header: 'Tentatives Nerf', key: 'nerf_att', width: 18 },
  ];

  // Header style
  summary.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF1A252F' } }
    };
  });
  summary.getRow(1).height = 28;

  for (const s of sessions) {
    const sa = answerMap[s.id] || {};
    const isFinished = !!s.finished_at;
    const scoreStr = isFinished ? `${s.score}/${s.total}` : 'En cours';

    const row = summary.addRow({
      name: s.student_name,
      date: new Date(s.started_at).toLocaleString('fr-FR'),
      score: scoreStr,
      finished: isFinished ? 'Oui' : 'Non',
      dorsal: sa.dorsal ? (sa.dorsal.is_correct ? '✓ Correct' : '✗ Incorrect') : '—',
      dorsal_att: sa.dorsal ? sa.dorsal.attempts : '—',
      ventral: sa.ventral ? (sa.ventral.is_correct ? '✓ Correct' : '✗ Incorrect') : '—',
      ventral_att: sa.ventral ? sa.ventral.attempts : '—',
      nerf: sa.nerf ? (sa.nerf.is_correct ? '✓ Correct' : '✗ Incorrect') : '—',
      nerf_att: sa.nerf ? sa.nerf.attempts : '—',
    });

    // Zebra rows
    const bg = row.number % 2 === 0 ? 'FFF5F6FA' : 'FFFFFFFF';
    row.eachCell(cell => {
      cell.font = { name: 'Arial', size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    // Name left-aligned
    row.getCell('name').alignment = { vertical: 'middle', horizontal: 'left' };

    // Color correct/incorrect cells
    for (const exp of experiments) {
      const cellKey = exp;
      const cell = row.getCell(cellKey);
      if (sa[exp]) {
        if (sa[exp].is_correct) {
          cell.font = { name: 'Arial', size: 10, color: { argb: 'FF1E8449' }, bold: true };
        } else {
          cell.font = { name: 'Arial', size: 10, color: { argb: 'FFC0392B' }, bold: true };
        }
      }
    }
  }

  // ── Sheet 2: Detailed answers ──────────────────────────────────────────────
  const detail = wb.addWorksheet('Réponses Détaillées');
  detail.columns = [
    { header: 'Étudiant', key: 'name', width: 25 },
    { header: 'Expérience', key: 'exp', width: 20 },
    { header: 'Question', key: 'question', width: 55 },
    { header: 'Réponse donnée', key: 'answer', width: 45 },
    { header: 'Correct', key: 'correct', width: 12 },
    { header: 'Tentatives', key: 'attempts', width: 14 },
    { header: 'Heure', key: 'time', width: 20 },
  ];

  detail.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3A4A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  detail.getRow(1).height = 28;

  for (const a of answers) {
    const session = sessions.find(s => s.id === a.session_id);
    const row = detail.addRow({
      name: session ? session.student_name : '?',
      exp: expLabels[a.experiment] || a.experiment,
      question: a.question,
      answer: a.answer_given,
      correct: a.is_correct ? 'Oui' : 'Non',
      attempts: a.attempts,
      time: new Date(a.answered_at).toLocaleString('fr-FR'),
    });
    const bg = row.number % 2 === 0 ? 'FFF0F4F8' : 'FFFFFFFF';
    row.eachCell(cell => {
      cell.font = { name: 'Arial', size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });
    const correctCell = row.getCell('correct');
    correctCell.font = {
      name: 'Arial', size: 10, bold: true,
      color: { argb: a.is_correct ? 'FF1E8449' : 'FFC0392B' }
    };
    correctCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // ── Sheet 3: Class stats ───────────────────────────────────────────────────
  const stats = wb.addWorksheet('Statistiques Classe');
  stats.getColumn('A').width = 35;
  stats.getColumn('B').width = 20;

  const addStatRow = (label, value, bold = false) => {
    const row = stats.addRow([label, value]);
    row.getCell(1).font = { name: 'Arial', size: 11, bold };
    row.getCell(2).font = { name: 'Arial', size: 11, bold };
    row.getCell(2).alignment = { horizontal: 'center' };
  };

  const finished = sessions.filter(s => s.finished_at);
  const avgScore = finished.length
    ? (finished.reduce((s, r) => s + (r.total > 0 ? r.score / r.total : 0), 0) / finished.length * 100).toFixed(1)
    : 'N/A';

  stats.addRow(['Statistiques Classe — ' + new Date().toLocaleDateString('fr-FR')]);
  stats.getRow(1).font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF2C3E50' } };
  stats.getRow(1).height = 30;
  stats.addRow([]);

  addStatRow('Nombre d\'étudiants inscrits', sessions.length, true);
  addStatRow('Expériences terminées', finished.length, true);
  addStatRow('Score moyen de la classe', avgScore !== 'N/A' ? avgScore + '%' : 'N/A', true);
  stats.addRow([]);
  addStatRow('Résultats par expérience:', '', true);

  for (const exp of experiments) {
    const expAnswers = answers.filter(a => a.experiment === exp);
    const correct = expAnswers.filter(a => a.is_correct).length;
    const pct = expAnswers.length ? ((correct / expAnswers.length) * 100).toFixed(0) + '%' : 'N/A';
    addStatRow(`  ${expLabels[exp]}`, `${correct}/${expAnswers.length} (${pct})`);
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="resultats_magendie_${new Date().toISOString().slice(0,10)}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
});

// ─── START ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🔬 Laboratoire Bell-Magendie`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Teacher password: ${TEACHER_PASSWORD}`);
  console.log(`   Set TEACHER_PASSWORD env var to change it\n`);
});
