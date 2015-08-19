var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Currency = mongoose.model('Currency');

/*
** HTML routes **
*/



/*
** API routes **
*/

/* POST subscribe home page. */
router.get('/:lang/api/currency/list.html', function(req, res, next) {
    var ObjectId = require('mongoose').Types.ObjectId;
	Currency.find(function(err, currencies){
        if(err){ return next(err); }

        var results = new Array();
        var text = "";
        currencies.forEach(function(item) {
            results.push({"id" : item._id, "text" : item.code});
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
