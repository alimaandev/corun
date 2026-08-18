<div align="center">

# ⚡ CORUN
## *Write code. Fight monsters. Escape alive.*

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://corun-zeta.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/alimaandev/corun?style=for-the-badge&logo=github&logoColor=white)](https://github.com/alimaandev/corun)
[![MIT License](https://img.shields.io/badge/MIT_LICENSE-0a0a0a?style=for-the-badge&color=gray)](https://github.com/alimaandev/corun/blob/main/LICENSE)

</div>

---

## 🎯 The Problem You've Ignored

You've learned JavaScript a hundred times. Read tutorials. Built projects. Solved LeetCode. But **nothing** makes your fingers move like real stakes.

Most "coding games" are broken:
- **Trivia** masquerading as code
- **Drag-and-drop** nonsense  
- **Fake problems** that don't matter
- **No consequences** = no motivation

Corun is different.

---

## 💥 What You Get

### **Real JavaScript. Real Pressure. Real Feedback.**

```
You wake up in a Tokyo cell.
A monster is breaking through the wall.
The only way out is to code.
```

Write actual JavaScript in a live editor while:
- ✅ **Dodge attack patterns** in a pixel-art side-view platformer
- ✅ **Solve 52 real coding challenges** (strings, arrays, objects, regex, algorithms)  
- ✅ **Fight The Warden** — a boss who doesn't pause while you type
- ✅ **Chase a 4× combo multiplier** in endless procedural arenas
- ✅ **Compete on the daily leaderboard** (one shot, global ranking)

**No tutorials. No hand-holding. Just you, your code, and the clock.**

<p align="center">
  <img src="public/demo.gif" alt="Corun — dodge, code, survive" width="100%" style="max-width:720px; border-radius:16px; border:2px solid #7C3AED; margin:40px 0;" />
</p>

---

## 🚀 Why Developers Love It

| Feature | What You Get |
|---------|-------------|
| **📖 Story Mode + Boss Fight** | A 4-node narrative campaign. The Warden is brutal — orbs, rain, ground waves — *all while you type*. |
| **🏃 Endless Run (Free Play)** | Procedurally generated arenas. Questions pop by distance. Chain correct answers → fire combo → 4× multiplier. |
| **⚡ Speed Run & Survival** | 60-second countdown or 3-life hardcore mode. Pick your pressure. |
| **🗓️ Daily Challenge** | One fixed pool per day. Global leaderboard. Your name at the top. |
| **📱 Offline-First PWA** | Works anywhere. Precached assets. Plays offline. Install it. Own it. |
| **💾 Local-First Persistence** | Your scores, badges, progress live in IndexedDB. Outbox queue = no data loss. |
| **🌐 i18n** | English, Spanish, French. Auto-detected. Persist choice. |
| **🎵 Procedural Soundtrack** | Web Audio synthesis. Zero audio files. Music scales with your progress. |
| **🛠️ User-Generated Puzzles** | Built-in editor. Share via URL. Browse community challenges. |

---

## 📊 The Numbers

- **52** real code puzzles (ES6+, regex, algorithms)
- **36** story-mode coding tasks with hidden test cases
- **176** quick-fire runner challenges across modes
- **4** game modes (story, freeplay, speedrun, survival, daily)
- **3** languages (EN, ES, FR)
- **0** backend servers
- **148** unit tests / **21** test suites
- **97.4%** TypeScript (type-safe from day one)

---

## 🎮 Game Modes at a Glance

### **📖 Story Mode: The Warden Campaign**
Four narrative nodes — **The Cell** (strings), **The Vents** (arrays/loops), **The Core** (objects/functions), **The Warden** (algorithms).

Each node is a split-screen battlefield:
- Left: pixel-art side-view world  
- Right: live code editor  
- No pause. No mercy.

Defeat The Warden = beat 12 final boss tasks while dodging his orb, rain, and shockwave attacks.

### **🏃 Endless Run (Free Play)**
Escape a procedurally generated 2D side-view world. Pits. Drones. Hazards. Questions pop by distance.

**Speed chain → combo fire → damage multiplier (up to 4×).**

Every ~80 pts: bonus lightning round (5 sec, 2× points)  
Every ~150 pts: boss battle (hard questions, big rewards)

### **⚡ Speed Run & ❤️ Survival**
- **Speed Run**: 60-second timer. Wrong answer = penalty. How many can you solve?
- **Survival**: 3 lives. Every miss = 1 life. Difficulty scales up as you survive.

### **🗓️ Daily Challenge**
One global pool per day. One chance. One score. Seeded randomization = fair play.

Compete against players worldwide. Top scores appear on the leaderboard. Come back tomorrow for a fresh challenge.

---

## 🔧 Built for Developers, by Developers

### **Tech Stack**
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite 6 |
| Game Engine | Canvas 2D + custom physics (coyote time, jump buffer, parallax) |
| Rendering | Three.js + @react-three/fiber (menu ambiance) |
| Storage | Dexie 4 (IndexedDB v3) + outbox queue + localStorage migration |
| Audio | Web Audio API (procedural synthesis, zero .mp3/.wav files) |
| Testing | Vitest + React Testing Library + jsdom (148 tests) |
| PWA | vite-plugin-pwa + Workbox + build.json stale detection |
| Monitoring | Sentry (opt-in) |
| CI/CD | GitHub Actions (semantic-release automation) |
| Deploy | Vercel (sub-second edge cache) |

### **Why This Architecture?**

**Local-First by Design**
- No backend. No auth vendor. No external database.
- IndexedDB (Dexie v3) stores profiles, scores, badges, story progress, settings.
- Outbox queue handles offline writes with exponential backoff retry.
- Migrations auto-upgrade legacy localStorage → v3 schema.
- Nothing is ever lost, even offline.

**Smart Deployment**
- `build.json` fingerprint auto-detects when a new build is live.
- Tab focus + boot: re-check. Only reload if truly new.
- Result: players never get half-updated bundles.

**Sandboxed Code Evaluation**
- User code runs in a Web Worker, not the main thread.
- Infinite loops, crashes, malicious code = isolated.
- Main thread stays 60 FPS during chaos.

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/alimaandev/corun.git
cd corun
npm install

# Dev mode
npm run dev           # → http://localhost:3000

# Quality gates
npm run typecheck     # strict TypeScript (tsc -b)
npm run lint          # ESLint + Prettier
npm run test          # vitest run (148 tests)

# Production build
npm run build         # → dist/ (Vite optimized)
```

**No setup ceremony. No `.env` files. No database migrations.**

Play guest mode immediately. All progress syncs to your browser's IndexedDB. Refreshing the page = you pick up where you left off (up to 2 hours).

> **[▶ Play Live →](https://corun-zeta.vercel.app)**

---

## 💡 Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    React App                        │
│  ┌──────────────────────────────────────────────┐   │
│  │         Game Mode Hooks                      │   │
│  │  (story · freeplay · speedrun · survival)   │   │
│  └──────────────────────────────────────────────┘   │
└────────┬──────────────────────────────────┬─────────┘
         │                                  │
    ┌────▼────────────────┐        ┌───────▼────────────┐
    │  Game Engine        │        │ Storage Layer      │
    │  (framework-free)   │        │  (Dexie + Outbox)  │
    │                     │        │                    │
    │ • Physics           │        └───────┬────────────┘
    │ • Parallax          │                │
    │ • Particles         │         ┌──────▼──────┐
    │ • Boss AI           │         │  IndexedDB  │
    │ • Puzzle Engine     │         └─────────────┘
    │ • Score/Combos      │
    └────┬────────────────┘
         │
    ┌────▼──────────┐
    │ Sandbox       │
    │ Web Worker    │
    │               │
    │ Code Eval     │
    │ Infinite Loop │
    │ Protection    │
    └───────────────┘
```

**Everything is decoupled**: game engine is framework-free, storage is pluggable, code eval is sandboxed.

---

## 📈 Releases & Automation

Releases are **100% automated** via [semantic-release](https://github.com/semantic-release/semantic-release).

Merge a PR to `main` with `feat` or `fix` commits:

1. **Build** → Vercel deploys the commit
2. **Release** → semantic-release tags it, generates changelog, publishes to GitHub Releases
3. **Live** → Your code is world-facing in under 60 seconds

| Version | Date | Highlights |
|---------|------|-----------|
| **v1.15.0** | 2026-08-14 | Polish — 60Hz fixed timestep, story SFX, i18n (EN/ES/FR) |
| **v1.13.0** | 2026-08-14 | **The Warden** boss fight — dodge patterns, continuous mode |
| **v1.12.0** | 2026-08-14 | Split-screen editor + 36 story tasks with hidden tests |
| **v1.11.0** | 2026-08-14 | Story campaign — The Cell, Vents, Core, Warden |
| **v1.10.0** | 2026-08-14 | 2D side-view engine — physics, parallax, particles, shake, combo |

---

## 🌟 Why Corun Stands Out

### vs. LeetCode
**LeetCode**: Isolated problems, no narrative, stress without reward  
**Corun**: Real stakes, story context, enemies that punish hesitation

### vs. Coding Game Clones
**Clones**: Multiple-choice or drag-drop  
**Corun**: Type actual code. Errors cost you health. Speed counts.

### vs. Tutorials + Courses
**Courses**: Passive. You read. You forget.  
**Corun**: Active. You code. You dodge. You win. Neurons fire.

---

## 🎯 For Teams & Educators

**Use Corun to:**
- 🏫 Teach ES6+ in a game context (story mode demonstrates real patterns)
- 🧑‍💼 Onboard junior devs with a memorable learning curve
- 🏆 Run tournament-style internal competitions (leaderboard mode)
- 💪 Test interview candidates under pressure (speedrun + survival)

Customizable challenge editor = your puzzles, your rules.

---

## 🤝 Contributing

We're always open to:
- **Bug fixes** → [File a bug report](https://github.com/alimaandev/corun/issues/new?labels=bug&template=bug_report.yml)
- **Features** → [Request a feature](https://github.com/alimaandev/corun/issues/new?labels=enhancement&template=feature_request.yml)
- **Translations** → Help us reach EN/ES/FR and beyond
- **Puzzle Design** → Contribute story tasks or quick-fire challenges
- **Good First Issues** → [Start here](https://github.com/alimaandev/corun/labels/good%20first%20issue)

**PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/)** — they power automated releases. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📊 Star History

<p align="center">
  <a href="https://star-history.com/#alimaandev/corun&Date">
    <img src="https://api.star-history.com/svg?repos=alimaandev/corun&type=Date" alt="Star History Chart" width="100%" style="max-width:600px" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/alimaandev/corun">
    <img src="https://img.shields.io/badge/⭐_STAR_ON_GITHUB-7C3AED?style=for-the-badge&logo=github&logoColor=white" alt="Star on GitHub" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=🏃%20CORUN%20—%20Escape%20the%20monster.%20Write%20JavaScript.%20No%20tutorial%2C%20no%20pause.%20Pixel-art%20side-view%20platformer%20meets%20coding%20challenges.%20Play%20now.&url=https://corun-zeta.vercel.app&hashtags=gamedev,javascript,coding">
    <img src="https://img.shields.io/badge/🔁_SHARE_ON_X-000000?style=for-the-badge&logo=x&logoColor=white" alt="Share on X" />
  </a>
  <a href="https://news.ycombinator.com/submitlink?u=https://corun-zeta.vercel.app&t=CORUN%20—%20A%202D%20Pixel-Art%20Coding%20Game%20with%20Real%20JavaScript">
    <img src="https://img.shields.io/badge/📮_POST_ON_HN-FF6600?style=for-the-badge&logo=ycombinator&logoColor=white" alt="Post on Hacker News" />
  </a>
</p>

---

## 📜 License

MIT © [Ali Sher](https://github.com/alimaandev)

<div align="center">

**_Every line of code brought you home._**

Built with React · TypeScript · Dexie · Web Audio · Canvas 2D · Vite

[Play Now](https://corun-zeta.vercel.app) • [GitHub](https://github.com/alimaandev/corun) • [Issues](https://github.com/alimaandev/corun/issues)

</div>
