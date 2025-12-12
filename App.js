require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeades: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.options("/", cors(corsOptions));

app.use(express.json());

const loginRoute = require("./routes/login")
app.use("/login", loginRoute);

const middlewareRoute = require("./middleware/protected")
app.use("/protected", middlewareRoute);

const projectRoute = require("./routes/project")
app.use("/project", projectRoute);

const productRoute = require("./routes/product")
app.use("/product", productRoute);

const costingRoute = require("./routes/costing")
app.use("/costing", costingRoute);

const taskRoute = require("./routes/task1")
app.use("/task1", taskRoute);

const thingstodoRoute = require("./routes/thingstodo")
app.use("/thingstodo", thingstodoRoute);

const emailRoute = require("./routes/email")
app.use("/email", emailRoute);


module.exports = app;