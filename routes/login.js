const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const pool = require("../db");

// LOGIN WITH JWT (EXPIRES IN 1 DAY)
router.post("/", async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM login WHERE user_name = $1 AND password = $2",
      [user_name, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({success:false, message: "Invalid username or password" });
    }

    const user = result.rows[0];

    if(user.password !== password)
      return res.status(400).json({message: "Incorrect password"})

    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const device_info = req.headers["user-agent"];

    await pool.query(
      `INSERT INTO login_logs (user_name, ip_address, device_info)
      VALUES ($1, $2, $3)`,
      [user.user_name, ip_address, device_info]
    );

    // Create JWT
    const token = jwt.sign(
      { user_name: user.user_name, password: user.password, role: user.role },           // payload
      "MY_SECRET_KEY",         // secret key
      { expiresIn: "1d" }      // 1 day expiry
    );

    return res.json({ 
      message: "Login success",
      token: token,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports= router;