var express = require('express');
var engine = require('ejs-mate');
var i18n = require("i18n");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Load models and conect to mongodb
var mongoose = require('mongoose');
require('./models/User');
require('./models/Subscription');
require('./models/Country');
require('./models/City');
mongoose.connect('mongodb://localhost/eventsApp');

var app = express();

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

app.listen(3001);  

module.exports = app;
