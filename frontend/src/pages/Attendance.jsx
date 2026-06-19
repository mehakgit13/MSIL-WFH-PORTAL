import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AttendanceChart from "../components/AttendanceChart";
import api from "../services/api";

function Attendance() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const res = await api.get("/dashboard");
        setDashboard(res.data);
      } catch (error) {
        console.log("Attendance error:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading attendance...</div>
      </DashboardLayout>
    );
  }

  const attendance = dashboard?.attendance || {};

  const percentage = attendance.percentage || 0;
  const presentDays = attendance.presentDays || 0;
  const totalRecords = attendance.totalRecords || 0;
  const lateLogins = attendance.lateLogins || 0;

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Attendance Management</p>
          <h1>Attendance Overview</h1>
          <span>
            Attendance data is loaded from MongoDB for the logged-in employee.
          </span>
        </section>

        <section className="metric-grid four">
          <MetricCard
            title="Attendance Score"
            value={`${percentage}%`}
            sub={percentage >= 90 ? "Excellent" : "Needs Attention"}
          />

          <MetricCard
            title="Present Days"
            value={presentDays}
            sub="Recorded"
          />

          <MetricCard
            title="Total Records"
            value={totalRecords}
            sub="Attendance entries"
          />

          <MetricCard
            title="Minimum Required"
            value="90%"
            sub="Company Policy"
          />
        </section>

        <section className="pro-grid two">
          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Monthly Attendance Trend</h2>
              <span>Live Overview</span>
            </div>

            <AttendanceChart />
          </div>

          <div className="pro-card">
            <div className="pro-card-head">
              <h2>Attendance Health</h2>
              <span>Current Status</span>
            </div>

            <Progress
              label="Attendance"
              value={`${percentage}%`}
              width={`${percentage}%`}
            />

            <Progress
              label="Present Days"
              value={`${presentDays} days`}
              width={totalRecords ? `${(presentDays / totalRecords) * 100}%` : "0%"}
            />

            <Progress
              label="Late Logins"
              value={`${lateLogins} times`}
              width={`${Math.min(lateLogins * 10, 100)}%`}
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, sub }) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{sub}</span>
    </div>
  );
}

function Progress({ label, value, width }) {
  return (
    <div className="progress-row">
      <div>
        <p>{label}</p>
        <span>{value}</span>
      </div>

      <div className="progress-track">
        <b style={{ width }}></b>
      </div>
    </div>
  );
}

export default Attendance;