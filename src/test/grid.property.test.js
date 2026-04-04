// Feature: maze-solver-visualizer
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  createEmptyGrid,
  placeNode,
  toggleWall,
  clearWalls,
  resetGrid,
} from "../utils/gridUtils.js";

const ROWS = 20;
const COLS = 20;

// Arbitraries
const validPos = fc.record({
  row: fc.integer({ min: 0, max: ROWS - 1 }),
  col: fc.integer({ min: 0, max: COLS - 1 }),
});

const cellState = fc.constantFrom(
  "empty",
  "wall",
  "start",
  "end",
  "visited",
  "path",
);

/** Build an arbitrary grid by applying random mutations to an empty grid */
const arbitraryGrid = fc
  .array(
    fc.record({
      row: fc.integer({ min: 0, max: ROWS - 1 }),
      col: fc.integer({ min: 0, max: COLS - 1 }),
      state: cellState,
    }),
    { minLength: 0, maxLength: 50 },
  )
  .map((mutations) => {
    let grid = createEmptyGrid();
    for (const { row, col, state } of mutations) {
      if (state === "start" || state === "end") {
        grid = placeNode(grid, row, col, state);
      } else if (state === "wall") {
        // Only toggle to wall if not start/end
        if (grid[row][col] !== "start" && grid[row][col] !== "end") {
          grid = grid.map((r, ri) =>
            r.map((c, ci) => (ri === row && ci === col ? "wall" : c)),
          );
        }
      }
    }
    return grid;
  });

// Property 1: Grid dimensions invariant
// Validates: Requirements 1.1
describe("Property 1: Grid dimensions invariant", () => {
  it("createEmptyGrid always returns 20×20", () => {
    const grid = createEmptyGrid();
    expect(grid).toHaveLength(ROWS);
    grid.forEach((row) => expect(row).toHaveLength(COLS));
  });

  it("grid dimensions remain 20×20 after any sequence of mutations", () => {
    fc.assert(
      fc.property(arbitraryGrid, (grid) => {
        expect(grid).toHaveLength(ROWS);
        grid.forEach((row) => expect(row).toHaveLength(COLS));
      }),
      { numRuns: 100 },
    );
  });

  it("resetGrid always returns 20×20", () => {
    fc.assert(
      fc.property(arbitraryGrid, (grid) => {
        const reset = resetGrid(grid);
        expect(reset).toHaveLength(ROWS);
        reset.forEach((row) => expect(row).toHaveLength(COLS));
      }),
      { numRuns: 100 },
    );
  });
});

