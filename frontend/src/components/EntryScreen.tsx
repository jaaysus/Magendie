import React, { useState } from 'react';

interface EntryScreenProps {
  onStart: (name: string) => Promise<void>;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    try {
      await onStart(name);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div id="entry-screen">
      <div className="entry-card">
        <span className="entry-icon">🔬</span>
        <h1>Laboratoire Bell-Magendie</h1>
        <p>Découvrez les fonctions de la moelle épinière à travers les expériences historiques de François Magendie.</p>
        <div className="entry-input-group">
          <label htmlFor="student-name-input">Votre prénom et nom</label>
          <input
            type="text"
            id="student-name-input"
            placeholder="Ex : Amina Bensalem"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className={error ? 'error' : ''}
          />
          {error && <div className="entry-error" style={{ display: 'block' }}>Veuillez saisir votre nom complet.</div>}
        </div>
        <button className="entry-btn" id="start-lab-btn" onClick={handleStart} disabled={loading}>
          {loading ? 'Connexion…' : "Commencer l'expérience →"}
        </button>
      </div>
    </div>
  );
};

export default EntryScreen;
