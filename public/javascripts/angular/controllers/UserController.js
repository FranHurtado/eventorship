app.controller('UserController', ['$http', '$location', '$window', '$scope', 'Upload', function ($http, $location, $window, $scope, Upload){

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

	this.loadCities = function(first){
		first = typeof first !== 'undefined' ? first : false;
		var postdata = { country_id : userCtrl.user.country };
		$http.post('/' + lang + '/api/city/list.html', postdata).success(function(data){
			userCtrl.cities = data;
			if (!first) // If is the first load doesn't change the city value
            {
                userCtrl.placeholder_city = "--";
                userCtrl.user.city = undefined;
            }
		});
	};

	this.loadUser = function() {
		//Get user id from url
        var id = $location.absUrl().split('/')[5];
        var postdata = { id : id };

        $http.post('/' + lang + '/api/user/get.html', postdata).success(function(data){
            userCtrl.user = data;
            userCtrl.user.city.getname = userCtrl.user.city[lang].name;
            userCtrl.user.country.getname = userCtrl.user.country[lang].name;
            userCtrl.user.profile.getdescription = userCtrl.user.profile[lang].description;
            var loadDependencies = setInterval(function(){
                userCtrl.loadCities(true);
                userCtrl.isUser = $scope.userLogged._id == userCtrl.user._id ? true : false;
                clearInterval(loadDependencies);
            }, 500);
            
        });
	};

	this.loadProfile = function(){
		//Get user id from url
        var id = $location.absUrl().split('/')[5];
        var postdata = { id : id };

        $http.post('/' + lang + '/api/user/get.html', postdata).success(function(data){
            userCtrl.user = data;
            userCtrl.user.city.getname = userCtrl.user.city[lang].name;
            userCtrl.user.country.getname = userCtrl.user.country[lang].name;
            userCtrl.user.profile.getdescription = userCtrl.user.profile[lang].description;
            var loadDependencies = setInterval(function(){
                userCtrl.loadCities(true);
                userCtrl.isUser = $scope.userLogged._id == userCtrl.user_id ? true : false;
                clearInterval(loadDependencies);
            }, 500);
            
        });
	};

	this.create = function(){
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			firstname : userCtrl.user.firstname, 
			lastname  : userCtrl.user.lastname,
			email     : userCtrl.user.email,
			password  : userCtrl.user.password,
			password2 : userCtrl.user.password2,
			city      : userCtrl.user.city,
			country   : userCtrl.user.country,
			profile   : userCtrl.user.profile
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

	this.updateUser = function() {
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			firstname : userCtrl.user.firstname, 
			lastname  : userCtrl.user.lastname,
			email     : userCtrl.user.email,
			birthdate : userCtrl.user.birthdate,
			city      : userCtrl.user.city,
			country   : userCtrl.user.country,
			profile   : userCtrl.user.profile,
			aboutme   : userCtrl.user.aboutme,
			picture   : userCtrl.user.picture,
			website   : userCtrl.user.website,
			company	  : { name: userCtrl.user.company.name, vat_number: userCtrl.user.company.vat_number, address: userCtrl.user.company.address },
			paypal    : userCtrl.user.paypal
		};
		$http.post('/' + lang + '/api/user/update-profile.html', postdata).success(function(data){
			userCtrl.status = data.status;
			userCtrl.message = data.message;
			//If not error clean form
			if(userCtrl.status == 0)
			{
				$window.location.href = '/' + lang + '/user/' + data.user._id + '/profile.html';
			}
		});
	};

	this.uploadPicture = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/upload.html',
                    fields: { subfolder : 'users', userid : userCtrl.user._id },
                    file: file
                }).progress(function (evt) {
                    userCtrl.progress = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + userCtrl.progress + '% ' + evt.config.file.name);
                }).success(function (data) {
                	userCtrl.progress = null;
                    userCtrl.user.picture = data.file;
                });
            }
        }
    };

    this.deletePicture = function () {
    	userCtrl.user.picture = null;
    }
    
}]);