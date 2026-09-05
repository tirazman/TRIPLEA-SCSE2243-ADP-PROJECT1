-- ═══════════════════════════════════════════════════════════
-- migration_v2.sql
-- Run this ONCE on your existing eUrusDB to bring it up to date.
-- Safe to run on a database that already has the original 5 dummy
-- users (U001-U005) — this script only adds/restructures tables,
-- it does not drop your existing User/Department/Document/Report
-- data (except the unused InformationRequest table).
-- ═══════════════════════════════════════════════════════════

USE eUrusDB;

-- ═══ 0. Drop InformationRequest — confirmed unused in any route/controller/frontend ═══
DROP TABLE IF EXISTS InformationRequest;

-- ═══ 1. Seed 3 Bahagian ═══
INSERT INTO Department (deptID, deptName) VALUES
('D001', 'Bahagian Fizikal'),
('D002', 'Bahagian Masyarakat'),
('D003', 'Bahagian Pentadbiran');

-- ═══ 2. Extend Document — tambah field, buang deptID (jadi many-to-many) ═══
ALTER TABLE Document
    DROP FOREIGN KEY document_ibfk_2,
    DROP COLUMN deptID,
    ADD COLUMN title VARCHAR(150) NOT NULL AFTER refNo,
    ADD COLUMN description TEXT NULL AFTER title,
    ADD COLUMN category VARCHAR(50) NULL AFTER description,
    ADD COLUMN location VARCHAR(100) NULL AFTER category,
    ADD COLUMN complainantName VARCHAR(100) NULL AFTER location,
    ADD COLUMN priority ENUM('Tinggi', 'Sederhana', 'Rendah') NOT NULL DEFAULT 'Sederhana' AFTER complainantName,
    ADD COLUMN deadline DATE NULL AFTER submissionDate,
    ADD COLUMN aiSummary TEXT NULL AFTER deadline,
    ADD COLUMN attachmentPath VARCHAR(255) NULL,
    MODIFY COLUMN status ENUM('Didaftar', 'Menunggu Semakan KJ', 'Diagihkan', 'Dalam Tindakan', 'Selesai') NOT NULL DEFAULT 'Didaftar';

-- ═══ 3. Table baru: DocumentDepartment (many-to-many Document <-> Department) ═══
CREATE TABLE IF NOT EXISTS DocumentDepartment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refNo VARCHAR(30) NOT NULL,
    FOREIGN KEY (refNo) REFERENCES Document(refNo),
    deptID VARCHAR(30) NOT NULL,
    FOREIGN KEY (deptID) REFERENCES Department(deptID),
    assignedAt DATE NOT NULL,
    status ENUM('Belum Mula', 'Sedang Diproses', 'Dihantar') NOT NULL DEFAULT 'Belum Mula',
    UNIQUE KEY unique_doc_dept (refNo, deptID)
) ENGINE=InnoDB;

-- ═══ 4. Extend Report — tambah officer, butiran laporan, feedback KB ═══
ALTER TABLE Report
    ADD COLUMN officerID VARCHAR(30) NULL AFTER deptID,
    ADD CONSTRAINT fk_report_officer FOREIGN KEY (officerID) REFERENCES User(userID),
    ADD COLUMN reportDetails TEXT NULL,
    ADD COLUMN kbFeedback TEXT NULL,
    ADD COLUMN status ENUM('Sedang Disediakan', 'Sedang Disemak', 'Diluluskan', 'Perlu Pembetulan') NOT NULL DEFAULT 'Sedang Disediakan';

-- ═══ 5. Fix CompileReport — link ke Document (bukan 1 Report tunggal) ═══
ALTER TABLE CompileReport
    DROP FOREIGN KEY compilereport_ibfk_1,
    DROP COLUMN reportID,
    ADD COLUMN refNo VARCHAR(30) NOT NULL AFTER compileID,
    ADD CONSTRAINT fk_compile_document FOREIGN KEY (refNo) REFERENCES Document(refNo),
    ADD COLUMN finalSummary TEXT NULL;

-- ═══ 6. Tambah 2 PPL baru (supaya setiap bahagian ada pegawai sendiri) ═══
INSERT INTO User (userID, name, role, username, password, email) VALUES
('U006', 'Nur Syafiqah Ismail', 'PegawaiPenyediaLaporan', 'syafiqahismail', 'password', 'syafiqahismail@pdk.my'),
('U007', 'Daniel Lim Wei Jian', 'PegawaiPenyediaLaporan', 'daniellim', 'password', 'daniellim@pdk.my');

-- ═══ 7. Seed data: 5 contoh case merentasi semua stage flow ═══

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

INSERT INTO DocumentDepartment (refNo, deptID, assignedAt, status) VALUES
('PDK/KLG/2026/0003', 'D001', '2026-06-09', 'Sedang Diproses');

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

INSERT INTO DocumentDepartment (refNo, deptID, assignedAt, status) VALUES
('PDK/KLG/2026/0004', 'D001', '2026-06-18', 'Dihantar');

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

INSERT INTO DocumentDepartment (refNo, deptID, assignedAt, status) VALUES
('PDK/KLG/2026/0005', 'D001', '2026-06-05', 'Dihantar'),
('PDK/KLG/2026/0005', 'D002', '2026-06-05', 'Dihantar'),
('PDK/KLG/2026/0005', 'D003', '2026-06-05', 'Dihantar');

INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, kbFeedback, status) VALUES
('LPR-2026-0003', 'PDK/KLG/2026/0005', 'D001', 'U004', '2026-06-05', 'Lokasi Sungai Bekok KM 7, jambatan retak, perlu pembaikan segera.', 'Diterima.', 'Diluluskan'),
('LPR-2026-0004', 'PDK/KLG/2026/0005', 'D002', 'U006', '2026-06-05', 'Penduduk terjejas ±85 orang / 22 isi rumah.', 'Diterima.', 'Diluluskan'),
('LPR-2026-0005', 'PDK/KLG/2026/0005', 'D003', 'U007', '2026-06-05', 'Tahap ancaman tinggi (Tahap 3), laluan disekat sementara.', 'Diterima.', 'Diluluskan');

INSERT INTO CompileReport (compileID, refNo, finalizedBy, compileAt, finalSummary)
VALUES ('CMP-2026-0001', 'PDK/KLG/2026/0005', 'U001', '2026-06-13',
'Laporan daripada ketiga-tiga bahagian (Fizikal, Masyarakat, Pentadbiran) telah disahkan dan diselaraskan. Maklumbalas telah dihantar kepada pemohon.');
