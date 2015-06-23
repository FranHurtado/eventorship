var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir   = path.resolve(__dirname, '..', 'templates');
var smtpTransport = require('nodemailer-smtp-transport');
var Subscription = mongoose.model('Subscription');
var UserTrack = mongoose.model('UserTrack');
var config = new Array();
config['company'] = 'Eventorship';
config['adminemail'] = 'info@eventorship.com';
config['emailserver'] = 'mail.eventorship.com';
config['emailuser'] = 'no-reply@eventorship.com';
config['emailpass'] = 'eventorship00Z';
config['emailport'] = 465;
config['emailauthtype'] = 'LOGIN';
config['emailssl'] = true;
config['emailtls'] = false;

/*
** HTML routes **
*/

/* GET home page. */
router.get('/', function(req, res, next) {
	var preferredLanguage = req.headers["accept-language"].substring(0, 2);
	preferredLanguage = preferredLanguage == "en" ? "en" : (preferredLanguage == "es" ? "es" : "en");
	// Save user track
	saveUserTrack(req);

	res.redirect('/' + preferredLanguage);
});
router.get('/:lang/', function(req, res, next) {
	res.setLocale(req.params.lang);
	// Save user track
	saveUserTrack(req);

	res.render('index', { title: res.__('Eventorship | Find sporsors for your event'), lang : req.params.lang, _layoutFile: 'layout' });
});

/* GET privacy-policy page. */
router.get('/:lang/privacy-policy.html', function(req, res, next) {
	res.setLocale(req.params.lang);
	// Save user track
	saveUserTrack(req);

	res.render('privacy-policy', { title: res.__('Eventorship | Privacy policy'), lang : req.params.lang, _layoutFile: 'layout' });
});

/* GET terms of use page. */
router.get('/:lang/terms-of-use.html', function(req, res, next) {
	res.setLocale(req.params.lang);
	// Save user track
	saveUserTrack(req);

	res.render('terms-of-use', { title: res.__('Eventorship | Terms of use'), lang : req.params.lang, _layoutFile: 'layout' });
});


/*
** API routes **
*/

/* POST subscribe home page. */
router.post('/:lang/api/subscribe.html', function(req, res, next) {
	var subscription = new Subscription(req.body);

	//Check if email is valid email address
	var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	if(pattern.test(subscription.email) == false)
	{
		res.json({'status' : '1', 'message' : res.__('Not a valid email address')});
	}
	else
	{	
		// Check if the email already exists
		Subscription.findOne({ email : subscription.email }, function(err, subscription){
			if(err){ return next(err); }

			console.log(subscription);

			// Email doesn't exists
			if (subscription === null)
			{
				var subscription = new Subscription(req.body);
				subscription.save(function(err, post){
			    	if(err){ return next(err); }

			    	res.json({'status' : '0', 'message' : res.__('Your subscription is complete')});
			  	});
			}
			else
			{
				res.json({'status' : '1', 'message' : res.__('Your email already exists')});
			}
		});
	}
});

/* POST contact home page. */
router.post('/:lang/api/contact.html', function(req, res, next) {
	//Check if all fields are completed
	if(typeof req.body.name == "undefined" || typeof req.body.email == "undefined" || typeof req.body.comments == "undefined" || req.body.name == "" || req.body.email == "" || req.body.comments == "")
	{
		res.json({'status' : '1', 'message' : res.__('All fields are mandatory')});
	}
	else
	{	
		//Send contact to company email
		var data = {
			introText      : res.__('You have received a new contact request from Eventorship website.'),
			name           : req.body.name,
			nameTitle      : res.__('Name'),
			email          : req.body.email,
			emailTitle     : res.__('Email'),
			comments       : req.body.comments,
			commentsTitle  : res.__('Comments')
		}

		var transporter = nodemailer.createTransport(smtpTransport({
		    host       : config['emailserver'],
		    port       : config['emailport'],
		    secure     : config['emailssl'],
		    tls        : { 
		    				rejectUnauthorized: config['emailtls']
		    },
		    auth       : {
		        			user: config['emailuser'],
		        			pass: config['emailpass']
		    },
		    authMethod : config['emailauthtype']
		}));

		//Build template and send message
		emailTemplates(templatesDir, function(err, template) {
			if (err) {
    			console.log(err);
  			} else {
				template('contact-email', data, function(err, html, text) {
			    	if (err) {
			        	console.log(err);
			      	} else {
			        	transporter.sendMail({
			          		from: config['company'] + ' <' + config['emailuser'] + '>',
				    		to: config['adminemail'],
				    		subject: res.__('Contact request from Eventorship page'),
			          		html: html,
			          		text: text
			        	}, function(err, responseStatus) {
			          		if (err) {
			            		console.log(err);
			          		} else {
			            		console.log(responseStatus.message);
			            		res.json({'status' : '0', 'message' : res.__('Your contact request is sent. Thank you')});
			          		}
			        	});
			      	}
			    });
			}
		});
	}
});


function saveUserTrack(req)
{
	usertrack = new UserTrack();
	usertrack.user = typeof req.user != "undefined" ? req.user._id : null;
	usertrack.url = req.get('host') + req.originalUrl;
	usertrack.ip = req.ip + " | " + req.ips;
	usertrack.user_agent = req.headers['user-agent'];
	usertrack.save();
}

module.exports = router;
