<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/icons/Corun.png">
    <img alt="Corun" src="public/icons/Corun.png" width="120" height="120">
  </picture>
</p>

<h1 align="center">🏃 CORUN</h1>
<h3 align="center">Escape the Monster — A Pixel‑Art Coding Adventure</h3>

<p align="center">
  <em>Solve JavaScript puzzles. Escape the monster. Master programming through play.</em>
</p>

<p align="center">
  <a href="https://corun-zeta.vercel.app">
    <img src="https://img.shields.io/badge/▶_PLAY_NOW-0a0a0a?style=for-the-badge&logo=vercel&logoColor=white" alt="Play Now" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/alimaandev/corun/.github/workflows/ci.yml?style=flat-square&logo=github&label=CI" alt="CI" />
  <img src="https://img.shields.io/github/license/alimaandev/corun?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/stars/alimaandev/corun?style=flat-square&logo=github" alt="Stars" />
  <img src="https://img.shields.io/github/v/release/alimaandev/corun?style=flat-square&logo=semantic-release" alt="Release" />
  <img src="https://img.shields.io/github/contributors/alimaandev/corun?style=flat-square" alt="Contributors" />
  <img src="https://img.shields.io/github/issues/alimaandev/corun?style=flat-square&logo=github" alt="Issues" />
  <img src="https://img.shields.io/badge/PRs-welcome-769826?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/github/last-commit/alimaandev/corun?style=flat-square" alt="Last Commit" />
</p>

<br />

---

## 📖 Table of Contents

