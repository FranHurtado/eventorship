app.controller('LoginController', ['$http', '$location', function ($http, $location){

	var loginCtrl = this;

	this.login = function(){
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			username : this.username, 
			password : this.password,
		};
		$http.post('/' + lang + '/api/login.html', postdata).success(function(data){
			loginCtrl.status = data.status;
			loginCtrl.message = data.message;
			//If not error clean form
			if(loginCtrl.status == 0)
			{
				loginCtrl.name = "";
				loginCtrl.email = "";
				loginCtrl.comments = "";
			}
		});
	};

	
    
}]);