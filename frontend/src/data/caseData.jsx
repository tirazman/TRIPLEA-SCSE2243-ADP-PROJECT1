// caseData.jsx
// caseList mirrors workStatusCases from statusKerjaData — same refs, titles,
// dates. These are cases awaiting consolidation by Pegawai Penyelaras.
//
// submittedCount = berapa bahagian dah submit
// totalDepts     = 3 (Fizikal + Masyarakat + Pentadbiran)
// "Konsolidasi Laporan AI" hanya aktif bila submittedCount === totalDepts

export const caseList = [
  {
    ref: "PDK/KLG/2026/0912",
    title: "Pemantauan Kualiti Jalan Raya Pasca Hujan — Kluang Utara",
    subtitle: "Kluang Utara • Infrastruktur & Awam",
    tarikhTerima: "18 Jun 2026",
    tempohAkhir: "25 Jun 2026",
    overdue: false,
    keutamaan: "Tinggi",
    submittedCount: 1,
    totalDepts: 3,
  },
  {
    ref: "PDK/KLG/2026/0905",
    title: "Aduan Bau Busuk Longkang Induk — Taman Universiti",
    subtitle: "Taman Universiti • Alam Sekitar",
    tarikhTerima: "15 Jun 2026",
    tempohAkhir: "22 Jun 2026",
    overdue: false,
    keutamaan: "Sederhana",
    submittedCount: 2,
    totalDepts: 3,
  },
  {
    ref: "PDK/KLG/2026/0889",
    title: "Kerosakan Jambatan Kecil Sungai Bekok",
    subtitle: "Bekok • Infrastruktur & Awam",
    tarikhTerima: "05 Jun 2026",
    tempohAkhir: "12 Jun 2026",
    overdue: true,
    keutamaan: "Tinggi",
    submittedCount: 3,
    totalDepts: 3,
  },
  {
    ref: "PDK/KLG/2026/0921",
    title: "Permohonan Penambahan Lampu Jalan — Felda Sungai Sibol",
    subtitle: "Felda Sungai Sibol • Kemudahan Awam",
    tarikhTerima: "23 Jun 2026",
    tempohAkhir: "30 Jun 2026",
    overdue: false,
    keutamaan: "Rendah",
    submittedCount: 0,
    totalDepts: 3,
  },
];

// Per-case department submission tracking — which dept IDs have submitted
export const caseDeptSubmissions = {
  "PDK/KLG/2026/0912": ["fizikal"],                              // 1/3
  "PDK/KLG/2026/0905": ["fizikal", "masyarakat"],               // 2/3
  "PDK/KLG/2026/0889": ["fizikal", "masyarakat", "pentadbiran"],// 3/3 ✓
  "PDK/KLG/2026/0921": [],                                       // 0/3
};

