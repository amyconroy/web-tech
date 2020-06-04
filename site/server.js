//var flash = require('flash');
var createError = require('http-errors'); //change these to constants so cant be changed?
var express = require('express');
var path = require('path');
var port = 8080; //443 is https defaul port
//////////////////////
/// OTHER PACKAGES ///
/////////////////////
var cookieParser = require('cookie-parser');
var uuid = require('uuid/v4');
var session = require('express-session');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser'); //for post requests
var md5 = require('md5'); // use for creating a hash for passwords, need to change to SHA-1
var bodyParser = require('body-parser');
var helmet = require('helmet'); // for security
//////////////////
/// EXPRESS /////
/////////////////
var app = express();
var router = express.Router(); //our router for requests

/////////////////////
///// SECURITY //////
/////////////////////
app.use(helmet()); // protects against attacks on express

//////////////////////////////
/// CERTIFICATES and HTTPS ///
//////////////////////////////
const https = require('https'), fs = require("fs");
//https and openSSL setup, self signed certificates so browser will have a 'do you want to accept risk' page
var key = fs.readFileSync(__dirname+"/keys/selfsigned.key"); //get the key/cert generated by openssl
var cert = fs.readFileSync(__dirname+"/keys/selfsigned.crt");
var options = {
  key: key,
  cert: cert
};
var httpsServer = https.createServer(options, app); //create http server on correct port
httpsServer.listen(port, "localhost");

//////////////////////////////
/// HANDLEBARS VIEW ENGINE ///
//////////////////////////////
app.engine( 'handlebars', handlebars( {
  defaultLayout:'index',
  extname: '.handlebars',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/'
}));
console.log("Visit http(s)://localhost:8080/");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// static delivery of public folder
app.use(logger('dev'));


///////////////////
/// BODY-PARSER ///
///////////////////
app.use(express.urlencoded({ extended: true })); /// supporting URL-encoded bodies
app.use(bodyParser.json()); // supporting JSON-econded bodies

//cookies for session storage
app.use(cookieParser());
app.use(session({
    genid: function(req) {
      return uuid() // use UUIDs for session IDs
    },
    secure:false,
    secret: "343ji43j4n3jn4jk3n",
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  }));


//////////////
/// FLASH ///
/////////////
/*app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());*/

///////////////
/// ROUTING ///
//////////////
var indexRoute = require('./routes/index.js');
var demoRoute = require('./routes/demo.js');
var loginRoute = require('./routes/login.js');
var commentsRoute = require('./routes/comments.js');
var productsRoute = require('./routes/products.js');
var downloadsRoute = require('./routes/downloads.js');
var policyRoute = require('./routes/policy.js');
var termsRoute = require('./routes/terms.js');
app.use('/', indexRoute);
app.use('/index', indexRoute);
app.use('/demo', demoRoute);
app.use('/products', productsRoute);
app.use('/login', loginRoute);
app.use('/downloads', downloadsRoute);
app.use('/comments', commentsRoute);
app.use('/policy', policyRoute);
app.use('/terms', termsRoute);

app.use(express.static(path.join(__dirname, '/public')));
app.use('/login', express.static(__dirname + '/public')); //for error message rendering
app.use('/comments', express.static(__dirname + '/public'));
app.use('/downloads', express.static(__dirname + '/public'));
///////////////////////////////
/// FILL DB WITH DUMMY DATA ///
///////////////////////////////
const fillDB = require('./fillDB.js');
fillDB.createTables();
// fillDB.fillUsers();
//fillDB.fillComments();
//fillDB.fillCategories();
//fillDB.fillGameProducts();
//fillDB.fillAnimationsProducts();
//fillDB.fillBackgroundProducts();

/////////////////////
/// ERROR HANDLER ///
////////////////////
// set error to be 404 if the page isnt found
app.use(function(req, res, next){
  let err = new Error('Page Not Found');
  err.statusCode = 404;
  err.shouldRedirect = true;
});

// ensure that stack trace is not leaked to the user but for dev purposes
/* if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            errorMessage: err.message,
            error: err
        });
    });
} */

app.use(function (err, req, res, next) {
  console.error(err.message); // log error message to the server console
  if(!err.statusCode) err.statusCode = 500;
  // if(err.shouldRedirect){
    res.render('error', {
      errorMessage: err.message,
      error: err
//    });
});
  /* else {
    res.status(err.statusCode).send(err.message);
  } */
});

module.exports = app;
