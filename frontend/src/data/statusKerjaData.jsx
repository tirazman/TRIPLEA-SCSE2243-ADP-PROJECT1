// Data for "Status Kerja" — cases that are still WAITING on one or more
// departments to submit their report. Once every department for a case
// has submitted, that case moves over to "Penerimaan Laporan" instead
// (so the two pages never show the same case).
//
// Everything is keyed by "No. Rujukan" (the same ref shown in the table
// and case modal) — there is no separate internal case code anymore.

// General info per case (used for the case history modal header).

// THIS IS DATA FOR PBB ONLY
export const caseRegistry = {
  "PDK/KLG/2026/1024": {
    label: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    category: "Kluang Bandar • Infrastruktur & Awam",
  },
  "PDK/KLG/2026/0912": {
    label: "Kerosakan Lampu Isyarat Simpang Renggam",
    category: "Simpang Renggam • Kemudahan Awam",
  },
  "PDK/KLG/2026/0889": {
    label: "Aduan Jalan Berlubang Kampung Melayu",
    category: "Kluang Lama • Penyelenggaraan Jalan",
  },
  "PDK/KLG/2026/0934": {
    label: "Tandas Awam Rosak dan Tidak Diselenggara — Taman Impian",
    category: "Taman Impian • Kemudahan Awam",
  },
  "PDK/KLG/2026/0947": {
    label: "Pencemaran Sampah Sarap Kawasan Perumahan — Taman Sri Kluang",
    category: "Taman Sri Kluang • Alam Sekitar",
  },
};

export const caseDeptStatus = {
  "PDK/KLG/2026/1024": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Teknikal Banjir Kilat — Jalan Dato' Abdul Rahman",
      note: "Laporan penilaian fizikal telah disempurnakan dan diserahkan kepada Penyelaras.",
      staff: "En. Shahril Bin Hamid",
      date: "2026-06-06 10:30:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Pending",
      docTitle: "Borang Maklum Balas Penduduk — Kawasan Banjir Jalan Dato' Abdul Rahman",
      note: "Belum ada tindakan. Menunggu arahan daripada Penyelaras Bahagian.",
      staff: "Pn. Norlia Binti Daud",
      date: "2026-06-04 08:30:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Pending",
      docTitle: "Penilaian Risiko Banjir & Pelan Tindak Balas — Jalan Dato' Abdul Rahman",
      note: "Belum ada tindakan. Menunggu penugasan pegawai ke lokasi.",
      staff: "En. Zulhilmi Bin Rahmat",
      date: "2026-06-04 08:30:00",
    },
  ],
  "PDK/KLG/2026/0912": [
    {
      dept: "Bahagian Fizikal",
      status: "In Progress",
      docTitle: "Laporan Teknikal Kerosakan Lampu Isyarat — Simpang Renggam",
      note: "Pemeriksaan fizikal sedang dijalankan. Laporan dalam penyediaan.",
      staff: "En. Rashdan Bin Ismail",
      date: "2026-06-02 08:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "In Progress",
      docTitle: "Laporan Aduan Komuniti — Kerosakan Lampu Isyarat Simpang Renggam",
      note: "Pengumpulan maklum balas pengguna jalan sedang dijalankan.",
      staff: "Pn. Hasniza Binti Othman",
      date: "2026-06-02 09:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Completed",
      docTitle: "Laporan Penilaian Keselamatan Persimpangan — Simpang Renggam",
      note: "Penilaian keselamatan telah siap dan diserahkan kepada Penyelaras.",
      staff: "En. Hisyam Bin Rosli",
      date: "2026-06-03 14:00:00",
    },
  ],
  "PDK/KLG/2026/0889": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Penilaian Kerosakan Jalan Berlubang — Kampung Melayu",
      note: "Laporan teknikal telah disiapkan dan diserahkan kepada Penyelaras.",
      staff: "En. Farid Bin Zainal",
      date: "2026-06-26 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Completed",
      docTitle: "Borang Aduan & Impak Penduduk — Jalan Berlubang Kampung Melayu",
      note: "Laporan impak sosial telah dihantar dan disahkan.",
      staff: "Pn. Zaiton Binti Salleh",
      date: "2026-06-26 10:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Completed",
      docTitle: "Laporan Keselamatan Jalan — Kawasan Kampung Melayu",
      note: "Penilaian keselamatan telah dikemukakan. Semua laporan lengkap.",
      staff: "En. Azrul Bin Hamdan",
      date: "2026-06-26 11:00:00",
    },
  ],
  "PDK/KLG/2026/0934": [
    {
      dept: "Bahagian Fizikal",
      status: "Overdue",
      docTitle: "Laporan Pemeriksaan Fizikal Tandas Awam — Taman Impian Blok B",
      note: "Laporan teknikal belum disiapkan. Melepasi tarikh akhir yang ditetapkan.",
      staff: "En. Shahril Bin Hamid",
      date: "2026-06-20 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Overdue",
      docTitle: "Borang Aduan Penduduk — Tandas Awam Taman Impian",
      note: "Laporan aduan belum dihantar. Sudah melepasi tempoh yang ditetapkan.",
      staff: "Pn. Rohani Binti Yusof",
      date: "2026-06-20 09:00:00",
    },
  ],
  "PDK/KLG/2026/0947": [
    {
      dept: "Bahagian Fizikal",
      status: "In Progress",
      docTitle: "Laporan Pemeriksaan Tapak Pembuangan Sampah — Taman Sri Kluang",
      note: "Kerja-kerja siasatan lapangan sedang dijalankan.",
      staff: "En. Zulhilmi Bin Rahmat",
      date: "2026-06-26 14:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "In Progress",
      docTitle: "Laporan Aduan Pencemaran Sampah — Taman Sri Kluang",
      note: "Pengumpulan aduan penduduk masih dalam proses.",
      staff: "Pn. Norlia Binti Daud",
      date: "2026-06-26 15:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Pending",
      docTitle: "Penilaian Risiko Alam Sekitar — Pencemaran Sampah Taman Sri Kluang",
      note: "Belum ada tindakan. Menunggu laporan awal daripada Bahagian Fizikal.",
      staff: "En. Rashdan Bin Ismail",
      date: "2026-06-26 08:00:00",
    },
  ],
};

