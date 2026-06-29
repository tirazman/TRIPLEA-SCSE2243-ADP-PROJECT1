import Navbar from "../../components/common/navbar";

export default function KJPenerimaanLaporan() {
  return (
    <>
      <Navbar
        title="Penerimaan Laporan"
        breadcrumbItems={["e-Urus PDK", "Ketua Jabatan", "Penerimaan Laporan"]}
        userName="Zulkifli Hasan"
        userRole="Ketua Jabatan"
      />
      <div className="content">
        <div className="page-heading">Penerimaan Laporan</div>
        <p style={{ marginTop: 8, color: "var(--text-soft)", fontSize: "12px" }}>
          Halaman ini akan dibangunkan kemudian.
        </p>
      </div>
    </>
  );
}