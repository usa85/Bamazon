// Point of sale application

// Required NPM modules
var mysql = require("mysql"); // to run and to communicate with mysqul
var inquirer = require("inquirer"); // to require common interactive command line user interface
var chalk = require("chalk"); // to change the color in bach

// Common functions used in bamazonCustomer/Manager/Supervisor
var common = require("./common.js");

var sqlConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Maureen61",
    database: "bamazon_DB"
};

// create the connection information for the sql database
var connection = mysql.createConnection(sqlConfig);

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;

    common.printHeader("Welcome to Bamazon Wine Distributor Store!","magenta");
    purchaseItem();
});
  
// Functions
//=======================================

function purchaseItem() {
    // Query the DB for all items in store inventory
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        common.displayItems(results, "blue","customer");

        var item = 0;

        // Prompt customer to make purchase selection
        inquirer.prompt([
            {
                name: "itemNumber",
                type: "input",
                message: chalk.yellow("Which item would you like to purchase?"),
                validate: function(num){
                    // Check if item number is valid, returns object if found, else returns -1 if not found
                    item = results.find(x => x.id === parseInt(num));
                    if (item) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(ans1) {
            // Get two prompt statements. Use the item number from the first response to check if there is sufficient inventory, 
            // then proceed with purchase. Otherwise, ask customer to enter another amount.

            // to select quantity
            inquirer.prompt([
                {
                    name: "qty",
                    type: "input",
                    message: chalk.yellow("How many would you like to purchase?"),
                    validate: function(num){
                        if (parseInt(num) < item.stock_quantity) {
                            return true;
                        }
                        console.log(chalk.red("\rInsufficient quantity in stock, please select another amount."));
                        return false;
                    }
                }
            ])
            .then(function(ans2) {
                updateInventory(ans1.itemNumber, parseInt(ans2.qty));
            })
        });
    });
}

// ============================================================================

function updateInventory(ix, qty) {
    if (qty != 0) {

        // Get the item record, need current values to use to update
        connection.query(
            "SELECT * FROM products WHERE ?", [{id:ix}],
            function(err, res1) {
                if (err) throw err;

                connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: (res1[0].stock_quantity - qty), 
                        product_sales: res1[0].product_sales+(res1[0].customer_price*qty)
                    }, {
                        id: ix
                    }],
                    function(err, res2) {
                        if (err) throw err;

                        console.log(chalk`\n{green.bold Thank you for your purchase!} Your total is {magenta $${res1[0].customer_price*qty}.}\n`);
                        exitBamazon();
                    }
                );
            }
        );
    }
    else {
        console.log(chalk.cyan(`\nSorry we weren't able to help you today. Come back soon!\n`));
        exitBamazon();
    }
}

// ===============================================================

function exitBamazon() {

    console.log(chalk.blue.bold("\nHave a great day!\n"))
    connection.end();
}