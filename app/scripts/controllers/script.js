'use strict';

angular.module('stalkioWebApp')
  .controller('ScriptCtrl', function ($scope, $rootScope,$window) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.app = $rootScope.rootApplication;
    alert($window.innerHeight);
    setTimeout(function(){
    	console.log($window);
    },5000);
    $scope.height = $window.innerHeight;

});