- [Why Corun?](#-why-corun)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Game Modes](#-game-modes)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [Sponsors](#-sponsors)
- [License](#-license)

<br />

---

## 🎯 Why Corun?

Most coding games are either **too simple** (multiple choice trivia) or **too枯燥** (dry syntax drills). Corun is different:

- 🧠 **Real code** — Write actual JavaScript, not pseudo-code. Sandboxed Web Worker evaluation.
- 🏰 **Immersive story** — 12 levels with 3D scenes, NPCs, cutscenes, and a narrative that pulls you through.
- 🎵 **Procedural audio** — Every level has a unique soundtrack generated at runtime by the Web Audio API.
- 📱 **Works everywhere** — PWA installable, touch controls, offline support, 3 locales (EN/ES/FR).
- 🛠️ **Create your own** — Built-in puzzle editor. Share via URL. Play community puzzles.
- ⚡ **Performance first** — Code-split chunks, lazy loading, offscreen canvas. Ships ~470 KB gzipped.

> *"Every line of code brought you home."*

<br />

---

## 🖼️ Screenshots

<p align="center">
  <img src="public/demo.gif" alt="Corun gameplay demo" width="720" />
  <br />
  <em>Gameplay demo — story mode 3D scene with diegetic code editor</em>
</p>

<br />

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h4>🎮 <strong>Two Game Modes</strong></h4>
      <p>Story Mode (12-level 3D adventure) + Endless Runner (procedural arcade).</p>
    </td>
    <td width="50%">
      <h4>📝 <strong>52 Real Code Puzzles</strong></h4>
      <p>JavaScript fundamentals — strings, arrays, objects, regex, math, logic, ES6+.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🏰 <strong>3D Story World</strong></h4>
      <p>Diegetic code editor on a 3D mesh, NPC patrols, particle effects, dynamic lighting.</p>
    </td>
    <td>
      <h4>🎵 <strong>Procedural Soundtrack</strong></h4>
      <p>12 level-specific presets via Web Audio API. Reactive BPM scales with progress.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>📱 <strong>Mobile Ready</strong></h4>
      <p>Touch joystick, responsive UI, installable PWA. Works offline.</p>
    </td>
    <td>
      <h4>🛠️ <strong>User Content</strong></h4>
      <p>Built-in puzzle editor, share via base64 URL, community puzzle browser.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🌐 <strong>i18n</strong></h4>
      <p>English, Spanish, French. Auto-detects browser locale. Persisted to localStorage.</p>
    </td>
    <td>
      <h4>🏆 <strong>Competitive</strong></h4>
      <p>Speed Run & Survival modes, global leaderboard, skill-based badges.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>♿ <strong>Accessible</strong></h4>
      <p>Focus traps, ARIA roles, keyboard navigation, screen reader support.</p>
    </td>
    <td>
      <h4>⚡ <strong>Performant</strong></h4>
      <p>Lazy-loaded chunks, offscreen canvas rendering, code-split three.js (190 KB gz).</p>
    </td>
  </tr>
</table>

<br />

---

## 🎮 Game Modes

### 🏰 Story Mode — 12 Levels

Walk a 3D side-scrolling world, interact with NPCs, solve code puzzles at glowing terminals, and follow a narrative through cutscenes.

| Level | Name | Arc | Theme |
|-------|------|-----|-------|
| 1 | The Cell | Awakening | `if` statements, guard patrol |
| 2 | The Dungeon | Deeper | Loops, array filtering |
| 3 | The Sewers | Into the Dark | String manipulation, recursion |
| 4 | The Forest | The Wilds | Object manipulation |
| 5 | The Village | Civilization | Sorting, comparison |
| 6 | The Bridge | Crossing | Math utilities, geometry |
| 7 | The Courtyard | Fortress | Stack/queue, validation |
| 8 | The Hall | The Castle | State machines |
| 9 | The Throne Room | The King | Combined + final boss |
| 10 | The Library | Archives | Array methods, indexOf |
| 11 | The Laboratory | Alchemy | String ops, sequences |
| 12 | The Tower Spire | The Summit | Advanced logic |

### 🏃 Endless Runner

Classic 3-lane highway escape. Challenges pop up mid-run — answer fast or the monster closes in.

- **4 question types** — Multiple choice, fill-in-blank, output prediction, spot the bug
- **Adaptive difficulty** — 3 correct = harder, 2 wrong = easier
- **Combo multiplier** — 3+ streak → 1.5× up to 4× at 10+
- **Boss battles** — Every ~150 pts, hard questions, big rewards
- **Bonus rounds** — Every ~80 pts, 5-second lightning round, 2× points
- **Daily challenges** — One shot per day, leaderboard comparison
- **Mastery badges** — 5+ correct in a topic = badge

### ⚡ Speed Run & ❤️ Survival

| Mode | Rules |
|------|-------|
| **Speed Run** | 60-second countdown. Wrong answers cost points. Timer in HUD. |
| **Survival** | 3 lives. Every wrong answer loses one. Hearts displayed in HUD. |

<br />

---

## 🚀 Quick Start

```bash
git clone https://github.com/alimaandev/corun.git
cd corun
npm install
npm run dev        # → http://localhost:3000
```

No Auth0 account needed — the game falls back to guest/demo mode automatically.

```bash
npm run typecheck  # tsc -b
npm run test       # vitest run (45+ tests)
npm run build      # tsc -b && vite build → dist/
```

<br />

---

## 📁 Project Structure

<details>
<summary>Click to expand</summary>

```
src/
├── game/                    # Core game logic
│   ├── PixelRunner.tsx      # Endless runner engine
│   ├── Scene3D.tsx          # 3D story mode Canvas
│   ├── codePuzzles.ts       # 52 puzzles + sandbox evaluator
│   ├── audio.ts             # Procedural soundtrack
│   ├── puzzleShare.ts       # UGC encode/decode
│   ├── levels.ts            # 12 level configs + progress
│   ├── levelScenes.ts       # 3D scene layouts
│   └── challenges.ts        # Challenge generation
├── components/
│   ├── three/               # 3D components
│   │   ├── EditorPanel3D.tsx # Diegetic code editor
│   │   ├── PlayerController.tsx
│   │   ├── NPCController.tsx
│   │   ├── LevelEnvironment.tsx
│   │   └── Particles3D.tsx   # Burst/trail system
│   ├── Game.tsx             # Screen state machine
│   ├── ChallengeModal.tsx   # Question UI
│   ├── HUD.tsx              # Score, gap, streak
│   ├── PuzzleEditor.tsx     # UGC creation form
│   ├── CommunityPuzzles.tsx # UGC browser
│   └── Joystick.tsx         # Touch controls
├── lib/
│   ├── auth.tsx             # Auth + guest fallback
│   ├── i18n.ts              # EN/ES/FR translations
│   └── useFocusTrap.ts      # Accessibility
├── pages/
│   ├── LandingPage.tsx      # Marketing homepage
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── main.tsx                 # Entry point
├── App.tsx                  # Router
└── index.css                # Global styles
```

</details>

<br />

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

| Category | Tools |
|----------|-------|
| **Frontend** | React 18, TypeScript, Vite 6, Three.js, @react-three/fiber |
| **Audio** | Web Audio API (procedural synthesis, zero audio files) |
| **Auth** | Auth0 (with automatic guest fallback) |
| **Database** | Supabase (leaderboard only) |
| **Testing** | Vitest, React Testing Library, jsdom |
| **CI/CD** | GitHub Actions, semantic-release, ESLint, Prettier |
| **PWA** | vite-plugin-pwa, Workbox, service worker caching |
| **Deploy** | Vercel (SPA with client-side routing) |

<br />

---

## 🤝 Contributing

Contributions of all sizes are welcome — bug fixes, features, translations, documentation.

<table>
  <tr>
    <td>
      <h4>🐛 <strong>Found a bug?</strong></h4>
      <p><a href="https://github.com/alimaandev/corun/issues/new?labels=bug&template=bug_report.yml">Open a bug report</a></p>
    </td>
    <td>
      <h4>💡 <strong>Have an idea?</strong></h4>
      <p><a href="https://github.com/alimaandev/corun/issues/new?labels=enhancement&template=feature_request.yml">Submit a feature request</a></p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>👋 <strong>First time?</strong></h4>
      <p>Check <a href="https://github.com/alimaandev/corun/labels/good%20first%20issue">good first issues</a> to get started.</p>
    </td>
    <td>
      <h4>📖 <strong>Read the guide</strong></h4>
      <p>See <a href="CONTRIBUTING.md">CONTRIBUTING.md</a> for full details.</p>
    </td>
  </tr>
</table>

<br />

---

## 💖 Sponsors

If you enjoy Corun, consider supporting the project:

<p align="center">
  <a href="https://github.com/sponsors/alimaandev">
    <img src="https://img.shields.io/badge/GitHub_Sponsors-0a0a0a?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Sponsors" />
  </a>
  <a href="https://ko-fi.com/ali_sher">
    <img src="https://img.shields.io/badge/Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi" />
  </a>
</p>

<br />

---

## 📜 License

MIT © [Ali Sher](https://github.com/alimaandev)

<p align="center">
  <sub>Built with ❤️ using React · TypeScript · Three.js · Vite</sub>
  <br />
  <sub><em>"Every line of code brought you home."</em></sub>
</p>