export const workStatusCases = [
  {
    ref: "PDK/KLG/2026/1024",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    subtitle: "Kluang Bandar • Infrastruktur & Awam",
    arrived: "04 Jun 2026",
    deadline: "07 Jul 2026",
    status: "In Progress",
    keutamaan: "Tinggi",
  },
  {
    ref: "PDK/KLG/2026/0912",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
    subtitle: "Simpang Renggam • Kemudahan Awam",
    arrived: "01 Jun 2026",
    deadline: "04 Jul 2026",
    status: "In Progress",
    keutamaan: "Sederhana",
  },
  {
    ref: "PDK/KLG/2026/0889",
    title: "Aduan Jalan Berlubang Kampung Melayu",
    subtitle: "Kluang Lama • Penyelenggaraan Jalan",
    arrived: "25 Jun 2026",
    deadline: "02 Jul 2026",
    status: "Completed",
    keutamaan: "Tinggi",
  },
  {
    ref: "PDK/KLG/2026/0934",
    title: "Tandas Awam Rosak dan Tidak Diselenggara — Taman Impian",
    subtitle: "Taman Impian • Kemudahan Awam",
    arrived: "20 Jun 2026",
    deadline: "27 Jun 2026",
    status: "Overdue",
    keutamaan: "Sederhana",
  },
  {
    ref: "PDK/KLG/2026/0947",
    title: "Pencemaran Sampah Sarap Kawasan Perumahan — Taman Sri Kluang",
    subtitle: "Taman Sri Kluang • Alam Sekitar",
    arrived: "26 Jun 2026",
    deadline: "03 Jul 2026",
    status: "In Progress",
    keutamaan: "Rendah",
  },
];

