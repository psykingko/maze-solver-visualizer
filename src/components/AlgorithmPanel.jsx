const ALGORITHMS = [
  {
    id: "BFS",
    name: "BFS",
    fullName: "Breadth-First Search",
    badge: "Shortest Path",
    badgeColor: "text-green-400",
    tagline: "Explores level by level",
    description:
      "BFS systematically explores all cells at the current distance before moving further. It uses a queue to process nodes in order, making it ideal for finding the shortest path in unweighted grids where every step has equal cost.",
    bullets: [
      "Visits all neighbors before going deeper",
      "Guarantees the shortest path",
      "Best for unweighted grids",
      "Uses a queue (FIFO)",
    ],
    accentFrom: "from-cyan-500",
    accentTo: "to-blue-500",
    borderActive: "border-cyan-500",
    glowActive: "shadow-[0_0_12px_rgba(6,182,212,0.35)]",
  },
  {
    id: "DFS",
    name: "DFS",
    fullName: "Depth-First Search",
    badge: "No Guarantee",
    badgeColor: "text-yellow-400",
    tagline: "Dives deep before backtracking",
    description:
      "DFS follows a single path as far as possible before backtracking to try alternatives. It uses a stack and tends to find a path quickly, but that path may be far from optimal. Great for exploring maze structure rather than finding the best route.",
    bullets: [
      "Follows one branch as far as possible",
      "Does not guarantee shortest path",
      "Memory efficient on sparse graphs",
      "Uses a stack (LIFO)",
    ],
    accentFrom: "from-yellow-500",
    accentTo: "to-orange-500",
    borderActive: "border-yellow-500",
    glowActive: "shadow-[0_0_12px_rgba(234,179,8,0.3)]",
  },
  {
    id: "Astar",
    name: "A*",
    fullName: "A* Search",
    badge: "Shortest Path",
    badgeColor: "text-green-400",
    tagline: "Guided by Manhattan heuristic",
    description:
      "A* combines the cost to reach a cell with an estimated cost to the goal (heuristic). Using Manhattan distance, it prioritises cells that are both reachable cheaply and close to the end — making it significantly faster than BFS while still guaranteeing the shortest path.",
    bullets: [
      "Combines cost + heuristic (f = g + h)",
      "Prioritises cells closer to the end",
      "Guarantees the shortest path",
      "Faster than BFS in practice",
    ],
    accentFrom: "from-purple-500",
    accentTo: "to-pink-500",
    borderActive: "border-purple-500",
    glowActive: "shadow-[0_0_12px_rgba(168,85,247,0.35)]",
  },
];

/**
 * compact=false  → tall 3-column cards filling available height (pre-run)
 * compact=true   → 3-column strip with bullets (post-run, below analytics)
 */
export default function AlgorithmPanel({ selectedAlgorithm, compact = false }) {
  if (compact) {
    return (
      <div className="bg-gray-900/60 rounded-xl border border-gray-700/60 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Algorithm Info
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {ALGORITHMS.map((algo) => {
            const isSelected = selectedAlgorithm === algo.id;
            return (
              <div
                key={algo.id}
                className={`flex-1 rounded-lg p-3 border transition-colors ${
                  isSelected
                    ? `${algo.borderActive} bg-gray-800 ${algo.glowActive}`
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-bold text-xs ${isSelected ? "text-white" : "text-gray-300"}`}
                  >
                    {algo.name}
                    <span className="ml-1 font-normal text-gray-500">
                      — {algo.fullName}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-semibold ${algo.badgeColor} ml-2 flex-shrink-0`}
                  >
                    {algo.badge}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-300 mb-2">
                  {algo.tagline}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {algo.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-1.5 text-xs text-gray-400"
                    >
                      <span
                        className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br ${algo.accentFrom} ${algo.accentTo}`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Tall cards — pre-run state
  return (
    <div className="flex flex-col h-full">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
        Algorithm Info
      </p>
      <div className="flex flex-col gap-3 sm:flex-row flex-1">
        {ALGORITHMS.map((algo) => {
          const isSelected = selectedAlgorithm === algo.id;
          return (
            <div
              key={algo.id}
              className={`flex-1 rounded-xl border p-4 flex flex-col transition-all ${
                isSelected
                  ? `${algo.borderActive} bg-gray-800 ${algo.glowActive}`
                  : "border-gray-700 bg-gray-800/60"
              }`}
            >
              {/* Gradient badge */}
              <div
                className={`inline-flex items-center mb-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${algo.accentFrom} ${algo.accentTo} w-fit`}
              >
                <span className="text-white font-bold text-sm">
                  {algo.name}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-0.5">{algo.fullName}</p>
              <p className={`text-xs font-semibold ${algo.badgeColor} mb-3`}>
                {algo.badge}
              </p>

              <p className="text-sm font-semibold text-gray-200 mb-2">
                {algo.tagline}
              </p>

              {/* Short paragraph */}
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {algo.description}
              </p>

              {/* Bullet points pushed to bottom */}
              <ul className="flex flex-col gap-2 mt-auto">
                {algo.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-xs text-gray-400"
                  >
                    <span
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br ${algo.accentFrom} ${algo.accentTo}`}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
