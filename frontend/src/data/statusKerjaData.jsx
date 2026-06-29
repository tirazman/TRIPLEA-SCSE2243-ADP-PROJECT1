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

