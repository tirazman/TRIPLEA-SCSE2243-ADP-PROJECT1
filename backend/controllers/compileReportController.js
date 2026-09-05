const db = require('../config/db');

// Generate next compileID in format CMP-YYYY-NNNN
async function generateCompileId() {
    const year = new Date().getFullYear();
    const [rows] = await db.execute(
        `SELECT compileID FROM CompileReport WHERE compileID LIKE ? ORDER BY compileID DESC LIMIT 1`,
        [`CMP-${year}-%`]
    );
    let nextNum = 1;
    if (rows.length > 0) {
        const lastNum = parseInt(rows[0].compileID.split('-').pop(), 10);
        nextNum = lastNum + 1;
    }
    return `CMP-${year}-${String(nextNum).padStart(4, '0')}`;
}

// POST /api/compile-reports — PPB compile semua laporan untuk satu Document
exports.createCompileReport = async (req, res) => {
    const { refNo, finalizedBy, finalSummary } = req.body;

    if (!refNo || !finalizedBy) {
        return res.status(400).json({ message: "refNo dan finalizedBy diperlukan" });
    }

    try {
        // Semak semua bahagian yang di-assign untuk Document ni dah 'Dihantar'
        const [deptRows] = await db.execute(
            `SELECT status FROM DocumentDepartment WHERE refNo = ?`,
            [refNo]
        );

        const belumHantar = deptRows.filter(d => d.status !== 'Dihantar');
        if (deptRows.length === 0) {
            return res.status(400).json({ message: "Document ni tiada bahagian di-assign lagi" });
        }
        if (belumHantar.length > 0) {
            return res.status(400).json({ message: `Masih ada ${belumHantar.length} bahagian belum hantar laporan` });
        }

        const compileID = await generateCompileId();
        const compileAt = new Date().toISOString().split('T')[0];

        await db.execute(
            `INSERT INTO CompileReport (compileID, refNo, finalizedBy, compileAt, finalSummary)
             VALUES (?, ?, ?, ?, ?)`,
            [compileID, refNo, finalizedBy, compileAt, finalSummary || null]
        );

        await db.execute(
            `UPDATE Document SET status = 'Selesai' WHERE refNo = ?`,
            [refNo]
        );

        res.status(201).json({ message: "Laporan berjaya diselaraskan", compileID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/compile-reports/:refNo — satu compile report + semua laporan bahagian
exports.getCompileReportByRef = async (req, res) => {
    const { refNo } = req.params;

    try {
        const [compileRows] = await db.execute(
            `SELECT cr.*, u.name AS finalizedByName
             FROM CompileReport cr
             LEFT JOIN User u ON cr.finalizedBy = u.userID
             WHERE cr.refNo = ?`,
            [refNo]
        );

        if (compileRows.length === 0) {
            return res.status(404).json({ message: "Compile report belum wujud untuk Document ni" });
        }

        const [reportRows] = await db.execute(
            `SELECT r.*, dept.deptName, u.name AS officerName
             FROM Report r
             JOIN Department dept ON r.deptID = dept.deptID
             LEFT JOIN User u ON r.officerID = u.userID
             WHERE r.refNo = ?`,
            [refNo]
        );

        res.status(200).json({ ...compileRows[0], reports: reportRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};