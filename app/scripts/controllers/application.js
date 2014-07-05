'use strict';

angular.module('stalkioWebApp')
  .controller('ApplicationCtrl', function ($scope,$rootScope,user,$route) {
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

    $scope.removeApplication = function(app){
      console.log("==== removeApplication : ",app);
      $('#confirmRemoveApplication').modal('show');
      $scope.currentRemoveTarget = app;
    };

    $scope.removeApplicationC = function(){
      var t = $scope.currentRemoveTarget;
      $('#confirmRemoveApplication').modal('hide');
      if(t && t._id) {
        user.removeApplication(t._id)
        .then(function(data){
          console.log(" === removeApplication ", t);
          $route.reload();
           $.smallBox({ title : t.name + " application was deleted.", content : "<i class='fa fa-clock-o'></i> <i>few seconds ago...</i>", color : "#296191", iconSmall : "fa fa-thumbs-up bounce animated", timeout : 4000 });          
          $scope.currentRemoveTarget = undefined;
        });
      }
    };

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
      //$rootScope.rootApplication = t;
    }

});
