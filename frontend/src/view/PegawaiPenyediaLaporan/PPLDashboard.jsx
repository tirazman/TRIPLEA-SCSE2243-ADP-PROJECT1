import DashboardLayout from "../../components/common/DashboardLayout";

const menuItems = [
  {
    label: "Status Kerja",
    path: "/pegawai-penyedia/status-kerja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function PPLDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}