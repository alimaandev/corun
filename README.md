<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</div>

<br />

<div align="center">
  <h1>🏃 CORUN</h1>
  <h3>ESCAPE THE MONSTER</h3>
  <p><em>A retro pixel-art endless runner where coding knowledge is your only weapon.</em></p>
</div>

<br />

<!-- TODO: Add screenshot
![Gameplay Screenshot](.github/screenshots/gameplay.png)
-->

<br />

## ✦ Overview

**CORUN** transforms coding practice into an arcade experience. You control a runner on a 3-lane highway while a monster chases you. Answer programming challenges correctly to stay ahead — one wrong answer and it closes in.

```
┌─────────────────────────────────────────┐
│                                         │
│   ←/A  →/D          1-4 to answer      │
│   ┌────┐                                │
│   │ 👾 │  ← MONSTER (grows as gap       │
│   └────┘       gets smaller)            │
│                                         │
│   ════════ ════════ ════════  ← 3 lanes │
│                                         │
│   ┌────┐                                │
│   │ 🏃 │  ← YOU                         │
│   └────┘                                │
│                                         │
│   SCORE: 1,240   GAP: 42m   SPD: 1.0x  │
└─────────────────────────────────────────┘
```

<br />

<!-- TODO: Add feature screenshots
![Features](.github/screenshots/features.png)
-->

## ✦ Features

| Feature | Description |
|---------|-------------|
| **Real-time Coding** | Solve programming challenges while running from the monster. Every second counts. |
| **4 Question Types** | Multiple choice, fill-in-the-blank, output prediction, and spot the bug. |
| **Adaptive Difficulty** | 3 correct in a row = harder questions, 2 wrong = easier. The game adjusts to you. |
| **Combo Multiplier** | Streak 3+ → 1.5x, 5+ → 2x, 7+ → 3x, 10+ → 4x score multiplier. |
| **Boss Battles** | Every ~150 points, face a coding boss (Syntax Error, Null Pointer, etc.). Hard questions, big rewards. |
| **Bonus Rounds** | Every ~80 points, a 5-second lightning round with 2x points. |
| **Daily Challenges** | One shot per day. Compete against yourself and the leaderboard. |
| **Mastery Badges** | 5+ correct answers in any topic unlocks a badge shown on game-over. |
| **Screen Recording** | Built-in canvas recording to capture and share your best runs. |
| **Monster Proximity** | The monster scales up, glows redder, and the screen pulses as the gap shrinks. |

<br />

## ✦ Topics

```
General CS     JavaScript     Python
Web Dev        Databases      Algorithms
```

17 questions across all topics and difficulty levels (Easy / Medium / Hard).

<br />

## ✦ Controls

| Key | Action |
|-----|--------|
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| `Swipe` (mobile) | Swipe or tap sides to change lane |
| `1` – `4` | Select answer |
| `Enter` | Start / Restart |
| `Type & Submit` | Fill-in-the-blank answers |

<br />

## ✦ Tech Stack

```
Frontend   │ React 18 · TypeScript · Vite 6 · HTML5 Canvas
Auth       │ Auth0 (hosted Universal Login)
Storage    │ localStorage · IndexedDB (clips)
Fonts      │ Press Start 2P · JetBrains Mono
Deploy     │ Vercel (SPA)
```

<br />

## ✦ Getting Started

```bash
# Clone & install
git clone https://github.com/your-username/corun.git
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

## ✦ Project Structure

```
src/
├── game/
│   ├── PixelRunner.tsx      — Canvas game loop, player/monster drawing, lane logic
│   ├── challenges.ts        — 17 built-in challenges, daily challenge, leaderboard
│   └── types.ts             — Shared TypeScript types
├── components/
│   ├── Game.tsx             — Screen state machine, boss/bonus/combo logic
│   ├── ChallengeModal.tsx   — Question UI (all 4 types)
│   ├── HUD.tsx              — Score bar, gap meter, streak display
│   ├── StartScreen.tsx      — Topic/difficulty selection + leaderboard
│   ├── GameOverScreen.tsx   — Final score, badges, saved clips
│   ├── PixelBackground.tsx  — Animated pixel-art landscape background
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

## ✦ Screenshots

<!-- 
TODO: Add screenshots here

| Landing | Gameplay | Boss Battle |
|---------|----------|-------------|
| ![Landing](.github/screenshots/landing.png) | ![Game](.github/screenshots/gameplay.png) | ![Boss](.github/screenshots/boss.png) |
-->

<details>
<summary><b>Click to view placeholder layout</b></summary>

```
┌────────────────────────────────────────────────┐
│                                                │
│   [Insert: Landing Page Hero]                  │
│   [Insert: Feature Cards]                      │
│   [Insert: Gameplay / Challenge Modal]         │
│   [Insert: Boss Battle UI]                     │
│   [Insert: Game Over Screen]                    │
│                                                │
└────────────────────────────────────────────────┘
```

</details>

<br />

## ✦ License

MIT © [alimaandev](https://github.com/alimaandev)
