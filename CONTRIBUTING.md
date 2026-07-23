# Contributing to Corun

Thanks for your interest! This is a solo project by Ali Sher, but issues and pull requests are welcome.

## Getting Started

1. Fork the repo.
2. Run `npm install`.
3. Start the dev server with `npm run dev`.

## Project Structure

```
src/
  components/     React components (UI + 3D)
  game/           Core game logic, challenges, levels, sprites
  hooks/          Custom React hooks
  lib/            Supabase client, leaderboard
  pages/          Route-level pages (Login, Register, Landing)
  utils/          Shared utilities
```

## Coding Standards

- **Fonts**: Poppins for headings (600-800), Roboto for body (300-500), JetBrains Mono for code only.
- **Colors**: `#F0EBE3` (beige), `#769826` (dark green), `#0a0a0a` (background). No cyan, red, or gold in UI.
- **Style**: Inline styles via React `style` objects — no CSS modules or styled-components.
- **Three.js**: Use `<Canvas>` from `@react-three/fiber`. No `@react-three/postprocessing` (glow is sprite-based).

## Pull Requests

- Run `tsc -b && npx vite build` before submitting.
- Keep changes focused — one feature/fix per PR.
- Match the existing code style (no semicolons where the project skips them, etc.).

## Reporting Issues

Open a GitHub issue with:
- A clear title and description.
- Steps to reproduce if it's a bug.
- Screenshots or console output if relevant.
