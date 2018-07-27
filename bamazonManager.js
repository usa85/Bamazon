// Required NPM modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

var sqlConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_DB"
};

const lowInventory = 50;

// create the connection information for the sql database
var connection = mysql.createConnection(sqlConfig);

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    
    manageInventory();
  });
  
// ____________________________________________________________________________________
// Functions
// ____________________________________________________________________________________

function manageInventory() {

    // Prompt user for command selection
    console.log(chalk.blue.bold(`Welcome to Inventory Management System.\n`));
    inquirer.prompt([
        {
            name: "command",
            type: "rawlist",
            message: "Please select a function",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(cmd) {
        // console.log(cmd);
        switch (cmd.command) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
            console.log("nope");
        }

    })
    // connection.end();
}

// ____________________________________________________________________________________

function viewProducts() {

    // Query the DB for all items in store inventory
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        console.log(chalk.blue.bold("\nStore Inventory"));
        displayItems(results);
    });
    // connection.end();
}

// ____________________________________________________________________________________

function viewLowInventory() {

    // Query the DB for all items in store inventory
    connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(err, results) {
        if (err) throw err;

        console.log(chalk.red.bold("\nProducts with Low Inventory"));
        displayItems(results);
    });
    connection.end();
}

// ____________________________________________________________________________________

function addProduct() {

    inquirer.prompt ([
        {
            name: "name",
            type: "input",
            message: "Enter Product Name"
        },
        {
            name: "type" ,
            type: "rawlist",
            message: "Select Product Category",
            choices: ["Equipment", "Apparel", "Shoes"]
        },
        {
            name: "price",
            type: "input",
            message: "Enter Customer Price"
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter Quantity"
        }
    ])
    .then(function(response) {
        // Add new product to inventory
        connection.query("INSERT INTO products SET ?", 
            [{product_name: response.name, department: response.type, customer_price: response.price, stock_quantity: response.quantity}],
            function(err, results) {
                if (err) throw err;

                console.log(chalk.green.bold(`\n${results.affectedRows} product added!\n`));
        });
    });

    // connection.end();

}

// ____________________________________________________________________________________

function addInventory() {
    inquirer.prompt ([
        {
            name: "id",
            type: "input",
            message: "Enter Product Id"
        },
        {
            name: "qty" ,
            type: "input",
            message: "Enter quantity to add to stock"
        }
    ])
    .then(function(res){

    });


}

// ____________________________________________________________________________________

function displayItems(list) {

    console.log(chalk.blue("\nItem #  Product                   Department      Price($)       Available Qty"));
    console.log(chalk.blue("------------------------------------------------------------------------------"));

    // Display the inventory
    for (var i =0; i < list.length; i++) {
        console.log(`${list[i].id.toString().padEnd(7)} ${list[i].product_name.padEnd(25)} ${list[i].department.padEnd(17)} ${list[i].customer_price.toString().padEnd(17)} ${list[i].stock_quantity}`);
    }
    console.log("\n");
}