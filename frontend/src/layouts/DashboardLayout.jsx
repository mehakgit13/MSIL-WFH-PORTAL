import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RightSidebar from "../components/RightSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="portal-shell">
      <Sidebar />

      <div className="portal-main">
        <Header />

        <div className="portal-body">
          <main className="portal-content">{children}</main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;