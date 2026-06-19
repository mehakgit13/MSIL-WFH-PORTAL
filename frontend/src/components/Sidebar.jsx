import { NavLink } from "react-router-dom";
import CalendarWidget from "./CalendarWidget";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

 const menuItems = [
  { title: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
  { title: "Attendance", path: "/attendance", icon: <FactCheckOutlinedIcon /> },

  { title: "Apply Leave", path: "/leave/apply", icon: <EventAvailableOutlinedIcon /> },
  { title: "Leave History", path: "/leave/history", icon: <EventAvailableOutlinedIcon /> },

  { title: "Work From Home", path: "/wfh", icon: <HomeWorkOutlinedIcon /> },
  { title: "WFH History", path: "/wfh/history", icon: <HomeWorkOutlinedIcon /> },
{ title: "WFH Swap Requests", path: "/wfh/swap-requests", icon: <HomeWorkOutlinedIcon /> },
  { title: "Reports", path: "/reports", icon: <AssessmentOutlinedIcon /> },
  { title: "Team Members", path: "/team", icon: <GroupsOutlinedIcon /> },
  { title: "Policies", path: "/rules", icon: <PolicyOutlinedIcon /> },
  { title: "My Profile", path: "/profile", icon: <PersonOutlineOutlinedIcon /> },
];
  return (
    <aside className="sidebar-pro">
      <div className="brand-box">
        <img src="/maruti-logo.png" alt="Maruti Suzuki" className="brand-logo" />

        <div>
          <h1>MARUTI SUZUKI</h1>
          <p>Employee Workforce Portal</p>
        </div>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-avatar">
          {(user.name || "Employee")
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div>
          <h3>{user.name || "Employee"}</h3>
          <p>{user.designation || "Employee"}</p>
          <span>ID: {user.employeeId || "N/A"}</span>
        </div>
      </div>

      <div className="sidebar-calendar-wrap">
        <CalendarWidget />
      </div>

      <p className="sidebar-section-title">MAIN MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;