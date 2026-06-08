export const experiments = [
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

export const finalQuiz = [
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

    export {}