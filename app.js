var express = require('express');
var app = express();
var flash = require("connect-flash");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require("passport");
var session = require("express-session");
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var Request = require('./models/requests');
var Inquiry = require('./models/inquiries');
var nodemailer = require('nodemailer');
var methodOverride = require("method-override");

// Required Files
var User = require("./models/user");
var indexRouter = require('./routes/index');
var authRoutes = require('./routes/authentication');

mongoose.Promise = global.Promise;mongoose.connect("mongodb://admin:voiceadmin1@ds018268.mlab.com:18268/voice-services");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('debug', true);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}));
app.use(flash());
app.use('/uploads', express.static(__dirname + '/uploads'));
//==============================================================================
//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy(function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect email.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//==============================================================================
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ----For Route Files----start
app.use('/', [
  indexRouter,
  authRoutes
]);


app.all("*", isLoggedIn); // For Authentication 
// ----For Route Files----end

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in First!");
  res.redirect("/");
}

//==============================================================================
app.post('/post-request', function (req, res) {
  var requestData = new Request(req.body);
  requestData.save()
  .then(item => {
    res.render('post-request', { title: 'Request succesfully submitted.  We will contact you shortly!' });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'westvoiceservices@gmail.com',
        pass: 'televoice1'
      }
    });
    
    var mailOptions = {
      from: 'westvoiceservices@gmail.com',
      to: 'westvoiceservices@gmail.com',
      subject: 'New Voice Services Request',
      html: '<h1>Hello!</h1><p>A new Voice Services request has been received.  Sign in <a href="http://localhost:3000/view-requests">here</a> to view.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
  })
  .catch(err => {
    res.status(400).send("Unable to save to database");
  });
});

app.post('/post-inquiry', function (req, res) {
  var inquiryData = new Inquiry(req.body);
  inquiryData.save()
  .then(item => {
    res.render('post-inquiry', { title: 'Your inquiry has been recevied.  We will contact you shortly!' });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'westvoiceservices@gmail.com',
        pass: 'televoice1'
      }
    });
    
    var mailOptions = {
      from: 'westvoiceservices@gmail.com',
      to: 'westvoiceservices@gmail.com',
      subject: 'New Voice Services Inquiry',
      html: '<h1>Hello!</h1><p>A new Voice Services inquiry has been received.  Sign in <a href="http://localhost:3000/view-inquiries">here</a> to view.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
  })
  .catch(err => {
    res.status(400).send("Unable to save to database");
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use('/', indexRouter);
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
