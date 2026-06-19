import { useEffect, useState } from "react";
import api from "../services/api";

function TeamWFHList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/team-wfh/all");
        setRecords(res.data.records || []);
      } catch (error) {
        console.log("Team WFH list error:", error.response?.data);
      }
    };

    load();
  }, []);

  return (
    <div className="pro-card">
      <div className="pro-card-head">
        <h2>Team WFH Allocation</h2>
        <span>{records.length} records</span>
      </div>

      <div className="table-pro">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4">No team WFH records found.</td>
              </tr>
            ) : (
              records.map((item) => (
                <tr key={item.id}>
                  <td>
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <b>{item.name}</b>
                    <br />
                    <small>{item.employeeId}</small>
                  </td>
                  <td>{item.department}</td>
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
    </div>
  );
}

export default TeamWFHList;