var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
	en : { name: String },
	es : { name: String }
});

mongoose.model('Country', CountrySchema);