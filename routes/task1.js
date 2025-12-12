const express = require("express");
const router = express.Router();
const pool = require("../db");
const { error } = require("console");


router.get("/", async (req, res) => {
    const result = await pool.query("Select * FROM task");
    res.json(result.rows);
});

router.post("/add", async (req, res) => {
    const { 
        project_name,
        work,
        assign_to,
        target_date,
        remark,
        status,
     } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO task (project_name, work, assign_to, target_date, remark, status ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [project_name, work, assign_to, target_date, remark, status]
        )
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;