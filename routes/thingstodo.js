const express = require("express");
const router = express.Router();
const pool = require("../db");
const { error } = require("console");


router.get("/", async (req, res) => {
    const result = await pool.query("Select * FROM thingstodo");
    res.json(result.rows);
});

router.post("/add", async (req, res) => {
    const { 
        project_name,
        work_details,
        work_date,
        work_time
     } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO thingstodo (project_name, work_details, work_date, work_time ) VALUES ($1, $2, $3, $4) RETURNING *",
            [project_name, work_details, work_date, work_time]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;