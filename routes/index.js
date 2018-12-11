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
  if (!file.originalname.match(/\.(pdf|doc|docx|csv|xls|mp3|wav)$/i)) {
    return cb(new Error("Only pdf, doc, docx, csv, xls, mp3 and wav files are allowed."), false);
  }
  cb(null, true);
};
var upload = multer({
  // options
  storage: storage,
  fileFilter: imageFilter
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Voice Service Intake Portal' });
});

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
        console.log(req.session);
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

router.get("/clear-search", function(req, res){
  req.session.searchHistory = []
  req.flash("success", "Search History has been cleared!");
  res.redirect("/submissions");
});

function escapeRegex(text) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&');
};

/* GET post-submission page. */
router.get('/post-submission', function(req, res, next) {
  res.render('post-submission', { title: 'Voice Service Intake Portal' });
});

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

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
};

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

//public submissions route
router.post("/send-email", function(req, res) {
  var id = req.body.mainid;
  var clientEmail = req.body.clientEmail;
  var clientName = req.body.clientName;
  console.log(id);
  console.log(clientEmail);
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
    html: "<h1>Hi " + clientName + "!</h1><p>Your existing Voice Service submission has been updated.  Click <a href='http://localhost:3000/submissions/" + id + "/public'>here</a> to view.</p>"
  };
    
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {console.log(error);} else {
      console.log('Email sent: ' + info.response);
    }
  });
});

//POST new Submission
router.post("/submissions", upload.array('documentation', 10), function(req, res){
  //Get Data from form
  var id = req.body.id;
  var name = req.body.name;
  var itemType = req.body.itemType;
  var status = req.body.status;
  var date = req.body.date;
  var email = req.body.email;
  var businessUnit = req.body.businessUnit;
  var languages = req.body.languages;
  var voiceTalent = req.body.voiceTalent;
  var useSelection = req.body.useSelection;
  var use = req.body.use;
  var number = req.body.number;
  var targetDate = req.body.targetDate;
  var description = req.body.description;

  req.body.attachment = req.files;
  var attachment = req.body.attachment;
  req.body.attachment[documentation] = req.files.path;
  var documentation = req.body.attachment[documentation];

  var actionItems = req.body.actionItems;
  var actionItemNotes = req.body.actionItems[actionItemNotes];
  var actionItemAttachments = req.body.actionItems[actionItemAttachments];
  
  var newSubmission = {id: id, name: name, itemType: itemType, status: status, date: date, email: email, businessUnit: businessUnit, languages: languages, voiceTalent: voiceTalent, useSelection: useSelection, use: use, number: number, targetDate: targetDate, description: description, attachment: attachment, documentation: documentation, actionItems: actionItems, actionItemNotes: actionItemNotes, actionItemAttachments: actionItemAttachments};
  ActionItems.create(newSubmission.actionItems, function(err, newlyActionItem) {
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
          html: '<h1>Hello ' + name + '!</h1><p>A new Voice Service submission has been received.  Click <a href="http://localhost:3000/submissions/">here</a> to view.</p>'
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

//new Submission form
router.get("/submissions/new", ensureAuthenticated, function(req, res){
  User.find({}, function(err, allUsers){
    res.render("submissions/new", {title: 'Voice Service Intake Portal', users: allUsers}); 
  })
});

//==============================================================================

//SHOW - show more info about one submissions
router.get("/submissions/:id", ensureAuthenticated, function(req, res) {
  //find the submissions with provided ID
  Submission.findById(req.params.id).exec(function(err, foundSubmission){
    ActionItems.find({}, function(err, allActionItem) {
      User.find({}, function(err, allUsers) {
        if(err) {
          console.log(err);
        } else {
          //console.log(foundSubmission);
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

//edit submissions route
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

//public submissions route
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

//update submissions route
router.put("/submissions/:id", function(req, res){
  console.log(req.body.submission);
  //find and update correct submission
  var actionItem = req.body.actionItem;
  var intake = req.body.submission;
  const intakeEdit = Object.assign(intake, actionItem);
  Submission.findByIdAndUpdate(req.params.id, intakeEdit, function(err, updatedSubmission){
    if(err){
      res.redirect("/submissions");
    } else {
      req.flash("success", "You have successfully updated the submission");
      res.redirect("/submissions/" + req.params.id);
    }
  });
});

//Register form route
router.get("/signup", function(req, res){
  res.render("signup", {title: "Voice Service Intake Portal"})
});
  
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
            console.log(user);
          });

          req.flash('success', 'You have signed up successfuly and can now log in!');
          res.redirect('/login');
        }
      });
    });
  }
});

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

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

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
