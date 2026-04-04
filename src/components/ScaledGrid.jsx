import { useEffect, useState } from "react";
import MazeGrid from "./MazeGrid";

const GRID_PX = 480; // 20 cells × 24px (w-6)

/**
 * Wraps MazeGrid in a container that scales it down on smaller screens
 * while keeping the logical grid size (and thus interaction coords) unchanged.
 * On lg+ screens (≥1024px) it renders at full 1:1 scale.
 */
export default function ScaledGrid({
  grid,
  isRunning,
  onCellInteract,
  onDragStart,
  onDragEnd,
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1024) setScale(1);
      else if (w >= 768) setScale(0.88);
      else if (w >= 640) setScale(0.72);
      else if (w >= 480) setScale(0.58);
      else setScale(0.46);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const displaySize = Math.round(GRID_PX * scale);

  return (
    <div
      className="p-2 bg-gray-900 rounded-xl border border-gray-800 shadow-xl shadow-black/40"
      style={{ width: displaySize + 16, height: displaySize + 16 }} // +16 for p-2 (8px each side)
    >
      <div
        style={{
          width: GRID_PX,
          height: GRID_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <MazeGrid
          grid={grid}
          isRunning={isRunning}
          onCellInteract={onCellInteract}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </div>
    </div>
  );
}
