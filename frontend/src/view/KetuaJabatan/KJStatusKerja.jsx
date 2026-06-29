import Navbar from "../../components/common/navbar";

export default function KJStatusKerja() {
  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Ketua Jabatan", "Status Kerja"]}
        userName="Hj. Rashdan bin Ismail"
        userRole="Ketua Jabatan"
      />
      <div className="content">
        <div className="page-heading">Status Kerja</div>
        <p style={{ marginTop: 8, color: "var(--text-soft)", fontSize: "12px" }}>
          Halaman ini akan dibangunkan kemudian.
        </p>
      </div>
    </>
  );
}