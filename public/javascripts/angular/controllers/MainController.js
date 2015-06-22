app.controller('MainController', ['$location', '$http', '$window', function ($location, $http, $window){

	var mainCtrl = this;
	mainCtrl.lang = $location.absUrl().split('/')[3];

    $http.get('/api/user/islogged.html').success(function(data){
        mainCtrl.islogged = data.result;
    });

    this.login = function(){
        //Get language code from url
        var lang = $location.absUrl().split('/')[3];
        //Send data to the server
        var postdata = {
                username : mainCtrl.username, 
                password : mainCtrl.password,
        };
        $http.post('/' + lang + '/api/user/login.html', postdata).success(function(data){
            if(data.status == 0)
            {
                $window.location.href=$location.absUrl();
            }
            else
            {
                mainCtrl.loginStatus = data.status;
                mainCtrl.loginMessage = data.message;
            }
        });
    };
    
}]);

/*
** Directive to activate Bootstrap's dropdowns
*/
app.directive('bootstrapDropdown', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            items: '=dropdownData',
            selectedItem: '=preselectedItem',
            ngModel: '=',
            placeholder: '@',
            ngChange: '&'
        },
        link: function (scope, element, attrs) {
            
            scope.selectVal = function (id, text) {
                scope.ngModel = id;
                scope.placeholder = text;
                var loadCities = setInterval(function(){
                	scope.ngChange();
                	clearInterval(loadCities);
                }, 500);
            };
            
            var html = '';
            html += '<div class="btn-group">';
            html += '<input class="form-control" type="hidden" ng-model ="ngModel" data-ng-attr-placeholder="{{placeholder}}" ng-readonly="true" />';
            html += '<a href="#" ng-model="userCtrl.type" class="select dropdown-toggle" data-toggle="dropdown" value="0">{{placeholder}}<span class="caret"></span></a>';
            html += '<ul class="dropdown-menu scrollable-menu no-radius options" role="menu">';
            html += '<li ng-repeat="(key, item) in items"><a ng-href="#" role="menuitem" ng-click="selectVal(item.id, item.text);">{{item.text}}</a></li>';
            html += '</ul>';
            html += '</div>';
          
            element.append($compile(html)(scope));
        }
    };
});