export const deptDisplay = {
  "Bahagian Fizikal": { short: "BF" },
  "Bahagian Masyarakat": { short: "BM" },
  "Bahagian Pentadbiran (Bencana dan Keselamatan)": { short: "BP" },
};

export const deptStatusLabel = {
  Pending: "Menunggu Tindakan",
  "In Progress": "Dalam Proses",
  Completed: "Selesai & Dihantar",
  Overdue: "Melebihi Tempoh",
};

//THIS IS FOR PPL STATUS KERJA DATA ONLY
export const pplLaporanData = [
  {
    ref: "PDK/KLG/2026/1024-L",
    aduan: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    title: "Laporan Cadangan Naiktaraf Kawasan Perumahan Banjir",
    subtitle: "Kluang Bandar • Infrastruktur & Awam",
    status: "Pending",
    arrived: "04 Jun 2026",
    deadline: "07 Jul 2026",
    timestamp: "2026-06-28 08:30:00",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0912-L",
    aduan: "Kerosakan Lampu Isyarat Simpang Renggam",
    title: "Laporan Siasatan Bantuan Baik Pulih Lampu Isyarat",
    subtitle: "Simpang Renggam • Kemudahan Awam",
    status: "In Progress",
    arrived: "01 Jun 2026",
    deadline: "04 Jul 2026",
    timestamp: "2026-06-27 11:15:00",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0889-L",
    aduan: "Aduan Jalan Berlubang Kampung Melayu",
    title: "Laporan Penilaian Kerosakan Infrastruktur",
    subtitle: "Kluang Lama • Penyelenggaraan Jalan",
    status: "Completed",
    arrived: "25 Jun 2026",
    deadline: "02 Jul 2026",
    timestamp: "2026-06-25 16:45:00",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0934-L",
    aduan: "Tandas Awam Rosak dan Tidak Diselenggara — Taman Impian",
    title: "Laporan Pemeriksaan Kemudahan Awam Tandas Blok B — Taman Impian Kluang",
    subtitle: "Taman Impian • Kemudahan Awam",
    status: "Overdue",
    arrived: "20 Jun 2026",
    deadline: "27 Jun 2026",
    timestamp: "2026-06-20 09:00:00",
    notes: "Laporan belum disiapkan. Telah melepasi tarikh akhir yang ditetapkan.",
  },
  {
    ref: "PDK/KLG/2026/0947-L",
    aduan: "Pencemaran Sampah Sarap Kawasan Perumahan — Taman Sri Kluang",
    title: "Laporan Siasatan Pengurusan Sisa Pepejal Kawasan Perumahan Taman Sri Kluang",
    subtitle: "Taman Sri Kluang • Alam Sekitar",
    status: "In Progress",
    arrived: "26 Jun 2026",
    deadline: "03 Jul 2026",
    timestamp: "2026-06-26 14:20:00",
    notes: "Kerja-kerja siasatan lapangan sedang dijalankan.",
  },
];


// DATA ONLY FOR KB

