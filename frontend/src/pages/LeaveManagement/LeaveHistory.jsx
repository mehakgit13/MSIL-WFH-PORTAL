import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const res = await api.get("/leaves/my");
        setLeaves(res.data.leaves || []);
      } catch (error) {
        console.log("Leave history error:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Leave Management</p>
          <h1>Leave History</h1>
          <span>Your leave records are loaded from MongoDB.</span>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>Leave Requests</h2>
            <span>{leaves.length} records</span>
          </div>

          <div className="table-pro">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading leave requests...</td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <td colSpan="6">No leave requests found.</td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{formatDate(leave.startDate)}</td>
                      <td>{formatDate(leave.endDate)}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span className={`status-pill ${leave.status?.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/leave/details/${leave._id}`}
                          className="text-blue-700 font-bold"
                        >
                          View
                        </Link>
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

export default LeaveHistory;