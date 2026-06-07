import React from 'react';

interface LabHeaderProps {
  studentName: string | null;
  onOpenTeacher: () => void;
}

const LabHeader: React.FC<LabHeaderProps> = ({ studentName, onOpenTeacher }) => {
  return (
    <header>
      <div style={{ width: '120px' }}></div>
      <h1>🔬 Laboratoire Virtuel : Expériences de Magendie</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: 'auto' }}>
        {studentName && <span id="student-badge">👤 {studentName}</span>}
        <button id="teacher-access-btn" onClick={onOpenTeacher}>👩‍🏫 Enseignant</button>
      </div>
    </header>
  );
};

export default LabHeader;
