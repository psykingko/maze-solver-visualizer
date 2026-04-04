import { getCellClass } from "../utils/colorMapping";

const LEGEND_ITEMS = [
  { state: "start", label: "Start" },
  { state: "end", label: "End" },
  { state: "wall", label: "Wall" },
  { state: "visited", label: "Visited" },
  { state: "path", label: "Path" },
  { state: "empty", label: "Empty" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 bg-gray-900/80 rounded-xl border border-gray-700/60">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
        Legend
      </span>
      {LEGEND_ITEMS.map(({ state, label }) => (
        <div key={state} className="flex items-center gap-1.5">
          <span
            className={`w-3.5 h-3.5 rounded-sm inline-block border border-gray-600 flex-shrink-0 ${getCellClass(state)}`}
            aria-hidden="true"
          />
          <span className="text-xs text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
