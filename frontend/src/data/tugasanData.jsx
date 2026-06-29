// tugasanData.jsx
// Cases here mirror the arahanKetuaJabatanData — KB uses the same
// caseRef (which maps to kes.id in arahanKetuaJabatanData) when
// assigning work to Pegawai Penyedia Laporan.

// Cases available to pick from when creating a new tugasan.
// caseRef matches kes.id from arahanKetuaJabatanData.
export const availableCases = [
  {
    ref: "PDK/KLG/2026/0847",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
  },
  {
    ref: "PDK/KLG/2026/0831",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
  },
  {
    ref: "PDK/KLG/2026/0819",
    title: "Aduan Jalan Berlubang Kampung Melayu",
  },
];

// Pegawai Penyedia Laporan under this Ketua Bahagian's department.
export const officerList = [
  "En. Shahril Bin Hamid",
  "Pn. Norlia Binti Daud",
  "En. Zulhilmi Bin Rahmat",
  "En. Rashdan Bin Ismail",
  "Pn. Hasniza Binti Othman",
];

export const priorityLevels = ["Tinggi", "Sederhana", "Rendah"];

// Status values:
//   "Sedang Diproses" — tugasan aktif, boleh dikemaskini
//   "Selesai"         — tugasan telah selesai, tidak boleh dikemaskini
export const initialTugasanList = [
  {
    // Matches arahanKetuaJabatanData kes PDK/KLG/2026/0847
    caseRef: "PDK/KLG/2026/0847",
    caseTitle: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    officer: "En. Shahril Bin Hamid",
    instruction:
      "Pegawai diarahkan untuk turun padang ke lokasi Jambatan Kg. Sungai Kecil bagi menjalankan pemeriksaan fizikal dan menyediakan laporan teknikal yang lengkap. Laporan hendaklah mengandungi penilaian kerosakan struktur, butiran koordinat lokasi, status infrastruktur awam dan asas di tapak, anggaran kos pembaikan, serta gambar bukti yang jelas dan berformat. Laporan yang telah siap hendaklah dimuat naik ke dalam sistem e-Urus PDK untuk tindakan selanjutnya.",
    priority: "Tinggi",
    dateGiven: "07 Jun 2026",
    deadline: "13 Jun 2026",
    status: "Sedang Diproses",
  },
  {
    // Matches arahanKetuaJabatanData kes PDK/KLG/2026/0831
    caseRef: "PDK/KLG/2026/0831",
    caseTitle: "Kerosakan Lampu Isyarat Simpang Renggam",
    officer: "Pn. Norlia Binti Daud",
    instruction:
      "Sila sahkan status aduan bersama pihak JKR Daerah Kluang dan dapatkan pengesahan bertulis berkenaan tarikh anggaran pembaikan. Sertakan gambar terkini keadaan lampu isyarat dan maklum balas pengguna jalan sekitar kawasan tersebut.",
    priority: "Sederhana",
    dateGiven: "08 Jun 2026",
    deadline: "14 Jun 2026",
    status: "Sedang Diproses",
  },
  {
    // Matches arahanKetuaJabatanData kes PDK/KLG/2026/0819
    caseRef: "PDK/KLG/2026/0819",
    caseTitle: "Aduan Jalan Berlubang Kampung Melayu",
    officer: "En. Zulhilmi Bin Rahmat",
    instruction:
      "Jalankan tinjauan tapak bagi menilai tahap keparahan lubang jalan dan kesan kepada pengguna jalan raya. Laporan perlu disertakan dengan ukuran lubang, gambar bertarikh dan cadangan kaedah pembaikan segera.",
    priority: "Tinggi",
    dateGiven: "02 Jun 2026",
    deadline: "06 Jun 2026",
    status: "Sedang Diproses",
  },
  {
    // Matches arahanKetuaJabatanData kes PDK/KLG/2026/0819
    caseRef: "PDK/KLG/2026/0819",
    caseTitle: "Aduan Jalan Berlubang Kampung Melayu",
    officer: "En. Rashdan Bin Ismail",
    instruction:
      "Dapatkan maklum balas daripada Ketua Kampung Melayu berkenaan tahap kekerapan aduan penduduk dan kesan kepada keselamatan jalan raya di kawasan tersebut.",
    priority: "Rendah",
    dateGiven: "26 Mei 2026",
    deadline: "31 Mei 2026",
    status: "Selesai",
  },
];