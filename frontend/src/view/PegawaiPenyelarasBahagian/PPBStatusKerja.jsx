import { useState } from "react";
import Navbar from "../../components/common/navbar";
import {
  caseRegistry,
  caseDeptStatus,
  workStatusCases,
  deptDisplay,
  deptStatusLabel,
} from "../../data/statusKerjaData";
import "../../styles/pages/StatusKerja.css";

/* ─── Badge status untuk setiap kes (table) ─── */
function CaseStatusBadge({ status }) {
  const map = {
    Pending: { cls: "badge-pending", label: "Menunggu Tindakan" },
    "In Progress": { cls: "badge-progress", label: "Dalam Proses" },
    Overdue: { cls: "badge-overdue", label: "Melebihi Tempoh" },
  };
  const conf = map[status] || map.Pending;
  return (
    <span className={`status-badge ${conf.cls}`}>
      <span className="badge-dot"></span>
      {conf.label}
    </span>
  );
}

/* ─── Badge status untuk setiap jabatan (dalam modal) ─── */
function DeptStatusBadge({ status }) {
  const map = {
    Pending: { cls: "badge-pending", label: deptStatusLabel.Pending },
    "In Progress": { cls: "badge-progress", label: deptStatusLabel["In Progress"] },
    Completed: { cls: "badge-received", label: deptStatusLabel.Completed },
    Overdue: { cls: "badge-overdue", label: deptStatusLabel.Overdue },
  };
  const conf = map[status] || map.Pending;
  return <span className={`status-badge ${conf.cls}`}>{conf.label}</span>;
}

/* ─── Satu entri timeline jabatan dalam modal ─── */
function DeptTimelineItem({ entry }) {
  const dept = deptDisplay[entry.dept] || { short: "?" };

  // Warna avatar jabatan — ikut bahagian, sama macam vanilla (tambahan,
  // sebab tema sedia ada tak ada set warna khusus untuk setiap jabatan).
  const deptColorMap = {
    "Bahagian Fizikal": { color: "#1a6fa8", bg: "#e8f4fd", border: "#90c8f0" },
    "Bahagian Masyarakat": { color: "#6b3fa0", bg: "#f3eefe", border: "#c4a8e8" },
    "Bahagian Pentadbiran (Bencana dan Keselamatan)": { color: "#027a48", bg: "#ecfdf3", border: "#a6f4c5" },
  };
  const colors = deptColorMap[entry.dept] || { color: "var(--text-soft)", bg: "var(--surface-2)", border: "var(--border)" };

  return (
    <div className="dept-timeline-item">
      <div
        className="dept-avatar"
        style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.color }}
      >
        {dept.short}
      </div>
      <div className="dept-timeline-content">
        <div className="dept-timeline-top">
          <span className="dept-timeline-name" style={{ color: colors.color }}>{entry.dept}</span>
          <DeptStatusBadge status={entry.status} />
        </div>

        <div className="dept-doc-chip">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>{entry.docTitle}</span>
        </div>

        <p className="dept-timeline-note">{entry.note}</p>

        <div className="dept-timeline-meta">
          <span className="dept-timeline-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {entry.date}
          </span>
          <span className="dept-timeline-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {entry.staff}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal: Sejarah Pergerakan Kes ─── */
function CaseHistoryModal({ caseRef, onClose }) {
  if (!caseRef) return null;

  const kes = caseRegistry[caseRef];
  const deptStatuses = caseDeptStatus[caseRef] || [];
  const relatedCases = workStatusCases.filter((c) => c.ref === caseRef);

  return (
    <div className="case-modal-overlay show" onClick={onClose}>
      <div className="case-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="case-modal-header">
          <div>
            <div className="case-modal-id-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="case-modal-id">{caseRef}</span>
              <span className="case-modal-hop-count">{deptStatuses.length} bahagian terlibat</span>
            </div>
            <div className="case-modal-title">{kes?.label}</div>
            <span className="case-modal-category">{kes?.category}</span>
          </div>
          <button className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="case-modal-body">
          <div>
            <div className="case-modal-section-label">Dokumen Dalam Kes Ini</div>
            {relatedCases.map((c) => (
              <div className="case-modal-doc-row" key={c.ref}>
                <span className="case-modal-doc-ref">{c.ref}</span>
                <span className="case-modal-doc-title">{c.title}</span>
              </div>
            ))}
          </div>

          <div className="case-modal-divider"></div>

          <div>
            <div className="case-modal-section-label">Status Tindakan Mengikut Bahagian</div>
            {deptStatuses.map((entry) => (
              <DeptTimelineItem key={entry.dept} entry={entry} />
            ))}
          </div>
        </div>

        <div className="case-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE — Status Kerja
   Cases still waiting on one or more departments to submit. Once
   every department for a case has submitted, that case is moved to
   "Penerimaan Laporan" instead (so it disappears from this page).
   ════════════════════════════════════════════════════════════════ */
export default function PPBStatusKerja() {
  const [activeCaseRef, setActiveCaseRef] = useState(null);

  const inProgressCount = workStatusCases.filter((c) => c.status === "In Progress").length;
  const overdueCount = workStatusCases.filter((c) => c.status === "Overdue").length;
  const pendingCount = workStatusCases.filter((c) => c.status === "Pending").length;

  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Subsistem 4", "Senarai Kes Aktif"]}
      />

      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-heading">Status Kerja</h1>
            <p className="page-subheading">
              Semak status penyerahan laporan daripada setiap jabatan yang terlibat bagi setiap kes. Klik butang <strong>Butiran</strong> untuk melihat kemajuan terkini setiap bahagian.
            </p>
          </div>
        </div>

        <div className="summary-strip">
          <div className="summary-card">
            <div className="summary-icon summary-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{inProgressCount}</div>
              <div className="summary-label">Dalam Proses</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ borderColor: "var(--red-border)", background: "var(--red-bg)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{overdueCount}</div>
              <div className="summary-label">Melebihi Tempoh</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ borderColor: "var(--amber-border)", background: "var(--amber-bg)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{pendingCount}</div>
              <div className="summary-label">Menunggu Tindakan</div>
            </div>
          </div>
        </div>

        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <div className="table-panel-title">Senarai Kes Aktif</div>
              <div className="table-panel-sub">Menunjukkan {workStatusCases.length} kes yang sedang dalam proses koordinasi bahagian</div>
            </div>
            <div className="search-input-wrap search-input-sk-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" className="search-input" placeholder="Cari no. rujukan atau tajuk..." />
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>No. Rujukan</th>
                <th>Kes</th>
                <th>Tarikh Terima</th>
                <th>Tempoh Akhir</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Butiran</th>
              </tr>
            </thead>
            <tbody>
              {workStatusCases.map((c) => (
                <tr key={c.ref}>
                  <td className="td-ref">{c.ref}</td>
                  <td>
                    <div className="td-tajuk">{c.title}</div>
                    <div className="td-tajuk-sub">{c.subtitle}</div>
                  </td>
                  <td className="td-date">{c.arrived}</td>
                  <td className={`td-tempoh ${c.status === "Overdue" ? "tempoh-overdue" : "tempoh-normal"}`}>
                    {c.deadline}
                    {c.status === "Overdue" && (
                      <svg
                        className="deadline-warning-icon"
                        width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="var(--red)" strokeWidth="2.5"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                  </td>
                  <td><CaseStatusBadge status={c.status} /></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-secondary" onClick={() => setActiveCaseRef(c.ref)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Butiran
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CaseHistoryModal caseRef={activeCaseRef} onClose={() => setActiveCaseRef(null)} />
    </>
  );
}
