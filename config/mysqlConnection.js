const mysql = require("mysql");


const config = {
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "payorderdb"
};

const connection = mysql.createConnection(config);



// In case connection can't be established run the following commands on mysql workbench
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'srahman123';
// flush privileges;


module.exports = connection;