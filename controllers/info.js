'use strict';

var User = require('../models/user'),
	AppModel = require('../models/app'),
    stalk = require('../config/stalk'),
    auth = require('../lib/auth'),
		shortId = require('shortid'),
    restify = require('restify');



module.exports = function (app) {

    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/info',auth.isAuthenticated('admin'), function (req, res) {

        console.log(req.user.login);


        var query = {"users.userId" : req.user.login};
        AppModel.find(query, function(err, apps) {
            res.render('info', {apps:apps});
        });


    });

    app.get('/info/:name/settings',auth.isAuthenticated('admin'), function (req, res) {
        console.log("===== info/:name",req.param('name'));
        console.log(req.user.login);
        var name = req.param('name');

        var query = {"users.userId" : req.user.login, name: name};
        AppModel.findOne(query, function(err, app) {
            res.render('info', {app:app , hostname: name});
        });

    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */

/*

           */


    app.post('/regist',auth.isAuthenticated('admin'), function (request, response) {
        console.log("===== /regist");
        console.log(request.user);
        var email = request.user.login;
        var userNm = request.user.name;
        var pic = request.user.picture;
    	var app = request.param("app");
    	var url = request.param("url");
        var name = request.param("name");
        var password = request.user.password;
				var key = shortId.generate();

        console.log('/regist',request.param('name'));
        var client = restify.createJsonClient({
            url: stalk.sessionServer || 'http://www.notdol.com:8000',
            version: '*'
        });


        var param = {
            app: "stalk-io",
            url : url,
            userId: email,
            deviceId: 'WEB',
            name : name,
            password: password
        }

        var saveObj = {
            app: "stalk-io",
            url : url,
						key : key,
            users: [{userId:email,userNm:userNm,pic: pic}],
						name: name
        }


        client.post('/user/register', param, function (err, req, res, data) {
          if(err) {
            console.log("An error ocurred:", err);
          }

          if(data.status=="ok"){
						AppModel.findOne({key:key}, function(err, app) {
								if(app){
									app.users.push({userId:email,userNm:userNm,pic:pic});
									app.save();
								}else{
									var sapp = new AppModel(saveObj);
									sapp.save();
								}
						});
          }
          response.send({"msg":data.status});
        });
    });

    app.post('/delete',auth.isAuthenticated('admin'), function (request, response) {



        var deleteId = request.param("deleteId");

        var query = {'_id':deleteId};
        console.log(query);
        AppModel.findOne(query, function(err, doc){

            if (err) {

            }
            console.log(doc);
            if(doc) doc.remove();

        });
	response.send({"msg": "success"});
        //response.redirect("/infos");
    });

    app.get('/infos',auth.isAuthenticated('admin'), function (req, res) {
        var query = {"users.userId" : req.user.login};
        AppModel.find(query, function(err, apps) {
            res.render('infos', {apps:apps});
        });
    });
};
