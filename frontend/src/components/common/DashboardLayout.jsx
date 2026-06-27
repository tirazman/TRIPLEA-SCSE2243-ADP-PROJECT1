import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "../../styles/global.css";

/**
 * Shared layout used by EVERY role's dashboard.
 * Renders the Sidebar with whatever menuItems the role passes in,
 * then renders the role's current page through <Outlet />.
 *
 * Do NOT hardcode any role-specific menu here — each role's own
 * "<Role>Dashboard.jsx" (e.g. PPBDashboard.jsx) defines its menuItems
 * and renders <DashboardLayout menuItems={menuItems} />.
 */
export default function DashboardLayout({ menuItems = [] }) {
  return (
    <>
      <Sidebar menuItems={menuItems} />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

