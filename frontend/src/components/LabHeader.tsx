import React from 'react';

interface LabHeaderProps {
  studentName: string | null;
  onOpenTeacher: () => void;
  currentExperiment: string;
  onSelectExperiment: (exp: string) => void;
  onLogout: () => void;
}

const LabHeader: React.FC<LabHeaderProps> = ({ studentName, onOpenTeacher, currentExperiment, onSelectExperiment, onLogout }) => {
  const isStudentLoggedIn = Boolean(studentName);
  const navItems = [
    { id: 'magendie', label: 'Magendie Law' },
    { id: 'motricite', label: 'La Motricité Involontaire' },
    { id: 'placeholder1', label: 'Placeholder 1' },
    { id: 'placeholder2', label: 'Placeholder 2' }
  ];

  return (
    <header>
      <div className="header-left">
        {studentName && (
          <button 
            className="nav-btn btn-logout" 
            onClick={onLogout}
          >
            🚪 Quitter
          </button>
        )}
      </div>

      <div className="header-center">
        <h1>🔬 Virtual Lab</h1>
        {studentName && (
          <nav className="header-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectExperiment(item.id)}
                className={`nav-btn ${currentExperiment === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="header-right">
        {studentName && <span className="student-badge-style">👤 {studentName}</span>}

        {!isStudentLoggedIn && (
          <button className="nav-btn" onClick={onOpenTeacher}>
            👩‍🏫 Enseignant
          </button>
        )}
      </div>
    </header>
  );
};

export default LabHeader;