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
var Event = mongoose.model('Event');


/*
** HTML routes **
*/

// GET event list
router.get('/:lang/event/list.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('event/index', { title: 'Event list', lang : req.params.lang, _layoutFile: 'layout' });
});

// GET event update form
router.get('/:lang/event/:id/update.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('event/update', { title: 'Event update', lang : req.params.lang, _layoutFile: 'layout' });
});

//GET event create form
router.get('/:lang/event/create.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('event/create', { title: 'Event create', lang : req.params.lang, _layoutFile: 'layout' });
});

// GET event view
router.get('/:lang/event/:id/view.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('event/view', { title: 'Event details', lang : req.params.lang, _layoutFile: 'layout' });
});


/*
** API routes **
*/

// GET JSON event list
router.get('/:lang/api/event/list.html', function(req, res, next) {
    User.find(function(err, posts){
        if(err){ return next(err); }

        res.json(posts);
    }).populate('city').populate('country').populate('status').populate('profile');
});

// POST JSON event single
router.post('/:lang/api/event/get.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
    User.findOne({ _id : new ObjectId(req.body.id) }, function(err, user){
        if(err){ return next(err); }

        res.json(user);
    }).populate('city').populate('country').populate('status').populate('profile');
});

// POST JSON event insert
router.post('/:lang/api/event/create.html', function(req, res, next) {
    var event = new Event(req.body);

    //Check if event's fields are completed
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(typeof event.title == 'undefined'){ res.json({'status' : '1', 'message' : res.__('Title is mandatory')}); }
    if(typeof event.subtitle == 'undefined'){ res.json({'status' : '1', 'message' : res.__('Subtitle is mandatory')}); }
    if(typeof event.city == 'undefined'){ res.json({'status' : '1', 'message' : res.__('City is mandatory')}); }
    if(typeof event.country == 'undefined'){ res.json({'status' : '1', 'message' : res.__('Country is mandatory')}); }
    if(typeof event.budget == 'undefined'){ res.json({'status' : '1', 'message' : res.__('Budget is mandatory')}); }
    if(typeof event.currency == 'undefined'){ res.json({'status' : '1', 'message' : res.__('Currency is mandatory')}); }

    var event = new Event(req.body);
    event.save(function(err, post){
        if(err){ return next(err); }

        //Send confirmation email
        var data = {
            siteRoot        : siteRoot,
            lang            : req.params.lang,
            introText       : res.__('Hi ' + post.firstname + " " + post.lastname + "! You have published a new event called '" + post.title + "'."),
            btnLabel        : res.__('View event'),
            account_id      : post._id,
            email_signature : config['emailSignature'],
            footer_text     : config['emailFooterText'],
            footer_btn      : config['emailFooterButton']
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
                template('event-posted', data, function(err, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                        transporter.sendMail({
                            from: config['company'] + ' <' + config['emailuser'] + '>',
                            to: post.email,
                            subject: res.__('Congratulations! Your event has been posted on Eventorship'),
                            html: html,
                            text: text
                        }, function(err, responseStatus) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(responseStatus.message);
                            }
                        });
                    }
                });
            }
        });

        res.json({'status' : '0', 'event' : event});
    });

});

// POST JSON event update
router.post('/:lang/api/event/update.html', function(req, res, next) {
    var user = new User(req.body);

    //Check if user's fields are completed
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(typeof user.firstname == 'undefined' || 
        typeof user.lastname == 'undefined' || 
        typeof user.city == 'undefined' || 
        typeof user.country == 'undefined' || 
        typeof user.profile == 'undefined'  || 
        typeof user.status == 'undefined' || 
        user.firstname == '' || 
        user.lastname == '' || 
        user.password == '' || 
        user.city == '' || 
        user.country == '' || 
        user.profile == '' || 
        user.status == '')
    {
        res.json({'status' : '1', 'message' : res.__('All fields are mandatory')});
    }
    else if(pattern.test(user.email) == false)//Check if email is valid email address
    {
        res.json({'status' : '1', 'message' : res.__('Not a valid email address')});
    }
    else
    {
        User.findById(req.body._id, function(err, user) {
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.city = req.body.city;
            user.country = req.body.country;
            user.profile = req.body.profile;
            user.status = req.body.status;

            user.save(function(err, user){
                res.json({'status' : '0', 'message' : res.__('Update ok')});
            });
        });
    }
});

// POST JSON event delete
router.post('/:lang/api/event/delete.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
    User.findOne({ _id : new ObjectId(req.body._id) }, function(err, user){
        if(err){ return next(err); }

        user.remove(function(err, user){
            if(err){ return next(err); }

            res.json({ 'status' : '0', 'message' : res.__('User deleted ok') });
        });
        
    });
});

module.exports = router;

