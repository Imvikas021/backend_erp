const express = require("express");
const router = express.Router();
const pool = require("../db");
const { error } = require("console");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// get all info from project tab
router.get("/", async (req, res) => {
    const result = await pool.query("SELECT * FROM project");
    res.json(result.rows);
});

router.post("/add", async (req, res) => {
    const { 
        project_name,
        customer_name,
        location,
        mobile_no,
        mail_id,
        company_name,
        order_date,
        costing_date,
        costing_assign_to,
        remark,
        status
     } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO project (project_name, customer_name, location, mobile_no, mail_id, company_name, order_date, costing_date, costing_assign_to, remark, status ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [project_name, customer_name, location, mobile_no, mail_id, company_name, order_date, costing_date, costing_assign_to, remark, status ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;