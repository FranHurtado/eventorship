var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

/*
** HTML routes **
*/



/*
** API routes **
*/

/* POST subscribe home page. */
router.get('/:lang/api/profile/list.html', function(req, res, next) {
	Profile.find(function(err, posts){
        if(err){ return next(err); }

        var results = new Array();
        var text = "";
        posts.forEach(function(item) {
        	results.push({"id" : item._id, "text" : item[req.params.lang].description});
            //Order array alphabetically
            results.sort(function(a,b)
            {
                if(a.text < b.text) return -1;
                if(a.text > b.text) return 1;
                return 0;
            });
        });
        res.json(results);
    });
});

module.exports = router;
