var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir   = path.resolve(__dirname, '..', 'templates');
var smtpTransport = require('nodemailer-smtp-transport');
var sha1 = require('sha1');
var User = mongoose.model('User');


/*
** HTML routes **
*/

// GET user login
router.get('/user/list.html', function(req, res, next) {
    res.render('admin/user/list', { title: 'User list', lang : req.params.lang, _layoutFile: 'layout-admin' });
});

// GET user update
router.get('/user/:name/:id([0-9a-f]{24})/update.html', function(req, res, next) {
	var user;
	var ObjectId = require('mongoose').Types.ObjectId;
	User.findOne({ '_id' : new ObjectId(req.params.id) }, function(err, user){
		res.render('admin/user/update', { title: 'User update', lang : req.params.lang, user : user, _layoutFile: 'layout-admin' });
	});
});


module.exports = router;


