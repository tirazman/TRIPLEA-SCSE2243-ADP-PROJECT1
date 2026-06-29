import DashboardLayout from "../../components/common/DashboardLayout";
import { initialDocuments } from "../../data/pengagihanBahagianData";

const menungguCount = initialDocuments.filter((d) => d.status === "menunggu").length;

const menuItems = [
  {
    label: "Laporan Dihantar",
    path: "/ketua-jabatan/laporan-dihantar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Pengagihan kepada Bahagian",
    path: "/ketua-jabatan/pengagihan-bahagian",
    badge: menungguCount,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    label: "Penerimaan Laporan",
    path: "/ketua-jabatan/penerimaan-laporan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
];

export default function KJDashboard() {
  return <DashboardLayout menuItems={menuItems} />;
}