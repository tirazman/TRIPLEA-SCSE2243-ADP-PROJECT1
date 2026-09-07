-- ═══════════════════════════════════════════════════════════
-- schema.sql — e-Urus PDK
-- Fresh-install version: run this on an EMPTY MySQL server to
-- create the full database from scratch (structure + seed data).
--
-- If you already have an eUrusDB with the old structure, do NOT
-- run this — use migration_v2.sql instead to upgrade in place.
--
-- Synced from HeidiSQL export (e-urus-pdk-sql.sql) on 2026-09-07.
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
-- departments at once (many-to-many), each tracked separately.
-- NOTE: `instruction` column added — free-text instruction from KB/PPB
-- to the assigned officer for this department's portion of the case.
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
    instruction TEXT NULL,
    UNIQUE KEY unique_doc_dept (refNo, deptID)
) ENGINE=InnoDB AUTO_INCREMENT=63;

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

-- ═══ Seed data: synced 1:1 from the current HeidiSQL export (31 cases,
-- covering every stage of the workflow, with real assigned officers,
-- department instructions, reports and compiled reports as of 2026-09-07) ═══

INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, aiSummary, status, attachmentPath) VALUES
	('PDK/KLG/2026/0001', 'Longkang Tersumbat — Taman Sri Aman', 'Longkang utama tersumbat menyebabkan air bertakung.', 'Infrastruktur Awam', 'Taman Sri Aman', 'Rosli bin Ahmad', 'Sederhana', 'U003', '2026-09-01', '2026-10-15', NULL, 'Didaftar', NULL),
	('PDK/KLG/2026/0002', 'Bekalan Air Terputus — Kampung Paya', 'Bekalan air terputus lebih 2 hari.', 'Utiliti Awam', 'Kampung Paya', 'Zainab binti Musa', 'Tinggi', 'U003', '2026-09-02', '2026-10-10', NULL, 'Didaftar', NULL),
	('PDK/KLG/2026/0003', 'Pokok Tumbang — Jalan Besar Bandar', 'Pokok tumbang menghalang separuh jalan.', 'Infrastruktur Awam', 'Jalan Besar Bandar', 'Hafiz bin Omar', 'Sederhana', 'U003', '2026-09-03', '2026-10-05', NULL, 'Didaftar', NULL),
	('PDK/KLG/2026/0004', 'Kemalangan Jalan Berlubang — Jalan Kluang-Ayer Hitam', 'Beberapa kemalangan kecil akibat lubang jalan.', 'Infrastruktur Awam', 'Jalan Kluang-Ayer Hitam', 'Faridah binti Salleh', 'Tinggi', 'U003', '2026-09-01', '2026-10-20', NULL, 'Menunggu Semakan KJ', NULL),
	('PDK/KLG/2026/0005', 'Longkang Berbau — Taman Bahagia', 'Bau busuk berterusan dari longkang berhampiran rumah.', 'Alam Sekitar', 'Taman Bahagia', 'Kamal bin Yusuf', 'Sederhana', 'U003', '2026-09-02', '2026-10-18', NULL, 'Menunggu Semakan KJ', NULL),
	('PDK/KLG/2026/0006', 'Permohonan Lampu Jalan — Felda Redong', 'Permohonan penambahan lampu jalan kawasan gelap.', 'Kemudahan Awam', 'Felda Redong', 'Suzana binti Ismail', 'Rendah', 'U003', '2026-09-03', '2026-10-25', NULL, 'Menunggu Semakan KJ', NULL),
	('PDK/KLG/2026/0007', 'Kerosakan Perparitan — Jalan Kahang Lama', 'Parit rosak menyebabkan air melimpah ke jalan.', 'Infrastruktur Awam', 'Jalan Kahang Lama', 'Anuar bin Zakaria', 'Sederhana', 'U003', '2026-08-20', '2026-10-12', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0008', 'Runtuhan Tebing Sungai — Kampung Machap', 'Tebing sungai runtuh berhampiran kawasan perumahan.', 'Bahaya Awam', 'Kampung Machap', 'Halimah binti Daud', 'Tinggi', 'U003', '2026-08-21', '2026-10-14', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0009', 'Longkang Tersumbat — Taman Kluang Barat', 'Longkang tersumbat sampah, risiko banjir kilat.', 'Alam Sekitar', 'Taman Kluang Barat', 'Ismail bin Hashim', 'Sederhana', 'U003', '2026-08-22', '2026-10-16', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0010', 'Lampu Jalan Rosak — Simpang Bekok', 'Beberapa tiang lampu jalan tidak berfungsi.', 'Kemudahan Awam', 'Simpang Bekok', 'Ramlah binti Aziz', 'Rendah', 'U003', '2026-08-23', '2026-10-18', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0011', 'Jalan Berlubang — Jalan Sultan Ismail', 'Lubang besar berhampiran simpang utama.', 'Infrastruktur Awam', 'Jalan Sultan Ismail', 'Zulkarnain bin Latif', 'Tinggi', 'U003', '2026-08-24', '2026-10-20', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0012', 'Kerosakan Jambatan Kecil — Sungai Semberong', 'Struktur jambatan kecil retak.', 'Infrastruktur Awam', 'Sungai Semberong', 'Norain binti Kassim', 'Tinggi', 'U003', '2026-08-25', '2026-10-22', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0013', 'Banjir Kilat — Taman Seri Kluang', 'Banjir kilat berulang selepas hujan lebat.', 'Bencana Awam', 'Taman Seri Kluang', 'Farid bin Osman', 'Tinggi', 'U003', '2026-08-26', '2026-10-24', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0014', 'Longkang Rosak — Jalan Mersing Lama', 'Longkang konkrit pecah sepanjang 20 meter.', 'Infrastruktur Awam', 'Jalan Mersing Lama', 'Aminah binti Bakar', 'Sederhana', 'U003', '2026-08-15', '2026-10-26', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0015', 'Tiang Elektrik Senget — Kampung Peta', 'Tiang elektrik senget selepas ribut.', 'Utiliti Awam', 'Kampung Peta', 'Shahrul bin Nizam', 'Tinggi', 'U003', '2026-08-16', '2026-10-28', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0016', 'Jambatan Kayu Reput — Sungai Layang', 'Jambatan kayu penghubung kampung reput teruk.', 'Infrastruktur Awam', 'Sungai Layang', 'Rohana binti Idris', 'Sederhana', 'U003', '2026-08-17', '2026-10-30', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0017', 'Pencemaran Sungai — Kawasan Perindustrian Kluang', 'Air sungai bertukar warna, disyaki tumpahan kimia.', 'Alam Sekitar', 'Kawasan Perindustrian Kluang', 'Nasir bin Talib', 'Tinggi', 'U003', '2026-08-10', '2026-11-05', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0018', 'Kebakaran Semak — Ladang Kelapa Sawit Bekok', 'Kebakaran semak berhampiran ladang, risiko merebak.', 'Bahaya Awam', 'Ladang Kelapa Sawit Bekok', 'Wahida binti Rahim', 'Tinggi', 'U003', '2026-08-11', '2026-11-08', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0019', 'Aduan Bau Kilang — Kawasan Simpang Renggam', 'Bau kimia kuat dari kawasan kilang berhampiran.', 'Alam Sekitar', 'Simpang Renggam', 'Johan bin Kadir', 'Sederhana', 'U003', '2026-08-12', '2026-11-10', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0020', 'Kerosakan Sistem Perparitan Utama — Bandar Kluang', 'Sistem perparitan utama tersumbat menyeluruh.', 'Infrastruktur Awam', 'Bandar Kluang', 'Salmah binti Yaakob', 'Tinggi', 'U003', '2026-08-13', '2026-11-12', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0021', 'Tanah Runtuh — Kawasan Bukit Gambir', 'Tanah runtuh menghalang laluan utama.', 'Bahaya Awam', 'Bukit Gambir', 'Rahim bin Salleh', 'Tinggi', 'U003', '2026-08-14', '2026-11-14', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0022', 'Pencerobohan Tanah Simpanan — Mukim Mengkibol', 'Pencerobohan tanah simpanan kerajaan.', 'Tanah & Hartanah', 'Mukim Mengkibol', 'Yusof bin Ahmad', 'Sederhana', 'U003', '2026-08-15', '2026-11-16', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0023', 'Kemudahan Awam Rosak — Taman Rekreasi Kluang', 'Kemudahan taman rosak dan berbahaya.', 'Kemudahan Awam', 'Taman Rekreasi Kluang', 'Sofia binti Rashid', 'Sederhana', 'U003', '2026-08-16', '2026-11-18', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0024', 'Bekalan Elektrik Terganggu — Felda Sungai Sibol', 'Bekalan elektrik terputus berulang kali.', 'Utiliti Awam', 'Felda Sungai Sibol', 'Amir bin Zulkifli', 'Tinggi', 'U003', '2026-08-17', '2026-11-20', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0025', 'Kerosakan Tembok Penahan — Jalan Paloh', 'Tembok penahan bumi retak, risiko runtuh.', 'Infrastruktur Awam', 'Jalan Paloh', 'Latifah binti Karim', 'Sederhana', 'U003', '2026-08-28', '2026-11-25', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0026', 'Kerosakan Pagar Sekolah — Kampung Peserai', 'Pagar sekolah roboh selepas ribut.', 'Kemudahan Awam', 'Kampung Peserai', 'Hasnah binti Malek', 'Sederhana', 'U003', '2026-08-29', '2026-11-28', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0027', 'Kesesakan Trafik Waktu Puncak — Simpang Machap', 'Kesesakan teruk waktu puncak pagi/petang.', 'Infrastruktur Awam', 'Simpang Machap', 'Rizal bin Hamid', 'Rendah', 'U003', '2026-08-30', '2026-12-01', NULL, 'Dalam Tindakan', NULL),
	('PDK/KLG/2026/0028', 'Papan Tanda Rosak — Jalan Kluang-Yong Peng', 'Papan tanda jalan tumbang, risiko kepada pemandu.', 'Kemudahan Awam', 'Jalan Kluang-Yong Peng', 'Suraya binti Jamil', 'Rendah', 'U003', '2026-08-31', '2026-12-05', NULL, 'Diagihkan', NULL),
	('PDK/KLG/2026/0029', 'Kerosakan Jambatan Utama — Sungai Bekok', 'Jambatan utama retak, dah disahkan selamat lepas pembaikan.', 'Infrastruktur & Awam', 'Sungai Bekok', 'Hairul Nizam bin Othman', 'Tinggi', 'U003', '2026-08-05', '2026-09-10', NULL, 'Selesai', NULL),
	('PDK/KLG/2026/0030', 'Kemusnahan Struktur Dewan Komuniti — Kampung Sri Lalang', 'Bumbung dewan komuniti runtuh akibat angin kencang.', 'Kemudahan Awam', 'Kampung Sri Lalang', 'Aziz bin Rahman', 'Tinggi', 'U003', '2026-08-06', '2026-09-15', NULL, 'Selesai', NULL),
	('PDK/KLG/2026/0031', 'Aduan Longkang Tersumbat Kronik — Taman Kluang Perdana', 'Longkang tersumbat berulang selama 6 bulan.', 'Alam Sekitar', 'Taman Kluang Perdana', 'Salina binti Yusof', 'Sederhana', 'U003', '2026-08-07', '2026-09-18', NULL, 'Selesai', NULL);

