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

const validateTeacher = (req) => {
  const password = req.headers['x-teacher-password'] || req.body.password;
  return password === TEACHER_PASSWORD;
};

app.post('/api/teacher/login', (req, res) => {
  if (validateTeacher(req)) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' });
  }
});

app.get('/api/teacher/stats', (req, res) => {
  if (!validateTeacher(req)) return res.status(401).json({ error: 'Non autorisé' });

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

app.post('/api/teacher/clear-db', (req, res) => {
  if (!validateTeacher(req)) return res.status(401).json({ error: 'Non autorisé' });

  db.exec('DELETE FROM answers; DELETE FROM sessions;');
  res.json({ ok: true });
});

app.get('/api/teacher/export', async (req, res) => {
  if (!validateTeacher(req)) return res.status(401).json({ error: 'Non autorisé' });

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
  const motriciteExps = [1, 2, 3, 4, 5, 6].map(i => `motricite_${i}`);
  
  const expLabels = {
    dorsal: 'Magendie - Racine Dorsale',
    ventral: 'Magendie - Racine Ventrale',
    nerf: 'Magendie - Nerf Rachidien',
    motricite_1: 'Motricité - Exp 1',
    motricite_2: 'Motricité - Exp 2',
    motricite_3: 'Motricité - Exp 3',
    motricite_4: 'Motricité - Exp 4',
    motricite_5: 'Motricité - Exp 5',
    motricite_6: 'Motricité - Exp 6',
    motricite_final: 'Motricité - Évaluation'
  };

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Laboratoire Virtuel';
  wb.created = new Date();

  // ── Sheet 1: Summary ───────────────────────────────────────────────────────
  const summary = wb.addWorksheet('Résumé Global');
  summary.columns = [
    { header: 'Étudiant', key: 'name', width: 25 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Magendie Score', key: 'magendie_score', width: 15 },
    { header: 'Motricité (sur 6)', key: 'motricite_progress', width: 18 },
    { header: 'Motricité Quiz', key: 'motricite_quiz', width: 15 },
    { header: 'Terminé', key: 'finished', width: 12 },
  ];

  // Header style
  summary.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  for (const s of sessions) {
    const sa = answerMap[s.id] || {};
    
    // Magendie stats
    const magendieCount = ['dorsal', 'ventral', 'nerf'].filter(e => sa[e] && sa[e].is_correct).length;
    
    // Motricité stats
    const motriciteCount = [1, 2, 3, 4, 5, 6].filter(i => sa[`motricite_${i}`] && sa[`motricite_${i}`].is_correct).length;
    const motriciteQuiz = sa['motricite_final'] ? sa['motricite_final'].answer_given : '—';

    summary.addRow({
      name: s.student_name,
      date: new Date(s.started_at).toLocaleString('fr-FR'),
      magendie_score: `${magendieCount}/3`,
      motricite_progress: `${motriciteCount}/6`,
      motricite_quiz: motriciteQuiz,
      finished: s.finished_at ? 'Oui' : 'Non',
    });
  }

  // ── Sheet 2: Magendie Details ──────────────────────────────────────────────
  const magendieSheet = wb.addWorksheet('Détails Magendie');
  magendieSheet.columns = [
    { header: 'Étudiant', key: 'name', width: 25 },
    { header: 'Expérience', key: 'exp', width: 20 },
    { header: 'Question', key: 'question', width: 55 },
    { header: 'Réponse donnée', key: 'answer', width: 45 },
    { header: 'Correct', key: 'correct', width: 12 },
    { header: 'Tentatives', key: 'attempts', width: 14 },
  ];
  
  magendieSheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3A4A' } };
  });

  // ── Sheet 3: Motricité Details ─────────────────────────────────────────────
  const motriciteSheet = wb.addWorksheet('Détails Motricité');
  motriciteSheet.columns = [
    { header: 'Étudiant', key: 'name', width: 25 },
    { header: 'Expérience', key: 'exp', width: 20 },
    { header: 'Question', key: 'question', width: 55 },
    { header: 'Réponse donnée', key: 'answer', width: 45 },
    { header: 'Correct', key: 'correct', width: 12 },
    { header: 'Heure', key: 'time', width: 20 },
  ];
  
  motriciteSheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F9B72' } };
  });

  for (const a of answers) {
    const session = sessions.find(s => s.id === a.session_id);
    const rowData = {
      name: session ? session.student_name : '?',
      exp: expLabels[a.experiment] || a.experiment,
      question: a.question,
      answer: a.answer_given,
      correct: a.is_correct ? 'Oui' : 'Non',
      attempts: a.attempts,
      time: new Date(a.answered_at).toLocaleString('fr-FR'),
    };

    if (a.experiment.startsWith('motricite')) {
      motriciteSheet.addRow(rowData);
    } else if (['dorsal', 'ventral', 'nerf'].includes(a.experiment)) {
      magendieSheet.addRow(rowData);
    }
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
  addStatRow('Résultats par expérience (Magendie):', '', true);
  for (const exp of experiments) {
    const expAnswers = answers.filter(a => a.experiment === exp);
    const correct = expAnswers.filter(a => a.is_correct).length;
    const pct = expAnswers.length ? ((correct / expAnswers.length) * 100).toFixed(0) + '%' : 'N/A';
    addStatRow(`  ${expLabels[exp]}`, `${correct}/${expAnswers.length} (${pct})`);
  }

  stats.addRow([]);
  addStatRow('Résultats par expérience (Motricité):', '', true);
  for (const exp of motriciteExps) {
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
