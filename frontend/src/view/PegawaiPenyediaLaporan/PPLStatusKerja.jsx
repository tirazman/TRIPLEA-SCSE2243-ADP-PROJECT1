import React, { useState } from 'react';

export default function PPLStatusKerja() {
  // 1. DATA DATABASE LAPORAN (STATE)
  const [laporanDatabase, setLaporanDatabase] = useState([
    { 
      ref: "PDK/KLG/2026/1024-L", 
      aduan: "Struktur Jambatan Retak di Chamek",
      title: "Laporan Cadangan Naiktaraf Jambatan Kampung Melayu Nyior, Chamek", 
      status: "Pending", 
      timestamp: "2026-06-28 08:30:00", 
      notes: "" 
    },
    { 
      ref: "PDK/KLG/2026/0912-L", 
      aduan: "Rumah Usang dan Bumbung Bocor Warga Emas",
      title: "Laporan Siasatan Bantuan Baik Pulih Rumah Kasih Johor — Mukim Paloh", 
      status: "In Progress", 
      timestamp: "2026-06-27 11:15:00", 
      notes: "Dalam proses pengesahan dokumen pemilikan tanah pemohon." 
    },
    { 
      ref: "PDK/KLG/2026/0889-L", 
      aduan: "Limpahan Air Sungai Mengkibol-Kedai Pekan Kluang",
      title: "Laporan Penilaian Kerosakan Infrastruktur Pasca-Banjir Dun Mahkota", 
      status: "Completed", 
      timestamp: "2026-06-25 16:45:00", 
      notes: "Telah dihantar ke Unit Pembangunan Fail Daerah untuk tindakan peruntukan." 
    },
  ]);

  // 2. STATE UNTUK TAPISAN & MODAL
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [modalStatus, setModalStatus] = useState("Pending");
  const [modalNotes, setModalNotes] = useState("");

  // 3. PENGIRAAN STATISTIK DINAMIK
  const total = laporanDatabase.length;
  const pending = laporanDatabase.filter(r => r.status === "Pending").length;
  const progress = laporanDatabase.filter(r => r.status === "In Progress").length;
  const completed = laporanDatabase.filter(r => r.status === "Completed").length;

  // 4. FUNGSI KENDALI MODAL (HANDLERS)
  const openUpdateModal = (report) => {
    setActiveReport(report);
    setModalStatus(report.status);
    setModalNotes(report.notes);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveReport(null);
  };

  const submitStatusUpdate = (e) => {
    e.preventDefault();
    
    // Format Cap Masa Terkini: YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setLaporanDatabase(prev => 
      prev.map(item => 
        item.ref === activeReport.ref 
          ? { ...item, status: modalStatus, notes: modalNotes, timestamp: formattedDate }
          : item
      )
    );
    
    closeModal();
  };

  // 5. PROSES PENAPISAN CARIAN (SEARCH FILTER)
  const filteredLaporan = laporanDatabase.filter(report => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      report.ref.toLowerCase().includes(query) ||
      report.aduan.toLowerCase().includes(query) ||
      report.title.toLowerCase().includes(query)
    );
  });

  return (
    <section className="view-panel">
      
      {/* HEADER UTAMA HALAMAN */}
      <div className="page-header">
        <div>
          <h1 className="page-heading">Senarai Pengurusan Laporan Aktif</h1>
          <p className="page-subheading">Sistem pemantauan status tugasan laporan bagi urusan rasmi Pejabat Daerah Kluang.</p>
        </div>
      </div>

      {/* GRID KAD STATISTIK */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Jumlah Laporan</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-icon icon-total">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Belum Tindakan</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat-icon icon-pending">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Dalam Proses</span>
            <span className="stat-value">{progress}</span>
          </div>
          <div className="stat-icon icon-progress">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Selesai & Dihantar</span>
            <span className="stat-value">{completed}</span>
          </div>
          <div className="stat-icon icon-completed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
      </div>

      {/* PANEL JADUAL & BAR CARIAN */}
      <div className="table-panel">
        
        {/* BAR CARIAN SAHAJA (Eksport/Cetak & Filter dibuang) */}
        <div style={{ padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari rujukan, aduan atau laporan..." 
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* STRUKTUR JADUAL FIZIKAL */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Rujukan Fail</th>
                <th>Tajuk Aduan</th>
                <th>Nama Laporan</th>
                <th>Status Semasa</th>
                <th>Tarikh Kemaskini</th>
                <th style={{ textAlign: 'right' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.map((report) => {
                let statusClass = "badge-pending";
                let statusLabel = "Belum Diambil Tindakan";

                if (report.status === "In Progress") { statusClass = "badge-progress"; statusLabel = "Dalam Proses"; }
                if (report.status === "Completed") { statusClass = "badge-completed"; statusLabel = "Selesai & Dihantar"; }

                return (
                  <tr key={report.ref}>
                    <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: '13px', color: '#103559' }}>{report.ref}</td>
                    <td style={{ color: '#b54708', fontWeight: 500, maxWidth: '220px', lineHeight: 1.4 }}>{report.aduan}</td>
                    <td style={{ maxWidth: '280px', lineHeight: 1.4 }}>
                      <div><strong>{report.title}</strong></div>
                      {report.notes && (
                        <div style={{ fontSize: '11px', color: '#667085', marginTop: '6px', fontStyle: 'italic', background: '#f9fafb', padding: '4px 8px', borderLeft: '2px solid #d0d5dd', borderRadius: '2px' }}>
                          Nota: {report.notes}
                        </div>
                      )}
                    </td>
                    <td><span className={`badge ${statusClass}`}>{statusLabel}</span></td>
                    <td style={{ color: '#667085', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace" }}>{report.timestamp}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="action-trigger-btn" style={{ background: '#0d2137', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }} onClick={() => openUpdateModal(report)}>
                        Kemaskini Status
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {/* JIKA REKOD TIDAK DITEMUI */}
              {filteredLaporan.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: '24px' }}>
                    Tiada rekod laporan ditemui bagi carian "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MODAL PENGEMASKINIAN STATUS (RENDER SEPERTI DIKENDALI) */}
      {isModalOpen && activeReport && (
        <div className="modal-backdrop" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3 className="modal-title">Pindaan Urusan: {activeReport.title}</h3>
            <p className="modal-subtitle">No. Rujukan Fail: {activeReport.ref}</p>
            
            <form onSubmit={submitStatusUpdate}>
              <div className="form-group">
                <label className="form-label">Sila Pilih Status Baharu</label>
                <select 
                  className="form-control" 
                  value={modalStatus} 
                  onChange={(e) => setModalStatus(e.target.value)}
                >
                  <option value="Pending">Belum Diambil Tindakan (Pending)</option>
                  <option value="In Progress">Dalam Proses Tindakan (In Progress)</option>
                  <option value="Completed">Selesai & Disahkan (Completed)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nota / Justifikasi Kemaskini</label>
                <textarea 
                  className="form-control text-area" 
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Masukkan nota semakan, ulasan atau catatan ringkas..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Kemaskini</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}