-- ═══════════════════════════════════════════════════════════
-- schema.sql — e-Urus PDK
-- Fresh-install version: run this on an EMPTY MySQL server to
-- create the full database from scratch (structure + seed data).
--
-- If you already have an eUrusDB with the old structure, do NOT
-- run this — use migration_v2.sql instead to upgrade in place.
-- ═══════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS eUrusDB;
USE eUrusDB;

-- Table for User
CREATE TABLE IF NOT EXISTS User (
    userID VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role ENUM('KetuaJabatan', 'KetuaBahagian', 'PegawaiPenyediaLaporan', 'PegawaiPenyelarasBahagian', 'PembantuTadbir') NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO User (userID, name, role, username, password, email) VALUES
('U001', 'Zulkifli Hasan', 'PegawaiPenyelarasBahagian', 'zulkiflihasan', 'password', 'zulkiflihasan@pdk.my'),
('U002', 'Hj. Rashdan bin Ismail', 'KetuaJabatan', 'rashdanismail', 'password', 'rashdanismail@pdk.my'),
('U003', 'Aisyah binti Ahmad', 'PembantuTadbir', 'aisyahahmad', 'password', 'aisyahahmad@pdk.my'),
('U004', 'Amirul Haziq Abdullah', 'PegawaiPenyediaLaporan', 'amirulhaziq', 'password', 'amirulhaziq@pdk.my'),
('U005', 'Mohd. Faizal bin Mohd. Yusof', 'KetuaBahagian', 'faizalyusof', 'password', 'faizalyusof@pdk.my'),
('U006', 'Nur Syafiqah Ismail', 'PegawaiPenyediaLaporan', 'syafiqahismail', 'password', 'syafiqahismail@pdk.my'),
('U007', 'Daniel Lim Wei Jian', 'PegawaiPenyediaLaporan', 'daniellim', 'password', 'daniellim@pdk.my');

-- Table for Department
CREATE TABLE IF NOT EXISTS Department (
    deptID VARCHAR(30) PRIMARY KEY,
    deptName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO Department (deptID, deptName) VALUES
('D001', 'Bahagian Fizikal'),
('D002', 'Bahagian Masyarakat'),
('D003', 'Bahagian Pentadbiran');

-- Table for Document — central record shared by ALL roles (PT creates it,
-- KJ/KB/PPL/PPB all read & update the SAME row as the case progresses)
CREATE TABLE IF NOT EXISTS Document (
    refNo VARCHAR(30) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    category VARCHAR(50) NULL,
    location VARCHAR(100) NULL,
    complainantName VARCHAR(100) NULL,
    priority ENUM('Tinggi', 'Sederhana', 'Rendah') NOT NULL DEFAULT 'Sederhana',
    submittedBy VARCHAR(30),
    FOREIGN KEY (submittedBy) REFERENCES User(userID),
    submissionDate DATE NOT NULL,
    deadline DATE NULL,
    aiSummary TEXT NULL,
    status ENUM('Didaftar', 'Menunggu Semakan KJ', 'Diagihkan', 'Dalam Tindakan', 'Selesai') NOT NULL DEFAULT 'Didaftar',
    attachmentPath VARCHAR(255) NULL
) ENGINE=InnoDB;

-- Table for DocumentDepartment — a Document can be assigned to MULTIPLE
-- departments at once (many-to-many), each tracked separately
CREATE TABLE IF NOT EXISTS DocumentDepartment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refNo VARCHAR(30) NOT NULL,
    FOREIGN KEY (refNo) REFERENCES Document(refNo),
    deptID VARCHAR(30) NOT NULL,
    FOREIGN KEY (deptID) REFERENCES Department(deptID),
    assignedOfficer VARCHAR(30) NULL,
    FOREIGN KEY (assignedOfficer) REFERENCES User(userID),
    assignedAt DATE NOT NULL,
    status ENUM('Belum Mula', 'Sedang Diproses', 'Dihantar') NOT NULL DEFAULT 'Belum Mula',
    UNIQUE KEY unique_doc_dept (refNo, deptID)
) ENGINE=InnoDB;

-- Table for Report — PPL's submitted report for one department on one Document
CREATE TABLE IF NOT EXISTS Report (
    reportID VARCHAR(30) PRIMARY KEY,
    refNo VARCHAR(30),
    FOREIGN KEY (refNo) REFERENCES Document(refNo),
    deptID VARCHAR(30),
    FOREIGN KEY (deptID) REFERENCES Department(deptID),
    officerID VARCHAR(30) NULL,
    FOREIGN KEY (officerID) REFERENCES User(userID),
    submittedAt DATE NOT NULL,
    reportDetails TEXT NULL,
    kbFeedback TEXT NULL,
    status ENUM('Sedang Disediakan', 'Sedang Disemak', 'Diluluskan', 'Perlu Pembetulan') NOT NULL DEFAULT 'Sedang Disediakan'
) ENGINE=InnoDB;

-- Table for CompileReport — PPB's consolidated report covering ALL
-- departments' reports for one Document
CREATE TABLE IF NOT EXISTS CompileReport (
    compileID VARCHAR(30) PRIMARY KEY,
    refNo VARCHAR(30) NOT NULL,
    FOREIGN KEY (refNo) REFERENCES Document(refNo),
    finalizedBy VARCHAR(30),
    FOREIGN KEY (finalizedBy) REFERENCES User(userID),
    compileAt DATE NOT NULL,
    finalSummary TEXT NULL
) ENGINE=InnoDB;

-- ═══ Seed data: 5 example cases covering each stage of the workflow ═══

-- CASE 1: Menunggu Semakan KJ
INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status)
VALUES ('PDK/KLG/2026/0001', 'Kerosakan Jambatan Kg. Sungai Kecil',
'Aduan diterima daripada orang awam berkenaan kerosakan struktur jambatan di Kg. Sungai Kecil yang berpotensi menjejaskan keselamatan pengguna jalan raya.',
'Infrastruktur Awam', 'Kg. Sungai Kecil, Jalan Persekutuan A3', 'Ahmad Fauzi bin Sulaiman', 'Tinggi',
'U003', '2026-06-06', '2026-06-09',
'Aduan melibatkan kerosakan struktur jambatan yang berpotensi menjejaskan keselamatan awam. Terdapat retak pada tiang penyangga dan papan jambatan yang usang.',
'Menunggu Semakan KJ');

