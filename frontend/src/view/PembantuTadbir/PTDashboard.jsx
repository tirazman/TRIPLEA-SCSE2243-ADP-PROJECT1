import DashboardLayout from "../../components/common/DashboardLayout";

/**
 * PTDashboard — role-specific container for Pembantu Tadbir.
 * Defines this role's menu items here, then hands them to the shared
 * DashboardLayout (which renders Sidebar + <Outlet /> for the actual page).
 */
const menuItems = [
  {
    label: "Pendaftaran Fail", 
    path: "/pembantu-tadbir/pendaftaran", 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Status Kerja",
    path: "/pembantu-tadbir/status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function PTDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}
