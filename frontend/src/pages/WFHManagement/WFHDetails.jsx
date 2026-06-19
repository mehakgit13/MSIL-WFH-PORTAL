import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function WFHDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await api.get("/wfh/my");
        const found = res.data.requests.find((item) => item._id === id);
        setRequest(found);
      } catch (error) {
        console.log("WFH detail error:", error.response?.data);
      }
    };

    loadDetails();
  }, [id]);

  if (!request) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading WFH request...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Work From Home</p>
          <h1>WFH Request Details</h1>
          <span>Detailed view of selected WFH request.</span>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>Request Information</h2>
            <Link to="/wfh/history">Back to History</Link>
          </div>

          <div className="overview-grid">
            <Detail label="Request ID" value={request._id} />
            <Detail
              label="WFH Date"
              value={new Date(request.date).toLocaleDateString("en-IN")}
            />
            <Detail label="Status" value={request.status} />
            <Detail label="Approved By" value={request.approvedBy || "Pending"} />
            <Detail
              label="Submitted On"
              value={new Date(request.createdAt).toLocaleDateString("en-IN")}
            />
            <Detail label="Monthly Limit" value="5 Days" />
          </div>

          <div className="detail-note">
            <h3>Reason</h3>
            <p>{request.reason}</p>
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

export default WFHDetails;