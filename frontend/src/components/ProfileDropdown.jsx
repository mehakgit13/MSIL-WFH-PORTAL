import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const name = user.name || "Employee";
  const designation = user.designation || user.role || "Employee";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-wrapper">
      <button className="profile-button" onClick={() => setOpen(!open)}>
        <div className="profile-avatar">{initials}</div>

        <div className="profile-text">
          <h4>{name}</h4>
          <p>{designation}</p>
        </div>

        <span>⌄</span>
      </button>

      {open && (
        <div className="profile-menu">
          <Link className="profile-menu-link" to="/profile">My Profile</Link>
          <Link className="profile-menu-link" to="/wfh">Work From Home</Link>
          <Link className="profile-menu-link" to="/leave/apply">Apply Leave</Link>
          <Link className="profile-menu-link" to="/leave/history">Leave History</Link>

          <div className="profile-divider"></div>

          <button className="profile-logout" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;