export default function ComparisonTable({ runs }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Comparison Table
      </h2>
      {runs.length === 0 ? (
        <p className="text-xs text-gray-500 italic">
          No runs yet. Visualize an algorithm to populate this table.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-semibold pb-2 pr-3">
                  #
                </th>
                <th className="text-left text-gray-400 font-semibold pb-2 pr-3">
                  Algorithm
                </th>
                <th className="text-right text-gray-400 font-semibold pb-2 pr-3">
                  Nodes Visited
                </th>
                <th className="text-right text-gray-400 font-semibold pb-2 pr-3">
                  Path Length
                </th>
                <th className="text-right text-gray-400 font-semibold pb-2">
                  Time (ms)
                </th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-2 pr-3 text-gray-500">{index + 1}</td>
                  <td className="py-2 pr-3 font-medium text-cyan-400">
                    {run.algorithm}
                  </td>
                  <td className="py-2 pr-3 text-right text-blue-400">
                    {run.nodesVisited}
                  </td>
                  <td className="py-2 pr-3 text-right text-purple-400">
                    {run.pathLength === 0 ? (
                      <span className="text-gray-500 italic">No path</span>
                    ) : (
                      run.pathLength
                    )}
                  </td>
                  <td className="py-2 text-right text-green-400">
                    {run.timeTakenMs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
