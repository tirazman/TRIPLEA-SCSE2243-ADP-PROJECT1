export const initialDocuments = [
  {
    id: "PDK/KLG/2025/0847",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    catatan:
      "Aduan banjir kilat di Jalan Dato' Abdul Rahman. Longkang tersumbat, 45 rumah terjejas. Mohon tindakan segera pembersihan longkang dan pembaikan jalan.",
    loc: "Kluang Bandar",
    cat: "Infrastruktur & Awam",
    tarikh: "04 Jun 2025",
    akhir: "07 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    file: { name: "Aduan_Banjir_Jalan_Dato_Abdul_Rahman.pdf", size: "842 KB", type: "pdf" },
  },
  {
    id: "PDK/KLG/2025/0831",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
    catatan:
      "Lampu isyarat tidak berfungsi sejak 30 Mei 2025. Kesesakan trafik teruk, 3 kes hampir berlanggar dilaporkan.",
    loc: "Simpang Renggam",
    cat: "Kemudahan Awam",
    tarikh: "01 Jun 2025",
    akhir: "04 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    file: { name: "Aduan_Lampu_Isyarat_Simpang_Renggam.pdf", size: "615 KB", type: "pdf" },
  },
  {
    id: "PDK/KLG/2025/0819",
    title: "Aduan Jalan Berlubang Kampung Melayu",
    catatan:
      "7 lubang besar di Jalan Kampung Melayu. Berbahaya waktu malam, 3 kenderaan rosak. Minta jalan diturap semula.",
    loc: "Kluang Lama",
    cat: "Penyelenggaraan Jalan",
    tarikh: "28 Mei 2025",
    akhir: "08 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    file: { name: "Aduan_Jalan_Berlubang_Kampung_Melayu.docx", size: "428 KB", type: "docx" },
  },
  {
    id: "PDK/KLG/2025/0805",
    title: "Permohonan Pembinaan Gelanggang Badminton",
    catatan:
      "Permohonan Persatuan Penduduk Taman Kluang Indah. Gelanggang 4 kort, tanah rizab 0.4 ekar. Sokongan 350 penduduk, anggaran RM 280,000.",
    loc: "Taman Kluang Indah",
    cat: "Kemudahan Rekreasi",
    tarikh: "20 Mei 2025",
    akhir: "20 Jun 2025",
    status: "diproses",
    assignedTo: [{ tarikh: "20 Mei 2025", jabatan: ["Bahagian Fizikal", "Bahagian Masyarakat"] }],
    file: { name: "Permohonan_Gelanggang_Badminton.pdf", size: "1.2 MB", type: "pdf" },
  },
  {
    id: "PDK/KLG/2025/0792",
    title: "Aduan Bau Busuk Tapak Pembuangan Sampah",
    catatan:
      "Bau busuk dari tapak sampah sementara Kulai Jaya, radius 3 km. Penduduk alami loya dan pening kepala.",
    loc: "Kulai Jaya",
    cat: "Kebersihan & Alam Sekitar",
    tarikh: "15 Mei 2025",
    akhir: "29 Mei 2025",
    status: "selesai",
    assignedTo: [{ tarikh: "15 Mei 2025", jabatan: ["Bahagian Fizikal"] }],
    file: { name: "Aduan_Bau_Sampah_Kulai_Jaya.pdf", size: "556 KB", type: "pdf" },
  },
  {
    id: "PDK/KLG/2025/0784",
    title: "Pokok Tumbang Menghalang Jalan Raya",
    catatan:
      "Pokok ara tumbang di Bekok akibat ribut. Jalan hanya satu laluan. Selesai 13 Mei 2025 selepas pokok dibuang.",
    loc: "Bekok",
    cat: "Infrastruktur & Awam",
    tarikh: "12 Mei 2025",
    akhir: "14 Mei 2025",
    status: "selesai",
    assignedTo: [{ tarikh: "12 Mei 2025", jabatan: ["Bahagian Fizikal"] }],
    file: { name: "Laporan_Pokok_Tumbang_Bekok.pdf", size: "390 KB", type: "pdf" },
  },
];

