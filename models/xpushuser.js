'use strict';
var mongoose = require('mongoose'),
	app = require('../config/stalk');


var xpushUserModel = function () {
   	
   	
	var db = mongoose.createConnection('mongodb://' + app.xpushDatabaseConfig.host + '/' + app.xpushDatabaseConfig.database);


   	var xpushUserSchema = mongoose.Schema({
        userId: String,
        app: String,
        deviceId: String,
        token: String,
        userNm:String
    });

    return db.model('User', xpushUserSchema);

};

module.exports = new xpushUserModel();
