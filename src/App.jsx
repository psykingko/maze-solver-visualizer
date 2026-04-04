import { useState, useCallback, useRef } from "react";
import {
  createEmptyGrid,
  placeNode,
  toggleWall,
  clearWalls,
  clearVisualization,
  resetGrid,
  loadMaze,
} from "./utils/gridUtils";
import { PREDEFINED_MAZES } from "./data/predefinedMazes";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { astar } from "./algorithms/astar";
import MazeGrid from "./components/MazeGrid";
import ScaledGrid from "./components/ScaledGrid";
import Controls from "./components/Controls";
import AlgorithmPanel from "./components/AlgorithmPanel";
import MetricsPanel from "./components/MetricsPanel";
import ComparisonTable from "./components/ComparisonTable";
import ChartComponent from "./components/ChartComponent";
import Legend from "./components/Legend";

const ALGO_MAP = { BFS: bfs, DFS: dfs, Astar: astar };
const STEP_DELAY_MS = 20;

export default function App() {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [interactionMode, setInteractionMode] = useState("none");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("BFS");
  const [isRunning, setIsRunning] = useState(false);
  const [runs, setRuns] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const timeoutsRef = useRef([]);
  const gridRef = useRef(grid);

  const handleCellInteract = useCallback(
    (row, col) => {
      if (isRunning) return;
      if (interactionMode === "setStart") {
        setGrid((g) => {
          const next = placeNode(g, row, col, "start");
          gridRef.current = next;
          return next;
        });
        setStartNode({ row, col });
      } else if (interactionMode === "setEnd") {
        setGrid((g) => {
          const next = placeNode(g, row, col, "end");
          gridRef.current = next;
          return next;
        });
        setEndNode({ row, col });
      } else if (interactionMode === "drawWalls") {
        setGrid((g) => {
          const next = toggleWall(g, row, col);
          gridRef.current = next;
          return next;
        });
      }
    },
    [isRunning, interactionMode],
  );

  const handleClearWalls = useCallback(() => {
    if (isRunning) return;
    setGrid((g) => {
      const next = clearWalls(g);
      gridRef.current = next;
      return next;
    });
  }, [isRunning]);

  const handleResetGrid = useCallback(() => {
    if (isRunning) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setIsRunning(false);
    }
    const empty = resetGrid();
    gridRef.current = empty;
    setGrid(empty);
    setStartNode(null);
    setEndNode(null);
    setRuns([]);
    setErrorMessage(null);
  }, [isRunning]);

  const handleLoadMaze = useCallback(
    (mazeId) => {
      if (isRunning) return;
      const maze = PREDEFINED_MAZES.find((m) => m.id === mazeId);
      if (!maze) return;
      const newGrid = loadMaze(maze);
      gridRef.current = newGrid;
      setGrid(newGrid);
      setStartNode(maze.start);
      setEndNode(maze.end);
      setErrorMessage(null);
    },
    [isRunning],
  );

  const handleVisualize = useCallback(() => {
    if (isRunning) return;
    if (!startNode) {
      setErrorMessage("Please set a start node before visualizing.");
      return;
    }
    if (!endNode) {
      setErrorMessage("Please set an end node before visualizing.");
      return;
    }
    setErrorMessage(null);

    // Clear only previous visited/path cells — preserve walls
    const snapshot = clearVisualization(gridRef.current);
    gridRef.current = snapshot;
    setGrid(snapshot);
    setIsRunning(true);

    const algoFn = ALGO_MAP[selectedAlgorithm];
    const { visitedOrder, pathOrder, nodesVisited, pathLength, timeTakenMs } =
      algoFn(snapshot, startNode, endNode);

    let delay = 0;

    visitedOrder.forEach(({ row, col }) => {
      const t = setTimeout(() => {
        setGrid((g) =>
          g.map((r, ri) =>
            r.map((cell, ci) =>
              ri === row && ci === col && cell !== "start" && cell !== "end"
                ? "visited"
                : cell,
            ),
          ),
        );
      }, delay);
      timeoutsRef.current.push(t);
      delay += STEP_DELAY_MS;
    });

    pathOrder.forEach(({ row, col }) => {
      const t = setTimeout(() => {
        setGrid((g) =>
          g.map((r, ri) =>
            r.map((cell, ci) =>
              ri === row && ci === col && cell !== "start" && cell !== "end"
                ? "path"
                : cell,
            ),
          ),
        );
      }, delay);
      timeoutsRef.current.push(t);
      delay += STEP_DELAY_MS;
    });

    const finalT = setTimeout(() => {
      if (pathOrder.length === 0 && nodesVisited > 0) {
        setErrorMessage("No path found between start and end nodes.");
      }
      setRuns((prev) => [
        ...prev,
        {
          algorithm: selectedAlgorithm,
          nodesVisited,
          pathLength,
          timeTakenMs: Math.round(timeTakenMs * 100) / 100,
        },
      ]);
      setIsRunning(false);
      timeoutsRef.current = [];
    }, delay);
    timeoutsRef.current.push(finalT);
  }, [isRunning, startNode, endNode, selectedAlgorithm]);

  const latestRun = runs.length > 0 ? runs[runs.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="bg-gray-900/95 border-b border-gray-800 px-4 py-2.5 flex items-center gap-3 shadow-lg shadow-black/30 backdrop-blur-sm lg:px-6">
        <div className="w-2 h-6 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 flex-shrink-0" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight lg:text-xl">
          Maze Solver Visualizer
        </h1>
      </nav>

      <div className="flex flex-col gap-2 p-2 flex-1 sm:p-3">
        {/* Controls */}
        <Controls
          interactionMode={interactionMode}
          selectedAlgorithm={selectedAlgorithm}
          isRunning={isRunning}
          onModeChange={setInteractionMode}
          onAlgorithmChange={setSelectedAlgorithm}
          onVisualize={handleVisualize}
          onClearWalls={handleClearWalls}
          onResetGrid={handleResetGrid}
          onLoadMaze={handleLoadMaze}
        />

        {/* Legend */}
        <Legend />

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-2 rounded-lg flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-4 text-red-400 hover:text-red-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── BEFORE any run ── */}
        {runs.length === 0 && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* Grid — centered on mobile */}
            <div className="flex justify-center lg:justify-start lg:flex-shrink-0">
              <ScaledGrid
                grid={grid}
                isRunning={isRunning}
                onCellInteract={handleCellInteract}
                onDragStart={() => {}}
                onDragEnd={() => {}}
              />
            </div>
            {/* Tall algo cards */}
            <div className="flex-1 min-w-0">
              <AlgorithmPanel
                selectedAlgorithm={selectedAlgorithm}
                compact={false}
              />
            </div>
          </div>
        )}

        {/* ── AFTER first run ── */}
        {runs.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Grid + analytics row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              {/* Grid */}
              <div className="flex justify-center lg:justify-start lg:flex-shrink-0">
                <ScaledGrid
                  grid={grid}
                  isRunning={isRunning}
                  onCellInteract={handleCellInteract}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                />
              </div>
              {/* Right column: metrics + table + chart */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="flex-1 min-w-0">
                    <MetricsPanel latestRun={latestRun} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ComparisonTable runs={runs} />
                  </div>
                </div>
                <ChartComponent runs={runs} />
              </div>
            </div>
            {/* Compact algo strip */}
            <AlgorithmPanel
              selectedAlgorithm={selectedAlgorithm}
              compact={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
