<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Canvas-FF6F00?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</div>

<br />

<div align="center">
  <h1>🏃 CORUN</h1>
  <h3>ESCAPE THE MONSTER</h3>
  <p><em>A pixel-art coding adventure — story mode + endless runner.</em></p>
</div>

<br />

## ✦ Overview

**CORUN** is a 2D pixel-art coding game with two modes:

| Mode | Description |
|------|-------------|
| **Story Mode** | Walk through 9 themed levels as a pixel character, interact with NPCs, solve real JavaScript code puzzles to unlock the path, and experience a narrative with cutscenes. |
| **Freeplay / Endless** | Classic auto-runner on a 3-lane highway. Dodge a chasing monster by answering programming challenges. Speed increases, combos stack, boss battles test your skills. |

```
┌─────────────────────────────────────────┐
│                                         │
│  STORY MODE                             │
│                                         │
│   ┌─────────────────────────┐           │
│   │  [NPC]        [CODE]    │           │
│   │       🧑──►──⚡         │           │
│   │                     🚪  │           │
│   │  ═══════════════════    │           │
│   └─────────────────────────┘           │
│   Walk · interact · solve · escape      │
│                                         │
│  FREEPLAY MODE                          │
│   ┌────┐                                │
│   │ 👾 │  ← MONSTER                     │
│   └────┘                                │
│   ════════ ════════ ════════  ← 3 lanes│
│   ┌────┐                                │
│   │ 🏃 │  ← YOU                         │
│   └────┘                                │
│                                         │
└─────────────────────────────────────────┘
```

<br />

## ✦ Story Mode — 9 Levels

Navigate a 2D side-scrolling world. Move left/right with arrow keys, press **E** to interact with glowing terminals and NPCs.

| # | Level | Theme | Puzzle |
|---|-------|-------|--------|
| 1 | **Escape the Prison** | Dark prison walls, torches | `if` statements, guard patrol logic |
| 2 | **The Sewers** | Green-lit pipes, toxic air | Loops, array filtering |
| 3 | **The Forest** | Tall trees, hidden paths | String manipulation, recursion |
| 4 | **The Village** | Warm huts, suspicious villagers | Object manipulation, data transformation |
| 5 | **The Bandit Camp** | Tents, campfires | Sorting algorithms, comparison |
| 6 | **The Mountain Pass** | Rocky cliffs, bridges | Math utilities, coordinate geometry |
| 7 | **The Fortress Walls** | Guard towers, portcullis | Stack/queue logic, validation |
| 8 | **The Throne Room** | Grand hall, king's court | State machines, complex conditions |
| 9 | **The Final Escape** | Collapsing castle | Everything combined + final boss |

Each level contains:
- **2 code puzzles** — write real JavaScript in a retro terminal overlay, `new Function()` sandbox evaluates your answer
- **NPC interactions** — guards, wardens, forest spirits, villagers, bandits, stone guardians, commanders, king, and elena
- **Cutscenes** — intro/outro with typed dialogue, screen effects (shake, flash, fade), torch flicker
- **Exit zones** — reach the end to progress

After beating all 9 levels, an **ending cutscene** plays followed by a credits overlay.

<br />

## ✦ Freeplay / Endless Mode

The original arcade experience: control a runner on a 3-lane highway while being chased by a scaling monster.

### Features

| Feature | Description |
|---------|-------------|
| **Real-time Coding** | Challenges pop up mid-run — answer fast or the monster closes in |
| **4 Question Types** | Multiple choice, fill-in-the-blank, output prediction, spot the bug |
| **Adaptive Difficulty** | 3 correct = harder, 2 wrong = easier |
| **Combo Multiplier** | 3+ streak → 1.5x, 5+ → 2x, 7+ → 3x, 10+ → 4x score |
| **Boss Battles** | Every ~150 pts — coding bosses with hard questions, big rewards |
| **Bonus Rounds** | Every ~80 pts — 5-second lightning round, 2x points |
| **Daily Challenges** | One shot per day, compare via leaderboard |
| **Mastery Badges** | 5+ correct in a topic = badge on game-over screen |
| **Monster Proximity** | Grows, glows redder, screen pulses as gap shrinks |
| **Screen Recording** | Built-in canvas recording, save/share your runs |

<br />

## ✦ Controls

### Story Mode

