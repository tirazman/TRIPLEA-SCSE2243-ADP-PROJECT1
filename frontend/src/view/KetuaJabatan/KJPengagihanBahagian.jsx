import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/common/navbar";
import { initialDocuments, janaRingkasanLokal } from "../../data/pengagihanBahagianData";
import "../../styles/pages/PenerimaanLaporan.css";
import "../../styles/pages/PengagihanTugasan.css";
import "../../styles/pages/PengagihanBahagian.css";

const ACTION_LABEL = "Semak";

const STATUS_MAP = {
  menunggu: { label: "Menunggu Tindakan", badge: "badge-pending" },
  diproses: { label: "Sedang Diproses", badge: "badge-processing" },
  selesai: { label: "Selesai", badge: "badge-received" },
};

const FILTER_OPTIONS = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "diproses", label: "Sedang Diproses" },
  { key: "selesai", label: "Selesai" },
];

const AI_STEPS = [
  "AI sedang membaca dokumen...",
  "Mengenal pasti isu utama...",
  "Mencadangkan bahagian yang sesuai...",
  "Menyediakan ringkasan akhir...",
];

function formatToday() {
  const today = new Date();
  const bulan = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];
  return `${today.getDate()} ${bulan[today.getMonth()]} ${today.getFullYear()}`;
}

/** Belum diagih = status menunggu sahaja */
function canAssign(doc) {
  return doc.status === "menunggu";
}

function SubmissionInfo({ doc }) {
  return (
    <div className="case-ref-card">
      <div className="case-ref-label">Penyerahan daripada Pembantu Tadbir</div>

      <div className="kj-submission-grid">
        <div className="kj-field kj-field--full">
          <div className="meta-key">Tajuk Dokumen</div>
          <div className="kj-field-val">{doc.title}</div>
        </div>

        <div className="kj-field kj-field--full">
          <div className="meta-key">Catatan Tambahan</div>
          <div className="kj-field-val">{doc.catatan}</div>
        </div>

        <div className="kj-field">
          <div className="meta-key">Tarikh Terima</div>
          <div className="kj-field-val kj-mono">{doc.tarikh}</div>
        </div>

        <div className="kj-field">
          <div className="meta-key">Tempoh Akhir</div>
          <div className="kj-field-val kj-mono">{doc.akhir}</div>
        </div>
      </div>

      <div className="attach-label">Fail Dimuat Naik</div>
      <div className="kj-file-card">
        <div className="kj-file-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="kj-file-info">
          <div className="kj-file-name">{doc.file.name}</div>
          <div className="kj-file-meta">
            {doc.file.size} • {doc.file.type.toUpperCase()}
          </div>
        </div>
        <button type="button" className="btn-outline kj-file-view">
          Lihat Fail
        </button>
      </div>
    </div>
  );
}

