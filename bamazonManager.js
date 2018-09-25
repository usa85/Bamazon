// Manager Inventory Management App

// Section 1   Required NPM modules ============================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

// Section 1 - 2 Common functions used in bamazonCustomer/Manager/Supervisor
var common = require("./common.js");

var sqlConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_DB"
};

const lowInventory = 5;

// Section 1 - 3 create the connection information for the sql database
var connection = mysql.createConnection(sqlConfig);

// Section 1 - 4 connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    
    common.printHeader("Welcome to Bamazon Wine Inventory Managment App!","white");
    manageInventory();
});
  
// Section 2 - 1 ===============================================================

function manageInventory() {

    // Prompt user for command selection
    inquirer.prompt([
        {
            name: "command",
            type: "rawlist",
            message: "Please select a function",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ])
    .then(function(cmd) {
        // console.log(cmd);
        switch (cmd.command) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Wine Inventory":
                viewLowInventory();
                break;
            case "Add Wine to Inventory":
                addInventory();
                break;
            case "Add New Wine":
                addProduct();
                break;
            case "Exit":
                exitBamazon();
                break;
        }
    });
}

// Section 2 - 2 ==============================================================================

function viewProducts() {

    // Query the DB for all items in store inventory
    connection.query("SELECT * FROM products", (err, results) => {
        if (err) throw err;

        common.printHeader("Store Inventory", "white");
        common.displayItems(results, "white", "manager");
        manageInventory();
    });
}

// Section 2 - 3 ================================================================================

function viewLowInventory() {

    // Query the DB for all items in store with low inventory
    connection.query(`SELECT * FROM products WHERE stock_quantity < ${lowInventory}`, (err, results) => {
        if (err) throw err;

        // console.log(chalk.red.bold("\nProducts with Low Inventory"));
        common.printHeader("Products with Low Wine Inventory", "red");
        common.displayItems(results,"red", "manager");
        manageInventory();
    });
}

// Section 2 - 4 ====================================================================================

function addProduct() {
    // Add a new product to the store inventory
    var maxProdLength = 20;

    // Get the list of departments for choice selection from departments table
    connection.query(`SELECT department_name FROM departments`, (err, results) => { 
        if (err) throw err;

        let choiceArray = [];

        for (i=0; i< results.length; i++) {
            choiceArray.push(results[i].department_name);
        }

        inquirer.prompt ([
            {
                name: "name",
                type: "input",
                message: "Enter Product Name",
                validate: function(prod){
                    // Check number validity, method returns the object if itemNumber is found
                    if (prod.length <= maxProdLength) {
                        return true;
                    }
                    console.log(chalk.red.bold('\nOops!! the product name too long'));
                    return false;
                }
            },
            {
                name: "type" ,
                type: "rawlist",
                message: "Select a Wine Category",
                choices: choiceArray
            },
            {
                name: "price",
                type: "input",
                message: "Enter Customer Price (Case of 12)",
                validate: (num) => {return common.isNumber(num);}
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter Quantity (Case of 12)",
                validate: (num) => {return common.isNumber(num);}
            }
        ])
        .then(function(response) {
            // Add new product to inventory
            connection.query("INSERT INTO products SET ?", 
                [{product_name: response.name, department: response.type, customer_price: response.price, stock_quantity: response.quantity}],
                (err, results) =>  {
                    if (err) throw err;

                    console.log(chalk.green.bold(`\n${results.affectedRows} You added new a wine!\n`));
                    manageInventory();
            });
        });
    })
}

// Section 2 - 5 =========================================================================

function addInventory() {
    // Increment stock quanity by user entered amount

    // Get the list of product ids
    connection.query(`SELECT id FROM products`, (err, results) => { 
        if (err) throw err;
    
        inquirer.prompt ([
            {
                name: "id",
                type: "input",
                message: "Enter Product Id",
                validate: function(num){
                    // Check if item number is valid
                    if (results.find(x => x.id === parseInt(num))) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "qty" ,
                type: "input",
                message: "Please, enter the number of cases to add to inventory",
                validate: (num) => {return common.isNumber(num);}
            }
        ])
        .then(function(res){
            // Update product inventory
            connection.query(`UPDATE products SET stock_quantity = stock_quantity+${res.qty} WHERE ?`, [{id: res.id}], 

                function (err,results) {
                    if (err) throw err;

                    console.log(chalk.green.bold(`\n${results.affectedRows} You just updated the wine!\n`));
                    manageInventory();
                }
            );
        });
    });
}

// Section 2 - 6 =====================================================================================

function exitBamazon() {

    console.log(chalk.magenta.bold("\nThank you for your time and consideration!  See you again soon.!\n"))
    connection.end();
}