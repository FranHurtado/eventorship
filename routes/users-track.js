var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sha1 = require('sha1');
var User = mongoose.model('User');
var UserTrack = mongoose.model('UserTrack');


/*
** HTML routes **
*/



/*
** API routes **
*/

// GET JSON user list
router.get('/:lang/api/user-track/list.html', function(req, res, next) {
    UserTrack.find(function(err, posts){
        if(err){ return next(err); }

        res.json(posts);
    }).populate('user');
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

