var express = require('express');
var router = express.Router();
var Submission = require("../models/submissions");
var User = require("../models/user");
var ActionItems = require("../models/actionItem");
var middleware = require("../middleware");
var passport = require("passport");
var moment = require('moment');
var nodemailer = require('nodemailer');
var methodOverride = require("method-override");
const escapeStringRegexp = require('escape-string-regexp');
var localStrategy = require("passport-local");
var session = require("express-session");
var User = require("../models/user");
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname); // sets file name
  },
  destination: function(req, file, cb) {
    cb(null, "uploads"); //file upload destination
  }
});
var imageFilter = function(req, file, cb) {
  // set acceptable file types
  if (!file.originalname.match(/\.(pdf|doc|docx|csv|xls|txt|mp3|wav|png|jpg|jpeg)$/i)) {
    return cb(new Error("Only pdf, doc, docx, csv, xls, mp3, txt, png, jpeg,  and wav files are allowed."), false);
  }
  cb(null, true);
};
var upload = multer({
  // options
  storage: storage,
  fileFilter: imageFilter
});
//==============================================================================

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Voice Service Intake Portal' });
});
//==============================================================================

/* GET home page. */
router.get("/search", function(req, res){
  req.session.searchHistory = req.session.searchHistory || [];

  if (req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'g');
    
    Submission.find({$text: {$search : regex}}, function(err, allSubmissions){
      console.log(regex);
      if(err){
        console.log("Something went wrong");
        console.log(err);
      } else {
        if (req.session.searchHistory.indexOf(req.query.search) === -1){
          req.session.searchHistory.unshift(req.query.search);
        } else {
          var searchIndex = req.session.searchHistory.indexOf(req.query.search);
          var array = req.session.searchHistory;
          array.splice(searchIndex, 1);
          req.session.searchHistory.unshift(req.query.search);
        }
        res.render("search-results", {
          title: 'Voice Service Intake Portal',
          submissions : allSubmissions,
          searchWord: req.query.search,
          searchHistory: req.session.searchHistory
        });
      }
    }).sort({});   
  } else {
    req.flash("error", "You didn't enter a search word.");
    res.redirect("/submissions");
    console.log(req.flash.error);
  }
});
//==============================================================================

/* GET clear-search page. */
router.get("/clear-search", function(req, res){
  req.session.searchHistory = []
  req.flash("success", "Search History has been cleared!");
  res.redirect("/submissions");
});
//==============================================================================

function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&');
};
//==============================================================================

/* GET client-email-success page. */
router.get('/client-email-success', function(req, res, next) {
  res.render('client-email-success', { title: 'Voice Service Intake Portal' });
});
//==============================================================================

/* GET post-submission page. */
router.get('/post-submission', function(req, res, next) {
  res.render('post-submission', { title: 'Voice Service Intake Portal' });
});
//==============================================================================

/* GET submissions page. */
router.get('/submissions', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
};
//==============================================================================

/* GET submissions received page. */
router.get('/submissions/received', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions/received", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

/* GET submissions in progress page. */
router.get('/submissions/in-progress', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions/in-progress", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

/* GET submissions on hold page. */
router.get('/submissions/on-hold', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions/on-hold", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

/* GET submissions awaiting review page. */
router.get('/submissions/awaiting-review', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions/awaiting-review", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

/* GET submissions completed page. */
router.get('/submissions/completed', ensureAuthenticated, function(req, res) {
  Submission.find({}, function(err, allSubmissions){
    User.find({}, function(err, allUsers){ 
      ActionItems.find({}, function(err, allActionItem) {
        if(err){
          console.log(err);
        } else {
          res.render("submissions/completed", { 
            title: 'Voice Service Intake Portal',
            submissions: allSubmissions,
            actionItem: allActionItem,
            users: allUsers
          });
        }
      });
    });
  });
});
//==============================================================================

//POST send email TO client route
router.post("/send-email", function(req, res) {
  var id = req.body.mainid;
  var clientEmail = req.body.clientEmail;
  var clientName = req.body.clientName;
  res.render("email-success", { 
    title: 'Voice Service Intake Portal'
  });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {user: 'westvoiceservices@gmail.com', pass: 'televoice1'}
  });
    
  var mailOptions = {
    from: 'NoReply <westvoiceservices@gmail.com>',
    to: clientEmail,
    subject: 'Your Voice Service submission',
    html: "<h1>Hi " + clientName + "!</h1><p>Your existing West Voice Service submission has been updated.  If you would like to add additional documentation or notes to your submission, please do so by clicking <a href='http://localhost:3000/submissions/" + id + "/public'>here</a>.<br /></p><p>Thank you,</p><h3><em>Your West Voice Service Team</em></h3>"
  };
    
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {console.log(error);} else {
      console.log('Email sent: ' + info.response);
    }
  });
});
//==============================================================================

