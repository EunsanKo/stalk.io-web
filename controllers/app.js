'use strict';
var events       = require('events'),
	AppModel = require('../models/app'),
	restify = require('restify'),
    auth = require('../lib/auth'),
    
    shortId  = require('shortid');
module.exports = function (app) {

	// Client
	/*var client = restify.createJsonClient({
	  	url: xpush.gatewayServer || 'http://localhost:8000',
	  	version: '*'
	});*/

    app.get('/app', auth.isAuthenticated(), function (request, response) {
        var query = {};
        

        AppModel.find(query, function(err, apps) {
            console.log("::::::::::::::::");
            console.log(apps);
            response.render('app', apps);
        });
    });

    app.get('/app/list', auth.isAuthenticated(),  function (request, response) {
        /*
        var query = {};

        AppModel.find(query,function(err, apps) {
            console.log("::::::::::::::::");
            console.log(apps);
            response.json({"apps":apps});
        });
        */
        console.log(request);
        var query = {"users.userId" : request.user.login};
        AppModel.find(query, function(err, apps) {
            response.send({status: "success", data: apps});
        });
    });

    app.get('/app/get/:appId', auth.isAuthenticated(), function (request, response) {
    	console.log(request.params.appId);

        var query = {appId:request.params.appId};

        AppModel.findOne(query, function(err, doc){
    
            if (err) {
                
            }
            console.log("::::::::::::::::");
            console.log(doc);
            response.json(doc);
        });
    	
    	
    });





    app.post('/app/create', auth.isAuthenticated(), function (request, response) {
        
        var model = new AppModel();

        model.appNm = request.param('appNm');
        model.appId = shortId.generate();

        model.save(function (err){
            console.log("::::::::::::::::");
            console.log(err);
            if(err) response.json(err);
            response.json({result:"Saved"});
        });
        
       
    });

    app.post('/app/remove', auth.isAuthenticated(), function (request, response) {

        var query = {appId:request.param('appId')};

        AppModel.findOne(query, function(err, doc){
    
            if (err) {
                
            }
            
            if(doc) doc.remove();
            
        });
        
    });
};
