var interval = 500;
var current = 0;

var setTest = function(name, fn){
	setTimeout(function(){
		console.log(name + 'is start!');		
		fn();
		console.log(name + 'is end !');
	}, current+= 500 );
};


var tReceiveMsg = function(){
	var d = makeData();
	scope.receiveMsg(d);
}

var makeData = function(){
	var d = {};
	d.channel = Math.random(100000000)*100000000000000000;
	d.data = {};
	d.data.date = getTimeStamp();
	d.data.sender = (Math.random(100000000)*100000000000000000)%100;
	d.data.message = Math.random(100000000)*100000000000000000;
	return d;
}

for(var i = 0 ; i < 10 ; i++){
	setTest('receiveMessage',tReceiveMsg);
}