// Property 3: Placing a node sets exactly one cell to that state
// Validates: Requirements 2.1, 2.2
describe("Property 3: Placing a node sets exactly one cell to that state", () => {
  it("after placeNode, exactly one cell has the nodeType state at the target position", () => {
    fc.assert(
      fc.property(
        arbitraryGrid,
        validPos,
        fc.constantFrom("start", "end"),
        (grid, pos, nodeType) => {
          const opposite = nodeType === "start" ? "end" : "start";
          // Skip if target is the opposite node
          if (grid[pos.row][pos.col] === opposite) return;

          const newGrid = placeNode(grid, pos.row, pos.col, nodeType);
          const count = newGrid.flat().filter((c) => c === nodeType).length;
          expect(count).toBe(1);
          expect(newGrid[pos.row][pos.col]).toBe(nodeType);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Property 4: Cannot overwrite opposite node
// Validates: Requirements 2.3, 2.4
describe("Property 4: Cannot overwrite opposite node", () => {
  it("placing start on end cell leaves grid unchanged", () => {
    fc.assert(
      fc.property(validPos, validPos, (startPos, endPos) => {
        // Ensure different positions
        if (startPos.row === endPos.row && startPos.col === endPos.col) return;

        let grid = createEmptyGrid();
        grid = placeNode(grid, startPos.row, startPos.col, "start");
        grid = placeNode(grid, endPos.row, endPos.col, "end");

        // Try to place start on end position — should be ignored
        const newGrid = placeNode(grid, endPos.row, endPos.col, "start");
        expect(newGrid[endPos.row][endPos.col]).toBe("end");
        expect(newGrid[startPos.row][startPos.col]).toBe("start");
      }),
      { numRuns: 100 },
    );
  });

  it("placing end on start cell leaves grid unchanged", () => {
    fc.assert(
      fc.property(validPos, validPos, (startPos, endPos) => {
        if (startPos.row === endPos.row && startPos.col === endPos.col) return;

        let grid = createEmptyGrid();
        grid = placeNode(grid, startPos.row, startPos.col, "start");
        grid = placeNode(grid, endPos.row, endPos.col, "end");

        // Try to place end on start position — should be ignored
        const newGrid = placeNode(grid, startPos.row, startPos.col, "end");
        expect(newGrid[startPos.row][startPos.col]).toBe("start");
        expect(newGrid[endPos.row][endPos.col]).toBe("end");
      }),
      { numRuns: 100 },
    );
  });
});

// Property 5: Wall toggle round-trip
// Validates: Requirements 3.1, 3.2, 3.4
describe("Property 5: Wall toggle round-trip", () => {
  it("toggling an empty cell twice returns it to empty", () => {
    fc.assert(
      fc.property(validPos, (pos) => {
        const grid = createEmptyGrid();
        const toggled = toggleWall(grid, pos.row, pos.col);
        const restored = toggleWall(toggled, pos.row, pos.col);
        expect(restored[pos.row][pos.col]).toBe("empty");
      }),
      { numRuns: 100 },
    );
  });

  it("toggling a wall cell produces empty", () => {
    fc.assert(
      fc.property(validPos, (pos) => {
        let grid = createEmptyGrid();
        // Force cell to wall
        grid = grid.map((r, ri) =>
          r.map((c, ci) => (ri === pos.row && ci === pos.col ? "wall" : c)),
        );
        const toggled = toggleWall(grid, pos.row, pos.col);
        expect(toggled[pos.row][pos.col]).toBe("empty");
      }),
      { numRuns: 100 },
    );
  });

  it("toggleWall never affects start or end cells", () => {
    fc.assert(
      fc.property(
        validPos,
        fc.constantFrom("start", "end"),
        (pos, nodeType) => {
          let grid = createEmptyGrid();
          grid = placeNode(grid, pos.row, pos.col, nodeType);
          const toggled = toggleWall(grid, pos.row, pos.col);
          expect(toggled[pos.row][pos.col]).toBe(nodeType);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Property 7: Clear walls removes walls, visited, and path; preserves start and end
// Validates: Requirements 4.1, 4.4
describe("Property 7: clearWalls removes walls/visited/path, preserves start/end", () => {
  it("after clearWalls, no cell is wall, visited, or path", () => {
    fc.assert(
      fc.property(arbitraryGrid, (grid) => {
        const cleared = clearWalls(grid);
        const flat = cleared.flat();
        expect(flat.some((c) => c === "wall")).toBe(false);
        expect(flat.some((c) => c === "visited")).toBe(false);
        expect(flat.some((c) => c === "path")).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("after clearWalls, start and end positions are preserved", () => {
    fc.assert(
      fc.property(validPos, validPos, (startPos, endPos) => {
        if (startPos.row === endPos.row && startPos.col === endPos.col) return;

        let grid = createEmptyGrid();
        grid = placeNode(grid, startPos.row, startPos.col, "start");
        grid = placeNode(grid, endPos.row, endPos.col, "end");

        const cleared = clearWalls(grid);
        expect(cleared[startPos.row][startPos.col]).toBe("start");
        expect(cleared[endPos.row][endPos.col]).toBe("end");
      }),
      { numRuns: 100 },
    );
  });
});

// Property 8: Reset grid produces all-empty grid
// Validates: Requirements 4.2
describe("Property 8: resetGrid produces all-empty grid", () => {
  it("after resetGrid, every cell is empty", () => {
    fc.assert(
      fc.property(arbitraryGrid, (grid) => {
        const reset = resetGrid(grid);
        const flat = reset.flat();
        expect(flat.every((c) => c === "empty")).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
