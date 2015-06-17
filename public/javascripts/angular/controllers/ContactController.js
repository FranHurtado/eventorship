app.controller('ContactController', ['$http', '$location', function ($http, $location){

	var contactCtrl = this;

	this.sendContact = function(){
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			name     : this.name, 
			email    : this.email,
			comments : this.comments
		};
		$http.post('/' + lang + '/contact.html', postdata).success(function(data){
			contactCtrl.status = data.status;
			contactCtrl.message = data.message;
			//If not error clean form
			if(contactCtrl.status == 0)
			{
				contactCtrl.name = "";
				contactCtrl.email = "";
				contactCtrl.comments = "";
			}
		});
	};
    
}]);