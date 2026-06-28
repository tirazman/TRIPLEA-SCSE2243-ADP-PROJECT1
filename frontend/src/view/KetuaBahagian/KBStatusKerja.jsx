import Navbar from "../../components/common/navbar";

export default function KBStatusKerja() {
  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Status Kerja"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>
          Status Kerja
        </h2>
      </div>
    </>
  );
}