function AssignmentHistory({ assignedTo }) {
  if (!assignedTo.length) return null;

  return (
    <div className="kj-history-box">
      <div className="kj-history-title">Sejarah Pengagihan</div>
      {assignedTo.map((entry, i) => {
        const isLatest = i === assignedTo.length - 1;
        return (
          <div key={`${entry.tarikh}-${i}`} className={`kj-history-entry${isLatest ? " latest" : ""}`}>
            <div className="kj-history-meta">
              <span className="kj-history-num">Pengagihan #{i + 1}</span>
              <span className="kj-history-date">{entry.tarikh}</span>
              {isLatest && <span className="kj-history-badge">Terkini</span>}
            </div>
            <div className="kj-history-tags">
              {entry.jabatan.map((j) => (
                <span key={j} className="kj-history-tag">
                  {j}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function KJPengagihanBahagian() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [assignNote, setAssignNote] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(AI_STEPS[0]);
  const [aiResult, setAiResult] = useState(null);
  const [hasSummarized, setHasSummarized] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const stepTimerRef = useRef(null);
  const summarizeTimerRef = useRef(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) ?? null;
  const isReadOnly = selectedDoc ? !canAssign(selectedDoc) : false;

  const stats = useMemo(
    () => ({
      menunggu: documents.filter((d) => d.status === "menunggu").length,
      diproses: documents.filter((d) => d.status === "diproses").length,
      selesai: documents.filter((d) => d.status === "selesai").length,
    }),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((doc) => {
      if (filter !== "semua" && doc.status !== filter) return false;
      if (q && !doc.id.toLowerCase().includes(q) && !doc.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [documents, search, filter]);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      if (summarizeTimerRef.current) clearTimeout(summarizeTimerRef.current);
    };
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  const openPanel = (doc) => {
    setSelectedDocId(doc.id);
    setSelectedDepts([]);
    setAssignNote("");
    setAiResult(null);
    setHasSummarized(false);
    setAiLoading(false);
    setLoadingText(AI_STEPS[0]);
  };

  const closePanel = () => {
    setSelectedDocId(null);
    setSelectedDepts([]);
    setAssignNote("");
    setAiResult(null);
    setHasSummarized(false);
    setAiLoading(false);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (summarizeTimerRef.current) clearTimeout(summarizeTimerRef.current);
  };

  const handleSummarize = () => {
    if (!selectedDoc || aiLoading || isReadOnly) return;

    setAiLoading(true);
    setAiResult(null);
    setHasSummarized(false);
    setSelectedDepts([]);
    setLoadingText(AI_STEPS[0]);

    let stepIndex = 0;
    stepTimerRef.current = setInterval(() => {
      if (stepIndex < AI_STEPS.length - 1) {
        stepIndex += 1;
        setLoadingText(AI_STEPS[stepIndex]);
      }
    }, 700);

    summarizeTimerRef.current = setTimeout(() => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      const parsed = janaRingkasanLokal(selectedDoc);
      setAiResult(parsed);
      setHasSummarized(true);
      setAiLoading(false);
    }, 2800);
  };

  const toggleDept = (name) => {
    setSelectedDepts((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  const removeDept = (name) => {
    setSelectedDepts((prev) => prev.filter((d) => d !== name));
  };

  const confirmAssign = () => {
    if (!selectedDoc || selectedDepts.length === 0 || isReadOnly) return;

    const jumlahJabatan = selectedDepts.length;

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === selectedDoc.id
          ? {
              ...d,
              status: "diproses",
              assignedTo: [
                ...d.assignedTo,
                { tarikh: formatToday(), jabatan: [...selectedDepts] },
              ],
            }
          : d
      )
    );

    setShowConfirm(false);
    closePanel();
    showToastMsg(`Dokumen ${selectedDoc.id} berjaya diagihkan kepada ${jumlahJabatan} bahagian.`);
  };

  return (
    <>
      <Navbar
        title="Pengagihan kepada Bahagian"
        breadcrumbItems={["e-Urus PDK", "Ketua Jabatan", "Pengagihan kepada Bahagian"]}
        userName="Hj. Rashdan bin Ismail"
        userRole="Ketua Jabatan"
      />

      <div className="content">
        <div className="page-header">
          <div className="page-header-text">
            <div className="page-heading">Pengagihan kepada Bahagian</div>
            <div className="page-subheading">
              Senarai dokumen yang menunggu semakan, ringkasan AI, dan pengagihan kepada bahagian.
            </div>
          </div>
        </div>

        <div className="summary-strip">
          <div className="summary-card">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b54708" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{stats.menunggu}</div>
              <div className="summary-label">Menunggu Tugasan</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{stats.diproses}</div>
              <div className="summary-label">Sedang Diproses</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#027a48" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="summary-val">{stats.selesai}</div>
              <div className="summary-label">Diselesaikan (Jun 2025)</div>
            </div>
          </div>
        </div>

        <div className="kj-toolbar">
          <div className="search-input-wrap kj-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input kj-search-input"
              placeholder="Cari no. rujukan atau tajuk dokumen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`btn-secondary kj-filter-btn${filter === key ? " active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <div className="table-panel-title">Senarai Dokumen</div>
              <div className="table-panel-sub">
                {search
                  ? `${filteredDocs.length} hasil carian`
                  : `Menunjukkan ${filteredDocs.length} dokumen`}
              </div>
            </div>
          </div>

          <div className="table-scroll-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "140px" }}>No. Rujukan</th>
                  <th>Tajuk Aduan</th>
                  <th style={{ width: "100px" }}>Tarikh Terima</th>
                  <th style={{ width: "100px" }}>Tempoh Akhir</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="td-empty">
                      Tiada dokumen dijumpai.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const statusInfo = STATUS_MAP[doc.status];
                    const isSelected = selectedDocId === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        className={isSelected ? "kj-row-selected" : ""}
                        onClick={() => openPanel(doc)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="td-ref">{doc.id}</td>
                        <td>
                          <div className="td-tajuk">{doc.title}</div>
                          <div className="td-tajuk-sub">
                            {doc.loc} • {doc.cat}
                          </div>
                        </td>
                        <td className="td-date">{doc.tarikh}</td>
                        <td className="td-tempoh tempoh-normal">{doc.akhir}</td>
                        <td>
                          <span className={`status-badge ${statusInfo.badge}`}>
                            <span className="badge-dot" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="btn-outline kj-btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPanel(doc);
                            }}
                          >
                            {ACTION_LABEL}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side drawer */}
      <div
        className={`kj-drawer-overlay${selectedDoc ? " show" : ""}`}
        onClick={closePanel}
      >
        <div className="kj-drawer" onClick={(e) => e.stopPropagation()}>
          {selectedDoc && (
            <>
              <div className="kj-drawer-header">
                <div>
                  <div className="kj-drawer-title">{selectedDoc.title}</div>
                  <div className="kj-drawer-ref">{selectedDoc.id}</div>
                  {isReadOnly && (
                    <p className="kj-readonly-note">
                      Dokumen ini telah diagihkan. Paparan maklumat sahaja.
                    </p>
                  )}
                </div>
                <button type="button" className="kb-modal-close-btn" onClick={closePanel}>
                  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="kj-drawer-body">
                <SubmissionInfo doc={selectedDoc} />
                <AssignmentHistory assignedTo={selectedDoc.assignedTo} />

                {/* AI + Agih — hanya untuk belum diagih (menunggu) */}
                {!isReadOnly && (
                  <>
                    <div className="instruction-card">
                      <div className="instruction-icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3" />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="instruction-label">Ringkasan & Cadangan Bahagian</div>
                        <div className="instruction-text" style={{ marginBottom: 12 }}>
                          Analisis automatik fail yang dimuat naik oleh Pembantu Tadbir
                        </div>
                        <button
                          type="button"
                          className="hantar-btn"
                          style={{ width: "auto", padding: "8px 14px", fontSize: "12.5px" }}
                          onClick={handleSummarize}
                          disabled={aiLoading}
                        >
                          {aiLoading ? "Menganalisis..." : hasSummarized ? "Jana Semula" : "Jana Ringkasan"}
                        </button>
                      </div>
                    </div>

                    {aiLoading && (
                      <div className="kj-ai-loading">
                        <div className="loader-ring" />
                        <span>{loadingText}</span>
                      </div>
                    )}

                    {!aiLoading && !hasSummarized && (
                      <div className="kj-ai-placeholder">
                        Klik &quot;Jana Ringkasan&quot; untuk analisis AI pada fail dokumen ini.
                      </div>
                    )}

                    {!aiLoading && hasSummarized && aiResult && (
                      <div className="kj-ai-result">
                        <div className="kj-summary-text">{aiResult.ringkasan}</div>
                        <div className="kj-dept-label">Cadangan Bahagian Yang Sesuai</div>
                        <div className="kj-dept-hint">Boleh pilih lebih daripada satu bahagian</div>
                        <div className="kj-dept-cards">
                          {aiResult.cadangan_bahagian.map((dept) => (
                            <button
                              key={dept.nama_bahagian}
                              type="button"
                              className={`kj-dept-card${selectedDepts.includes(dept.nama_bahagian) ? " chosen" : ""}`}
                              onClick={() => toggleDept(dept.nama_bahagian)}
                            >
                              <div className="kj-dept-name">{dept.nama_bahagian}</div>
                              <div className="kj-dept-reason">{dept.sebab}</div>
                              <div className="kj-conf-bar-wrap">
                                <div className="kj-conf-bar" style={{ width: `${dept.keyakinan}%` }} />
                              </div>
                              <div className="kj-conf-label">Keyakinan: {dept.keyakinan}%</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="kj-assign-section">
                      <div className="panel-title" style={{ marginBottom: 10 }}>
                        Agih ke Bahagian
                      </div>

                      <div className="kj-selected-depts">
                        {selectedDepts.length === 0 ? (
                          <span className="kj-ai-placeholder" style={{ padding: 0 }}>
                            Pilih sekurang-kurangnya satu bahagian daripada cadangan AI di atas.
                          </span>
                        ) : (
                          selectedDepts.map((name) => (
                            <span key={name} className="kj-sel-tag">
                              {name}
                              <button type="button" onClick={() => removeDept(name)}>
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <textarea
                        className="form-textarea"
                        placeholder="Nota tambahan kepada bahagian (pilihan)..."
                        value={assignNote}
                        onChange={(e) => setAssignNote(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn-primary-submit"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={selectedDepts.length === 0}
                        onClick={() => setShowConfirm(true)}
                      >
                        Agih ke Bahagian
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      <div
        className={`kb-modal-overlay${showConfirm ? " show" : ""}`}
        onClick={() => setShowConfirm(false)}
      >
        <div className="kb-modal-box" style={{ width: "480px" }} onClick={(e) => e.stopPropagation()}>
          <div className="kb-modal-header">
            <div>
              <div className="kb-modal-title">Sahkan Pengagihan</div>
              <div className="kb-modal-subtitle">
                Dokumen <strong>{selectedDoc?.id}</strong> akan diagihkan kepada bahagian berikut
                {assignNote.trim() ? ` dengan nota: "${assignNote.trim()}"` : ""}.
              </div>
            </div>
            <button type="button" className="kb-modal-close-btn" onClick={() => setShowConfirm(false)}>
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="kb-modal-body">
            <div className="kj-modal-dept-list">
              {selectedDepts.map((name) => (
                <span key={name} className="kj-sel-tag">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="kb-modal-footer">
            <div className="kb-modal-footer-right">
              <button type="button" className="btn-secondary" onClick={() => setShowConfirm(false)}>
                Batal
              </button>
              <button type="button" className="btn-primary-submit" onClick={confirmAssign}>
                Ya, Agihkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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