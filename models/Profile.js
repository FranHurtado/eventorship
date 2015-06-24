var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
	en : { name: String, description: String },
	es : { name: String, description: String }
});

mongoose.model('Profile', ProfileSchema);