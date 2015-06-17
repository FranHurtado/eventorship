var mongoose = require('mongoose');

var SubscriptionSchema = new mongoose.Schema({
	email      : String,
	created_at : Date ,
	updated_at : Date
});

SubscriptionSchema.pre('save', function(next){
	now = new Date().getTime();
	this.updated_at = now;
	if ( !this.created_at ) {
		this.created_at = now;
  	}
	next();
});

mongoose.model('Subscription', SubscriptionSchema);