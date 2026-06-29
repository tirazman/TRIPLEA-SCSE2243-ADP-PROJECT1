const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM User WHERE username = ?', [username]);
        if (rows.length === 0 || rows[0].password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate JWT
        const user = rows[0];
        const token = jwt.sign(
            { userID: user.userID, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};