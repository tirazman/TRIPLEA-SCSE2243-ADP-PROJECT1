import Navbar from "../../components/common/navbar";

export default function KBArahanKetuaJabatan() {
  return (
    <>
      <Navbar
        title="Arahan Ketua Jabatan"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Arahan Ketua Jabatan"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />
      <div className="content">
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>
          Arahan Ketua Jabatan
        </h2>
      </div>
    </>
  );
}