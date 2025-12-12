
const app = require("./App");
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () =>{
    console.log("Server running on port "+ PORT);
});

