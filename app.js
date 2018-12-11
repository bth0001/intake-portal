var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require("connect-flash");
var session = require("express-session");
var logger = require('morgan');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var methodOverride = require("method-override");
var db = mongoose.connection;
const errorHandler = require("./handlers/error");

// Required Files
var User = require("./models/user");
var indexRouter = require('./routes/index');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://admin:voiceadmin1@ds018268.mlab.com:18268/voice-services", { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('debug', true);
app.use(logger('dev'));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'secret',
  saveUninitialized: true,
  resave: true})
);
// Connect Flash
app.use(flash());

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'), root = namespace.shift(), formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));



app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

app.use(function (req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.moment = req.flash('moment');
  next();
});

//==============================================================================

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );

app.use('/', indexRouter);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Log in First!");
  res.redirect("/login");
}

//ERROR HANDLING SETUP
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  req.flash("error", "Page does not Exist: 404");
  res.redirect("/login");
});

app.use(errorHandler);
app.use('/index', indexRouter);

module.exports = app;
