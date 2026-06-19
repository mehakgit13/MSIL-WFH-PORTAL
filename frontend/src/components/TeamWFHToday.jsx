import { useEffect, useState } from "react";
import api from "../services/api";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function TeamWFHToday() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await api.get(`/team-wfh/by-date?date=${getTodayKey()}`);
        setMembers(res.data.members || []);
      } catch (error) {
        console.log("Team WFH error:", error.response?.data);
      }
    };

    loadMembers();
  }, []);

  return (
    <div className="pro-card team-wfh-section">
      <div className="pro-card-head">
        <h2>Team WFH Today</h2>
        <span>{members.length} members</span>
      </div>

      {members.length === 0 ? (
        <div className="team-empty-box">
          <h3>No WFH Today</h3>
          <p>No team member has an allocated WFH day today.</p>
        </div>
      ) : (
        <div className="team-wfh-list">
          {members.map((member) => (
            <div className="team-wfh-card" key={member.id}>
              <div className="team-wfh-avatar">
                {(member.name || "E")
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <h3>{member.name}</h3>
                <p>{member.designation}</p>
                <small>{member.employeeId}</small>
              </div>

              <span>{member.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamWFHToday;