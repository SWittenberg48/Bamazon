var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var Table = require("cli-table");
var table = new Table({
  head: ["Item ID", "Item", "Price", "Qnty"],
  colWidths: [20, 40, 15, 15]
});

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3307,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id:" + connection.threadId);
  displayProducts();
});
// Add a Display chart of the products.
function displayProducts() {
  connection.query("SELECT * FROM product", function(err, res) {
    // Display products and price to user. using the nift cli-table similar to Michaels example
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());

    inquirer
      .prompt([
        {
          // Ask user to choose a product to purchase
          name: "choice",
          type: "list",
          message: chalk.blue("What would you like to buy?"),
          //   Grabbing the products and putting it in the choiceArray
          choices: function(value) {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          }
        },
        {
          // Ask for quantity of item
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?",
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
        // Grabs the entire object for the product the user chose
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name == answer.choice) {
            var chosenItem = res[i];
          }
        }
        // Calculate remaining stock if purchase occurs
        var updateStock =
          parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);

        // telling user to chose again if not enough in stock
        if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
          console.log(chalk.red("Insufficient Quantity! Please choose again."));
          displayProducts();
        }
        // If the customer wants to purchase an amount that is in stock, the remaining stock quantity will be updated in the database and the price presented to the customer
        else {
          var Total = parseFloat(answer.quantity) * chosenItem.price;

          var query = connection.query(
            "UPDATE product SET ? WHERE ?",
            [{ stock_quantity: updateStock }, { item_id: chosenItem.item_id }],
            function(err, res) {
              if (err) throw err;
              console.log(chalk.green("Purchase successful!"));
              console.log("Your total is $ " + Total);
            }
          );
        }
      }); // .then of inquirer prompt
  }); // first connection.query of the database
} // goShopping function
