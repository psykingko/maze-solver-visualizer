# Maze Solver Visualizer — Program Flow & Implementation

## Overview

The app is a React SPA built with Vite. The user interacts with a 20×20 grid, selects an algorithm, runs it, and watches the traversal animate in real time. After each run, performance metrics are recorded and visualized.

---

## 1. Grid Representation

The grid is a `20×20` 2D array of strings (`string[][]`), where each cell holds one of five states:

| State     | Meaning                         |
| --------- | ------------------------------- |
| `empty`   | Default walkable cell           |
| `wall`    | Blocked — algorithms skip it    |
| `start`   | Algorithm start point           |
| `end`     | Algorithm target/goal           |
| `visited` | Cell explored during traversal  |
| `path`    | Cell on the final solution path |

All grid mutations are handled by pure functions in `src/utils/gridUtils.js`:

- `createEmptyGrid()` — initializes a fresh 20×20 empty grid
- `placeNode(grid, row, col, type)` — places start/end, clears previous
- `toggleWall(grid, row, col)` — flips a cell between `empty` and `wall`
- `clearWalls(grid)` — removes all walls and visualization
- `clearVisualization(grid)` — removes only `visited`/`path`, keeps walls
- `resetGrid()` — returns a completely fresh grid
- `loadMaze(mazeDefinition)` — builds a grid from a predefined maze object

---

## 2. Application State (App.jsx)

All state lives in the root `App` component:

| State               | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `grid`              | The live 20×20 cell state array                      |
| `startNode`         | `{ row, col }` of the start cell                     |
| `endNode`           | `{ row, col }` of the end cell                       |
| `interactionMode`   | `"setStart"` / `"setEnd"` / `"drawWalls"` / `"none"` |
| `selectedAlgorithm` | `"BFS"` / `"DFS"` / `"Astar"`                        |
| `isRunning`         | Locks controls during animation                      |
| `runs`              | Array of past run metric objects                     |
| `errorMessage`      | Shown when no path found or missing nodes            |

A `gridRef` mirrors the grid state for use inside `setTimeout` closures without stale closure issues.

---

## 3. User Interaction Flow

```
User clicks mode button (Set Start / Set End / Draw Walls)
        ↓
interactionMode updates
        ↓
User clicks/drags on grid cell → handleCellInteract(row, col)
        ↓
  setStart  → placeNode(grid, row, col, "start") → setStartNode
  setEnd    → placeNode(grid, row, col, "end")   → setEndNode
  drawWalls → toggleWall(grid, row, col)
```

Drag support: `onMouseEnter` fires `handleCellInteract` while mouse button is held, enabling click-and-drag wall drawing.

---

## 4. Algorithm Execution Flow

When the user clicks **Visualize**:

```
handleVisualize()
    ↓
Validate: startNode and endNode must exist
    ↓
clearVisualization(grid) — wipe previous visited/path cells
    ↓
Call selected algorithm: bfs / dfs / astar (grid, startNode, endNode)
    ↓
Returns: { visitedOrder, pathOrder, nodesVisited, pathLength, timeTakenMs }
    ↓
Schedule setTimeout for each cell in visitedOrder → mark as "visited"
    ↓
Schedule setTimeout for each cell in pathOrder   → mark as "path"
    ↓
Final setTimeout → append run metrics to `runs`, setIsRunning(false)
```

Animation delay is `20ms` per cell (`STEP_DELAY_MS = 20`). All timeouts are tracked in `timeoutsRef` so they can be cancelled on reset.

---

## 5. Algorithm Implementations

### BFS — `src/algorithms/bfs.js`

- Data structure: **FIFO queue** (`Array.shift()`)
- Explores nodes level by level (shortest path guaranteed)
- Uses a `parent` Map to reconstruct the path
- Uses a `visited` Set to avoid revisiting cells
- Skips `wall` cells

```
queue = [start]
while queue not empty:
    current = queue.shift()
    if current == end → found, break
    for each neighbor (up/down/left/right):
        if not visited and not wall:
            mark visited, set parent, enqueue
reconstruct path via parent map (end → start)
```

### DFS — `src/algorithms/dfs.js`

- Data structure: **LIFO stack** (`Array.pop()`)
- Dives deep along one branch before backtracking (no shortest path guarantee)
- Same parent map + visited set pattern as BFS
- Only difference: `queue.shift()` → `stack.pop()`

```
stack = [start]
while stack not empty:
    current = stack.pop()
    if current == end → found, break
    for each neighbor:
        if not visited and not wall:
            mark visited, set parent, push to stack
reconstruct path via parent map
```

### A\* — `src/algorithms/astar.js`

- Data structure: **min-heap priority queue** (custom binary heap)
- Heuristic: **Manhattan distance** `h = |row - endRow| + |col - endCol|`
- Cost function: `f = g + h` where `g` = steps from start
- Explores the most promising node first (shortest path guaranteed)
- Uses a `gScore` Map to track best known cost to each cell
- Uses a `closed` Set to skip already-processed nodes

```
heap = [{ start, f: h(start), g: 0 }]
while heap not empty:
    current = heapPop() (lowest f)
    if current in closed → skip
    add to closed
    if current == end → found, break
    for each neighbor:
        tentativeG = current.g + 1
        if tentativeG < gScore[neighbor]:
            update gScore, set parent
            heapPush({ neighbor, f: tentativeG + h(neighbor), g: tentativeG })
reconstruct path via parent map
```

---

## 6. Path Reconstruction

All three algorithms share the same reconstruction logic:

```
cur = endNode
while cur exists:
    if cur == start → stop
    if cur != end   → add to pathOrder
    cur = parent.get(cur)
```

`pathOrder` is returned in reverse (end → start direction) and animated sequentially.

---

## 7. Predefined Mazes — `src/data/predefinedMazes.js`

Three built-in maze layouts, each defined as:

```js
{ id, name, walls: [{row, col}, ...], start: {row, col}, end: {row, col} }
```

| Maze    | Design                                            |
| ------- | ------------------------------------------------- |
| Spiral  | 4 concentric square rings with alternating gaps   |
| Zig-Zag | Horizontal walls with alternating left/right gaps |
| Rooms   | Vertical dividers with narrow openings            |

`loadMaze()` in `gridUtils.js` converts the definition into a live grid.

---

## 8. Metrics & Analytics

After each run, a metrics object is appended to the `runs` array:

```js
{
  (algorithm, nodesVisited, pathLength, timeTakenMs);
}
```

- `MetricsPanel` — shows the latest run
- `ComparisonTable` — one row per run
- `ChartComponent` (Recharts) — grouped bar chart across all runs

Time is measured using `performance.now()` inside each algorithm — pure computation time, excluding animation.

---

## 9. Component Tree

```
App
├── nav (title bar)
├── Controls       — mode buttons, algorithm selector, visualize/clear/reset
├── Legend         — color key
├── [error banner]
├── ScaledGrid
│   └── MazeGrid
│       └── GridCell (×400)
├── AlgorithmPanel — algorithm info cards
├── MetricsPanel   — latest run stats
├── ComparisonTable
└── ChartComponent
```

---

## 10. Key Design Decisions

- **Pure grid functions** — all mutations return new arrays, no in-place edits, making state predictable
- **gridRef** — mirrors state for use inside async `setTimeout` callbacks to avoid stale closures
- **Timeout-based animation** — each cell state change is a scheduled `setTimeout`, giving smooth step-by-step visuals without blocking the main thread
- **Algorithm isolation** — each algorithm is a pure function with no side effects; easy to test and swap
- **Performance timing inside algorithms** — `performance.now()` wraps only the computation, not the render
