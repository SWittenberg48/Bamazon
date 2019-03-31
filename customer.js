var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  Port: "3307",
  user: "root",
  password: "root",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  console.log("connected as id:" + connection.threadId);
  start();
});
