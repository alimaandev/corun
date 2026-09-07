export type Locale = 'en' | 'es' | 'fr'

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    'app.title': 'CORUN',
    'app.subtitle': 'Escape the Monster',
    'game.score': 'SCORE',
    'mode.free': 'FREE PLAY',
    'mode.daily': 'DAILY',
    'mode.speedrun': 'SPEED RUN',
    'mode.survival': 'SURVIVAL',
    'start.dailyTitle': 'DAILY CHALLENGE',
    'start.topics': 'ALL TOPICS',
    'start.leaderboard': 'LEADERBOARD',
    'start.highScore': 'HIGH SCORE',
    'start.worldRank': 'WORLD RANK',
    'start.freeplay.desc':
      'Endless side-scrolling run. Adaptive difficulty, boss battles, combo multipliers.',
    'start.daily.desc': 'One shot, one score, every day. Seeded pool, daily leaderboard.',
    'start.speedrun.desc': '60-second countdown. Wrong answers cost points. Pure clock pressure.',
    'start.story.desc':
      'Campaign of four nodes — The Cell, The Vents, The Core... and the Warden himself.',
    'start.survival.desc': '3 lives. Every wrong answer loses one. Questions keep getting harder.',
    'btn.resume': 'RESUME',
    'btn.back': '← BACK',
    'btn.puzzleEditor': 'PUZZLE EDITOR',
    'btn.customPuzzles': 'COMMUNITY PUZZLES',
    'lb.allTime': 'ALL TIME',
    'lb.today': 'TODAY',
    'lb.name': 'NAME',
    'lb.score': 'SCORE',
    'lb.you': '(you)',
    'lb.yourRank': 'YOUR RANK: #{rank}',
    'story.title': 'STORY MODE',
    'story.enter': 'STORY',
    'story.back': 'BACK',
    'story.locked': 'LOCKED',
    'story.stars': '{n}/12 STARS',
    'story.boss': 'BOSS',
    'story.retry': 'RETRY',
    'story.map': 'MAP',
    'story.task': 'TASK',
    'story.runTest': 'RUN TEST',
    'story.running': 'RUNNING...',
    'story.hint': 'HINT',
    'story.cleared': 'NODE CLEARED',
    'story.signalLost': 'SIGNAL LOST',
    'story.continuous': '⚠ CONTINUOUS — KEEP MOVING · HOLD CANVAS TO RUN · TAP TO JUMP',
    'story.moves': '[A/D or ←/→ move — SPACE jump]',
    'story.warden': 'The Warden is in front of you. Solve his algorithms to break his core.',
    'story.pipe': 'Run the pipe. The next terminal activates as you progress.',
    'story.firstFail': 'FIRST FAILURE COSTS 1 HP',
    'story.failedOnce': '-1 HP IF THIS FAILS',
    'story.ctrlEnter': 'CTRL+ENTER TO RUN',
    'story.taskCleared': 'Task cleared. Moving on...',
  },
  es: {
    'app.title': 'CORUN',
    'app.subtitle': 'Escapa del Monstruo',
    'game.score': 'PUNTOS',
    'mode.free': 'JUEGO LIBRE',
    'mode.daily': 'DIARIO',
    'mode.speedrun': 'CONTRARRELOJ',
    'mode.survival': 'SUPERVIVENCIA',
    'start.dailyTitle': 'RETO DIARIO',
    'start.topics': 'TODOS LOS TEMAS',
    'start.leaderboard': 'CLASIFICACIÓN',
    'start.highScore': 'RÉCORD MÁXIMO',
    'start.worldRank': 'RANKING MUNDIAL',
    'start.freeplay.desc':
      'Carrera lateral infinita. Dificultad adaptativa, jefes y multiplicadores de combo.',
    'start.daily.desc': 'Un intento, una puntuación, cada día. Pool fijo y clasificación diaria.',
    'start.speedrun.desc':
      'Cuenta atrás de 60 segundos. Las respuestas erróneas cuestan puntos. Pura presión de reloj.',
    'start.story.desc':
      'Campaña de cuatro nodos: La Celda, Los Conductos, El Núcleo... y el propio Guardián.',
    'start.survival.desc':
      '3 vidas. Cada error cuesta una. Las preguntas se vuelven más difíciles.',
    'btn.resume': 'REANUDAR',
    'btn.back': '← ATRÁS',
    'btn.puzzleEditor': 'EDITOR',
    'btn.customPuzzles': 'PUZLES DE LA COMUNIDAD',
    'lb.allTime': 'SIEMPRE',
    'lb.today': 'HOY',
    'lb.name': 'NOMBRE',
    'lb.score': 'PUNTOS',
    'lb.you': '(tú)',
    'lb.yourRank': 'TU PUESTO: #{rank}',
    'story.title': 'MODO HISTORIA',
    'story.enter': 'HISTORIA',
    'story.back': 'ATRÁS',
    'story.locked': 'BLOQUEADO',
    'story.stars': '{n}/12 ESTRELLAS',
    'story.boss': 'JEFE',
    'story.retry': 'REINTENTAR',
    'story.map': 'MAPA',
    'story.task': 'TAREA',
    'story.runTest': 'EJECUTAR',
    'story.running': 'EJECUTANDO...',
    'story.hint': 'PISTA',
    'story.cleared': 'NODO SUPERADO',
    'story.signalLost': 'SEÑAL PERDIDA',
    'story.continuous':
      '⚠ CONTINUO — SIGUE MOVIÉNDOTE · MANTÉN EL CANVAS PARA CORRER · TOCA PARA SALTAR',
    'story.moves': '[A/D o ←/→ mover — ESPACIO saltar]',
    'story.warden': 'El Guardián está frente a ti. Resuelve sus algoritmos para romper su núcleo.',
    'story.pipe': 'Corre por la tubería. La siguiente terminal se activa al avanzar.',
    'story.firstFail': 'LA PRIMERA FALLA CUESTA 1 HP',
    'story.failedOnce': '-1 HP SI FALLA',
    'story.ctrlEnter': 'CTRL+ENTER PARA EJECUTAR',
    'story.taskCleared': 'Tarea superada. Continuando...',
  },
  fr: {
    'app.title': 'CORUN',
    'app.subtitle': 'Échappe-toi du Monstre',
    'game.score': 'SCORE',
    'mode.free': 'JEU LIBRE',
    'mode.daily': 'QUOTIDIEN',
    'mode.speedrun': 'COURSE',
    'mode.survival': 'SURVIE',
    'start.dailyTitle': 'DÉFI QUOTIDIEN',
    'start.topics': 'TOUS LES SUJETS',
    'start.leaderboard': 'CLASSEMENT',
    'start.highScore': 'RECORD',
    'start.worldRank': 'CLASSEMENT MONDIAL',
    'start.freeplay.desc':
      'Course infinie en défilement latéral. Difficulté adaptative, boss et multiplicateurs de combo.',
    'start.daily.desc': 'Un essai, un score, chaque jour. Pool fixe et classement quotidien.',
    'start.speedrun.desc':
      '60 secondes au compteur. Les mauvaises réponses coûtent des points. Pression du chrono.',
    'start.story.desc':
      'Campagne de quatre nœuds : la Cellule, les Conduits, le Noyau... et le Gardien lui-même.',
    'start.survival.desc':
      '3 vies. Chaque erreur en coûte une. Les questions deviennent plus dures.',
    'btn.resume': 'REPRENDRE',
    'btn.back': '← RETOUR',
    'btn.puzzleEditor': 'ÉDITEUR',
    'btn.customPuzzles': 'ÉNIGMES DE LA COMMUNAUTÉ',
    'lb.allTime': 'TOUT LE TEMPS',
    'lb.today': "AUJOURD'HUI",
    'lb.name': 'NOM',
    'lb.score': 'SCORE',
    'lb.you': '(toi)',
    'lb.yourRank': 'TON RANG: #{rank}',
    'story.title': 'MODE HISTOIRE',
    'story.enter': 'HISTOIRE',
    'story.back': 'RETOUR',
    'story.locked': 'VERROUILLÉ',
    'story.stars': '{n}/12 ÉTOILES',
    'story.boss': 'BOSS',
    'story.retry': 'RESSAYER',
    'story.map': 'CARTE',
    'story.task': 'TÂCHES',
    'story.runTest': 'EXÉCUTER',
    'story.running': 'EXÉCUTION...',
    'story.hint': 'INDICE',
    'story.cleared': 'NŒUD TERMINÉ',
    'story.signalLost': 'SIGNAL PERDU',
    'story.continuous': '⚠ CONTINU — BOUGEZ · MAINTENEZ LE CANVAS POUR COURIR · TAPEZ POUR SAUTER',
    'story.moves': '[A/D ou ←/→ bouger — ESPACE sauter]',
    'story.warden': 'Le Gardien est devant toi. Résous ses algorithmes pour briser son noyau.',
    'story.pipe': 'Cours dans le tuyau. Le prochain terminal s’active en avançant.',
    'story.firstFail': 'LE PREMIER ÉCHEC COÛTE 1 PV',
    'story.failedOnce': '-1 PV SI ÉCHEC',
    'story.ctrlEnter': 'CTRL+ENTRÉE POUR EXÉCUTER',
    'story.taskCleared': 'Tâche terminée. Suite...',
  },
}

let currentLocale: Locale = 'en'

export function setLocale(locale: Locale) {
  currentLocale = locale
  try {
    localStorage.setItem('corun_locale', locale)
  } catch {}
}

export function getLocale(): Locale {
  try {
    const queryLang = new URLSearchParams(window.location.search).get('lang')
    if (queryLang && STRINGS[queryLang as Locale]) return queryLang as Locale
  } catch {}
  try {
    const saved = localStorage.getItem('corun_locale') as Locale | null
    if (saved && STRINGS[saved]) return saved
  } catch {}
  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang && STRINGS[browserLang as Locale]) return browserLang as Locale
  return 'en'
}

export function t(key: string, params?: Record<string, string | number>): string {
  const str = STRINGS[currentLocale]?.[key] ?? STRINGS.en[key] ?? key
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}

export function getSupportedLocales(): Locale[] {
  return Object.keys(STRINGS) as Locale[]
}
