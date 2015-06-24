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
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/eventsApp');

app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express layouts
app.engine('ejs', engine);

app.use(expressSession({secret: 'ev3nt0rsh1p', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());     

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

// Configuration files
require('./config/variables.js');
require('./config/models.js');
require('./config/passport.js');
require('./config/routes.js');

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

app.listen(3001);

module.exports = app;
