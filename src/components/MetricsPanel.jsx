export default function MetricsPanel({ latestRun }) {
  if (!latestRun) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Latest Run Metrics
        </h2>
        <p className="text-xs text-gray-500 italic">
          Run an algorithm to see metrics here.
        </p>
      </div>
    );
  }

  const { algorithm, nodesVisited, pathLength, timeTakenMs } = latestRun;

  const metrics = [
    { label: "Algorithm", value: algorithm, accent: "text-cyan-400" },
    { label: "Nodes Visited", value: nodesVisited, accent: "text-blue-400" },
    {
      label: "Path Length",
      value: pathLength === 0 ? "No path" : pathLength,
      accent: "text-orange-400",
    },
    {
      label: "Time Taken",
      value: `${timeTakenMs} ms`,
      accent: "text-green-400",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Latest Run Metrics
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(({ label, value, accent }) => (
          <div
            key={label}
            className="bg-gray-900 rounded-lg p-2 border border-gray-700"
          >
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className={`text-sm font-bold ${accent}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
