import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import AttendanceChart from "../components/AttendanceChart";
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
        console.log("Dashboard error:", error.response?.data);
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
  const attendance = dashboard.attendance || {};
  const leaves = dashboard.leaves || {};
  const activities = dashboard.activities || [];

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
            <HeroKPI title="Attendance" value={`${attendance.percentage || 0}%`} sub="Minimum 90%" />
            <HeroKPI title="Present Days" value={attendance.presentDays || 0} sub="This month" />
            <HeroKPI
              title="Leave Balance"
              value={`${(leaves.annualRemaining || 0) + (leaves.sickRemaining || 0)} Days`}
              sub="Remaining"
            />
            <HeroKPI
              title="WFH Balance"
              value={`${wfh?.remaining ?? 12} / ${wfh?.yearlyQuota || 12}`}
              sub="Yearly allocation"
            />
          </div>
        </section>

      

        <section className="pro-grid two">
          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Attendance Trend</h2>
              <span>Last 6 months</span>
            </div>
            <AttendanceChart />
          </div>

          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Leave Distribution</h2>
              <span>Current year</span>
            </div>
            <LeavePieChart dashboard={dashboard} />
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
              <h3>
                {new Date(item.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </h3>
              <p>{item.status} WFH Day</p>
            </div>
            <span>{item.status}</span>
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

function WorkCard({ title, value, sub }) {
  return (
    <div className="work-card">
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{sub}</span>
    </div>
  );
}

export default Dashboard;