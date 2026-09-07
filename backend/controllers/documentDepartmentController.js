const db = require('../config/db');

exports.getAssignments = async (req, res) => {
    const { officerID, refNo } = req.query;

    try {
        let query = `
            SELECT dd.id, dd.refNo, dd.deptID, dd.assignedOfficer, dd.assignedAt, dd.status AS assignmentStatus,
           d.title, d.description, d.category, d.location, d.deadline, d.priority,
           d.submissionDate, d.status AS documentStatus,
           dept.deptName,
           u.name AS officerName,
           r.reportID, r.reportDetails, r.kbFeedback, r.status AS reportStatus, r.submittedAt
            FROM DocumentDepartment dd
            JOIN Document d ON dd.refNo = d.refNo
            JOIN Department dept ON dd.deptID = dept.deptID
            LEFT JOIN User u ON dd.assignedOfficer = u.userID
            LEFT JOIN Report r ON r.refNo = dd.refNo AND r.deptID = dd.deptID
        `;
        const conditions = [];
        const params = [];

        if (officerID) {
            conditions.push('dd.assignedOfficer = ?');
            params.push(officerID);
        }
        if (refNo) {
            conditions.push('dd.refNo = ?');
            params.push(refNo);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY d.deadline ASC';

        const [rows] = await db.execute(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAssignmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status, notes, assignedOfficer, instruction } = req.body;

    try {
        const [ddRows] = await db.execute(`SELECT * FROM DocumentDepartment WHERE id = ?`, [id]);
        if (ddRows.length === 0) {
            return res.status(404).json({ message: "Assignment tidak dijumpai" });
        }
        const { refNo, deptID } = ddRows[0];

        // Kes 1: KB assign/kemaskini officer + instruction (tak sentuh status)
        if (assignedOfficer !== undefined || instruction !== undefined) {
            const fields = [];
            const values = [];
            if (assignedOfficer !== undefined) { fields.push("assignedOfficer = ?"); values.push(assignedOfficer); }
            if (instruction !== undefined) { fields.push("instruction = ?"); values.push(instruction); }
            values.push(id);
            await db.execute(`UPDATE DocumentDepartment SET ${fields.join(", ")} WHERE id = ?`, values);
            return res.status(200).json({ message: "Tugasan berjaya dikemaskini" });
        }

        // Kes 2: PPL kemaskini status kerja (logic sedia ada, tak berubah)
        if (!status) {
            return res.status(400).json({ message: "status diperlukan" });
        }

        let ddStatus, reportStatus;
        if (status === "Pending") {
            ddStatus = "Belum Mula";
        } else if (status === "In Progress") {
            ddStatus = "Sedang Diproses";
            reportStatus = "Sedang Disediakan";
        } else if (status === "Completed") {
            ddStatus = "Dihantar";
            reportStatus = "Sedang Disemak";
        } else {
            return res.status(400).json({ message: "status tidak sah" });
        }

        await db.execute(`UPDATE DocumentDepartment SET status = ? WHERE id = ?`, [ddStatus, id]);

        if (reportStatus) {
            const [existingReport] = await db.execute(
                `SELECT reportID FROM Report WHERE refNo = ? AND deptID = ?`,
                [refNo, deptID]
            );
            if (existingReport.length > 0) {
                await db.execute(
                    `UPDATE Report SET status = ?, reportDetails = ? WHERE reportID = ?`,
                    [reportStatus, notes || null, existingReport[0].reportID]
                );
            } else {
                const year = new Date().getFullYear();
                const [lastReport] = await db.execute(
                    `SELECT reportID FROM Report WHERE reportID LIKE ? ORDER BY reportID DESC LIMIT 1`,
                    [`LPR-${year}-%`]
                );
                let nextNum = 1;
                if (lastReport.length > 0) {
                    nextNum = parseInt(lastReport[0].reportID.split('-').pop(), 10) + 1;
                }
                const reportID = `LPR-${year}-${String(nextNum).padStart(4, '0')}`;
                const submittedAt = new Date().toISOString().split('T')[0];
                await db.execute(
                    `INSERT INTO Report (reportID, refNo, deptID, officerID, submittedAt, reportDetails, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [reportID, refNo, deptID, ddRows[0].assignedOfficer, submittedAt, notes || null, reportStatus]
                );
            }
        }

        res.status(200).json({ message: "Status berjaya dikemaskini" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAssignment = async (req, res) => {
    const { refNo, deptID, assignedOfficer } = req.body;

    if (!refNo || !deptID) {
        return res.status(400).json({ message: "refNo dan deptID diperlukan" });
    }

    try {
        const assignedAt = new Date().toISOString().split('T')[0];
        await db.execute(
            `INSERT INTO DocumentDepartment (refNo, deptID, assignedOfficer, assignedAt, status)
             VALUES (?, ?, ?, ?, 'Belum Mula')
             ON DUPLICATE KEY UPDATE assignedOfficer = VALUES(assignedOfficer), assignedAt = VALUES(assignedAt)`,
            [refNo, deptID, assignedOfficer || null, assignedAt]
        );
        res.status(201).json({ message: "Bahagian berjaya di-assign" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};