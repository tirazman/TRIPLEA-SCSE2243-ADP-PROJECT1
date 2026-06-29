import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

/**
 * Shared Navbar/topbar used by every role and every page.
 * Title, breadcrumb and the status pill change per-page, so they are
 * passed in as props by whichever page renders this component.
 */
export default function Navbar({ title, breadcrumbItems = [], statusText, userName, userRole }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Browser confirmation dialog
    const confirmLogout = window.confirm("Adakah anda pasti mahu log keluar?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
    }
    setShowDropdown(false); // Close menu
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        <div className="breadcrumb">
          {breadcrumbItems.map((crumb, idx) => (
            <span key={idx} style={{ display: "flex", alignItems: "center" }}>
              {idx !== 0 && <span className="breadcrumb-sep">/</span>}
              {idx === breadcrumbItems.length - 1 ? (
                <span className="breadcrumb-active">{crumb}</span>
              ) : (
                crumb
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="topbar-right">
        {statusText && (
          <>
            <div className="topbar-status">
              <div className="status-dot"></div>
              {statusText}
            </div>
            <div className="topbar-divider"></div>
          </>
        )}

        <div className="profile-widget" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer', position: 'relative' }}>
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          
          <div className="profile-info-wrap">
            <div className="profile-name">{userName}</div>
            <div className="profile-role">{userRole}</div>
          </div>
          
          <div className="profile-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Dropdown triggers only on click */}
          {showDropdown && (
            <div className="profile-dropdown">
              <button onClick={handleLogout} className="dropdown-item">Log Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}