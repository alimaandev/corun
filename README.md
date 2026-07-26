<div align="center">
  <h1>🏃 CORUN</h1>
  <h3>ESCAPE THE MONSTER</h3>
  <p><em>A pixel-art coding adventure with 3D story mode, procedural soundtrack, and PWA support.</em></p>
  <br/>
  <a href="https://corun-zeta.vercel.app">
    <img src="https://img.shields.io/badge/PLAY_NOW-0a0a0a?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <br/><br/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white" />
  <br/>
  <img src="https://img.shields.io/github/actions/workflow/status/alimaandev/corun/.github/workflows/ci.yml?style=flat-square&logo=github&label=CI" />
  <img src="https://img.shields.io/github/license/alimaandev/corun?style=flat-square" />
  <img src="https://img.shields.io/github/stars/alimaandev/corun?style=flat-square&logo=github" />
  <img src="https://img.shields.io/github/v/release/alimaandev/corun?style=flat-square&logo=semantic-release" />
</div>

<br />

> **CORUN** is a free, open-source coding game where you escape a monster by solving real JavaScript puzzles. Featuring a 3D story mode with 12 levels, an endless runner with boss battles, user-generated content, and full PWA offline support.

<br />

---

## ✨ Features

| Category | Highlights |
|----------|-----------|
| **🎮 Two Game Modes** | Story Mode (12-level 3D adventure) + Endless Runner (procedural arcade) |
| **📝 Real Code Puzzles** | 52 hand-crafted JavaScript challenges — strings, arrays, objects, regex, math |
| **🏰 3D Story World** | Diegetic code editor rendered in-scene on a 3D mesh, NPCs, particle effects |
| **🎵 Procedural Audio** | Dynamic soundtrack with 12 level-specific presets, reactive BPM |
| **📱 Mobile Ready** | Touch joystick, responsive UI, PWA installable to home screen |
| **🛠️ User Content** | Built-in puzzle editor, share via URL, community puzzle browser |
| **🌐 i18n** | English, Spanish, French — with auto-detection |
| **🏆 Competitive** | Speed Run & Survival modes, leaderboard, skill-based badging |
| **♿ Accessible** | Focus traps, ARIA roles, keyboard navigation |
| **⚡ Performance** | Code-split chunks (three.js 190KB gz), offscreen canvas, lazy loading |

<br />

---

## 🎯 Game Modes

### 🏰 Story Mode — 12 Levels

Walk a 3D side-scrolling world, interact with NPCs, solve code puzzles at glowing terminals, and follow a narrative through cutscenes.

| # | Level | Arc | Puzzles |
|---|-------|-----|---------|
| 1 | The Cell | Awakening | `if` statements, guard patrol logic |
| 2 | The Dungeon | Deeper | Loops, array filtering |
| 3 | The Sewers | Into the Dark | String manipulation, recursion |
| 4 | The Forest | The Wilds | Object manipulation, data transformation |
| 5 | The Village | Civilization | Sorting algorithms, comparison |
| 6 | The Bridge | Crossing | Math utilities, coordinate geometry |
| 7 | The Courtyard | Fortress | Stack/queue logic, validation |
| 8 | The Hall | The Castle | State machines, complex conditions |
| 9 | The Throne Room | The King | Everything combined + final boss |
| 10 | The Library | Archives | Array methods, indexOf |
| 11 | The Laboratory | Alchemy | String ops, sequence calibration |
| 12 | The Tower Spire | The Summit | Advanced logic, clock mechanisms |

**Each level includes:** 2+ code puzzles · NPC interactions · Intro/outro cutscenes · Boss fights · Star ratings (1–3★)

### 🏃 Endless Runner

Classic 3-lane highway escape with adaptive difficulty.

- **Real-time coding** — challenges pop up mid-run, answer fast or the monster closes in
- **4 question types** — multiple choice, fill-in-blank, output prediction, spot the bug
- **Adaptive difficulty** — 3 correct = harder, 2 wrong = easier
- **Combo multiplier** — 3+ streak → 1.5×, 5+ → 2×, 7+ → 3×, 10+ → 4× score
- **Boss battles** — every ~150 pts, hard questions, big rewards
- **Bonus rounds** — every ~80 pts, 5-second lightning round, 2× points
- **Daily challenges** — one shot per day, leaderboard comparison
- **Mastery badges** — 5+ correct in a topic = badge on game-over

### ⚡ Speed Run

60-second countdown. Answer as many puzzles as you can. Score resets on each wrong answer. Timer displayed in HUD.

