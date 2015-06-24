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

// GET admin index
router.get('/', ensureAdmin, function(req, res, next) {
	res.setLocale("en");
    res.render('admin/index', { title: 'Welcome to the admin panel', lang : req.params.lang, _layoutFile: 'layout-admin' });
});

// GET admin login
router.get('/index.html', ensureAdmin, function(req, res, next) {
	res.setLocale("en");
    res.render('admin/index', { title: 'Log in please', lang : req.params.lang, _layoutFile: 'layout-admin' });
});

// GET admin login
router.get('/login.html', function(req, res, next) {
	res.setLocale("en");
    res.render('admin/login', { title: 'Log in please', lang : req.params.lang, _layoutFile: 'layout-admin' });
});

// GET logout user
router.get('/logout.html', ensureAdmin, function(req, res){
    req.logout();
    res.redirect('/admin');
});


module.exports = router;

