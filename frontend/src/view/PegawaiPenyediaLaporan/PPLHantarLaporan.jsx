import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import { assignedTasks } from "../../data/pplData";
import "../../styles/pages/PPLTugasanDetail.css";

// --- UTILITY FUNCTIONS ---
const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

const isValidFormat = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  return ["pdf", "docx", "doc", "jpg", "jpeg", "png"].includes(ext);
};

const detectType = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png"].includes(ext) ? "img" : "doc";
};

const isValidSize = (size) => size <= 20 * 1024 * 1024; // 20 MB

// --- TOAST COMPONENT ---
const Toast = ({ show, title, msg, onClose }) => (
  <div className={`toast ${show ? "show" : ""}`}>
    <div className="toast-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <div className="toast-body">
      <div className="toast-title">{title}</div>
      <div className="toast-msg">{msg}</div>
    </div>
    <button className="toast-close" onClick={onClose}>&#x2715;</button>
  </div>
);
export default function PPLHantarLaporan() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  // Upload States
    const [fileQueue, setFileQueue] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, title: "", msg: "" });
  
    const fileInputRef = useRef(null);
  
    // Auto-hide toast
    useEffect(() => {
      if (toast.show) {
        const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5500);
        return () => clearTimeout(timer);
      }
    }, [toast]);
  
    const showToast = (title, msg) => {
      setToast({ show: true, title, msg });
    };
  const task = assignedTasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <>
        <Navbar title="Hantar Laporan" breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Hantar Laporan"]} />
        <div className="content">
          <p>Tugasan tidak dijumpai.</p>
          <Link to="/pegawai-penyedia/arahan" className="kembali-link">Kembali ke Senarai Tugasan</Link>
        </div>
      </>
    );
  }

  
    // --- FILE HANDLERS ---
    const addFiles = (files) => {
      const newFiles = Array.from(files).map((f) => ({
        id: "fq_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: f.name,
        size: f.size,
        type: detectType(f.name),
        valid: isValidFormat(f.name) && isValidSize(f.size),
        file: f,
      }));
      setFileQueue((prev) => [...prev, ...newFiles]);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    };
  
    const handleFileChange = (e) => {
      if (e.target.files.length) addFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = null; // Reset input
    };
  
    const removeFile = (id) => {
      setFileQueue(fileQueue.filter((f) => f.id !== id));
    };
  
    // Derived file states
    const validCount = fileQueue.filter((f) => f.valid).length;
    const docCount = fileQueue.filter((f) => f.type === "doc").length;
    const imgCount = fileQueue.filter((f) => f.type === "img").length;
    const allValid = fileQueue.length > 0 && validCount === fileQueue.length;
  
    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        showToast(
          "Laporan Lengkap Berjaya Dihantar",
          "Laporan dan bukti telah diserahkan kepada pentadbiran sistem e-Urus PDK. Notifikasi telah dihantar secara automatik."
        );
        // Automatically return to Senarai after 2 seconds
        setTimeout(() => {
          setFileQueue([]); // clear queue
          navigate("/pegawai-penyedia/arahan");
        }, 2000);
      }, 1800);
    };
  
    // --- VALIDATION RENDERER ---
    const renderValidationAlerts = () => {
      if (fileQueue.length === 0) {
        return (
          <div style={{ padding: "8px 12px", fontSize: "11.5px", color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
            Pengesahan akan dipaparkan secara automatik setelah fail dimuat naik.
          </div>
        );
      }
  
      let alerts = [];
      if (validCount === fileQueue.length) {
        alerts.push({
          type: "ok",
          label: "Semua Fail Sah",
          msg: `${docCount} laporan dan ${imgCount} gambar berjaya disahkan. Sila teruskan menghantar.`,
          icon: <polyline points="20 6 9 17 4 12" />
        });
      } else {
        alerts.push({
          type: "warn",
          label: "Terdapat Fail Bermasalah",
          msg: `${fileQueue.length - validCount} fail gagal pengesahan. Sila semak ralat di bawah sebelum menghantar.`,
          icon: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>
        });
      }
  
      fileQueue.forEach((f) => {
        const ext = f.name.split(".").pop().toUpperCase();
        if (!f.valid) {
          if (!isValidFormat(f.name)) {
            alerts.push({
              type: "err",
              label: "Format Tidak Disokong",
              msg: `"${f.name}" — Format .${ext} tidak dibenarkan untuk jenis fail ini.`,
              icon: <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
            });
          }
          if (!isValidSize(f.size)) {
            alerts.push({
              type: "err",
              label: "Saiz Fail Melebihi Had",
              msg: `"${f.name}" — Saiz fail melebihi 20 MB. Sila mampatkan fail dan cuba semula.`,
              icon: <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
            });
          }
        }
      });
  
      return alerts.map((a, idx) => (
        <div key={idx} className={`validation-alert validation-${a.type}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px", flexShrink: 0 }}>{a.icon}</svg>
          <div>
            <div className="va-label">{a.label}</div>
            <div className="va-text">{a.msg}</div>
          </div>
        </div>
      ));
    };
    
  return (
    <>
      <Navbar
        title="Hantar Laporan"
        breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Hantar Laporan"]}
        userName="Amirul Haziq Abdullah"
        userRole="Pegawai Penyedia Laporan"
      />

      <div className="content">
        <Link to="/pegawai-penyedia/arahan" className="kembali-link">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali ke Senarai Tugasan
        </Link>

        <div className="stepper-track">
          <div className="stepper-step">
            <div className="stepper-circle done">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="stepper-label done">Butiran Kes</span>
          </div>
          <div className="stepper-line done"></div>
          <div className="stepper-step">
            <div className="stepper-circle active">2</div>
            <span className="stepper-label active">Muat Naik Laporan</span>
          </div>
        </div>

        {/* Stepper */}
            <div className="upload-stats-bar">
              {/*Card 1: Case Ref */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e4d8c" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <div className="upload-stat-num">{task.caseRef}</div>
                <div className="upload-stat-label">No. Rujukan Kes</div>
              </div>
            </div>
            {/*Card 2: File Count */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#b54708" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div>
                <div className="upload-stat-num">{fileQueue.length}</div>
                <div className="upload-stat-label">Fail Dimuat Naik</div>
              </div>
            </div>
            {/*Card 3: Valid Files */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#027a48" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <div className="upload-stat-num">{validCount}</div>
                <div className="upload-stat-label">Fail Disahkan</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-header-left">
                <div className="panel-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                <div>
                  <div className="panel-title">Muat Naik Laporan &amp; Bukti Lapangan</div>
                  <div className="panel-subtitle">Muatkan laporan bertulis dan gambar bukti daripada kerja lapangan</div>
                </div>
              </div>
            </div>

            <div className="panel-body">
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: "16px", fontSize: "11.5px", color: "var(--text-soft)", lineHeight: 1.6 }}>
                Laporan yang perlu disediakan merangkumi: <strong style={{ color: "var(--text-mid)" }}>butiran lokasi</strong>, <strong style={{ color: "var(--text-mid)" }}>infra awam dan asas di tapak</strong>, <strong style={{ color: "var(--text-mid)" }}>anggaran kos projek</strong> serta <strong style={{ color: "var(--text-mid)" }}>gambar bukti</strong> yang jelas dan berformat.
              </div>

              <div className="section-label-row" style={{ marginTop: "4px" }}>Kawasan Muat Naik — Semua Jenis Fail</div>

              <div
                className={`upload-zone-card ${dragOver ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" multiple ref={fileInputRef} onChange={handleFileChange} />
                <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "10px" }}>
                  <div className="upload-zone-icon" style={{ background: "#dbeafe", borderColor: "#bfdbfe", width: "40px", height: "40px", margin: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", strokeWidth: 1.7 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className="upload-zone-icon" style={{ background: "#f3e8ff", borderColor: "#e9d5ff", width: "40px", height: "40px", margin: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", strokeWidth: 1.7 }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                </div>
                <div className="upload-heading">Laporan &amp; Gambar Bukti</div>
                <div className="upload-sub" style={{ marginTop: "4px" }}>Seret fail ke sini atau klik untuk pilih — dokumen dan gambar diterima sekali gus</div>
                <div className="upload-badge-row" style={{ marginTop: "10px" }}>
                  <span className="upload-format-badge">.PDF</span>
                  <span className="upload-format-badge">.DOCX</span>
                  <span className="upload-format-badge">.DOC</span>
                  <span className="upload-format-badge">.JPG</span>
                  <span className="upload-format-badge">.PNG</span>
                </div>
              </div>

              <div className="section-label-row" style={{ marginTop: "18px" }}>
                Senarai Fail Dimuat Naik
                <span className="count-badge-inline">{fileQueue.length}</span>
              </div>

              {fileQueue.length === 0 ? (
                <div style={{ background: "var(--surface-2)", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", padding: "18px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                  Tiada fail dimuat naik lagi. Gunakan kawasan muat naik di atas.
                </div>
              ) : (
                <div className="file-queue">
                  {fileQueue.map((f) => (
                    <div key={f.id} className="file-queue-item">
                      <span className={`fq-type-badge ${f.type === "doc" ? "fq-doc" : "fq-img"}`}>
                        {f.type === "doc" ? "DOK" : "IMG"}
                      </span>
                      <span className="fq-name" title={f.name}>{f.name}</span>
                      <span className="fq-size">{formatBytes(f.size)}</span>
                      {f.valid ? (
                        <span className="fq-status-ok"><svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Sah</span>
                      ) : (
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--red)", flexShrink: 0 }}>&#x26A0; Ralat</span>
                      )}
                      <button className="btn-remove-fq" onClick={() => removeFile(f.id)}>&#x2715;</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="section-label-row" style={{ marginTop: "18px" }}>
                Maklum Balas Pengesahan Sistem
              </div>

              <div className="validation-header">
                <svg style={{ width: "16px", height: "16px", flexShrink: 0, stroke: "var(--text-soft)", strokeWidth: 1.8 }} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="vh-label">Status Pengesahan Fail — Auto Semak</span>
                <span className="vh-count">{validCount} / {fileQueue.length} fail disahkan</span>
              </div>

              <div className="validation-container">
                {renderValidationAlerts()}
              </div>
            </div>

            <div className="submit-section">
              <button className="btn-hantar-laporan" disabled={!allValid || isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (
                  <>
                    <div style={{ width: "15px", height: "15px", border: "1.5px solid rgba(13,33,55,0.25)", borderTopColor: "var(--navy)", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }}></div>
                    Menghantar...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
                    Hantar Laporan Lengkap
                  </>
                )}
              </button>
              <div className="submit-disclaimer">
                Pastikan semua dokumen dan gambar bukti telah dimuat naik sebelum menghantar. Laporan yang telah dihantar <strong>tidak boleh diubah suai</strong>. Ketua Jabatan akan menerima notifikasi secara automatik.
              </div>
            </div>
          </div>
        </div>
    
      <Toast show={toast.show} title={toast.title} msg={toast.msg} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}