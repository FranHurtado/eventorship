app.controller('EventController', ['$http', '$location', '$window', '$scope', 'Upload', function ($http, $location, $window, $scope, Upload){

	var eventCtrl = this;

	eventCtrl.event = {};

	//Get language code from url
	var lang = $location.absUrl().split('/')[3];
	$http.get('/' + lang + '/api/country/list.html').success(function(data){
		eventCtrl.countries = data;
	});
	$http.get('/' + lang + '/api/currency/list.html').success(function(data){
		eventCtrl.currencies = data;
	});

	this.loadCities = function(first){
		first = typeof first !== 'undefined' ? first : false;
		var postdata = { country_id : eventCtrl.event.country };
		$http.post('/' + lang + '/api/city/list.html', postdata).success(function(data){
			eventCtrl.cities = data;
			if (!first) // If is the first load doesn't change the city value
            {
                eventCtrl.placeholder_city = "--";
                eventCtrl.event.city = undefined;
            }
		});
	};

	this.loadEvent = function() {
		//Get user id from url
        var id = $location.absUrl().split('/')[5];
        var postdata = { id : id };

        $http.post('/' + lang + '/api/user/get.html', postdata).success(function(data){
            eventCtrl.event = data;
            eventCtrl.event.city.getname = eventCtrl.event.city[lang].name;
            eventCtrl.event.country.getname = eventCtrl.event.country[lang].name;
            eventCtrl.event.profile.getdescription = eventCtrl.event.profile[lang].description;
            var loadDependencies = setInterval(function(){
                eventCtrl.loadCities(true);
                eventCtrl.isUser = $scope.eventLogged._id == eventCtrl.event._id ? true : false;
                clearInterval(loadDependencies);
            }, 500);
            
        });
	};

	this.create = function(){
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			title       : eventCtrl.event.title, 
			subtitle    : eventCtrl.event.subtitle,
			description : eventCtrl.event.description,
			city        : eventCtrl.event.city,
			country     : eventCtrl.event.country,
			budget      : eventCtrl.event.budget,
			currency    : eventCtrl.event.currency,
			video       : eventCtrl.event.video,
			pictures    : eventCtrl.event.pictures,
			user        : $scope.userLogged
		};
		$http.post('/' + lang + '/api/event/create.html', postdata).success(function(data){
			eventCtrl.status = data.status;
			eventCtrl.message = data.message;
			console.debug(data);
			//If not error clean form
			if(eventCtrl.status == 0)
			{
				$window.location.href = '/' + lang + '/event/' + data.event._id + '/view.html';
			}
		});
	};

	this.updateUser = function() {
		//Get language code from url
		var lang = $location.absUrl().split('/')[3];
		//Send data to the server
		var postdata = {
			title       : eventCtrl.event.title, 
			subtitle    : eventCtrl.event.subtitle,
			description : eventCtrl.event.description,
			city        : eventCtrl.event.city,
			country     : eventCtrl.event.country,
			budget      : eventCtrl.event.budget,
			currency    : eventCtrl.event.currency,
			video       : eventCtrl.event.video,
			pictures    : eventCtrl.event.pictures,
			user        : eventCtrl.event.user
		};
		$http.post('/' + lang + '/api/event/update.html', postdata).success(function(data){
			eventCtrl.status = data.status;
			eventCtrl.message = data.message;
			//If not error clean form
			if(eventCtrl.status == 0)
			{
				$window.location.href = '/' + lang + '/event/' + data.event._id + '/view.html';
			}
		});
	};

	this.uploadPicture = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/upload.html',
                    fields: { subfolder : 'users', userid : eventCtrl.event._id },
                    file: file
                }).progress(function (evt) {
                    eventCtrl.progress = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + eventCtrl.progress + '% ' + evt.config.file.name);
                }).success(function (data) {
                	eventCtrl.progress = null;
                    eventCtrl.event.pictures.push(data.file);
                });
            }
        }
    };

    this.deletePicture = function () {
    	eventCtrl.event.picture = null;
    }
    
}]);