/* ─── Tab: "Pengagihan" (Ketua Bahagian — agihan tugasan ke PPL) ─── */
export const kbPengagihanStatusData = [
  {
    ref: "PDK/KLG/2026/0912",
    title: "Pemantauan Kualiti Jalan Raya Pasca Hujan — Kluang Utara",
    subtitle: "Kluang Utara • Infrastruktur & Awam",
    arrived: "18 Jun 2026",
    status: "Sudah Diagihkan",
    assignedTo: "En. Shahril Bin Hamid",
    timestamp: "2026-06-19 09:30:00",
    notes: "Tugasan telah diagihkan kepada PPL untuk laporan teknikal dan laporan komuniti.",
  },
  {
    ref: "PDK/KLG/2026/0905",
    title: "Aduan Bau Busuk Longkang Induk — Taman Universiti",
    subtitle: "Taman Universiti • Alam Sekitar",
    arrived: "15 Jun 2026",
    status: "Sedang Diagihkan",
    assignedTo: "Pn. Norlia Binti Daud",
    timestamp: "2026-06-16 10:00:00",
    notes: "Sebahagian tugasan telah diagihkan. Laporan alam sekitar masih belum ditetapkan pegawai.",
  },
  {
    ref: "PDK/KLG/2026/0889",
    title: "Kerosakan Jambatan Kecil Sungai Bekok",
    subtitle: "Bekok • Infrastruktur & Awam",
    arrived: "05 Jun 2026",
    status: "Belum Diagihkan",
    assignedTo: "",
    timestamp: "2026-06-05 08:00:00",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0921",
    title: "Permohonan Penambahan Lampu Jalan — Felda Sungai Sibol",
    subtitle: "Felda Sungai Sibol • Kemudahan Awam",
    arrived: "23 Jun 2026",
    status: "Belum Diagihkan",
    assignedTo: "",
    timestamp: "2026-06-23 08:00:00",
    notes: "",
  },
];

/** KB Status Kerja — Tab Tugasan Saya */
export const kbTugasanList = [
  {
    id: "TGS/KB/2026/014",
    caseRef: "PDK/KLG/2026/1024",
    caseTitle: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    officer: "En. Shahril Bin Hamid",
    dateGiven: "06 Jun 2026",
    deadline: "13 Jun 2026",
    priority: "Tinggi",
    status: "Sudah Diagihkan",
    instruction: "Turun padang dan sediakan laporan teknikal banjir kilat.",
  },
  {
    id: "TGS/KB/2026/011",
    caseRef: "PDK/KLG/2026/0912",
    caseTitle: "Kerosakan Lampu Isyarat Simpang Renggam",
    officer: "Pn. Norlia Binti Daud",
    dateGiven: "03 Jun 2026",
    deadline: "10 Jun 2026",
    priority: "Tinggi",
    status: "Lewat",
    instruction: "Sahkan status lampu isyarat dengan JKR Daerah.",
  },
  {
    id: "TGS/KB/2026/008",
    caseRef: "PDK/KLG/2026/0889",
    caseTitle: "Aduan Jalan Berlubang Kampung Melayu",
    officer: "",
    dateGiven: "—",
    deadline: "—",
    priority: "Sederhana",
    status: "Belum Diagihkan",
    instruction: "",
  },
  {
    id: "TGS/KB/2026/005",
    caseRef: "PDK/KLG/2025/0805",
    caseTitle: "Permohonan Pembinaan Gelanggang Badminton",
    officer: "En. Rashdan Bin Ismail",
    dateGiven: "22 Mei 2025",
    deadline: "29 Mei 2025",
    priority: "Rendah",
    status: "Selesai",
    instruction: "Pemeriksaan tapak gelanggang badminton.",
  },
];

// FOR KJ ONLY
//Only cases already assigned by KJ via Pengagihan kepada Bahagian

export const kjCaseRegistry = {
  "PDK/KLG/2025/0805": {
    label: "Permohonan Pembinaan Gelanggang Badminton",
    category: "Taman Kluang Indah • Kemudahan Rekreasi",
  },
  "PDK/KLG/2025/0792": {
    label: "Aduan Bau Busuk Tapak Pembuangan Sampah",
    category: "Kulai Jaya • Kebersihan & Alam Sekitar",
  },
  "PDK/KLG/2025/0784": {
    label: "Pokok Tumbang Menghalang Jalan Raya",
    category: "Bekok • Infrastruktur & Awam",
  },
  "PDK/KLG/2026/1024": {
    label: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    category: "Kluang Bandar • Infrastruktur & Awam",
  },
  "PDK/KLG/2026/0912": {
    label: "Kerosakan Lampu Isyarat Simpang Renggam",
    category: "Simpang Renggam • Kemudahan Awam",
  },
  "PDK/KLG/2026/0889": {
    label: "Aduan Jalan Berlubang Kampung Melayu",
    category: "Kluang Lama • Penyelenggaraan Jalan",
  },
  "PDK/KLG/2026/0934": {
    label: "Tandas Awam Rosak — Taman Impian",
    category: "Taman Impian • Kemudahan Awam",
  },
};

