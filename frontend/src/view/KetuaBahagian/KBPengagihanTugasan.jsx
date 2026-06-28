import Navbar from "../../components/common/navbar";

export default function KBPengagihanTugasan() {
  return (
    <>
      <Navbar
        title="Pengagihan Tugasan"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Pengagihan Tugasan"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>
          Pengagihan Tugasan
        </h2>
      </div>
    </>
  );
}