// Per-case department report details shown in the consolidation workspace
export const caseDepartmentReports = {
  "PDK/KLG/2026/0912": [
    {
      id: "fizikal",
      deptClass: "dept-fizikal",
      name: "Bahagian Fizikal",
      subtitle: "Infrastruktur, Kos & Tapak",
      submitted: true,
      icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
      infoRows: [
        ["Pegawai Penyedia", "En. Shahril Bin Hamid"],
        ["Tarikh Laporan", "20 Jun 2026"],
        ["Lokasi", "Kluang Utara, Seksyen 3"],
        ["Status Turapan", "Retak permukaan ±120m, longkang tersumbat"],
      ],
      attachments: [{ name: "Laporan_Fizikal_PDK0912.pdf", type: "pdf" }],
    },
    {
      id: "masyarakat",
      deptClass: "dept-masyarakat",
      name: "Bahagian Masyarakat",
      subtitle: "Aduan Awam & Impak Komuniti",
      submitted: false,
      icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
      infoRows: [["Pegawai Penyedia", "Pn. Norlia Binti Daud"], ["Status", "Laporan sedang disediakan"]],
      attachments: [],
    },
    {
      id: "pentadbiran",
      deptClass: "dept-pentadbiran",
      name: "Bahagian Pentadbiran",
      subtitle: "Bencana & Keselamatan",
      submitted: false,
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      infoRows: [["Pegawai Penyedia", "En. Zulhilmi Bin Rahmat"], ["Status", "Penilaian risiko dalam penyediaan"]],
      attachments: [],
    },
  ],
  "PDK/KLG/2026/0905": [
    {
      id: "fizikal",
      deptClass: "dept-fizikal",
      name: "Bahagian Fizikal",
      subtitle: "Infrastruktur, Kos & Tapak",
      submitted: true,
      icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
      infoRows: [["Pegawai Penyedia", "En. Rashdan Bin Ismail"], ["Tarikh Laporan", "16 Jun 2026"], ["Punca", "Pemeriksaan longkang sedang dijalankan"]],
      attachments: [{ name: "Laporan_Teknikal_Longkang_PDK0905.pdf", type: "pdf" }],
    },
    {
      id: "masyarakat",
      deptClass: "dept-masyarakat",
      name: "Bahagian Masyarakat",
      subtitle: "Aduan Awam & Impak Komuniti",
      submitted: true,
      icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
      infoRows: [["Pegawai Penyedia", "Pn. Hasniza Binti Othman"], ["Tarikh Laporan", "15 Jun 2026"], ["Bilangan Aduan", "18 aduan diterima"]],
      attachments: [{ name: "Laporan_Masyarakat_PDK0905.pdf", type: "pdf" }],
    },
    {
      id: "pentadbiran",
      deptClass: "dept-pentadbiran",
      name: "Bahagian Pentadbiran",
      subtitle: "Bencana & Keselamatan",
      submitted: false,
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      infoRows: [["Pegawai Penyedia", "—"], ["Status", "Belum ada tindakan"]],
      attachments: [],
    },
  ],
  "PDK/KLG/2026/0889": [
    {
      id: "fizikal",
      deptClass: "dept-fizikal",
      name: "Bahagian Fizikal",
      subtitle: "Infrastruktur, Kos & Tapak",
      submitted: true,
      icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
      infoRows: [["Pegawai Penyedia", "En. Farid Bin Zainal"], ["Tarikh Laporan", "05 Jun 2026"], ["Lokasi", "Sungai Bekok KM 7"], ["Status Struktur", "Jambatan retak, perlu pembaikan segera"]],
      attachments: [{ name: "Laporan_Teknikal_Jambatan_PDK0889.pdf", type: "pdf" }, { name: "Gambar_Jambatan_Bekok.jpg", type: "image" }],
    },
    {
      id: "masyarakat",
      deptClass: "dept-masyarakat",
      name: "Bahagian Masyarakat",
      subtitle: "Aduan Awam & Impak Komuniti",
      submitted: true,
      icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
      infoRows: [["Pegawai Penyedia", "Pn. Zaiton Binti Salleh"], ["Tarikh Laporan", "05 Jun 2026"], ["Penduduk Terjejas", "±85 orang / 22 isi rumah"]],
      attachments: [{ name: "Laporan_Impak_PDK0889.pdf", type: "pdf" }],
    },
    {
      id: "pentadbiran",
      deptClass: "dept-pentadbiran",
      name: "Bahagian Pentadbiran",
      subtitle: "Bencana & Keselamatan",
      submitted: true,
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      infoRows: [["Pegawai Penyedia", "En. Hisyam Bin Rosli"], ["Tarikh Laporan", "05 Jun 2026"], ["Tahap Ancaman", "Tinggi (Tahap 3)"]],
      attachments: [{ name: "Laporan_Keselamatan_PDK0889.pdf", type: "pdf" }],
    },
  ],
  "PDK/KLG/2026/0921": [
    {
      id: "fizikal",
      deptClass: "dept-fizikal",
      name: "Bahagian Fizikal",
      subtitle: "Infrastruktur, Kos & Tapak",
      submitted: false,
      icon: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
      infoRows: [["Pegawai Penyedia", "En. Azrul Bin Hamdan"], ["Status", "Belum dimulakan"]],
      attachments: [],
    },
    {
      id: "masyarakat",
      deptClass: "dept-masyarakat",
      name: "Bahagian Masyarakat",
      subtitle: "Aduan Awam & Impak Komuniti",
      submitted: false,
      icon: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>),
      infoRows: [["Pegawai Penyedia", "Pn. Rohani Binti Yusof"], ["Status", "Belum ada tindakan"]],
      attachments: [],
    },
    {
      id: "pentadbiran",
      deptClass: "dept-pentadbiran",
      name: "Bahagian Pentadbiran",
      subtitle: "Bencana & Keselamatan",
      submitted: false,
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      infoRows: [["Pegawai Penyedia", "—"], ["Status", "Belum ada tindakan"]],
      attachments: [],
    },
  ],
};

export const STRATEGI_MAPPING = [
  { pct: 15, msg: "Membaca laporan Bahagian Fizikal..." },
  { pct: 35, msg: "Menganalisis data empirikal Bahagian Masyarakat..." },
  { pct: 60, msg: "Memproses parameter keselamatan Bahagian Pentadbiran..." },
  { pct: 80, msg: "Menggabungkan aset multimedia dan tabular..." },
  { pct: 95, msg: "Menyelaraskan struktur format dokumen rasmi..." },
  { pct: 100, msg: "Konsolidasi selesai. Menjana draf Word..." },
];
