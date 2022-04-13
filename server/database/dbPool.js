const mysql = require('mysql2');
// require('dotenv').config({ path: './config.env' }); // TODO: check if this is needed

const db_pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = db_pool; // not a promise