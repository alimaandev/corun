import { useEffect, useState } from "react";
import { challenges } from "./content/challenges";
import "./App.css";

type Tile = "water" | "grass" | "path" | "tree" | "bridge";
type Language = "JavaScript" | "TypeScript" | "Python";
type SaveState = {
  version: number;
  challengeIndex: number;
  solved: number[];
  inventory: { wood: number; stone: number };
  houseStage: number;
  player: { x: number; y: number };
  notice: string;
};

const SAVE_KEY = "evade-meadowfall-save";

const map: Tile[][] = [
  ["tree", "grass", "grass", "grass", "tree", "water", "water", "water"],
  ["grass", "grass", "path", "path", "grass", "water", "water", "water"],
  ["grass", "tree", "path", "path", "grass", "grass", "grass", "tree"],
  ["grass", "grass", "path", "bridge", "bridge", "grass", "grass", "grass"],
  ["tree", "grass", "path", "path", "grass", "grass", "tree", "grass"],
  ["grass", "grass", "path", "path", "grass", "grass", "grass", "grass"],
];

const tileLabels: Record<Tile, string> = {
  water: "Water",
  grass: "Grass",
  path: "Path",
  tree: "Tree",
  bridge: "Broken bridge",
};
const housePieces = ["Foundation", "Walls", "Roof", "Workshop"];
const defaultSave: SaveState = {
  version: 2,
  challengeIndex: 0,
  solved: [],
  inventory: { wood: 0, stone: 0 },
  houseStage: 0,
  player: { x: 2, y: 4 },
  notice: "The bridge is blocking the old forest path.",
};

function starterCode(challengeIndex: number, language: Language): string {
  const challenge = challenges[challengeIndex];
  if (language !== "Python") return challenge.code;
  if (challenge.topic.startsWith("ARRAYS"))
    return "def solve(items):\n    # TODO: return the first item\n    return None";
  if (challenge.topic.startsWith("FILTER"))
    return "def solve(items):\n    # TODO: keep the matching items\n    return []";
  if (challenge.topic.startsWith("MAP"))
    return "def solve(items):\n    # TODO: transform every item\n    return []";
  if (challenge.topic.startsWith("CONDITIONALS"))
    return 'def solve(is_raining):\n    # TODO: choose a plan\n    return ""';
  if (challenge.topic.startsWith("LOOPS"))
    return "def solve(items):\n    # TODO: add every item\n    return 0";
  if (challenge.topic.startsWith("STRINGS"))
    return 'def solve(sign):\n    # TODO: change the sign\n    return ""';
  return "def solve(item, count):\n    # TODO: create a packed item\n    return {}";
}