| Key | Action |
|-----|--------|
| `←` / `→` | Move left / right |
| `E` | Interact with terminal / NPC |
| `Enter` | Advance dialogue |

### Freeplay Mode

| Key | Action |
|-----|--------|
| `←` / `A` | Move left lane |
| `→` / `D` | Move right lane |
| `Swipe` (mobile) | Swipe or tap sides |
| `1` – `4` | Select answer |
| `Enter` | Start / Restart |
| `Type & Submit` | Fill-in-the-blank answers |

<br />

## ✦ Tech Stack

```
Frontend   │ React 18 · TypeScript · Vite 6 · HTML5 Canvas
Auth       │ Auth0 (hosted Universal Login)
State      │ React hooks + localStorage
Storage    │ localStorage (progress, leaderboard) · IndexedDB (clips)
Fonts      │ Press Start 2P · JetBrains Mono
Deploy     │ Vercel (SPA)
```

<br />

## ✦ Project Structure

```
src/
├── game/
│   ├── PixelRunner.tsx      — Endless runner game loop (3-lane, monster, challenges)
│   ├── sceneEngine.tsx      — 2D adventure engine (walk, NPC patrol, triggers)
│   ├── sceneCanvas.tsx      — Cutscene renderer (typed dialogue, effects, sprites)
│   ├── codeTerminal.tsx     — In-game code editor (textarea, sandbox eval, feedback)
│   ├── codePuzzles.ts       — 18 story-mode coding puzzles + evaluateCode sandbox
│   ├── levelScenes.ts       — 9 level 2D layouts (ground, walls, NPCs, triggers)
│   ├── levels.ts            — All 9 level configs + ENDING_SCENE + progress helpers
│   ├── themes.ts            — 9 visual themes (sky, ground, road, scenery, particles)
│   ├── sprites.ts           — 10 NPC pixel-art drawing functions
│   ├── challenges.ts        — 17 built-in challenges, daily challenge, leaderboard
│   └── types.ts             — Shared TypeScript types
├── components/
│   ├── Game.tsx             — Screen state machine, routing, auth integration
│   ├── ChallengeModal.tsx   — Question UI (4 types)
│   ├── HUD.tsx              — Score bar, gap meter, streak display
│   ├── LevelSelect.tsx      — Level grid with lock/star/replay states
│   ├── StartScreen.tsx      — Mode select, topic/difficulty, leaderboard
│   ├── GameOverScreen.tsx   — Final score, badges, saved clips
│   ├── PixelBackground.tsx  — Animated pixel-art landscape
│   └── ProtectedRoute.tsx   — Auth0 route guard
├── pages/
│   ├── LandingPage.tsx      — Marketing homepage with parallax hero
│   ├── LoginPage.tsx        — Auth0 login redirect
│   └── RegisterPage.tsx     — Auth0 signup redirect
├── main.tsx                 — Entry point + Auth0Provider
├── App.tsx                  — Router setup
└── index.css                — Global styles & animations
```

<br />

## ✦ Getting Started

```bash
# Clone & install
git clone https://github.com/alimaandev/corun.git
cd corun
npm install

# Set up Auth0
cp .env.example .env
# Edit .env with your Auth0 domain and client ID

# Run dev server
npm run dev
```

Open `http://localhost:3000`.

<br />

## ✦ Build

```bash
npm run build    # Output → dist/
```

The production build uses `tsc -b && vite build` for type-checking before bundling.

<br />

## ✦ Auth0 Setup

1. Create an application at [manage.auth0.com](https://manage.auth0.com) → **Single Page Application**
2. Add to **Allowed Callback URLs**:
   ```
   http://localhost:3000/game, https://your-app.vercel.app/game
   ```
3. Add to **Allowed Logout URLs**:
   ```
   http://localhost:3000, https://your-app.vercel.app
   ```
4. Copy your **Domain** and **Client ID** into `.env`:
   ```
   VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   ```

<br />

## ✦ Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set these environment variables in Vercel:

| Variable | Value |
|----------|-------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | Your Auth0 client ID |

<br />

## ✦ Screenshots

<!--
TODO: Add screenshots here
| Landing | Story Mode | Freeplay |
|---------|-----------|----------|
| ![Landing](.github/screenshots/landing.png) | ![Story](.github/screenshots/story.png) | ![Freeplay](.github/screenshots/freeplay.png) |
-->

<br />

## ✦ License

MIT © [alimaandev](https://github.com/alimaandev)
