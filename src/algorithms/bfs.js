/**
 * BFS — Breadth-First Search
 * Uses a FIFO queue. Guarantees shortest path.
 *
 * @param {string[][]} grid - 20x20 grid of cell state strings
 * @param {{ row: number, col: number }} start
 * @param {{ row: number, col: number }} end
 * @returns {{ visitedOrder: {row,col}[], pathOrder: {row,col}[], nodesVisited: number, pathLength: number, timeTakenMs: number }}
 */
export function bfs(grid, start, end) {
  const t0 = performance.now();

  const rows = grid.length;
  const cols = grid[0].length;
  const visitedOrder = [];

  // parent map: "row,col" -> { row, col } | null
  const parent = new Map();
  const visited = new Set();

  const key = (r, c) => `${r},${c}`;
  const startKey = key(start.row, start.col);
  const endKey = key(end.row, end.col);

  const queue = [start];
  visited.add(startKey);
  parent.set(startKey, null);

  const DIRS = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    const ck = key(current.row, current.col);

    // Add to visitedOrder (skip start node itself)
    if (ck !== startKey) {
      visitedOrder.push({ row: current.row, col: current.col });
    }

    if (ck === endKey) {
      found = true;
      break;
    }

    for (const { dr, dc } of DIRS) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const nk = key(nr, nc);
      if (visited.has(nk)) continue;
      if (grid[nr][nc] === "wall") continue;

      visited.add(nk);
      parent.set(nk, { row: current.row, col: current.col });
      queue.push({ row: nr, col: nc });
    }
  }

  const timeTakenMs = performance.now() - t0;

  if (!found) {
    return {
      visitedOrder,
      pathOrder: [],
      nodesVisited: visitedOrder.length,
      pathLength: 0,
      timeTakenMs,
    };
  }

  // Reconstruct path from end back to start (excluding start and end)
  const pathOrder = [];
  let cur = { row: end.row, col: end.col };
  while (cur) {
    const ck = key(cur.row, cur.col);
    if (ck === startKey) break;
    if (ck !== endKey) {
      pathOrder.push({ row: cur.row, col: cur.col });
    }
    cur = parent.get(ck);
  }
  // pathOrder goes from end-adjacent back toward start-adjacent (end to start direction)

  return {
    visitedOrder,
    pathOrder,
    nodesVisited: visitedOrder.length,
    pathLength: pathOrder.length,
    timeTakenMs,
  };
}
