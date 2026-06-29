import Navbar from "../../components/common/navbar";

export default function KJLaporanDihantar() {
  return (
    <>
      <Navbar
        title="Laporan Dihantar"
        breadcrumbItems={["e-Urus PDK", "Ketua Jabatan", "Laporan Dihantar"]}
        userName="Zulkifli Hasan"
        userRole="Ketua Jabatan"
      />
      <div className="content">
        <div className="page-heading">Laporan Dihantar</div>
        <p style={{ marginTop: 8, color: "var(--text-soft)", fontSize: "12px" }}>
          Halaman ini akan dibangunkan kemudian.
        </p>
      </div>
    </>
  );
}