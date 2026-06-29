import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileDropdown from "./ProfileDropdown";
import api from "../services/api";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadHeader = async () => {
      try {
        const dash = await api.get("/dashboard");
        setUser(dash.data.employee);
      } catch (error) {
        console.log("Header error:", error.response?.data);
      }
    };

    loadHeader();
  }, []);

  return (
    <header className="top-header clean-header">
      <div className="header-left">
        <button className="menu-btn">
          <MenuIcon />
        </button>

        <div>
          <h1>Maruti Suzuki India Limited</h1>
          <p>Digital Workplace | Leave | WFH | Reports</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <SearchIcon fontSize="small" />
          <input placeholder="Search anything..." />
        </div>

        

        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}

export default Header;