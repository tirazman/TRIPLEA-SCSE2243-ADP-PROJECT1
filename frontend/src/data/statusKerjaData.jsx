// Data for "Status Kerja" — cases that are still WAITING on one or more
// departments to submit their report. Once every department for a case
// has submitted, that case moves over to "Penerimaan Laporan" instead
// (so the two pages never show the same case).
//
// Everything is keyed by "No. Rujukan" (the same ref shown in the table
// and case modal) — there is no separate internal case code anymore.

// General info per case (used for the case history modal header).
export const caseRegistry = {
  "PDK/KLG/2026/0912": {
    label: "Pemantauan Kualiti Jalan Raya Pasca Hujan — Kluang Utara",
    category: "Kluang Utara • Infrastruktur & Awam",
  },
  "PDK/KLG/2026/0889": {
    label: "Kerosakan Jambatan Kecil Sungai Bekok",
    category: "Bekok • Infrastruktur & Awam",
  },
  "PDK/KLG/2026/0905": {
    label: "Aduan Bau Busuk Longkang Induk — Taman Universiti",
    category: "Taman Universiti • Alam Sekitar",
  },
  "PDK/KLG/2026/0921": {
    label: "Permohonan Penambahan Lampu Jalan — Felda Sungai Sibol",
    category: "Felda Sungai Sibol • Kemudahan Awam",
  },
};

// Per-department submission status for each case.
export const caseDeptStatus = {
  "PDK/KLG/2026/0912": [
    {
      dept: "Bahagian Fizikal",
      status: "Completed",
      docTitle: "Laporan Penilaian Kualiti Turapan Jalan — Kluang Utara",
      note: "Laporan penilaian fizikal telah disempurnakan dan diserahkan kepada Penyelaras.",
      staff: "En. Shahril Bin Hamid",
      date: "2026-06-20 10:30:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "In Progress",
      docTitle: "Borang Maklum Balas Penduduk — Kluang Utara Seksyen 3",
      note: "Pengumpulan maklum balas penduduk setempat sedang dijalankan. Belum dihantar.",
      staff: "Pn. Norlia Binti Daud",
      date: "2026-06-21 09:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "In Progress",
      docTitle: "Penilaian Risiko Keselamatan Jalan — Laporan Awal",
      note: "Penilaian risiko sedang disediakan. Menunggu data sokongan daripada unit lapangan.",
      staff: "En. Zulhilmi Bin Rahmat",
      date: "2026-06-21 11:00:00",
    },
  ],
  "PDK/KLG/2026/0905": [
    {
      dept: "Bahagian Fizikal",
      status: "In Progress",
      docTitle: "Laporan Teknikal Longkang Induk — Taman Universiti Blok C",
      note: "Kerja-kerja pemeriksaan longkang sedang dijalankan. Laporan dalam penyediaan.",
      staff: "En. Rashdan Bin Ismail",
      date: "2026-06-16 08:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Completed",
      docTitle: "Laporan Aduan Komuniti — Bau Busuk Longkang Taman Universiti",
      note: "Laporan aduan penduduk telah diterima dan disahkan. Diserahkan kepada Penyelaras.",
      staff: "Pn. Hasniza Binti Othman",
      date: "2026-06-15 14:00:00",
    },
  ],
  "PDK/KLG/2026/0889": [
    {
      dept: "Bahagian Fizikal",
      status: "Overdue",
      docTitle: "Laporan Teknikal Struktur Jambatan — Sungai Bekok KM 7",
      note: "Laporan teknikal belum disiapkan. Melepasi tarikh akhir yang ditetapkan.",
      staff: "En. Farid Bin Zainal",
      date: "2026-06-05 09:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Overdue",
      docTitle: "Borang Aduan & Impak Penduduk — Kawasan Jambatan Bekok",
      note: "Laporan impak sosial belum dihantar. Sudah melepasi tempoh yang ditetapkan.",
      staff: "Pn. Zaiton Binti Salleh",
      date: "2026-06-05 09:00:00",
    },
    {
      dept: "Bahagian Pentadbiran (Bencana dan Keselamatan)",
      status: "Overdue",
      docTitle: "Laporan Penilaian Bahaya & Pelan Tindak Balas Kecemasan — Jambatan Bekok",
      note: "Penilaian bahaya dan pelan kecemasan belum dikemukakan. Tempoh telah tamat.",
      staff: "En. Hisyam Bin Rosli",
      date: "2026-06-05 09:00:00",
    },
  ],
  "PDK/KLG/2026/0921": [
    {
      dept: "Bahagian Fizikal",
      status: "Pending",
      docTitle: "Kajian Keperluan Lampu Jalan — Felda Sungai Sibol Fasa 2",
      note: "Laporan belum dimulakan. Menunggu penugasan pegawai ke lokasi.",
      staff: "En. Azrul Bin Hamdan",
      date: "2026-06-23 08:00:00",
    },
    {
      dept: "Bahagian Masyarakat",
      status: "Pending",
      docTitle: "Borang Permohonan & Sokongan Penduduk — Lampu Jalan Felda Sibol",
      note: "Belum ada tindakan. Menunggu arahan daripada Penyelaras Bahagian.",
      staff: "Pn. Rohani Binti Yusof",
      date: "2026-06-23 08:00:00",
    },
  ],
};

// One row per case shown in the "Senarai Kes Aktif" table.
// Overall status is derived from how its departments are progressing:
//   "Pending"     -> no department has started yet
//   "In Progress" -> some departments have submitted, some haven't
//   "Overdue"     -> at least one department has passed its deadline
export const workStatusCases = [
  {
    ref: "PDK/KLG/2026/0912",
    title: "Pemantauan Kualiti Jalan Raya Pasca Hujan — Kluang Utara",
    subtitle: "Kluang Utara • Infrastruktur & Awam",
    arrived: "18 Jun 2026",
    deadline: "25 Jun 2026",
    status: "In Progress",
  },
  {
    ref: "PDK/KLG/2026/0905",
    title: "Aduan Bau Busuk Longkang Induk — Taman Universiti",
    subtitle: "Taman Universiti • Alam Sekitar",
    arrived: "15 Jun 2026",
    deadline: "22 Jun 2026",
    status: "In Progress",
  },
  {
    ref: "PDK/KLG/2026/0889",
    title: "Kerosakan Jambatan Kecil Sungai Bekok",
    subtitle: "Bekok • Infrastruktur & Awam",
    arrived: "05 Jun 2026",
    deadline: "12 Jun 2026",
    status: "Overdue",
  },
  {
    ref: "PDK/KLG/2026/0921",
    title: "Permohonan Penambahan Lampu Jalan — Felda Sungai Sibol",
    subtitle: "Felda Sungai Sibol • Kemudahan Awam",
    arrived: "23 Jun 2026",
    deadline: "30 Jun 2026",
    status: "Pending",
  },
];

// Display labels + short codes for each department (used in the modal timeline).
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
