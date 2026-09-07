const db = require('../config/db');

// GET /api/users?role=... — senarai user, boleh filter ikut role
exports.getUsers = async (req, res) => {
    const { role } = req.query;
    try {
        let query = `SELECT userID, name, role FROM User`;
        const params = [];
        if (role) {
            query += ` WHERE role = ?`;
            params.push(role);
        }
        const [rows] = await db.execute(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};