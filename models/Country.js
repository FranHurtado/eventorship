var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
	name : [{ lang: String, text: String }]
});

mongoose.model('Country', CountrySchema);