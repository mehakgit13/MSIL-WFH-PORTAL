import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function WFH() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = user.role === "manager" || user.role === "admin";

  const [wfh, setWfh] = useState(null);
  const [teamMonth, setTeamMonth] = useState([]);
  const [swapData, setSwapData] = useState({
    sent: [],
    received: [],
    manager: [],
  });
  const [postponeData, setPostponeData] = useState({
    my: [],
    manager: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my");

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [targetWFH, setTargetWFH] = useState(null);
  const [selectedMyWFH, setSelectedMyWFH] = useState("");
  const [swapReason, setSwapReason] = useState("");

  const loadWFH = async () => {
    try {
      const res = await api.get("/wfh/my");
      setWfh(res.data);
    } catch (error) {
      console.log("WFH error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMonth = async () => {
    try {
      const now = new Date();
      const res = await api.get(
        `/team-wfh/month?month=${now.getMonth() + 1}&year=${now.getFullYear()}`
      );
      setTeamMonth(res.data.records || []);
    } catch (error) {
      console.log("Team WFH error:", error.response?.data || error.message);
    }
  };

  const loadSwapRequests = async () => {
    try {
      const res = await api.get("/wfh-swap/my");

      let manager = [];
      try {
        const managerRes = await api.get("/wfh-swap/manager");
        manager = managerRes.data.requests || [];
      } catch {
        manager = [];
      }

      setSwapData({
        sent: res.data.sent || [],
        received: res.data.received || [],
        manager,
      });
    } catch (error) {
      console.log("Swap request error:", error.response?.data || error.message);
    }
  };

  const loadPostponeRequests = async () => {
    try {
      const myRes = await api.get("/wfh-postpone/my");

      let manager = [];
      try {
        const managerRes = await api.get("/wfh-postpone/manager");
        manager = managerRes.data.requests || [];
      } catch {
        manager = [];
      }

      setPostponeData({
        my: myRes.data.requests || [],
        manager,
      });
    } catch (error) {
      console.log("Postpone request error:", error.response?.data || error.message);
    }
  };

  const refreshAll = async () => {
    await loadWFH();
    await loadSwapRequests();
    await loadPostponeRequests();
    window.dispatchEvent(new Event("calendar-refresh"));
  };

  const openTeamTab = async () => {
    try {
      await api.post("/team-wfh/generate");
    } catch (error) {
      console.log("Generate team WFH:", error.response?.data || error.message);
    } finally {
      await loadTeamMonth();
      setActiveTab("team");
    }
  };

  const postponeWFH = async (id) => {
    try {
      await api.post(`/wfh-postpone/${id}/request`, {
        reason: "Employee requested WFH postpone",
      });

      alert("WFH postpone request sent to manager for approval.");
      await refreshAll();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send postpone request.");
    }
  };

  const respondPostpone = async (id, status) => {
    try {
      await api.put(`/wfh-postpone/${id}/manager-respond`, { status });
      alert(`Postpone request ${status.toLowerCase()} successfully.`);
      await refreshAll();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update postpone request.");
    }
  };

  const openSwapModal = (item) => {
    setTargetWFH(item);
    setSelectedMyWFH("");
    setSwapReason("");
    setShowSwapModal(true);
  };

  const sendSwapRequest = async () => {
    if (!selectedMyWFH || !targetWFH?.id) {
      alert("Please select your WFH date for swap.");
      return;
    }

    try {
      await api.post("/wfh-swap/request", {
        fromWFHId: selectedMyWFH,
        toWFHId: targetWFH.id,
        reason: swapReason || "Employee requested WFH swap",
      });

      alert("WFH swap request sent successfully.");
      setShowSwapModal(false);
      await refreshAll();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send swap request.");
    }
  };

  const respondSwap = async (id, status, managerAction = false) => {
    try {
      const url = managerAction
        ? `/wfh-swap/${id}/manager-respond`
        : `/wfh-swap/${id}/respond`;

      await api.put(url, { status });
      alert(`Swap request ${status.toLowerCase()} successfully.`);
      await refreshAll();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update swap request.");
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading WFH details...</div>
      </DashboardLayout>
    );
  }

  const records = wfh?.requests || [];
  const yearlyQuota = wfh?.yearlyQuota || 24;

  const used = records.filter((item) => item.status === "Used").length;
  const shifted = records.filter((item) => item.status === "Shifted").length;

  const futureRecords = records.filter(
    (item) => item.status === "Allocated" || item.status === "Shifted"
  );

  const upcoming = futureRecords.length;
  const totalAllocated = records.length;
  const left = upcoming;

  const visibleTeamMonth = teamMonth.filter(
    (item) => item.employeeId !== user.employeeId
  );

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Work From Home</p>
          <h1>{activeTab === "my" ? "My WFH Allocation" : "Team WFH Allocation"}</h1>
          <span>
            {isManager
              ? "Manager view enabled: review employee WFH approvals."
              : "2 random WFH days every month, 24 WFH days per year."}
          </span>
        </section>

        <section className="metric-grid four">
          <MetricCard title="Yearly Limit" value={`${yearlyQuota} Days`} sub="2 days per month" />
          <MetricCard title="Total Allocated" value={`${totalAllocated} Days`} sub="My yearly allocation" />
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
              <p>
                {used} used • {upcoming} upcoming • {shifted} shifted •{" "}
                {yearlyQuota} yearly quota
              </p>

              <div className="big-progress">
                <span
                  style={{
                    width: `${yearlyQuota ? (used / yearlyQuota) * 100 : 0}%`,
                  }}
                />
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
              <p>Future WFH dates can be postponed or swapped.</p>
              <p>Postpone and swap requests require manager approval.</p>
            </div>
          </div>
        </section>

        <section className="pro-card mt-6">
          <div className="wfh-tabs">
            <button
              className={activeTab === "my" ? "wfh-tab active" : "wfh-tab"}
              onClick={() => setActiveTab("my")}
            >
              My WFH
            </button>

            <button
              className={activeTab === "team" ? "wfh-tab active" : "wfh-tab"}
              onClick={openTeamTab}
            >
              Team WFH
            </button>
          </div>

          {activeTab === "my" ? (
            <>
              <div className="pro-card-head mt-4">
                <h2>My WFH Days</h2>
                <span>{records.length} records</span>
              </div>

              <WFHTable records={records} onPostpone={postponeWFH} />
            </>
          ) : (
            <>
              <div className="pro-card-head mt-4">
                <h2>Team WFH This Month</h2>
                <span>{visibleTeamMonth.length} records</span>
              </div>

              <div className="table-pro">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Swap</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleTeamMonth.length === 0 ? (
                      <tr>
                        <td colSpan="6">No team WFH records found for this month.</td>
                      </tr>
                    ) : (
                      visibleTeamMonth.map((item) => (
                        <tr key={item.id}>
                          <td>{formatDate(item.date)}</td>
                          <td>{item.name || "-"}</td>
                          <td>{item.employeeId || "-"}</td>
                          <td>{item.department || "-"}</td>
                          <td>
                            <span className={`status-pill ${statusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            {item.status === "Allocated" || item.status === "Shifted" ? (
                              <button
                                className="small-action-btn"
                                onClick={() => openSwapModal(item)}
                              >
                                Request Swap
                              </button>
                            ) : (
                              <span className="status-pill used">Not allowed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>WFH Swap Requests</h2>
            <span>
              {swapData.received.length} received • {swapData.sent.length} sent
            </span>
          </div>

          <div className="pro-grid two">
            <SwapList
              title="Requests Received"
              empty="No received swap requests."
              items={swapData.received}
              mode="received"
              onRespond={(id, status) => respondSwap(id, status, false)}
            />

            <SwapList
              title="Requests Sent"
              empty="No sent swap requests."
              items={swapData.sent}
              mode="sent"
            />
          </div>
        </section>

        {(isManager || swapData.manager.length > 0) && (
          <section className="pro-card mt-6">
            <div className="pro-card-head">
              <h2>Manager Swap Approvals</h2>
              <span>{swapData.manager.length} pending</span>
            </div>

            <SwapList
              title="Team Swap Approvals"
              empty="No pending team swap approvals."
              items={swapData.manager}
              mode="manager"
              onRespond={(id, status) => respondSwap(id, status, true)}
            />
          </section>
        )}

        <section className="pro-card mt-6">
          <div className="pro-card-head">
            <h2>WFH Postpone Requests</h2>
            <span>{postponeData.my.length} requests</span>
          </div>

          {postponeData.my.length === 0 ? (
            <p>No postpone requests found.</p>
          ) : (
            <div className="swap-request-list">
              {postponeData.my.map((item) => (
                <div className="swap-request-card" key={item._id}>
                  <div>
                    <h3>
                      {formatDate(item.currentDate)} → {formatDate(item.requestedDate)}
                    </h3>
                    <p>{item.reason}</p>
                    <span>{item.status}</span>
                  </div>

                  <span className={`status-pill ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {(isManager || postponeData.manager.length > 0) && (
          <section className="pro-card mt-6">
            <div className="pro-card-head">
              <h2>Manager Postpone Approvals</h2>
              <span>{postponeData.manager.length} pending</span>
            </div>

            {postponeData.manager.length === 0 ? (
              <p>No pending postpone approvals.</p>
            ) : (
              <div className="swap-request-list">
                {postponeData.manager.map((item) => (
                  <div className="swap-request-card" key={item._id}>
                    <div>
                      <h3>{item.employee?.name || "Employee"}</h3>
                      <p>
                        {formatDate(item.currentDate)} →{" "}
                        {formatDate(item.requestedDate)}
                      </p>
                      <span>{item.reason}</span>
                    </div>

                    <div className="swap-actions">
                      <button
                        className="small-action-btn"
                        onClick={() => respondPostpone(item._id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="danger-action-btn"
                        onClick={() => respondPostpone(item._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {showSwapModal && (
          <div className="swap-modal-backdrop">
            <div className="swap-modal">
              <h2>Request WFH Swap</h2>

              <p className="swap-modal-sub">
                Swap with <b>{targetWFH?.name}</b> for{" "}
                <b>{formatDate(targetWFH?.date)}</b>
              </p>

              <label>Select your WFH date</label>

              <select
                value={selectedMyWFH}
                onChange={(e) => setSelectedMyWFH(e.target.value)}
              >
                <option value="">Choose your WFH date</option>
                {futureRecords.map((item) => (
                  <option key={item._id} value={item._id}>
                    {formatDate(item.date)} - {item.status}
                  </option>
                ))}
              </select>

              <label>Reason</label>

              <textarea
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
                placeholder="Enter reason for swap"
              />

              <div className="swap-modal-actions">
                <button
                  className="danger-action-btn"
                  onClick={() => setShowSwapModal(false)}
                >
                  Cancel
                </button>

                <button className="small-action-btn" onClick={sendSwapRequest}>
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function WFHTable({ records, onPostpone }) {
  return (
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
                  <span className={`status-pill ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.reason}</td>
                <td>
                  {item.status === "Allocated" || item.status === "Shifted" ? (
                    <button
                      className="small-action-btn"
                      onClick={() => onPostpone(item._id)}
                    >
                      Request Postpone
                    </button>
                  ) : (
                    <span className="status-pill used">Not allowed</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SwapList({ title, empty, items, mode, onRespond }) {
  return (
    <div>
      <h3 className="swap-section-title">{title}</h3>

      {items.length === 0 ? (
        <p className="empty-text">{empty}</p>
      ) : (
        <div className="swap-request-list">
          {items.map((item) => {
            const sentToName =
              item.requestedTo?.name || item.toWFH?.employee?.name || "Employee";

            const receivedFromName =
              item.requestedBy?.name ||
              item.fromWFH?.employee?.name ||
              "Employee";

            return (
              <div className="swap-request-card" key={item._id}>
                <div>
                  <h3>
                    {mode === "sent"
                      ? `To: ${sentToName}`
                      : mode === "manager"
                      ? `${receivedFromName} → ${sentToName}`
                      : receivedFromName}
                  </h3>

                  <p>
                    {formatDate(item.fromWFH?.date)} ⇄{" "}
                    {formatDate(item.toWFH?.date)}
                  </p>

                  <span>{normalizeStatus(item.status)}</span>
                </div>

                {(mode === "received" &&
                  ["Pending Employee", "Pending"].includes(item.status)) ||
                (mode === "manager" && item.status === "Pending Manager") ? (
                  <div className="swap-actions">
                    <button
                      className="small-action-btn"
                      onClick={() =>
                        onRespond(
                          item._id,
                          mode === "manager" ? "Approved" : "Accepted"
                        )
                      }
                    >
                      {mode === "manager" ? "Approve" : "Accept"}
                    </button>

                    <button
                      className="danger-action-btn"
                      onClick={() => onRespond(item._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className={`status-pill ${statusClass(item.status)}`}>
                    {normalizeStatus(item.status)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
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
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status = "") {
  return normalizeStatus(status).toLowerCase().replace(/\s+/g, "-");
}

function normalizeStatus(status = "") {
  if (status === "Pending") return "Pending Employee";
  return status || "-";
}

export default WFH;