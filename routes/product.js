const express = require("express");
const router = express.Router();
const pool = require("../db");
const { error } = require("console");


router.get("/", async (req, res) => {
    const result = await pool.query("Select * FROM public.product");
    res.json(result.rows);
});

router.post("/add", async (req, res) => {
    const { 
        product_id,
        product_name,
        product_detail,
        model_number,
        serial_number,
        price
     } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO public.product (product_id, product_name, product_detail, model_number, serial_number, price ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [product_id, product_name, product_detail, model_number, serial_number, price]
        )
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;