### ❤️ Survival

3 lives. Every wrong answer costs one. Hearts displayed in HUD. Game over at 0.

<br />

---

## 🎮 Controls

### Story Mode

| Input | Action |
|-------|--------|
| `←` / `→` | Move left / right |
| `E` / Tap panel | Interact with terminal |
| `Enter` | Advance dialogue / Submit |
| Touch joystick | Mobile movement + interact button |

### Endless / Speed Run / Survival

| Input | Action |
|-------|--------|
| `←` / `A` | Move left lane |
| `→` / `D` | Move right lane |
| `1` – `4` | Select answer |
| `Enter` | Start / Restart |
| Touch | Swipe or tap sides (mobile) |

<br />

---

## 🧩 Code Puzzles

**52 puzzles** across 12 levels covering real JavaScript fundamentals:

- **Strings** — reverse, capitalize, trim, palindrome, anagram detection
- **Arrays** — map, filter, reduce, sort, unique values, chunking
- **Objects** — key access, merge, transform, deep clone
- **Math** — `Math.ceil`, `Math.floor`, `Math.round`, `Math.min`/`Math.max`
- **Logic** — `if/else`, `switch`, ternary, short-circuit evaluation
- **Functions** — closures, recursion, higher-order functions
- **Regex** — pattern matching, replace, validation
- **ES6+** — arrow functions, destructuring, spread/rest, `Array.from`

All puzzles are sandbox-evaluated via a Web Worker (`sandbox.worker.ts`) with a 2-second timeout.

<br />

---

## 🛠️ User-Generated Content

### Puzzle Editor
Create your own coding puzzles with a form-based editor:
- Title, description, template code, test code, hint, success message
- Assign to any level (1–12)
- Saved to `localStorage` and shareable via encoded URL

### Community Puzzles Browser
Browse, search, and play puzzles created by others:
- Grid view with title, level, description preview
- Search by keyword
- Delete your own creations
- Test any puzzle inline with the play-testing harness

### Sharing
```bash
# Puzzles are shared as base64-encoded URLs:
https://corun-zeta.vercel.app/?puzzle=eyJ0Ijoi...
```

<br />

---

## 🎵 Procedural Soundtrack

Every level has a unique audio identity generated at runtime via the Web Audio API:

| Level | Base Freq | Character |
|-------|-----------|-----------|
| The Cell | 55 Hz | Dark drone, slow beat |
| The Dungeon | 65 Hz | Low rumble, metallic |
| The Sewers | 72 Hz | Wet resonance, dripping |
| The Forest | 88 Hz | Organic, rustling |
| The Village | 96 Hz | Warm, bustling |
| The Bridge | 104 Hz | Tense, creaking |
| The Courtyard | 110 Hz | Marching, alert |
| The Hall | 120 Hz | Echoing, grand |
| The Throne Room | 130 Hz | Regal, ominous |
| The Library | 140 Hz | Quiet, textured |
| The Laboratory | 150 Hz | Glitchy, alchemical |
| The Tower Spire | 160 Hz | Ascending, triumphant |

BPM scales from 60 to 140 based on puzzle-solving progress. Three drum layers (kick, snare, hi-hat) activate progressively.

<br />

---

## 🌐 Internationalization

Three locales supported with automatic browser detection:

| Locale | Code | Status |
|--------|------|--------|
| English | `EN` | ✓ Full |
| Español | `ES` | ✓ Full |
| Français | `FR` | ✓ Full |

Locale is persisted to `localStorage` and selectable from the Start Screen.

<br />

---

## 🚀 Tech Stack

```
Frontend     │ React 18 · TypeScript · Vite 6 · Three.js · @react-three/fiber
State        │ React hooks + localStorage
Auth         │ Auth0 (optional — guest/demo mode auto-detects missing config)
Audio        │ Web Audio API (procedural synthesis, no audio files)
Rendering    │ HTML5 Canvas (2D runner) · WebGL (3D scenes) · OffscreenCanvas (backgrounds)
Testing      │ Vitest · React Testing Library
Linting      │ ESLint · Prettier
CI/CD        │ GitHub Actions · semantic-release
PWA          │ vite-plugin-pwa · Workbox · service worker with offline cache
Deploy       │ Vercel (SPA with client-side routing)
```

<br />

---

## 📁 Project Structure

