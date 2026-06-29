import { useState } from "react";
import Navbar from "../../components/common/navbar";
import { pplLaporanData } from "../../data/statusKerjaData";
import "../../styles/pages/StatusKerja.css";

/* ─── Badge status untuk setiap laporan ─── */
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

/* ─── Modal Kemaskini Status ─── */
function UpdateModal({ report, onClose, onSave }) {
  const [modalStatus, setModalStatus] = useState(report.status);
  const [modalNotes, setModalNotes] = useState(report.notes);

  const handleSubmit = () => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    onSave({ ...report, status: modalStatus, notes: modalNotes, timestamp: ts });
    onClose();
  };

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
            <div className="case-modal-category">{report.aduan}</div>
          </div>
          <button className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="case-modal-body">
          {/* Pilih Status */}
          <div>
            <div className="case-modal-section-label">Sila Pilih Status Baharu</div>
            <select
              value={modalStatus}
              onChange={(e) => setModalStatus(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12.5px',
                color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
              }}
            >
              <option value="Pending">Belum Diambil Tindakan (Pending)</option>
              <option value="In Progress">Dalam Proses Tindakan (In Progress)</option>
              <option value="Completed">Selesai & Disahkan (Completed)</option>
            </select>
          </div>

          <div className="case-modal-divider"></div>

          {/* Nota */}
          <div>
            <div className="case-modal-section-label">Nota / Justifikasi Kemaskini</div>
            <textarea
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              placeholder="Masukkan nota semakan, ulasan atau catatan ringkas..."
              rows={4}
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12.5px',
                color: 'var(--text-primary)', background: 'var(--white)',
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div className="case-modal-footer" style={{ gap: '8px' }}>
          <button className="btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn-tindakan" onClick={handleSubmit}>Simpan Kemaskini</button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
    MAIN PAGE — PPL Status Kerja
   ════════════════════════════════════════════ */
export default function PPLStatusKerja() {
  const [laporanDatabase, setLaporanDatabase] = useState(pplLaporanData);
  const [activeReport, setActiveReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State baharu untuk mesej notifikasi pop-up
  const [toast, setToast] = useState(null);

  const pending   = laporanDatabase.filter(r => r.status === "Pending").length;
  const progress  = laporanDatabase.filter(r => r.status === "In Progress").length;
  const completed = laporanDatabase.filter(r => r.status === "Completed").length;
  const overdue = laporanDatabase.filter(r => r.status === "Overdue").length;

  const filtered = laporanDatabase.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return r.ref.toLowerCase().includes(q) || r.aduan.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
  });

  const showToast = (message) => {
    setToast(message);
    // Pop-up akan hilang secara automatik selepas 3.5 saat
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSave = (updated) => {
    setLaporanDatabase(prev => prev.map(r => r.ref === updated.ref ? updated : r));
    
    // Pemicu pop-up dipanggil di sini selepas simpanan berjaya
    const statusLabels = { Pending: "Pending", "In Progress": "Dalam Proses", Completed: "Selesai" };
    const label = statusLabels[updated.status] || updated.status;
    showToast(`Status laporan ${updated.ref} berjaya dikemas kini kepada "${label}".`);
  };

  return (
    <>
      <Navbar
          title="Status Kerja"
          breadcrumbItems={["e-Urus PDK", "Subsistem 4", "Senarai Laporan Aktif"]}
          userName="Amirul Haziq Abdullah"
          userRole="Pegawai Penyedia Laporan"
      />

      <div className="content">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-heading">Senarai Pengurusan Laporan Aktif</h1>
            <p className="page-subheading">
              Sistem pemantauan status tugasan laporan bagi urusan rasmi Pejabat Daerah Kluang.
            </p>
          </div>
        </div>

        {/* SUMMARY STRIP */}
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
              <div className="summary-val">{pending}</div>
              <div className="summary-label">Belum Diambil Tindakan</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon summary-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div className="summary-val">{progress}</div>
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
              <div className="summary-val">{completed}</div>
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
              <div className="summary-val">{overdue}</div>
              <div className="summary-label">Melebihi Tempoh</div>
            </div>
          </div>
        </div>

        {/* TABLE PANEL */}
        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <div className="table-panel-title">Senarai Laporan Aktif</div>
              <div className="table-panel-sub">Menunjukkan {filtered.length} laporan dalam sistem</div>
            </div>
            <div className="search-input-wrap search-input-sk-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="search-input"
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
                    <th>Aduan</th>
                    <th>Nama Laporan</th>
                    <th>Tarikh Terima</th>
                    <th>Tempoh Akhir</th>
                    <th>Status Semasa</th>
                    <th style={{ textAlign: 'right' }}>Tindakan</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map((report) => (
                <tr key={report.ref}>
                <td className="td-ref">{report.ref}</td>
                <td>
                    <div className="td-tajuk" >{report.aduan}</div>
                    <div className="td-tajuk-sub">{report.subtitle}</div>
                </td>
        
                <td>
                    <div className="td-tajuk">{report.title}</div>
                    {report.notes && (
                    <div className="td-tajuk-sub" style={{ marginTop: '5px', fontStyle: 'italic', borderLeft: '2px solid var(--border)', paddingLeft: '6px' }}>
                    Nota: {report.notes}
                    </div>
                    )}
                </td>
                <td className="td-date">{report.arrived}</td>
                <td className={`td-tempoh ${report.status === "Overdue" ? "tempoh-overdue" : "tempoh-normal"}`}>
                    {report.deadline}
                    {report.status === "Overdue" && (
                <svg
                    className="deadline-warning-icon"
                    width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="var(--red)" strokeWidth="2.5"
                >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                )}
                </td>
                <td><LaporanStatusBadge status={report.status} /></td>
                <td style={{ textAlign: 'right' }}>
                <button className="btn-tindakan" onClick={() => setActiveReport(report)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Kemaskini
                </button>
            </td>
            </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: '28px' }}>
                  Tiada rekod laporan ditemui bagi carian "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

      </div>

      {/* MODAL */}
      {activeReport && (
        <UpdateModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onSave={handleSave}
        />
      )}

      {/* ─── TOAST NOTIFICATION ELEMEN (Top-Right) ─── */}
      <div className={`toast${toast ? " show" : ""}`}>
        <div className="toast-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="toast-body">
          <div className="toast-title">Berjaya</div>
          <div className="toast-msg">{toast}</div>
        </div>
      </div>
    </>
  );
}