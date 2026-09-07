const db = require('../config/db');

// Generate next refNo in format PDK/KLG/YYYY/NNNN
async function generateRefNo() {
    const year = new Date().getFullYear();
    const [rows] = await db.execute(
        `SELECT refNo FROM Document WHERE refNo LIKE ? ORDER BY refNo DESC LIMIT 1`,
        [`PDK/KLG/${year}/%`]
    );
    let nextNum = 1;
    if (rows.length > 0) {
        const lastNum = parseInt(rows[0].refNo.split('/').pop(), 10);
        nextNum = lastNum + 1;
    }
    return `PDK/KLG/${year}/${String(nextNum).padStart(4, '0')}`;
}

// POST /api/documents — PT daftar fail baru
exports.createDocument = async (req, res) => {
    const { title, description, category, location, complainantName, priority, submittedBy, deadline } = req.body;

    if (!title || !submittedBy) {
        return res.status(400).json({ message: "title dan submittedBy diperlukan" });
    }

    try {
        const refNo = await generateRefNo();
        const submissionDate = new Date().toISOString().split('T')[0];

        await db.execute(
            `INSERT INTO Document (refNo, title, description, category, location, complainantName, priority, submittedBy, submissionDate, deadline, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Didaftar')`,
            [refNo, title, description || null, category || null, location || null, complainantName || null, priority || 'Sederhana', submittedBy, submissionDate, deadline || null]
        );

        res.status(201).json({ message: "Fail berjaya didaftarkan", refNo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/documents — senarai semua Document
exports.getAllDocuments = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT d.*, u.name AS submittedByName
             FROM Document d
             LEFT JOIN User u ON d.submittedBy = u.userID
             ORDER BY d.submissionDate DESC`
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/documents/:refNo — satu Document (dengan department assignment sekali)
exports.getDocumentByRef = async (req, res) => {
    const { refNo } = req.params;
    try {
        const [docRows] = await db.execute(
            `SELECT d.*, u.name AS submittedByName
             FROM Document d
             LEFT JOIN User u ON d.submittedBy = u.userID
             WHERE d.refNo = ?`,
            [refNo]
        );

        if (docRows.length === 0) {
            return res.status(404).json({ message: "Document tidak dijumpai" });
        }

        const [deptRows] = await db.execute(
            `SELECT dd.*, dept.deptName
             FROM DocumentDepartment dd
             JOIN Department dept ON dd.deptID = dept.deptID
             WHERE dd.refNo = ?`,
            [refNo]
        );

        res.status(200).json({ ...docRows[0], departments: deptRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDocument = async (req, res) => {
    const { refNo } = req.params;
    const { status, deadline, priority, aiSummary } = req.body;

    const fields = [];
    const values = [];
    if (status) { fields.push("status = ?"); values.push(status); }
    if (deadline) { fields.push("deadline = ?"); values.push(deadline); }
    if (priority) { fields.push("priority = ?"); values.push(priority); }
    if (aiSummary !== undefined) { fields.push("aiSummary = ?"); values.push(aiSummary); }

    if (fields.length === 0) {
        return res.status(400).json({ message: "Tiada field untuk dikemaskini" });
    }

    try {
        values.push(refNo);
        const [result] = await db.execute(
            `UPDATE Document SET ${fields.join(", ")} WHERE refNo = ?`,
            values
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Document tidak dijumpai" });
        }
        res.status(200).json({ message: "Document berjaya dikemaskini" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};