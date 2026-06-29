// Dummy data for Pegawai Penyedia Laporan.
export const currentOfficer = "Amirul Haziq Abdullah";

// ─── Tasks assigned by Ketua Bahagian to this officer ───
export const assignedTasks = [
  {
    id: "TGS-2026-0211",
    caseRef: "PDK/KLG/2026/0954",
    caseTitle: "Kebocoran Paip Air Utama — Jalan Sultanah Zainab",
    kbInstruction:
      "Pegawai diarahkan untuk turun padang ke lokasi kebocoran paip air utama di Jalan Sultanah Zainab bagi menjalankan pemeriksaan fizikal dan menyediakan laporan teknikal yang lengkap. Laporan hendaklah mengandungi penilaian tahap kebocoran, anggaran kawasan terjejas, gambar bukti yang jelas dan berformat, serta cadangan tindakan segera. Laporan yang telah siap hendaklah dimuat naik ke dalam sistem e-Urus PDK untuk tindakan selanjutnya.",
    kbName: "Farid Hakimi Mohd Noor",
    dateGiven: "09 Jun 2026",
    deadline: "13 Jun 2026",
    keutamaan: "Tinggi",
  },
  {
    id: "TGS-2026-0198",
    caseRef: "PDK/KLG/2026/0941",
    caseTitle: "Pencerobohan Tanah Kerajaan — Kawasan Bukit Permai",
    kbInstruction:
      "Sila jalankan tinjauan tapak di kawasan Bukit Permai bagi mengesahkan tahap pencerobohan tanah kerajaan yang dilaporkan. Dapatkan gambar bertarikh, ukuran kawasan terjejas dan maklum balas daripada penduduk berdekatan. Laporan perlu disertakan cadangan tindakan penguatkuasaan.",
    kbName: "Nur Aisyah Rahman",
    dateGiven: "01 Jun 2026",
    deadline: "05 Jun 2026",
    keutamaan: "Tinggi",
  },
  {
    id: "TGS-2026-0203",
    caseRef: "PDK/KLG/2026/0967",
    caseTitle: "Longkang Tersumbat & Bau Hapak — Taman Sri Kluang",
    kbInstruction:
      "Jalankan pemeriksaan longkang di Taman Sri Kluang Blok D dan kenal pasti punca penyumbatan. Sertakan gambar keadaan semasa, anggaran kos pembersihan dan cadangan jangka masa penyelesaian.",
    kbName: "Hafiz Azlan Mohamad",
    dateGiven: "11 Jun 2026",
    deadline: "17 Jun 2026",
    keutamaan: "Sederhana",
  },
];

// ─── Reports this officer has already submitted back to Ketua Bahagian ───
export const submittedReports = [
  {
    id: "LPR-2026-0087",
    caseRef: "PDK/KLG/2026/0902",
    caseTitle: "Aduan Kebisingan Kilang Berhampiran Kawasan Perumahan",
    dateSubmitted: "20 Mei 2026",
    status: "Diluluskan",
    kbName: "Farid Hakimi Mohd Noor",
    feedback: "Laporan lengkap dan jelas. Diterima tanpa pembetulan.",
  },
  {
    id: "LPR-2026-0093",
    caseRef: "PDK/KLG/2026/0918",
    caseTitle: "Kerosakan Pagar Keselamatan Sekolah",
    dateSubmitted: "02 Jun 2026",
    status: "Sedang Disemak",
    kbName: "Nur Aisyah Rahman",
    feedback: "",
  },
  {
    id: "LPR-2026-0079",
    caseRef: "PDK/KLG/2026/0888",
    caseTitle: "Tumpahan Minyak di Tepi Jalan Kawasan Industri",
    dateSubmitted: "15 Mei 2026",
    status: "Perlu Pembetulan",
    kbName: "Hafiz Azlan Mohamad",
    feedback: "Sila sertakan gambar lokasi yang lebih jelas dan kemaskinikan anggaran kos pembersihan.",
  },
];

// ─── Other officers assigned to the SAME case (grouped by caseRef) ───
export const sameCaseOfficers = {
  "PDK/KLG/2026/0954": [
    { name: "Nur Syafiqah Ismail", jawatan: "Pegawai Penyedia Laporan", tugasan: "Temu bual penduduk terjejas", status: "Sedang Bertugas", lastUpdate: "21 Jun 2026" },
    { name: "Daniel Lim Wei Jian", jawatan: "Pegawai Penyedia Laporan", tugasan: "Pemeriksaan struktur paip", status: "Selesai", lastUpdate: "19 Jun 2026" },
  ],
  "PDK/KLG/2026/0941": [
    { name: "Siti Aina Mohd Noor", jawatan: "Pegawai Penyedia Laporan", tugasan: "Ukuran kawasan tanah terceroboh", status: "Menunggu Laporan", lastUpdate: "03 Jun 2026" },
    { name: "Muhammad Firdaus Rosli", jawatan: "Pegawai Penyedia Laporan", tugasan: "Rujukan rekod pemilikan tanah", status: "Laporan Dihantar", lastUpdate: "04 Jun 2026" },
  ],
  "PDK/KLG/2026/0967": [
    { name: "Nur Syafiqah Ismail", jawatan: "Pegawai Penyedia Laporan", tugasan: "Pemeriksaan saliran berdekatan", status: "Sedang Bertugas", lastUpdate: "22 Jun 2026" },
  ],
};

// ─── Laporan yang sedang dipantau/dikemaskini oleh PPL sendiri ───
export const pplLaporanData = [
  {
    ref: "PDK/KLG/2026/0954",
    aduan: "Kebocoran Paip Utama Air — Taman Sri Bahagia",
    subtitle: "Taman Sri Bahagia • Infrastruktur & Awam",
    title: "Laporan Siasatan Kebocoran Paip Utama & Kesan Kepada Penduduk",
    arrived: "20 Jun 2026",
    deadline: "26 Jun 2026",
    status: "In Progress",
    notes: "Dalam proses temu bual penduduk terjejas dan pengesahan jadual pembaikan JBA.",
  },
  {
    ref: "PDK/KLG/2026/0941",
    aduan: "Pencerobohan Tanah Simpanan Mukim Sembrong",
    subtitle: "Mukim Sembrong • Tanah & Hartanah",
    title: "Laporan Siasatan Status Pemilikan & Pencerobohan Tanah Simpanan",
    arrived: "02 Jun 2026",
    deadline: "09 Jun 2026",
    status: "Overdue",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0967",
    aduan: "Saliran Tersumbat Berhampiran Pasar Besar Kluang",
    subtitle: "Pasar Besar Kluang • Alam Sekitar",
    title: "Laporan Pemeriksaan Sistem Saliran & Risiko Banjir Kilat",
    arrived: "21 Jun 2026",
    deadline: "28 Jun 2026",
    status: "Pending",
    notes: "",
  },
  {
    ref: "PDK/KLG/2026/0903",
    aduan: "Tiang Lampu Jalan Tumbang — Jalan Kahang Lama",
    subtitle: "Kahang • Kemudahan Awam",
    title: "Laporan Penilaian Kerosakan Tiang Lampu & Cadangan Pembaikan",
    arrived: "10 Jun 2026",
    deadline: "15 Jun 2026",
    status: "Completed",
    notes: "Laporan telah disahkan dan dihantar kepada Ketua Bahagian untuk tindakan selanjutnya.",
  },
];

