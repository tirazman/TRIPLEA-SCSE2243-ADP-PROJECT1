import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

/**
 * Shared Sidebar used by every role.
 *
 * Do NOT hardcode role-specific menu items in this file.
 * Each role's *Dashboard.jsx (e.g. PPBDashboard.jsx) defines its own
 * `menuItems` array and passes it down through DashboardLayout, e.g.:
 *
 *   const menuItems = [
 *     { label: "Penerimaan Laporan", path: "/pegawai-penyelaras/penerimaan", icon: <SomeIcon /> },
 *     ...
 *   ];
 *   <DashboardLayout menuItems={menuItems} />
 */
export default function Sidebar({
  menuItems = [],
  brandTitle = "e-Urus PDK",
  brandSubtitle = "Pejabat Daerah Kluang",
  footerVersion = "e-Urus PDK Versi 2.1.0",
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-img">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 11h1m4 0h1M12 7v1" />
          </svg>
        </div>
        <div className="brand-text-wrap">
          <div className="brand-title">{brandTitle}</div>
          <div className="brand-subtitle">{brandSubtitle}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu Utama</div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: "8px" }}>Sistem</div>
        <div className="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          Notifikasi
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93A10 10 0 0112 2a10 10 0 10.01 20A10 10 0 0119.07 4.93z" />
          </svg>
          Tetapan Akaun
        </div>
      </nav>

      <div className="sidebar-footer">
        {footerVersion}<br />
        Hakcipta Terpelihara &copy; 2026<br />
        Pejabat Daerah Kluang, Johor
      </div>
    </aside>
  );
}
