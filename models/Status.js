var mongoose = require('mongoose');

var StatusSchema = new mongoose.Schema({
	en : { name: String },
	es : { name: String }
});

mongoose.model('Status', StatusSchema);