```
src/
├── game/
│   ├── PixelRunner.tsx         — Endless runner game loop
│   ├── Scene3D.tsx             — 3D story mode Canvas + orchestration
│   ├── codePuzzles.ts          — 52 puzzles + sandbox evaluator
│   ├── codePuzzles.test.ts     — Puzzle unit tests
│   ├── levelScenes.ts          — 12 level 3D layouts
│   ├── levels.ts               — Level configs, progress helpers
│   ├── audio.ts                — Procedural soundtrack engine
│   ├── puzzleShare.ts          — UGC encode/decode, localStorage CRUD
│   ├── challenges.ts           — Challenge generation, daily, leaderboard
│   ├── themes.ts               — Visual themes (sky, ground, road)
│   ├── sprites.ts              — NPC pixel-art drawing functions
│   └── types.ts                — Shared TypeScript types
├── components/
│   ├── three/                  — 3D components
│   │   ├── EditorPanel3D.tsx   — Diegetic code editor (canvas texture)
│   │   ├── PlayerController.tsx — Player movement + animation
│   │   ├── NPCController.tsx   — NPC patrol + idle bobbing
│   │   ├── LevelEnvironment.tsx — Scenery, starfield, sky
│   │   └── Particles3D.tsx     — Particle burst/trail system
│   ├── Game.tsx                — Screen state machine, mode routing
│   ├── ChallengeModal.tsx      — Question UI (4 types)
│   ├── HUD.tsx                 — Score, gap, streak, timer, lives
│   ├── PuzzleEditor.tsx        — UGC puzzle creation form
│   ├── CommunityPuzzles.tsx    — UGC puzzle browser
│   ├── CodePuzzlePlaytest.tsx  — Inline puzzle test harness
│   ├── Joystick.tsx            — Virtual analog stick (mobile)
│   ├── InstallPrompt.tsx       — PWA install banner
│   ├── OfflineIndicator.tsx    — Online/offline toast
│   ├── GlassButton.tsx         — Reusable styled button
│   ├── StartScreen.tsx         — Mode select, locale, leaderboard
│   ├── GameOverScreen.tsx      — Final score, badges, share
│   ├── LevelSelect.tsx         — Level grid with stars
│   └── SceneCanvas.tsx         — 2D cutscene renderer
├── lib/
│   ├── auth.tsx                — Auth context + guest/demo fallback
│   ├── i18n.ts                 — Translation system (EN/ES/FR)
│   └── useFocusTrap.ts         — Accessibility focus trapping
├── pages/
│   ├── LandingPage.tsx         — Marketing homepage
│   ├── LoginPage.tsx           — Auth0 login redirect
│   └── RegisterPage.tsx        — Auth0 signup redirect
├── main.tsx                    — Entry point
├── App.tsx                     — Router + global components
└── index.css                   — Global styles, fonts, animations
```

<br />

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| **Lighthouse Performance** | 95+ |
| **Lighthouse PWA** | 100 |
| **Total JS (gzipped)** | ~470 KB |
| **three.js chunk** | 190 KB gz (lazy loaded) |
| **@react-three/fiber chunk** | 47 KB gz (lazy loaded) |
| **Game main chunk** | 95 KB gz |
| **PWA precached entries** | 23 |
| **Offline support** | Sandbox worker cached |

<br />

---

## 🏁 Getting Started

```bash
# Clone
git clone https://github.com/alimaandev/corun.git
cd corun

# Install
npm install

# Environment (optional — guest mode auto-detects missing vars)
cp .env.example .env

# Dev server
npm run dev        # → http://localhost:3000

# Type check
npx tsc --noEmit

# Test
npx vitest run     # 45+ tests

# Build
npm run build      # tsc -b && vite build → dist/
```

<br />

---

## ☁️ Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_AUTH0_DOMAIN` | No | Auth0 tenant domain (guest mode without it) |
| `VITE_AUTH0_CLIENT_ID` | No | Auth0 application client ID |

Zero-config deployment — Vercel detects Vite automatically.

<br />

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Development workflow
npm run dev          # Start dev server
npx vitest           # Watch mode tests
npx tsc --noEmit     # Type checking
npm run lint         # ESLint
npm run format       # Prettier
```

<br />

---

## 📜 License

MIT © [Ali Sher](https://github.com/alimaandev)

<br />

---

<div align="center">
  <sub>Built with React · TypeScript · Three.js · Vite</sub>
  <br/>
  <sub>"Every line of code brought you home."</sub>
  <br/><br/>
  <a href="https://corun-zeta.vercel.app">
    <img src="https://img.shields.io/badge/▶_PLAY_NOW-0a0a0a?style=for-the-badge" />
  </a>
</div>
