var i18n = require('i18n');
var env = "dev"; //dev or prod
siteRoot = env == "prod" ? "http://www.eventorship.com/" : "http://www.eventorship.local/";

/* Email configuration */
config = new Array();
config['company'] = 'Eventorship';
config['adminemail'] = 'info@eventorship.com';
config['emailserver'] = 'mail.eventorship.com';
config['emailuser'] = 'no-reply@eventorship.com';
config['emailpass'] = 'eventorship00Z';
config['emailport'] = 465;
config['emailauthtype'] = 'LOGIN';
config['emailssl'] = true;
config['emailtls'] = false;
config['emailFooterText'] = i18n.__('If you want to stop receiving this emails. Please click ');
config['emailFooterButton'] = i18n.__('unsubscribe');
config['emailSignature'] = i18n.__('Thanks! Eventorship\'s team');

token_secret = "ev3ntorSh1p|?9";

// Function to ave user track on database
saveUserTrack = function(req)
{
	var UserTrack = mongoose.model('UserTrack');
    usertrack = new UserTrack();
    usertrack.user = typeof req.user != "undefined" ? req.user._id : null;
    usertrack.url = req.get('host') + req.originalUrl;
    usertrack.ip = req.ip + " | " + req.ips;
    usertrack.user_agent = req.headers['user-agent'];
    usertrack.save();
}