function validateSolution(
  challengeIndex: number,
  code: string,
  language: Language,
): boolean {
  const challenge = challenges[challengeIndex];
  if (language !== "Python") return challenge.validator(code);
  if (challenge.topic.startsWith("ARRAYS"))
    return /return\s+\w+\[0\]/.test(code);
  if (challenge.topic.startsWith("FILTER"))
    return /\[.*for/.test(code) && /wood|if/.test(code);
  if (challenge.topic.startsWith("MAP")) return /\[.*for/.test(code);
  if (challenge.topic.startsWith("CONDITIONALS"))
    return /if/.test(code) && /return/.test(code);
  if (challenge.topic.startsWith("LOOPS"))
    return /for/.test(code) && /total/.test(code);
  if (challenge.topic.startsWith("STRINGS")) return /\.upper\(\)/.test(code);
  return /return/.test(code) && /item/.test(code) && /count/.test(code);
}

function loadSave(): SaveState {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    const parsed = saved ? (JSON.parse(saved) as Partial<SaveState>) : {};
    return { ...defaultSave, ...parsed, version: 2 };
  } catch {
    return defaultSave;
  }
}

function App() {
  const [game, setGame] = useState<SaveState>(loadSave);
  const [language, setLanguage] = useState<Language>("JavaScript");
  const [code, setCode] = useState(starterCode(0, "JavaScript"));
  const [hintVisible, setHintVisible] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");

  const challenge =
    challenges[Math.min(game.challengeIndex, challenges.length - 1)];
  const finished = game.houseStage === housePieces.length;
  const levelNumber = Math.min(Math.floor(game.challengeIndex / 10) + 1, 12);
  const levelStart = (levelNumber - 1) * 10;
  const levelEnd = Math.min(levelStart + 10, challenges.length);
  const levelSolved = game.solved.filter(
    (index) => index >= levelStart && index < levelEnd,
  ).length;
  const levelComplete = levelSolved === levelEnd - levelStart;

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      const direction = { x: 0, y: 0 };
      if (event.key === "ArrowUp" || event.key === "w") direction.y = -1;
      if (event.key === "ArrowDown" || event.key === "s") direction.y = 1;
      if (event.key === "ArrowLeft" || event.key === "a") direction.x = -1;
      if (event.key === "ArrowRight" || event.key === "d") direction.x = 1;
      setGame((current) => ({
        ...current,
        player: {
          x: Math.max(0, Math.min(7, current.player.x + direction.x)),
          y: Math.max(0, Math.min(5, current.player.y + direction.y)),
        },
        notice: "You moved through Meadowfall.",
      }));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSolution = () => {
    if (
      game.challengeIndex >= challenges.length ||
      game.solved.includes(game.challengeIndex)
    )
      return;
    const valid = validateSolution(game.challengeIndex, code, language);
    if (!valid) {
      setResult("error");
      setGame((current) => ({
        ...current,
        notice:
          "The tests found a problem. Read the expected output and try again.",
      }));
      return;
    }
    const nextIndex = Math.min(game.challengeIndex + 1, challenges.length);
    setResult("success");
    setCode(
      nextIndex < challenges.length ? starterCode(nextIndex, language) : "",
    );
    setGame((current) => ({
      ...current,
      challengeIndex: nextIndex,
      solved: current.solved.includes(game.challengeIndex)
        ? current.solved
        : [...current.solved, game.challengeIndex],
      inventory: {
        wood: current.inventory.wood + 1,
        stone:
          current.inventory.stone + (game.challengeIndex % 3 === 0 ? 1 : 0),
      },
      notice:
        nextIndex === challenges.length
          ? "All problems solved. The builders are ready for your home."
          : "All tests passed. A new path has opened in Meadowfall.",
    }));
  };

  const buildNextPiece = () => {
    if (
      game.houseStage >= housePieces.length ||
      game.challengeIndex < challenges.length
    )
      return;
    const nextStage = game.houseStage + 1;
    const cost =
      nextStage === 1 ? { wood: 1, stone: 0 } : { wood: 1, stone: 1 };
    if (game.inventory.wood < cost.wood || game.inventory.stone < cost.stone) {
      setGame((current) => ({
        ...current,
        notice: "You need more materials before placing this piece.",
      }));
      return;
    }
    setGame((current) => ({
      ...current,
      houseStage: nextStage,
      inventory: {
        wood: current.inventory.wood - cost.wood,
        stone: current.inventory.stone - cost.stone,
      },
      notice:
        nextStage === housePieces.length
          ? "Home complete. You restored Meadowfall."
          : `${housePieces[nextStage - 1]} placed. Keep building.`,
    }));
  };

  const selectChallenge = (index: number) => {
    if (index !== game.challengeIndex) return;
    setCode(starterCode(index, language));
    setResult(game.solved.includes(index) ? "success" : "idle");
    setHintVisible(false);
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setCode(
      game.challengeIndex < challenges.length
        ? starterCode(game.challengeIndex, nextLanguage)
        : "",
    );
    setResult("idle");
  };
  const progress = Math.round((game.houseStage / housePieces.length) * 100);
  const activeChallengeIndex = Math.min(
    game.challengeIndex,
    challenges.length - 1,
  );

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="world-column">
          <div className="level-banner">
            <strong>LEVEL {String(levelNumber).padStart(2, "0")}</strong>
            <span>
              {levelSolved}/{levelEnd - levelStart} tasks solved!
            </span>
            <em>
              {levelComplete
                ? "NEXT LEVEL UNLOCKED"
                : "SOLVE THE CURRENT TASK TO CONTINUE"}
            </em>
          </div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">LIVE WORLD</p>
              <h1 className="world-title">Corun</h1>
            </div>
            <span className="coords">DAY 03 · 08:42</span>
          </div>
          <div className="world-panel">
            <div className="map-grid" aria-label="Meadowfall world map">
              {map.flatMap((row, rowIndex) =>
                row.map((tile, columnIndex) => (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    className={`tile tile-${tile} ${tile === "bridge" && game.solved.includes(0) ? "tile-repaired" : ""}`}
                    title={tileLabels[tile]}
                  >
                    {tile === "tree" && <span className="tree-icon">♣</span>}
                    {tile === "bridge" && (
                      <span className="bridge-icon">
                        {game.solved.includes(0) ? "==" : "//"}
                      </span>
                    )}
                  </div>
                )),
              )}
              <div
                className="player-marker"
                style={{
                  left: `${game.player.x * 12.5 + 1.5}%`,
                  top: `${game.player.y * 16.66 + 2}%`,
                }}
                title="Your position"
              >
                A
              </div>
              <div
                className={`build-marker ${game.challengeIndex >= challenges.length ? "unlocked" : ""}`}
                title="House build site"
              >
                ⌂
              </div>
              {game.houseStage > 0 && (
                <div
                  className="house-marker"
                  style={{ width: `${game.houseStage * 9 + 7}%` }}
                >
                  ⌂
                </div>
              )}
            </div>
            <div className="map-caption">
              <span>
                <i className="legend-player" /> You are here
              </span>
              <span>
                <i className="legend-goal" /> Build site
              </span>
              <span className="objective-chip">
                {finished
                  ? "MEADOWFALL RESTORED"
                  : game.challengeIndex >= challenges.length
                    ? "BUILD SITE UNLOCKED"
                    : `OBJECTIVE: ${challenge.title.toUpperCase()}`}
              </span>
            </div>
          </div>
          <div className="world-note">
            <span className="note-icon">!</span>
            <span>{game.notice}</span>
          </div>
          <div className="controls-hint">
            <span>MOVE</span>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd>
            <span>or arrow keys</span>
            <button
              type="button"
              onClick={buildNextPiece}
              disabled={game.challengeIndex < challenges.length || finished}
            >
              BUILD NEXT PIECE
            </button>
          </div>
          <div className="progress-section">
            <div className="progress-header">
              <span>HOUSE PROGRESS</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="build-slots">
              {housePieces.slice(0, 3).map((piece, index) => (
                <div
                  className={`build-slot ${game.houseStage > index ? "complete" : game.houseStage === index ? "active" : ""}`}
                  key={piece}
                >
                  <span>0{index + 1}</span>
                  <b>{piece}</b>
                  <small>
                    {game.houseStage > index
                      ? "COMPLETE"
                      : game.houseStage === index
                        ? "NEXT"
                        : "LOCKED"}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="challenge-column">
          <div className="language-picker">
            <span>LANGUAGE</span>
            {(["JavaScript", "TypeScript", "Python"] as Language[]).map(
              (option) => (
                <button
                  type="button"
                  className={language === option ? "active" : ""}
                  key={option}
                  onClick={() => changeLanguage(option)}
                >
                  {option}
                </button>
              ),
            )}
          </div>
          <div className="challenge-meta">
            <span className="chapter-tag">{challenge.chapter}</span>
            <span className="difficulty">● {challenge.difficulty}</span>
            <span className="challenge-count">
              {game.solved.length} / {challenges.length} SOLVED
            </span>
          </div>
          <div className="challenge-tabs">
            {challenges.map((item, index) => (
              <button
                type="button"
                key={item.title}
                className={`${index === activeChallengeIndex ? "selected" : ""} ${game.solved.includes(index) ? "done" : ""}`}
                onClick={() => selectChallenge(index)}
                disabled={index !== game.challengeIndex}
              >
                0{index + 1}
              </button>
            ))}
          </div>
          <h2>
            {finished
              ? "Meadowfall restored"
              : game.challengeIndex >= challenges.length
                ? "Build your home"
                : challenge.title}
          </h2>
          <p className="challenge-copy">
            {finished
              ? "You solved the problems, repaired the path, and built a place to call home."
              : game.challengeIndex >= challenges.length
                ? "Use the materials you earned to place every part of your house."
                : challenge.description}
          </p>
          {game.challengeIndex < challenges.length ? (
            <>
              <div className="task-card">
                <div className="task-label">YOUR TASK</div>
                <code>{challenge.task}</code>
                <p>
                  Expected output: <strong>{challenge.expected}</strong>
                </p>
              </div>
              <div className="editor-wrap">
                <div className="editor-bar">
                  <span>
                    <i className="file-dot" /> challenge.
                    {language === "Python" ? "py" : "ts"}
                  </span>
                  <span>
                    {language} <b>⌄</b>
                  </span>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setResult("idle");
                  }}
                  spellCheck={false}
                  aria-label={`${language} challenge editor`}
                />
              </div>
              <div className="editor-actions">
                <button
                  type="button"
                  className="hint-button"
                  onClick={() => setHintVisible(!hintVisible)}
                >
                  ☼ {hintVisible ? "Hide hint" : "Need a hint?"}
                </button>
                <button
                  type="button"
                  className="run-button"
                  onClick={submitSolution}
                >
                  {result === "success" ? "✓ Solved" : "Run solution"}{" "}
                  <span>↗</span>
                </button>
              </div>
              {hintVisible && <div className="hint-card">{challenge.hint}</div>}
              <div
                className={`result-card ${result === "success" ? "success" : result === "error" ? "error" : ""}`}
              >
                <span className="result-icon">
                  {result === "success" ? "✓" : result === "error" ? "!" : "○"}
                </span>
                <div>
                  <strong>
                    {result === "success"
                      ? "All tests passed"
                      : result === "error"
                        ? "Try again"
                        : "Waiting for your solution"}
                  </strong>
                  <p>
                    {result === "success"
                      ? "Progress saved. The world changed."
                      : result === "error"
                        ? "Your answer did not match the hidden tests."
                        : "Run your code to check the hidden tests."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="build-card">
              <div className="build-card-icon">⌂</div>
              <strong>
                {finished ? "You built a home." : "The build site is open."}
              </strong>
              <p>
                {finished
                  ? "Your first advancement is complete."
                  : "Spend wood and stone to place every piece."}
              </p>
              <button
                type="button"
                className="run-button"
                onClick={buildNextPiece}
                disabled={finished}
              >
                {finished
                  ? "Home complete"
                  : `Place ${housePieces[game.houseStage]}`}
              </button>
            </div>
          )}
        </aside>
      </section>
      <footer className="bottom-rail">
        <div className="rail-item active">
          <span className="rail-number">01</span>
          <div>
            <small>ACTIVE QUEST</small>
            <strong>
              {finished
                ? "A home in Meadowfall"
                : game.challengeIndex >= challenges.length
                  ? "Build your first home"
                  : challenge.title}
            </strong>
          </div>
        </div>
        <div
          className={`rail-item ${game.challengeIndex >= challenges.length ? "active" : ""}`}
        >
          <span className="rail-number">02</span>
          <div>
            <small>NEXT UP</small>
            <strong>
              {finished
                ? "Explore a new chapter"
                : game.challengeIndex >= challenges.length
                  ? "Place the next piece"
                  : "Solve the next problem"}
            </strong>
          </div>
        </div>
        <div className="advancement">
          <span className="advancement-icon">✦</span>
          <div>
            <small>ADVANCEMENT</small>
            <strong>
              {finished
                ? "Home sweet home"
                : game.solved.length
                  ? "A path restored"
                  : "First steps"}
            </strong>
          </div>
          <span className="chevron">›</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
