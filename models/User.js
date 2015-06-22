var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  	firstname: String,
  	lastname: String,
  	email: String,
  	password: String,
    token: String,
  	birthdate: String,
    city: { type: mongoose.Schema.ObjectId, ref: 'City'},
    country: { type: mongoose.Schema.ObjectId, ref: 'Country'},
    type: Number,
    status: { type: Number, default: 0 }, //Default deactivated until confirmation email
  	created_at : Date,
    updated_at : Date
});

UserSchema.pre('save', function(next){
	now = new Date().getTime();
	this.updated_at = now;
	if ( !this.created_at ) {
		this.created_at = now;
  	}
	next();
});

mongoose.model('User', UserSchema);