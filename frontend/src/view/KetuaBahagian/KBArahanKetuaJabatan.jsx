import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import { arahanKes } from "../../data/arahanKetuaJabatanData";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriorityBadge({ keutamaan }) {
  if (keutamaan === "Tinggi") {
    return (
      <span style={{
        background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-border)",
        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
      }}>Tinggi</span>
    );
  }
  return (
    <span style={{
      background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-border)",
      fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
    }}>Sederhana</span>
  );
}

// ─── View A: Senarai ──────────────────────────────────────────────────────────

function ViewSenarai({ onSemak }) {
  const tinggiCount = arahanKes.filter((k) => k.keutamaan === "Tinggi").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Arahan Ketua Jabatan</h1>
          <p className="page-subheading">
            Semak butiran kes yang diarahkan oleh Ketua Jabatan, sediakan laporan penuh dan hantar kepada Pegawai Penyedia Laporan untuk tindakan seterusnya.
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
          background: "rgba(184,146,42,0.1)", border: "1px solid rgba(184,146,42,0.22)",
          borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 500, color: "#d4a84b",
          whiteSpace: "nowrap",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#d4a84b",
            display: "inline-block", animation: "blink 2s ease-in-out infinite",
          }} />
          {arahanKes.length} Kes Menunggu Tindakan
        </div>
      </div>

      <div className="table-panel">
        <div className="table-panel-header">
          <div>
            <div className="table-panel-title">Senarai Arahan Kes</div>
            <div className="table-panel-sub">
              {arahanKes.length} kes diterima — {tinggiCount} berkeutamaan tinggi memerlukan tindakan segera
            </div>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>No. Rujukan</th>
              <th>Tajuk Kes</th>
              <th>Tarikh Arahan</th>
              <th>Keutamaan</th>
              <th style={{ textAlign: "center" }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {arahanKes.map((kes) => (
              <tr key={kes.id}>
                <td className="td-ref">{kes.id}</td>
                <td>
                  <div className="td-tajuk">{kes.tajuk}</div>
                  <div className="td-tajuk-sub">{kes.subtajuk}</div>
                </td>
                <td className="td-date">{kes.tarikhArahan}</td>
                <td><PriorityBadge keutamaan={kes.keutamaan} /></td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn-icon-detail"
                    onClick={() => onSemak(kes)}
                    title="Semak Kes"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── View B: Detail ───────────────────────────────────────────────────────────

function ViewDetail({ kes, onKembali, onTeruskan }) {
  return (
    <>
      <button className="kembali-link" onClick={onKembali}>
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kembali ke Senarai Kes
      </button>

      {/* Case header card */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
        padding: "16px 22px", marginBottom: 18,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ width: 4, borderRadius: 2, background: "var(--navy)", alignSelf: "stretch", flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.9px", textTransform: "uppercase", color: "var(--text-soft)" }}>
            Arahan Ketua Jabatan — Modul Penghantaran Digital Bersepadu
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>
            {kes.tajuk} — {kes.subtajuk.split("—")[1]?.trim()}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-soft)", lineHeight: 1.6, maxWidth: 620 }}>{kes.desc}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "6px 20px", flexShrink: 0 }}>
          {[
            ["No. Rujukan", kes.id],
            ["Tarikh Arahan", kes.tarikhArahan],
            ["Didaftarkan Oleh", kes.didaftarOleh],
            ["Peranan Penghantar", kes.perananPenghantar],
            ["Kategori", kes.kategori],
            ["Keutamaan", null],
          ].map(([key, val]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", color: "var(--text-muted)" }}>{key}</div>
              {key === "Keutamaan"
                ? <PriorityBadge keutamaan={kes.keutamaan} />
                : <div style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)", fontFamily: "'IBM Plex Mono', monospace" }}>{val}</div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Panel: Butiran Kes & Dokumen Asal */}
      <div className="table-panel" style={{ marginBottom: 18 }}>
        <div className="table-panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--navy-mid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div className="table-panel-title">Butiran Kes &amp; Dokumen Asal</div>
              <div className="table-panel-sub">Maklumat yang didaftarkan oleh Pembantu Tadbir — Baca Sahaja</div>
            </div>
          </div>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
            color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "3px 8px",
          }}>BACA SAHAJA</span>
        </div>

        <div style={{ padding: "18px 20px" }}>
          {/* Maklumat Kes */}
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
            color: "var(--text-muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
          }}>
            Maklumat Kes
            <span style={{ flex: 1, height: 1, background: "var(--border-light)", display: "block" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
            {[
              ["Tajuk Kes", kes.tajuk],
              ["No. Rujukan Auto", kes.id],
              ["Tarikh Diterima", kes.tarikhTerima],
              ["Kategori Aduan", kes.kategori],
              ["Pemohon / Pengadu", kes.pemohon],
              ["Kaedah Penerimaan", "Sistem e-Urus PDK"],
            ].map(([key, val]) => (
              <div key={key}>
                <div style={{ fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-soft)", marginBottom: 3 }}>{key}</div>
                <div style={{
                  fontSize: 12.5,
                  fontFamily: key === "No. Rujukan Auto" ? "'IBM Plex Mono', monospace" : undefined,
                  color: "var(--navy-mid)",
                }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Lampiran Asal */}
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
            color: "var(--text-muted)", margin: "20px 0 10px", display: "flex", alignItems: "center", gap: 8,
          }}>
            Lampiran Asal (Pembantu Tadbir)
            <span style={{ flex: 1, height: 1, background: "var(--border-light)", display: "block" }} />
          </div>

          {kes.lampiran.map((l, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)",
            }}>
              <div style={{
                width: 34, height: 34, background: "#dbeafe", border: "1px solid #bfdbfe",
                borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--navy)" }}>{l.nama}</div>
                <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>
                  Diimbas &amp; dimuat naik oleh {l.oleh} &bull; {l.tarikh}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 5, fontSize: 11.5,
                fontWeight: 500, color: "var(--text-mid)", cursor: "pointer",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Muat Turun
              </div>
            </div>
          ))}

          {/* AI Summary */}
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
            color: "var(--text-muted)", margin: "20px 0 10px", display: "flex", alignItems: "center", gap: 8,
          }}>
            Rumusan AI
            <span style={{ flex: 1, height: 1, background: "var(--border-light)", display: "block" }} />
          </div>

          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)", padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase",
                background: "var(--navy)", color: "var(--white)", padding: "2px 7px", borderRadius: "var(--radius-sm)",
              }}>AI · Auto Jana</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>Ringkasan Konteks Kes</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-mid)", lineHeight: 1.65 }}>{kes.aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Proceed button */}
      <button
        onClick={onTeruskan}
        style={{
          width: "100%", padding: "12px 18px", fontSize: 13, fontWeight: 600,
          background: "var(--navy)", color: "var(--white)", border: "1px solid var(--navy-border)",
          borderRadius: "var(--radius-md)", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Teruskan ke Muat Naik Laporan &amp; Bukti Lapangan
      </button>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function KBArahanKetuaJabatan() {
  const navigate = useNavigate();
  const [view, setView] = useState("senarai");
  const [selectedKes, setSelectedKes] = useState(null);

  const handleSemak = (kes) => {
    setSelectedKes(kes);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const handleKembali = () => {
    setView("senarai");
    setSelectedKes(null);
    window.scrollTo(0, 0);
  };

  const handleTeruskan = () => {
    navigate(`/ketua-bahagian/arahan-ketua-jabatan/${selectedKes.id}/hantar-laporan`);
  };

  const navTitle = view === "detail" && selectedKes
    ? `Semak Kes — ${selectedKes.id}`
    : "Arahan Ketua Jabatan";

  const breadcrumb = view === "detail"
    ? ["e-Urus PDK", "Ketua Bahagian", "Arahan Ketua Jabatan", "Butiran Kes"]
    : ["e-Urus PDK", "Ketua Bahagian", "Arahan Ketua Jabatan"];

  return (
    <>
      <Navbar
        title={navTitle}
        breadcrumbItems={breadcrumb}
        userName="Encik Rashdan bin Ismail"
        userRole="Ketua Bahagian"
      />

      <div className="content">
        {view === "senarai" && <ViewSenarai onSemak={handleSemak} />}
        {view === "detail" && selectedKes && (
          <ViewDetail kes={selectedKes} onKembali={handleKembali} onTeruskan={handleTeruskan} />
        )}
      </div>
    </>
  );
}
