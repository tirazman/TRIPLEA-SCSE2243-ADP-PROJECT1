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
('U005', 'Mohd. Faizal bin Mohd. Yusof', 'KetuaBahagian', 'faizalyusof', 'password', 'faizalyusof@pdk.my');


-- Table for Department
CREATE TABLE IF NOT EXISTS Department (
    deptID VARCHAR(30) PRIMARY KEY,
    deptName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table for Document
CREATE TABLE  IF NOT EXISTS Document (
    refNo VARCHAR(30) PRIMARY KEY,
    submittedBy VARCHAR(30),
    FOREIGN KEY (submittedBy) REFERENCES User(userID),
    deptID VARCHAR(30),
    FOREIGN KEY (deptID) REFERENCES Department(deptID),
    submissionDate DATE NOT NULL,
    status VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- Table for Report
CREATE TABLE IF NOT EXISTS Report (
    reportID VARCHAR(30) PRIMARY KEY,
    refNo VARCHAR(30),
    FOREIGN KEY (refNo) REFERENCES Document(refNo),
    deptID VARCHAR(30),
    FOREIGN KEY (deptID) REFERENCES Department(deptID),
    submittedAt DATE NOT NULL
) ENGINE=InnoDB;

-- Table for CompileReport
CREATE TABLE IF NOT EXISTS CompileReport (
    compileID VARCHAR(30) PRIMARY KEY,
    reportID VARCHAR(30),
    FOREIGN KEY (reportID) REFERENCES Report(reportID),
    finalizedBy VARCHAR(30),
    FOREIGN KEY (finalizedBy) REFERENCES User(userID),
    compileAt DATE NOT NULL
) ENGINE=InnoDB;

-- Table for InformationRequest
CREATE TABLE IF NOT EXISTS InformationRequest (
    requestID VARCHAR(30) PRIMARY KEY,
    createdBy VARCHAR(30),
    FOREIGN KEY (createdBy) REFERENCES User(userID),
    assignedTo VARCHAR(30),
    FOREIGN KEY (assignedTo) REFERENCES User(userID),
    status VARCHAR(20) NOT NULL,
    createdAt DATE NOT NULL
) ENGINE=InnoDB;

