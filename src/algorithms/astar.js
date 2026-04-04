/**
 * A* Search — min-heap priority queue ordered by f = g + h
 * h is Manhattan distance. Guarantees shortest path.
 *
 * @param {string[][]} grid - 20x20 grid of cell state strings
 * @param {{ row: number, col: number }} start
 * @param {{ row: number, col: number }} end
 * @returns {{ visitedOrder: {row,col}[], pathOrder: {row,col}[], nodesVisited: number, pathLength: number, timeTakenMs: number }}
 */
export function astar(grid, start, end) {
  const t0 = performance.now();

  const rows = grid.length;
  const cols = grid[0].length;
  const visitedOrder = [];

  const key = (r, c) => `${r},${c}`;
  const startKey = key(start.row, start.col);
  const endKey = key(end.row, end.col);

  const manhattan = (r, c) => Math.abs(r - end.row) + Math.abs(c - end.col);

  // Min-heap (priority queue) — stores { row, col, f, g }
  // Simple binary heap implementation
  const heap = [];

  const heapPush = (node) => {
    heap.push(node);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent].f <= heap[i].f) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  const heapPop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < heap.length && heap[l].f < heap[smallest].f) smallest = l;
        if (r < heap.length && heap[r].f < heap[smallest].f) smallest = r;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return top;
  };

  const gScore = new Map();
  const parent = new Map();
  const closed = new Set();

  gScore.set(startKey, 0);
  parent.set(startKey, null);
  heapPush({
    row: start.row,
    col: start.col,
    f: manhattan(start.row, start.col),
    g: 0,
  });

  const DIRS = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  let found = false;

  while (heap.length > 0) {
    const current = heapPop();
    const ck = key(current.row, current.col);

    if (closed.has(ck)) continue;
    closed.add(ck);

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
      if (closed.has(nk)) continue;
      if (grid[nr][nc] === "wall") continue;

      const tentativeG = current.g + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, tentativeG);
        parent.set(nk, { row: current.row, col: current.col });
        const f = tentativeG + manhattan(nr, nc);
        heapPush({ row: nr, col: nc, f, g: tentativeG });
      }
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

  return {
    visitedOrder,
    pathOrder,
    nodesVisited: visitedOrder.length,
    pathLength: pathOrder.length,
    timeTakenMs,
  };
}