-- CASE 2: Diagihkan ke 3 bahagian
INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status)
VALUES ('PDK/KLG/2026/0002', 'Banjir Kilat — Jalan Dato\' Abdul Rahman',
'Banjir kilat menjejaskan kawasan perniagaan dan perumahan di sekitar Jalan Dato\' Abdul Rahman.',
'Bencana Awam', 'Jalan Dato\' Abdul Rahman, Kluang Bandar', 'Siti Hajar binti Kamarudin', 'Tinggi',
'U003', '2026-06-05', '2026-06-08',
'Kejadian banjir kilat di kawasan bandar melibatkan lebih 300 penduduk terjejas. Punca dipercayai longkang tersumbat.',
'Diagihkan');

INSERT INTO DocumentDepartment (refNo, deptID, assignedAt, status) VALUES
('PDK/KLG/2026/0002', 'D001', '2026-06-05', 'Belum Mula'),
('PDK/KLG/2026/0002', 'D002', '2026-06-05', 'Belum Mula'),
('PDK/KLG/2026/0002', 'D003', '2026-06-05', 'Belum Mula');

-- CASE 3: Dalam Tindakan — PPL tengah sediakan laporan
INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status)
VALUES ('PDK/KLG/2026/0003', 'Kebocoran Paip Utama — Jalan Sultanah Zainab',
'Paip air utama dilaporkan bocor teruk menyebabkan gangguan bekalan air.',
'Utiliti Awam', 'Jalan Sultanah Zainab', 'Noraini binti Yaakob', 'Rendah',
'U003', '2026-06-09', '2026-06-13',
'Kebocoran paip utama mengakibatkan gangguan bekalan air. Koordinasi dengan pihak berkuasa air diperlukan.',
'Dalam Tindakan');

