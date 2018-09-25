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
    
    common.printHeader("Welcome to Bamazon Wine Department Store App","green");
    manageDepartments();
});

// ========================================================


function manageDepartments() {

    // Prompt user for command selection
    inquirer.prompt([
        {
            name: "command",
            type: "rawlist",
            message: "Please select a function",
            choices: ["View Wine Product Sales by Wine Types", "Create New Wine Types", "Exit"]
        }
    ])
    .then(function(cmd) {
        // console.log(cmd);
        switch (cmd.command) {
            case "View Wine Product Sales by Wine Types":
                viewSales();
                break;
            case "Create New Wine Types":
                addDepartment();
                break;
            case "Exit":
                exitBamazon();
                break;
        }
    });
}

//================================================================

function viewSales() {

    // First, select a list of departments with total sales for each department. Then, use this information to subtract
    // department overhead costs from total sales for each department. Query returns a list of departments and the
    // total profits for each department.
    connection.query(
        "SELECT sales.department_name, departments.over_head_costs, (sales.total_sales - departments.over_head_costs) AS total_profit "
		+ "FROM (SELECT department_name, SUM(product_sales) AS total_sales FROM products "
        + "RIGHT JOIN departments ON department = department_name GROUP BY department_name) AS sales "
        + "INNER JOIN departments ON sales.department_name = departments.department_name",
    
    (err, results) => {
        if (err) throw err;

        common.printHeader("Product Sales by Wine Type", "green")
        displaySales(results)
        manageDepartments();
    });
}

// ======================================================================

function addDepartment() {

    let maxDeptLength = 12;

    inquirer.prompt ([
        {
            name: "name",
            type: "input",
            message: "Enter New Wine Type",
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
            validate: (num) => {return common.isNumber(num);}
        }
    ])
    .then(function(response) {
        // Add new department to list
        connection.query("INSERT INTO departments SET ?", 
            [{department_name: response.name, over_head_costs: response.costs}],
            (err, results) =>  {

            if (err) throw err;

            console.log(chalk.green.bold(`\n${results.affectedRows} You added a new Wine type!\n`));
            manageDepartments();
        });
    });
}

//=============================================================================================

function displaySales(list) {
    
    console.log(chalk.green("\nWine Type        Total Profit($)"));
    console.log(chalk.white("--------------------------------"));

    // Display the sales by wine types
    for (var i =0; i < list.length; i++) {
        // If value is null, due to no sales for any product in selected wine type, then set value to over head costs as a loss or negative value
        if (list[i].total_profit === null){
            list[i].total_profit = -list[i].over_head_costs;
        }
        console.log(`${list[i].department_name.padEnd(20)} ${list[i].total_profit.toFixed(2)}`);
    }
    console.log("\n");
}
// ===========================================================================

function exitBamazon() {

    console.log(chalk.yellow.bold("\nThank you for your time can consideration!  See you again soon!\n"))
    connection.end();
}