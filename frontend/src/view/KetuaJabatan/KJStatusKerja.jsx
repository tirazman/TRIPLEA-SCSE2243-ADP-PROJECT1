import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/common/navbar";
import Pagination from "../../components/common/Pagination";
import "../../styles/pages/PenerimaanLaporan.css";
import "../../styles/pages/PengagihanBahagian.css";
import "../../styles/pages/StatusKerja.css";

const ITEMS_PER_PAGE = 6;

// ─── Config paparan statik (bukan data — kekal sama macam asal) ───
const kjPipelineLabel = {
  "Dalam Proses Bahagian": "Dalam Proses Bahagian",
  "Menunggu Koordinasi": "Menunggu Koordinasi PPB",
  "Menunggu Semakan Akhir": "Menunggu Semakan Akhir KJ",
  Selesai: "Selesai",
  "Melebihi Tempoh": "Melebihi Tempoh",
};
const kjPipelineSteps = [
  "Diagihkan ke Bahagian",
  "Dalam Proses Bahagian",
  "Menunggu Koordinasi PPB",
  "Menunggu Semakan Akhir KJ",
  "Selesai",
];
function getKjPipelineStepIndex(stage) {
  const map = {
    "Dalam Proses Bahagian": 1,
    "Melebihi Tempoh": 1,
    "Menunggu Koordinasi": 2,
    "Menunggu Semakan Akhir": 3,
    Selesai: 4,
  };
  return map[stage] ?? 0;
}
const deptDisplay = {
  "Bahagian Fizikal": { short: "BF" },
  "Bahagian Masyarakat": { short: "BM" },
  "Bahagian Pentadbiran": { short: "BP" },
};
const deptStatusLabel = {
  Pending: "Belum Mula",
  "In Progress": "Sedang Diproses",
  Completed: "Selesai Dihantar",
  Overdue: "Melebihi Tempoh",
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }) : "-");

function mapDeptEntryStatus(row) {
  const deadlinePassed = row.deadline && new Date(row.deadline) < new Date();
  if (row.reportStatus === "Diluluskan" || row.assignmentStatus === "Dihantar") return "Completed";
  if (deadlinePassed) return "Overdue";
  if (row.reportID || row.assignmentStatus === "Sedang Diproses") return "In Progress";
  return "Pending";
}

// ─── Fetch semua Document yang dah diagihkan KJ, gabung dengan DocumentDepartment untuk pipeline stage & breakdown bahagian ───
function useKJStatusData() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5000/api/documents`).then((r) => r.json()),
      fetch(`http://localhost:5000/api/document-departments`).then((r) => r.json()),
    ])
      .then(([documents, assignments]) => {
        const relevantDocs = documents.filter((d) =>
          ["Diagihkan", "Dalam Tindakan", "Menunggu Semakan Akhir", "Selesai"].includes(d.status)
        );

        const mapped = relevantDocs.map((doc) => {
          const depts = assignments.filter((a) => a.refNo === doc.refNo);
          const deadlinePassed = doc.deadline && new Date(doc.deadline) < new Date();
          const allDihantar = depts.length > 0 && depts.every((d) => d.assignmentStatus === "Dihantar");

          let pipelineStage;
          if (doc.status === "Selesai") pipelineStage = "Selesai";
          else if (doc.status === "Menunggu Semakan Akhir") pipelineStage = "Menunggu Semakan Akhir";
          else if (deadlinePassed) pipelineStage = "Melebihi Tempoh";
          else if (allDihantar) pipelineStage = "Menunggu Koordinasi";
          else pipelineStage = "Dalam Proses Bahagian";

          return {
            ref: doc.refNo,
            title: doc.title,
            subtitle: `${doc.category || ""}${doc.category && doc.location ? " — " : ""}${doc.location || ""}`,
            category: doc.category,
            assignedDate: formatDate(depts[0]?.assignedAt || doc.submissionDate),
            deadline: formatDate(doc.deadline),
            assignedDepts: depts.map((d) => d.deptName),
            assignNote: null, // tiada dalam backend
            pipelineStage,
            deptStatuses: depts.map((d) => ({
              dept: d.deptName,
              status: mapDeptEntryStatus(d),
              staff: d.officerName || "Belum ditugaskan",
              date: formatDate(d.submittedAt || d.assignedAt),
              docTitle: d.reportID ? `Laporan ${d.deptName}` : "Belum ada laporan disediakan",
              note: d.reportDetails || "",
            })),
          };
        });

        setCases(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil status kerja KJ:", err);
        setLoading(false);
      });
  }, []);

  return { cases, loading };
}

