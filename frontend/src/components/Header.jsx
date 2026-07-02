import ProfileDropdown from "./ProfileDropdown";

function Header() {
  return (
    <header className="top-header clean-header">
      <div className="header-left">
        <div>
          <h1>Maruti Suzuki India Limited</h1>
          <p>Digital Workplace | Leave | WFH | Reports</p>
        </div>
      </div>

      <div className="header-actions">
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default Header;