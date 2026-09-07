## [1.15.4](https://github.com/alimaandev/corun/compare/v1.15.3...v1.15.4) (2026-08-18)


### Bug Fixes

* prune unused i18n keys and translate start screen labels ([7ffde7c](https://github.com/alimaandev/corun/commit/7ffde7ca56f665883b7ad77ff33904391fac3735))

## [1.15.3](https://github.com/alimaandev/corun/compare/v1.15.2...v1.15.3) (2026-08-18)


### Bug Fixes

* resolve gameplay, HUD, persistence, i18n and modal bugs ([35784cc](https://github.com/alimaandev/corun/commit/35784ccb7542a3563dd1bae653e1b11951079b96))

## [1.15.2](https://github.com/alimaandev/corun/compare/v1.15.1...v1.15.2) (2026-08-14)


### Bug Fixes

* unignore health/health.log so the health check log is committed ([2e6c7b4](https://github.com/alimaandev/corun/commit/2e6c7b4622d27ced6bb21b39ab4f2b193e8b9028))

## [1.15.1](https://github.com/alimaandev/corun/compare/v1.15.0...v1.15.1) (2026-08-14)


### Bug Fixes

* health check switches to health branch before writing files ([f3f5cfd](https://github.com/alimaandev/corun/commit/f3f5cfdfa5f2058b5a841071728cd1aea67b7c59))

# [1.15.0](https://github.com/alimaandev/corun/compare/v1.14.0...v1.15.0) (2026-08-14)


### Features

* polish pass - 60hz sim, story sfx, story mode i18n ([8a375ed](https://github.com/alimaandev/corun/commit/8a375ed83027e561612c5f4b9d8a3a26ca88fedc))

# [1.14.0](https://github.com/alimaandev/corun/compare/v1.13.0...v1.14.0) (2026-08-14)


### Features

* migrate freeplay modes to the side-view engine ([ce19b74](https://github.com/alimaandev/corun/commit/ce19b747400dab3c3a0497a13b4818159885383f))

# [1.13.0](https://github.com/alimaandev/corun/compare/v1.12.0...v1.13.0) (2026-08-14)


### Features

* add warden boss fight with dodge patterns and continuous mode ([5786870](https://github.com/alimaandev/corun/commit/57868707902e7d04b64ee9b95c8f1c113e8e3464))

# [1.12.0](https://github.com/alimaandev/corun/compare/v1.11.0...v1.12.0) (2026-08-14)


### Features

* add story mode code editor with 36 verified tasks ([bc55e7f](https://github.com/alimaandev/corun/commit/bc55e7fc604119012c9375e1de535c0fdf1ed9cd))

# [1.11.0](https://github.com/alimaandev/corun/compare/v1.10.1...v1.11.0) (2026-08-14)


### Features

* add story mode campaign with level select and dialogue ([9661952](https://github.com/alimaandev/corun/commit/9661952f3c869556783d1c16ff1586aca07a2666))

## [1.10.1](https://github.com/alimaandev/corun/compare/v1.10.0...v1.10.1) (2026-08-14)


### Bug Fixes

* resolve strict build type errors in side engine ([19d97b0](https://github.com/alimaandev/corun/commit/19d97b032125f85fd93961fa154a1bae14d12888))

# [1.10.0](https://github.com/alimaandev/corun/compare/v1.9.0...v1.10.0) (2026-08-14)


### Features

* add 2D side-view engine core with parallax renderer ([44b3d15](https://github.com/alimaandev/corun/commit/44b3d153fed4fc4ec45e2891c4d6eaf467ecf3f9))

# [1.9.0](https://github.com/alimaandev/corun/compare/v1.8.0...v1.9.0) (2026-08-06)


### Features

* add 150 quick-fire challenges (JS, Python, TypeScript) ([a15d885](https://github.com/alimaandev/corun/commit/a15d885b76f1a7f16d8964ecfe8983230286a191))

# [1.8.0](https://github.com/alimaandev/corun/compare/v1.7.0...v1.8.0) (2026-08-06)


### Features

* redesign start screen as arcade mode cards ([4e596ee](https://github.com/alimaandev/corun/commit/4e596eed3fb0bc49bf29ecb7c768953758ba7811))

# [1.7.0](https://github.com/alimaandev/corun/compare/v1.6.0...v1.7.0) (2026-08-06)


### Features

* remove story mode entirely ([1ae8c45](https://github.com/alimaandev/corun/commit/1ae8c459a6db0ddafb2a4726d7dff98adbefb0fb))

# [1.6.0](https://github.com/alimaandev/corun/compare/v1.5.2...v1.6.0) (2026-08-04)


### Features

* 2D parallax story levels, mode hooks, app/ GamePage ([f9a60dd](https://github.com/alimaandev/corun/commit/f9a60ddda0a8405c4e89e0f0300c64413fa62a81))
* Dexie v2 storage migration, outbox journal, stale-chunk busting ([42e78e1](https://github.com/alimaandev/corun/commit/42e78e1cef48db5d42a49f9ae1730262438e32e8))
* extract pure game engine layer with full test coverage ([b8efecd](https://github.com/alimaandev/corun/commit/b8efecd2bfb1865b6fc608c3b89fcb9dc5addf93))
* resume last run from start screen, session persistence ([fb53312](https://github.com/alimaandev/corun/commit/fb5331219de42728ba552025d2a45a3e984763c3))


### Performance Improvements

* lazy-load remaining screen components in GamePage ([e8bce83](https://github.com/alimaandev/corun/commit/e8bce834b63258e12df35beee7d5c6e5b290ead7))

## [1.5.2](https://github.com/alimaandev/corun/compare/v1.5.1...v1.5.2) (2026-07-30)


### Bug Fixes

* dedup challenge IDs, unify audio context, adopt theme.ts tokens, remove dead clip code, extract resetGameState ([c5d9492](https://github.com/alimaandev/corun/commit/c5d9492733ee7f2bb8c016e7677dbb2f5bbef790))

## [1.5.1](https://github.com/alimaandev/corun/compare/v1.5.0...v1.5.1) (2026-07-30)


### Bug Fixes

* AudioContext resume on user gesture, deprecated meta tag ([1cb574d](https://github.com/alimaandev/corun/commit/1cb574d3d10ebcbb40c18ed466ce74695d003792))

# [1.5.0](https://github.com/alimaandev/corun/compare/v1.4.0...v1.5.0) (2026-07-30)


### Features

* menu music, loading screen, shortcuts overlay, 6 new issues ([cae4a48](https://github.com/alimaandev/corun/commit/cae4a48e3d49b76380fd6559cc4efeeb9ed83fb9))

# [1.4.0](https://github.com/alimaandev/corun/compare/v1.3.0...v1.4.0) (2026-07-30)


### Features

* README overhaul, sound toggle, mobile cursor fix, GitHub SEO ([672a375](https://github.com/alimaandev/corun/commit/672a375e8fa2fe7036d2e5b09ca4225618883d46))

# [1.3.0](https://github.com/alimaandev/corun/compare/v1.2.0...v1.3.0) (2026-07-27)


### Features

* OG social card, GitHub topics, remove stale sitemap ([87c9544](https://github.com/alimaandev/corun/commit/87c9544d8732be10a8458d93b95454d95815660a))

# [1.2.0](https://github.com/alimaandev/corun/compare/v1.1.1...v1.2.0) (2026-07-26)


### Features

* SEO and contributor tooling overhaul ([0e70849](https://github.com/alimaandev/corun/commit/0e70849042a2b51d25a9c0c83676d62fa2ed9289))

## [1.1.1](https://github.com/alimaandev/corun/compare/v1.1.0...v1.1.1) (2026-07-26)


### Bug Fixes

* resolve tsc -b type errors ([61853dd](https://github.com/alimaandev/corun/commit/61853dd9a060aa9bcf89465270df8c2b4e5cbf5c))

# [1.1.0](https://github.com/alimaandev/corun/compare/v1.0.0...v1.1.0) (2026-07-26)


### Features

* complete Phase 3-4 polish and outstanding items ([9c9bf75](https://github.com/alimaandev/corun/commit/9c9bf755070de347b791880efe258a585fe4521f))

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
