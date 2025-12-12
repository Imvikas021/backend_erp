const { release } = require("os");
const {Pool, Client} = require("pg");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.connect((err, Client, release)=>{
    if (err){

        return console.error("Error acquiring client", err.stack);
    }
    console.log ('Successfully connected to the database!');
    release();
})

module.exports = {
    query: (text,params) => pool.query(text,params),
    pool,
};