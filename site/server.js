var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.engine( 'handlebars', handlebars( {
  defaultLayout:'index',
  extname: '.handlebars',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/'
}));

app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//for post requests



app.get('/', (req, res) => {
	res.render('main', {layout : 'index_head'});
});

app.get('/index', (req, res) => {
	res.render('main', {layout : 'index_head'});
});

app.get('/demo', (req, res) => {
  res.render('demo', {layout : 'index_head'});
});

app.get('/products', (req, res) => {
	res.render('products', {layout : 'product_head'});
});

app.get('/login', (req, res) => {
	res.render('login', {layout : 'login_head'});
});

app.post('/auth', (req, res) => {
  var username = req.body.username;
	var password = req.body.password;
  res.send("request recieved cap'n, with: "+username+" "+password);
});

app.post('/register', (req, res) => {
  var username = req.body.register_user;
	var password = req.body.register_password;
  var confirm_password = req.body.conf_password;
  var email = req.body.register_email;
  res.send("request recieved, registering with info: "+username+password+confirm_password+email);
});


/*
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});
router.get("/",function(req,res){
  res.sendFile(path + "index.html");
  console.log("render this biatch");
  res.render('home', {layout: 'index', template: 'home-template'});
});
router.get("/demo",function(req,res){
  res.sendFile(path + "demo.html");
});
router.get("/login",function(req,res){
  res.sendFile(path + "login.html");
});
router.get("/products",function(req,res){
  res.sendFile(path + "products.html");
});
//app.use("/",router);
app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});*/



// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.


module.exports = app;
