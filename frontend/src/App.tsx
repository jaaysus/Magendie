import { useState } from 'react';
import EntryScreen from './components/EntryScreen';
import TeacherModal from './components/TeacherModal';
import LabHeader from './components/LabHeader';
import Magendie from './components/Magendie';
import NotebookZone from './components/NotebookZone';
import './App.css';

interface QCMOption {
  text: string;
  correct: boolean;
}

interface QCMItem {
  question: string;
  options: QCMOption[];
  explication: string;
}

const qcmData: Record<string, QCMItem> = {
  dorsal: {
    question: "Suite à la section de la racine dorsale, la grenouille ne ressent aucune excitation. Que concluez-vous sur le rôle de cette racine ?",
    options: [
      { text: "La racine dorsale est uniquement motrice.", correct: false },
      { text: "La racine dorsale est uniquement sensitive.", correct: true },
      { text: "La racine dorsale est mixte.", correct: false }
    ],
    explication: "Exact ! Le message sensitif venant de la peau est bloqué. La racine dorsale est donc sensitive."
  },
  ventral: {
    question: "La grenouille ressent l'excitation (le message sensitif arrive) mais elle est paralysée. Conclusion sur la racine ventrale ?",
    options: [
      { text: "La racine ventrale est sensitive.", correct: false },
      { text: "La racine ventrale est motrice.", correct: true },
      { text: "La racine ventrale ne sert à rien.", correct: false }
    ],
    explication: "Parfait ! Le message moteur n'atteint plus le muscle. La racine ventrale est donc motrice."
  },
  nerf: {
    question: "La section du nerf rachidien bloque tout : la grenouille ne ressent rien et est paralysée. Conclusion ?",
    options: [
      { text: "Le nerf rachidien est mixte (sensitif + moteur).", correct: true },
      { text: "Le nerf rachidien est uniquement sensitif.", correct: false },
      { text: "Le nerf rachidien est uniquement moteur.", correct: false }
    ],
    explication: "Excellent ! Les deux trajets passent par ce nerf. Il est donc mixte."
  }
};

