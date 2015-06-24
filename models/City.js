var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
	en : { name: String },
	es : { name: String },
	country : {type: mongoose.Schema.ObjectId}
});

mongoose.model('City', CitySchema);