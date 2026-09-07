const db = require('../config/db');

// Generate next reportID in format LPR-YYYY-NNNN
async function generateReportId() {
    const year = new Date().getFullYear();
    const [rows] = await db.execute(
        `SELECT reportID FROM Report WHERE reportID LIKE ? ORDER BY reportID DESC LIMIT 1`,
        [`LPR-${year}-%`]
    );
    let nextNum = 1;
    if (rows.length > 0) {
        const lastNum = parseInt(rows[0].reportID.split('-').pop(), 10);
        nextNum = lastNum + 1;
    }
    return `LPR-${year}-${String(nextNum).padStart(4, '0')}`;
}

// POST /api/reports — PPL hantar laporan untuk satu bahagian pada satu Document
exports.createReport = async (req, res) => {
    const { refNo, deptID, officerID, reportDetails } = req.body;

    if (!refNo || !deptID || !officerID) {
        return res.status(400).json({ message: "refNo, deptID dan officerID diperlukan" });
    }

    try {
        // Semak dulu kalau report untuk refNo+deptID ni dah wujud
        const [existing] = await db.execute(
            `SELECT reportID FROM Report WHERE refNo = ? AND deptID = ?`,
            [refNo, deptID]
        );

        let reportID;
        const submittedAt = new Date().toISOString().split('T')[0];

        if (existing.length > 0) {
            // Dah wujud — update row sedia ada (bukan insert baru)
            reportID = existing[0].reportID;
            await db.execute(
                `UPDATE Report SET officerID = ?, submittedAt = ?, reportDetails = ?, status = 'Sedang Disemak' WHERE reportID = ?`,
                [officerID, submittedAt, reportDetails || null, reportID]
            );
        } else {
            // Belum wujud — insert baru
            reportID = await generateReportId();
            await db.execute(
                `INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, status)
                 VALUES (?, ?, ?, ?, ?, ?, 'Sedang Disemak')`,
                [reportID, refNo, deptID, officerID, submittedAt, reportDetails || null]
            );
        }

        await db.execute(
            `UPDATE DocumentDepartment SET status = 'Dihantar' WHERE refNo = ? AND deptID = ?`,
            [refNo, deptID]
        );

        res.status(201).json({ message: "Laporan berjaya dihantar", reportID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/reports?refNo=... — senarai laporan untuk satu Document (semua bahagian)
// GET /api/reports?officerID=... — senarai laporan yang dihantar oleh satu pegawai (PPL)
exports.getReports = async (req, res) => {
    const { refNo, officerID } = req.query;

    try {
        let query = `
            SELECT r.*, dept.deptName, u.name AS officerName, d.title AS documentTitle
            FROM Report r
            JOIN Department dept ON r.deptID = dept.deptID
            LEFT JOIN User u ON r.officerID = u.userID
            LEFT JOIN Document d ON r.refNo = d.refNo
        `;
        const params = [];

        if (refNo) {
            query += ` WHERE r.refNo = ?`;
            params.push(refNo);
        } else if (officerID) {
            query += ` WHERE r.officerID = ?`;
            params.push(officerID);
        }

        query += ` ORDER BY r.submittedAt DESC`;

        const [rows] = await db.execute(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateReport = async (req, res) => {
    const { reportID } = req.params;
    const { reportDetails, status, kbFeedback } = req.body;

    const fields = [];
    const values = [];
    if (reportDetails !== undefined) { fields.push("reportDetails = ?"); values.push(reportDetails); }
    if (status) { fields.push("status = ?"); values.push(status); }
    if (kbFeedback !== undefined) { fields.push("kbFeedback = ?"); values.push(kbFeedback); }

    if (fields.length === 0) {
        return res.status(400).json({ message: "Tiada field untuk dikemaskini" });
    }

    try {
        values.push(reportID);
        const [result] = await db.execute(
            `UPDATE Report SET ${fields.join(", ")} WHERE reportID = ?`,
            values
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Report tidak dijumpai" });
        }
        res.status(200).json({ message: "Laporan berjaya difinalize" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};