import { useState, useRef } from "react";
import Navbar from "../../components/common/navbar";
import { PTSubmissionList } from "../../data/PTSubmissionList";
import "../../styles/pages/PTPendaftaranFail.css"; 

/* ─── System Overlay Modal ─── */
function SystemModal({ show, isSuccess, title, desc }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {!isSuccess ? (
          <div className="spinner"></div>
        ) : (
          <div className="modal-icon-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        <h3>{title}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Toast Alert ─── */
function ToastAlert({ toast }) {
  return (
    <div className={`toast ${toast.type === "error" ? "toast-error" : ""} ${toast.show ? "show" : ""}`}>
      <div className="toast-icon-wrap">
        {toast.type === "error" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-msg">{toast.message}</div>
      </div>
    </div>
  );
}

/* ─── UC105: Record Detail Modal (Search & Retrieve Case Records) ─── */
function RecordDetailModal({ record, onClose }) {
  if (!record) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ textAlign: "left" }}>
        <h3>{record.title}</h3>
        <p><strong>No. Rujukan:</strong> {record.ref}</p>
        <p><strong>Tarikh Muat Naik:</strong> {record.date}</p>
        <p><strong>Tempoh Akhir:</strong> {record.dueDate}</p>
        <p><strong>Status:</strong> {record.status}</p>
        <div style={{ marginTop: "16px" }}>
          {/* Replace with actual stored file URL when backend is integrated */}
          <a
            href={record.fileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Lihat Dokumen PDF
          </a>
        </div>
        <button className="btn-primary" style={{ marginTop: "16px" }} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function PTPendaftaranFail() {
  const [view, setView] = useState("list");
  // Tukar status lalai "Direkodkan"/"Disemak" kepada "Dalam Tindakan"
  const [submissions, setSubmissions] = useState(() =>
    PTSubmissionList.map(item => ({
      ...item,
      status: item.status === "Direkodkan" || item.status === "Disemak" ? "Dalam Tindakan" : item.status
    }))
  );

  // Form States
  const [formData, setFormData] = useState({ title: "", notes: "", dueDate: "" });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Status & UI States
  const [modalState, setModalState] = useState({ show: false, isSuccess: false, title: "", desc: "" });
  const [toastState, setToastState] = useState({ show: false, title: "", message: "", type: "success" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState(false);

  // --- UC105: Search & Retrieve Case Records States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // --- Utility Functions ---
  const showToast = (title, message, type = "success") => {
    setToastState({ show: true, title, message, type });
    setTimeout(() => setToastState(prev => ({ ...prev, show: false })), 4000);
  };

  const showModal = (title, desc, isSuccess = false) => {
    setModalState({ show: true, isSuccess, title, desc });
  };

  const hideModal = () => setModalState(prev => ({ ...prev, show: false }));

  // --- View Switchers ---
  const handleOpenForm = () => {
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setView("list");
    setFormData({ title: "", notes: "" });
    setFile(null);
    setIsSubmitting(false);
    setIsSuccessSubmit(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- File Upload Handlers (UC102) ---
  const isValidExtension = (filename) => {
    const name = filename.toLowerCase();
    return name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
  };

  const processFile = (uploadedFile) => {
    if (!uploadedFile) return;
    if (!isValidExtension(uploadedFile.name)) {
      showToast("Ralat Format", "Hanya format PDF, DOC dan DOCX disokong oleh sistem.", "error");
      return;
    }

    showModal("Mengesahkan Dokumen...", "Sistem sedang mengimbas fail dokumen anda.");

    // Simulate API Verification (1.5s)
    setTimeout(() => {
      hideModal();
      setFile(uploadedFile);
      showToast("Pengesahan Selesai", "Dokumen disahkan tulen dan sedia untuk dimuat naik.", "success");
    }, 1500);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleFileInputChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Form Submission (UC102 & UC103) ---
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !file) {
      showToast("Borang Tidak Lengkap", "Sila lengkapkan maklumat wajib (*) dan muat naik fail dokumen.", "error");
      return;
    }

    setIsSubmitting(true);
    showModal("Menjana Nombor Rujukan...", "Mendaftarkan dokumen dengan selamat ke dalam Pangkalan Data Utama...");

    // Simulate Registration & Reference Generation (2.0s)
    setTimeout(() => {
      const rawak = Math.floor(1000 + Math.random() * 9000);
      const siriRujukan = `PDK/KLG/2026/${rawak}`;
      const today = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });

      showModal("Berjaya!", `Dokumen berjaya didaftarkan. \nNo. Rujukan: ${siriRujukan}`, true);

      setTimeout(() => {
        hideModal();
        setIsSubmitting(false);
        setIsSuccessSubmit(true);

        const newRecord = {
          ref: siriRujukan,
          title: formData.title.trim(),
          dueDate: formData.dueDate,
          date: today,
          status: "Dalam Tindakan",
          fileUrl: null 
        };

        setSubmissions(prev => [newRecord, ...prev]);
        showToast("Penyerahan Berjaya", `Dokumen berjaya dikemukakan. No. Rujukan: ${siriRujukan}`, "success");
        handleBackToList();
      }, 2500);
    }, 2000);
  };

  // --- UC105: Search & Retrieve Case Records ---
  // Normal Flow 2-3: user enters reference number / criteria -> system queries centralized data
  const filteredSubmissions = submissions.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.ref.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query)
    );
  });

  // Normal Flow 4: system displays case details and allows viewing the PDF document
  const handleViewRecord = (item) => {
    setSelectedRecord(item);
  };

  const handleCloseRecordView = () => {
    setSelectedRecord(null);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <Navbar
        title="Pendaftaran Fail"
        breadcrumbItems={["e-Urus PDK", "Subsistem 1", "Pendaftaran Fail"]}
        userName="Pn. Aisyah Binti Ahmad"
        userRole="Pembantu Tadbir"
      />

      <div className="content">
        {view === "list" ? (
          <section id="viewSenarai">
            <div className="page-header">
              <div className="page-header-text">
                <h1 className="page-heading">Senarai Rekod Penyerahan</h1>
                <p className="page-subheading">Akses dokumen yang telah dimuat naik dan dijana nombor rujukan.</p>
              </div>
              <button className="btn-primary" onClick={handleOpenForm}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Daftar &amp; Muat Naik Fail
              </button>
            </div>

            <div className="table-panel">
              <div className="table-panel-header">
                <div>
                  <div className="table-panel-title">Pengurusan Rekod Berpusat</div>
                  <div className="table-panel-sub">Semua data disegerak masa nyata dengan Pangkalan Data</div>
                </div>
                {/* UC105 Normal Flow 1-2: record search interface, user enters reference number/criteria */}
                <div className="search-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari No. Rujukan / Tajuk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. Rujukan</th>
                    <th>Maklumat Dokumen</th>
                    <th>Tarikh Muat Naik</th>
                    <th>Tempoh Akhir</th>
                    <th>Status</th>
                    <th>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    // UC105 Alternative Flow A1: No Record Found
                    <tr>
                      <td colSpan={6} className="td-empty" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted, #888)" }}>
                        Tiada rekod ditemui bagi "{searchQuery}". Sila semak semula nombor rujukan atau kriteria carian anda.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((item) => (
                      <tr key={item.ref}>
                        <td className="td-ref">{item.ref}</td>
                        <td>
                          <div className="td-tajuk">{item.title}</div>
                        </td>
                        <td className="td-date">{item.date}</td>
                        <td className="td-date">{item.dueDate}</td>
                        <td>
                          <span className={`status-badge ${item.status === 'Dalam Tindakan' ? 'badge-warning' : 'badge-success'}`}>
                            <div className="badge-dot"></div>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {/* UC105 Normal Flow 4: display case details / allow viewing PDF */}
                          <button className="btn-outline" onClick={() => handleViewRecord(item)}>
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section id="viewDetail">
            <button className="kembali-link" onClick={handleBackToList}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Kembali ke Senarai
            </button>

            <div className="page-header" style={{ marginTop: "16px" }}>
              <div className="page-header-text">
                <span className="page-label">Modul Penyerahan</span>
                <h1 className="page-heading">Borang Penyerahan Dokumen Digital</h1>
                <p className="page-subheading">Lengkapkan metadata di bawah dan muat naik fail dokumen anda (Format PDF atau Word sahaja). Nombor rujukan unik akan dijana secara automatik.</p>
              </div>
            </div>

            <div className="grid-layout">
              {/* Metadata Form */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-left">
                    <div className="panel-icon-wrap" style={{ border: "none" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <div className="panel-title">Maklumat Metadata</div>
                      <div className="panel-subtitle">Maklumat asas bagi rujukan silang jabatan</div>
                    </div>
                  </div>
                </div>
                <div className="panel-body">
                  <form onSubmit={handleSubmitForm}>
                    <div className="form-group">
                      <label htmlFor="docTitle">Tajuk Dokumen / Aduan <span className="required">*</span></label>
                      <input
                        type="text"
                        id="docTitle"
                        className="form-control"
                        placeholder="Cth: Laporan Kerosakan Jalan Raya Kluang"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dueDate">Tempoh Akhir <span className="required">*</span></label>
                      <input
                        type="date"
                        id="dueDate"
                        className="form-control"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        disabled={isSubmitting}
                        min={minDate}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="docNotes">Catatan Tambahan</label>
                      <textarea
                        id="docNotes"
                        className="form-control"
                        rows="4"
                        placeholder="Sila masukkan maklumat ringkas atau nota rujukan..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-header-left">
                    <div className="panel-icon-wrap" style={{ border: "none" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <div className="panel-title">Muat Naik Fail</div>
                      <div className="panel-subtitle">Serahan berkas fail selamat</div>
                    </div>
                  </div>
                </div>
                <div className="panel-body">

                  {!file && (
                    <div
                      className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                    >
                      <input type="file" accept=".pdf,.doc,.docx" ref={fileInputRef} onChange={handleFileInputChange} />
                      <div className="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                        </svg>
                      </div>
                      <div className="upload-heading">Seret &amp; lepas dokumen di sini</div>
                      <div className="upload-sub">atau klik untuk melayari fail sistem</div>
                      <div className="upload-types">Format disokong: PDF, DOC, DOCX (Max: 10MB)</div>
                    </div>
                  )}

                  {file && (
                    <div className="uploaded-file-block">
                      <div className="file-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                        </svg>
                      </div>
                      <div className="file-info" style={{ flexGrow: 1, overflow: 'hidden' }}>
                        <div className="file-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                        <div className="file-size" style={{ fontSize: '10.5px', color: 'var(--green)', marginTop: '1px' }}>Dokumen Disahkan Sedia Dihantar</div>
                      </div>
                      <button className="btn-remove-file" onClick={handleRemoveFile} title="Buang Fail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', stroke: 'currentColor' }}>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="submit-action-area">
                    <button
                      className="btn-submit"
                      onClick={handleSubmitForm}
                      disabled={isSubmitting || isSuccessSubmit || !file}
                      style={isSuccessSubmit ? { background: 'var(--green)' } : {}}
                    >
                      {isSuccessSubmit ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Berjaya Direkodkan
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                          </svg>
                          {isSubmitting ? "Merekod ke Repositori..." : "Hantar Dokumen Sistem"}
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <SystemModal
        show={modalState.show}
        isSuccess={modalState.isSuccess}
        title={modalState.title}
        desc={modalState.desc}
      />

      {/* UC105: Search & Retrieve Case Records - detail/PDF view modal */}
      <RecordDetailModal record={selectedRecord} onClose={handleCloseRecordView} />

      <ToastAlert toast={toastState} />
    </>
  );
}