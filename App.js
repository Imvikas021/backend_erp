require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://frontenderp-production.up.railway.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeades: ["Content-Type", "Authorization"],
    Credential: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend ERP API is running correctly")
});

app.use("/api/login", require("./routes/login"));

const auth = require("./middleware/protected");

app.use("/api/project", auth, require("./routes/project"));
app.use("/api/product", auth, require("./routes/product"));
app.use("/api/costing", auth, require("./routes/costing"));
app.use("/api/task1", auth, require("./routes/task1"));
app.use("/api/thingstodo", auth, require("./routes/thingstodo"));
app.use("/api/email", auth, require("./routes/email"));


module.exports = app;