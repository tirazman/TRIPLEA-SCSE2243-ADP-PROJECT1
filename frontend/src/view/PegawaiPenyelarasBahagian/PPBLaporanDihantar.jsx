import Navbar from "../../components/common/navbar";

export default function LaporanDihantar() {
  return (
    <>
      <Navbar
        title="Laporan Dihantar"
        breadcrumbItems={["e-Urus PDK", "Subsistem 3", "Laporan Dihantar"]}
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
          Laporan Dihantar
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-soft)" }}>
          Senarai laporan yang telah dikemukakan kepada Ketua Jabatan akan dipaparkan di sini.
        </p>
      </div>
    </>
  );
}
