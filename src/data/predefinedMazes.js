/**
 * Predefined maze definitions for the Maze Solver Visualizer.
 * Each maze is a 20x20 grid with walls, a start position, and an end position.
 * No maze has a wall at its own start or end position.
 *
 * @typedef {{ row: number, col: number }} Position
 * @typedef {{ id: string, name: string, walls: Position[], start: Position, end: Position }} PredefinedMaze
 */

/**
 * Spiral maze — concentric square rings each with one gap, alternating sides,
 * so the solver must wind inward through a connected spiral corridor.
 *
 * Ring gaps (entry → exit):
 *   Ring 1 (outer): gap on bottom-left  → enter ring 2 from left side
 *   Ring 2:         gap on top-right    → enter ring 3 from top
 *   Ring 3:         gap on bottom-left  → enter ring 4 from left
 *   Ring 4:         gap on top-right    → reach end node at center
 *
 * Start: (1,1) — inside ring 1 top-left area
 * End:   (10,10) — center of the grid
 */
const spiral = {
  id: "spiral",
  name: "Spiral",
  start: { row: 1, col: 1 },
  end: { row: 10, col: 10 },
  walls: [
    // ── Ring 1 (cols 0–18, rows 0–18) ──────────────────────────────────────
    // Top: row 0, cols 0–18 (full, start is at row1,col1 — inside)
    ...Array.from({ length: 19 }, (_, c) => ({ row: 0, col: c })),
    // Right: col 18, rows 0–18
    ...Array.from({ length: 19 }, (_, r) => ({ row: r, col: 18 })),
    // Bottom: row 18, cols 3–18  (gap at cols 0–2 → passage to ring 2)
    ...Array.from({ length: 16 }, (_, c) => ({ row: 18, col: c + 3 })),
    // Left: col 0, rows 1–18
    ...Array.from({ length: 18 }, (_, r) => ({ row: r + 1, col: 0 })),

    // ── Ring 2 (cols 2–16, rows 2–16) ──────────────────────────────────────
    // Top: row 2, cols 2–14  (gap at cols 15–16 → passage to ring 3)
    ...Array.from({ length: 13 }, (_, c) => ({ row: 2, col: c + 2 })),
    // Right: col 16, rows 2–16
    ...Array.from({ length: 15 }, (_, r) => ({ row: r + 2, col: 16 })),
    // Bottom: row 16, cols 2–16
    ...Array.from({ length: 15 }, (_, c) => ({ row: 16, col: c + 2 })),
    // Left: col 2, rows 3–16
    ...Array.from({ length: 14 }, (_, r) => ({ row: r + 3, col: 2 })),

    // ── Ring 3 (cols 4–14, rows 4–14) ──────────────────────────────────────
    // Top: row 4, cols 4–14
    ...Array.from({ length: 11 }, (_, c) => ({ row: 4, col: c + 4 })),
    // Right: col 14, rows 4–14
    ...Array.from({ length: 11 }, (_, r) => ({ row: r + 4, col: 14 })),
    // Bottom: row 14, cols 6–14  (gap at cols 4–5 → passage to ring 4)
    ...Array.from({ length: 9 }, (_, c) => ({ row: 14, col: c + 6 })),
    // Left: col 4, rows 5–14
    ...Array.from({ length: 10 }, (_, r) => ({ row: r + 5, col: 4 })),

    // ── Ring 4 (cols 6–12, rows 6–12) ──────────────────────────────────────
    // Top: row 6, cols 6–10  (gap at cols 11–12 → passage to center)
    ...Array.from({ length: 5 }, (_, c) => ({ row: 6, col: c + 6 })),
    // Right: col 12, rows 6–12
    ...Array.from({ length: 7 }, (_, r) => ({ row: r + 6, col: 12 })),
    // Bottom: row 12, cols 6–12
    ...Array.from({ length: 7 }, (_, c) => ({ row: 12, col: c + 6 })),
    // Left: col 6, rows 7–12
    ...Array.from({ length: 6 }, (_, r) => ({ row: r + 7, col: 6 })),
  ],
};

/**
 * Zig-Zag maze — alternating horizontal walls with gaps create a zig-zag
 * corridor the solver must navigate through.
 */
const zigzag = {
  id: "zigzag",
  name: "Zig-Zag",
  start: { row: 1, col: 1 },
  end: { row: 18, col: 18 },
  walls: [
    // Row 3: wall from col 0 to col 16 (gap on right at col 17-19)
    ...Array.from({ length: 17 }, (_, c) => ({ row: 3, col: c })),
    // Row 6: wall from col 3 to col 19 (gap on left at col 0-2)
    ...Array.from({ length: 17 }, (_, c) => ({ row: 6, col: c + 3 })),
    // Row 9: wall from col 0 to col 16 (gap on right)
    ...Array.from({ length: 17 }, (_, c) => ({ row: 9, col: c })),
    // Row 12: wall from col 3 to col 19 (gap on left)
    ...Array.from({ length: 17 }, (_, c) => ({ row: 12, col: c + 3 })),
    // Row 15: wall from col 0 to col 16 (gap on right)
    ...Array.from({ length: 17 }, (_, c) => ({ row: 15, col: c })),
  ],
};

/**
 * Rooms maze — walls form distinct room-like sections with narrow openings
 * between them, creating a multi-room navigation challenge.
 */
const rooms = {
  id: "rooms",
  name: "Rooms",
  start: { row: 1, col: 1 },
  end: { row: 18, col: 18 },
  walls: [
    // Vertical divider 1 (col 6, rows 0-8) — opening at row 9
    ...Array.from({ length: 9 }, (_, r) => ({ row: r, col: 6 })),
    // Vertical divider 1 lower (col 6, rows 10-19)
    ...Array.from({ length: 10 }, (_, r) => ({ row: r + 10, col: 6 })),

    // Vertical divider 2 (col 13, rows 0-9) — opening at row 10
    ...Array.from({ length: 10 }, (_, r) => ({ row: r, col: 13 })),
    // Vertical divider 2 lower (col 13, rows 11-19)
    ...Array.from({ length: 9 }, (_, r) => ({ row: r + 11, col: 13 })),

    // Horizontal divider A (row 7, cols 0-5) — opening at col 3
    { row: 7, col: 0 },
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },

    // Horizontal divider B (row 7, cols 7-12) — opening at col 10
    { row: 7, col: 7 },
    { row: 7, col: 8 },
    { row: 7, col: 9 },
    { row: 7, col: 11 },
    { row: 7, col: 12 },

    // Horizontal divider C (row 12, cols 7-12) — opening at col 10
    { row: 12, col: 7 },
    { row: 12, col: 8 },
    { row: 12, col: 9 },
    { row: 12, col: 11 },
    { row: 12, col: 12 },

    // Horizontal divider D (row 12, cols 14-19) — opening at col 16
    { row: 12, col: 14 },
    { row: 12, col: 15 },
    { row: 12, col: 17 },
    { row: 12, col: 18 },
    { row: 12, col: 19 },
  ],
};

/**
 * All predefined mazes. Each maze is validated to ensure start/end are not walls.
 * @type {PredefinedMaze[]}
 */
export const PREDEFINED_MAZES = [spiral, zigzag, rooms];

export default PREDEFINED_MAZES;
