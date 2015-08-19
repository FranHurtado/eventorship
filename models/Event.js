var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'Event'},
  	title: String,
  	subtitle: String,
  	description: String,
  	date_start: Date,
  	date_end: Date,
    city: { type: mongoose.Schema.ObjectId, ref: 'City'},
    country: { type: mongoose.Schema.ObjectId, ref: 'Country'},
    budget: Number,
    currency: { type: mongoose.Schema.ObjectId, ref: 'Currency'},
    minimum_amount: Number,
    pictures: Array,
    video: String,
    sponsors: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  	created_at : Date,
    updated_at : Date
});

EventSchema.pre('save', function(next){
	now = new Date().getTime();
	this.updated_at = now;
	if ( !this.created_at ) {
		this.created_at = now;
  	}
	next();
});

mongoose.model('Event', EventSchema);