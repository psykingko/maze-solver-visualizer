# Maze Solver Visualizer

An interactive web app for visualizing pathfinding algorithms on a 20×20 grid. Watch BFS, DFS, and A\* explore your maze in real time, then compare their performance side by side.

---

## Features

- Interactive 20×20 grid — draw walls, place start/end nodes by clicking or dragging
- Three pathfinding algorithms — BFS, DFS, and A\*
- Step-by-step animation showing visited cells and the final path
- Three predefined mazes — Spiral, Zig-Zag, and Rooms
- Performance metrics — nodes visited, path length, and time taken per run
- Comparison table and bar chart across multiple runs
- Fully responsive — works on desktop, tablet, and mobile

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
cd maze-solver-visualizer
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
npm run test -- --run
```

---

## How to Use

### 1. Set a Start Node

Click **Set Start** in the toolbar, then click any cell on the grid. The cell turns green. You can move it at any time by clicking a different cell while in Set Start mode.

### 2. Set an End Node

Click **Set End**, then click any cell. The cell turns red. Same rules apply — click again to move it.

### 3. Draw Walls

Click **Draw Walls**, then click or click-and-drag across cells to toggle walls on and off. Wall cells are dark/black and block the algorithm. Clicking a wall cell again removes it.

> Walls cannot be placed on the start or end node.

### 4. Load a Predefined Maze (optional)

Use the **Load Maze…** dropdown to instantly load one of three built-in layouts:

| Maze        | Description                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| **Spiral**  | Concentric square rings with alternating gaps — forces a winding inward path   |
| **Zig-Zag** | Horizontal walls with alternating left/right gaps — creates a zig-zag corridor |
| **Rooms**   | Vertical dividers with narrow openings — simulates a multi-room layout         |

Loading a maze replaces the current grid and sets the start and end nodes automatically.

### 5. Choose an Algorithm

Click one of the three algorithm buttons:

| Algorithm | Guarantees Shortest Path | Strategy                                          |
| --------- | ------------------------ | ------------------------------------------------- |
| **BFS**   | ✅ Yes                   | Explores level by level using a queue             |
| **DFS**   | ❌ No                    | Dives deep along one branch using a stack         |
| **A\***   | ✅ Yes                   | Uses Manhattan distance heuristic to guide search |

The selected algorithm is highlighted. BFS is selected by default.

### 6. Visualize

Click **Visualize**. The algorithm runs and animates:

1. **Blue cells** — cells visited during exploration
2. **Yellow cells** — the final path from start to end

If no path exists, a message is shown. All controls are disabled while the animation runs.

### 7. Compare Runs

After each run, the right panel shows:

- **Latest Run Metrics** — algorithm used, nodes visited, path length, time taken
- **Comparison Table** — one row per run for side-by-side comparison
- **Performance Chart** — grouped bar chart across all runs

Run different algorithms on the same maze to compare them directly.

### 8. Clear or Reset

| Button          | What it does                                                                |
| --------------- | --------------------------------------------------------------------------- |
| **Clear Walls** | Removes all walls and clears visited/path cells. Keeps start and end nodes. |
| **Reset Grid**  | Clears everything — walls, nodes, and all run history.                      |

---

## Grid Legend

| Color     | Meaning      |
| --------- | ------------ |
| 🟩 Green  | Start node   |
| 🟥 Red    | End node     |
| ⬛ Dark   | Wall         |
| 🟦 Blue   | Visited cell |
| 🟨 Yellow | Path cell    |
| ⬜ Gray   | Empty cell   |

---

## Tech Stack

- **React 18** — functional components with hooks
- **Vite** — dev server and build tool
- **Tailwind CSS** — styling
- **Recharts** — performance bar chart
- **Vitest + fast-check** — unit and property-based tests

---

## Project Structure

```
src/
├── algorithms/
│   ├── bfs.js          # Breadth-First Search
│   ├── dfs.js          # Depth-First Search
│   └── astar.js        # A* Search
├── components/
│   ├── MazeGrid.jsx    # 20×20 grid renderer
│   ├── GridCell.jsx    # Single cell
│   ├── Controls.jsx    # Toolbar buttons
│   ├── AlgorithmPanel.jsx
│   ├── MetricsPanel.jsx
│   ├── ComparisonTable.jsx
│   ├── ChartComponent.jsx
│   ├── Legend.jsx
│   └── ScaledGrid.jsx  # Responsive grid wrapper
├── data/
│   └── predefinedMazes.js
├── utils/
│   ├── gridUtils.js    # Grid mutation pure functions
│   └── colorMapping.js # Cell state → Tailwind class
└── test/               # Property-based and integration tests
```

---

## Tips

- You can run the same algorithm multiple times on different mazes and compare all results in the chart simultaneously.
- DFS is great for seeing how dramatically a non-optimal algorithm can differ from BFS/A\* on the same maze.
- A\* is almost always faster than BFS in terms of nodes visited — try it on the Spiral maze to see the difference.
- On mobile, the grid scales down automatically. Tap cells to interact; drag to draw walls.
