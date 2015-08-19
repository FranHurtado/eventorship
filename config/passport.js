// Passport auth config
var i18n = require("i18n");
var sha1 = require('sha1');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'email' :  username }, function(err, user) {
        // In case of any error, return using the done method
        if (err)
            return done(err);
        // Username does not exist, log error & redirect back
        if (!user)
        {
            return done(null, false, i18n.__('User not valid'));                 
        }
        // User exists but wrong password, log the error 
        if (user.password != sha1(password))
        {
            return done(null, false, i18n.__('Password not valid'));
        }
        else
        {
            // User and password both match, return user from 
            // done method which will be treated like success
            req.login(user, function(){});
            return done(null, user);
        }
    });
  })
);

ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/' + req.params.lang + '/user/login.html');
}

ensureAdmin = function(req, res, next) {
    if (req.isAuthenticated()) 
    {
        if (req.user.admin == "1") 
        { 
            return next(); 
        }
        res.redirect('/admin/login.html');
    }
    res.redirect('/admin/login.html');
}