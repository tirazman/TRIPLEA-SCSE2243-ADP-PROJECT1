import { useState } from "react";
import Navbar from "../../components/common/navbar";
import {
  availableCases,
  officerList,
  priorityLevels,
  initialTugasanList,
} from "../../data/tugasanData";
import "../../styles/pages/PengagihanTugasan.css";

/* ─── Badge status tugasan (Belum Selesai / Selesai sahaja) ─── */
function TugasanStatusBadge({ status }) {
  const isSelesai = status === "Selesai";
  return (
    <span className={`status-badge ${isSelesai ? "badge-received" : "badge-pending"}`}>
      <span className="badge-dot"></span>
      {isSelesai ? "Selesai" : "Belum Selesai"}
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
function NewTugasanModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    caseRef: "",
    officer: "",
    title: "",
    instruction: "",
    deadline: "",
    priority: "Sederhana",
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.caseRef || !form.officer || !form.title || !form.instruction || !form.deadline) {
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
            </div>

            <div className="form-group">
              <label className="form-label">Pegawai Penyedia Laporan<span className="required">*</span></label>
              <select className="form-select" value={form.officer} onChange={update("officer")}>
                <option value="">— Pilih pegawai —</option>
                {officerList.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tajuk Tugasan<span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Lawatan Tapak & Penilaian Kerosakan Struktur"
                value={form.title}
                onChange={update("title")}
              />
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
function ViewTugasanModal({ tugasan, onClose, onRemove, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);

  if (!tugasan) return null;

  const isPending = tugasan.status !== "Selesai";

  const handleEditOpen = () => {
    setEditForm({
      officer: tugasan.officer,
      instruction: tugasan.instruction,
      deadline: tugasan.deadlineRaw || tugasan.deadline,
      priority: tugasan.priority,
    });
    setEditMode(true);
  };

  const handleEditSave = () => {
    if (!editForm.officer || !editForm.instruction || !editForm.deadline) {
      alert("Sila lengkapkan semua maklumat.");
      return;
    }
    onUpdate(tugasan.id, editForm);
    setEditMode(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Anda pasti mahu membatalkan tugasan ${tugasan.id}?`)) {
      onRemove(tugasan.id);
      onClose();
    }
  };

  const update = (field) => (e) => setEditForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="kb-modal-overlay show" onClick={onClose}>
      <div className="kb-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="kb-modal-header">
          <div>
            <div className="kb-modal-title">{tugasan.id}</div>
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

        <div className="kb-modal-body">
          {!editMode ? (
            <>
              <div className="case-ref-card">
                <div className="case-ref-label">Maklumat Kes Ditugaskan</div>
                <div className="case-ref-title">{tugasan.caseTitle}</div>
                <div className="case-ref-no">{tugasan.caseRef}</div>
              </div>

              <div className="instruction-card">
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
                    <span className="instruction-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      No. Tugasan: <strong>{tugasan.id}</strong>
                    </span>
                  </div>
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
                    <div className="deadline-banner-date">{tugasan.deadline}</div>
                  </div>
                </div>
                <PriorityPill priority={tugasan.priority} />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Pegawai Penyedia Laporan<span className="required">*</span></label>
                <select className="form-select" value={editForm.officer} onChange={update("officer")}>
                  {officerList.map((name) => (
                    <option key={name} value={name}>{name}</option>
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

        <div className="kb-modal-footer">
          {isPending && !editMode && (
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
                {isPending && (
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
  const [tugasanList, setTugasanList] = useState(initialTugasanList);
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewingTugasan, setViewingTugasan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = tugasanList.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.caseRef.toLowerCase().includes(q) ||
      t.caseTitle.toLowerCase().includes(q) ||
      t.officer.toLowerCase().includes(q)
    );
  });

  const handleCreateTugasan = (form) => {
    const caseInfo = availableCases.find((c) => c.ref === form.caseRef);
    const newEntry = {
      id: `TGS-2026-${String(1000 + tugasanList.length).slice(-4)}`,
      caseRef: form.caseRef,
      caseTitle: caseInfo?.title || "",
      officer: form.officer,
      instruction: form.instruction,
      priority: form.priority,
      dateGiven: new Date().toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }),
      deadline: new Date(form.deadline).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }),
      deadlineRaw: form.deadline,
      status: "Menunggu Laporan",
    };
    setTugasanList((prev) => [newEntry, ...prev]);
    setShowNewModal(false);
  };

  const handleRemoveTugasan = (id) => {
    setTugasanList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTugasan = (id, editForm) => {
    setTugasanList((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newDeadline = new Date(editForm.deadline).toLocaleDateString("ms-MY", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const updated = {
          ...t,
          officer: editForm.officer,
          instruction: editForm.instruction,
          priority: editForm.priority,
          deadline: newDeadline,
          deadlineRaw: editForm.deadline,
        };
        setViewingTugasan(updated);
        return updated;
      })
    );
  };

  return (
    <>
      <Navbar
        title="Pengagihan Tugasan"
        breadcrumbItems={["e-Urus PDK", "Ketua Bahagian", "Pengagihan Tugasan"]}
        userName="Hafizul Hakim"
        userRole="Ketua Bahagian"
      />

      <div className="content">
        <div className="page-header page-header--col">
          <div>
            <h1 className="page-heading">Pengagihan Tugasan</h1>
            <p className="page-subheading">
              Agihkan tugasan kepada Pegawai Penyedia Laporan untuk mendapatkan maklumat tambahan seperti lawatan tapak, temu bual, pengumpulan bukti atau penyediaan laporan sokongan bagi membantu penyediaan laporan akhir bahagian.
            </p>
          </div>

          {/* Action bar: search + new button */}
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
                {searchQuery
                  ? `${filteredList.length} hasil untuk "${searchQuery}"`
                  : `Menunjukkan ${tugasanList.length} tugasan yang telah diagihkan`}
              </div>
            </div>
          </div>

          <div className="table-scroll-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "110px" }}>No. Tugasan</th>
                  <th>Tajuk Aduan</th>
                  <th style={{ width: "160px" }}>Pegawai Ditugaskan</th>
                  <th style={{ width: "105px" }}>Tarikh Diberi</th>
                  <th style={{ width: "105px" }}>Tarikh Akhir</th>
                  <th style={{ width: "110px" }}>Status</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="td-empty">Tiada tugasan ditemui.</td>
                  </tr>
                ) : (
                  filteredList.map((t) => (
                    <tr key={t.id}>
                      <td className="td-ref">{t.id}</td>
                      <td>
                        <div className="td-tajuk">{t.caseTitle}</div>
                        <div className="td-tajuk-sub">{t.caseRef}</div>
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
        </div>
      </div>

      {showNewModal && (
        <NewTugasanModal onClose={() => setShowNewModal(false)} onCreate={handleCreateTugasan} />
      )}
      <ViewTugasanModal
        tugasan={viewingTugasan}
        onClose={() => setViewingTugasan(null)}
        onRemove={handleRemoveTugasan}
        onUpdate={handleUpdateTugasan}
      />
    </>
  );
}