/** Local AI engine — reads catatan + metadata (simulates reading uploaded file) */
export function janaRingkasanLokal(doc) {
  const teks = `${doc.title} ${doc.catatan} ${doc.cat} ${doc.loc}`.toLowerCase();

  const rules = [
    {
      nama: "Bahagian Fizikal",
      sebab:
        "Menguruskan hal ehwal pembangunan infrastruktur, penyelenggaraan jalan raya, sistem saliran longkang, pengurusan banjir serta fasiliti awam.",
      keywords: [
        "jalan", "lubang", "turap", "rekahan", "permukaan", "lampu isyarat", "banjir",
        "air bertakung", "longkang", "saliran", "parit", "tersumbat", "pokok tumbang",
        "infrastruktur", "pembinaan", "gelanggang", "tapak pembuangan", "sampah", "pelupusan",
      ],
      weight: 0,
    },
    {
      nama: "Bahagian Masyarakat",
      sebab:
        "Menyelaras isu-isu kebajikan komuniti setempat, aduan kesihatan awam, permohonan kemudahan rekreasi penduduk, serta persatuan taman.",
      keywords: [
        "penduduk", "persatuan", "masyarakat", "kesihatan", "loya", "pening", "bernafas",
        "sakit", "rekreasi", "taman", "gelanggang", "kemudahan", "terjejas", "rumah terjejas", "komuniti",
      ],
      weight: 0,
    },
    {
      nama: "Bahagian Pentadbiran",
      sebab:
        "Mengendalikan pengurusan dokumen, perancangan guna tanah rizab, sokongan rasmi, peruntukan kos anggaran, urusan am sistem dan koordinasi agensi.",
      keywords: [
        "permohonan", "pelan", "kos", "anggaran kos", "tanah rizab", "sokongan",
        "ditandatangani", "laporan", "rujukan", "dana", "peruntukan",
      ],
      weight: 0,
    },
  ];

  rules.forEach((r) => {
    r.keywords.forEach((kw) => {
      if (teks.includes(kw)) r.weight += 12 + kw.length;
    });

    if (r.nama === "Bahagian Fizikal") {
      if (doc.cat.includes("Jalan") || doc.cat.includes("Infrastruktur") || doc.cat.includes("Awam")) r.weight += 30;
      if (doc.cat.includes("Alam Sekitar")) r.weight += 20;
    }
    if (r.nama === "Bahagian Masyarakat") {
      if (doc.cat.includes("Rekreasi") || doc.cat.includes("Alam Sekitar")) r.weight += 30;
      if (doc.catatan.includes("penduduk") || doc.catatan.includes("terjejas")) r.weight += 20;
    }
    if (r.nama === "Bahagian Pentadbiran") {
      if (doc.catatan.includes("permohonan") || doc.catatan.includes("kos") || doc.catatan.includes("pelan")) r.weight += 25;
    }
  });

  rules.sort((a, b) => b.weight - a.weight);

  const maxW = rules[0].weight || 1;
  const cadangan_bahagian = rules.map((r, i) => ({
    nama_bahagian: r.nama,
    sebab: r.sebab,
    keyakinan: Math.min(96, Math.max(60, Math.round(65 + (r.weight / maxW) * 30) - i * 8)),
  }));

  const ringkasan = `Berdasarkan analisis fail "${doc.file.name}", aduan bertajuk "${doc.title}" diterima pada ${doc.tarikh}. ${doc.catatan.split(".")[0]}. Cadangan bahagian: ${
    cadangan_bahagian
      .filter((c) => c.keyakinan > 75)
      .map((c) => c.nama_bahagian)
      .join(" dan ") || cadangan_bahagian[0].nama_bahagian
  }. Tindakan segera diperlukan sebelum tempoh akhir ${doc.akhir}.`;

  return { ringkasan, cadangan_bahagian };
}