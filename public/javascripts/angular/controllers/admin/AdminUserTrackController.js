app.controller('AdminUserTrackController', ['$location', '$http', '$window', function ($location, $http, $window){

	var adminUserTrackCtrl = this;
    
    this.loadUsersTrack = function(){
        $http.get('/en/api/user-track/list.html').success(function(data){
            adminUserTrackCtrl.usersTrack = data;
        });
    };
    
}]);