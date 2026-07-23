# 1.0.0 (2026-07-23)


### Bug Fixes

* dt calc, lane smoothing, canvas flash, scroll guard, remove dead code ([f76f407](https://github.com/alimaandev/corun/commit/f76f4078445ed128f18e0f5f968d3fa1d2ba405a))


### Features

* mobile touch controls, responsive canvas, daily challenges, leaderboard, clip recording, 100 challenges ([5e9c3e4](https://github.com/alimaandev/corun/commit/5e9c3e40eca2c61f470a38f84e22bc33e6e799bb))

# Changelog

All notable changes to Corun will be documented in this file.

## [1.0.0] — 2026-07-23

### Added
- Story Mode — 9 themed levels with NPC interactions, cutscenes, and code puzzles
- Freeplay / Endless Mode — 3-lane runner with adaptive challenges, combos, boss battles
- Daily Challenges — one attempt per day with leaderboard scoring
- Auth0 authentication (login / register)
- Supabase leaderboard backend
- Canvas recording and replay
- Dark pixel-art aesthetic with isometric and side-scrolling views

### Technical
- React 18 + TypeScript + Vite 6
- Three.js / @react-three/fiber for 3D scenes
- HTML5 Canvas for pixel rendering
- Lenis smooth scrolling on landing page
- Split chunks (Three.js separated for performance)
