"use strict";
///// init database /////
const playDB = require('./play_db.js');

/////////////////////////////////////////
/// INIT INITIAL TABLES IF NOT EXISTS ///
/////////////////////////////////////////
exports.createCategoryTable = function(){
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS Category ("+
        "categoryId	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE," +
        "categoryName	TEXT NOT NULL UNIQUE," +
        "categoryDescription	TEXT NOT NULL" +
        ");")
      });
  });
}

exports.createProductTable = function(){
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS Product ("+
        "productId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE," +
        "productCategory INTEGER NOT NULL," +
        "description TEXT," +
        "name TEXT NOT NULL," +
        "price	INTEGER NOT NULL," +
        "image	TEXT," +
        "FOREIGN KEY(productCategory) REFERENCES Category(categoryId)" +
        ");")
      });
 });
}

exports.createOrderTable = function(){
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS UserOrder ( "+
        "orderId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, " +
        "orderUserId TEXT NOT NULL, " +
        "orderDate TEXT NOT NULL, " +
        "orderPrice REAL NOT NULL, "  +
        "FOREIGN KEY(orderUserId) REFERENCES User(userId));")
      });
  });
}

exports.createOrderDetailsTable = function(){
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS OrderDetails ("+
        "orderId	INTEGER NOT NULL," +
        "productId INTERGER NOT NULL," +
        "PRIMARY KEY (orderId, productId)" +
        "FOREIGN KEY(productId) REFERENCES User(productId)," +
        "FOREIGN KEY(orderId) REFERENCES UserOrder(orderId)" +
        ");")
      });
  });
}

/////////////////////////////////////////
///////////// SQL QUERIES ///////////////
/////////////////////////////////////////

//// GET ALL PRODUCTS
/// 'view all products'
exports.getAllLicenseProducts = function(callback){
  var query = "SELECT * FROM Product WHERE productCategory = 1;";
  const db = null;
  playDB.getDB(function(db){
    // use each as all returns everything from db, each runs query first
    db.all(query, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

/// GET PRODUCTS BY CATEGORY
/// PARAMETER: categoryId
/// NB: (can store categoryId w/ name? or pass name - get id with another query)
exports.getProductsByCategory = function(categoryId, callback){
  var query = "SELECT * FROM Product WHERE productCategory = ?;";
    // use each as all returns everything from db, each runs query first
  const db = null;
  playDB.getDB(function(db){
    db.all(query, categoryId, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

/// GET ALL CATEGORIES
/// 'view all categories'
exports.getAllCategories = function(callback){
  var query = "SELECT * FROM Category;";
    // use each as all returns everything from db, each runs query first
  const db = null;
  playDB.getDB(function(db){
    db.all(query, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

/// GET PRODUCTS BY PRICE HIGH to LOW
exports.getProductHightoLow = function(callback){
  var query = "SELECT * FROM Product ORDER BY price DESC;";
  const db = null;
  playDB.getDB(function(db){
    // use each as all returns everything from db, each runs query first
    db.all(query, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

/// GET PRODUCTS BY PRICE LOW to HIGH
exports.getProductLowtoHigh = function(callback){
  var query = "SELECT * FROM Product ORDER BY price ASC;";
  const db = null;
  playDB.getDB(function(db){
    // use each as all returns everything from db, each runs query first
    db.all(query, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

//// NEW ORDER
/// get details of order when selecting view order
exports.getOrder = function(orderId, callback){
  var query = "SELECT Product.name AS name, Product.price AS price," +
    "Product.image AS image" +
    "FROM OrderDetails"
    "INNER JOIN UserOrder ON UserOrder.orderId = OrderDetails.orderId" +
    "INNER JOIN Product ON Product.productId = OrderDetails.productId" +
    "WHERE UserOrder.orderId = ?" +
    ";";
  const db = null;
  playDB.getDB(function(db){
    // use each as all returns everything from db, each runs query first
    db.all(query, orderId, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}

//// GET ALL PRODUCTS
/// 'view all products'
exports.viewProduct = function(productId, callback){
  var query = "SELECT * FROM Product WHERE productId = ?;";
  const db = null;
  playDB.getDB(function(db){
    // use each as all returns everything from db, each runs query first
    db.all(query, productId, (err, rows) =>{
      if(rows){
        callback(null, rows);
      } else{
        callback(error, null); // unable to get products
      }
    });
  });
}


///////////////////////////
//// TESTING FUNCTIONS ////
/////// to fill db ////////
///////////////////////////
exports.newCategory = function(categoryDetails){
  var query = "INSERT INTO Category";
  query += " (categoryName, categoryDescription) VALUES (?, ?);";
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run(query, [categoryDetails['categoryName'], categoryDetails['categoryDescription']], function(error){
        if(error){
          console.log(error);
        }
      });
    });
  });
}

// get most recent categoryId to insert into product
exports.getCategoryId = function(err, rows){
  var query = "Select id FROM Category ORDER BY id DESC LIMIT 1;";
  const db = null;
  playDB.getDB(function(db){
    db.run(query, function(error){
      if(rows){
        callback(null, rows);
      } else{
        callback(err, null); // unable to get products
      }
    });
  });
}

exports.newProduct = function(productDetails){
  var query = "INSERT INTO Product";
  query += " (productCategory, description, name, price, image) VALUES (?, ?, ?, ?, ?);";
  const db = null;
  playDB.getDB(function(db){
    db.serialize(() => {
      db.run(query, [productDetails['productCategory'], productDetails['description'], productDetails['name'],  productDetails['price'], productDetails['image']], function(error){
        if(error){
          console.log(error);
        }
      });
    });
  });
}
