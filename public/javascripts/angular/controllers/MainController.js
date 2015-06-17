app.controller('MainController', ['$location', function ($location){

	var mainCtrl = this;
	mainCtrl.lang = $location.absUrl().split('/')[3];
    
}]);