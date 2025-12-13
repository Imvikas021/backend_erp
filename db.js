const { release } = require("os");
const {Pool, Client} = require("pg");
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
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