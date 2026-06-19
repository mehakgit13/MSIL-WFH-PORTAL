import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function WFHSwapRequests() {
  const [requests, setRequests] = useState({
    received: [],
    sent: [],
  });

  const loadRequests = async () => {
    try {
      const res = await api.get("/wfh-swap/my");
      setRequests(res.data);
    } catch (error) {
      console.log("Swap request error:", error.response?.data);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      await api.put(`/wfh-swap/accept/${id}`);
      alert("Swap request accepted.");
      loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to accept request.");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.put(`/wfh-swap/reject/${id}`);
      alert("Swap request rejected.");
      loadRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to reject request.");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Work From Home</p>
          <h1>WFH Swap Requests</h1>
          <span>Accept or reject WFH exchange requests from team members.</span>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>Received Requests</h2>
            <span>{requests.received.length} pending</span>
          </div>

          <div className="table-pro">
            <table>
              <thead>
                <tr>
                  <th>From Employee</th>
                  <th>Their WFH Date</th>
                  <th>Your WFH Date</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.received.length === 0 ? (
                  <tr>
                    <td colSpan="5">No pending swap requests.</td>
                  </tr>
                ) : (
                  requests.received.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.fromEmployee?.name}
                        <br />
                        <small>{item.fromEmployee?.employeeId}</small>
                      </td>
                      <td>{formatDate(item.fromWFH?.date)}</td>
                      <td>{formatDate(item.toWFH?.date)}</td>
                      <td>{item.reason}</td>
                      <td>
                        <button
                          className="small-action-btn"
                          onClick={() => acceptRequest(item._id)}
                        >
                          Accept
                        </button>

                        <button
                          className="small-action-btn reject-btn"
                          onClick={() => rejectRequest(item._id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>Sent Requests</h2>
            <span>{requests.sent.length} records</span>
          </div>

          <div className="table-pro">
            <table>
              <thead>
                <tr>
                  <th>To Employee</th>
                  <th>Your WFH Date</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.sent.length === 0 ? (
                  <tr>
                    <td colSpan="4">No sent swap requests.</td>
                  </tr>
                ) : (
                  requests.sent.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.toEmployee?.name}
                        <br />
                        <small>{item.toEmployee?.employeeId}</small>
                      </td>
                      <td>{formatDate(item.fromWFH?.date)}</td>
                      <td>{formatDate(item.toWFH?.date)}</td>
                      <td>
                        <span className={`status-pill ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
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

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default WFHSwapRequests;