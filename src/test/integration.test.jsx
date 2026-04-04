// Feature: maze-solver-visualizer
// Integration tests for App.jsx wiring, error messages, and disabled states
// Validates: Requirements 13.8, 14.1

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App.jsx";
import { PREDEFINED_MAZES } from "../data/predefinedMazes.js";
import { loadMaze } from "../utils/gridUtils.js";

// ─── Task 13.1: Component integration tests ───────────────────────────────────

describe("App renders without errors", () => {
  it("renders the top navigation bar with the app title", () => {
    render(<App />);
    expect(screen.getByText("Maze Solver Visualizer")).toBeTruthy();
  });

  it("renders the Controls component", () => {
    render(<App />);
    expect(screen.getByText("Set Start")).toBeTruthy();
    expect(screen.getByText("Set End")).toBeTruthy();
    expect(screen.getByText("Draw Walls")).toBeTruthy();
  });

  it("renders algorithm selector buttons", () => {
    render(<App />);
    // BFS/DFS/A* appear in both Controls and AlgorithmPanel, so use getAllByText
    expect(screen.getAllByText("BFS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DFS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("A*").length).toBeGreaterThanOrEqual(1);
  });

  it("renders action buttons", () => {
    render(<App />);
    expect(screen.getByText("Visualize")).toBeTruthy();
    expect(screen.getByText("Clear Walls")).toBeTruthy();
    expect(screen.getByText("Reset Grid")).toBeTruthy();
  });

  it("renders the Legend component", () => {
    render(<App />);
    expect(screen.getByText("Legend")).toBeTruthy();
  });

  it("renders the MetricsPanel placeholder when no run has occurred", () => {
    render(<App />);
    expect(screen.getByText("Latest Run Metrics")).toBeTruthy();
    expect(
      screen.getByText("Run an algorithm to see metrics here."),
    ).toBeTruthy();
  });

  it("renders the ComparisonTable placeholder when no runs exist", () => {
    render(<App />);
    expect(screen.getByText("Comparison Table")).toBeTruthy();
    expect(
      screen.getByText(
        "No runs yet. Visualize an algorithm to populate this table.",
      ),
    ).toBeTruthy();
  });

  it("renders the AlgorithmPanel with all three algorithm descriptions", () => {
    render(<App />);
    // AlgorithmPanel shows algorithm names
    const bfsElements = screen.getAllByText("BFS");
    expect(bfsElements.length).toBeGreaterThanOrEqual(1);
    const dfsElements = screen.getAllByText("DFS");
    expect(dfsElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Error message display and dismissal", () => {
  it("shows error when Visualize is clicked without a start node", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Visualize"));
    expect(
      screen.getByText("Please set a start node before visualizing."),
    ).toBeTruthy();
  });

  it("shows error when Visualize is clicked without an end node", () => {
    render(<App />);
    // Set start mode and click a cell to place start
    fireEvent.click(screen.getByText("Set Start"));
    // Click the first cell in the grid (row 0, col 0)
    const cells = document.querySelectorAll(".w-6.h-6");
    fireEvent.mouseDown(cells[0]);
    fireEvent.mouseUp(cells[0]);

    // Now try to visualize without end node
    fireEvent.click(screen.getByText("Visualize"));
    expect(
      screen.getByText("Please set an end node before visualizing."),
    ).toBeTruthy();
  });

  it("dismisses error message when the close button is clicked", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Visualize"));
    // Error should be visible
    expect(
      screen.getByText("Please set a start node before visualizing."),
    ).toBeTruthy();
    // Click the dismiss button (✕)
    fireEvent.click(screen.getByText("✕"));
    // Error should be gone
    expect(
      screen.queryByText("Please set a start node before visualizing."),
    ).toBeNull();
  });

  it("clears error message when Reset Grid is clicked", () => {
    render(<App />);
    // Trigger an error
    fireEvent.click(screen.getByText("Visualize"));
    expect(
      screen.getByText("Please set a start node before visualizing."),
    ).toBeTruthy();
    // Reset grid should clear the error
    fireEvent.click(screen.getByText("Reset Grid"));
    expect(
      screen.queryByText("Please set a start node before visualizing."),
    ).toBeNull();
  });
});

describe("Controls disabled state when isRunning=true", () => {
  // We test the Controls component in isolation with isRunning=true
  // by importing and rendering it directly
  it("all Controls buttons are disabled when isRunning is true", async () => {
    const Controls = (await import("../components/Controls.jsx")).default;
    render(
      <Controls
        interactionMode="none"
        selectedAlgorithm="BFS"
        isRunning={true}
        onModeChange={() => {}}
        onAlgorithmChange={() => {}}
        onVisualize={() => {}}
        onClearWalls={() => {}}
        onResetGrid={() => {}}
        onLoadMaze={() => {}}
      />,
    );

    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it("all Controls buttons are enabled when isRunning is false", async () => {
    const Controls = (await import("../components/Controls.jsx")).default;
    render(
      <Controls
        interactionMode="none"
        selectedAlgorithm="BFS"
        isRunning={false}
        onModeChange={() => {}}
        onAlgorithmChange={() => {}}
        onVisualize={() => {}}
        onClearWalls={() => {}}
        onResetGrid={() => {}}
        onLoadMaze={() => {}}
      />,
    );

    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn.disabled).toBe(false);
    });
  });

  it("the maze loader select is disabled when isRunning is true", async () => {
    const Controls = (await import("../components/Controls.jsx")).default;
    render(
      <Controls
        interactionMode="none"
        selectedAlgorithm="BFS"
        isRunning={true}
        onModeChange={() => {}}
        onAlgorithmChange={() => {}}
        onVisualize={() => {}}
        onClearWalls={() => {}}
        onResetGrid={() => {}}
        onLoadMaze={() => {}}
      />,
    );

    const select = document.querySelector("select");
    expect(select.disabled).toBe(true);
  });
});

describe("Predefined mazes have valid start/end positions not on walls", () => {
  it("all 3 predefined mazes exist", () => {
    expect(PREDEFINED_MAZES).toHaveLength(3);
  });

  it("each predefined maze has a valid start position not on a wall", () => {
    for (const maze of PREDEFINED_MAZES) {
      const wallSet = new Set(maze.walls.map((w) => `${w.row},${w.col}`));
      const startKey = `${maze.start.row},${maze.start.col}`;
      expect(wallSet.has(startKey)).toBe(false);
    }
  });

  it("each predefined maze has a valid end position not on a wall", () => {
    for (const maze of PREDEFINED_MAZES) {
      const wallSet = new Set(maze.walls.map((w) => `${w.row},${w.col}`));
      const endKey = `${maze.end.row},${maze.end.col}`;
      expect(wallSet.has(endKey)).toBe(false);
    }
  });

  it("loading each predefined maze produces correct start/end in grid", () => {
    for (const maze of PREDEFINED_MAZES) {
      const grid = loadMaze(maze);
      expect(grid[maze.start.row][maze.start.col]).toBe("start");
      expect(grid[maze.end.row][maze.end.col]).toBe("end");
    }
  });

  it("loading each predefined maze produces correct wall positions in grid", () => {
    for (const maze of PREDEFINED_MAZES) {
      const grid = loadMaze(maze);
      for (const { row, col } of maze.walls) {
        // Walls should not overwrite start/end
        const cell = grid[row][col];
        expect(["wall", "start", "end"]).toContain(cell);
      }
    }
  });
});
