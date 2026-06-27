import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "../../styles/variables.css";
import "../../styles/theme.css";
import "../../styles/dashboard.css";

export default function DashboardLayout({ menuItems, brandTitle, brandSubtitle, footerVersion }) {
  return (
    <>
      <Sidebar
        menuItems={menuItems}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
        footerVersion={footerVersion}
      />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}
