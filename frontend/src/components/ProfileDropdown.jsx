import { useState } from "react";
import { Link } from "react-router-dom";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);

  const name = user?.name || "Employee";
  const designation = user?.designation || "Employee";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="profile-wrapper">
      <button
        onClick={() => setOpen(!open)}
        className="profile-button"
      >
        <div className="profile-avatar">{initials}</div>

        <div className="profile-text">
          <h4>{name}</h4>
          <p>{designation}</p>
        </div>

        <KeyboardArrowDownIcon fontSize="small" />
      </button>

      {open && (
        <div className="profile-menu">
          <MenuLink to="/profile" icon={<PersonOutlineIcon />} text="My Profile" />
          <MenuLink to="/attendance" icon={<FactCheckOutlinedIcon />} text="Attendance" />
          <MenuLink to="/leaves" icon={<EventAvailableOutlinedIcon />} text="Leave Summary" />
          <MenuLink to="/wfh" icon={<HomeWorkOutlinedIcon />} text="WFH Usage" />
          <MenuLink to="/requests" icon={<AssignmentOutlinedIcon />} text="My Requests" />

          <div className="profile-divider" />

          <MenuLink to="/about" icon={<InfoOutlinedIcon />} text="About Portal" />
          <MenuLink to="/rules" icon={<PolicyOutlinedIcon />} text="Policies & Guidelines" />

          <div className="profile-divider" />

          <button onClick={logout} className="profile-logout">
            <LogoutOutlinedIcon fontSize="small" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, icon, text }) {
  return (
    <Link to={to} className="profile-menu-link">
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default ProfileDropdown;