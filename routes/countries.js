var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Country = mongoose.model('Country');

/*
** HTML routes **
*/



/*
** API routes **
*/

/* POST subscribe home page. */
router.get('/:lang/api/country/list.html', function(req, res, next) {
	Country.find(function(err, posts){
        if(err){ return next(err); }

        var results = new Array();
        var text = "";
        posts.forEach(function(item) {
        	results.push({"id" : item._id, "text" : item[req.params.lang].name});
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
