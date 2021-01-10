var mysql = require('mysql');

// connection to mysql database in express.js
var connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

connection.connect()

module.exports = { connection };