export const kjCaseDeptStatus = {
  "PDK/KLG/2026/1024": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Teknikal Banjir Kilat — Jalan Dato' Abdul Rahman",
      note: "Laporan penilaian fizikal telah diserahkan kepada Penyelaras Bahagian.",
      staff: "En. Shahril Bin Hamid",
      date: "2026-06-06 10:30:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "In Progress",
      docTitle: "Borang Maklum Balas Penduduk — Kawasan Banjir",
      note: "Pengumpulan maklum balas penduduk sedang dijalankan.",
      staff: "Pn. Norlia Binti Daud",
      date: "2026-06-06 11:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Pending",
      docTitle: "Penilaian Risiko Banjir — Jalan Dato' Abdul Rahman",
      note: "Menunggu data sokongan daripada Bahagian Fizikal.",
      staff: "En. Zulhilmi Bin Rahmat",
      date: "2026-06-06 08:00:00",
    },
  ],
  "PDK/KLG/2026/0912": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Teknikal Lampu Isyarat — Simpang Renggam",
      note: "Laporan teknikal lengkap. Diserahkan kepada Penyelaras.",
      staff: "En. Rashdan Bin Ismail",
      date: "2026-06-03 14:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Completed",
      docTitle: "Laporan Aduan Komuniti — Simpang Renggam",
      note: "Maklum balas penduduk telah dikumpul dan dihantar.",
      staff: "Pn. Hasniza Binti Othman",
      date: "2026-06-03 15:00:00",
    },
  ],
  "PDK/KLG/2025/0805": [
    {
      dept: "Bahagian Fizikal",
      status: "In Progress",
      docTitle: "Laporan Tapak & Keperluan Infrastruktur — Gelanggang Badminton",
      note: "Pemeriksaan tapak sedang dijalankan.",
      staff: "En. Shahril Bin Hamid",
      date: "2025-05-21 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Pending",
      docTitle: "Laporan Sokongan Persatuan Penduduk — Taman Kluang Indah",
      note: "Menunggu pengesahan sokongan penduduk.",
      staff: "Pn. Norlia Binti Daud",
      date: "2025-05-21 09:00:00",
    },
  ],
  "PDK/KLG/2026/0889": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Penilaian Kerosakan Jalan Berlubang — Kampung Melayu",
      note: "Laporan teknikal lengkap. Diserahkan kepada Penyelaras.",
      staff: "En. Farid Bin Zainal",
      date: "2026-06-26 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Completed",
      docTitle: "Laporan Impak Penduduk — Jalan Berlubang Kampung Melayu",
      note: "Laporan impak sosial telah dihantar dan disahkan.",
      staff: "Pn. Zaiton Binti Salleh",
      date: "2026-06-26 10:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Completed",
      docTitle: "Laporan Keselamatan Jalan — Kampung Melayu",
      note: "Penilaian keselamatan lengkap. Laporan koordinasi sedia untuk KJ.",
      staff: "En. Azrul Bin Hamdan",
      date: "2026-06-26 11:00:00",
    },
  ],
  "PDK/KLG/2026/0934": [
    {
      dept: "Bahagian Fizikal",
      status: "Overdue",
      docTitle: "Laporan Pemeriksaan Tandas Awam — Taman Impian Blok B",
      note: "Laporan belum disiapkan. Melepasi tarikh akhir.",
      staff: "En. Shahril Bin Hamid",
      date: "2026-06-20 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Overdue",
      docTitle: "Laporan Aduan Penduduk — Tandas Awam Taman Impian",
      note: "Laporan aduan belum dihantar.",
      staff: "Pn. Rohani Binti Yusof",
      date: "2026-06-20 09:00:00",
    },
  ],
  "PDK/KLG/2025/0792": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Pembersihan Tapak Pembuangan Sampah — Kulai Jaya",
      note: "Tapak dibersihkan 28 Mei 2025. Kes ditutup.",
      staff: "En. Rashdan Bin Ismail",
      date: "2025-05-28 16:00:00",
    },
  ],
  "PDK/KLG/2025/0784": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Pengalihan Pokok — Bekok",
      note: "Pokok dibuang dan jalan dikosongkan 13 Mei 2025.",
      staff: "En. Zulhilmi Bin Rahmat",
      date: "2025-05-13 14:30:00",
    },
  ],
};