//public send email FROM client route
router.post("/send-client-email", function(req, res) {
  var id = req.body.mainid;
  var clientEmail = req.body.clientEmail;
  var clientName = req.body.clientName;
  res.render("email-success", { 
    title: 'Voice Service Intake Portal'
  });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {user: 'westvoiceservices@gmail.com', pass: 'televoice1'}
  });
    
  var mailOptions = {
    from: 'NoReply <westvoiceservices@gmail.com>',
    to: 'westvoiceservices@gmail.com',
    subject: 'A Voice Service submission has been update',
    html: "<h1>Hello!</h1><p>A Voice Service submission for " + clientName + " has been updated.  Click <a href='http://localhost:3000/submissions/" + id + "/public'>here</a> to view.</p>"
  };
    
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {console.log(error);} else {
      console.log('Email sent: ' + info.response);
    }
  });
});
//==============================================================================

//POST new Submission
router.post("/submissions", upload.array('attachment'), function(req, res){
  //Get Data from form
  var newDoc = [];

  req.files.map((attachment) => {
    newDoc.push(attachment.path);
  })
console.log("--------------------");
console.log(newDoc);

  var actionItems = {
    actionItemNotes: req.body.actionItemNotes,
    actionItemAttachments: req.body.actionItemAttachments
  };

  var submission = req.body;
  const newSubmission = Object.assign(submission, { actionItems: actionItems, attachment: newDoc });
  ActionItems.create(submission.actionItems, function(err, newlyActionItem) {
    Submission.create(newSubmission, function(err, newlySubmitted) {
      if(err) {console.log(err);} else {
        //redirect back to submissions
        //req.flash("success", "You have successfully created a submission");
        res.render("post-submission", {title: 'Voice Service Intake Portal'});
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {user: 'westvoiceservices@gmail.com', pass: 'televoice1'}
        });
        
        var mailOptions = {
          from: 'westvoiceservices@gmail.com',
          to: 'westvoiceservices@gmail.com',
          subject: 'New Voice Service Submission',
          html: '<h1>Hello!</h1><p>A new Voice Service submission has been received.  Click <a href="http://localhost:3000/submissions/">here</a> to view.</p>'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {console.log(error);} else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  });
});
//==============================================================================

//GET new Submission form
router.get("/submissions/new", ensureAuthenticated, function(req, res){
  User.find({}, function(err, allUsers){
    res.render("submissions/new", {title: 'Voice Service Intake Portal', users: allUsers}); 
  })
});
//==============================================================================

//SHOW - show more info about one submission
router.get("/submissions/:id", ensureAuthenticated, function(req, res) {
  //find the submissions with provided ID
  Submission.findById(req.params.id).exec(function(err, foundSubmission){
    ActionItems.find({}, function(err, allActionItem) {
      User.find({}, function(err, allUsers) {
        if(err) {
          console.log(err);
        } else {
          //render show template
          res.render("submissions/show", {
            title: 'Voice Service Intake Portal',
            submission: foundSubmission,
            actionItem: allActionItem,
            users: allUsers,
            moment: moment
          });
        }
      });
    });
  });
});
//==============================================================================

//GET edit submissions route
router.get("/submissions/:id/edit", ensureAuthenticated, function(req, res) {
  Submission.findById(req.params.id, function(err, foundSubmission) {
    ActionItems.find({}, function(err, allActionItem) {
      User.find({}, function(err, allUsers) {
        res.render("submissions/edit", {
          title: 'Voice Service Intake Portal',
          submission: foundSubmission,
          actionItem: allActionItem,
          users: allUsers,
          moment: moment
        });
      });
    });
  });
});
//==============================================================================

//GET public submissions route
router.get("/submissions/:id/public", function(req, res) {
  Submission.findById(req.params.id, function(err, foundSubmission) {
    ActionItems.find({}, function(err, allActionItem) {
      User.find({}, function(err, allUsers) {
        res.render("submissions/public", {
          title: 'Voice Service Intake Portal',
          submission: foundSubmission,
          actionItem: allActionItem,
          users: allUsers,
          moment: moment
        });
      });
    });
  });
});
//==============================================================================

//PUT -- update public submission route
router.put("/submissions/:id/public", upload.array('attachments'), function(req, res){
  Submission.findById(req.params.id, function (err, foundSubmission) {
    const {submission} = req.body;
    //Assemble the action item
    var newDoc = [], existingActionItems = [];
    for (i=0; i <foundSubmission.actionItems.length; i++){
      existingActionItems.push(foundSubmission.actionItems[i]);
    }
    req.files.map((attachments) => {
      newDoc.push(attachments.path);
    });
    const newAttachment = Object.assign({
      actionItemNotes: req.body.actionItemNotes,
      actionItemAttachments: newDoc
    });
    existingActionItems.push(newAttachment);
    var updatedSub = Object.assign(submission, {
      actionItems: existingActionItems
    });
    // find and update correct submission
    Submission.findByIdAndUpdate(req.params.id, updatedSub, function(err, updatedSubmission){
      var id = req.body.mainid;
      var clientEmail = req.body.clientEmail;
      var clientName = req.body.clientName;
      if(err){
        res.redirect("/submissions");
      } else {
        req.flash("success", "You have successfully updated the submission");
        res.render("client-email-success", {
          title: 'Voice Service Intake Portal'
        });
      
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {user: 'westvoiceservices@gmail.com', pass: 'televoice1'}
        });
          
        var mailOptions = {
          from: 'NoReply <westvoiceservices@gmail.com>',
          to: 'westvoiceservices@gmail.com',
          subject: 'A Voice Service submission has been updated',
          html: "<h1>Hi!</h1><p>An existing Voice Service submission from " + clientName + " has been updated.  Log in <a href='http://localhost:3000/submissions/'>here</a> to view.</p>"
        };
          
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {console.log(error);} else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  })
});
//==============================================================================

//update submissions route
router.put("/submissions/:id", upload.array('attachments'), function(req, res){
  Submission.findById(req.params.id, function (err, foundSubmission) {
    const {submission} = req.body;
    // //Assemble the action item
    var newDoc = [],
      existingActionItems = [];
    for (i=0;i<foundSubmission.actionItems.length;i++){
      existingActionItems.push(foundSubmission.actionItems[i]);
    }
    req.files.map((attachments) => {
      newDoc.push(attachments.path);
    });
    // console.log(existingActionItems);
    const newAttachment = Object.assign({
      actionItemNotes: req.body.actionItemNotes,
      actionItemAttachments: newDoc
    });
    existingActionItems.push(newAttachment);
    var updatedSub = Object.assign(submission, {
      actionItems: existingActionItems
    });
    // find and update correct submission
    Submission.findByIdAndUpdate(req.params.id, updatedSub, function(err, updatedSubmission){
      if(err){
        res.redirect("/submissions");
      } else {
        req.flash("success", "You have successfully updated the submission");
        res.redirect("/submissions/" + req.params.id);
      }
    });
  })
});
//==============================================================================

//Register form route
router.get("/signup", function(req, res){
  res.render("signup", {title: "Voice Service Intake Portal"})
});
//==============================================================================

//handles signup route
router.post("/signup", function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var role = req.body.role;
  var username = req.body.username;
  var password = req.body.password;

  //Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('signup', {
      title: "Voice Service Intake Portal", 
      errors: errors
    });
  } else {
		//checking for email and username are already taken
		User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	  }}, function (err, user) {
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		  }}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
        } else {
          var newUser = new User({
            name: name,
            email: email,
            username: username,
            role: role,
            password: password
          });

          User.createUser(newUser, function(err, user){
            if(err) throw err;
          });

          req.flash('success', 'You have signed up successfuly and can now log in!');
          res.redirect('/login');
        }
      });
    });
  }
});
//==============================================================================

passport.use(new localStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, req.flash('success', 'You have successfully logged in!' ));
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, req.flash('error', 'Invalid login credentials' ));
				}
			});
		});
  })
);
//==============================================================================

passport.serializeUser(function (user, done) {
	done(null, user.id);
});
//==============================================================================

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
//==============================================================================
  
//Show Login Form
router.get("/login", function(req, res){
  res.render("login", {title: "Voice Service Intake Portal", user: req.user });
});
//==============================================================================

//handling login logic
router.post('/login', passport.authenticate('local', {successRedirect:'/submissions', faliureRedirect:'login', failureFlash:true}), function(req, res) {
  res.redirect('/submissions');
});
//==============================================================================
  
//Logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You have successfully logged out!");
  req.session.destroy();
  res.redirect("/login");
});
//==============================================================================

module.exports = router;
