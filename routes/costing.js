const express = require("express");
const router = express.Router();
const pool = require("../db");
const { error } = require("console");


router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM costing");
    res.json(result.rows);
});


router.post("/add", async (req, res) => {
    const { 
        costing_name,
        costing
     } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO costing (costing_name, costing ) VALUES ($1, $2) RETURNING *",
            [costing_name, costing]
        )
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;