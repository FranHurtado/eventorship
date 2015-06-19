var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var City = mongoose.model('City');

/*
** HTML routes **
*/



/*
** API routes **
*/

/* POST subscribe home page. */
router.post('/:lang/api/city/list.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
	City.find({ 'name.lang' : req.params.lang, 'country' : new ObjectId(req.body.country_id) }, function(err, posts){
        if(err){ return next(err); }

        var results = new Array();
        var text = "";
        posts.forEach(function(item) {
            item.name.forEach(function(langItem) {
                if(langItem.lang == req.params.lang){ text = langItem.text; }
            });
            results.push({"id" : item._id, "text" : text});
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
