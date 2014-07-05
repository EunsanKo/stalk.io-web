'use strict';

angular.module('stalkioWebApp')
  .controller('ApplicationCtrl', function ($scope,$rootScope,user) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

      user.getApplications()
      .then(function(data){
        if(data.status == 'success'){
          $scope.applications = data.data;  
        }
      
      });


    $scope.applications = [
    	{
    		site : 'temp site 1',
    		url : 'site url 1'
    	},    	{
    		site : 'temp site 2',
    		url : 'site url 2'
    	},    	{
    		site : 'temp site 3',
    		url : 'site url 3'
    	},
    ];

    $scope.setApplication = function(t){
      console.log(t);
      $rootScope.rootApplication = t;
    }

});
