import { useEffect, useState } from "react";
import Navbar from "../../components/common/navbar";
import Pagination from "../../components/common/Pagination";
import "../../styles/pages/PengagihanTugasan.css";

const DEPT_ID = "D001"; // Page ni scoped untuk Ketua Bahagian - Fizikal (ikut Navbar asal)
const priorityLevels = ["Tinggi", "Sederhana", "Rendah"];

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }) : "-");
const toDateInput = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

/* ─── Badge status tugasan ─── */
function TugasanStatusBadge({ status }) {
  const isSelesai = status === "Selesai";
  return (
    <span className={`status-badge ${isSelesai ? "badge-received" : "badge-progress"}`}>
      <span className="badge-dot"></span>
      {isSelesai ? "Selesai" : "Sedang Diproses"}
    </span>
  );
}

/* ─── Pill tahap keutamaan ─── */
function PriorityPill({ priority }) {
  const cls =
    priority === "Tinggi" ? "priority-tinggi" : priority === "Sederhana" ? "priority-sederhana" : "priority-rendah";
  return <span className={`priority-pill ${cls}`}>{priority}</span>;
}

/* ─── Modal: Tugasan Baharu (form) ─── */
function NewTugasanModal({ onClose, onCreate, availableCases, officerList }) {
  const [form, setForm] = useState({
    caseRef: "",
    officer: "",
    instruction: "",
    deadline: "",
    priority: "Sederhana",
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.caseRef || !form.officer || !form.instruction || !form.deadline) {
      alert("Sila lengkapkan semua maklumat tugasan sebelum menghantar.");
      return;
    }
    onCreate(form);
  };

  return (
    <div className="kb-modal-overlay show" onClick={onClose}>
      <div className="kb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="kb-modal-header">
          <div>
            <div className="kb-modal-title">Tugasan Baharu</div>
            <div className="kb-modal-subtitle">Agihkan tugasan kepada Pegawai Penyedia Laporan</div>
          </div>
          <button className="kb-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="kb-modal-form">
          <div className="kb-modal-body">
            <div className="form-group">
              <label className="form-label">Pilih Kes<span className="required">*</span></label>
              <select className="form-select" value={form.caseRef} onChange={update("caseRef")}>
                <option value="">— Pilih kes berkaitan —</option>
                {availableCases.map((c) => (
                  <option key={c.ref} value={c.ref}>{c.ref} — {c.title}</option>
                ))}
              </select>
              {availableCases.length === 0 && (
                <div style={{ fontSize: "11px", color: "var(--text-soft)", marginTop: "4px" }}>
                  Tiada kes yang menunggu tugasan buat masa ini.
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Pegawai Penyedia Laporan<span className="required">*</span></label>
              <select className="form-select" value={form.officer} onChange={update("officer")}>
                <option value="">— Pilih pegawai —</option>
                {officerList.map((o) => (
                  <option key={o.userID} value={o.userID}>{o.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Arahan Terperinci<span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Nyatakan arahan lengkap — skop kerja, maklumat yang perlu dikumpul, format laporan yang dikehendaki, dll."
                value={form.instruction}
                onChange={update("instruction")}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Tarikh Akhir<span className="required">*</span></label>
                <input type="date" className="form-input" value={form.deadline} onChange={update("deadline")} />
              </div>
              <div className="form-group">
                <label className="form-label">Tahap Keutamaan</label>
                <select className="form-select" value={form.priority} onChange={update("priority")}>
                  {priorityLevels.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lampiran (pilihan)</label>
              <div className="dummy-upload-box">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div>Klik atau seret fail rujukan tambahan di sini (pilihan)</div>
              </div>
            </div>
          </div>

          <div className="kb-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary-submit">Hantar Tugasan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Modal: Lihat & Urus Tugasan ─── */
function ViewTugasanModal({ tugasan, onClose, onRemove, onUpdate, officerList }) {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);

  if (!tugasan) return null;

  const isSedangDiproses = tugasan.status !== "Selesai";
  const isSelesai = tugasan.status === "Selesai";

  const handleEditOpen = () => {
    setEditForm({
      officer: tugasan.officerID,
      instruction: tugasan.instruction,
      deadline: tugasan.deadlineRaw,
      priority: tugasan.priority,
    });
    setEditMode(true);
  };

  const handleEditSave = () => {
    if (!editForm.officer || !editForm.instruction || !editForm.deadline) {
      alert("Sila lengkapkan semua maklumat.");
      return;
    }
    onUpdate(tugasan.id, tugasan.caseRef, editForm);
    setEditMode(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Anda pasti mahu membatalkan tugasan kes ${tugasan.caseRef}?`)) {
      onRemove(tugasan.id);
      onClose();
    }
  };

  const update = (field) => (e) => setEditForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="kb-modal-overlay show" onClick={onClose}>
      <div className="kb-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div className="kb-modal-header">
          <div>
            <div className="kb-modal-title">{tugasan.caseRef}</div>
            <div className="kb-modal-subtitle">
              {editMode ? "Kemaskini maklumat tugasan" : `Ditugaskan kepada ${tugasan.officer}`}
            </div>
          </div>
          <button className="kb-modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="kb-modal-body" style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}>
          {!editMode ? (
            <>
              <div className="case-ref-card">
                <div className="case-ref-label">Maklumat Kes Ditugaskan</div>
                <div className="case-ref-title">{tugasan.caseTitle}</div>
                <div className="case-ref-no">{tugasan.caseRef}</div>
              </div>

              <div className="instruction-card" style={{ marginBottom: isSelesai ? "0px" : "15px" }}>
                <div className="instruction-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <div>
                  <div className="instruction-label">Arahan Tugasan Daripada Ketua Bahagian</div>
                  <div className="instruction-text">"{tugasan.instruction}"</div>
                  <div className="instruction-meta">
                    <span className="instruction-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <strong>{tugasan.officer}</strong>
                    </span>
                    <span className="instruction-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Tarikh Arahan: <strong>{tugasan.dateGiven}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {isSelesai && (
                <div style={{
                  marginTop: "18px", padding: "16px", background: "#f0fdf4",
                  border: "1px solid #bbf7d0", borderRadius: "var(--radius-md, 6px)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: "bold", background: "#16a34a",
                      color: "white", padding: "2px 6px", borderRadius: "4px"
                    }}>TERIMA</span>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#14532d" }}>
                      Hasil Laporan &amp; Bukti Lapangan (PPL)
                    </div>
                  </div>

                  <p style={{ fontSize: "12px", color: "#166534", lineHeight: "1.5", margin: "0 0 12px 0" }}>
                    Pegawai Penyedia Laporan (<strong>{tugasan.officer}</strong>) telah melengkapkan tugasan siasatan dan memuat naik dokumen maklum balas akhir.
                  </p>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "white", padding: "10px 14px", borderRadius: "6px",
                    border: "1px solid #dcfce7"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ width: "18px", height: "18px" }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-dark)" }}>
                          {tugasan.caseRef}_Laporan_Siasatan_PPL.pdf
                        </div>
                        <div style={{ fontSize: "10.5px", color: "var(--text-soft)" }}>Dokumen PDF &bull; Selesai Dihantar</div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Memulakan muat turun fail laporan...")}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px",
                        fontWeight: "600", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0",
                        padding: "5px 10px", borderRadius: "4px", cursor: "pointer"
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "13px", height: "13px" }}>
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Muat Turun
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Pegawai Penyedia Laporan<span className="required">*</span></label>
                <select className="form-select" value={editForm.officer} onChange={update("officer")}>
                  {officerList.map((o) => (
                    <option key={o.userID} value={o.userID}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Arahan Terperinci<span className="required">*</span></label>
                <textarea
                  className="form-textarea"
                  value={editForm.instruction}
                  onChange={update("instruction")}
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Tarikh Akhir<span className="required">*</span></label>
                  <input type="date" className="form-input" value={editForm.deadline} onChange={update("deadline")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tahap Keutamaan</label>
                  <select className="form-select" value={editForm.priority} onChange={update("priority")}>
                    {priorityLevels.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="kb-modal-footer" style={{ marginTop: "auto" }}>
          {isSedangDiproses && !editMode && (
            <button type="button" className="btn-danger-outline" onClick={handleRemove}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Batalkan Tugasan
            </button>
          )}
          <div className="kb-modal-footer-right">
            {editMode ? (
              <>
                <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>Batal</button>
                <button type="button" className="btn-primary-submit" onClick={handleEditSave}>Simpan Perubahan</button>
              </>
            ) : (
              <>
                <button type="button" className="btn-secondary" onClick={onClose}>Tutup</button>
                {isSedangDiproses && (
                  <button type="button" className="btn-primary-submit" onClick={handleEditOpen}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Kemaskini
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE — Pengagihan Tugasan
   ════════════════════════════════════════════════════════════════ */
export default function KBPengagihanTugasan() {
  const [tugasanList, setTugasanList] = useState([]);
  const [availableCases, setAvailableCases] = useState([]);
  const [officerList, setOfficerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewingTugasan, setViewingTugasan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/api/document-departments`).then((r) => r.json()),
      fetch(`http://localhost:5000/api/users?role=PegawaiPenyediaLaporan`).then((r) => r.json()),
    ])
      .then(([assignments, officers]) => {
        const deptRows = assignments.filter((a) => a.deptID === DEPT_ID);

        setAvailableCases(
          deptRows
            .filter((a) => !a.assignedOfficer)
            .map((a) => ({ ref: a.refNo, title: a.title }))
        );

        setTugasanList(
          deptRows
            .filter((a) => a.assignedOfficer)
            .map((a) => ({
              id: a.id,
              caseRef: a.refNo,
              caseTitle: a.title,
              officerID: a.assignedOfficer,
              officer: a.officerName || "—",
              instruction: a.instruction || "",
              dateGiven: formatDate(a.assignedAt),
              deadline: formatDate(a.deadline),
              deadlineRaw: toDateInput(a.deadline),
              priority: a.priority,
              status: a.reportStatus === "Diluluskan" ? "Selesai" : "Sedang Diproses",
            }))
        );

        setOfficerList(officers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data tugasan:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = tugasanList.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.caseRef.toLowerCase().includes(q) ||
      t.caseTitle.toLowerCase().includes(q) ||
      t.officer.toLowerCase().includes(q)
    );
  });

  // --- Pagination ---
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreateTugasan = async (form) => {
    const rowMatch = availableCases.find((c) => c.ref === form.caseRef);
    if (!rowMatch) return;

    try {
      // Cari id row DocumentDepartment untuk refNo+deptID ni
      const res = await fetch(`http://localhost:5000/api/document-departments?refNo=${encodeURIComponent(form.caseRef)}`);
      const rows = await res.json();
      const target = rows.find((r) => r.deptID === DEPT_ID);
      if (!target) {
        alert("Ralat: rekod tugasan tidak dijumpai.");
        return;
      }

      await fetch(`http://localhost:5000/api/document-departments/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedOfficer: form.officer, instruction: form.instruction }),
      });

      await fetch(`http://localhost:5000/api/documents/${encodeURIComponent(form.caseRef)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: form.deadline, priority: form.priority }),
      });

      setShowNewModal(false);
      loadData();
    } catch (err) {
      console.error("Ralat sambungan:", err);
      alert("Gagal menghantar tugasan — sila cuba semula.");
    }
  };

  const handleRemoveTugasan = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/document-departments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedOfficer: null, instruction: null }),
      });
      loadData();
    } catch (err) {
      console.error("Ralat sambungan:", err);
    }
  };

  const handleUpdateTugasan = async (id, refNo, editForm) => {
    try {
      await fetch(`http://localhost:5000/api/document-departments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedOfficer: editForm.officer, instruction: editForm.instruction }),
      });

      await fetch(`http://localhost:5000/api/documents/${encodeURIComponent(refNo)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: editForm.deadline, priority: editForm.priority }),
      });

      setViewingTugasan(null);
      loadData();
    } catch (err) {
      console.error("Ralat sambungan:", err);
    }
  };

  return (
    <>
      <Navbar
        title="Pengagihan Tugasan"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Pengagihan Tugasan"]}
        userName="En. Faizal Yusof"
        userRole="Ketua Bahagian-Fizikal"
      />

      <div className="content">
        <div className="page-header page-header--col">
          <div>
            <h1 className="page-heading">Pengagihan Tugasan</h1>
            <p className="page-subheading">
              Agihkan tugasan kepada Pegawai Penyedia Laporan untuk mendapatkan maklumat tambahan seperti lawatan tapak, temu bual, pengumpulan bukti atau penyediaan laporan sokongan bagi membantu penyediaan laporan akhir bahagian.
            </p>
          </div>

          <div className="page-action-bar">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Cari mengikut no. rujukan, pegawai atau kes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery("")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button className="btn-tugasan-baharu" onClick={() => setShowNewModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tugasan Baharu
            </button>
          </div>
        </div>

        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <div className="table-panel-title">Senarai Tugasan</div>
              <div className="table-panel-sub">
                {loading
                  ? "Memuatkan..."
                  : searchQuery
                  ? `${filteredList.length} hasil untuk "${searchQuery}"`
                  : `Menunjukkan ${tugasanList.length} tugasan yang telah diagihkan`}
              </div>
            </div>
          </div>

          <div className="table-scroll-wrapper">
            <table className="data-table" style={{ tableLayout: "auto" }}>
              <colgroup>
                <col style={{ width: "155px" }} />
                <col />
                <col style={{ width: "155px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "70px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>No. Rujukan</th>
                  <th>Tajuk Aduan</th>
                  <th>Pegawai Ditugaskan</th>
                  <th>Tarikh Diberi</th>
                  <th>Tarikh Akhir</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="td-empty">Tiada tugasan ditemui.</td>
                  </tr>
                ) : (
                  paginatedList.map((t) => (
                    <tr key={t.id}>
                      <td className="td-ref">{t.caseRef}</td>
                      <td>
                        <div className="td-tajuk">{t.caseTitle}</div>
                      </td>
                      <td className="td-date">{t.officer}</td>
                      <td className="td-date">{t.dateGiven}</td>
                      <td className="td-date">{t.deadline}</td>
                      <td><TugasanStatusBadge status={t.status} /></td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-icon-detail" onClick={() => setViewingTugasan(t)} title="Lihat / Urus">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {showNewModal && (
        <NewTugasanModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreateTugasan}
          availableCases={availableCases}
          officerList={officerList}
        />
      )}
      <ViewTugasanModal
        tugasan={viewingTugasan}
        onClose={() => setViewingTugasan(null)}
        onRemove={handleRemoveTugasan}
        onUpdate={handleUpdateTugasan}
        officerList={officerList}
      />
    </>
  );
}
