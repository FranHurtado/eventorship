app.controller('AdminUserController', ['$location', '$http', '$window', function ($location, $http, $window){

	var adminUserCtrl = this;
    adminUserCtrl.user = {};

    $http.get('/en/api/country/list.html').success(function(data){
        adminUserCtrl.countries = data;
    });
    $http.get('/en/api/status/list.html').success(function(data){
        adminUserCtrl.status = data;
    });
    $http.get('/en/api/profile/list.html').success(function(data){
        adminUserCtrl.profiles = data;
    });

    this.loadCities = function(first=false){
        var postdata = { country_id : adminUserCtrl.user.country };
        $http.post('/en/api/city/list.html', postdata).success(function(data){
            adminUserCtrl.cities = data;
            if (!first) // If is the first load doesn't change the city value
            {
                adminUserCtrl.placeholder_city = "--";
                adminUserCtrl.user.city = undefined;
            }
        });
    };

    this.loadUsers = function(){
        $http.get('/en/api/user/list.html').success(function(data){
            adminUserCtrl.users = data;
        });
    };

    this.loadUser = function(){
        //Get user id from url
        var id = $location.absUrl().split('/')[6];
        var postdata = { id : id };

        $http.post('/en/api/user/get.html', postdata).success(function(data){
            adminUserCtrl.user = data;
            var loadCities = setInterval(function(){
                adminUserCtrl.loadCities(true);
                clearInterval(loadCities);
            }, 500);
            
        });
    };

    this.loadUserToDelete = function(userID){
        adminUserCtrl.user_to_delete_id = userID;
    };

    this.updateUser = function(){
        var postdata = {
            _id       : adminUserCtrl.user._id,
            firstname : adminUserCtrl.user.firstname, 
            lastname  : adminUserCtrl.user.lastname,
            email     : adminUserCtrl.user.email,
            city      : adminUserCtrl.user.city,
            country   : adminUserCtrl.user.country,
            profile   : adminUserCtrl.user.profile,
            status    : adminUserCtrl.user.status
        };
        $http.post('/en/api/user/update.html', postdata).success(function(data){
            adminUserCtrl.status = data.status;
            adminUserCtrl.message = data.message;
            //If not error clean form
            if(adminUserCtrl.status == 0)
            {
                $window.location.href='/admin/user/list.html';
            }
        });
    };

    this.deleteUser = function(){
        var postdata = {
            _id : adminUserCtrl.user_to_delete_id
        };
        $http.post('/en/api/user/delete.html', postdata).success(function(data){
            adminUserCtrl.status = data.status;
            adminUserCtrl.message = data.message;
            //If not error clean form
            if(adminUserCtrl.status == 0)
            {
                $window.location.href='/admin/user/list.html';
            }
        });
    };
    
}]);