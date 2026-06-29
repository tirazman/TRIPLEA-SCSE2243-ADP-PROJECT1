const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Attempting login for:", username); 
    
    try {
        const [rows] = await db.execute('SELECT * FROM User WHERE username = ?', [username]);
        console.log("Query executed");
        if (rows.length === 0) {
            console.log("User not found");
            return res.status(401).json({ message: "User not found" });
        }

        if (rows[0].password !== password) {
            console.log("Password mismatch");
            return res.status(401).json({ message: "Password mismatch" });
        }

        res.status(200).json({ message: "Login successful", user: rows[0] });
    } catch (err) {
        console.error("DEBUG ERROR:", err); 
        res.status(500).json({ error: err.message });
    }
};