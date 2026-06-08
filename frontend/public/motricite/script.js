
    const experiments = [
      {
        id: 1,
        title: "Anesthésie de la peau puis stimulation par l'acide",
        situation: "On anesthésie la peau de la patte gauche d'une grenouille spinale, puis on applique de l'acide acétique.",
        hypothesis: "Si la peau est le récepteur sensitif, alors son anesthésie doit empêcher le déclenchement du réflexe.",
        actions: ["Anesthésier la peau", "Appliquer l'acide acétique"],
        observation: "Aucune réaction : la patte gauche ne bouge pas et aucun trajet nerveux complet n'est déclenché.",
        question: "Pourquoi n'observe-t-on aucun mouvement ?",
        options: [
          "Le muscle est détruit",
          "La peau ne peut plus jouer son rôle de récepteur sensitif",
          "La moelle épinière est détruite"
        ],
        correct: 1,
        conclusion: "La peau joue le rôle de récepteur sensitif indispensable au réflexe médullaire.",
        animation: "noReaction"
      },
      {
        id: 2,
        title: "Section du nerf sciatique gauche puis excitation des deux pattes",
        situation: "On coupe le nerf sciatique gauche, puis on applique l'acide acétique sur les deux pattes arrière.",
        hypothesis: "Si le nerf sciatique conduit l'influx nerveux, alors la patte gauche ne doit plus répondre après sa section.",
        actions: ["Couper le nerf sciatique gauche", "Appliquer l'acide sur les deux pattes"],
        observation: "Flexion de la patte droite uniquement : la patte gauche ne fléchit pas.",
        question: "Que montre cette expérience ?",
        options: [
          "Le nerf sciatique est un conducteur de l'influx nerveux",
          "Le muscle produit l'influx nerveux",
          "La peau est un effecteur"
        ],
        correct: 0,
        conclusion: "Le nerf sciatique conduit l'influx nerveux.",
        animation: "rightOnly"
      },
      {
        id: 3,
        title: "Stimulation du bout périphérique du nerf sciatique gauche",
        situation: "Après section du nerf sciatique gauche, on stimule le bout périphérique, c'est-à-dire le bout relié au muscle.",
        hypothesis: "Si le bout périphérique conduit vers le muscle, alors il doit provoquer la contraction du muscle et la flexion de la patte gauche.",
        actions: ["Couper le nerf sciatique gauche", "Stimuler le bout périphérique"],
        observation: "Flexion de la patte gauche : l'influx va vers le muscle, le muscle se contracte et la patte fléchit.",
        question: "Que démontre cette expérience ?",
        options: [
          "Le nerf est moteur",
          "Le nerf est uniquement sensitif",
          "Le muscle est un récepteur"
        ],
        correct: 0,
        conclusion: "Le nerf sciatique est conducteur moteur : il conduit l'influx nerveux moteur vers le muscle.",
        animation: "peripheralLeft"
      },
      {
        id: 4,
        title: "Stimulation du bout central du nerf sciatique gauche",
        situation: "Après section du nerf sciatique gauche, on stimule le bout central, c'est-à-dire le bout relié à la moelle épinière.",
        hypothesis: "Si le bout central conduit vers la moelle, alors un influx sensitif doit atteindre la moelle et déclencher une réponse motrice de l'autre patte.",
        actions: ["Couper le nerf sciatique gauche", "Stimuler le bout central"],
        observation: "Flexion de la patte droite : l'influx va vers la moelle, puis une réponse motrice revient vers la patte droite.",
        question: "Que montre cette expérience ?",
        options: [
          "Le nerf conduit un influx sensitif",
          "Le muscle produit le mouvement seul",
          "La peau est un centre nerveux"
        ],
        correct: 0,
        conclusion: "Le nerf sciatique est conducteur sensitif lorsqu'il conduit l'influx vers la moelle épinière.",
        animation: "centralLeft"
      },
      {
        id: 5,
        title: "Destruction de la moelle épinière puis stimulation de la patte droite",
        situation: "On détruit la moelle épinière d'une grenouille spinale, puis on stimule la peau de la patte droite.",
        hypothesis: "Si la moelle épinière est le centre nerveux du réflexe, alors sa destruction doit empêcher toute flexion.",
        actions: ["Détruire la moelle épinière", "Stimuler la patte droite"],
        observation: "Aucune flexion : l'influx est interrompu au niveau de la moelle épinière détruite.",
        question: "Quel est le rôle de la moelle épinière ?",
        options: ["Effecteur", "Centre nerveux médullaire", "Récepteur"],
        correct: 1,
        conclusion: "La moelle épinière est le centre nerveux du réflexe médullaire.",
        animation: "blockedCord"
      },
      {
        id: 6,
        title: "Section du muscle du mollet gauche puis stimulation du nerf",
        situation: "On sectionne le muscle du mollet gauche, puis on stimule le bout périphérique du nerf sciatique gauche.",
        hypothesis: "Si le muscle est l'effecteur du mouvement, alors il peut se contracter, mais la patte ne fléchira pas si le muscle est sectionné.",
        actions: ["Sectionner le muscle du mollet gauche", "Stimuler le bout périphérique du nerf"],
        observation: "Le muscle se contracte visuellement, mais la patte gauche reste immobile : il n'y a aucune flexion.",
        question: "Que démontre cette expérience ?",
        options: [
          "Les muscles sont des effecteurs",
          "Les muscles sont des récepteurs",
          "Les muscles sont des centres nerveux"
        ],
        correct: 0,
        conclusion: "Les muscles sont les organes effecteurs du mouvement réflexe.",
        animation: "muscleOnly"
      }
    ];

    const finalQuiz = [
      {
        question: "Quel organe joue le rôle de récepteur sensitif dans ces expériences ?",
        options: ["La peau", "Le muscle", "La patte entière"],
        correct: 0
      },
      {
        question: "Quel est le centre nerveux du réflexe médullaire ?",
        options: ["Le cerveau", "La moelle épinière", "Le mollet"],
        correct: 1
      },
      {
        question: "Quel organe est l'effecteur du mouvement réflexe ?",
        options: ["La peau", "Le nerf", "Le muscle"],
        correct: 2
      },
      {
        question: "Après anesthésie de la peau, pourquoi n'y a-t-il aucune réaction ?",
        options: ["La peau ne reçoit plus efficacement le stimulus", "La moelle est toujours détruite", "Le muscle disparaît"],
        correct: 0
      },
      {
        question: "Après section du nerf sciatique gauche et stimulation des deux pattes, quel résultat observe-t-on ?",
        options: ["Flexion gauche uniquement", "Flexion droite uniquement", "Flexion des deux pattes"],
        correct: 1
      },
      {
        question: "La stimulation du bout périphérique du nerf sciatique gauche provoque :",
        options: ["La flexion de la patte gauche", "La flexion de la patte droite", "Aucune contraction musculaire"],
        correct: 0
      },
      {
        question: "La stimulation du bout central du nerf sciatique gauche montre surtout que :",
        options: ["Le nerf peut conduire un influx sensitif vers la moelle", "Le muscle est un centre nerveux", "La peau est un effecteur"],
        correct: 0
      },
      {
        question: "Si la moelle épinière est détruite, la stimulation de la patte droite provoque :",
        options: ["Une flexion forte", "Une contraction du cerveau", "Aucune réaction mécanique"],
        correct: 2
      }
    ];

    let currentExpIndex = 0;
    let currentStep = 0; 
    let activeActionIndex = 0;
    const validatedExperiments = new Set();
    let finalScore = 0;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');

    async function saveToDatabase(experiment, question, answerGiven, isCorrect, attempts = 1) {
      if (!sessionId) return;
      try {
        await fetch('/api/session/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: parseInt(sessionId),
            experiment,
            question,
            answerGiven,
            isCorrect,
            attempts
          })
        });
      } catch (err) {
        console.error("Failed to save to database", err);
      }
    }

    const expBadge = document.getElementById('experimentBadge');
    const expNav = document.getElementById('experimentNav');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    const lessonContent = document.getElementById('lessonContent');

    const leftLeg = document.getElementById('leftLeg');
    const rightLeg = document.getElementById('rightLeg');
    const leftSkinPatch = document.getElementById('leftSkinPatch');
    const rightSkinPatch = document.getElementById('rightSkinPatch');
    const leftCalfMuscle = document.getElementById('leftCalfMuscle');
    const spinalCord = document.getElementById('spinalCord');
    const leftNerveCut = document.getElementById('leftNerveCut');
    const spinalDestroyed = document.getElementById('spinalDestroyed');
    const blockedAtCord = document.getElementById('blockedAtCord');
    const muscleCut = document.getElementById('muscleCut');

    const flowLeftSensory = document.getElementById('flowLeftSensory');
    const flowLeftMotor = document.getElementById('flowLeftMotor');
    const flowRightSensory = document.getElementById('flowRightSensory');
    const flowRightMotor = document.getElementById('flowRightMotor');
    const flowPeripheralLeft = document.getElementById('flowPeripheralLeft');
    const flowCentralLeft = document.getElementById('flowCentralLeft');
    const flowBlockedAtCord = document.getElementById('flowBlockedAtCord');

    const ringA = document.getElementById('processingRingA');
    const ringB = document.getElementById('processingRingB');

    function initNav() {
      expNav.innerHTML = '';
      experiments.forEach((exp, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `nav-button ${idx === currentExpIndex ? 'active' : ''}`;
        btn.textContent = `Exp. ${exp.id}`;
        btn.addEventListener('click', () => switchExperiment(idx));
        expNav.appendChild(btn);
      });
    }

    function updateNav() {
      Array.from(expNav.children).forEach((btn, idx) => {
        btn.className = 'nav-button';
        if (idx === currentExpIndex) btn.classList.add('active');
        if (validatedExperiments.has(idx)) btn.classList.add('done');
      });
      
      const count = validatedExperiments.size;
      progressText.textContent = `${count} / 6 validée${count > 1 ? 's' : ''}`;
      progressFill.style.width = `${(count / 6) * 100}%`;
    }

    function switchExperiment(index) {
      if (index === 'final') {
        currentExpIndex = 'final';
        currentStep = 0;
        expBadge.textContent = "Évaluation Finale";
        renderFinalQuiz();
        return;
      }
      currentExpIndex = index;
      currentStep = 0;
      activeActionIndex = 0;
      expBadge.textContent = `Expérience ${experiments[index].id} / 6`;
      resetSvgState();
      renderLesson();
      updateNav();
    }

    function resetSvgState() {
      leftLeg.classList.remove('flexed');
      rightLeg.classList.remove('flexed');
      leftCalfMuscle.classList.remove('contract');

      leftSkinPatch.className.baseVal = "skin-patch";
      rightSkinPatch.className.baseVal = "skin-patch";
      spinalCord.className.baseVal = "spinal-cord";

      leftNerveCut.classList.add('hidden');
      spinalDestroyed.classList.add('hidden');
      blockedAtCord.classList.add('hidden');
      muscleCut.classList.add('hidden');

      [flowLeftSensory, flowLeftMotor, flowRightSensory, flowRightMotor, 
       flowPeripheralLeft, flowCentralLeft, flowBlockedAtCord, ringA, ringB].forEach(el => {
        if(el) el.classList.remove('active');
      });

      if (currentExpIndex !== 'final') {
        const expId = experiments[currentExpIndex].id;
        if (expId === 1) leftSkinPatch.classList.add('anesthetized');
      }
    }

    function runSimulation() {
      if (currentExpIndex === 'final') return;

      const animType = experiments[currentExpIndex].animation;

      if (animType === "noReaction") {
        leftSkinPatch.classList.add('stimulated');
      } 
      // MODIFICATION EXP. 2 : On affiche l'acide sur les 2 pattes, mais l'influx bleu n'apparaît QUE sur la patte droite !
      else if (animType === "rightOnly") {
        leftSkinPatch.classList.add('stimulated');
        rightSkinPatch.classList.add('stimulated');
        setTimeout(() => {
          flowRightSensory.classList.add('active'); // Seul l'influx sensitif droit démarre
          setTimeout(() => {
            ringA.classList.add('active');
            ringB.classList.add('active');
            setTimeout(() => {
              flowRightMotor.classList.add('active');
              rightLeg.classList.add('flexed');
            }, 300);
          }, 400);
        }, 200);
      } 
      else if (animType === "peripheralLeft") {
        flowPeripheralLeft.classList.add('active');
        leftCalfMuscle.classList.add('contract');
        setTimeout(() => {
          leftLeg.classList.add('flexed');
        }, 200);
      } 
      else if (animType === "centralLeft") {
        flowCentralLeft.classList.add('active');
        setTimeout(() => {
          ringA.classList.add('active');
          ringB.classList.add('active');
          setTimeout(() => {
            flowRightMotor.classList.add('active');
            rightLeg.classList.add('flexed');
          }, 300);
        }, 400);
      } 
      else if (animType === "blockedCord") {
        rightSkinPatch.classList.add('stimulated');
        setTimeout(() => {
          flowBlockedAtCord.classList.add('active');
          setTimeout(() => {
            blockedAtCord.classList.remove('hidden');
          }, 400);
        }, 200);
      } 
      else if (animType === "muscleOnly") {
        flowPeripheralLeft.classList.add('active');
        setTimeout(() => {
          leftCalfMuscle.classList.add('contract');
        }, 200);
      }
    }

    window.triggerAction = function(index) {
      if (index !== activeActionIndex) {
        document.getElementById('actionStatus').textContent = "⚠️ Veuillez suivre l'ordre chronologique des étapes du protocole.";
        return;
      }
      
      const btn = document.getElementById(`actBtn_${index}`);
      btn.classList.add('done');
      btn.disabled = true;
      activeActionIndex++;

      const exp = experiments[currentExpIndex];
      const actionText = exp.actions[index];

      if (actionText.toLowerCase().includes("couper le nerf sciatique")) {
        leftNerveCut.classList.remove('hidden');
      }
      else if (actionText.toLowerCase().includes("sectionner le muscle")) {
        muscleCut.classList.remove('hidden');
      }
      else if (actionText.toLowerCase().includes("détruire la moelle épinière")) {
        spinalCord.classList.add('destroyed');
        spinalDestroyed.classList.remove('hidden');
      }

      if (activeActionIndex === exp.actions.length) {
        document.getElementById('actionStatus').textContent = "🔬 Manipulation réussie ! Observation en cours...";
        runSimulation();
        setTimeout(() => {
          currentStep = 1;
          activeActionIndex = 0;
          renderLesson();
        }, 1200);
      } else {
        document.getElementById('actionStatus').textContent = `Étape ${index + 1} validée. Passez à l'étape suivante.`;
      }
    };

    function renderLesson() {
      const exp = experiments[currentExpIndex];
      let html = `
        <span class="eyebrow">Objectif Pédagogique</span>
        <h2>${exp.title}</h2>
        <div class="info-card">
          <p><strong>Situation :</strong> ${exp.situation}</p>
          <p><strong>Hypothèse :</strong> <em>${exp.hypothesis}</em></p>
        </div>
      `;

      if (currentStep === 0) {
        html += `
          <div class="action-list">
            <p><strong>Actions à mener au laboratoire :</strong></p>
            ${exp.actions.map((act, i) => `<button class="action-button" id="actBtn_${i}" onclick="triggerAction(${i})"><span>${i+1}. ${act}</span> ⚡</button>`).join('')}
          </div>
          <div class="status-line" id="actionStatus">Cliquez sur les actions dans l'ordre pour lancer la manipulation.</div>
        `;
      } 
      else if (currentStep === 1) {
        html += `
          <div class="observation-card">
            <p><strong>👁️ Observation :</strong> ${exp.observation}</p>
          </div>
          <div class="quiz-card">
            <h3>Vérification des acquis</h3>
            <p>${exp.question}</p>
            <div class="option-list">
              ${exp.options.map((opt, i) => `<button class="option-button" onclick="checkQuizAnswer(${i})">${opt}</button>`).join('')}
            </div>
            <div id="quizFeedback" class="feedback"></div>
          </div>
        `;
      } 
      else if (currentStep === 2) {
        html += `
          <div class="observation-card">
            <p><strong>👁️ Observation :</strong> ${exp.observation}</p>
          </div>
          <div class="conclusion-card">
            <h3>💡 Conclusion validée</h3>
            <p>${exp.conclusion}</p>
          </div>
          <div style="margin-top:20px; display:flex; gap:10px;">
            <button class="primary-button" style="flex:1;" onclick="nextStepGlobal()">
              ${currentExpIndex < 5 ? "Passer à l'expérience suivante ➔" : "Accéder à l'évaluation finale ➔"}
            </button>
          </div>
        `;
      }

      lessonContent.innerHTML = html;
    }

    window.checkQuizAnswer = function(selectedIndex) {
      const exp = experiments[currentExpIndex];
      const buttons = document.querySelectorAll('.option-list .option-button');
      const feedback = document.getElementById('quizFeedback');

      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === exp.correct) btn.classList.add('correct');
        else if (idx === selectedIndex) btn.classList.add('wrong');
      });

      const isCorrect = selectedIndex === exp.correct;
      saveToDatabase(`motricite_${exp.id}`, exp.question, exp.options[selectedIndex], isCorrect);

      if (isCorrect) {
        feedback.textContent = "🎉 Correct ! Vous avez déduit le bon rôle biologique.";
        feedback.className = "feedback good";
        validatedExperiments.add(currentExpIndex);
        updateNav();
        setTimeout(() => {
          currentStep = 2;
          renderLesson();
        }, 1500);
      } else {
        feedback.textContent = "❌ Ce n'est pas tout à fait ça. Analysez bien l'organe altéré et réessayez.";
        feedback.className = "feedback bad";
        setTimeout(() => {
          currentStep = 0;
          renderLesson();
          resetSvgState();
        }, 2500);
      }
    };

    window.nextStepGlobal = function() {
      if (currentExpIndex < 5) {
        switchExperiment(currentExpIndex + 1);
      } else {
        switchExperiment('final');
      }
    };

    function renderFinalQuiz() {
      resetSvgState();
      updateNav();
      
      let html = `
        <span class="eyebrow" style="background:#fef3c7; color:#b45309;">Évaluation Sommative</span>
        <h2>Bilan du Réflexe Médullaire</h2>
        <p>Répondez à ces questions de synthèse pour valider définitivement vos compétences de laboratoire.</p>
        <form id="finalQuizForm" onsubmit="validateFinalQuiz(event)">
      `;

      finalQuiz.forEach((q, qIdx) => {
        html += `
          <fieldset class="final-question">
            <legend>${qIdx + 1}. ${q.question}</legend>
            ${q.options.map((opt, oIdx) => `
              <label>
                <input type="radio" name="fq_${qIdx}" value="${oIdx}" required> ${opt}
              </label>
            `).join('')}
          </fieldset>
        `;
      });

      html += `
          <button type="submit" class="primary-button" style="width:100%; margin-top:20px; padding:15px;">
            📊 Soumettre mes réponses et voir mon score
          </button>
        </form>
        <div id="finalResult" class="hidden"></div>
      `;

      lessonContent.innerHTML = html;
    }

    window.validateFinalQuiz = function(event) {
      event.preventDefault();
      finalScore = 0;
      const form = document.getElementById('finalQuizForm');
      
      finalQuiz.forEach((q, qIdx) => {
        const selected = form.querySelector(`input[name="fq_${qIdx}"]:checked`);
        const fieldset = selected.closest('.final-question');
        
        if (selected && parseInt(selected.value) === q.correct) {
          finalScore++;
          fieldset.style.borderColor = "var(--success)";
          fieldset.style.background = "#f0fdf4";
        } else {
          fieldset.style.borderColor = "var(--danger)";
          fieldset.style.background = "#fff5f5";
        }
      });

      saveToDatabase('motricite_final', 'Évaluation Finale', `Score: ${finalScore}/${finalQuiz.length}`, finalScore >= 4);

      const resultBadge = document.getElementById('finalResult');
      resultBadge.className = "result-badge";
      
      let mention = "Excellent ! Vos connaissances sur l'arc réflexe sont solides.";
      if (finalScore < 4) mention = "Nous vous conseillons de recommencer le laboratoire pour mieux assimiler le trajet de l'influx.";
      else if (finalScore < 7) mention = "Bon travail, l'essentiel des mécanismes de transmission est compris.";

      resultBadge.innerHTML = `
        <h3>Score Final : ${finalScore} / ${finalQuiz.length}</h3>
        <p>${mention}</p>
        <button type="button" class="ghost-button" style="margin-top:10px; width:100%;" onclick="restartWholeLab()">
          🔄 Recommencer tout le laboratoire
        </button>
      `;
      
      resultBadge.classList.remove('hidden');
      resultBadge.scrollIntoView({ behavior: 'smooth' });
    };

    window.restartWholeLab = function() {
      validatedExperiments.clear();
      switchExperiment(0);
    };

    initNav();
    switchExperiment(0);