DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

-- Data was provided by http://www.wine-searher.com/find/beaujolais
-- It is a bamazone wine store for retailer.  So product sales is by case of 12 bottles.
-- When operational and revised the database is expended with the 250,000 wine selection API
-- Wine distribution is to be displayed on GIS interactive maps. 

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100),
  department VARCHAR(45),
  customer_price DECIMAL(10,2) DEFAULT 0.00,
  stock_quantity INT DEFAULT 0,
  product_sales DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Fabien Duperray", "Beaujolais ", 48.00, 500, 576.99);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Thibault Liger Belair", "Moulin-a-Vent", 56.00, 1000, 672.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Fabien Duperray", "Moulin-a-Vent", 59, 700, 704.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Dominique Piron", "Beaujolais", 21.00, 2000, 252.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Marcel Lapierre", "Morgon", 29.00, 3000, 360.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Louis Jadot", "Beaujolais", 25.00, 3700, 300.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Georges Duboeuf", "Morgon", 12.00, 6500, 144.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Jean Louis Dutraive", "Morgon", 35.00, 1800, 420.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Yvon Metras Fleurie", "Morgon", 59.00, 5300, 708.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Jean Foillard", "Beaujolais", 66.99, 12500, 803.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Marcel Lapierre", "Beaujolais ", 41.00, 500, 500.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Louis Claude", "Morgon", 35.00, 1000, 420.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Couder Pere", "Moulin-a-Vent", 29.00, 700, 350.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Nicole Chanrion", "Beaujolais", 22.00, 2000, 264.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Yvon Metras", "Beaujolais", 69.00, 3000, 828.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Jean Louis Dutraive", "Beaujolais", 45.00, 3700, 540.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Georges Duboeuf", "Moulin-a-Vent", 9.00, 65500, 108.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Chateau la Chaize", "Brouilly", 18.00, 19000, 216.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("clos de la Roilette", "Brouilly", 43.00, 15900, 520.00);

INSERT INTO products (product_name, department, customer_price, stock_quantity,product_sales)
VALUES ("Jean Marc Burgaut", "Brouilly", 39.00, 12500, 470.00);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) ,
  over_head_costs DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Brouilly", 1700.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Moulin-a-Vent", 2200.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Morgon", 2500.00);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Beaujolais", 3505.00);

