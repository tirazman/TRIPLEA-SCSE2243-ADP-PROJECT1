import { useState } from "react";
import Navbar from "../../components/common/navbar";
import { pplLaporanData } from "../../data/statusKerjaData";
import { initialTugasanList } from "../../data/tugasanData";
import "../../styles/pages/StatusKerja.css";

/* ─── Data khusus KB — extend initialTugasanList dengan 1 entry belum diagihkan ─── */
const kbTugasanList = [
  ...initialTugasanList,
  {
    id: "TGS-2026-0150",
    caseRef: "PDK/KLG/2026/0847",
    caseTitle: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    officer: "",
    instruction: "",
    priority: "Tinggi",
    dateGiven: "29 Jun 2026",
    deadline: "05 Jul 2026",
    status: "Belum Diagihkan",
  },
];

/* ─── Badge status tugasan KB ─── */
function TugasanStatusBadge({ status }) {
  const map = {
    "Menunggu Laporan": { cls: "badge-progress", label: "Sudah Diagihkan" },
    "Selesai":          { cls: "badge-received", label: "Sudah Diagihkan" },
    "Lewat":            { cls: "badge-overdue",  label: "Sudah Diagihkan (Lewat)" },
    "Belum Diagihkan":  { cls: "badge-pending",  label: "Belum Diagihkan" },
  };
  const conf = map[status] || { cls: "badge-pending", label: "Belum Diagihkan" };
  return (
    <span className={`status-badge ${conf.cls}`}>
      <span className="badge-dot"></span>
      {conf.label}
    </span>
  );
}

/* ─── Badge status laporan PPL ─── */
function LaporanStatusBadge({ status }) {
  const map = {
    Pending:       { cls: "badge-pending",  label: "Menunggu Tindakan" },
    "In Progress": { cls: "badge-progress", label: "Dalam Proses" },
    Completed:     { cls: "badge-received", label: "Selesai & Dihantar" },
    Overdue:       { cls: "badge-overdue",  label: "Melebihi Tempoh" },
  };
  const conf = map[status] || map.Pending;
  return (
    <span className={`status-badge ${conf.cls}`}>
      <span className="badge-dot"></span>
      {conf.label}
    </span>
  );
}

