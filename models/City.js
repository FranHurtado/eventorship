var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
	name : [{ lang: String, text: String }],
	country : {type: mongoose.Schema.ObjectId}
});

mongoose.model('City', CitySchema);