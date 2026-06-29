import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [wfhData, setWfhData] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [dashboardRes, leaveRes, wfhRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/leaves/my"),
          api.get("/wfh/my"),
        ]);

        setDashboard(dashboardRes.data);
        setLeaveData(leaveRes.data);
        setWfhData(wfhRes.data);
      } catch (error) {
        console.log("Reports error:", error.response?.data || error.message);
      }
    };

    loadReports();
  }, []);

  const leaves = dashboard?.leaves || {};

  const reports = [
    {
      title: "Leave Report",
      period: "Current Year",
      icon: <EventAvailableOutlinedIcon />,
      text: "Annual leave, sick leave, remaining balance and submitted leave requests.",
      rows: [
        ["Annual Leave Quota", `${leaves.annualQuota || 20} Days`],
        ["Annual Leave Used", `${leaves.annualUsed || 0} Days`],
        ["Annual Leave Remaining", `${leaves.annualRemaining || 20} Days`],
        ["Sick Leave Quota", `${leaves.sickQuota || 8} Days`],
        ["Sick Leave Used", `${leaves.sickUsed || 0} Days`],
        ["Sick Leave Remaining", `${leaves.sickRemaining || 8} Days`],
        ["Pending Leave Requests", leaves.pending || 0],
        ["Total Leave Requests", leaveData?.leaves?.length || 0],
      ],
    },
    {
      title: "WFH Report",
      period: "Current Year",
      icon: <HomeWorkOutlinedIcon />,
      text: "Yearly WFH allocation, used WFH, upcoming WFH and shifted WFH records.",
      rows: [
        ["Yearly WFH Quota", `${wfhData?.yearlyQuota || 24} Days`],
        ["Total Allocated", `${wfhData?.totalAllocated || 0} Days`],
        ["Used WFH", `${wfhData?.used || 0} Days`],
        ["Upcoming WFH", `${wfhData?.upcoming || wfhData?.allocated || 0} Days`],
        ["Shifted WFH", `${wfhData?.shifted || 0} Days`],
        ["WFH Left", `${wfhData?.left ?? wfhData?.remaining ?? 0} Days`],
        ["Total WFH Records", wfhData?.requests?.length || 0],
      ],
    },
    {
      title: "Team WFH Report",
      period: "Current Month",
      icon: <GroupsOutlinedIcon />,
      text: "Team-wise WFH planning and monthly allocation visibility.",
      rows: [
        ["Report Type", "Team WFH Allocation"],
        ["Policy", "2 WFH days per employee per month"],
        ["Allocation Rule", "No two employees on the same WFH date"],
        ["Shift Rule", "Only future WFH can be postponed"],
        ["Swap Rule", "Only future allocated WFH can be swapped"],
      ],
    },
  ];

  const openReport = (report) => {
    setSelectedReport(report);

    setTimeout(() => {
      document.getElementById("report-details")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <p>Reports</p>
          <h1>Leave & WFH Reports</h1>
          <span>Reports are generated from leave and WFH API data.</span>
        </section>

        <section className="reports-grid">
          {reports.map((report) => (
            <div className="report-card" key={report.title}>
              <div className="report-icon">{report.icon}</div>

              <h2>{report.title}</h2>

              <p>{report.text}</p>

              <button onClick={() => openReport(report)}>View Report</button>
            </div>
          ))}
        </section>

        {selectedReport && (
          <section id="report-details" className="pro-card mt-6">
            <div className="pro-card-head">
              <h2>{selectedReport.title}</h2>
              <span>{selectedReport.period}</span>
            </div>

            <div className="table-pro">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedReport.rows.map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="primary-btn mt-6" onClick={() => window.print()}>
              Print Report
            </button>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Reports;