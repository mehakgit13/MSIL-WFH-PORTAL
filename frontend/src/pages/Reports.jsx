import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [wfhData, setWfhData] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const dashboardRes = await api.get("/dashboard");
        setDashboard(dashboardRes.data);

        const leaveRes = await api.get("/leaves/my");
        setLeaveData(leaveRes.data);

        const wfhRes = await api.get("/wfh/my");
        setWfhData(wfhRes.data);
      } catch (error) {
        console.log("Reports error:", error.response?.data);
      }
    };

    loadReports();
  }, []);

  const attendance = dashboard?.attendance || {};
  const leaves = dashboard?.leaves || {};
  const wfh = dashboard?.wfh || {};

  const reports = [
    {
      title: "Attendance Report",
      period: "Current Records",
      icon: <FactCheckOutlinedIcon />,
      text: "Attendance score, present days and total attendance records.",
      rows: [
        ["Attendance Score", `${attendance.percentage || 0}%`],
        ["Present Days", attendance.presentDays || 0],
        ["Total Records", attendance.totalRecords || 0],
        ["Minimum Required", "90%"],
      ],
    },
    {
      title: "Leave Report",
      period: "Current Year",
      icon: <EventAvailableOutlinedIcon />,
      text: "Annual leave, sick leave, remaining balance and submitted requests.",
      rows: [
        ["Annual Leave Quota", `${leaves.annualQuota || 20} Days`],
        ["Annual Leave Used", `${leaves.annualUsed || 0} Days`],
        ["Annual Leave Remaining", `${leaves.annualRemaining || 20} Days`],
        ["Sick Leave Quota", `${leaves.sickQuota || 8} Days`],
        ["Sick Leave Used", `${leaves.sickUsed || 0} Days`],
        ["Sick Leave Remaining", `${leaves.sickRemaining || 8} Days`],
        ["Total Leave Requests", leaveData?.leaves?.length || 0],
      ],
    },
    {
      title: "WFH Report",
      period: "Current Month",
      icon: <HomeWorkOutlinedIcon />,
      text: "Monthly WFH quota, approved WFH, pending requests and balance.",
      rows: [
        ["Monthly Limit", `${wfhData?.quota || wfh.monthlyQuota || 5} Days`],
        ["Approved WFH", `${wfhData?.approved || wfh.approved || 0} Days`],
        ["Pending WFH", wfhData?.pending || wfh.pending || 0],
        ["Remaining Balance", `${wfhData?.remaining ?? wfh.remaining ?? 5} Days`],
        ["Total WFH Requests", wfhData?.requests?.length || 0],
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
          <p>Workforce Analytics</p>
          <h1>Reports & Analytics</h1>
          <span>Reports are generated from dashboard, leave and WFH API data.</span>
        </section>

        <section className="reports-grid">
          {reports.map((report) => (
            <div className="report-card" key={report.title}>
              <div className="report-icon">{report.icon}</div>

              <h2>{report.title}</h2>

              <p>{report.text}</p>

              <button onClick={() => openReport(report)}>
                View Report
              </button>
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

            <button
              className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-xl font-bold"
              onClick={() => window.print()}
            >
              Print Report
            </button>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Reports;