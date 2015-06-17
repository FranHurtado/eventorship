var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/*
** HTML routes **
*/

// GET user list
router.get('/list.html', function(req, res, next) {
  res.render('user/index', { title: 'User list' });
});

//GET create user form
router.get('/create.html', function(req, res, next) {
  res.render('user/create', { title: 'Create user' });
});


/*
** API routes **
*/

// GET JSON user list
router.get('/', function(req, res, next) {
  User.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// POST JSON insert user
router.post('/create.html', function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

module.exports = router;