import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Leaves from "./pages/Leaves";
import WFH from "./pages/WFH";
import Rules from "./pages/Rules";
import About from "./pages/About";
import TeamMembers from "./pages/TeamMembers";
import Reports from "./pages/Reports";

import ApplyLeave from "./pages/LeaveManagement/ApplyLeave";
import LeaveHistory from "./pages/LeaveManagement/LeaveHistory";
import LeaveDetails from "./pages/LeaveManagement/LeaveDetails";

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
        <Route path="/wfh/history" element={<WFHHistory />} />
        <Route path="/wfh/details/:id" element={<WFHDetails />} />

        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/team" element={<TeamMembers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;