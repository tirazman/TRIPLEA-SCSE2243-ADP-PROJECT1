import DashboardLayout from "../../components/common/DashboardLayout";

const menuItems = [
  {
    label: "Status Kerja",
    path: "/pegawai-penyedia/status-kerja",
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

export default function PPLDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}