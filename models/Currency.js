var mongoose = require('mongoose');

var CurrencySchema = new mongoose.Schema({
	name: String,
	code: String,
	symbol: String
});

mongoose.model('Currency', CurrencySchema);