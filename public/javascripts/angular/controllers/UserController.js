app.controller('UserController', ['$http', '$location', '$scope', function ($http, $location, $scope){

	var userCtrl = this;

	userCtrl.user = {};

	//Get language code from url
	var lang = $location.absUrl().split('/')[3];
	$http.get('/' + lang + '/api/country/list.html').success(function(data){
		userCtrl.countries = data;
	});
	$http.get('/' + lang + '/api/profile/list.html').success(function(data){
        userCtrl.profiles = data;
    });

	this.loadCities = function(){
		var postdata = { country_id : userCtrl.user.country };
		$http.post('/' + lang + '/api/city/list.html', postdata).success(function(data){
			userCtrl.cities = data;
		});
	};

	this.loadUser = function(){
		//Get user id from url
        var id = $location.absUrl().split('/')[5];
        var postdata = { id : id };

        $http.post('/' + lang + '/api/user/get.html', postdata).success(function(data){
            userCtrl.user = data;
            userCtrl.user.city.getname = userCtrl.user.city[lang].name;
            userCtrl.user.country.getname = userCtrl.user.country[lang].name;
            var loadCities = setInterval(function(){
                userCtrl.loadCities(true);
                clearInterval(loadCities);
            }, 500);
            
        });
	};

	this.create = function(){
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			firstname : this.user.firstname, 
			lastname  : this.user.lastname,
			email     : this.user.email,
			password  : this.user.password,
			password2 : this.user.password2,
			city      : this.user.city,
			country   : this.user.country,
			profile   : this.user.profile
		};
		$http.post('/' + lang + '/api/user/create.html', postdata).success(function(data){
			userCtrl.status = data.status;
			userCtrl.message = data.message;
			//If not error clean form
			if(userCtrl.status == 0)
			{
				userCtrl.user = {};
			}
		});
	};
    
}]);