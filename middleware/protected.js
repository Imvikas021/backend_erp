const auth = require("../middleware/auth");
const express = require("express");

const router = express.Router();

 
 router.get("/app", auth, (req, res) =>{
    res.json({ message: "welcome", user: req.user});
 });


 module.exports = router;