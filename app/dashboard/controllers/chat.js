'use strict';

var scope;
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

angular.module('stalkioWebApp')
  .controller('ChatCtrl', function ($scope,$routeParams,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    console.log($rootScope.user);


    $scope.lobbyUsers = [
    	{
    		id : 'notdol',
    		name : 'james',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',
    		conversations : [
    			{
    				sender : 'me',
    				text: 'asdjk asdfj asdf asdf',
    				date : Date.now()
    			},
    			{
    				sender : 'me',    				
    				text: 'asdjk asdfj asdf asdf',
    				date : Date.now()
    			},
    			{
    				sender : 'me',    				
    				text: 'asdjk asdfj asdf asdf',
    				date : Date.now()
    			}
    		]	
    	},
    	{
    		id : 'notdol',
    		name : 'james',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',    		
    		conversations : [
    			{
    				text: 'asdf asdf asdf asdf ',
    				date : Date.now()
    			}
    		]	
    	}
    ];

    $scope.conversations = [
    	{
    		id : 'notdol',
    		name : 'james',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',    		
    		conversations : [
    			{
    				sender : 'me',    				
    				text: 'asdlkfjklsadf asdlkfjlasd asdlkfnasd',
    				date : Date.now()
    			}
    		]	
    	},
    	{
    		id : 'notdol',
    		name : 'james',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',    		
    		conversations : [
    			{
    				sender : 'me',    				
    				text: 'asdkjf asdflnasd falknasdf',
    				date : Date.now()
    			}
    		]	
    	}
    ];

    $scope.liveConversations = [
    	{
    		id : 'notdol',
    		name : 'james1',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',    		
    		conversations : [
                {
                    sender : 'me',                  
                    text: 'asdlkfjklsadf asdlkfjlasd asdlkfnasd',
                    date : Date.now()
                },
                {
                    sender : 'james',                  
                    text: 'asdlkfjklsadf asdlkfjlasd asdlkfnasd',
                    date : Date.now()
                },
                {
                    sender : 'me',                  
                    text: 'asdlkfjklsadf asdlkfjlasd asdlkfnasd',
                    date : Date.now()
                }
    		]	
    	},
    	{
    		id : 'notdol',
    		name : 'james2',
    		date : Date.now(),
    		email : 'nixenic@gmail.com',    		
    		conversations : [
    			{
    				sender : 'me',    				
    				text: 'asdkjf asdflnasd falknasdf',
    				date : Date.now()
    			}
    		]	
    	}
    ];

    $scope.getRecentText = function(obj){
    	var c = obj['conversations'];
    	return c[c.length-1];
    }

    $scope.msgToSend = '';
    $scope.sendMsg = function(e){
      if (e.which != 13) {
          return;
      }

      var msg = $scope.msgToSend;
      msg = getEscapeHtml(msg.replace(/^\s+|\s+$/g, ''));
      //Library.sendMessage(userId, channel, 'message', { message: msg, sender: userId}, function(result){});
      $scope.msgToSend = '';
    }
    $scope.receiveMsg = function(d){
      console.log('== scope receiveMsag = ',d);
    }


    $scope.addConversations = function(c){

    }


    $scope.showChat = function(name){
        console.log(name);
        $('#conversationTabBar #'+name).tab('show');
    };


    scope = $scope;
});





function leadingZeros(n, digits) {
      var zero = '';
      n = n.toString();

      if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
          zero += '0';
      }
      return zero + n;
}

function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +
    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);
  return s;
}

function getEscapeHtml (html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



