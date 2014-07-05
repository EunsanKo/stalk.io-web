'use strict';

var User = require('../models/user'),
	AppModel = require('../models/app'),
    XpushModel = require('../models/xpushuser'),
    stalk = require('../config/stalk'),
    auth = require('../lib/auth'),
    async   = require('async'),
    restify = require('restify'),
    url = require('url');



module.exports = function (app) {

    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/chat/:key',auth.isAuthenticated('admin'), function (req, res) {
        console.log("===== /chat : ");

        var key = req.params.key;
        var userId = req.user.login;

        User.findOne({login:userId}, function(err, doc){
            console.log("===== /chat : ",doc);

            if(err){
                console.log(err);
                return res.render('chat',{key:key, email : req.user.login});
            }
            res.render('chat', {key:key, email:req.user.login, user: doc});
        });
        //res.render('chat', {key:key, email:req.user.login});
    });

    app.post('/auth/:b',auth.isAuthenticated('admin'), function (request, response) {
        var app = request.param("app");
        var userId = request.param("userId");
        var deviceId = request.param("deviceId");
        console.log(request.user);
        var password = request.user.password;
        var b = request.params.b == 'false' ? false : true;
	var sessionId = request.sessionID;
	console.log("===== admin : /auth",request.session.auth);
	console.log("===== user : " , request.user);
        var client = restify.createJsonClient({
            url: stalk.sessionServer || 'http://chat.stalk.io:8000',
            version: '*'
        });

        var param = {
            app: app,
            userId: userId,
            deviceId: deviceId,
            password: password
        }



        client.post('/auth', param, function (err, req, res, data) {
            if(err) {
                console.log("An error ocurred:", err);
            }

            User.findOne({login:userId}, function(err, doc){
                if (err) {}

                if(doc){
                    var sessions = request.sessionStore.sessions;
                    var count = Object.keys(sessions).length;
                    var cnt = 0;

		    var sessionStr = sessions[sessionId];
		    if(sessionStr == undefined){
			console.log("=== error sessionId : "+sessionId);
		    }
		    var sessionObj = JSON.parse(sessionStr);
		    sessionObj.passport.auth = b;
		    if(b){
			sessionObj.passport.userId = doc.login;
            sessionObj.passport.userNm = doc.name;
			}else{
			delete sessionObj.passport.userId;
            delete sessionObj.passport.userNm;
		    }
		    sessions[sessionId] = JSON.stringify(sessionObj);
		    /*
                    for(var s in sessions){
			console.log("===== admin key : "+s);
                        var sessionObj = JSON.parse(sessions[s]);
                        if(sessionObj.passport.user==doc._id){
                            sessionObj.passport.auth=b;
                            if(b){
                                sessionObj.passport.userId=doc.login;
                            }else{
				delete sessionObj.passport.userId;
				}
                                sessions[s] = JSON.stringify(sessionObj);
                        }
                        cnt++
                    }
			*/
                }
            });
				response.json(data);
        });
    });

    app.get('/operator/:key', function (request, response) {

        var key = request.params.key;

        var query = {key:key};

        AppModel.findOne(query, function(err, doc){

            if (err) {

            }

            console.log( "docdocdocdoco" );
            console.log( doc );

            response.json(doc);
        });

    });

    app.get('/operator/session/:key', function (request, response) {

        var key = request.params.key;
        var cb = request.query.callback;

        var sessions = request.sessionStore.sessions;
        var operators = [];
        var allOperators=[];

        var count = Object.keys(sessions).length;
        var opCnt = 0;
        var cnt = 0;

        var host = request.headers.referer.replace("http://", '').replace( '/', '' ).split(':')[0];


				AppModel.findOne({key:key}, function(err, app){
            if(err){
                console.log(err);
                return response.send(cb+'('+JSON.stringify({error: err})+')');
            }

            if( app == null || app == undefined ){
                return response.send(cb+'('+JSON.stringify({error: "not registerd url"})+')');
            }

            var appUrl = url.parse( ( app.url.toLowerCase().indexOf( "http" ) > -1 )? app.url:"http://"+app.url);
            var refererUrl = url.parse( request.headers.referer );

						if( appUrl.hostname == refererUrl.hostname ){
							async.waterfall([ 
									function (callback){
											callback(null, app);
									},
									function (app, callback){
											var userArray = [];

											if(!app) callback(null, userArray);

											var userLength = app.users.length;
											var users = app.users;

											for(var i=0;i<userLength;i++){
													userArray[i] = users[i].userId;
													if(i==userLength-1){
															callback(null, userArray);
													}
											}
									},
									function (userArray, callback){
											XpushModel.find( { app:'stalk-io', deviceId:{$nin:['web','WEB'] }, userId:{$in:userArray} }
																			,{ userId: 1, deviceId: 1, _id:0 }, function(err, xUsers){
													callback(null, xUsers, userArray);
											});

									},
									function (xUsers, userArray, callback){

											var cnt=0;
											if(count==0){
												callback(null, xUsers);
											}
											for(var i=0;i<userArray.length;i++){

												for(var s in sessions){
														var sessionObj = JSON.parse(sessions[s]);
														console.log(sessionObj);
														if('user' in sessionObj.passport){
																var userId = sessionObj.passport.userId;
                                                                var userNm = sessionObj.passport.userNm;

                                                                console.log( "sessionObj.passport" );
                                                                console.log( sessionObj.passport );
																if('auth' in sessionObj.passport){


																	if(userId==userArray[i]){

																		var op = {userId:userId, deviceId:'WEB',userNm:userNm};
																		xUsers.push(op);
																	}
																}
														}

												}

												if(cnt==userArray.length-1){

														callback(null, xUsers);
												}
												cnt++
											}
									}

							],function (err, result){

									response.send(cb+'('+JSON.stringify(result)+')');

							});
						}else{
							response.send(cb+'('+JSON.stringify({error:"Host does not matched"})+')');
						}
				});



        function getUser(k, id,callback){
            User.findOne({_id:id}, function(err, doc){

                if (err) {

                }

                AppModel.findOne({userId:doc.login,url:url}, function(err, d){

                    if(d){

                        callback(k,{userId:d.userId,name:doc.name});
                    }else{
                        callback(k,null);
                    }
                });
            });
        }



        function getXpushUser(userId,userName,callback){
            XpushModel.find({app:'stalk-io',userId:userId},{ userId: 1, deviceId: 1, token:1, _id:0 }, function(err, xUsers){

                for(var xu in xUsers){

                    allOperators.push({deviceId:xUsers[xu].deviceId, userId:xUsers[xu].userId, name:userName, token:xUsers[xu].token});

                }
                callback();

            });


        }


    });

    app.get('/operator/session2/:url', function (request, response) {

        var url = request.params.url;
        var cb = request.query.callback;

        var sessions = request.sessionStore.sessions;
        var operators = [];
        var allOperators=[];

        var count = Object.keys(sessions).length;
        var opCnt = 0;
        var cnt = 0;

        console.log(sessions);

        if(count==0) response.send(cb+'('+JSON.stringify(operators)+')');

        async.waterfall([
            function (callback){
                for(var s in sessions){
                    var sessionObj = JSON.parse(sessions[s]);

                    if('user' in sessionObj.passport){
                        var _id = sessionObj.passport.user;
                        if('auth' in sessionObj.passport){
                            var op = {user:_id, auth:sessionObj.passport.auth};
                            operators.push(op);
                        }

                    }
                    if(cnt==count-1){
                        callback(null,operators);
                    }
                    cnt++
                }
            },
            function(operators, callback){
                var opcnt = 0;
                if(operators.length==0){
                    response.send(cb+'('+JSON.stringify(operators)+')');
                }
                for(var o in operators){
                    getUser(o,operators[o].user, function(k, doc){

                        if(doc){
                            console.log(doc);
                            operators[k].userId = doc.userId;
                            operators[k].deviceId = 'WEB';
                            operators[k].name = doc.name;

                        }

                        if(opcnt==operators.length-1){
                             callback(null,operators);
                        }
                        opcnt++
                    });
                }

            },
            function(operators, callback){
                var cnt=0;
                for(var op in operators){
                    var userId = operators[op].userId;
                    var userName = operators[op].name;
                    getXpushUser(userId,userName,function(){

                        if(cnt==operators.length-1){
                            callback(null);
                        }
                        cnt++;
                    });

                }

            }

        ],function(err, result){

            response.send(cb+'('+JSON.stringify(allOperators)+')');

        });

        function getUser(k, id,callback){
            User.findOne({_id:id}, function(err, doc){

                if (err) {

                }

                AppModel.findOne({userId:doc.login,url:url}, function(err, d){

                    if(d){

                        callback(k,{userId:d.userId,name:doc.name});
                    }else{
                        callback(k,null);
                    }
                });
            });
        }



        function getXpushUser(userId,userName,callback){
            XpushModel.find({app:'stalk-io',userId:userId},{ userId: 1, deviceId: 1, token:1, _id:0 }, function(err, xUsers){

                for(var xu in xUsers){

                    allOperators.push({deviceId:xUsers[xu].deviceId, userId:xUsers[xu].userId, name:userName, token:xUsers[xu].token});

                }
                callback();

            });


        }


    });




};
