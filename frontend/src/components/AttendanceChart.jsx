import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AttendanceChart() {
  const data = [
    { month: "Jan", attendance: 94 },
    { month: "Feb", attendance: 96 },
    { month: "Mar", attendance: 97 },
    { month: "Apr", attendance: 95 },
    { month: "May", attendance: 98 },
    { month: "Jun", attendance: 98 },
  ];

  return (
    <div className="w-full h-[330px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[80, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#1e3a8a"
            strokeWidth={4}
            dot={{
              r: 6,
              strokeWidth: 3,
              fill: "#ffffff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;