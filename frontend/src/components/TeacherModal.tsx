import React, { useState } from 'react';

interface Session {
  id: number;
  student_name: string;
  started_at: string;
  finished_at: string | null;
  score: number;
  total: number;
}

interface Answer {
  id: number;
  session_id: number;
  experiment: string;
  question: string;
  answer_given: string;
  is_correct: number;
  attempts: number;
  answered_at: string;
  student_name: string;
}

interface Stats {
  sessions: Session[];
  answers: Answer[];
}

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const handleLogin = async () => {
    setError(false);
    try {
      const res = await fetch('/api/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        setError(true);
        return;
      }

      setIsLoggedIn(true);
      // Load stats
      const statsRes = await fetch(`/api/teacher/stats?password=${encodeURIComponent(password)}`);
      const data = await statsRes.json();
      setStats(data);
    } catch {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="teacher-modal" className="open">
      <div className="teacher-card">
        <h2>👩‍🏫 Espace Enseignant</h2>
        <p>Accédez aux résultats et téléchargez le tableau de bord de classe.</p>
        {error && <div id="teacher-error" style={{ display: 'block' }}>Mot de passe incorrect.</div>}
        
        {!isLoggedIn ? (
          <>
            <input
              type="password"
              placeholder="Mot de passe enseignant"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <div className="teacher-btns">
              <button className="btn-secondary" onClick={onClose}>Annuler</button>
              <button className="btn-primary" onClick={handleLogin}>Connexion</button>
            </div>
          </>
        ) : (
          <div id="teacher-panel" style={{ display: 'block', marginTop: '24px' }}>
            <a
              id="download-excel-btn"
              href={`/api/teacher/export?password=${encodeURIComponent(password)}`}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px',
                background: 'var(--success)',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1rem'
              }}
            >
              📥 Télécharger les résultats Excel
            </a>
            {stats && (
              <div id="teacher-stats" style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                <strong>{stats.sessions.length}</strong> étudiant(s) inscrit(s) · <strong>{stats.sessions.filter(s => s.finished_at).length}</strong> expérience(s) terminée(s)
              </div>
            )}
            <button className="btn-secondary" style={{ marginTop: '16px', width: '100%' }} onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherModal;
