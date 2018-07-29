// Required NPM modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

// Common functions used in bamazonCustomer/Manager/Supervisor
var common = require("./common.js");

var sqlConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_DB"
};

// create the connection information for the sql database
var connection = mysql.createConnection(sqlConfig);

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    
    common.printHeader("Welcome to Bamazon Supervisor Department Management App","green");
    manageDepartments();
});

// ____________________________________________________________________________________
// Functions
// ____________________________________________________________________________________

function manageDepartments() {

    // Prompt user for command selection
    inquirer.prompt([
        {
            name: "command",
            type: "rawlist",
            message: "Please select a function",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ])
    .then(function(cmd) {
        // console.log(cmd);
        switch (cmd.command) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                addDepartment();
                break;
            case "Exit":
                exitBamazon();
                break;
        }
    });
}

// ____________________________________________________________________________________

function viewSales() {

    // Query the DB for all items in store inventory
    connection.query(
        "SELECT department, (sales.total_sales - departments.over_head_costs) AS total_profit "
        + "FROM (SELECT department, SUM(product_sales) AS total_sales FROM products GROUP BY department) AS sales "
        + "INNER JOIN departments ON sales.department = departments.department_name",
    
    (err, results) => {
        if (err) throw err;

        displaySales(results)
        manageDepartments();
    });
}

// ____________________________________________________________________________________

function addDepartment() {

    let maxDeptLength = 13;

    inquirer.prompt ([
        {
            name: "name",
            type: "input",
            message: "Enter New Department Name",
            validate: function(dept){
                // Check if item number is valid, this method returns the object if itemNumber is found
                if (dept.length <= maxDeptLength) {
                    return true;
                }
                console.log(chalk.red.bold('\nDepartment name too long'));
                return false;
            }

        },
        {
            name: "costs" ,
            type: "input",
            message: "Enter Department Overhead Costs",
        }
    ])
    .then(function(response) {
        // Add new department to list
        connection.query("INSERT INTO departments SET ?", 
            [{department_name: response.name, over_head_costs: response.costs}],
            (err, results) =>  {

            if (err) throw err;

            console.log(chalk.green.bold(`\n${results.affectedRows} product added!\n`));
            manageDepartments();
        });
    });
}

// ____________________________________________________________________________________

function displaySales(list) {
    
    console.log(chalk.green("\nDepartment        Total Profit($)"));
    console.log(chalk.green("--------------------------------"));

    // Display the inventory
    // Don't display product_sales column to customer
    for (var i =0; i < list.length; i++) {
        console.log(`${list[i].department.padEnd(20)} ${list[i].total_profit.toString().padEnd(17)}`);
    }
    console.log("\n");

}
// ____________________________________________________________________________________

function exitBamazon() {

    console.log(chalk.green.bold("\nHave a great day!\n"))
    connection.end();
}