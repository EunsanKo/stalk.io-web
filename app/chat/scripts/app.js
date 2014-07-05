angular.module('chatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute']).run(function($rootScope){
})
.config(function ($routeProvider,$locationProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

    $routeProvider
      .when('/:id', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });




});
