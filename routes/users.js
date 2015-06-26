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
var UserTrack = mongoose.model('UserTrack');


/*
** HTML routes **
*/

// GET user login
router.get('/:lang/user/login.html', function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('user/login', { title: 'User login', referrer: req.headers['referer'], lang : req.params.lang, _layoutFile: 'layout' });
});

// GET user list
router.get('/:lang/user/list.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('user/index', { title: 'User list', lang : req.params.lang, _layoutFile: 'layout' });
});

// GET user profile
router.get('/:lang/user/:id/profile.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('user/profile', { title: 'User profile', lang : req.params.lang, _layoutFile: 'layout' });
});

// GET user edit profile
router.get('/:lang/user/:id/edit-profile.html', ensureAuthenticated, function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('user/edit-profile', { title: 'User edit profile', lang : req.params.lang, _layoutFile: 'layout' });
});

//GET create user form
router.get('/:lang/user/create.html', function(req, res, next) {
    // Save user track
    saveUserTrack(req);

    res.render('user/create', { title: 'Create user', lang : req.params.lang, _layoutFile: 'layout' });
});

//GET validate user form
router.get('/:lang/user/:id/validate.html', function(req, res, next) {
    var id = req.params.id;
    var ObjectId = require('mongoose').Types.ObjectId;
    User.findOne({ '_id' : new ObjectId(id)}, function(err, userData){
        userData.status = new ObjectId('558ad9bbc4243c6b2bb1e874'); // Set user active
        userData.save();
    });

    // Save user track
    saveUserTrack(req);

    res.render('user/validate', { title: 'Validate user', lang : req.params.lang, _layoutFile: 'layout' });
});

// GET logout user
router.get('/:lang/user/logout.html', function(req, res){
    // Save user track
    saveUserTrack(req);

    req.logout();
    res.redirect('/' + req.params.lang);
});


/*
** API routes **
*/

// GET JSON user list
router.get('/:lang/api/user/list.html', function(req, res, next) {
    User.find(function(err, posts){
        if(err){ return next(err); }

        res.json(posts);
    }).populate('city').populate('country').populate('status').populate('profile');
});

// POST JSON user
router.post('/:lang/api/user/get.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
    User.findOne({ _id : new ObjectId(req.body.id) }, function(err, user){
        if(err){ return next(err); }

        res.json(user);
    }).populate('city').populate('country').populate('status').populate('profile');
});

// POST JSON insert user
router.post('/:lang/api/user/create.html', function(req, res, next) {
    var user = new User(req.body);

    //Check if user's fields are completed
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(typeof user.firstname == 'undefined' || typeof user.lastname == 'undefined' || typeof user.password == 'undefined' || typeof user.city == 'undefined' || typeof user.country == 'undefined' || typeof user.profile == 'undefined' 
      || user.firstname == '' || user.lastname == '' || user.password == '' || user.city == '' || user.country == '' || user.profile == '')
    {
        res.json({'status' : '1', 'message' : res.__('All fields are mandatory')});
    }
    else if(pattern.test(user.email) == false)//Check if email is valid email address
    {
        res.json({'status' : '1', 'message' : res.__('Not a valid email address')});
    }
    else if(req.body.password != req.body.password2)//Check if password and confirmation are the same
    {
        res.json({'status' : '1', 'message' : res.__('Password and confirmation are not the same')});
    }
    else
    {
        // Check if the email already exists
        User.findOne({ email : user.email }, function(err, user){
            if(err){ return next(err); }

            // Email doesn't exists
            if (user === null)
            {
                var user = new User(req.body);
                user.password = sha1(user.password);
                user.save(function(err, post){
                    if(err){ return next(err); }

                    //Send confirmation email
                    var data = {
                        siteRoot        : siteRoot,
                        lang            : req.params.lang,
                        introText       : res.__('Hi ' + post.firstname + " " + post.lastname + "! Please confirm your account clicking on the button."),
                        btnLabel        : res.__('Confirm your account'),
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
                            template('confirm-email', data, function(err, html, text) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    transporter.sendMail({
                                        from: config['company'] + ' <' + config['emailuser'] + '>',
                                        to: post.email,
                                        subject: res.__('Please confirm your account at Eventorship'),
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

                    res.json({'status' : '0', 'message' : res.__('Congratulations! Your account has been created. Check you email to confirm registration. Also, we recommend you to check your SPAM folder just in case.')});
                });
            }
            else
            {
                res.json({'status' : '1', 'message' : res.__('Your email already exists')});
            }
        });
    }
});

// POST JSON update user
router.post('/:lang/api/user/update.html', function(req, res, next) {
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

// POST JSON update profile
router.post('/:lang/api/user/update-profile.html', function(req, res, next) {
    var user = new User(req.body);

    //Check if user's fields are completed
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(typeof user.firstname == 'undefined' || 
        typeof user.lastname == 'undefined' || 
        typeof user.city == 'undefined' || 
        typeof user.country == 'undefined' || 
        typeof user.profile == 'undefined'  ||  
        user.firstname == '' || 
        user.lastname == '' || 
        user.password == '' || 
        user.city == '' || 
        user.country == '' || 
        user.profile == '')
    {
        res.json({'status' : '1', 'message' : res.__('All fields with * are mandatory')});
    }
    else if(pattern.test(user.email) == false)//Check if email is valid email address
    {
        res.json({'status' : '1', 'message' : res.__('Not a valid email address')});
    }
    else
    {
        User.findById(req.user._id, function(err, user) {
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.birthdate = req.body.birthdate;
            user.city = req.body.city;
            user.country = req.body.country;
            user.profile = req.body.profile;
            user.aboutme = req.body.aboutme;
            user.picture = req.body.picture;
            user.website = req.body.website;
            user.company.name = req.body.company.name;
            user.company.vat_number = req.body.company.vat_number;
            user.company.address = req.body.company.address;
            user.paypal = req.body.paypal;

            console.log(user);
            console.log(req.body);

            user.save(function(err, user){
                res.json({'status' : '0', 'user' : user, 'message' : res.__('Update ok')});
            });
        });
    }
});

// POST JSON delete user
router.post('/:lang/api/user/delete.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
    User.findOne({ _id : new ObjectId(req.body._id) }, function(err, user){
        if(err){ return next(err); }

        user.remove(function(err, user){
            if(err){ return next(err); }

            res.json({ 'status' : '0', 'message' : res.__('User deleted ok') });
        });
        
    });
});

// POST JSON login user
router.post('/:lang/api/user/login.html', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err)
        {
            next(err); // Error on route or response
        }
    
        if (!user)
        {
            if(info.message == "Missing credentials")
            {
                res.json({ status : 1, message : res.__("Please enter user and password") }); // No user or password provided
            }
            else
            {
                res.json({ status : 1, message : info }); // User or password error
            }
        }
        else
        {
            res.json({ status : 0, message : user }); // Login ok
        }
    })(req, res, next);
});

// GET JSON is user logged
router.get('/api/user/islogged.html', function(req, res, next) {
    res.json({'result' : req.isAuthenticated(), 'user' : req.user});
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

