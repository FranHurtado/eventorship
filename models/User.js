var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  	firstname: String,
  	lastname: String,
  	email: String,
  	password: String,
  	birthdate: String,
  	created_at : Date ,
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