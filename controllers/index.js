'use strict';


var IndexModel = require('../models/index'),
    auth = require('../lib/auth'),
	events       = require('events'),
	AppModel = require('../models/app'),
	restify = require('restify');
	
    

module.exports = function (app) {

	var model = new AppModel();

    app.get('/', function (req, res) {
    	
		res.render('index', model);
    });

    app.get('/feature', function (req, res) {
		res.render('feature', model);
    });

    app.get('/install', function (req, res) {
		res.render('install', model);
    });

    app.get('/pricing', function (req, res) {
		res.render('pricing', model);
    });

    app.get('/contact', function (req, res) {
		res.render('contact', model);
    });
    
};
