var express = require('express');
var expressSession = require('express-session');
var engine = require('ejs-mate');
var i18n = require("i18n");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

// Load models and conect to mongodb
var mongoose = require('mongoose');
require('./models/User');
require('./models/UserTrack');
require('./models/Subscription');
require('./models/Country');
require('./models/City');
mongoose.connect('mongodb://localhost/eventsApp');

var User = mongoose.model('User');

var app = express();

app.use(expressSession({secret: 'ev3nt0rsh1p', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Passport auth config
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
        if (user.password != password)
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
    res.redirect('/' + req.params.lang + '/user/login.html')
}

var routes = require('./routes/index');
var users = require('./routes/users');
var countries = require('./routes/countries');
var cities = require('./routes/cities');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express layouts
app.engine('ejs', engine);     

// Load i18n internationalization
i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales',
});
app.use(i18n.init);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', users);
app.use('/', countries);
app.use('/', cities);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function (req, res, next) {
  res.locals.userlogged = req.isAuthenticated();
  next();
});

require('./config.js');

app.listen(3001);

module.exports = app;
