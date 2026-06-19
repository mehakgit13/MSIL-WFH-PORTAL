import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function LeaveDetails() {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await api.get("/leaves/my");
        const found = res.data.leaves.find((item) => item._id === id);
        setLeave(found);
      } catch (error) {
        console.log("Leave detail error:", error.response?.data);
      }
    };

    loadDetails();
  }, [id]);

  if (!leave) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading leave request...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Leave Management</p>
          <h1>Leave Request Details</h1>
          <span>Detailed view of selected leave request.</span>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>Request Information</h2>
            <Link to="/leave/history">Back to History</Link>
          </div>

          <div className="overview-grid">
            <Detail label="Request ID" value={leave._id} />
            <Detail label="Leave Type" value={leave.leaveType} />
            <Detail
              label="Start Date"
              value={new Date(leave.startDate).toLocaleDateString("en-IN")}
            />
            <Detail
              label="End Date"
              value={new Date(leave.endDate).toLocaleDateString("en-IN")}
            />
            <Detail label="Status" value={leave.status} />
            <Detail label="Approved By" value={leave.approvedBy || "Pending"} />
            <Detail
              label="Submitted On"
              value={new Date(leave.createdAt).toLocaleDateString("en-IN")}
            />
          </div>

          <div className="detail-note">
            <h3>Reason</h3>
            <p>{leave.reason}</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-box">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default LeaveDetails;