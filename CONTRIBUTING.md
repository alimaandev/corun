# 🤝 Contributing to Corun

Thanks for your interest! All contributions are welcome — bug fixes, features, translations, documentation, and more.

> **First time contributing to open source?** We've got you. This guide walks you through every step.

<br />

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [First Time? Start Here](#-first-time-start-here)
- [Development Workflow](#-development-workflow)
- [Project Architecture](#-project-architecture)
- [Coding Standards](#-coding-standards)
- [Pull Request Checklist](#-pull-request-checklist)
- [Commit Guidelines](#-commit-guidelines)
- [Where to Get Help](#-where-to-get-help)

<br />

---

## 🚀 Quick Start

```bash
# 1. Fork the repo
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/corun.git
cd corun

# 3. Install dependencies
npm install

# 4. Start developing
npm run dev        # → http://localhost:3000

# 5. Run checks before submitting
npm run typecheck
npm run test
npm run lint
npm run build
```

> **No Auth0 account needed.** The game auto-detects missing env vars and falls back to guest/demo mode.

<br />

---

## 👋 First Time? Start Here

### 1. Find an issue

Look for issues labeled [`good first issue`](https://github.com/alimaandev/corun/labels/good%20first%20issue) — these are beginner-friendly tasks with clear scope.

No issue catching your eye? Feel free to open a [new one](https://github.com/alimaandev/corun/issues/new).

### 2. Set up your environment

```bash
npm install          # Installs all dependencies + Husky hooks
npm run dev          # Opens the game locally
```

The dev server runs on port 3000 with hot module replacement.

### 3. Make your change

- Create a branch from `main`: `git checkout -b fix/my-bug`
- Make focused changes — one feature or fix per branch
- Follow the [coding standards](#-coding-standards) below

### 4. Run the checks

```bash
npm run typecheck    # TypeScript must pass
npm run test         # All tests must pass
npm run lint         # No ESLint errors
npm run build        # Production build must succeed
```

### 5. Submit a PR

Push your branch and open a [pull request](https://github.com/alimaandev/corun/compare) against `main`. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

<br />

---

## 🔧 Development Workflow

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000, HMR) |
| `npm run build` | Production build (`tsc -b && vite build`) |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run all Vitest tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier auto-format |

<br />

---

## 🏗️ Project Architecture

```
src/
├── game/          Core game logic — runner, puzzles, audio, levels
├── components/
│   ├── three/     3D React components (editor, player, NPC, environment)
│   └── *.tsx      UI components (HUD, modals, screens)
├── lib/           Auth, i18n, focus trap
├── pages/         Route-level pages (landing, login, register)
├── main.tsx       App entry point
├── App.tsx        Router + global components
└── index.css      Global styles
```

Key files to know:

| File | What it does |
|------|-------------|
| `src/components/Game.tsx` | Main screen state machine — routes between start, playing, game-over |
| `src/game/PixelRunner.tsx` | Endless runner game loop (3 lanes, monster, challenges) |
| `src/components/Scene3D.tsx` | 3D story mode Canvas with lighting, camera, scene orchestration |
| `src/game/codePuzzles.ts` | 52 puzzles + sandbox evaluator (`evaluateCode()`) |
| `src/game/audio.ts` | Procedural soundtrack engine (Web Audio API) |
| `src/game/levels.ts` | Level configs, progress (localStorage), star calculation |
| `src/lib/i18n.ts` | Translation system (EN, ES, FR) |
| `src/components/PuzzleEditor.tsx` | User-generated content creation form |
| `src/game/puzzleShare.ts` | UGC base64 encode/decode + localStorage CRUD |

<br />

---

## 📐 Coding Standards

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0a` | Page / canvas backgrounds |
| Text | `#F0EBE3` | Headings, body, labels |
| Accent | `#769826` | Dark green — success, highlights |

No cyan, red, or gold in the UI chrome.

### Fonts

| Font | Weight | Usage |
|------|--------|-------|
| **Poppins** | 600—800 | Headings, titles |
| **Roboto** | 300—500 | Body text, labels, buttons |
| **JetBrains Mono** | 400—700 | Code editor only |

### Style Rules

- **Inline styles** — All styling via React `style={}` objects. No CSS modules, no styled-components.
- **Three.js** — Use `@react-three/fiber` `<Canvas>`. No `@react-three/postprocessing` — glow is canvas-texture based.
- **i18n** — Add new strings to `src/lib/i18n.ts` in all 3 locales (EN → ES → FR).
- **Components** — One component per file. Default export. Props interface above the function.

### Branch Naming

```
fix/description    — Bug fixes
feat/description   — New features
refactor/...       — Code restructure
docs/...           — Documentation
chore/...          — Tooling, CI, dependencies
```

<br />

---

## ✅ Pull Request Checklist

Before submitting, make sure:

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run test` passes (all Vitest tests)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] `npm run build` passes (Vite production build succeeds)
- [ ] Changes are focused — one feature/fix per PR
- [ ] Commit messages follow [Conventional Commits](#-commit-guidelines)
- [ ] Screenshots added if UI changed
- [ ] Tests added or updated if logic changed

> PRs that don't pass CI will not be merged.

<br />

---

## ✍️ Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(editor): add syntax highlighting for numbers
fix(runner): prevent crash on 0-score game-over
docs(readme): add quick-start section
chore(deps): bump three.js to 0.185
```

**Types:** `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`

**Scopes:** `runner`, `scene`, `editor`, `puzzles`, `audio`, `hud`, `i18n`, `pwa`, `deps`, `readme`

<br />

---

## 💬 Where to Get Help

- **Issues** — [GitHub Issues](https://github.com/alimaandev/corun/issues) for bugs and feature requests
- **Discussions** — [GitHub Discussions](https://github.com/alimaandev/corun/discussions) for questions and ideas
- **Email** — ali.sher@example.com for maintainer contact

<br />

---

## 📜 Code of Conduct

Please note that this project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.

<br />

---

<p align="center">
  <sub>Thanks for contributing to Corun 🏃</sub>
  <br />
  <sub><em>"Every line of code brought you home."</em></sub>
</p>
