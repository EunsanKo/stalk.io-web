angular.module('chatApp')
  .factory('user', function ($http) {
    // Service logic
    // ...

    var host = "http://www.notdol.com";
    var port = 8080;

    var getUserInfo = function(){
  	  return $http.get('/userInfo')
  	           .then(function(result) {
  	                //resolve the promise as the data
                    console.log(result);
  	                return result.data;
  	            });	
    };
    var getApplications = function(){
  	  return $http.get("/app/list")
  	           .then(function(result) {
  	                //resolve the promise as the data
                    console.log(arguments);
  	                return result.data;
  	            });	
    };

    // Public API here
    return {
      getUserInfo: getUserInfo,
      getApplications : getApplications
    };
  });