INSERT INTO DocumentDepartment (id, refNo, deptID, assignedOfficer, assignedAt, status, instruction) VALUES
	(13, 'PDK/KLG/2026/0007', 'D001', NULL, '2026-08-20', 'Belum Mula', NULL),
	(14, 'PDK/KLG/2026/0008', 'D001', NULL, '2026-08-21', 'Belum Mula', NULL),
	(15, 'PDK/KLG/2026/0009', 'D001', NULL, '2026-08-22', 'Belum Mula', NULL),
	(16, 'PDK/KLG/2026/0010', 'D001', NULL, '2026-08-23', 'Belum Mula', NULL),
	(17, 'PDK/KLG/2026/0011', 'D001', 'U004', '2026-08-24', 'Sedang Diproses', NULL),
	(18, 'PDK/KLG/2026/0012', 'D001', 'U004', '2026-08-25', 'Sedang Diproses', NULL),
	(19, 'PDK/KLG/2026/0013', 'D001', 'U004', '2026-08-26', 'Sedang Diproses', NULL),
	(20, 'PDK/KLG/2026/0014', 'D001', 'U004', '2026-08-15', 'Dihantar', NULL),
	(21, 'PDK/KLG/2026/0015', 'D001', 'U004', '2026-08-16', 'Dihantar', NULL),
	(22, 'PDK/KLG/2026/0016', 'D001', 'U004', '2026-08-17', 'Dihantar', NULL),
	(23, 'PDK/KLG/2026/0017', 'D001', 'U004', '2026-08-11', 'Dihantar', NULL),
	(24, 'PDK/KLG/2026/0017', 'D002', 'U006', '2026-08-11', 'Dihantar', NULL),
	(25, 'PDK/KLG/2026/0017', 'D003', 'U007', '2026-08-11', 'Dihantar', NULL),
	(26, 'PDK/KLG/2026/0018', 'D001', 'U004', '2026-08-12', 'Dihantar', NULL),
	(27, 'PDK/KLG/2026/0018', 'D002', 'U006', '2026-08-12', 'Dihantar', NULL),
	(28, 'PDK/KLG/2026/0018', 'D003', 'U007', '2026-08-12', 'Dihantar', NULL),
	(29, 'PDK/KLG/2026/0019', 'D001', 'U006', '2026-08-13', 'Dihantar', NULL),
	(30, 'PDK/KLG/2026/0019', 'D002', 'U006', '2026-08-13', 'Dihantar', NULL),
	(31, 'PDK/KLG/2026/0019', 'D003', 'U007', '2026-08-13', 'Dihantar', NULL),
	(32, 'PDK/KLG/2026/0020', 'D001', 'U007', '2026-08-14', 'Dihantar', NULL),
	(33, 'PDK/KLG/2026/0020', 'D002', 'U006', '2026-08-14', 'Dihantar', NULL),
	(34, 'PDK/KLG/2026/0020', 'D003', 'U007', '2026-08-14', 'Dihantar', NULL),
	(35, 'PDK/KLG/2026/0021', 'D001', 'U004', '2026-08-15', 'Dihantar', NULL),
	(36, 'PDK/KLG/2026/0021', 'D002', 'U006', '2026-08-15', 'Dihantar', NULL),
	(37, 'PDK/KLG/2026/0021', 'D003', 'U007', '2026-08-15', 'Dihantar', NULL),
	(38, 'PDK/KLG/2026/0022', 'D001', 'U004', '2026-08-16', 'Dihantar', NULL),
	(39, 'PDK/KLG/2026/0022', 'D002', 'U006', '2026-08-16', 'Dihantar', NULL),
	(40, 'PDK/KLG/2026/0022', 'D003', 'U007', '2026-08-16', 'Dihantar', NULL),
	(41, 'PDK/KLG/2026/0023', 'D001', 'U006', '2026-08-17', 'Dihantar', NULL),
	(42, 'PDK/KLG/2026/0023', 'D002', 'U006', '2026-08-17', 'Dihantar', NULL),
	(43, 'PDK/KLG/2026/0023', 'D003', 'U007', '2026-08-17', 'Dihantar', NULL),
	(44, 'PDK/KLG/2026/0024', 'D001', 'U007', '2026-08-18', 'Dihantar', NULL),
	(45, 'PDK/KLG/2026/0024', 'D002', 'U006', '2026-08-18', 'Dihantar', NULL),
	(46, 'PDK/KLG/2026/0024', 'D003', 'U007', '2026-08-18', 'Dihantar', NULL),
	(47, 'PDK/KLG/2026/0025', 'D001', 'U004', '2026-08-28', 'Belum Mula', NULL),
	(48, 'PDK/KLG/2026/0026', 'D001', 'U004', '2026-08-29', 'Belum Mula', NULL),
	(49, 'PDK/KLG/2026/0026', 'D002', 'U006', '2026-08-29', 'Belum Mula', NULL),
	(50, 'PDK/KLG/2026/0027', 'D001', NULL, '2026-08-30', 'Belum Mula', NULL),
	(51, 'PDK/KLG/2026/0027', 'D002', NULL, '2026-08-30', 'Belum Mula', NULL),
	(52, 'PDK/KLG/2026/0027', 'D003', 'U007', '2026-08-30', 'Dihantar', NULL),
	(53, 'PDK/KLG/2026/0028', 'D001', 'U004', '2026-08-31', 'Belum Mula', NULL),
	(54, 'PDK/KLG/2026/0029', 'D001', 'U004', '2026-08-06', 'Dihantar', NULL),
	(55, 'PDK/KLG/2026/0029', 'D002', 'U006', '2026-08-06', 'Dihantar', NULL),
	(56, 'PDK/KLG/2026/0029', 'D003', 'U007', '2026-08-06', 'Dihantar', NULL),
	(57, 'PDK/KLG/2026/0030', 'D001', 'U004', '2026-08-07', 'Dihantar', NULL),
	(58, 'PDK/KLG/2026/0030', 'D002', 'U006', '2026-08-07', 'Dihantar', NULL),
	(59, 'PDK/KLG/2026/0030', 'D003', 'U007', '2026-08-07', 'Dihantar', NULL),
	(60, 'PDK/KLG/2026/0031', 'D001', 'U004', '2026-08-08', 'Dihantar', NULL),
	(61, 'PDK/KLG/2026/0031', 'D002', 'U006', '2026-08-08', 'Dihantar', NULL),
	(62, 'PDK/KLG/2026/0031', 'D003', 'U007', '2026-08-08', 'Dihantar', NULL);

INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, kbFeedback, status) VALUES
	('LPR-2026-0001', 'PDK/KLG/2026/0011', 'D001', 'U004', '2026-09-01', 'Siasatan lapangan dalam proses.', NULL, 'Sedang Disediakan'),
	('LPR-2026-0002', 'PDK/KLG/2026/0012', 'D001', 'U004', '2026-09-01', 'Gambar bukti dan ukuran retak dikumpul.', NULL, 'Sedang Disediakan'),
	('LPR-2026-0003', 'PDK/KLG/2026/0013', 'D001', 'U004', '2026-09-01', 'Menunggu data hujan tambahan.', NULL, 'Sedang Disediakan'),
	('LPR-2026-0004', 'PDK/KLG/2026/0014', 'D001', 'U004', '2026-08-22', 'Longkang disahkan pecah 20m, anggaran kos RM18,000.', 'Laporan lengkap, diterima.', 'Diluluskan'),
	('LPR-2026-0005', 'PDK/KLG/2026/0015', 'D001', 'U004', '2026-08-23', 'Tiang disahkan senget 15 darjah, perlu gantian segera.', 'Disahkan, tindakan segera diperlukan.', 'Diluluskan'),
	('LPR-2026-0006', 'PDK/KLG/2026/0016', 'D001', 'U004', '2026-08-24', 'Struktur kayu reput >60%, cadang naik taraf konkrit.', 'Laporan disahkan.', 'Diluluskan'),
	('LPR-2026-0007', 'PDK/KLG/2026/0017', 'D001', 'U004', '2026-08-20', 'Sampel air diambil, disahkan tercemar.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0008', 'PDK/KLG/2026/0017', 'D002', 'U006', '2026-08-20', 'Penduduk terjejas ±40 keluarga.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0009', 'PDK/KLG/2026/0017', 'D003', 'U007', '2026-08-20', 'Notis amaran dihantar kepada kilang berkaitan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0010', 'PDK/KLG/2026/0018', 'D001', 'U004', '2026-08-21', 'Kawasan terbakar seluas 2 ekar.', NULL, 'Sedang Disemak'),
	('LPR-2026-0011', 'PDK/KLG/2026/0018', 'D002', 'U006', '2026-08-21', 'Tiada kediaman terjejas, risiko rendah.', NULL, 'Sedang Disemak'),
	('LPR-2026-0012', 'PDK/KLG/2026/0018', 'D003', 'U007', '2026-08-21', 'Bomba dan pihak berkuasa dimaklumkan.', NULL, 'Sedang Disemak'),
	('LPR-2026-0013', 'PDK/KLG/2026/0019', 'D001', 'U006', '2026-08-22', 'Punca bau dikenal pasti dari kilang X.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0014', 'PDK/KLG/2026/0019', 'D002', 'U006', '2026-08-22', 'Aduan penduduk direkod, 12 aduan diterima.', NULL, 'Sedang Disemak'),
	('LPR-2026-0015', 'PDK/KLG/2026/0019', 'D003', 'U007', '2026-08-22', 'Surat rasmi dihantar kepada JAS.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0016', 'PDK/KLG/2026/0020', 'D001', 'U007', '2026-08-23', 'Perparitan disahkan tersumbat sepenuhnya.', NULL, 'Sedang Disemak'),
	('LPR-2026-0017', 'PDK/KLG/2026/0020', 'D002', 'U006', '2026-08-23', 'Impak kepada 3 kawasan perumahan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0018', 'PDK/KLG/2026/0020', 'D003', 'U007', '2026-08-23', 'Anggaran kos pembersihan RM32,000.', NULL, 'Sedang Disemak'),
	('LPR-2026-0019', 'PDK/KLG/2026/0021', 'D001', 'U004', '2026-08-24', 'Laluan disekat sementara demi keselamatan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0020', 'PDK/KLG/2026/0021', 'D002', 'U006', '2026-08-24', 'Tiada kecederaan dilaporkan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0021', 'PDK/KLG/2026/0021', 'D003', 'U007', '2026-08-24', 'Risiko tahap tinggi, cadang pemantauan berterusan.', NULL, 'Sedang Disemak'),
	('LPR-2026-0022', 'PDK/KLG/2026/0022', 'D001', 'U004', '2026-08-25', 'Ukuran kawasan tanah terceroboh: 1.2 ekar.', NULL, 'Sedang Disemak'),
	('LPR-2026-0023', 'PDK/KLG/2026/0022', 'D002', 'U006', '2026-08-25', 'Rujukan rekod pemilikan tanah dikemukakan.', NULL, 'Sedang Disemak'),
	('LPR-2026-0024', 'PDK/KLG/2026/0022', 'D003', 'U007', '2026-08-25', 'Cadangan tindakan penguatkuasaan disediakan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0025', 'PDK/KLG/2026/0023', 'D001', 'U006', '2026-08-26', 'Kemudahan taman disahkan rosak teruk.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0026', 'PDK/KLG/2026/0023', 'D002', 'U006', '2026-08-26', 'Aduan komuniti direkod.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0027', 'PDK/KLG/2026/0023', 'D003', 'U007', '2026-08-26', 'Anggaran kos pembaikan disediakan.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0028', 'PDK/KLG/2026/0024', 'D001', 'U007', '2026-08-27', 'Gangguan bekalan disahkan berlaku 5 kali seminggu.', NULL, 'Sedang Disemak'),
	('LPR-2026-0029', 'PDK/KLG/2026/0024', 'D002', 'U006', '2026-08-27', 'Penduduk terjejas ±60 isi rumah.', NULL, 'Sedang Disemak'),
	('LPR-2026-0030', 'PDK/KLG/2026/0024', 'D003', 'U007', '2026-08-27', 'Koordinasi dengan TNB sedang dijalankan.', NULL, 'Sedang Disemak'),
	('LPR-2026-0031', 'PDK/KLG/2026/0027', 'D003', 'U007', '2026-09-02', 'Kajian trafik awal selesai, cadangan lampu isyarat.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0032', 'PDK/KLG/2026/0029', 'D001', 'U004', '2026-08-15', 'Jambatan disahkan selamat lepas pembaikan struktur.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0033', 'PDK/KLG/2026/0029', 'D002', 'U006', '2026-08-15', 'Tiada kesan kepada penduduk sekitar.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0034', 'PDK/KLG/2026/0029', 'D003', 'U007', '2026-08-15', 'Notis siap dihantar kepada pemohon.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0035', 'PDK/KLG/2026/0030', 'D001', 'U004', '2026-08-20', 'Bumbung dibaik pulih sepenuhnya.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0036', 'PDK/KLG/2026/0030', 'D002', 'U006', '2026-08-20', 'Komuniti dimaklumkan, dewan boleh digunakan semula.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0037', 'PDK/KLG/2026/0030', 'D003', 'U007', '2026-08-20', 'Fail ditutup, rekod dikemaskini.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0038', 'PDK/KLG/2026/0031', 'D001', 'U004', '2026-08-25', 'Longkang dibersihkan dan diperdalam.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0039', 'PDK/KLG/2026/0031', 'D002', 'U006', '2026-08-25', 'Tiada aduan susulan diterima.', 'Diterima.', 'Diluluskan'),
	('LPR-2026-0040', 'PDK/KLG/2026/0031', 'D003', 'U007', '2026-08-25', 'Fail ditutup sepenuhnya.', 'Diterima.', 'Diluluskan');

INSERT INTO CompileReport (compileID, refNo, finalizedBy, compileAt, finalSummary) VALUES
	('CMP-2026-0001', 'PDK/KLG/2026/0029', 'U001', '2026-09-10', 'Laporan daripada ketiga-tiga bahagian disahkan dan diselaraskan. Kes ditutup.'),
	('CMP-2026-0002', 'PDK/KLG/2026/0030', 'U001', '2026-09-15', 'Laporan daripada ketiga-tiga bahagian disahkan dan diselaraskan. Kes ditutup.'),
	('CMP-2026-0003', 'PDK/KLG/2026/0031', 'U001', '2026-09-18', 'Laporan daripada ketiga-tiga bahagian disahkan dan diselaraskan. Kes ditutup.');