/** KJ-specific pipeline stage labels */
export const kjPipelineLabel = {
  "Dalam Proses Bahagian": "Dalam Proses Bahagian",
  "Menunggu Koordinasi": "Menunggu Koordinasi (PPB)",
  "Menunggu Semakan Akhir": "Menunggu Semakan Akhir KJ",
  Selesai: "Selesai",
  "Melebihi Tempoh": "Melebihi Tempoh",
};

export const kjWorkStatusCases = [
  {
    ref: "PDK/KLG/2026/1024",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    subtitle: "Kluang Bandar • Infrastruktur & Awam",
    assignedDate: "05 Jun 2026",
    arrived: "04 Jun 2026",
    deadline: "07 Jul 2026",
    assignedDepts: ["Bahagian Fizikal", "Bahagian Masyarakat", "Bahagian Pentadbiran (Bencana dan Keselamatan)"],
    pipelineStage: "Dalam Proses Bahagian",
    assignNote: "Sila ambil tindakan segera berkaitan banjir kilat dan longkang tersumbat.",
  },
  {
    ref: "PDK/KLG/2026/0912",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
    subtitle: "Simpang Renggam • Kemudahan Awam",
    assignedDate: "02 Jun 2026",
    arrived: "01 Jun 2026",
    deadline: "04 Jul 2026",
    assignedDepts: ["Bahagian Fizikal", "Bahagian Masyarakat"],
    pipelineStage: "Menunggu Koordinasi",
    assignNote: "Keutamaan tinggi — risiko kemalangan jalan raya.",
  },
  {
    ref: "PDK/KLG/2025/0805",
    title: "Permohonan Pembinaan Gelanggang Badminton",
    subtitle: "Taman Kluang Indah • Kemudahan Rekreasi",
    assignedDate: "20 Mei 2025",
    arrived: "20 Mei 2025",
    deadline: "20 Jun 2025",
    assignedDepts: ["Bahagian Fizikal", "Bahagian Masyarakat"],
    pipelineStage: "Dalam Proses Bahagian",
    assignNote: "Semak kelayakan tapak tanah rizab dan sokongan penduduk.",
  },
  {
    ref: "PDK/KLG/2026/0889",
    title: "Aduan Jalan Berlubang Kampung Melayu",
    subtitle: "Kluang Lama • Penyelenggaraan Jalan",
    assignedDate: "26 Jun 2026",
    arrived: "25 Jun 2026",
    deadline: "02 Jul 2026",
    assignedDepts: ["Bahagian Fizikal", "Bahagian Masyarakat", "Bahagian Pentadbiran (Bencana dan Keselamatan)"],
    pipelineStage: "Menunggu Semakan Akhir",
    assignNote: "Semua bahagian telah hantar laporan. Sedia untuk semakan akhir KJ.",
  },
  {
    ref: "PDK/KLG/2026/0934",
    title: "Tandas Awam Rosak — Taman Impian",
    subtitle: "Taman Impian • Kemudahan Awam",
    assignedDate: "21 Jun 2026",
    arrived: "20 Jun 2026",
    deadline: "27 Jun 2026",
    assignedDepts: ["Bahagian Fizikal", "Bahagian Masyarakat"],
    pipelineStage: "Melebihi Tempoh",
    assignNote: "Laporan belum lengkap — melepasi tempoh akhir.",
  },
  {
    ref: "PDK/KLG/2025/0792",
    title: "Aduan Bau Busuk Tapak Pembuangan Sampah",
    subtitle: "Kulai Jaya • Kebersihan & Alam Sekitar",
    assignedDate: "15 Mei 2025",
    arrived: "15 Mei 2025",
    deadline: "29 Mei 2025",
    assignedDepts: ["Bahagian Fizikal"],
    pipelineStage: "Selesai",
    assignNote: "Tapak telah dibersihkan. Maklum balas dihantar kepada pengadu.",
  },
  {
    ref: "PDK/KLG/2025/0784",
    title: "Pokok Tumbang Menghalang Jalan Raya",
    subtitle: "Bekok • Infrastruktur & Awam",
    assignedDate: "12 Mei 2025",
    arrived: "12 Mei 2025",
    deadline: "14 Mei 2025",
    assignedDepts: ["Bahagian Fizikal"],
    pipelineStage: "Selesai",
    assignNote: "Pokok dibuang dan jalan dikosongkan sepenuhnya.",
  },
];

