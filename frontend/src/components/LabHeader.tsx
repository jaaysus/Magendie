import React from 'react';

interface LabHeaderProps {
  studentName: string | null;
  onOpenTeacher: () => void;
  currentExperiment: string;
  onSelectExperiment: (exp: string) => void;
}

const LabHeader: React.FC<LabHeaderProps> = ({ studentName, onOpenTeacher, currentExperiment, onSelectExperiment }) => {
  const isStudentLoggedIn = Boolean(studentName);
  const navItems = [
    { id: 'magendie', label: 'Magendie Law' },
    { id: 'motricite', label: 'La Motricité Involontaire' },
    { id: 'placeholder1', label: 'Placeholder 1' },
    { id: 'placeholder2', label: 'Placeholder 2' }
  ];

  return (
    <header>
      <div style={{ width: '120px' }}></div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h1>🔬 Virtual Lab</h1>
        {studentName && (
          <nav style={{ display: 'flex', gap: '10px' }}>
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

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: 'auto' }}>
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