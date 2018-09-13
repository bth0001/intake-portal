var express = require('express');
var router = express.Router();
var Requests = require('../models/requests');
var Inquiries = require('../models/inquiries');
var User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Voice Services Intake Portal' });
});

/* GET post-request page. */
router.get('/post-request', function(req, res, next) {
  res.render('post-request', { title: 'Voice Services Intake Portal' });
});

/* GET post-inquiry page. */
router.get('/post-inquiry', function(req, res, next) {
  res.render('post-inquiry', { title: 'Voice Services Intake Portal' });
});

/* GET validate-requests page. */
router.get('/validate-requests', function(req, res) {
  Requests.find({}, function(err, allRequests){
    User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        res.render("validate-requests", { 
          title: 'Voice Services Intake Portal',
          requesting: allRequests,
          users: allUsers
        });
      }
    })
  })
});

/* GET validate-inquiries page. */
router.get('/validate-inquiries', function(req, res) {
  Inquiries.find({}, function(err, allInquiries){
    User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        res.render("validate-inquiries", { 
          title: 'Voice Services Intake Portal',
          inquiring: allInquiries,
          users: allUsers
        });
      }
    })
  })
});

/* GET view-requests page. */
router.get('/view-requests', function(req, res) {
  Requests.find({}, function(err, allRequests){
    User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        res.render("view-requests", { 
          title: 'Voice Services Intake Portal',
          requesting: allRequests,
          users: allUsers
        });
      }
    })
  })
});

/* GET view-inquiries page. */
router.get('/view-inquiries', function(req, res) {
  Inquiries.find({}, function(err, allInquiries){
    User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        res.render("view-inquiries", { 
          title: 'Voice Services Intake Portal',
          inquiring: allInquiries,
          users: allUsers
        });
      }
    })
  })
});

module.exports = router;
