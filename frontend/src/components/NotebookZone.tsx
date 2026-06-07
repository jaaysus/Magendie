import React from 'react';

interface QCMOption {
  text: string;
  correct: boolean;
}

interface QCMData {
  question: string;
  options: QCMOption[];
  explication: string;
}

interface NotebookZoneProps {
  tool: 'none' | 'scalpel' | 'electrode';
  observation: string | null;
  qcm: QCMData | null;
  onValidateQCM: (option: QCMOption) => void;
  completedExperiments: Set<string>;
  savingStatus: string | null;
  finalScore: string | null;
}

const NotebookZone: React.FC<NotebookZoneProps> = ({
  tool,
  observation,
  qcm,
  onValidateQCM,
  completedExperiments,
  savingStatus,
  finalScore
}) => {
  return (
    <div id="notebook-zone">
      <div className="notebook-header">📝 Carnet Scientifique</div>
      <div className="notebook-content">
        <div className="status-box">
          <h3 id="current-task-title">Protocole Expérimental</h3>
          <p id="current-task-desc">
            {tool === 'scalpel' ? (
              <>Mode <strong style={{ color: '#e74c3c' }}>Scalpel</strong> : Cliquez sur les zones ✂️ pour sectionner.</>
            ) : tool === 'electrode' ? (
              <>Mode <strong style={{ color: '#00a8ff' }}>Électrode</strong> : Cliquez sur une structure pour stimuler.</>
            ) : (
              <>Sélectionnez le <strong>Scalpel 🗡️</strong> pour sectionner une structure, puis observez l'effet sur la grenouille.</>
            )}
          </p>
        </div>

        {observation && (
          <div id="observation-box" className="status-box" style={{ display: 'block', borderColor: '#2c3e50', background: '#f8f9fa' }}>
            <h3>👁️ Observation de la grenouille</h3>
            <p id="observation-text" style={{ fontWeight: 500, color: '#2c3e50', lineHeight: 1.6 }}>{observation}</p>
          </div>
        )}

        {qcm && (
          <div id="qcm-section" style={{ display: 'block' }}>
            <div className="qcm-question">{qcm.question}</div>
            <div className="qcm-options">
              {qcm.options.map((opt, i) => (
                <div key={i} className="qcm-option" onClick={() => onValidateQCM(opt)}>
                  {opt.text}
                </div>
              ))}
            </div>
            <div id="qcm-feedback"></div>
          </div>
        )}

        {completedExperiments.size === 3 && (
          <div id="bilan-section" style={{ display: 'block' }}>
            <h3>🏆 Loi de Bell-Magendie Reconstituée</h3>
            <ul>
              <li><strong>Racine dorsale</strong> (avec ganglion) → message <strong>sensitif</strong> (peau → substance grise).</li>
              <li><strong>Racine ventrale</strong> → message <strong>moteur</strong> (substance grise → muscle).</li>
              <li><strong>Nerf rachidien</strong> → nerf <strong>mixte</strong> (sensitif + moteur).</li>
            </ul>
            {finalScore && (
              <div id="final-score" style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '8px', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary)' }}>
                {finalScore}
              </div>
            )}
            <button className="tool-btn" style={{ marginTop: '14px', width: '100%', justifyContent: 'center', background: 'var(--primary)', color: 'white' }} onClick={() => window.location.reload()}>
              🔄 Recommencer
            </button>
          </div>
        )}

        <div id="saving-indicator">{savingStatus}</div>
      </div>
    </div>
  );
};

export default NotebookZone;
