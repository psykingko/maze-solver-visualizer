import { PREDEFINED_MAZES } from "../data/predefinedMazes";

const ALGORITHMS = [
  { id: "BFS", label: "BFS" },
  { id: "DFS", label: "DFS" },
  { id: "Astar", label: "A*" },
];

const MODES = [
  { id: "setStart", label: "Set Start" },
  { id: "setEnd", label: "Set End" },
  { id: "drawWalls", label: "Draw Walls" },
];

const Divider = () => <div className="w-px h-7 bg-gray-700 flex-shrink-0" />;

export default function Controls({
  interactionMode,
  selectedAlgorithm,
  isRunning,
  onModeChange,
  onAlgorithmChange,
  onVisualize,
  onClearWalls,
  onResetGrid,
  onLoadMaze,
}) {
  const btn =
    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 bg-gray-900 rounded-xl border border-gray-700 flex-wrap gap-y-2">
      {/* Group 1 — Interaction modes */}
      <div className="flex gap-2">
        {MODES.map(({ id, label }) => {
          const isActive = interactionMode === id;
          return (
            <button
              key={id}
              onClick={() => onModeChange(isActive ? "none" : id)}
              disabled={isRunning}
              className={`${btn} ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Divider />

      {/* Group 2 — Algorithm selector */}
      <div className="flex gap-2">
        {ALGORITHMS.map(({ id, label }) => {
          const isSelected = selectedAlgorithm === id;
          return (
            <button
              key={id}
              onClick={() => onAlgorithmChange(id)}
              disabled={isRunning}
              className={`${btn} ${
                isSelected
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Divider />

      {/* Group 3 — Predefined maze loader */}
      <select
        onChange={(e) => e.target.value && onLoadMaze(e.target.value)}
        disabled={isRunning}
        defaultValue=""
        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 border border-gray-600
          hover:border-gray-500 focus:outline-none focus:border-cyan-500 cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          Load Maze…
        </option>
        {PREDEFINED_MAZES.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

      <Divider />

      {/* Group 4 — Actions */}
      <div className="flex gap-2">
        <button
          onClick={onVisualize}
          disabled={isRunning}
          className={`${btn} font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white
            hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20`}
        >
          {isRunning ? "Running…" : "Visualize"}
        </button>
        <button
          onClick={onClearWalls}
          disabled={isRunning}
          className={`${btn} bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600`}
        >
          Clear Walls
        </button>
        <button
          onClick={onResetGrid}
          disabled={isRunning}
          className={`${btn} bg-gray-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-gray-600`}
        >
          Reset Grid
        </button>
      </div>
    </div>
  );
}