/* ─── Modal Butiran Tugasan KB (read-only) ─── */
function ButiranTugasanModal({ tugasan, onClose }) {
  if (!tugasan) return null;

  return (
    <div className="case-modal-overlay show" onClick={onClose}>
      <div className="case-modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="case-modal-header">
          <div>
            <div className="case-modal-id-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
              <span className="case-modal-id">{tugasan.id}</span>
            </div>
            <div className="case-modal-title">{tugasan.caseTitle}</div>
            <div className="case-modal-category">{tugasan.caseRef}</div>
          </div>
          <button className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="case-modal-body">

          <div>
            <div className="case-modal-section-label">Status Tugasan</div>
            <TugasanStatusBadge status={tugasan.status} />
          </div>

          <div className="case-modal-divider"/>

          <div>
            <div className="case-modal-section-label">Maklumat Tugasan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-soft)', width: '120px', flexShrink: 0 }}>Pegawai</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {tugasan.officer || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ditetapkan</span>}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-soft)', width: '120px', flexShrink: 0 }}>Tarikh Diberi</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: "'IBM Plex Mono', monospace" }}>{tugasan.dateGiven}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-soft)', width: '120px', flexShrink: 0 }}>Tarikh Akhir</span>
                <span style={{
                  color: tugasan.status === "Lewat" ? 'var(--red)' : 'var(--text-primary)',
                  fontWeight: tugasan.status === "Lewat" ? 600 : 400,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>{tugasan.deadline}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-soft)', width: '120px', flexShrink: 0 }}>Keutamaan</span>
                <span style={{ color: 'var(--text-primary)' }}>{tugasan.priority}</span>
              </div>
            </div>
          </div>

          {tugasan.instruction && (
            <>
              <div className="case-modal-divider"/>
              <div>
                <div className="case-modal-section-label">Arahan Tugasan</div>
                <div style={{
                  padding: '10px 14px', background: 'var(--surface-2)',
                  border: '1px solid var(--border-light)', borderLeft: '3px solid var(--navy)',
                  borderRadius: 'var(--radius-md)', fontSize: '12.5px',
                  color: 'var(--text-mid)', lineHeight: 1.6,
                }}>
                  {tugasan.instruction}
                </div>
              </div>
            </>
          )}

        </div>

        <div className="case-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal Butiran PPL (read-only) ─── */
function ButiranPPLModal({ report, onClose }) {
  if (!report) return null;

  const statusColor = {
    Pending:       { color: "var(--amber)", bg: "var(--amber-bg)", border: "var(--amber-border)" },
    "In Progress": { color: "#1d4ed8",      bg: "#eff6ff",         border: "#93c5fd" },
    Completed:     { color: "var(--green)", bg: "var(--green-bg)", border: "var(--green-border)" },
    Overdue:       { color: "var(--red)",   bg: "var(--red-bg)",   border: "var(--red-border)" },
  };
  const sc = statusColor[report.status] || statusColor.Pending;

  return (
    <div className="case-modal-overlay show" onClick={onClose}>
      <div className="case-modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="case-modal-header">
          <div>
            <div className="case-modal-id-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="case-modal-id">{report.ref}</span>
            </div>
            <div className="case-modal-title">{report.title}</div>
            <div className="case-modal-category">{report.subtitle}</div>
          </div>
          <button className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="case-modal-body">

          <div>
            <div className="case-modal-section-label">Status Semasa Tugasan PPL</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px', borderRadius: 'var(--radius-md)',
              border: `1px solid ${sc.border}`, background: sc.bg,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: sc.color, flexShrink: 0 }}/>
              <span style={{ fontSize: '13px', fontWeight: 600, color: sc.color }}>
                {report.status === "Pending"     && "Menunggu Tindakan — Laporan belum dimulakan."}
                {report.status === "In Progress" && "Dalam Proses — Penyedia Laporan sedang menyiapkan tugasan."}
                {report.status === "Completed"   && "Selesai & Dihantar — Laporan telah disempurnakan."}
                {report.status === "Overdue"     && "Melebihi Tempoh — Laporan belum siap dan telah melepasi tarikh akhir."}
              </span>
            </div>
          </div>

          <div className="case-modal-divider"/>

          <div>
            <div className="case-modal-section-label">Maklumat Laporan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: "Tajuk Aduan",     value: report.aduan,     mono: false },
                { label: "Nama Laporan",    value: report.title,     mono: false, bold: true },
                { label: "Tarikh Terima",   value: report.arrived,   mono: true },
                { label: "Tempoh Akhir",    value: report.deadline,  mono: true, red: report.status === "Overdue" },
                { label: "Kemaskini Akhir", value: report.timestamp, mono: true },
              ].map(({ label, value, mono, bold, red }) => (
                <div key={label} style={{ display: 'flex', gap: '8px', fontSize: '12.5px' }}>
                  <span style={{ color: 'var(--text-soft)', width: '120px', flexShrink: 0 }}>{label}</span>
                  <span style={{
                    color: red ? 'var(--red)' : bold ? 'var(--navy)' : 'var(--text-primary)',
                    fontWeight: bold || red ? 600 : 400,
                    fontFamily: mono ? "'IBM Plex Mono', monospace" : 'inherit',
                  }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {report.notes && (
            <>
              <div className="case-modal-divider"/>
              <div>
                <div className="case-modal-section-label">Nota Daripada Penyedia Laporan</div>
                <div style={{
                  padding: '10px 14px', background: 'var(--surface-2)',
                  border: '1px solid var(--border-light)', borderLeft: '3px solid var(--navy)',
                  borderRadius: 'var(--radius-md)', fontSize: '12.5px',
                  color: 'var(--text-mid)', fontStyle: 'italic', lineHeight: 1.6,
                }}>
                  {report.notes}
                </div>
              </div>
            </>
          )}

        </div>

        <div className="case-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE — KB Status Kerja (2 Tabs)
   ════════════════════════════════════════════ */
export default function KBStatusKerja() {
  const [activeTab, setActiveTab]         = useState("tugasan");
  const [activeTugasan, setActiveTugasan] = useState(null);
  const [activePPL, setActivePPL]         = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");

  // Tab 1 stats
  const tugasanSudah = kbTugasanList.filter(t => t.status !== "Belum Diagihkan").length;
  const tugasanBelum = kbTugasanList.filter(t => t.status === "Belum Diagihkan").length;
  const tugasanLewat = kbTugasanList.filter(t => t.status === "Lewat").length;

  // Tab 2 stats
  const pplPending   = pplLaporanData.filter(r => r.status === "Pending").length;
  const pplProgress  = pplLaporanData.filter(r => r.status === "In Progress").length;
  const pplCompleted = pplLaporanData.filter(r => r.status === "Completed").length;
  const pplOverdue   = pplLaporanData.filter(r => r.status === "Overdue").length;

  // ── Fixed filter — guard against empty officer field ──
  const filteredTugasan = kbTugasanList.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (t.id || "").toLowerCase().includes(q) ||
      (t.caseRef || "").toLowerCase().includes(q) ||
      (t.caseTitle || "").toLowerCase().includes(q) ||
      (t.officer || "").toLowerCase().includes(q)
    );
  });

  const filteredPPL = pplLaporanData.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.ref.toLowerCase().includes(q) ||
      r.aduan.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q)
    );
  });

  const switchTab = (tab) => { setActiveTab(tab); setSearchQuery(""); };

  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Status Kerja"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />

      <div className="content">

        <div className="page-header">
          <div>
            <h1 className="page-heading">Status Kerja</h1>
            <p className="page-subheading">
              Pantau status tugasan yang telah diagihkan dan kemajuan laporan Pegawai Penyedia Laporan di bawah bahagian anda.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '18px',
          borderBottom: '1px solid var(--border)',
        }}>
          {[
            { key: "tugasan", label: "Tugasan Saya" },
            { key: "ppl",     label: "Status PPL" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              style={{
                padding: '9px 18px', fontSize: '13px', fontWeight: 600,
                fontFamily: "'IBM Plex Sans', sans-serif",
                border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: activeTab === key ? '2px solid var(--navy)' : '2px solid transparent',
                color: activeTab === key ? 'var(--navy)' : 'var(--text-soft)',
                marginBottom: '-1px', transition: 'color 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: TUGASAN SAYA ── */}
        {activeTab === "tugasan" && (
          <>
            <div className="summary-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--green-border)', background: 'var(--green-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{tugasanSudah}</div>
                  <div className="summary-label">Sudah Diagihkan</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--amber-border)', background: 'var(--amber-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{tugasanBelum}</div>
                  <div className="summary-label">Belum Diagihkan</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--red-border)', background: 'var(--red-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{tugasanLewat}</div>
                  <div className="summary-label">Lewat</div>
                </div>
              </div>
            </div>

            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <div className="table-panel-title">Senarai Tugasan Diagihkan</div>
                  <div className="table-panel-sub">Menunjukkan {filteredTugasan.length} tugasan yang telah diagihkan kepada PPL</div>
                </div>
                <div className="search-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text" className="search-input"
                    placeholder="Cari no. tugasan, pegawai atau kes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. Tugasan</th>
                    <th>Tajuk Kes</th>
                    <th>Pegawai Ditugaskan</th>
                    <th>Tarikh Diberi</th>
                    <th>Tarikh Akhir</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Butiran</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTugasan.map(t => (
                    <tr key={t.id}>
                      {/* ── Fixed: inline style to force visibility ── */}
                      <td style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '11.5px', fontWeight: 600,
                        color: 'var(--navy)',
                      }}>
                        {t.id}
                      </td>
                      <td>
                        <div className="td-tajuk">{t.caseTitle}</div>
                        <div className="td-tajuk-sub">{t.caseRef}</div>
                      </td>
                      <td className="td-date">
                        {t.officer || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ditetapkan</span>}
                      </td>
                      <td className="td-date">{t.dateGiven}</td>
                      <td className={`td-tempoh ${t.status === "Lewat" ? "tempoh-overdue" : "tempoh-normal"}`}>
                        {t.deadline}
                        {t.status === "Lewat" && (
                          <svg className="deadline-warning-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        )}
                      </td>
                      <td><TugasanStatusBadge status={t.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-secondary" onClick={() => setActiveTugasan(t)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          Butiran
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTugasan.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: '28px' }}>
                        Tiada tugasan ditemui bagi carian "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TAB 2: STATUS PPL ── */}
        {activeTab === "ppl" && (
          <>
            <div className="summary-strip" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--amber-border)', background: 'var(--amber-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{pplPending}</div>
                  <div className="summary-label">Menunggu Tindakan</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon summary-icon-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{pplProgress}</div>
                  <div className="summary-label">Dalam Proses</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--green-border)', background: 'var(--green-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{pplCompleted}</div>
                  <div className="summary-label">Selesai & Dihantar</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: 'var(--red-border)', background: 'var(--red-bg)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{pplOverdue}</div>
                  <div className="summary-label">Melebihi Tempoh</div>
                </div>
              </div>
            </div>

            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <div className="table-panel-title">Status Laporan PPL</div>
                  <div className="table-panel-sub">Menunjukkan {filteredPPL.length} laporan di bawah bahagian anda</div>
                </div>
                <div className="search-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text" className="search-input"
                    placeholder="Cari rujukan, aduan atau laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. Rujukan</th>
                    <th>Kes</th>
                    <th>Nama Laporan</th>
                    <th>Tarikh Terima</th>
                    <th>Tempoh Akhir</th>
                    <th>Status Semasa</th>
                    <th style={{ textAlign: 'right' }}>Butiran</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPPL.map(r => (
                    <tr key={r.ref}>
                      <td style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '11.5px', fontWeight: 600,
                        color: 'var(--navy)',
                      }}>
                        {r.ref}
                      </td>
                      <td>
                        <div className="td-tajuk">{r.aduan}</div>
                        <div className="td-tajuk-sub">{r.subtitle}</div>
                      </td>
                      <td><div className="td-tajuk">{r.title}</div></td>
                      <td className="td-date">{r.arrived}</td>
                      <td className={`td-tempoh ${r.status === "Overdue" ? "tempoh-overdue" : "tempoh-normal"}`}>
                        {r.deadline}
                        {r.status === "Overdue" && (
                          <svg className="deadline-warning-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        )}
                      </td>
                      <td><LaporanStatusBadge status={r.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-secondary" onClick={() => setActivePPL(r)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          Butiran
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPPL.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: '28px' }}>
                        Tiada rekod ditemui bagi carian "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>

      {/* MODALS */}
      {activeTugasan && (
        <ButiranTugasanModal
          tugasan={activeTugasan}
          onClose={() => setActiveTugasan(null)}
        />
      )}
      {activePPL && (
        <ButiranPPLModal
          report={activePPL}
          onClose={() => setActivePPL(null)}
        />
      )}
    </>
  );
}