function App() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [tool, setTool] = useState<'none' | 'scalpel' | 'electrode'>('none');
  const [completedExperiments, setCompletedExperiments] = useState<Set<string>>(new Set());
  const [currentCut, setCurrentCut] = useState<string | null>(null);
  const [observation, setObservation] = useState<string | null>(null);
  const [qcm, setQcm] = useState<QCMItem | null>(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<string | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({ dorsal: 0, ventral: 0, nerf: 0 });
  const [lockInteraction, setLockInteraction] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState('magendie');

  const showAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const setSavingStatusMsg = (msg: string) => {
    setSavingStatus(msg);
    setTimeout(() => setSavingStatus(null), 3000);
  };

  const startLab = async (name: string) => {
    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setSessionId(data.sessionId);
      setStudentName(name);
    } catch (err) {
      showAlert('Erreur de connexion. Vérifiez le serveur.');
      throw err;
    }
  };

  const handleInteract = (zone: string) => {
    if (tool === 'none') {
      showAlert("Sélectionnez d'abord le Scalpel ou l'Électrode.");
      return;
    }
    if (lockInteraction) return;

    if (tool === 'scalpel') {
      setCurrentCut(zone);
      setTool('electrode');
      setAnimationTrigger(prev => prev + 1);
      setLockInteraction(true);
      setTimeout(() => {
        const obsMap: Record<string, string> = {
          dorsal: "La grenouille ne ressent aucune excitation au niveau de la peau — elle ne réagit pas.",
          ventral: "La grenouille ressent l'excitation de la peau, mais ne peut pas bouger la patte (paralysie).",
          nerf: "La grenouille ne ressent rien et ne peut effectuer aucun mouvement."
        };
        setObservation(obsMap[zone]);
        setQcm(qcmData[zone]);
      }, 3200);
    } else {
      // Stimulation
      const sensoryBlocked = currentCut === 'dorsal' || currentCut === 'nerf';
      const motorBlocked = currentCut === 'ventral' || currentCut === 'nerf';
      let obs = '';

      if (zone === 'nerf') {
        obs = "Stimulation globale. ";
        obs += sensoryBlocked ? "La grenouille ne ressent rien. " : "La grenouille ressent l'excitation. ";
        obs += motorBlocked ? "Elle est complètement paralysée." : "Le message moteur atteint le muscle.";
      } else if (zone === 'dorsal') {
        obs = "L'influx sensitif part de la peau. " + (sensoryBlocked
          ? "Il est bloqué par la lésion. La grenouille ne ressent aucune excitation."
          : "Il pénètre dans la substance grise.");
      } else if (zone === 'ventral') {
        obs = "L'influx moteur part de la substance grise. " + (motorBlocked
          ? "Il est bloqué par la lésion. La grenouille ressent l'excitation mais ne peut pas bouger (paralysie)."
          : "Il provoque la contraction du muscle.");
      }
      setObservation(obs);
      setAnimationTrigger(prev => prev + 1);
    }
  };

  const saveAnswer = async (experiment: string, question: string, answerGiven: string, isCorrect: boolean, attempts: number) => {
    if (!sessionId) return;
    setSavingStatusMsg('Enregistrement…');
    try {
      await fetch('/api/session/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, experiment, question, answerGiven, isCorrect, attempts })
      });
      setSavingStatusMsg('✓ Sauvegardé');
    } catch {
      setSavingStatusMsg('⚠ Non sauvegardé');
    }
  };

  const finishSession = async () => {
    if (!sessionId) return;
    try {
      await fetch('/api/session/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      setSavingStatusMsg('✓ Résultats enregistrés');
    } catch {
      setSavingStatusMsg('⚠ Impossible d\'enregistrer');
    }
  };

  const handleValidateQCM = async (opt: QCMOption) => {
    const zone = currentCut!;
    const newAttempts = attemptCounts[zone] + 1;
    setAttemptCounts({ ...attemptCounts, [zone]: newAttempts });

    // In a real app we'd show feedback before moving on
    // For now let's just save and move on like the original
    await saveAnswer(zone, qcmData[zone].question, opt.text, opt.correct, newAttempts);

    const newCompleted = new Set(completedExperiments);
    newCompleted.add(zone);
    setCompletedExperiments(newCompleted);

    if (newCompleted.size === 3) {
      setTimeout(() => {
        setQcm(null);
        setObservation(null);
        setFinalScore(`Score final : ${newCompleted.size} / 3`);
        finishSession();
      }, 2500);
    } else {
      setTimeout(() => {
        setQcm(null);
        setCurrentCut(null);
        setTool('scalpel');
        setLockInteraction(false);
      }, 3000);
    }
  };

  return (
    <>
      <LabHeader studentName={studentName} onOpenTeacher={() => setIsTeacherModalOpen(true)} currentExperiment={currentExperiment} onSelectExperiment={setCurrentExperiment} />
      {!studentName ? (
        <EntryScreen onStart={startLab} />
      ) : (
        <div id="app-container">
          {currentExperiment === 'magendie' ? (
            <Magendie
              tool={tool}
              onSelectTool={setTool}
              completedExperiments={completedExperiments}
              onInteract={handleInteract}
              currentCut={currentCut}
              alertMsg={alertMsg}
              animationTrigger={animationTrigger}
            />
          ) : (
            <div style={{ padding: '20px', border: '2px dashed #ccc', margin: '20px', textAlign: 'center' }}>
              <h2>Expérience : {currentExperiment}</h2>
              <p>Placeholder for {currentExperiment}</p>
            </div>
          )}
          <NotebookZone
            tool={tool}
            observation={observation}
            qcm={qcm}
            onValidateQCM={handleValidateQCM}
            completedExperiments={completedExperiments}
            savingStatus={savingStatus}
            finalScore={finalScore}
            currentExperiment={currentExperiment}
          />
        </div>
      )}
      <TeacherModal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} />
    </>
  );
}

export default App;
