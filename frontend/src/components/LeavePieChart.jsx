import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function LeavePieChart({ dashboard }) {
  const leaves = dashboard?.leaves || {};

  const annualUsed = leaves.annualUsed || 0;
  const annualRemaining = leaves.annualRemaining ?? 20;
  const sickUsed = leaves.sickUsed || 0;
  const sickRemaining = leaves.sickRemaining ?? 8;

  const data = [
    { name: "Annual Used", value: annualUsed },
    { name: "Annual Remaining", value: annualRemaining },
    { name: "Sick Used", value: sickUsed },
    { name: "Sick Remaining", value: sickRemaining },
  ];

  const colors = ["#1e3a8a", "#60a5fa", "#dc2626", "#fca5a5"];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeavePieChart;