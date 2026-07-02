import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import TeamWFHToday from "../components/TeamWFHToday";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [wfh, setWfh] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashRes, wfhRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/wfh/my"),
        ]);

        setDashboard(dashRes.data);
        setWfh(wfhRes.data);
      } catch (error) {
        console.log("Dashboard error:", error.response?.data || error.message);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  const employee = dashboard.employee || {};
  const leaves = dashboard.leaves || {};
  const records = wfh?.requests || [];

  const used = records.filter((x) => x.status === "Used").length;
  const shifted = records.filter((x) => x.status === "Shifted").length;
  const upcoming = records.filter(
    (x) => x.status === "Allocated" || x.status === "Shifted"
  ).length;

  return (
    <DashboardLayout>
      <div className="dashboard-pro">
        <section className="hero-pro">
          <p>Employee Workforce Management Portal</p>

          <h1>Welcome back, {employee.name || "Employee"}</h1>

          <span>
            {employee.employeeId || "N/A"} • {employee.department || "N/A"} •{" "}
            {employee.location || "N/A"}
          </span>

          <div className="hero-kpis">
            <HeroKPI
              title="Annual Leave"
              value={`${leaves.annualRemaining || 0} Days`}
              sub={`${leaves.annualUsed || 0} used of ${leaves.annualQuota || 20}`}
            />

            <HeroKPI
              title="Sick Leave"
              value={`${leaves.sickRemaining || 0} Days`}
              sub={`${leaves.sickUsed || 0} used of ${leaves.sickQuota || 8}`}
            />

            <HeroKPI
              title="WFH Used"
              value={used}
              sub="Completed days"
            />

            <HeroKPI
              title="WFH Balance"
              value={`${wfh?.remaining ?? upcoming} / ${wfh?.yearlyQuota || 24}`}
              sub="WFH left"
            />
          </div>
        </section>

        <section className="pro-grid two">
          <TeamWFHToday />

          <div className="pro-card">
            <div className="pro-card-head">
              <h2>WFH Summary</h2>
              <span>Current year</span>
            </div>

            <div className="summary-progress-list">
              <ProgressRow title="Used WFH" value={used} total={wfh?.yearlyQuota || 24} />
              <ProgressRow title="Upcoming WFH" value={upcoming} total={wfh?.yearlyQuota || 24} />
              <ProgressRow title="Shifted WFH" value={shifted} total={wfh?.yearlyQuota || 24} />
            </div>
          </div>
        </section>
        
<section className="pro-grid two">

    {/* WFH Distribution */}
    <div className="pro-card">
        <div className="pro-card-head">
            <h2>WFH Distribution</h2>
            <span>Current Year</span>
        </div>

        <WFHPieChart records={records} />
    </div>

    {/* Company Policy */}
    <div className="pro-card">
        <div className="pro-card-head">
            <h2>Company WFH Policy</h2>
            <span>Current Rules</span>
        </div>

        <div className="policy-list">

            <div className="policy-item">
                <h4>Annual WFH Quota</h4>
                <p>24 Work From Home days per calendar year.</p>
            </div>

            <div className="policy-item">
                <h4>Monthly Allocation</h4>
                <p>2 system allocated WFH days every month.</p>
            </div>

            <div className="policy-item">
                <h4>Swap Policy</h4>
                <p>Employee swap requests require manager approval.</p>
            </div>

            <div className="policy-item">
                <h4>Postpone Policy</h4>
                <p>Allocated WFH dates can be postponed subject to manager approval.</p>
            </div>

            <div className="policy-item">
                <h4>Attendance Requirement</h4>
                <p>Maintain minimum attendance as per company policy to remain eligible for WFH.</p>
            </div>

        </div>
    </div>

</section>
      </div>
    </DashboardLayout>
  );
}

function HeroKPI({ title, value, sub }) {
  return (
    <div className="hero-kpi-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{sub}</span>
    </div>
  );
}

function ProgressRow({ title, value, total }) {
  const percent = total ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="progress-row">
      <div>
        <p>{title}</p>
        <span>
          {value} / {total}
        </span>
      </div>

      <div className="progress-track">
        <b style={{ width: `${percent}%` }}></b>
      </div>
    </div>
  );
}
function WFHPieChart({ records }) {
  const used = records.filter((x) => x.status === "Used").length;
  const upcoming = records.filter(
    (x) => x.status === "Allocated" || x.status === "Shifted"
  ).length;
  const shifted = records.filter((x) => x.status === "Shifted").length;

  const data = [
    { name: "Used", value: used },
    { name: "Upcoming", value: upcoming },
    { name: "Shifted", value: shifted },
  ];

  return (
    <div className="chart-safe-box">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105}>
            <Cell fill="#2563eb" />
            <Cell fill="#22c55e" />
            <Cell fill="#f97316" />
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}



export default Dashboard;