var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

//----File Upload Start
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname); // sets file name
  },
   destination: function (req, file, cb) {
    cb(null, "uploads"); //file upload destination
  }
});
var uploadFilter = function (req, file, cb) {
    // accept doc/docx/pdf files only
    if (!file.originalname.match(/\.(doc|docx|pdf)$/i)) {
        return cb(new Error('Only .doc/.docx/PDF files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ // options
    storage: storage,
    fileFilter: uploadFilter
})
//----File Upload End

//handles signup route
router.post("/signup", function(req, res){
  const newUser = new User({
    firstName: req.body.firstName
  });
 
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          req.flash("error", err.message);
          return res.render('index', { title: 'Voice Services Intake Portal' });
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/view-requests");
      });
  });
});
//==============================================================================

  //Show Login Form
  router.get("/validate-inquiries", function(req, res){
    res.render("validate-inquiries", {});
  });
  
  //handling login logic
  router.post("/view-inquires", passport.authenticate("local", 
    {
      successRedirect: "/view-inquiries", 
      failureRedirect: "/validate-inquiries",
      failureFlash: true
    }), function(req, res){});
  router.post("/view-requests", passport.authenticate("local", 
  {
    successRedirect: "/view-requests", 
    failureRedirect: "/validate-requests",
    failureFlash: true
  }), function(req, res){});
  //==============================================================================
  
  //Logout route
  router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/validate-requests");
  });
  //==============================================================================

module.exports = router;
