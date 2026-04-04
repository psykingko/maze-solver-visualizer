import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartComponent({ runs }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Performance Chart
      </h2>
      {runs.length === 0 ? (
        <p className="text-xs text-gray-500 italic">
          No runs yet. Visualize an algorithm to populate this chart.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={runs.map((run, index) => ({
              name: `#${index + 1} ${run.algorithm}`,
              "Nodes Visited": run.nodesVisited,
              "Path Length": run.pathLength,
              "Time (ms)": run.timeTakenMs,
            }))}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f9fafb",
              }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }} />
            <Bar dataKey="Nodes Visited" fill="#60a5fa" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Path Length" fill="#fb923c" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Time (ms)" fill="#34d399" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
