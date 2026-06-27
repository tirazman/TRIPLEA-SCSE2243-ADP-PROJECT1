import Navbar from "../../components/common/navbar";

export default function PPBStatusKerja() {
  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Subsistem 3", "Status Kerja"]}
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
          Status Kerja
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-soft)" }}>
          Ringkasan status kerja dan pencapaian akan dipaparkan di sini.
        </p>
      </div>
    </>
  );
}
