export const initialDocuments = [
  {
    id: "PDK/KLG/2025/0847",
    title: "Banjir Kilat — Jalan Dato' Abdul Rahman",
    loc: "Kluang Bandar",
    cat: "Infrastruktur & Awam",
    tarikh: "04 Jun 2025",
    akhir: "07 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    content:
      "Laporan aduan banjir kilat di Jalan Dato' Abdul Rahman, Kluang Bandar. Kejadian berlaku pada 03 Jun 2025 jam 4:30 petang semasa hujan lebat berlangsung selama 2 jam. Air bertakung sehingga paras lutut orang dewasa. Anggaran 45 buah rumah terjejas. Penduduk melaporkan longkang utama tersumbat dengan sampah dan mendapan lumpur. Kerosakan infrastruktur jalan dilaporkan termasuk rekahan pada permukaan jalan. Penduduk memohon tindakan segera untuk pembersihan longkang dan pembaikan jalan.",
  },
  {
    id: "PDK/KLG/2025/0831",
    title: "Kerosakan Lampu Isyarat Simpang Renggam",
    loc: "Simpang Renggam",
    cat: "Kemudahan Awam",
    tarikh: "01 Jun 2025",
    akhir: "04 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    content:
      "Aduan mengenai kerosakan lampu isyarat di persimpangan utama Simpang Renggam. Lampu isyarat telah tidak berfungsi sejak 30 Mei 2025 menyebabkan kesesakan trafik yang teruk terutamanya pada waktu puncak. Kes hampir berlanggar dilaporkan sebanyak 3 kali. Anggaran 2,000 kenderaan melalui persimpangan ini setiap hari. Pihak pengadu memohon perbaikan segera sebelum berlakunya kemalangan jalan raya.",
  },
  {
    id: "PDK/KLG/2025/0819",
    title: "Aduan Jalan Berlubang Kampung Melayu",
    loc: "Kluang Lama",
    cat: "Penyelenggaraan Jalan",
    tarikh: "28 Mei 2025",
    akhir: "08 Jun 2025",
    status: "menunggu",
    assignedTo: [],
    content:
      "Aduan jalan berlubang di Jalan Kampung Melayu, Kluang Lama. Terdapat lebih kurang 7 lubang besar dengan diameter 30–60 cm dan kedalaman 10–20 cm. Keadaan amat berbahaya terutama pada waktu malam. Sebanyak 3 kenderaan dilaporkan rosak akibat lubang tersebut. Penduduk minta jalan diturap semula atau sekurang-kurangnya ditampal dalam masa terdekat.",
  },
  {
    id: "PDK/KLG/2025/0805",
    title: "Permohonan Pembinaan Gelanggang Badminton",
    loc: "Taman Kluang Indah",
    cat: "Kemudahan Rekreasi",
    tarikh: "20 Mei 2025",
    akhir: "20 Jun 2025",
    status: "diproses",
    assignedTo: [{ tarikh: "20 Mei 2025", jabatan: ["Bahagian Fizikal", "Bahagian Masyarakat"] }],
    content:
      "Permohonan daripada Persatuan Penduduk Taman Kluang Indah untuk pembinaan gelanggang badminton tertutup berkapasiti 4 gelanggang. Kawasan cadangan seluas 0.4 ekar yang merupakan tanah rizab awam. Sokongan ditandatangani oleh 350 penduduk. Permohonan disertakan dengan pelan lakaran awal dan anggaran kos pembinaan sebanyak RM 280,000.",
  },
  {
    id: "PDK/KLG/2025/0792",
    title: "Aduan Bau Busuk Tapak Pembuangan Sampah",
    loc: "Kulai Jaya",
    cat: "Kebersihan & Alam Sekitar",
    tarikh: "15 Mei 2025",
    akhir: "29 Mei 2025",
    status: "selesai",
    assignedTo: [{ tarikh: "15 Mei 2025", jabatan: ["Bahagian Fizikal"] }],
    content:
      "Aduan bau busuk yang kuat berpunca daripada tapak pembuangan sampah sementara di Kulai Jaya. Bau dirasai dalam radius 3 km. Penduduk mengadu masalah kesihatan termasuk loya, pening kepala dan kesukaran bernafas. Laporan ini telah diselesaikan dan tapak telah dibersihkan pada 28 Mei 2025.",
  },
  {
    id: "PDK/KLG/2025/0784",
    title: "Pokok Tumbang Menghalang Jalan Raya",
    loc: "Bekok",
    cat: "Infrastruktur & Awam",
    tarikh: "12 Mei 2025",
    akhir: "14 Mei 2025",
    status: "selesai",
    assignedTo: [{ tarikh: "12 Mei 2025", jabatan: ["Bahagian Fizikal"] }],
    content:
      "Pokok ara berusia dianggarkan 50 tahun tumbang menghalang separuh jalan raya di Bekok akibat ribut. Kejadian pada 12 Mei jam 2:15 pagi. Jalan hanya boleh dilalui satu laluan. Kes diselesaikan pada 13 Mei 2025 setelah pokok dibuang dan jalan dikosongkan sepenuhnya.",
  },
];

/** Ported from your app.js — local AI engine */
export function janaRingkasanLokal(doc) {
  const teks = (doc.title + " " + doc.content + " " + doc.cat + " " + doc.loc).toLowerCase();

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
      if (doc.content.includes("penduduk") || doc.content.includes("terjejas")) r.weight += 20;
    }
    if (r.nama === "Bahagian Pentadbiran") {
      if (doc.content.includes("permohonan") || doc.content.includes("kos") || doc.content.includes("pelan")) r.weight += 25;
    }
  });

  rules.sort((a, b) => b.weight - a.weight);

  const maxW = rules[0].weight || 1;
  const cadangan_bahagian = rules.map((r, i) => ({
    nama_bahagian: r.nama,
    sebab: r.sebab,
    keyakinan: Math.min(96, Math.max(60, Math.round(65 + (r.weight / maxW) * 30) - i * 8)),
  }));

  const statusLabel =
    {
      menunggu: "masih menunggu tindakan",
      diproses: "sedang dalam proses tindakan",
      selesai: "telah diselesaikan",
    }[doc.status] || "";

  const urgency =
    doc.status === "menunggu"
      ? " Tindakan segera diperlukan bagi mengelakkan isu ini daripada meruncing."
      : "";

  const ringkasan = `Aduan bertajuk "${doc.title}" diterima daripada kawasan ${doc.loc} pada ${doc.tarikh} di bawah kategori ${doc.cat}. ${doc.content.split(".")[0]}. Kes ini ${statusLabel} dan dicadangkan untuk dikendalikan oleh ${
    cadangan_bahagian
      .filter((c) => c.keyakinan > 75)
      .map((c) => c.nama_bahagian)
      .join(" dan ") || cadangan_bahagian[0].nama_bahagian
  }.${urgency}`;

  return { ringkasan, cadangan_bahagian };
}