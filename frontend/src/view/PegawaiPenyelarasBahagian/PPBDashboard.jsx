import DashboardLayout from "../../components/common/DashboardLayout";

/**
 * PPBDashboard — role-specific container for Pegawai Penyelaras Bahagian.
 * Defines this role's menu items here, then hands them to the shared
 * DashboardLayout (which renders Sidebar + <Outlet /> for the actual page).
 */
const menuItems = [
  {
    label: "Penerimaan Laporan",
    path: "/pegawai-penyelaras/penerimaan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Laporan Dihantar",
    path: "/pegawai-penyelaras/laporan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22 11 13 2 9l20-7z" />
      </svg>
    ),
  },
  {
    label: "Status Kerja",
    path: "/pegawai-penyelaras/status",
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

export default function PPBDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}
