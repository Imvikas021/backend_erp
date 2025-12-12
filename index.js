
const app = require("./App");
const PORT = process.env.PORT || 3001;

app.listen(3001, PORT, "0.0.0.0", () =>{
    console.log("Server running on port "+ PORT);
});

