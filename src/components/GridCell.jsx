import React from "react";
import { getCellClass } from "../utils/colorMapping";

/**
 * Pure cell component rendering a single grid cell.
 * Uses React.memo to prevent re-renders when props haven't changed (Requirement 1.3).
 *
 * @param {{ state: string, row: number, col: number, onMouseDown: Function, onMouseEnter: Function, onMouseUp: Function }} props
 */
const GridCell = React.memo(function GridCell({
  state,
  row,
  col,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  return (
    <div
      className={`w-6 h-6 border border-gray-900 cursor-pointer transition-colors duration-100 ${getCellClass(state)}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    />
  );
});

export default GridCell;
