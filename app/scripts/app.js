'use strict';

var app = angular.module('stalkioWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute']).run(function($rootScope,user,$location){
  $rootScope.user = {
    picture : 'data:image/jpeg;base64,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',
    login : 'userId',
    name : 'userName'
  }

  $rootScope.changeMenu = function(context){
    var applications = $rootScope.applications;
    if(!applications || applications.length < 1){
      context = "/noApplication";
    };
    //console.log("=== chanageMenu : ", $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) + context);
    //context  = '/dashboard/#'+context;
    //location.href = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) +'#'+ context;
    //$rootScope.$apply(function() {
    //$location.path(context);
    //});

    $location.path('#'+context);
  }

  $rootScope.rootApplication = {
    name : 'Choose Application'
    //url : 'This is host address.'
  }

  $rootScope.chageApplication = function(data){
  	$rootScope.rootApplication = data;
    //document.location.href='/dashboard/#/';    
    $location.path('/dashboard/#/');
  }

  user.getUserInfo()
  .then(function(data){
    console.log('===== root user =====');
    if(!data){
      location.href="/"; return;
    }
    console.log(data);
    if(data.status == 'success'){
      $rootScope.user = data.data;  
    };
  });

  user.getApplications()
  .then(function(data){
	console.log('=== applications ===');
	console.log(data);
	if(data.status == 'success'){
		$rootScope.applications = data.data;
    if(data.data && data.data.length < 1 ){
      //showRegistApplication();
      location.href = "#/noApplication";
    }else{
      console.log("===== there is application ",data.data[0]);
      $rootScope.chageApplication(data.data[0]);
      // show dashboard
    };
	}else{
		console.log(' error : getApplications ');
	}
  });

})
  .config(function ($routeProvider,$locationProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

    $routeProvider
      .when('/install', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/install/script', {
        templateUrl: '/views/script.html',
        controller: 'ScriptCtrl'
      })
      .when('/application', {
        templateUrl: 'views/application.html',
        controller: 'ApplicationCtrl'
      })
      .when('/chat', {
        /*templateUrl: 'views/chat.html',*/
        controller: 'ChatCtrl'
      })
      .when('/noApplication', {
        templateUrl: 'views/noApplication.html',
        controller: 'NoApplicationCtrl'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  });
/*
angular.module('chatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute']).run(function($rootScope){
})
.config(function ($routeProvider,$locationProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

    $routeProvider
      .when('/chat/:id', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      })
      .otherwise({
        redirectTo: '/chat'
      });

});
*/