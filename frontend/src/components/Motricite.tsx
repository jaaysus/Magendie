import React from "react";

interface MotriciteProps {
  sessionId?: number | null;
}

  const Motricite: React.FC<MotriciteProps> = ({ sessionId }) => {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <iframe
        src={`/motricite/index.html${sessionId ? `?sessionId=${sessionId}` : ''}`}
        title="Motricite Lab"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      />
    </div>
  );
};

export default Motricite;