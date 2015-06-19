var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/*
** HTML routes **
*/

// GET user list
router.get('/:lang/user/list.html', function(req, res, next) {
    res.render('user/index', { title: 'User list' });
});

//GET create user form
router.get('/:lang/user/create.html', function(req, res, next) {
    res.render('user/create', { title: 'Create user' });
});


/*
** API routes **
*/

// GET JSON user list
router.get('/:lang/api/user/list.html', function(req, res, next) {
    User.find(function(err, posts){
        if(err){ return next(err); }

        res.json(posts);
    }).populate('city').populate('country');
});

// POST JSON insert user
router.post('/:lang/api/user/create.html', function(req, res, next) {
    var user = new User(req.body);

    console.log(req.body.password + " - " + req.body.password2);

    //Check if user's fields are completed
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(typeof user.firstname == 'undefined' || typeof user.lastname == 'undefined' || typeof user.password == 'undefined' || typeof user.city == 'undefined' || typeof user.country == 'undefined' || typeof user.type == 'undefined' 
      || user.firstname == '' || user.lastname == '' || user.password == '' || user.city == '' || user.country == '' || user.type == '')
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
                user.save(function(err, post){
                    if(err){ return next(err); }

                    //Send confirmation email
                    //TODO

                    res.json({'status' : '0', 'message' : res.__('Congratulations! Your account has been created. Check you email to confirm registration.')});
                });
            }
            else
            {
                res.json({'status' : '1', 'message' : res.__('Your email already exists')});
            }
        });
    }
});

module.exports = router;