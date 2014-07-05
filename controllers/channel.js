'use strict';
var events       = require('events'),
	ChannelModel = require('../models/channel'),
	restify = require('restify'),
    auth = require('../lib/auth');


module.exports = function (app) {

	
	
    app.get('/channel', auth.isAuthenticated(), function (request, response) {
        

        var model = new ChannelModel(xpush.gatewayServer);
        

        


        response.render('channel', model);
        




    });

    
   
};
