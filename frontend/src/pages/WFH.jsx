import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function WFH() {
  const [wfh, setWfh] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWFH = async () => {
    try {
      const res = await api.get("/wfh/my");
      setWfh(res.data);
    } catch (error) {
      console.log("WFH error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWFH();
  }, []);

  const shiftWFH = async (id) => {
    try {
      await api.put(`/wfh/shift/${id}`);
      alert("WFH date shifted successfully.");
      loadWFH();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to shift WFH date");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading WFH details...</div>
      </DashboardLayout>
    );
  }

  const yearlyQuota = wfh?.yearlyQuota || 24;
  const totalAllocated = wfh?.totalAllocated || 0;
  const used = wfh?.used || 0;
  const upcoming = wfh?.upcoming || wfh?.allocated || 0;
  const shifted = wfh?.shifted || 0;
  const left = wfh?.left ?? upcoming + shifted;
  const records = wfh?.requests || [];

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Work From Home</p>
          <h1>My WFH Allocation</h1>
          <span>2 random WFH days every month, 24 WFH days per year.</span>
        </section>

        <section className="metric-grid four">
          <MetricCard title="Yearly Limit" value={`${yearlyQuota} Days`} sub="2 days per month" />
          <MetricCard title="Total Allocated" value={`${totalAllocated} Days`} sub="My allocation" />
          <MetricCard title="Used WFH" value={`${used} Days`} sub="Past WFH days" />
          <MetricCard title="WFH Left" value={`${left} Days`} sub="Upcoming + shifted" />
        </section>

        <section className="pro-grid two">
          <div className="pro-card">
            <div className="pro-card-head">
              <h2>WFH Usage</h2>
              <span>Current Year</span>
            </div>

            <div className="wfh-visual">
              <h3>{left} Days Left</h3>
              <p>{used} used • {upcoming} upcoming • {yearlyQuota} yearly quota</p>

              <div className="big-progress">
                <span style={{ width: `${yearlyQuota ? (used / yearlyQuota) * 100 : 0}%` }}></span>
              </div>

              <div className="wfh-mini-stats">
                <p>Used: {used}</p>
                <p>Upcoming: {upcoming}</p>
                <p>Shifted: {shifted}</p>
              </div>
            </div>
          </div>

          <div className="pro-card">
            <div className="pro-card-head">
              <h2>WFH Policy</h2>
              <span>Active</span>
            </div>

            <div className="policy-list-modern">
              <p>Every employee gets 24 WFH days in one calendar year.</p>
              <p>2 random working days are allocated every month.</p>
              <p>Past WFH dates are automatically marked as Used.</p>
              <p>Future WFH dates can be shifted to the next available working day.</p>
            </div>
          </div>
        </section>

        <section className="pro-card wfh-actions-card">
          <div className="pro-card-head">
            <h2>Actions</h2>
            <span>WFH Workflow</span>
          </div>

          <div className="wfh-action-grid">
            <button
              className="wfh-action-btn"
              onClick={async () => {
                try {
                  await api.post("/team-wfh/generate-team");
                  await loadWFH();
                  alert("Team WFH allocation generated successfully.");
                } catch (error) {
                  alert(error.response?.data?.message || "Unable to generate team WFH");
                }
              }}
            >
              Generate Team WFH Allocation
            </button>

            <Link to="/wfh/history" className="wfh-action-btn">
              View My WFH History
            </Link>

            <Link to="/team" className="wfh-action-btn">
              View Team WFH
            </Link>
          </div>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>My WFH Days</h2>
            <span>{records.length} records</span>
          </div>

          <div className="table-pro">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Original Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="5">No WFH records found.</td>
                  </tr>
                ) : (
                  records.map((item) => (
                    <tr key={item._id}>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.originalDate ? formatDate(item.originalDate) : "-"}</td>
                      <td>
                        <span className={`status-pill ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.reason}</td>
                      <td>
                        {item.status === "Allocated" || item.status === "Shifted" ? (
                          <button className="small-action-btn" onClick={() => shiftWFH(item._id)}>
                            Shift Date
                          </button>
                        ) : (
                          <span className="text-gray-500">Not allowed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default WFH;