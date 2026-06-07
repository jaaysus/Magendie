import React, { useRef, useEffect } from 'react';

interface LabZoneProps {
  tool: 'none' | 'scalpel' | 'electrode';
  onSelectTool: (tool: 'scalpel' | 'electrode') => void;
  completedExperiments: Set<string>;
  onInteract: (zone: string) => void;
  currentCut: string | null;
  alertMsg: string | null;
  animationTrigger: number;
}

const LabZone: React.FC<LabZoneProps> = ({
  tool,
  onSelectTool,
  completedExperiments,
  onInteract,
  currentCut,
  alertMsg,
  animationTrigger
}) => {
  const dotSensoryRef = useRef<SVGCircleElement>(null);
  const dotMotorRef = useRef<SVGCircleElement>(null);
  const textPathSensoryRef = useRef<SVGTextPathElement>(null);
  const textPathMotorRef = useRef<SVGTextPathElement>(null);
  const groupSensoryRef = useRef<SVGGElement>(null);
  const groupMotorRef = useRef<SVGGElement>(null);
  const muscleGroupRef = useRef<SVGGElement>(null);
  const flashSkinRef = useRef<SVGCircleElement>(null);
  const flashGrayRef = useRef<SVGCircleElement>(null);

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (animationTrigger === 0) return;

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    const motorBlocked = currentCut === 'ventral' || currentCut === 'nerf';

    const idSensory = currentCut === 'nerf' ? 'path-sensory-cut-nerf'
      : currentCut === 'dorsal' ? 'path-sensory-cut-dorsal'
      : 'path-sensory-full';
    const idMotor = currentCut === 'nerf' ? 'path-motor-cut-nerf'
      : currentCut === 'ventral' ? 'path-motor-cut-ventral'
      : 'path-motor-full';

    const txtSensoryId = currentCut === 'nerf' ? 'path-sensory-text-cut-nerf'
      : currentCut === 'dorsal' ? 'path-sensory-text-cut-dorsal'
      : 'path-sensory-text-flow';

    textPathSensoryRef.current?.setAttribute('href', '#' + txtSensoryId);
    textPathMotorRef.current?.setAttribute('href', '#' + idMotor);

    const pathSensory = document.getElementById(idSensory) as unknown as SVGPathElement;
    const pathMotor = document.getElementById(idMotor) as unknown as SVGPathElement;

    if (!pathSensory || !pathMotor) return;

    groupSensoryRef.current?.setAttribute('visibility', 'visible');
    groupMotorRef.current?.setAttribute('visibility', 'visible');

    // Flash effects
    flashSkinRef.current?.classList.remove('active');
    flashSkinRef.current?.getBoundingClientRect();
    flashSkinRef.current?.classList.add('active');

    setTimeout(() => {
      flashGrayRef.current?.classList.remove('active');
      flashGrayRef.current?.getBoundingClientRect();
      flashGrayRef.current?.classList.add('active');
    }, 200);

    const duration = 3000;
    const startTime = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      
      const lenS = pathSensory.getTotalLength();
      const ptS = pathSensory.getPointAtLength(progress * lenS);
      dotSensoryRef.current?.setAttribute('cx', ptS.x.toString());
      dotSensoryRef.current?.setAttribute('cy', ptS.y.toString());
      textPathSensoryRef.current?.setAttribute('startOffset', `${(1 - progress) * 100}%`);

      const lenM = pathMotor.getTotalLength();
      const ptM = pathMotor.getPointAtLength(progress * lenM);
      dotMotorRef.current?.setAttribute('cx', ptM.x.toString());
      dotMotorRef.current?.setAttribute('cy', ptM.y.toString());
      textPathMotorRef.current?.setAttribute('startOffset', `${progress * 100 - 30}%`);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        groupSensoryRef.current?.setAttribute('visibility', 'hidden');
        groupMotorRef.current?.setAttribute('visibility', 'hidden');
      }
    }
    animationFrameId.current = requestAnimationFrame(animate);

    // Muscle contraction
    if (!motorBlocked) {
      setTimeout(() => {
        muscleGroupRef.current?.classList.remove('muscle-contract');
        muscleGroupRef.current?.getBoundingClientRect();
        muscleGroupRef.current?.classList.add('muscle-contract');
      }, 2900);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [animationTrigger, currentCut]);

  return (
    <div id="lab-zone">
      {alertMsg && <div id="inline-alert" style={{ display: 'block' }}>{alertMsg}</div>}
      
      <div id="tools-panel">
        <button
          className={`tool-btn ${tool === 'scalpel' ? 'active' : ''}`}
          id="tool-scalpel"
          onClick={() => onSelectTool('scalpel')}
          disabled={completedExperiments.size === 3}
        >
          🗡️ Scalpel
        </button>
        <button
          className={`tool-btn ${tool === 'electrode' ? 'active' : ''}`}
          id="tool-electrode"
          onClick={() => onSelectTool('electrode')}
          disabled={completedExperiments.size === 3}
        >
          ⚡ Électrode
        </button>
      </div>

      <div id="progress-bar-wrap">
        <span>Expériences :</span>
        <div className="progress-steps">
          {['dorsal', 'ventral', 'nerf'].map((exp, i) => (
            <div
              key={exp}
              className={`progress-step ${completedExperiments.has(exp) ? 'done' : (completedExperiments.size === i ? 'active' : '')}`}
              title={exp === 'dorsal' ? 'Racine Dorsale' : exp === 'ventral' ? 'Racine Ventrale' : 'Nerf Rachidien'}
            ></div>
          ))}
        </div>
        <span id="progress-label">{completedExperiments.size} / 3 terminées</span>
      </div>

      <div id="anatomy-container">
        <svg viewBox="0 0 850 550" id="spinal-cord-svg">
          <defs>
            <radialGradient id="white-matter" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dcdde1" />
            </radialGradient>
            <filter id="glow-sensory" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-motor" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <path id="path-sensory-full" d="M 750 150 L 600 250 L 500 250 C 400 150, 280 100, 200 180" fill="none" />
            <path id="path-sensory-text-flow" d="M 200 180 C 280 100, 400 150, 500 250 L 600 250 L 750 150" fill="none" />
            <path id="path-sensory-cut-dorsal" d="M 750 150 L 600 250 L 500 250 C 400 150, 360 120, 330 125" fill="none" />
            <path id="path-sensory-text-cut-dorsal" d="M 330 125 C 360 120, 400 150, 500 250 L 600 250 L 750 150" fill="none" />
            <path id="path-sensory-cut-nerf" d="M 750 150 L 600 250 L 550 250" fill="none" />
            <path id="path-sensory-text-cut-nerf" d="M 550 250 L 600 250 L 750 150" fill="none" />
            <path id="path-motor-full" d="M 200 320 C 280 400, 400 350, 500 250 L 600 250 L 750 350" fill="none" />
            <path id="path-motor-cut-ventral" d="M 200 320 C 260 380, 290 380, 330 365" fill="none" />
            <path id="path-motor-cut-nerf" d="M 200 320 C 280 400, 400 350, 500 250 L 550 250" fill="none" />
          </defs>

          <g id="labels">
            <rect x="375" y="15" width="110" height="25" fill="rgba(255,255,255,0.9)" rx="4" stroke="#7f8fa6" strokeWidth="1" />
            <text x="430" y="32" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">Racine Dorsale</text>
            <line x1="430" y1="40" x2="430" y2="85" stroke="#7f8fa6" strokeWidth="1" strokeDasharray="3,3" />
            <rect x="325" y="495" width="110" height="25" fill="rgba(255,255,255,0.9)" rx="4" stroke="#7f8fa6" strokeWidth="1" />
            <text x="380" y="512" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">Racine Ventrale</text>
            <line x1="380" y1="495" x2="380" y2="440" stroke="#7f8fa6" strokeWidth="1" strokeDasharray="3,3" />
            <rect x="520" y="325" width="110" height="25" fill="rgba(255,255,255,0.9)" rx="4" stroke="#7f8fa6" strokeWidth="1" />
            <text x="575" y="342" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">Nerf Rachidien</text>
            <line x1="575" y1="325" x2="575" y2="275" stroke="#7f8fa6" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          <g id="periphery">
            <rect x="730" y="100" width="90" height="100" fill="#ffeaa7" stroke="#fdcb6e" strokeWidth="3" rx="10" />
            <text x="775" y="155" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#d35400">PEAU</text>
            <text x="775" y="175" textAnchor="middle" fontSize="12" fill="#d35400">(Récepteur)</text>

            <g id="muscle-group" ref={muscleGroupRef}>
              <rect id="muscle-fill" x="730" y="300" width="90" height="100" fill="#fab1a0" rx="10" />
              <rect x="730" y="300" width="90" height="100" fill="transparent" stroke="#e17055" strokeWidth="3" rx="10" />
              <text x="775" y="355" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#c0392b">MUSCLE</text>
              <text x="775" y="375" textAnchor="middle" fontSize="12" fill="#c0392b">(Effecteur)</text>
            </g>
          </g>

          <g id="spinal-cord">
            <ellipse cx="200" cy="250" rx="130" ry="160" fill="url(#white-matter)" stroke="#7f8fa6" strokeWidth="5" />
            <line x1="200" y1="90" x2="200" y2="140" stroke="#7f8fa6" strokeWidth="4" />
            <line x1="200" y1="410" x2="200" y2="360" stroke="#7f8fa6" strokeWidth="7" />
            <path d="M 175 140 C 150 180, 150 220, 175 250 C 140 280, 140 320, 165 360 C 190 350, 200 300, 200 270 C 200 300, 210 350, 235 360 C 260 320, 260 280, 225 250 C 250 220, 250 180, 225 140 C 210 160, 200 210, 200 230 C 200 210, 190 160, 175 140 Z" fill="#353b48" stroke="#2f3640" strokeWidth="2" />
            <text x="110" y="255" textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="bold" transform="rotate(-90 110 255)">Substance Grise</text>
          </g>

          <use href="#path-sensory-full" className="nerve-fiber sensory-fiber" />
          <use href="#path-motor-full" className="nerve-fiber motor-fiber" />

          <ellipse cx="380" cy="140" rx="25" ry="18" fill="#f5cd79" stroke="#e1b12c" strokeWidth="3" />
          <text x="380" y="144" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2c3e50">Ganglion</text>

          <g id="lesion-dorsal" style={{ display: currentCut === 'dorsal' ? 'block' : 'none' }}>
            <line x1="320" y1="105" x2="340" y2="145" className="lesion-bg" style={{ display: 'block' }} />
            <line x1="320" y1="105" x2="340" y2="145" className="lesion" style={{ display: 'block' }} />
          </g>
          <g id="lesion-ventral" style={{ display: currentCut === 'ventral' ? 'block' : 'none' }}>
            <line x1="320" y1="345" x2="340" y2="385" className="lesion-bg" style={{ display: 'block' }} />
            <line x1="320" y1="345" x2="340" y2="385" className="lesion" style={{ display: 'block' }} />
          </g>
          <g id="lesion-nerf" style={{ display: currentCut === 'nerf' ? 'block' : 'none' }}>
            <line x1="540" y1="230" x2="560" y2="270" className="lesion-bg" style={{ display: 'block' }} />
            <line x1="540" y1="230" x2="560" y2="270" className="lesion" style={{ display: 'block' }} />
          </g>

          <circle cx="750" cy="150" r="20" className="flash" id="flash-skin" ref={flashSkinRef} />
          <circle cx="200" cy="320" r="20" className="flash" id="flash-graymatter" ref={flashGrayRef} />

          <g id="group-sensory" visibility="hidden" ref={groupSensoryRef}>
            <circle id="dot-sensory" r="8" fill="#00ffff" filter="url(#glow-sensory)" ref={dotSensoryRef} />
            <text className="moving-text sensory-text" dy="-12">
              <textPath id="text-path-sensory" href="#path-sensory-text-flow" startOffset="100%" ref={textPathSensoryRef}>
                ← Message nerveux sensitif
              </textPath>
            </text>
          </g>
          <g id="group-motor" visibility="hidden" ref={groupMotorRef}>
            <circle id="dot-motor" r="8" fill="#ff4757" filter="url(#glow-motor)" ref={dotMotorRef} />
            <text className="moving-text motor-text" dy="-12">
              <textPath id="text-path-motor" href="#path-motor-full" startOffset="0%" ref={textPathMotorRef}>
                Message nerveux moteur →
              </textPath>
            </text>
          </g>

          <path d="M 280 120 C 320 100, 350 110, 450 180" className="interactive-zone" onClick={() => onInteract('dorsal')} />
          <path d="M 280 380 C 320 400, 350 390, 450 320" className="interactive-zone" onClick={() => onInteract('ventral')} />
          <line x1="500" y1="250" x2="650" y2="250" className="interactive-zone" onClick={() => onInteract('nerf')} />

          <g className="cut-target-group" style={{ display: tool === 'scalpel' ? 'block' : 'none' }}>
            <line x1="330" y1="100" x2="330" y2="150" className="cut-line" />
            <text x="315" y="90" className="scissors-icon">✂️</text>
          </g>
          <g className="cut-target-group" style={{ display: tool === 'scalpel' ? 'block' : 'none' }}>
            <line x1="330" y1="340" x2="330" y2="390" className="cut-line" />
            <text x="315" y="415" className="scissors-icon">✂️</text>
          </g>
          <g className="cut-target-group" style={{ display: tool === 'scalpel' ? 'block' : 'none' }}>
            <line x1="550" y1="220" x2="550" y2="280" className="cut-line" />
            <text x="535" y="210" className="scissors-icon">✂️</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LabZone;
