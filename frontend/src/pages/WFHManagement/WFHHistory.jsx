import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function WFHHistory() {
  const [wfh, setWfh] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWFH = async () => {
      try {
        const res = await api.get("/wfh/my");
        setWfh(res.data);
      } catch (error) {
        console.log("WFH history error:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    loadWFH();
  }, []);

  const records = wfh?.requests || [];

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Work From Home</p>
          <h1>WFH History</h1>
          <span>
            {records.length} of {wfh?.yearlyQuota || 24} yearly WFH records.
          </span>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>WFH Records</h2>
            <span>
              Used: {wfh?.used || 0} | Upcoming: {wfh?.upcoming || 0} | Left:{" "}
              {wfh?.left || 0}
            </span>
          </div>

          <div className="table-pro">
            <table>
              <thead>
                <tr>
                  <th>WFH Date</th>
                  <th>Original Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading WFH records...</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="5">No WFH records found.</td>
                  </tr>
                ) : (
                  records.map((item) => (
                    <tr key={item._id}>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.originalDate ? formatDate(item.originalDate) : "-"}</td>
                      <td>{item.type}</td>
                      <td>
                        <span className={`status-pill ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.reason}</td>
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

export default WFHHistory;