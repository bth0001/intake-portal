var express = require("express");
var router = express.Router();
var Submissions = require("../models/submissions");
var User = require("../models/users");
var middleware = require("../middleware");
var moment = require('moment');

//Submissions index route
router.get("/submissions", function(req, res){
  Submissions.find({}, function(err, allSubmissions){
    if(err){
      console.log(err);
    } else {
      res.render("submissions/index", {Submissions: allSubmissions, moment: moment});
    }
  });
});

//POST new Submission
router.post("/submissions", function(req, res){
  //Get Data from form
  var id = req.body._id;
  var itemType = req.body.itemType;
  var status = req.body.status;
  var date = req.body.date;
  var email = req.body.email;
  var businessUnit = req.body.businessUnit;
  var languages = req.body.languages;
  var voiceTalent = req.body.voiceTalent;
  var use = req.body.use;
  var useSelection = req.body.useSelection;
  var targetDate = req.body.targetDate;
  var number = req.body.number;
  var description = req.body.description;
  var attachment = req.body.attachment;
  //var author = {id: req.user._id, name: req.user.name, email: req.user.email};
  var newSubmission = {_id: id, name: name, itemType: itemType, status: status, date: date, email: email, businessUnit: businessUnit, languages: languages, voiceTalent: voiceTalent, useSelection: useSelection, use: use, number:number, targetDate: targetDate, description: description, attachment: attachment/*, author: author*/};

  Submissions.create(newSubmission, function(err, newlyCreatedSubmission){
    if(err){
      console.log(err);
    } else {
      //redirect back to submissions
      //req.flash("success", "You have successfully created a submission");
      res.redirect("/submissions", { title: 'Voice Service Intake Portal' });
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
        subject: 'New Voice Service Submission',
        html: '<h1>Hello!</h1><p>A new Voice Service submission has been received.  Sign in <a href="http://localhost:3000/submissions">here</a> to view.</p>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
    }
  })
});

//new Submission form
router.get("/submissions/new", function(req, res){
  User.find({}, function(err, allUsers){
    res.render("submissions/new", {users: allUsers}); 
  })
});

//==============================================================================

//SHOW - show more info about one submissions
router.get("/submissions/:id", function(req, res){
  //find the submissions with provided ID
  Submissions.findById(req.params.id).exec(function(err, foundSubmission){
    if(err) {
      console.log(err);
    } else {
      console.log(foundSubmission);
      //render show template with that campground
      res.render("submissions/show", {submission: foundSubmission, moment: moment});
    }
  });
});

//edit submissions route
router.get("/submissions/:id/edit", function(req, res){
  console.log("------TEST-----");
  Submissions.findById(req.params.id, function(err, foundSubmission){
    res.render("submissions/edit", {submission: foundSubmission, moment: moment});
  });
});
//update submissions route
router.put("/submissions/:id", middleware.checkSubmissionOwnership, function(req, res){
  //find and update correct submission
  console.log("------TEST-----");
    console.log(req.body.submission2);
  Submissions.findByIdAndUpdate(req.params.id, req.body.submission, function(err, updatedSubmission){
    if(err){
      res.redirect("/submissions");
    } else {
      req.flash("success", "You have successfully updated the submission");
      res.redirect("/submissions/" + req.params.id);
    }
  });
});

module.exports = router;