/** Laporan akhir konsolidasi — dihantar PPB kepada KJ (1 fail sahaja) */
export const kjConsolidatedReports = {
  "PDK/KLG/2026/0889": {
    file: {
      name: "Laporan_Konsolidasi_Jalan_Berlubang_Kampung_Melayu.pdf",
      size: "2.8 MB",
      type: "PDF",
    },
    submittedBy: "Pn. Haslina Binti Mohd Yusof",
    submittedDate: "27 Jun 2026, 09:45",
    note: "Laporan akhir muktamad yang menggabungkan input Bahagian Fizikal, Masyarakat dan Pentadbiran.",
  },
  "PDK/KLG/2025/0792": {
    file: {
      name: "Laporan_Konsolidasi_Tapak_Sampah_Kulai_Jaya.pdf",
      size: "1.6 MB",
      type: "PDF",
    },
    submittedBy: "Pn. Haslina Binti Mohd Yusof",
    submittedDate: "28 Mei 2025, 14:20",
    note: "Laporan akhir disemak dan diluluskan. Maklum balas dihantar kepada pengadu.",
  },
  "PDK/KLG/2025/0784": {
    file: {
      name: "Laporan_Konsolidasi_Pokok_Tumbang_Bekok.pdf",
      size: "1.2 MB",
      type: "PDF",
    },
    submittedBy: "Pn. Haslina Binti Mohd Yusof",
    submittedDate: "13 Mei 2025, 16:00",
    note: "Laporan akhir muktamad — tindakan pengalihan pokok selesai.",
  },
};

/** Ringkasan kemajuan bahagian (tanpa fail individu) — untuk pantau sahaja */
export const kjCaseProgressSummary = {
  "PDK/KLG/2026/1024": { completed: 1, total: 3, label: "1/3 bahagian selesai" },
  "PDK/KLG/2026/0912": { completed: 2, total: 2, label: "Menunggu konsolidasi PPB" },
  "PDK/KLG/2025/0805": { completed: 0, total: 2, label: "0/2 bahagian selesai" },
  "PDK/KLG/2026/0934": { completed: 0, total: 2, label: "0/2 bahagian selesai — melebihi tempoh" },
};

/** Pipeline steps shown in modal (KJ perspective) */
export const kjPipelineSteps = [
  "Diterima PT",
  "Diagih KJ",
  "Dalam Proses Bahagian",
  "Menunggu Koordinasi PPB",
  "Semakan Akhir KJ",
  "Selesai",
];

/** Map pipelineStage → step index (0-based, last completed step) */
export function getKjPipelineStepIndex(stage) {
  const map = {
    "Dalam Proses Bahagian": 2,
    "Menunggu Koordinasi": 3,
    "Menunggu Semakan Akhir": 4,
    Selesai: 5,
    "Melebihi Tempoh": 2,
  };
  return map[stage] ?? 1;
}
