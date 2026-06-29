import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/navbar";

export default function KBHantarLaporan() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        title={`Muat Naik Laporan — ${caseId}`}
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Arahan Ketua Jabatan", "Muat Naik Laporan"]}
        userName="Encik Rashdan bin Ismail"
        userRole="Ketua Bahagian"
      />

      <div className="content">
        <button
          className="kembali-link"
          onClick={() => navigate("/ketua-bahagian/arahan-ketua-jabatan")}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Butiran Kes
        </button>

        {/* Stepper */}
        <div style={{
          display: "flex", alignItems: "center", gap: 0, marginBottom: 18,
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "12px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.45 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: "var(--green)",
              color: "var(--white)", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>✓</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-mid)" }}>Semak Butiran Kes</span>
          </div>
          <div style={{ flex: 1, height: 2, background: "var(--navy)", margin: "0 14px", borderRadius: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: "var(--navy)",
              color: "var(--white)", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>2</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>Muat Naik Laporan &amp; Bukti</span>
          </div>
          <div style={{ flex: 1, height: 2, background: "var(--border)", margin: "0 14px", borderRadius: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.4 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", border: "1.5px solid var(--border)",
              color: "var(--text-muted)", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>3</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>Hantar &amp; Sahkan</span>
          </div>
        </div>

        {/*sambung buat content kat sini */}

      </div>
    </>
  );
}
