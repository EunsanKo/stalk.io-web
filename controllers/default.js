'use strict';
var events       = require('events'),
	AppModel = require('../models/app'),
	restify = require('restify'),
    auth = require('../lib/auth'),
    
    shortId  = require('shortid');
module.exports = function (app) {
    app.get('/default', auth.isAuthenticated(), function (request, response) {
        response.render('default', {});
               
    });

}