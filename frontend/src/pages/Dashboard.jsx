import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import LeavePieChart from "../components/LeavePieChart";
import api from "../services/api";
import TeamWFHToday from "../components/TeamWFHToday";

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

  const totalLeaveRemaining =
    (leaves.annualRemaining || 0) + (leaves.sickRemaining || 0);

  const upcomingWFH = (wfh?.requests || [])
    .filter((item) => new Date(item.date) >= new Date())
    .slice(0, 4);

  return (
    <DashboardLayout>
      <div className="dashboard-pro">
        <section className="hero-pro">
          <div>
            <p>Employee Workforce Management Portal</p>
            <h1>Welcome back, {employee.name || "Employee"}</h1>
            <span>
              {employee.employeeId || "N/A"} • {employee.department || "N/A"} •{" "}
              {employee.location || "N/A"}
            </span>
          </div>

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
              title="Leave Balance"
              value={`${totalLeaveRemaining} Days`}
              sub="Total remaining"
            />

            <HeroKPI
              title="WFH Balance"
              value={`${wfh?.left ?? wfh?.remaining ?? 0} / ${
                wfh?.yearlyQuota || 24
              }`}
              sub="WFH left"
            />
          </div>
        </section>

        <section className="pro-grid two">
          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Leave Distribution</h2>
              <span>Current year</span>
            </div>

            <LeavePieChart dashboard={dashboard} />
          </div>

          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Leave & WFH Summary</h2>
              <span>Live Overview</span>
            </div>

            <div className="summary-progress-list">
              <ProgressRow
                title="Annual Leave Used"
                value={leaves.annualUsed || 0}
                total={leaves.annualQuota || 20}
              />

              <ProgressRow
                title="Sick Leave Used"
                value={leaves.sickUsed || 0}
                total={leaves.sickQuota || 8}
              />

              <ProgressRow
                title="WFH Used"
                value={wfh?.used || 0}
                total={wfh?.yearlyQuota || 24}
              />

              <ProgressRow
                title="WFH Left"
                value={wfh?.left ?? wfh?.remaining ?? 0}
                total={wfh?.yearlyQuota || 24}
              />
            </div>
          </div>
        </section>

        <section className="pro-grid two">
          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Upcoming WFH Days</h2>
              <Link to="/wfh">View All</Link>
            </div>

            <div className="professional-list">
              {upcomingWFH.length === 0 ? (
                <p className="empty-text">No upcoming WFH days found.</p>
              ) : (
                upcomingWFH.map((item) => (
                  <div className="professional-row" key={item._id}>
                    <div>
                      <h3>{formatDate(item.date)}</h3>
                      <p>{item.status} WFH Day</p>
                    </div>

                    <span
                      className={`status-pill ${item.status?.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <TeamWFHToday />
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

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default Dashboard;