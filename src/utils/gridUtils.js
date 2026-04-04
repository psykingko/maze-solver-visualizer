const ROWS = 20;
const COLS = 20;

/**
 * Creates a fresh 20×20 grid filled with "empty" cells.
 * @returns {string[][]}
 */
export function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill("empty"));
}

/**
 * Places a "start" or "end" node at the given position.
 * Clears any previous node of the same type.
 * Ignores if the target cell already holds the opposite node type.
 * @param {string[][]} grid
 * @param {number} row
 * @param {number} col
 * @param {'start'|'end'} nodeType
 * @returns {string[][]}
 */
export function placeNode(grid, row, col, nodeType) {
  const opposite = nodeType === "start" ? "end" : "start";

  // Ignore if target cell is the opposite node
  if (grid[row][col] === opposite) {
    return grid;
  }

  // Build new grid: clear previous node of same type, set new position
  return grid.map((r, ri) =>
    r.map((cell, ci) => {
      if (ri === row && ci === col) return nodeType;
      if (cell === nodeType) return "empty"; // clear previous
      return cell;
    }),
  );
}

/**
 * Toggles a cell between "empty" and "wall".
 * Ignores if the cell is "start" or "end".
 * @param {string[][]} grid
 * @param {number} row
 * @param {number} col
 * @returns {string[][]}
 */
export function toggleWall(grid, row, col) {
  const cell = grid[row][col];
  if (cell === "start" || cell === "end") return grid;

  return grid.map((r, ri) =>
    r.map((c, ci) => {
      if (ri === row && ci === col) {
        return c === "wall" ? "empty" : "wall";
      }
      return c;
    }),
  );
}

/**
 * Sets all "wall", "visited", and "path" cells to "empty".
 * Preserves "start" and "end" cells.
 * @param {string[][]} grid
 * @returns {string[][]}
 */
export function clearWalls(grid) {
  return grid.map((row) =>
    row.map((cell) => {
      if (cell === "wall" || cell === "visited" || cell === "path") {
        return "empty";
      }
      return cell;
    }),
  );
}

/**
 * Clears only "visited" and "path" cells back to "empty".
 * Preserves "wall", "start", and "end" cells.
 * @param {string[][]} grid
 * @returns {string[][]}
 */
export function clearVisualization(grid) {
  return grid.map((row) =>
    row.map((cell) => (cell === "visited" || cell === "path" ? "empty" : cell)),
  );
}

/**
 * Returns a fresh 20×20 all-empty grid (same as createEmptyGrid).
 * @returns {string[][]}
 */
export function resetGrid() {
  return createEmptyGrid();
}

/**
 * Builds a grid from a maze definition object.
 * @param {{ walls: {row:number,col:number}[], start: {row:number,col:number}, end: {row:number,col:number} }} mazeDefinition
 * @returns {string[][]}
 */
export function loadMaze(mazeDefinition) {
  const { walls, start, end } = mazeDefinition;
  let grid = createEmptyGrid();

  for (const { row, col } of walls) {
    grid = grid.map((r, ri) =>
      r.map((cell, ci) => (ri === row && ci === col ? "wall" : cell)),
    );
  }

  if (start) {
    grid = grid.map((r, ri) =>
      r.map((cell, ci) =>
        ri === start.row && ci === start.col ? "start" : cell,
      ),
    );
  }

  if (end) {
    grid = grid.map((r, ri) =>
      r.map((cell, ci) => (ri === end.row && ci === end.col ? "end" : cell)),
    );
  }

  return grid;
}
