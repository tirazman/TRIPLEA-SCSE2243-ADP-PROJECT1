import { useState } from "react";
import Navbar from "../../components/common/navbar";
import { submittedReports } from "../../data/pplData";

function ReportStatusBadge({ status }) {
  const map = {
    "Sedang Disemak": { cls: "badge-progress", label: "Sedang Disemak" },
    Diluluskan: { cls: "badge-received", label: "Diluluskan" },
    "Perlu Pembetulan": { cls: "badge-overdue", label: "Perlu Pembetulan" },
  };
  const conf = map[status] || map["Sedang Disemak"];
  return (
    <span className={`status-badge ${conf.cls}`}>
      <span className="badge-dot"></span>
      {conf.label}
    </span>
  );
}

function ReportDetailModal({ report, onClose }) {
  if (!report) return null;
  return (
    <div
      style={{
        display: "flex", position: "fixed", inset: 0, background: "rgba(13,33,55,0.45)",
        zIndex: 1000, alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
          width: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{report.id}</div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>{report.caseTitle}</div>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 4 }}>No. Rujukan Kes</div>
            <div style={{ fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", color: "var(--navy-mid)" }}>{report.caseRef}</div>
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 4 }}>Tarikh Dihantar</div>
            <div style={{ fontSize: 12.5 }}>{report.dateSubmitted}</div>
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 4 }}>Ketua Bahagian</div>
            <div style={{ fontSize: 12.5 }}>{report.kbName}</div>
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 4 }}>Status</div>
            <ReportStatusBadge status={report.status} />
          </div>
          {report.feedback && (
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 4 }}>Maklum Balas Ketua Bahagian</div>
              <div style={{ fontSize: 12, color: "var(--text-mid)", lineHeight: 1.6, background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                {report.feedback}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

export default function PPLLaporanDihantar() {
  const [viewingReport, setViewingReport] = useState(null);

  const sedangDisemakCount = submittedReports.filter((r) => r.status === "Sedang Disemak").length;
  const diluluskanCount = submittedReports.filter((r) => r.status === "Diluluskan").length;
  const perluPembetulanCount = submittedReports.filter((r) => r.status === "Perlu Pembetulan").length;

  return (
    <>
      <Navbar
        title="Laporan Dihantar"
        breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Laporan Dihantar"]}
        userName="Amirul Haziq Abdullah"
        userRole="Pegawai Penyedia Laporan"
      />

      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-heading">Laporan Dihantar</h1>
            <p className="page-subheading">
              Semak semua laporan yang telah dihantar kepada Ketua Bahagian berserta status semakan dan maklum balas yang diterima.
            </p>
          </div>
        </div>

        <div className="summary-strip summary-strip-3">
          <div className="summary-card">
            <div className="summary-icon summary-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{sedangDisemakCount}</div>
              <div className="summary-label">Sedang Disemak</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ borderColor: "var(--green-border)", background: "var(--green-bg)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{diluluskanCount}</div>
              <div className="summary-label">Diluluskan</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ borderColor: "var(--red-border)", background: "var(--red-bg)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{perluPembetulanCount}</div>
              <div className="summary-label">Perlu Pembetulan</div>
            </div>
          </div>
        </div>

        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <div className="table-panel-title">Senarai Laporan Dihantar</div>
              <div className="table-panel-sub">Menunjukkan {submittedReports.length} laporan yang telah dihantar</div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>No. Laporan</th>
                <th>Kes</th>
                <th>Tarikh Hantar</th>
                <th>Status</th>
                <th>Ketua Bahagian</th>
                <th style={{ textAlign: "right" }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {submittedReports.map((r) => (
                <tr key={r.id}>
                  <td className="td-ref">{r.id}</td>
                  <td>
                    <div className="td-tajuk">{r.caseTitle}</div>
                    <div className="td-tajuk-sub">{r.caseRef}</div>
                  </td>
                  <td className="td-date">{r.dateSubmitted}</td>
                  <td><ReportStatusBadge status={r.status} /></td>
                  <td className="td-date">{r.kbName}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-secondary" onClick={() => setViewingReport(r)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReportDetailModal report={viewingReport} onClose={() => setViewingReport(null)} />
    </>
  );
}
