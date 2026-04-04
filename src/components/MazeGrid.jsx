import React, { useRef, useCallback } from "react";
import GridCell from "./GridCell";

/**
 * Renders a 20×20 grid of GridCell components.
 * Handles drag interactions internally and propagates events to parent.
 *
 * @param {{ grid: string[][], isRunning: boolean, onCellInteract: Function, onDragStart: Function, onDragEnd: Function }} props
 */
function MazeGrid({ grid, isRunning, onCellInteract, onDragStart, onDragEnd }) {
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (row, col) => {
      if (isRunning) return;
      isDragging.current = true;
      onDragStart();
      onCellInteract(row, col);
    },
    [isRunning, onDragStart, onCellInteract],
  );

  const handleMouseEnter = useCallback(
    (row, col) => {
      if (isRunning || !isDragging.current) return;
      onCellInteract(row, col);
    },
    [isRunning, onCellInteract],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    onDragEnd();
  }, [onDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      onDragEnd();
    }
  }, [onDragEnd]);

  return (
    <div
      className="inline-block select-none"
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((cellState, colIdx) => (
            <GridCell
              key={colIdx}
              state={cellState}
              row={rowIdx}
              col={colIdx}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default MazeGrid;
