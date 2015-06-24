app.controller('AdminController', ['$location', '$http', '$window', function ($location, $http, $window){

	var adminCtrl = this;
	adminCtrl.lang = $location.absUrl().split('/')[3];
    adminCtrl.userLogged = null;

    $http.get('/api/user/islogged.html').success(function(data){
        adminCtrl.islogged = data.result;
        adminCtrl.userLogged = data.user;
    });

    this.login = function(){
        //Get language code from url
        var lang = $location.absUrl().split('/')[3];
        //Send data to the server
        var postdata = {
                username : adminCtrl.username, 
                password : adminCtrl.password
        };
        $http.post('/' + lang + '/api/user/login.html', postdata).success(function(data){
            if(data.status == 0)
            {
                $window.location.href='/admin/index.html';
            }
            else
            {
                adminCtrl.loginStatus = data.status;
                adminCtrl.loginMessage = data.message;
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
            selectedId: '@',
            selectedText: '@',
            ngModel: '=',
            placeholder: '=',
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

            var loadSelected = setInterval(function(){    
                if (typeof scope.selectedId != "undefined")
                {
                    scope.ngModel = scope.selectedId;
                    scope.placeholder = scope.selectedText;
                    clearInterval(loadSelected);
                }
                
                var html = '';
                html += '<div class="btn-group">';
                html += '<input class="form-control" type="hidden" ng-model="ngModel" ng-attr-placeholder="{{ placeholder }}" ng-readonly="true" />';
                html += '<a href="#" ng-model="ngModel" class="select dropdown-toggle" data-toggle="dropdown">{{ placeholder }}<span class="caret"></span></a>';
                html += '<ul class="dropdown-menu scrollable-menu no-radius options" role="menu">';
                html += '<li ng-repeat="(key, item) in items"><a ng-href="#" role="menuitem" ng-click="selectVal(item.id, item.text);">{{ item.text }}</a></li>';
                html += '</ul>';
                html += '</div>';
              
                element.append($compile(html)(scope));

            }, 500);
        }
    };
});