function PipelineStageBadge({ stage }) {
  const map = {
    "Dalam Proses Bahagian": { cls: "badge-progress", label: kjPipelineLabel[stage] },
    "Menunggu Koordinasi": { cls: "badge-progress", label: kjPipelineLabel[stage] },
    "Menunggu Semakan Akhir": { cls: "badge-pending", label: kjPipelineLabel[stage] },
    Selesai: { cls: "badge-received", label: kjPipelineLabel[stage] },
    "Melebihi Tempoh": { cls: "badge-overdue", label: kjPipelineLabel[stage] },
  };
  const conf = map[stage] || { cls: "badge-pending", label: stage };

  return (
    <span className={`status-badge ${conf.cls}`}>
      <span className="badge-dot" />
      {conf.label}
    </span>
  );
}

// ... (Kekalkan fungsi DeptStatusBadge, DeptTimelineItem, PipelineStepper, dan ConsolidatedReportBlock yang sedia ada)
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

function DeptTimelineItem({ entry }) {
  const dept = deptDisplay[entry.dept] || { short: "?" };
  const deptColorMap = {
    "Bahagian Fizikal": { color: "#1a6fa8", bg: "#e8f4fd", border: "#90c8f0" },
    "Bahagian Masyarakat": { color: "#6b3fa0", bg: "#f3eefe", border: "#c4a8e8" },
    "Bahagian Pentadbiran": { color: "#027a48", bg: "#ecfdf3", border: "#a6f4c5" },
    "Bahagian Pentadbiran (Bencana dan Keselamatan)": { color: "#027a48", bg: "#ecfdf3", border: "#a6f4c5" },
  };
  const colors = deptColorMap[entry.dept] || {
    color: "var(--text-soft)",
    bg: "var(--surface-2)",
    border: "var(--border)",
  };

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
          <span className="dept-timeline-name" style={{ color: colors.color }}>
            {entry.dept}
          </span>
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

function PipelineStepper({ currentStepIndex }) {
  return (
    <div className="process-steps">
      {kjPipelineSteps.map((label, i) => {
        const isDone = i < currentStepIndex;
        const isActive = i === currentStepIndex;

        return (
          <div key={label} className="step-item">
            <div className="step-number-col">
              <div className={`step-num${isDone ? " done" : ""}${isActive ? " active" : ""}`}>
                {isDone ? (
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            </div>
            <div className="step-content">
              <div className={`step-label${isActive ? " active-label" : ""}${isDone ? " done-label" : ""}`}>
                {label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConsolidatedReportBlock({ report, readOnly }) {
  if (!report) {
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "var(--surface-2)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: "12.5px",
          color: "var(--text-soft)",
          textAlign: "center",
        }}
      >
        Laporan akhir konsolidasi belum dihantar oleh Pegawai Penyelaras Bahagian.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px", fontSize: "12.5px" }}>
          <span style={{ color: "var(--text-soft)", width: "130px", flexShrink: 0 }}>Dihantar oleh</span>
          <span>{report.submittedBy}</span>
        </div>
        <div style={{ display: "flex", gap: "8px", fontSize: "12.5px" }}>
          <span style={{ color: "var(--text-soft)", width: "130px", flexShrink: 0 }}>Tarikh Hantar</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{report.submittedDate}</span>
        </div>
      </div>

      {report.note && (
        <div
          style={{
            marginBottom: "12px",
            padding: "10px 14px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-light)",
            borderLeft: "3px solid var(--navy)",
            borderRadius: "var(--radius-md)",
            fontSize: "12.5px",
            color: "var(--text-mid)",
            lineHeight: 1.6,
          }}
        >
          {report.note}
        </div>
      )}

      <div className="attach-label">Fail Laporan Akhir (Untuk Semakan KJ)</div>
      <div className="kj-file-card">
        <div className="kj-file-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="kj-file-info">
          <div className="kj-file-name">{report.file.name}</div>
          <div className="kj-file-meta">
            {report.file.size} • {report.file.type}
          </div>
        </div>
        <button
          type="button"
          className="btn-outline kj-file-view"
          onClick={() => window.alert(`Pratonton fail: ${report.file.name}`)}
        >
          Lihat Fail
        </button>
      </div>

      {!readOnly && (
        <p style={{ fontSize: "11px", color: "var(--text-soft)", marginTop: "10px", lineHeight: 1.5 }}>
          Pratonton fail sahaja. Untuk meluluskan semakan akhir, gunakan butang{" "}
          <strong>Lulus Semakan Akhir</strong> di bawah modal.
        </p>
      )}
    </>
  );
}

function CaseDetailModal({ caseData, onClose, onApprove, isSubmitting }) {
  const [consolidatedReport, setConsolidatedReport] = useState(null);

  useEffect(() => {
    if (caseData && caseData.pipelineStage === "Selesai") {
      fetch(`http://localhost:5000/api/compile-reports/${encodeURIComponent(caseData.ref)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) { setConsolidatedReport(null); return; }
          setConsolidatedReport({
            submittedBy: data.finalizedByName || "-",
            submittedDate: formatDate(data.compileAt),
            note: data.finalSummary || "",
            file: { name: `Laporan_Konsolidasi_${caseData.ref.replace(/\//g, "_")}.pdf`, size: "-", type: "PDF" },
          });
        })
        .catch(() => setConsolidatedReport(null));
    } else {
      setConsolidatedReport(null);
    }
  }, [caseData]);

  if (!caseData) return null;

  const { ref: caseRef, deptStatuses } = caseData;
  const stepIndex = getKjPipelineStepIndex(caseData.pipelineStage);

  const canApprove =
    caseData.pipelineStage === "Menunggu Semakan Akhir" && !!consolidatedReport && !isSubmitting;
  const isSelesai = caseData.pipelineStage === "Selesai";

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
            <div className="case-modal-title">{caseData.title}</div>
            <span className="case-modal-category">{caseData.category}</span>
          </div>
          <button type="button" className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="case-modal-body">
          <div>
            <div className="case-modal-section-label">Maklumat Agihan Ketua Jabatan</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Tarikh Agihan", value: caseData.assignedDate, mono: true },
                { label: "Tempoh Akhir", value: caseData.deadline, mono: true },
                { label: "Bahagian Diagihkan", value: caseData.assignedDepts.join(", "), mono: false },
                { label: "Tahap Semasa", value: kjPipelineLabel[caseData.pipelineStage], mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: "flex", gap: "8px", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-soft)", width: "130px", flexShrink: 0 }}>{label}</span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {caseData.assignNote && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 14px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-light)",
                  borderLeft: "3px solid var(--navy)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12.5px",
                  color: "var(--text-mid)",
                  lineHeight: 1.6,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    color: "var(--text-soft)",
                    marginBottom: "4px",
                  }}
                >
                  Nota Agihan
                </strong>
                {caseData.assignNote}
              </div>
            )}
          </div>

          <div className="case-modal-divider" />

          <div>
            <div className="case-modal-section-label">Perjalanan Kes</div>
            <PipelineStepper currentStepIndex={stepIndex} />
          </div>

          <div className="case-modal-divider" />

          <div>
            <div className="case-modal-section-label">Status Tindakan Mengikut Bahagian</div>
            {deptStatuses.length === 0 ? (
              <p style={{ fontSize: "12.5px", color: "var(--text-soft)" }}>
                Tiada rekod bahagian untuk kes ini.
              </p>
            ) : (
              deptStatuses.map((entry) => <DeptTimelineItem key={entry.dept} entry={entry} />)
            )}
          </div>

          <div className="case-modal-divider" />

          <div>
            <div className="case-modal-section-label">Laporan Akhir untuk Semakan KJ</div>
            <ConsolidatedReportBlock report={consolidatedReport} readOnly={isSelesai} />
          </div>

          {canApprove && (
            <>
              <div className="case-modal-divider" />
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--amber-bg)",
                  border: "1px solid var(--amber-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12.5px",
                  color: "var(--amber)",
                }}
              >
                Laporan konsolidasi daripada Pegawai Penyelaras Bahagian sedia untuk semakan akhir Ketua Jabatan.
                Sila semak fail di atas, kemudian klik <strong>Lulus Semakan Akhir</strong>.
              </div>
            </>
          )}

          {isSelesai && (
            <>
              <div className="case-modal-divider" />
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--green-bg)",
                  border: "1px solid var(--green-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12.5px",
                  color: "var(--green)",
                }}
              >
                Semakan akhir telah diluluskan. Kes ditandakan sebagai selesai.
              </div>
            </>
          )}
        </div>

        <div className="case-modal-footer" style={{ gap: "8px" }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Tutup
          </button>

          {canApprove && (
            <button
              type="button"
              className="btn-tindakan"
              disabled={isSubmitting}
              onClick={() => onApprove(caseRef)}
            >
              {isSubmitting ? (
                "Memproses..."
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Lulus Semakan Akhir
                </>
              )}
            </button>
          )}

          {isSelesai && (
            <button
              type="button"
              disabled
              style={{
                padding: "7px 14px",
                background: "var(--green-bg)",
                border: "1px solid var(--green-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--green)",
                cursor: "default",
              }}
            >
              Kes Telah Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ButiranKBModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="case-modal-overlay show" onClick={onClose}>
      <div className="case-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="case-modal-header">
          <div>
            <div className="case-modal-id-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="case-modal-id">{data.caseRef}</span>
            </div>
            <div className="case-modal-title">{data.dept}</div>
            <span className="case-modal-category">{data.caseTitle}</span>
          </div>
          <button type="button" className="case-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="case-modal-body">
          <div>
            <div className="case-modal-section-label">Status Tindakan Bahagian</div>
            <DeptStatusBadge status={data.status} />
          </div>

          <div className="case-modal-divider" />

          <div>
            <div className="case-modal-section-label">Maklumat Kemajuan Bahagian</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Ketua Bahagian / Staf", value: data.staff },
                { label: "Dokumen Dikendali", value: data.docTitle },
                { label: "Kemaskini Akhir", value: data.date, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: "flex", gap: "8px", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--text-soft)", width: "140px", flexShrink: 0 }}>{label}</span>
                  <span style={{ color: "var(--text-primary)", fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit" }}>
                    {value || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Tiada maklumat</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {data.note && (
            <>
              <div className="case-modal-divider" />
              <div>
                <div className="case-modal-section-label">Nota Maklum Balas Bahagian</div>
                <div style={{
                  padding: "10px 14px", background: "var(--surface-2)",
                  border: "1px solid var(--border-light)", borderLeft: "3px solid var(--navy)",
                  borderRadius: "var(--radius-md)", fontSize: "12.5px",
                  color: "var(--text-mid)", lineHeight: 1.6,
                }}>
                  {data.note}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="case-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function KJStatusKerja() {
  const { cases, loading } = useKJStatusData();
  const [activeTab, setActiveTab] = useState("tugasan"); // "tugasan" atau "kb"
  const [activeCaseRef, setActiveCaseRef] = useState(null);
  const [activeKBRow, setActiveKBRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showReminder, setShowReminder] = useState(false); // State kawalan untuk peringatan merah pastel
  const [currentPageTugasan, setCurrentPageTugasan] = useState(1);
  const [currentPageKB, setCurrentPageKB] = useState(1);

  const activeCase = cases.find((c) => c.ref === activeCaseRef) || null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApproveFinalReview = (ref) => {
    // NOTA: simulasi paparan sahaja — tak wired ke backend (case sebenar
    // takkan pernah capai stage "Menunggu Semakan Akhir" ikut flow semasa,
    // sebab PPB compile terus set status ke "Selesai").
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveCaseRef(null);
      showToast(`Semakan akhir untuk ${ref} diluluskan. Kes ditandakan selesai.`);
    }, 600);
  };

  // Tab 1 Stats (Tugasan Saya)
  const statsTugasan = useMemo(
    () => ({
      dalamProses: cases.filter((c) => c.pipelineStage === "Dalam Proses Bahagian" || c.pipelineStage === "Menunggu Koordinasi").length,
      menungguSemakan: cases.filter((c) => c.pipelineStage === "Menunggu Semakan Akhir").length,
      selesai: cases.filter((c) => c.pipelineStage === "Selesai").length,
      lewat: cases.filter((c) => c.pipelineStage === "Melebihi Tempoh").length,
    }),
    [cases]
  );

  // Auto-trigger peringatan merah sekiranya ada tugasan yang Menunggu Semakan Akhir
  useEffect(() => {
    if (statsTugasan.menungguSemakan > 0) {
      setShowReminder(true);
    }
  }, [statsTugasan.menungguSemakan]);

  // Tab 2 Data & Stats Generation (Status Ketua Bahagian)
  const kbStatusList = useMemo(() => {
    const list = [];
    cases.forEach((c) => {
      (c.deptStatuses || []).forEach((d, idx) => {
        list.push({
          id: `${c.ref}-${idx}`,
          caseRef: c.ref,
          caseTitle: c.title,
          dept: d.dept,
          status: d.status,
          staff: d.staff,
          date: d.date,
          docTitle: d.docTitle,
          note: d.note,
        });
      });
    });
    return list;
  }, [cases]);

  const statsKB = useMemo(
    () => ({
      pending: kbStatusList.filter((k) => k.status === "Pending").length,
      inProgress: kbStatusList.filter((k) => k.status === "In Progress").length,
      completed: kbStatusList.filter((k) => k.status === "Completed").length,
      overdue: kbStatusList.filter((k) => k.status === "Overdue").length,
    }),
    [kbStatusList]
  );

  // Filtering Filters
  const filteredCases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cases;

    return cases.filter(
      (c) =>
        c.ref.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.assignedDepts.some((d) => d.toLowerCase().includes(q))
    );
  }, [cases, searchQuery]);

  const filteredKB = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return kbStatusList;

    return kbStatusList.filter(
      (k) =>
        k.caseRef.toLowerCase().includes(q) ||
        k.caseTitle.toLowerCase().includes(q) ||
        k.dept.toLowerCase().includes(q) ||
        k.staff.toLowerCase().includes(q)
    );
  }, [kbStatusList, searchQuery]);

  // Reset ke muka surat 1 bila carian atau data berubah
  useEffect(() => {
    setCurrentPageTugasan(1);
  }, [filteredCases.length, searchQuery]);

  useEffect(() => {
    setCurrentPageKB(1);
  }, [filteredKB.length, searchQuery]);

  const totalPagesTugasan = Math.max(1, Math.ceil(filteredCases.length / ITEMS_PER_PAGE));
  const pagedCases = filteredCases.slice(
    (currentPageTugasan - 1) * ITEMS_PER_PAGE,
    currentPageTugasan * ITEMS_PER_PAGE
  );

  const totalPagesKB = Math.max(1, Math.ceil(filteredKB.length / ITEMS_PER_PAGE));
  const pagedKB = filteredKB.slice(
    (currentPageKB - 1) * ITEMS_PER_PAGE,
    currentPageKB * ITEMS_PER_PAGE
  );

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  return (
    <>
      <Navbar
        title="Status Kerja"
        breadcrumbItems={["e-Urus PDK", "Ketua Jabatan", "Status Kerja"]}
        userName="Hj. Rashdan bin Ismail"
        userRole="Ketua Jabatan"
      />

      <div className="content">
        <div className="page-header">
          <div>
            <h1 className="page-heading">Status Kerja</h1>
            <p className="page-subheading">
              Pantau kemajuan tugasan di bawah tindakan anda sendiri serta status tindakan terkini semua Ketua Bahagian (KB).
            </p>
          </div>
        </div>

        {/* ─── TABS NAVIGATION ─── */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "18px", borderBottom: "1px solid var(--border)" }}>
          {[
            { key: "tugasan", label: "Tugasan Saya" },
            { key: "kb", label: "Status Ketua Bahagian" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabSwitch(key)}
              style={{
                padding: "9px 18px", fontSize: "13px", fontWeight: 600,
                fontFamily: "'IBM Plex Sans', sans-serif",
                border: "none", background: "none", cursor: "pointer",
                borderBottom: activeTab === key ? "2px solid var(--navy)" : "2px solid transparent",
                color: activeTab === key ? "var(--navy)" : "var(--text-soft)",
                marginBottom: "-1px", transition: "color 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: TUGASAN SAYA ─── */}
        {activeTab === "tugasan" && (
          <>
            <div className="summary-strip" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="summary-card">
                <div className="summary-icon summary-icon-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{statsTugasan.dalamProses}</div>
                  <div className="summary-label">Dalam Proses</div>
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
                  <div className="summary-val">{statsTugasan.menungguSemakan}</div>
                  <div className="summary-label">Menunggu Semakan Akhir</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: "var(--green-border)", background: "var(--green-bg)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{statsTugasan.selesai}</div>
                  <div className="summary-label">Selesai</div>
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
                  <div className="summary-val">{statsTugasan.lewat}</div>
                  <div className="summary-label">Melebihi Tempoh</div>
                </div>
              </div>
            </div>

            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <div className="table-panel-title">Status Kes Diagihkan</div>
                  <div className="table-panel-sub">{loading ? "Memuatkan..." : `Menunjukkan ${filteredCases.length} kes yang memerlukan pemantauan Ketua Jabatan`}</div>
                </div>
                <div className="search-input-wrap search-input-sk-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text" className="search-input"
                    placeholder="Cari no. rujukan, tajuk atau bahagian..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-scroll-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No. Rujukan</th>
                      <th>Kes</th>
                      <th>Bahagian Diagihkan</th>
                      <th>Tarikh Agihan</th>
                      <th>Tempoh Akhir</th>
                      <th>Tahap Semasa</th>
                      <th className="col-action">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "var(--text-soft)", padding: "28px" }}>
                          Tiada rekod ditemui bagi carian &quot;{searchQuery}&quot;.
                        </td>
                      </tr>
                    ) : (
                      pagedCases.map((c) => {
                        const needsReview = c.pipelineStage === "Menunggu Semakan Akhir";
                        const actionLabel = needsReview ? "Semak" : "Butiran";
                        const btnClass = needsReview ? "btn-tindakan" : "btn-secondary";

                        return (
                          <tr key={c.ref}>
                            <td className="td-ref">{c.ref}</td>
                            <td>
                              <div className="td-tajuk">{c.title}</div>
                              <div className="td-tajuk-sub">{c.subtitle}</div>
                            </td>
                            <td>
                              <div className="td-tajuk-sub" style={{ maxWidth: "180px" }}>
                                {c.assignedDepts.join(", ")}
                              </div>
                            </td>
                            <td className="td-date">{c.assignedDate}</td>
                            <td className={`td-tempoh ${c.pipelineStage === "Melebihi Tempoh" ? "tempoh-overdue" : "tempoh-normal"}`}>
                              {c.deadline}
                              {c.pipelineStage === "Melebihi Tempoh" && (
                                <svg className="deadline-warning-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5">
                                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                  <line x1="12" y1="9" x2="12" y2="13" />
                                  <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                              )}
                            </td>
                            <td>
                              <PipelineStageBadge stage={c.pipelineStage} />
                            </td>
                            <td className="col-action">
                              <button type="button" className={btnClass} onClick={() => setActiveCaseRef(c.ref)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                {actionLabel}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPageTugasan}
                totalPages={totalPagesTugasan}
                onPageChange={setCurrentPageTugasan}
              />
            </div>
          </>
        )}

        {/* ─── TAB 2: STATUS KETUA BAHAGIAN ─── */}
        {activeTab === "kb" && (
          <>
            <div className="summary-strip" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: "var(--amber-border)", background: "var(--amber-bg)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{statsKB.pending}</div>
                  <div className="summary-label">Belum Dimulakan</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon summary-icon-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{statsKB.inProgress}</div>
                  <div className="summary-label">Dalam Proses</div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon" style={{ borderColor: "var(--green-border)", background: "var(--green-bg)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="summary-val">{statsKB.completed}</div>
                  <div className="summary-label">Selesai Bahagian</div>
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
                  <div className="summary-val">{statsKB.overdue}</div>
                  <div className="summary-label">Melebihi Tempoh</div>
                </div>
              </div>
            </div>

            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <div className="table-panel-title">Status Kemajuan Setiap Bahagian</div>
                  <div className="table-panel-sub">{loading ? "Memuatkan..." : `Menunjukkan ${filteredKB.length} tugasan aktif di bawah tindakan Ketua Bahagian`}</div>
                </div>
                <div className="search-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text" className="search-input"
                    placeholder="Cari no. rujukan, bahagian, atau pegawai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-scroll-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No. Rujukan</th>
                      <th>Bahagian</th>
                      <th>Ketua Bahagian / Staf</th>
                      <th>Tajuk Kes</th>
                      <th>Kemaskini Akhir</th>
                      <th>Status Semasa</th>
                      <th style={{ textAlign: "right" }}>Butiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKB.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "var(--text-soft)", padding: "28px" }}>
                          Tiada rekod bahagian ditemui bagi carian &quot;{searchQuery}&quot;.
                        </td>
                      </tr>
                    ) : (
                      pagedKB.map((k) => (
                        <tr key={k.id}>
                          <td className="td-ref" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px" }}>{k.caseRef}</td>
                          <td style={{ fontWeight: 600, color: "var(--navy)", fontSize: "12.5px" }}>{k.dept}</td>
                          <td className="td-date">{k.staff}</td>
                          <td>
                            <div className="td-tajuk" style={{ maxWidth: "200px" }}>{k.caseTitle}</div>
                          </td>
                          <td className="td-date">{k.date}</td>
                          <td>
                            <DeptStatusBadge status={k.status} />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button type="button" className="btn-secondary" onClick={() => setActiveKBRow(k)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                              Butiran
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPageKB}
                totalPages={totalPagesKB}
                onPageChange={setCurrentPageKB}
              />
            </div>
          </>
        )}
      </div>

      {/* ─── MODALS ─── */}
      <CaseDetailModal
        caseData={activeCase}
        onClose={() => setActiveCaseRef(null)}
        onApprove={handleApproveFinalReview}
        isSubmitting={isSubmitting}
      />

      {activeKBRow && (
        <ButiranKBModal
          data={activeKBRow}
          onClose={() => setActiveKBRow(null)}
        />
      )}

      {/* ─── TOAST NOTIFICATION SUCCESS (AUTO HIDE) ─── */}
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

      {/* 🔴 TOAST REMINDER MERAH PASTEL PENH (PENDING SEMAKAN AKHIR - KEKAL SEHINGGA DIKLIK ✕) */}
      <div 
        className={`toast${showReminder ? " show" : ""}`} 
        style={{ 
          borderLeft: "4px solid var(--red, #d92d20)",
          background: "#fef3f2" 
        }}
      >
        <div className="toast-icon-wrap" style={{ background: "#fee2e2" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--red, #d92d20)" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="toast-body">
          <div className="toast-title" style={{ color: "var(--red, #d92d20)" }}>Tindakan Diperlukan</div>
          <div className="toast-msg" style={{ color: "#b42318" }}>
            Terdapat <strong>{statsTugasan.menungguSemakan} kes</strong> yang sedang <strong>Menunggu Semakan Akhir Ketua Jabatan</strong>.
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setShowReminder(false)}
          style={{
            background: "none", border: "none", color: "#7a271a",
            cursor: "pointer", fontSize: "14px", padding: "0 4px", marginLeft: "auto",
            fontWeight: "bold"
          }}
        >
          ✕
        </button>
      </div>
    </>
  );
}