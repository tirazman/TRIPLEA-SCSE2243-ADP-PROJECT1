import DashboardLayout from "../../components/common/DashboardLayout";

/**
 * KBDashboard — role-specific container for Ketua Bahagian.
 * Defines this role's menu items here, then hands them to the shared
 * DashboardLayout (which renders Sidebar + <Outlet /> for the actual page).
 *
 * Note: "Notifikasi" and "Tetapan Akaun" are NOT listed here — those are
 * already hardcoded into the shared Sidebar's "Sistem" section.
 */
const menuItems = [
  {
    label: "Arahan Ketua Jabatan",
    path: "/ketua-bahagian/arahan-ketua-jabatan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Pengagihan Tugasan",
    path: "/ketua-bahagian/pengagihan-tugasan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
      </svg>
    ),
  },
  {
    label: "Laporan Dihantar",
    path: "/ketua-bahagian/laporan-dihantar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22 11 13 2 9l20-7z" />
      </svg>
    ),
  },
  {
    label: "Status Kerja",
    path: "/ketua-bahagian/status-kerja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function KBDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}
