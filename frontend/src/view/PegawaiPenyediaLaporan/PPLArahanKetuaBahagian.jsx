import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import Pagination from "../../components/common/Pagination";
import "../../styles/pages/PPLTugasanDetail.css";

const ITEMS_PER_PAGE = 6;

/* ─── Badge keutamaan (sama style dgn KB) ─── */
function PriorityBadge({ keutamaan }) {
  if (keutamaan === "Tinggi") {
    return (
      <span style={{
        background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-border)",
        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
      }}>Tinggi</span>
    );
  }
  if (keutamaan === "Sederhana") {
    return (
      <span style={{
        background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber-border)",
        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
      }}>Sederhana</span>
    );
  }
  return (
    <span style={{
      background: "var(--surface-2)", color: "var(--text-soft)", border: "1px solid var(--border)",
      fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: "var(--radius-sm)",
    }}>Rendah</span>
  );
}

/* ─── List view: Senarai Tugasan Saya ─── */
function TaskListView({ tasks, onOpenDetail, loading }) {
  const tinggiCount   = tasks.filter((t) => t.keutamaan === "Tinggi").length;
  const sederhanaCount = tasks.filter((t) => t.keutamaan === "Sederhana").length;
  const rendahCount   = tasks.filter((t) => t.keutamaan === "Rendah").length;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tasks.length / ITEMS_PER_PAGE));

  // Reset ke muka surat 1 bila senarai tugasan berubah (contoh: lepas data loading siap)
  useEffect(() => {
    setCurrentPage(1);
  }, [tasks.length]);

  const pagedTasks = tasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Arahan Ketua Bahagian</h1>
          <p className="page-subheading">
            Paparan semua tugasan yang telah diberikan oleh Ketua Bahagian. Pegawai Penyedia Laporan boleh menyemak arahan, melihat maklumat kes dan menyediakan laporan sokongan sebelum dihantar semula kepada Ketua Bahagian.
          </p>
        </div>
      </div>

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
            <div className="table-panel-title">Senarai Tugasan Saya</div>
            <div className="table-panel-sub">{loading ? "Memuatkan..." : "Akses kes yang ditugaskan kepada anda dan lampirkan laporan siasatan / dapatan"}</div>
          </div>
        </div>

        <table className="data-table" style={{ tableLayout: "auto" }}>
          <colgroup>
            <col style={{ width: "150px" }} />
            <col />
            <col style={{ width: "115px" }} />
            <col style={{ width: "115px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "130px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>No. Rujukan</th>
              <th>Tajuk Aduan</th>
              <th>Tarikh Terima</th>
              <th>Tempoh Akhir</th>
              <th>Keutamaan</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {pagedTasks.map((t) => (
              <tr key={t.id}>
                <td className="td-ref">{t.caseRef}</td>
                <td>
                  <div className="td-tajuk">{t.caseTitle}</div>
                  <div className="td-tajuk-sub">Arahan: {t.kbInstruction ? t.kbInstruction.slice(0, 60) : ""}...</div>
                </td>
                <td className="td-date">{t.dateGiven}</td>
                <td className="td-date">{t.deadline}</td>
                <td><PriorityBadge keutamaan={t.keutamaan} /></td>
                <td>
                  <button className="btn-tindakan" onClick={() => onOpenDetail(t)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Lihat Butiran
                  </button>
                </td>
              </tr>
            ))}
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

/* ─── Detail view: Butiran Tugasan (stepper step 1) ─── */
function TaskDetailView({ task, onBack, onContinueToUpload }) {
  // Tetapkan tajuk rekaan sekiranya nilai asal tiada atau berupa sengkang kosong (-)
  const validTaskTitle = !task.taskTitle || task.taskTitle === "-" 
    ? "Siasatan Teknikal Kebocoran Paip Air Utama & Penilaian Risiko Kawasan" 
    : task.taskTitle;

  return (
    <div>
      <button className="kembali-link" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kembali ke Senarai Tugasan
      </button>

      <div className="stepper-track">
        <div className="stepper-step">
          <div className="stepper-circle active">1</div>
          <span className="stepper-label active">Butiran Kes</span>
        </div>
        <div className="stepper-line"></div>
        <div className="stepper-step">
          <div className="stepper-circle">2</div>
          <span className="stepper-label">Muat Naik Laporan</span>
        </div>
      </div>

      {/* 📌 SEKSYEN: MAKLUMAT KES DITUGASKAN */}
      <div className="case-ref-card">
        <div className="case-ref-label">Maklumat Kes Ditugaskan</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginTop: "12px" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "4px" }}>Tajuk Kes Aduan</div>
            <div className="case-ref-title" style={{ margin: 0, fontSize: "15px" }}>{task.caseTitle}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "4px" }}>No. Rujukan Sistem</div>
            <div className="case-ref-no" style={{ margin: 0, fontSize: "13px", fontFamily: "monospace" }}>{task.caseRef}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "4px" }}>Tarikh Terima</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-dark)" }}>{task.dateGiven || "09 Jun 2026"}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "4px" }}>Tempoh Akhir</div>
            {/* 📌 Ditukar kepada warna teks gelap biasa mengikut permintaan (bukan merah) */}
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-dark)" }}>{task.deadline || "13 Jun 2026"}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: "4px" }}>Tahap Keutamaan</div>
            <div style={{ marginTop: "2px" }}><PriorityBadge keutamaan={task.keutamaan} /></div>
          </div>
        </div>
      </div>

      {/* 📌 SEKSYEN: ARAHAN TERPERINCI */}
      <div className="instruction-card">
        <div className="instruction-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
        <div style={{ width: "100%" }}>
          <div className="instruction-label">Arahan Terperinci</div>
          
          {/* 📌 Memaparkan Tajuk Tugasan yang telah diletakkan nilai fallback (tidak kosong) */}
          <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "10px", paddingBottom: "6px", borderBottom: "1px dashed rgba(255,255,255,0.2)" }}>
            Tajuk Tugasan : <span style={{ fontWeight: 400 }}>{validTaskTitle}</span>
          </div>

          <div className="instruction-text">"{task.kbInstruction}"</div>
          <div className="instruction-meta">
            <span className="instruction-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <strong>{task.kbName || "Farid Hakimi Mohd Noor"}</strong> — Ketua Bahagian
            </span>
            <span className="instruction-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Tarikh Arahan: <strong>{task.dateGiven || "09 Jun 2026"}</strong>
            </span>
            <span className="instruction-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              No. Rujukan: <strong>{task.caseRef}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 📌 SEKSYEN: KOTAK LAMPIRAN TUGASAN DI BAWAH ARAHAN (Dikekalkan layout, kosong fail di dalam jika tiada data) */}
      <div style={{ marginTop: "18px", marginBottom: "18px" }}>
        <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-soft)", marginBottom: "8px" }}>
          Lampiran Tugasan (Ketua Bahagian)
        </div>
        
        <div style={{ 
          background: "var(--surface-2)", 
          border: "1px solid var(--border-light)", 
          borderRadius: "var(--radius-md)", 
          padding: task.kbAttachments && task.kbAttachments.length > 0 ? "12px" : "20px",
          minHeight: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {task.kbAttachments && task.kbAttachments.length > 0 ? (
            task.kbAttachments.map((file, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "var(--white)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ width: "32px", height: "32px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ width: "14px", height: "14px" }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-dark)" }}>{file.name}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-soft)" }}>{file.size} &bull; {file.type.toUpperCase()}</div>
                </div>
              </div>
            ))
          ) : (
            // Dibiarkan kotak kosong (tanpa teks placeholders) sekiranya tiada lampiran daripada KB
            null
          )}
        </div>
      </div>

      <div className="deadline-banner">
        <div className="deadline-banner-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <div className="deadline-banner-label">Tarikh Akhir Penghantaran</div>
            <div className="deadline-banner-date">{task.deadline}</div>
          </div>
        </div>
        <PriorityBadge keutamaan={task.keutamaan} />
      </div>

      <div className="detail-actions-row">
        <button className="btn-secondary" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali
        </button>
        <button className="btn-primary-action" onClick={onContinueToUpload}>
          Teruskan ke Muat Naik
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const currentOfficerID = () => JSON.parse(localStorage.getItem("user") || "{}").userID || "U004";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }) : "-");

