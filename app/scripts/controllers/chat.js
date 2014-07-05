'use strict';

var scope;
var Scope1 = {};
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
var Application = {};
var Users = {};
var userId = '';
angular.module('chatApp')
  .controller('ChatCtrl', function ($scope,$routeParams,$rootScope,user) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Application.appId = $routeParams.id;
    Application.appId = 'stalk-io';
    Application.appKey = $routeParams.id;

      user.getUserInfo()
      .then(function(data){
        console.log('getUserInfo');
        console.log(data);
        userId = data.data.login;
        var password = data.data.password;
        //userId = 'F825594700801360';
        //Users[userId] = $rootScope.user = data.data;
        Users[userId] = {};
        Users[userId].deviceId = 'WEB';
        Users[userId].userId = userId;//'F825594700801360';
        Users[userId].password = password;//'qwer';
        Users[userId].name = data.data.name;
        Users[userId].picture = data.data.picture;//'https://graph.facebook.com/100000525133892/picture';
        $scope.currentUser = Users[userId];
        $rootScope.currentUser = Users[userId];
        startConnection();
      });

    console.log($routeParams);

    $scope.changeChannel = function(data){
        console.log(data);
        var ch = data.channel;
        $scope.currentChannel = ch;

        var c = chatList[ch];
        if(!c.live){
            $scope.liveConversations.push(c);
            c.live = true;
            calcTabSize();
        }
        
        if($scope.currentConversation) {
            $scope.currentConversation.active = false;
        }
        $scope.currentConversation = chatList[ ch ];

        //$('#linkmsg'+data.user.id).tab('show');

        $scope.currentConversation.active = true;
        setTimeout(function(){
            $('#ctid'+data.channel2).trigger('click');    
        });
    }

    $scope.removeChannel = function(data){
        var ch = data.channel;
        console.log('remove channel ',ch);
        var t = chatList[ch];
        var idx = $scope.liveConversations.indexOf(t);
        console.log(idx);
        $scope.liveConversations.splice(idx,1);
        var idx2= $scope.conversations.indexOf(t);
        console.log(idx2);
        $scope.conversations.splice(idx2,1);

        delete chatList[ch];
        setTimeout(function(){
            $('#conversationTabBar>li:first').trigger('click');    
        },500);
        
    }

    $scope.getTimeStamp = function(date) {
        var d = date == undefined ? new Date() : new Date();

        var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2) + ' ' +

        leadingZeros(d.getHours(), 2) + ':' +
        leadingZeros(d.getMinutes(), 2) + ':' +
        leadingZeros(d.getSeconds(), 2);

        return s;
    }


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
    /*
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
    */
    ];

    $scope.liveConversations = [
    /*
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
        */
    ]; 


    window.chatList = {}; 
    // channel = {user: {id, name, url, image}, message, sender, timestamp, channel}

    Scope1.getNotification = $scope.getNotification = function(data){
        console.log("========= scope : getNotification =======",data);
        var ch = data.channel;
        cleanMsg(data);
        if(!chatList[ch]){
            var d = {user : data.user , channel: ch, msg: [{ sender: data.sender, text: data.message, date: getTimeStamp(data.timestamp) }]};
            chatList[ch] = $scope.conversations[ $scope.conversations.push(d)-1 ] ;
            chatList[ch].lastMessage = data.message;
            chatList[ch].lastDate = getTimeStamp(data.timestamp);
            chatList[ch].unreadCount = 0;
            chatList[ch].channel2 = chatList[ch].channel.replace(/ /gi,'').replace(/\-/gi,'').replace(/\^/gi,'');
            console.log($scope.conversations);
            addNewTab();            
        }else{
            chatList[ch].msg.push( { sender: data.sender, text: data.message, date : getTimeStamp(data.timestamp) } );
            chatList[ch].lastMessage = data.message;
            chatList[ch].lastDate = getTimeStamp(data.timestamp);            
            chatList[ch].unreadCount++;
        }
        $scope.currentChannel = ch;
        $scope.$apply();
    };

    Scope1.receiveMessage = $scope.receiveMessage = function(data){
        console.log("========= scope : receiveMessage =======",data);
        var ch = data.channel;
        cleanMsg(data);
        if(!chatList[ch]){
            var d = {user : data.user , channel: ch, msg: [{ sender: data.sender, text: data.message, date: getTimeStamp(data.timestamp) }]};
            chatList[ch] = $scope.conversations[ $scope.conversations.push(d)-1 ] ;
            chatList[ch].lastMessage = data.message;
            chatList[ch].lastDate = getTimeStamp(data.timestamp);            
            chatList[ch].unreadCount = 0;
            chatList[ch].channel2 = chatList[ch].channel.replace(/ /gi,'').replace(/\-/gi,'').replace(/\^/gi,'');            
            console.log($scope.conversations);
            addNewTab();
        }else{
            chatList[ch].msg.push( { sender: data.sender, text: data.message, date : getTimeStamp(data.timestamp) } );
            chatList[ch].lastMessage = data.message;
            chatList[ch].lastDate = getTimeStamp(data.timestamp);            
            chatList[ch].unreadCount++;
        }
        $scope.currentChannel = ch;
        $scope.$apply();
    }

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
      Library.sendMessage(userId, $scope.currentChannel, 'message', { message: msg, sender: 'operator', user: { id: userId, name : Users[userId].name , image: Users[userId].picture} }, function(result){});
      //Library.sendMessage(userId, , 'message', { message: msg, sender: userId}, function(result){});
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

function addNewTab(){
    console.log("-======= calc");
    calcTabSize();    
}

function cleanMsg(msg){

}



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



