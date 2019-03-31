CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE product(
  item_id INTEGER AUTO_INCREMENT NOT NULL ,
  product_name VARCHAR(30) NULL,
  department_name VARCHAR(30) NOT NULL,
  price decimal (10,2) NOT NULL,
  stock_quantity INTEGER,
  PRIMARY KEY (item_id)
);