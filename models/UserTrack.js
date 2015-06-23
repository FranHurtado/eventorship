var mongoose = require('mongoose');

var UserTrackSchema = new mongoose.Schema({
  	user : { type: mongoose.Schema.ObjectId, ref: 'User' },
    url : String,
    ip : String,
    user_agent : String, 
  	action_date : { type: Date, default: new Date().getTime()}
});

mongoose.model('UserTrack', UserTrackSchema);