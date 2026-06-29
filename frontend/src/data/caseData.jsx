
// caseData.jsx
// submittedCount = berapa bahagian dah submit
// totalDepts     = berapa bahagian diperlukan (3 = Fizikal + Masyarakat + Pentadbiran)
// Konsolidasi AI hanya boleh dimulakan bila submittedCount === totalDepts

export const caseList = [
  {
    ref: "PDK/KLG/2026/0847",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    subtitle: "Kluang Bandar • Infrastruktur & Awam",
    tarikhTerima: "04 Jun 2026",
    tempohAkhir: "07 Jun 2026",
    overdue: false,
    keutamaan: "Tinggi",
    submittedCount: 3,
    totalDepts: 3,
  },
  {
    ref: "PDK/KLG/2026/0831",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
    subtitle: "Simpang Renggam • Kemudahan Awam",
    tarikhTerima: "01 Jun 2026",
    tempohAkhir: "04 Jun 2026",
    overdue: true,
    keutamaan: "Sederhana",
    submittedCount: 2,
    totalDepts: 3,
  },
  {
    ref: "PDK/KLG/2026/0819",
    title: "Aduan Jalan Berlubang Kampung Melayu",
    subtitle: "Kluang Lama • Penyelenggaraan Jalan",
    tarikhTerima: "28 Mei 2026",
    tempohAkhir: "08 Jun 2026",
    overdue: false,
    keutamaan: "Rendah",
    submittedCount: 1,
    totalDepts: 3,
  },
];

export const departmentReports = [
  {
    id: "fizikal",
    deptClass: "dept-fizikal",
    name: "Bahagian Fizikal",
    subtitle: "Infrastruktur, Kos & Tapak",
    submitted: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
    infoRows: [
      ["Pegawai Penyedia", "Mohd Hafizuddin bin Sulaiman"],
      ["Tarikh Laporan", "03 Jun 2026"],
      ["Lokasi Insiden", "Jalan Dato' Abdul Rahman, Kluang"],
      ["Anggaran Kos", "RM 148,500.00"],
      ["Status Infrastruktur", "Jambatan retak, longkang tersumbat ±60m"],
    ],
    attachments: [
      { name: "Laporan_Fizikal_PDK0847.pdf", type: "pdf" },
      { name: "Gambar_Tapak_Banjir_01-05.jpg", type: "image" },
    ],
  },
  {
    id: "masyarakat",
    deptClass: "dept-masyarakat",
    name: "Bahagian Masyarakat",
    subtitle: "Aduan Awam & Impak Komuniti",
    submitted: true,
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </>
    ),
    infoRows: [
      ["Pegawai Penyedia", "Nur Farah binti Izzati"],
      ["Tarikh Laporan", "03 Jun 2026"],
      ["Bilangan Aduan", "34 aduan diterima"],
      ["Penduduk Terjejas", "±312 orang / 78 isi rumah"],
    ],
    attachments: [{ name: "Laporan_Masyarakat_PDK0847.pdf", type: "pdf" }],
  },
  {
    id: "pentadbiran",
    deptClass: "dept-pentadbiran",
    name: "Bahagian Pentadbiran",
    subtitle: "Bencana & Keselamatan",
    submitted: true,
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    infoRows: [
      ["Pegawai Penyedia", "Azri Faisal bin Nordin"],
      ["Tarikh Laporan", "03 Jun 2026"],
      ["Tahap Ancaman", "Sederhana Tinggi (Tahap 2)"],
    ],
    attachments: [{ name: "Laporan_Keselamatan_PDK0847.pdf", type: "pdf" }],
  },
];

// Per-case department submission tracking
// submittedDepts lists which dept IDs have submitted for that case
export const caseDeptSubmissions = {
  "PDK/KLG/2026/0847": ["fizikal", "masyarakat", "pentadbiran"], // semua 3 submit
  "PDK/KLG/2026/0831": ["fizikal", "masyarakat"],                // 2/3 submit
  "PDK/KLG/2026/0819": ["fizikal"],                              // 1/3 submit
};

export const STRATEGI_MAPPING = [
  { pct: 15, msg: "Membaca laporan Bahagian Fizikal..." },
  { pct: 35, msg: "Menganalisis data empirikal Bahagian Masyarakat..." },
  { pct: 60, msg: "Memproses parameter keselamatan Bahagian Pentadbiran..." },
  { pct: 80, msg: "Menggabungkan aset multimedia dan tabular..." },
  { pct: 95, msg: "Menyelaraskan struktur format dokumen rasmi..." },
  { pct: 100, msg: "Konsolidasi selesai. Menjana draf Word..." },
];


