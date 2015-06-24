var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  	firstname: String,
  	lastname: String,
  	email: String,
  	password: String,
  	birthdate: String,
    city: { type: mongoose.Schema.ObjectId, ref: 'City'},
    country: { type: mongoose.Schema.ObjectId, ref: 'Country'},
    profile:  { type: mongoose.Schema.ObjectId, ref: 'Profile'},
    status: { type: mongoose.Schema.ObjectId, default: mongoose.Schema.ObjectId('558adaddc4243c6b2bb1e875'), ref: 'Status'}, // Default deactive until mail confirmation
    admin: { type: Number, default: 0 },
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