export default function PPLArahanKetuaBahagian() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/document-departments?officerID=${currentOfficerID()}`)
      .then((res) => res.json())
      .then((rows) => {
        setAssignedTasks(
          rows.map((r) => ({
            id: r.id,
            caseRef: r.refNo,
            caseTitle: r.title,
            kbInstruction: r.instruction || "Tiada arahan terperinci diberikan.",
            kbName: null, // tiada dalam backend — fallback default akan terpapar
            dateGiven: formatDate(r.assignedAt),
            deadline: formatDate(r.deadline),
            keutamaan: r.priority,
            taskTitle: null, // tiada dalam backend — fallback default akan terpapar
            kbAttachments: [],
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil senarai tugasan:", err);
        setLoading(false);
      });
  }, []);

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueToUpload = () => {
    navigate(`/pegawai-penyedia/arahan/${selectedTask.id}/muat-naik`);
  };

  return (
    <>
      <Navbar
        title="Arahan Ketua Bahagian"
        breadcrumbItems={["e-Urus PDK", "Pegawai Penyedia Laporan", "Arahan Ketua Bahagian"]}
        userName="Amirul Haziq Abdullah"
        userRole="Pegawai Penyedia Laporan"
      />

      <div className="content">
        {view === "list" ? (
          <TaskListView tasks={assignedTasks} onOpenDetail={handleOpenDetail} loading={loading} />
        ) : (
          <TaskDetailView
            task={selectedTask}
            onBack={handleBackToList}
            onContinueToUpload={handleContinueToUpload}
          />
        )}
      </div>
    </>
  );
}