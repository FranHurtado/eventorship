
app.controller('SubscriptionController', ['$http', '$location', function ($http, $location){

	var subscriptionCtrl = this;
	
	this.addSubscription = function(){ 
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		$http.post('/' + lang + '/subscribe.html', { email : this.email }).success(function(data){
			subscriptionCtrl.status = data.status;
			subscriptionCtrl.message = data.message;
			//If not error clean form
			if(subscriptionCtrl.status == 0)
			{
				subscriptionCtrl.email = "";
			}
		});
	};
    
}]);