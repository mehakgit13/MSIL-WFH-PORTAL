import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function NoticeDetails() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await api.get(`/notices/${id}`);
        setNotice(res.data);
      } catch (error) {
        console.log("Notice detail error:", error.response?.data);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) {
    return (
      <DashboardLayout>
        <div className="pro-card">Loading notice...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="notice-page-wrapper">
        <div className="notice-actions no-print">
          <Link to="/notices" className="text-blue-700 font-bold">
            ← Back to Notices
          </Link>

          <button className="notice-print-btn" onClick={() => window.print()}>
            Download / Print PDF
          </button>
        </div>

        <div className="official-notice-paper">
          <div className="notice-letterhead">
            <div>
              <h1>MARUTI SUZUKI INDIA LIMITED</h1>
              <p>Employee Workforce Management Portal</p>
            </div>

            <div className="notice-badge">{notice.category || "Notice"}</div>
          </div>

          <div className="notice-meta">
            <p><b>Notice ID:</b> {notice._id}</p>
            <p>
              <b>Issue Date:</b>{" "}
              {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p><b>Department:</b> HR Department</p>
          </div>

          <hr />

          <h2>{notice.title}</h2>

          <div className="notice-content">
            <p>{notice.content}</p>
          </div>

          <div className="notice-footer">
            <p>This is an official internal notice issued through the workforce portal.</p>

            <div>
              <b>Authorized Signatory</b>
              <span>HR Department</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NoticeDetails;