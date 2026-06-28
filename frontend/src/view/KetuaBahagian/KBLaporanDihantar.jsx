import Navbar from "../../components/common/navbar";

export default function KBLaporanDihantar() {
  return (
    <>
      <Navbar
        title="Laporan Dihantar"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Laporan Dihantar"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>
          Laporan Dihantar
        </h2>
      </div>
    </>
  );
}

