import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Leaves from "./pages/Leaves";
import WFH from "./pages/WFH";
import Attendance from "./pages/Attendance";
import Rules from "./pages/Rules";
import About from "./pages/About";
// import Announcements from "./pages/Announcements";
// import CompanyNotices from "./pages/CompanyNotices";
// import NoticeDetails from "./pages/NoticeDetails";
import ActivityDetails from "./pages/ActivityDetails";
import Notifications from "./pages/Notifications";
import TeamMembers from "./pages/TeamMembers";
import Reports from "./pages/Reports";

import ApplyLeave from "./pages/LeaveManagement/ApplyLeave";
import LeaveHistory from "./pages/LeaveManagement/LeaveHistory";
import LeaveDetails from "./pages/LeaveManagement/LeaveDetails";

import ApplyWFH from "./pages/WFHManagement/ApplyWFH";
import WFHHistory from "./pages/WFHManagement/WFHHistory";
import WFHDetails from "./pages/WFHManagement/WFHDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/leaves" element={<Leaves />} />
        <Route path="/leave/apply" element={<ApplyLeave />} />
        <Route path="/leave/history" element={<LeaveHistory />} />
        <Route path="/leave/details/:id" element={<LeaveDetails />} />

        <Route path="/wfh" element={<WFH />} />
        <Route path="/wfh/apply" element={<ApplyWFH />} />
        <Route path="/wfh/history" element={<WFHHistory />} />
        <Route path="/wfh/details/:id" element={<WFHDetails />} />

        <Route path="/attendance" element={<Attendance />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route path="/reports" element={<Reports />} />

        {/* <Route path="/announcements" element={<Announcements />} />
        <Route path="/notices" element={<CompanyNotices />} />
        <Route path="/notices/:id" element={<NoticeDetails />} /> */}

        <Route path="/activity/:id" element={<ActivityDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/team" element={<TeamMembers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;