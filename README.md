Corun

> A 2D pixel-art endless runner where coding knowledge is your only weapon.

A monster is chasing you through a neon-pixel highway. Answer programming challenges correctly to stay ahead — one wrong answer and it closes in.

## Gameplay

- **3-lane road** — use `←`/`→` or `A`/`D` to switch lanes
- **Coding challenges** pop up periodically (multiple choice, fill-in-the-blank, output prediction, spot the bug)
- **Correct answer** = gap boost, monster falls back
- **Wrong answer / timeout** = gap shrinks, monster closes in
- **Gap hits zero** = game over

### Question types

| Type | Description |
|------|-------------|
| Multiple choice | Pick the right answer from 4 options (keys 1-4) |
| Fill-in-the-blank | Type the missing code, click Submit |
| Output prediction | Read the code, predict what it prints |
| Spot the bug | Find the error in the given snippet |

### Features

- **57 challenges** across JavaScript, Python, Web, Databases, Algorithms, and General CS
- **Adaptive difficulty** — 3 correct in a row = harder questions, 2 wrong = easier
- **Combo multiplier** — streak 3+ → 1.5x, 5+ → 2x, 7+ → 3x, 10+ → 4x score
- **Boss battles** every ~150 points — rapid-fire hard questions against Syntax Error, Null Pointer, and more
- **Bonus rounds** every ~80 points — 5-second lightning round with 2x points
- **Topic mastery badges** — 5+ correct in any topic unlocks a badge on game-over
- **Monster proximity** — scales up and glows redder as the gap shrinks, with a pulsing vignette warning

## Controls

| Key | Action |
|-----|--------|
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| `1`-`4` | Select answer |
| `Enter` | Start / Restart |

## Tech Stack

- **Engine** — HTML5 Canvas (React component)
- **Language** — TypeScript
- **Framework** — React 19
- **Build** — Vite
- **Font** — Press Start 2P (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Project Structure

```
src/
├── game/
│   ├── PixelRunner.tsx      — Canvas game loop, player/monster drawing, lane logic
│   ├── challenges.ts        — 57 challenges, challenge selection
│   ├── types.ts             — Shared types (Difficulty, Topic, QuestionType, etc.)
│   ├── ThreeGame.tsx        — Legacy (kept for reference)
│   └── renderer.ts          — Canvas rendering utilities
├── components/
│   ├── Game.tsx             — Screen state machine, boss/bonus/combo logic
│   ├── ChallengeModal.tsx   — Question UI (all 4 types)
│   ├── HUD.tsx              — Score, gap meter, streak display
│   ├── StartScreen.tsx      — Topic/difficulty selection
│   ├── GameOverScreen.tsx   — Final score + badges
│   ├── PixelBackground.tsx  — Animated pixel-art background scene
│   └── GameCanvas.tsx       — Legacy (kept for reference)
└── index.css                — Animations, base styles, Press Start 2P
```
