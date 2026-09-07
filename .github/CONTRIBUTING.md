# Contributing to Corun

Thanks for your interest in improving Corun! All contributions — bug fixes, features, documentation, translations — are welcome.

## Quick Start

```bash
git clone https://github.com/alimaandev/corun.git
cd corun
npm install
npm run dev
```

Visit `http://localhost:3000`. No account needed — the game creates a local profile in IndexedDB automatically.

## Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build (`tsc -b && vite build`) |
| `npm run typecheck` | TypeScript type checking (`tsc -b`) |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier auto-format |

## Project Structure

```
src/
├── game/           Core game logic, 52 puzzles, audio engine
├── components/
│   ├── three/      3D components (terminal scene, chamber, particles)
│   ├── *.tsx       React components (UI, HUD, modals, screens)
├── lib/            Storage (Dexie), outbox, leaderboard, profile, i18n, focus trap
├── pages/          Route-level pages (landing)
└── main.tsx + App.tsx
```

See the full structure in [README.md](./README.md) or run `npm run dev` and open the app.

## Coding Standards

- **Fonts**: Poppins (headings 600-800), Roboto (body 300-500), JetBrains Mono (code)
- **Colors**: `#F0EBE3` (beige), `#769826` (dark green), `#0a0a0a` (background)
- **Style**: Inline React `style` objects — no CSS modules or styled-components
- **Three.js**: `@react-three/fiber` Canvas. No `@react-three/postprocessing` — all glow is sprite/canvas-based
- **i18n**: Add strings to `src/lib/i18n.ts` for all 3 locales (EN/ES/FR)

## Pull Requests

1. Fork the repo and create a branch from `main`.
2. Make focused changes — one feature/fix per PR.
3. Run the checks:
   ```bash
   npm run typecheck
   npm run test
   npm run lint
   npm run build
   ```
4. Open a PR with a clear title and description.
5. CI must pass before merging.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): description
fix(scope): description
docs: description
chore: description
```

Examples: `feat(runner): add collision detection`, `fix(editor): prevent crash on empty template`.

## Issue Labels

| Label | Purpose |
|-------|---------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `gameplay` | Game mechanics or balance |
| `polish` | Visual/UI refinement |
| `performance` | Optimization or memory |
| `accessibility` | a11y improvements |
| `i18n` | Translation or locale |
| `good first issue` | Beginner-friendly tasks |
| `help wanted` | Needs maintainer attention |

## Code of Conduct

Please note that this project adheres to the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.
