import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function RightSidebar() {
  const [wfh, setWfh] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [wfhRes, dashRes] = await Promise.all([
          api.get("/wfh/my"),
          api.get("/dashboard"),
        ]);

        setWfh(wfhRes.data);
        setDashboard(dashRes.data);
      } catch (error) {
        console.log("Right sidebar error:", error.response?.data);
      }
    };

    load();
  }, []);

  const quota = wfh?.yearlyQuota || 12;
  const remaining = wfh?.remaining ?? quota;

  const upcoming = (wfh?.requests || [])
    .filter((item) => new Date(item.date) >= new Date())
    .slice(0, 4);

  const attendance = dashboard?.attendance || {};

  return (
    <aside className="right-sidebar">
      <div className="right-wfh-card">
        <p>Yearly WFH Balance</p>
        <h2>{remaining} / {quota}</h2>
        <span>Allocated work-from-home days</span>

        <div className="right-progress">
          <b style={{ width: `${(remaining / quota) * 100}%` }}></b>
        </div>
      </div>

      <div className="right-card clean-right-card">
        <h3>Upcoming WFH</h3>

        <div className="right-upcoming-list">
          {upcoming.length === 0 ? (
            <p className="empty-text">No upcoming WFH days.</p>
          ) : (
            upcoming.map((item) => (
              <div className="right-upcoming-card" key={item._id}>
                <div>
                  <h4>{formatDate(item.date)}</h4>
                  <p>{item.status} WFH</p>
                </div>
                <span>{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-card clean-right-card">
        <h3>Quick Actions</h3>

        <div className="right-action-grid">
          <Link to="/wfh">WFH</Link>
          <Link to="/wfh/history">History</Link>
          <Link to="/leave/apply">Leave</Link>
          <Link to="/attendance">Attendance</Link>
        </div>
      </div>

      
    </aside>
  );
}

export default RightSidebar;