import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/common/navbar";
import Pagination from "../../components/common/Pagination";
import "../../styles/pages/PenerimaanLaporan.css";

const ITEMS_PER_PAGE = 6;

// ─── Animation steps untuk simulasi "Konsolidasi AI" (kosmetik sahaja, tak connect ke backend) ───
const STRATEGI_MAPPING = [
  { pct: 15, msg: "Membaca laporan Bahagian Fizikal..." },
  { pct: 35, msg: "Menganalisis data empirikal Bahagian Masyarakat..." },
  { pct: 60, msg: "Memproses parameter keselamatan Bahagian Pentadbiran..." },
  { pct: 80, msg: "Menggabungkan aset multimedia dan tabular..." },
  { pct: 95, msg: "Menyelaraskan struktur format dokumen rasmi..." },
  { pct: 100, msg: "Konsolidasi selesai. Menjana draf Word..." },
];

// ─── Helper: format tarikh ───
const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }) : "-");

const deptClassMap = {
  "Bahagian Fizikal": "dept-fizikal",
  "Bahagian Masyarakat": "dept-masyarakat",
  "Bahagian Pentadbiran": "dept-pentadbiran",
};
const deptSubtitleMap = {
  "Bahagian Fizikal": "Infrastruktur, Kos & Tapak",
  "Bahagian Masyarakat": "Aduan Awam & Impak Komuniti",
  "Bahagian Pentadbiran": "Bencana & Keselamatan",
};
const deptIconMap = {
  "Bahagian Fizikal": (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
  "Bahagian Masyarakat": (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
  "Bahagian Pentadbiran": <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

// ─── Helper: fetch semua assignment, group ikut refNo jadi shape yang UI ni expect ───
function groupIntoCases(rows) {
  const groups = {};
  rows.forEach((r) => {
    if (!groups[r.refNo]) {
      groups[r.refNo] = {
        ref: r.refNo,
        title: r.title,
        subtitle: `${r.location || ""}${r.location && r.category ? " • " : ""}${r.category || ""}`,
        tarikhTerima: formatDate(r.submissionDate),
        tempohAkhir: formatDate(r.deadline),
        overdue: r.deadline ? new Date(r.deadline) < new Date() : false,
        keutamaan: r.priority,
        documentStatus: r.documentStatus,
        depts: [],
      };
    }
    groups[r.refNo].depts.push(r);
  });

  return Object.values(groups)
    .filter((g) => g.documentStatus !== "Selesai")
    .map((g) => ({
      ...g,
      totalDepts: g.depts.length,
      submittedCount: g.depts.filter((d) => d.assignmentStatus === "Dihantar").length,
      reports: g.depts.map((d) => ({
        id: d.deptID,
        deptClass: deptClassMap[d.deptName] || "",
        name: d.deptName,
        subtitle: deptSubtitleMap[d.deptName] || "",
        submitted: d.assignmentStatus === "Dihantar",
        icon: deptIconMap[d.deptName] || null,
        infoRows: [
          ["Pegawai Penyedia", d.officerName || "Belum ditugaskan"],
          ["Tarikh Laporan", d.submittedAt ? formatDate(d.submittedAt) : "—"],
          ["Butiran Laporan", d.reportDetails || "Belum ada laporan disediakan."],
        ],
        attachments: [],
      })),
    }));
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isValidFile(file) {
  return ALLOWED_TYPES.includes(file.type) || file.name.endsWith(".pdf") || file.name.endsWith(".docx");
}

/* ─── Badge keutamaan ─── */
function PriorityBadge({ keutamaan }) {
  if (keutamaan === "Tinggi") {
    return (
      <span style={{
        background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-border)",
        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}>Tinggi</span>
    );
  }
  if (keutamaan === "Sederhana") {
    return (
      <span style={{
        background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-border)",
        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}>Sederhana</span>
    );
  }
  return (
    <span style={{
      background: "var(--surface-2)", color: "var(--text-soft)", border: "1px solid var(--border)",
      fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
      whiteSpace: "nowrap",
    }}>Rendah</span>
  );
}

/* ─── Submission progress pill ─── */
function SubmissionPill({ submitted, total }) {
  const allDone = submitted === total;
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 600,
      color: allDone ? "var(--green)" : "var(--amber)",
      background: allDone ? "var(--green-bg)" : "var(--amber-bg)",
      border: `1px solid ${allDone ? "var(--green-border)" : "var(--amber-border)"}`,
      borderRadius: "var(--radius-sm)", padding: "1px 7px", whiteSpace: "nowrap",
    }}>
      {submitted}/{total} Bahagian
    </span>
  );
}

/* ─── Senarai kes (table view) ─── */
function CaseListView({ cases, onOpenCase }) {
  const tinggiCount    = cases.filter((c) => c.keutamaan === "Tinggi").length;
  const sederhanaCount = cases.filter((c) => c.keutamaan === "Sederhana").length;
  const rendahCount    = cases.filter((c) => c.keutamaan === "Rendah").length;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(cases.length / ITEMS_PER_PAGE));

  // Reset ke muka surat 1 bila senarai kes berubah (contoh: lepas data loading siap atau refresh)
  useEffect(() => {
    setCurrentPage(1);
  }, [cases.length]);

  const pagedCases = cases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-heading">Senarai Kes — Menunggu Koordinasi</div>
          <div className="page-subheading">
            Kes yang memerlukan kompilasi dan semakan laporan daripada sub-jabatan sebelum dikemukakan kepada Ketua Jabatan.
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => window.location.reload()}>
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
            Muat Semula
          </button>
        </div>
      </div>

      {/* Summary cards — count by keutamaan */}
      <div className="summary-strip">
        <div className="summary-card">
          <div className="summary-icon" style={{ borderColor: "var(--red-border)", background: "var(--red-bg)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <div className="summary-val">{tinggiCount}</div>
            <div className="summary-label">Keutamaan Tinggi</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon" style={{ borderColor: "var(--amber-border)", background: "var(--amber-bg)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="summary-val">{sederhanaCount}</div>
            <div className="summary-label">Keutamaan Sederhana</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--navy-mid)" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="summary-val">{rendahCount}</div>
            <div className="summary-label">Keutamaan Rendah</div>
          </div>
        </div>
      </div>

      <div className="table-panel">
        <div className="table-panel-header">
          <div>
            <div className="table-panel-title">Senarai Kes Aktif</div>
            <div className="table-panel-sub">Menunjukkan {cases.length} kes yang menunggu tindakan koordinasi</div>
          </div>
          <div className="search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" className="search-input" placeholder="Cari no. rujukan atau tajuk..." />
          </div>
        </div>

        <table className="data-table" style={{ tableLayout: "auto" }}>
          <colgroup>
            <col style={{ width: "160px" }} />
            <col />
            <col style={{ width: "115px" }} />
            <col style={{ width: "115px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "160px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>No. Rujukan</th>
              <th>Tajuk Aduan</th>
              <th>Tarikh Terima</th>
              <th>Tempoh Akhir</th>
              <th>Keutamaan</th>
              <th>Laporan</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {pagedCases.map((c) => {
              return (
                <tr key={c.ref}>
                  <td className="td-ref">{c.ref}</td>
                  <td>
                    <div className="td-tajuk">{c.title}</div>
                    <div className="td-tajuk-sub">{c.subtitle}</div>
                  </td>
                  <td className="td-date">{c.tarikhTerima}</td>
                  <td className={`td-tempoh ${c.overdue ? "tempoh-overdue" : "tempoh-normal"}`}>
                    {c.tempohAkhir}{c.overdue ? " ▲" : ""}
                  </td>
                  <td><PriorityBadge keutamaan={c.keutamaan} /></td>
                  <td><SubmissionPill submitted={c.submittedCount} total={c.totalDepts} /></td>
                  <td>
                    <button
                      className="btn-tindakan"
                      onClick={() => onOpenCase(c)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Semak &amp; Konsolidasi
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

/* ─── Satu kad bahagian (collapsible) ─── */
function DepartmentCard({ report, isOpen, onToggle }) {
  return (
    <div className="laporan-card">
      <div className="card-header" onClick={onToggle}>
        <div className="card-header-left">
          <div className={`dept-badge ${report.deptClass}`}>
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {report.icon}
            </svg>
          </div>
          <div>
            <div className="card-dept-name">{report.name}</div>
            <div className="card-dept-sub">{report.subtitle}</div>
          </div>
        </div>
        {report.submitted
          ? <span className="status-badge badge-received">Diterima</span>
          : <span className="status-badge badge-pending">Belum Dihantar</span>
        }
        <div className={`chevron-icon${isOpen ? " open" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      <div className={`card-body${isOpen ? " open" : ""}`}>
        <div className="card-body-inner">
          <table className="info-table">
            <tbody>
              {report.infoRows.map(([key, val]) => (
                <tr key={key}><td>{key}</td><td>{val}</td></tr>
              ))}
            </tbody>
          </table>
          {report.attachments.length > 0 && (
            <>
              <div className="attach-label">Lampiran</div>
              {report.attachments.map((file) => (
                <div className="attach-item" key={file.name}>
                  {file.type === "image" ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  {file.name}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Panel kiri: senarai laporan + butang konsolidasi ─── */
function ReportsPanel({ reports, openCards, onToggleCard, isConsolidating, onStartConsolidation, allSubmitted }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-header-left">
          <div className="panel-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <div className="panel-title">Laporan Sub-Jabatan Diterima</div>
            <div className="panel-subtitle">Klik untuk melihat butiran dan lampiran</div>
          </div>
        </div>
        <div className="count-tag">{reports.filter(r => r.submitted).length} / {reports.length}</div>
      </div>
      <div className="panel-body">
        {reports.map((report) => (
          <DepartmentCard
            key={report.id}
            report={report}
            isOpen={!!openCards[report.id]}
            onToggle={() => onToggleCard(report.id)}
          />
        ))}

        {/* Konsolidasi button — kelabu jika belum semua bahagian submit */}
        <button
          className="konsolidasi-btn"
          disabled={isConsolidating || !allSubmitted}
          onClick={onStartConsolidation}
          title={!allSubmitted ? "Semua bahagian mesti menghantar laporan sebelum konsolidasi boleh dijalankan" : undefined}
          style={!allSubmitted ? { opacity: 0.5, cursor: "not-allowed", filter: "grayscale(0.4)" } : undefined}
        >
          <div className={`btn-spinner${isConsolidating ? " show" : ""}`}></div>
          {!isConsolidating && (
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
          <span>
            {isConsolidating
              ? "Sedang Memproses..."
              : !allSubmitted
              ? "Menunggu Laporan Bahagian..."
              : "Konsolidasi Laporan AI"}
          </span>
        </button>

        {!allSubmitted && (
          <div style={{
            fontSize: 11, color: "var(--text-soft)", textAlign: "center",
            marginTop: 6, padding: "0 8px",
          }}>
            Semua 3 bahagian (Fizikal, Masyarakat, Pentadbiran) perlu menghantar laporan sebelum konsolidasi boleh dijalankan.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Panel kanan: 3-langkah stepper ─── */
function StepperPanel({ draftGenerated, draftTimestamp, onDownloadDraft, uploadedFile, onFileSelect, onRemoveFile, isSubmitting, isSubmitted, onSubmit }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const step1Done  = draftGenerated;
  const step2Active = step1Done && !uploadedFile;
  const step2Done  = !!uploadedFile;
  const step3Active = step2Done && !isSubmitted;
  const step3Done  = isSubmitted;

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!isValidFile(file)) { alert("Format tidak disokong. Sila gunakan .docx atau .pdf."); e.target.value = ""; return; }
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!isValidFile(file)) { alert("Format tidak disokong."); return; }
    onFileSelect(file);
  };

  const handleRemoveFile = () => { if (fileInputRef.current) fileInputRef.current.value = ""; onRemoveFile(); };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-header-left">
          <div className="panel-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <div className="panel-title">Semakan &amp; Pemurnian Laporan Lengkap</div>
            <div className="panel-subtitle">Ikuti langkah-langkah berikut untuk menyempurnakan laporan</div>
          </div>
        </div>
      </div>
      <div className="panel-body">
        <div className="process-steps">
          {/* LANGKAH 1 */}
          <div className="step-item">
            <div className="step-number-col">
              <div className={`step-num${step1Done ? " done" : " active"}`}>
                {step1Done ? (<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>) : "1"}
              </div>
            </div>
            <div className="step-content">
              <div className="step-label active-label">LANGKAH 1 — Jana Draf Konsolidasi AI</div>
              {!draftGenerated && (
                <div className="compile-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <p>Klik butang <strong>"Konsolidasi Laporan AI"</strong> di sebelah kiri untuk menjana draf laporan lengkap secara automatik.</p>
                </div>
              )}
              <div className={`file-result-block${draftGenerated ? " show" : ""}`}>
                <div className="file-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="file-info">
                  <div className="file-name">Draf_Laporan_Konsolidasi_AI.docx</div>
                  <div className="file-meta">Dijana pada {draftTimestamp || "—"} &bull; Gambar &amp; Lampiran Berintegrasi</div>
                </div>
                <button className="btn-muat-turun" onClick={onDownloadDraft}>
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Muat Turun Draf Word
                </button>
              </div>
            </div>
          </div>

          {/* LANGKAH 2 */}
          <div className="step-item">
            <div className="step-number-col">
              <div className={`step-num${step2Done ? " done" : step2Active ? " active" : ""}`}>
                {step2Done ? (<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>) : "2"}
              </div>
            </div>
            <div className="step-content">
              <div className={`step-label${step2Active ? " active-label" : ""}`}>LANGKAH 2 — Muat Naik Laporan Akhir Muktamad</div>
              {!uploadedFile && (
                <div className={`upload-zone${dragOver ? " drag-over" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                  <input type="file" ref={fileInputRef} accept=".docx,.pdf" onChange={handleFileInputChange} />
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="upload-heading">Seret &amp; Lepas atau Klik untuk Pilih Fail</div>
                  <div className="upload-sub">Muat naik laporan yang telah disemak dan dimuktamadkan secara tempatan</div>
                  <div className="upload-types">.docx &nbsp;/&nbsp; .pdf &nbsp;&bull;&nbsp; Saiz maksimum: 20 MB</div>
                </div>
              )}
              <div className={`uploaded-file-block${uploadedFile ? " show" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <div className="uploaded-file-name">{uploadedFile ? uploadedFile.name : "—"}</div>
                <button className="btn-remove-file" onClick={handleRemoveFile} title="Buang fail">&#x2715;</button>
              </div>
            </div>
          </div>

          {/* LANGKAH 3 */}
          <div className="step-item">
            <div className="step-number-col">
              <div className={`step-num${step3Done ? " done" : step3Active ? " active" : ""}`}>
                {step3Done ? (<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>) : "3"}
              </div>
            </div>
            <div className="step-content">
              <div className={`step-label${step3Active ? " active-label" : ""}`}>LANGKAH 3 — Sahkan &amp; Kemukakan Laporan</div>
              <button
                className="hantar-btn"
                disabled={!uploadedFile || isSubmitting || isSubmitted}
                onClick={onSubmit}
                style={isSubmitted ? { background: "var(--green)", color: "#fff", borderColor: "var(--green)" } : undefined}
              >
                {isSubmitted ? (
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "#fff" }}><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                )}
                {isSubmitting ? "Menghantar..." : isSubmitted ? "Laporan Telah Dikemukakan" : "Sahkan & Hantar ke Ketua Jabatan"}
              </button>
              <div className="disclaimer-text">
                Butang ini akan diaktifkan selepas fail laporan akhir berjaya dimuat naik. Dengan mengklik butang ini, anda mengesahkan bahawa laporan telah disemak dan diperakukan untuk tindakan Ketua Jabatan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail/workspace view ─── */
function CaseDetailView({ caseItem, onBack, reports, openCards, onToggleCard, isConsolidating, onStartConsolidation, draftGenerated, draftTimestamp, onDownloadDraft, uploadedFile, onFileSelect, onRemoveFile, isSubmitting, isSubmitted, onSubmit, allSubmitted }) {
  return (
    <div>
      <button className="kembali-link" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Kembali ke Senarai Kes
      </button>
      <div className="case-header">
        <div className="case-stripe"></div>
        <div className="case-header-left">
          <div className="case-label">Maklumat Kes Semasa</div>
          <div className="case-title">{caseItem.title}</div>
          <div className="case-desc">
            Semak laporan yang diterima daripada ketiga-tiga bahagian, jalankan konsolidasi automatik menggunakan enjin AI, dan kemukakan laporan lengkap kepada Ketua Jabatan untuk kelulusan.
          </div>
        </div>
        <div className="case-meta-grid">
          <div className="case-meta-item"><div className="meta-key">No. Rujukan</div><div className="meta-val">{caseItem.ref}</div></div>
          <div className="case-meta-item"><div className="meta-key">Tarikh Terima</div><div className="meta-val">{caseItem.tarikhTerima}</div></div>
          <div className="case-meta-item"><div className="meta-key">Tempoh Akhir</div><div className="meta-val">{caseItem.tempohAkhir}</div></div>
        </div>
      </div>
      <div className="workspace">
        <ReportsPanel
          reports={reports}
          openCards={openCards}
          onToggleCard={onToggleCard}
          isConsolidating={isConsolidating}
          onStartConsolidation={onStartConsolidation}
          allSubmitted={allSubmitted}
        />
        <StepperPanel
          draftGenerated={draftGenerated}
          draftTimestamp={draftTimestamp}
          onDownloadDraft={onDownloadDraft}
          uploadedFile={uploadedFile}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

function AiLoadingOverlay({ show, progressPct, progressMsg }) {
  return (
    <div className={`ai-loading${show ? " show" : ""}`}>
      <div className="ai-loader-card">
        <div className="loader-ring"></div>
        <div className="loader-title">Pemprosesan AI Sedang Berjalan</div>
        <div className="loader-msg">Enjin AI sedang menganalisis dan menggabungkan laporan daripada ketiga-tiga bahagian. Sila tunggu sebentar.</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }}></div></div>
        <div className="progress-label">{progressMsg || "Memulakan proses..."}</div>
      </div>
    </div>
  );
}

function Toast({ show, message, onClose }) {
  return (
    <div className={`toast${show ? " show" : ""}`}>
      <div className="toast-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div className="toast-body">
        <div className="toast-title">Laporan Berjaya Dikemukakan</div>
        <div className="toast-msg">{message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>&#x2715;</button>
    </div>
  );
}

const currentPPBUserID = () => JSON.parse(localStorage.getItem("user") || "{}").userID || "U001";

export default function PPBPenerimaanLaporan() {
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [view, setView] = useState("list");
  const [selectedCase, setSelectedCase] = useState(null);

  const loadCases = () => {
    setLoadingCases(true);
    fetch(`http://localhost:5000/api/document-departments`)
      .then((res) => res.json())
      .then((data) => {
        setCases(groupIntoCases(data));
        setLoadingCases(false);
      })
      .catch((err) => {
        console.error("Gagal ambil senarai kes:", err);
        setLoadingCases(false);
      });
  };

  useEffect(() => {
    loadCases();
  }, []);
  const [openCards, setOpenCards] = useState({});
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, msg: "" });
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const stepIndexRef = useRef(0);

  const resetDetailState = () => {
    setOpenCards({}); setIsConsolidating(false); setProgress({ pct: 0, msg: "" });
    setDraftGenerated(false); setDraftTimestamp(""); setUploadedFile(null);
    setIsSubmitting(false); setIsSubmitted(false); stepIndexRef.current = 0;
  };

  const handleOpenCase = (caseItem) => {
    setSelectedCase(caseItem); resetDetailState();
    setView("detail"); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => { setView("list"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleToggleCard = (id) => setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleStartConsolidation = () => {
    setIsConsolidating(true); stepIndexRef.current = 0;
    const advance = () => {
      const idx = stepIndexRef.current;
      if (idx >= STRATEGI_MAPPING.length) { setTimeout(() => { setIsConsolidating(false); finishGeneratingDraft(); }, 400); return; }
      setProgress({ pct: STRATEGI_MAPPING[idx].pct, msg: STRATEGI_MAPPING[idx].msg });
      stepIndexRef.current += 1; setTimeout(advance, 600);
    };
    advance();
  };

  const finishGeneratingDraft = () => {
    const ts = new Date().toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setDraftTimestamp(ts); setDraftGenerated(true);
  };

  const handleDownloadDraft = () => {
    const link = document.createElement("a"); link.href = "data:application/octet-stream,";
    link.download = "Draf_Laporan_Konsolidasi_AI.docx"; link.click();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/compile-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refNo: selectedCase.ref,
          finalizedBy: currentPPBUserID(),
          finalSummary: `Laporan daripada semua bahagian telah disahkan dan diselaraskan bagi kes ${selectedCase.ref}.`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setIsSubmitting(false);
        setToast({ show: true, message: `Gagal kemukakan laporan: ${err.message || "ralat tidak diketahui"}` });
        setTimeout(() => setToast((t) => ({ ...t, show: false })), 6000);
        return;
      }

      setIsSubmitting(false); setIsSubmitted(true);
      setToast({ show: true, message: `Laporan lengkap ${selectedCase?.ref ?? ""} telah dikemukakan kepada Ketua Jabatan untuk semakan dan kelulusan.` });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 6000);
      loadCases(); // refresh senarai — case ni akan hilang dari list sebab status dah 'Selesai'
    } catch (err) {
      console.error("Ralat sambungan:", err);
      setIsSubmitting(false);
      setToast({ show: true, message: "Tidak dapat menghubungi pelayan" });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 6000);
    }
  };

  // Per-case reports and submission state
  const caseReports = selectedCase ? selectedCase.reports : [];
  const allSubmitted = selectedCase
    ? selectedCase.submittedCount === selectedCase.totalDepts
    : false;

  return (
    <>
      <Navbar
        title="Penerimaan Laporan"
        breadcrumbItems={["e-Urus PDK", "Subsistem 3", "Penerimaan Laporan"]}
        statusText={loadingCases ? "Memuatkan..." : `${cases.length} Kes Menunggu Tindakan`}
        userName="Zulkifli Hasan"
        userRole="Pegawai Penyelaras Bahagian"
      />
      <div className="content">
        {view === "list" ? (
          <CaseListView cases={cases} onOpenCase={handleOpenCase} />
        ) : (
          <CaseDetailView
            caseItem={selectedCase}
            onBack={handleBackToList}
            reports={caseReports}
            openCards={openCards}
            onToggleCard={handleToggleCard}
            isConsolidating={isConsolidating}
            onStartConsolidation={handleStartConsolidation}
            draftGenerated={draftGenerated}
            draftTimestamp={draftTimestamp}
            onDownloadDraft={handleDownloadDraft}
            uploadedFile={uploadedFile}
            onFileSelect={setUploadedFile}
            onRemoveFile={() => setUploadedFile(null)}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            onSubmit={handleSubmit}
            allSubmitted={allSubmitted}
          />
        )}
      </div>
      <AiLoadingOverlay show={isConsolidating} progressPct={progress.pct} progressMsg={progress.msg} />
      <Toast show={toast.show} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </>
  );
}

