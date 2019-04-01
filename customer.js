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

var start = function() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [POST] or [BID]",
      choices: ["POST", "BID"]
    })
    .then(function(answer) {
      if (answer.postOrBid.toUpperCase() == "POST") {
        postAuction();
      } else {
        bidAuction();
      }
    });
};
var bidAuction = function() {
  connection.query("SELECT * FROM auctions", function(err, res) {
    console.log(res);
    inquirer
      .prompt({
        names: "choice",
        type: "rawlist",
        choices: function(value) {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
          }
          return choiceArray;
        },
        message: "What Item would you like to place a bid on?"
      })
      .then(function(answer) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].product_name == answer.choices) {
            var chosenItem = res[i];
            inquirer
              .prompt([
                {
                  name: "bid",
                  type: "input",
                  message: "How much would you like to bid?",
                  validate: function(value) {
                    if (isNaN(value) == false) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }
              ])
              .then(function(answer) {
                if (chosenItem.highestbid < parseInt(answer.bid)) {
                  connection.query(
                    "UPDATE auctions SET ? WHERE ?",
                    [
                      {
                        highestbid: answer.bid
                      },
                      {
                        id: chosenItem.id
                      }
                    ],
                    function(err, res) {
                      console.log("Bid successfully Placed");
                      start();
                    }
                  );
                } else {
                  console.log("Your bid was too low. Try again...");
                  start();
                }
              });
          }
        }
      });
  });
};
