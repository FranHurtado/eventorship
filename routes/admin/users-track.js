var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sha1 = require('sha1');
var User = mongoose.model('User');


/*
** HTML routes **
*/

// GET user login
router.get('/user-track/list.html', function(req, res, next) {
    res.render('admin/user-track/list', { title: 'User track list', lang : req.params.lang, _layoutFile: 'layout-admin' });
});


module.exports = router;