INSERT INTO DocumentDepartment (refNo, deptID, assignedOfficer, assignedAt, status) VALUES
('PDK/KLG/2026/0003', 'D001', 'U004', '2026-06-09', 'Sedang Diproses');

INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, kbFeedback, status)
VALUES ('LPR-2026-0001', 'PDK/KLG/2026/0003', 'D001', 'U004', '2026-06-09', NULL, NULL, 'Sedang Disediakan');

-- CASE 4: Dalam Tindakan — Report diluluskan, tunggu PPB compile
INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status)
VALUES ('PDK/KLG/2026/0004', 'Pemantauan Kualiti Jalan Raya Pasca Hujan — Kluang Utara',
'Pemantauan keadaan jalan raya selepas hujan lebat di kawasan Kluang Utara.',
'Infrastruktur & Awam', 'Kluang Utara, Seksyen 3', NULL, 'Tinggi',
'U003', '2026-06-18', '2026-06-25',
'Pemantauan rutin mengesan retak permukaan dan longkang tersumbat di kawasan Kluang Utara.',
'Dalam Tindakan');

INSERT INTO DocumentDepartment (refNo, deptID, assignedOfficer, assignedAt, status) VALUES
('PDK/KLG/2026/0004', 'D001', 'U004', '2026-06-18', 'Dihantar');

INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, kbFeedback, status)
VALUES ('LPR-2026-0002', 'PDK/KLG/2026/0004', 'D001', 'U004', '2026-06-20',
'Retak permukaan ±120m, longkang tersumbat. Anggaran kos pembaikan RM45,000.',
'Laporan lengkap dan jelas. Diterima tanpa pembetulan.', 'Diluluskan');

-- CASE 5: Selesai — full flow, semua bahagian dah hantar, PPB dah compile
INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status)
VALUES ('PDK/KLG/2026/0005', 'Kerosakan Jambatan Kecil Sungai Bekok',
'Longsor tanah menyebabkan sebahagian jambatan kecil runtuh di Sungai Bekok.',
'Infrastruktur & Awam', 'Sungai Bekok, KM 7', 'Hairul Nizam bin Othman', 'Tinggi',
'U003', '2026-06-05', '2026-06-12',
'Kerosakan jambatan berisiko tinggi kemalangan jika tidak ditangani segera.',
'Selesai');

INSERT INTO DocumentDepartment (refNo, deptID, assignedOfficer, assignedAt, status) VALUES
('PDK/KLG/2026/0005', 'D001', 'U004', '2026-06-05', 'Dihantar'),
('PDK/KLG/2026/0005', 'D002', 'U006', '2026-06-05', 'Dihantar'),
('PDK/KLG/2026/0005', 'D003', 'U007', '2026-06-05', 'Dihantar');

INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, kbFeedback, status) VALUES
('LPR-2026-0003', 'PDK/KLG/2026/0005', 'D001', 'U004', '2026-06-05', 'Lokasi Sungai Bekok KM 7, jambatan retak, perlu pembaikan segera.', 'Diterima.', 'Diluluskan'),
('LPR-2026-0004', 'PDK/KLG/2026/0005', 'D002', 'U006', '2026-06-05', 'Penduduk terjejas ±85 orang / 22 isi rumah.', 'Diterima.', 'Diluluskan'),
('LPR-2026-0005', 'PDK/KLG/2026/0005', 'D003', 'U007', '2026-06-05', 'Tahap ancaman tinggi (Tahap 3), laluan disekat sementara.', 'Diterima.', 'Diluluskan');

INSERT INTO CompileReport (compileID, refNo, finalizedBy, compileAt, finalSummary)
VALUES ('CMP-2026-0001', 'PDK/KLG/2026/0005', 'U001', '2026-06-13',
'Laporan daripada ketiga-tiga bahagian (Fizikal, Masyarakat, Pentadbiran) telah disahkan dan diselaraskan. Maklumbalas telah dihantar kepada pemohon.');
