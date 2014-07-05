'use strict';

var LoginModel = require('../models/login'),
    User = require('../models/user'),
    passport = require('passport'),
    conf = require('../config/stalk');

var _              = require('underscore');
var shortId        = require('shortid');
var serverUtils    = require('../lib/utils');


module.exports = function (app ) {
  
    var model = new LoginModel();

    var authUrl = conf.oauth.googleplus.authUrl;
    if(_.isEmpty(conf.oauth.googleplus.authUrl)) authUrl = '/auth/google';

    var callbackUrl = conf.oauth.googleplus.callbackUrl;
    if(_.isEmpty(conf.oauth.googleplus.callbackUrl)) callbackUrl = '/auth/google/callback';

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    passport.use(new GoogleStrategy({
        clientID:     conf.oauth.googleplus.key,
        clientSecret: conf.oauth.googleplus.secret,
        callbackURL:  conf.serverUrl + callbackUrl
      },
      function(accessToken, refreshToken, rawProfile, done) {
        var profile = JSON.parse(rawProfile._raw);
        console.log('##############');
        console.log('accessToken  : ', accessToken);
        console.log('refreshToken : ', refreshToken);
        console.log('profile      : ', profile );
        console.log('##############');

        var name = profile.name;
        var login = "G"+profile.id;
        var password = profile.id;
        var picture = profile.picture;

        User.findOne({login: login}, function (err, user) {
          if(!user){
            var u = new User({
              name: name,
              login: login,
              password: password,
              role: 'admin',
              picture: picture
            });
            u.save();

            done(null, u);
          } else {
            user.picture = picture;
            user.name = name;
            done(null, user);
          }
        });        
      }
    ));

    app.get(authUrl,
      function (req, res, next) {
        //Do Somethinggggggg.
        passport.authenticate('google', { session: true, scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                                'https://www.googleapis.com/auth/userinfo.email'] })(req, res);
      });

    app.get(callbackUrl,
      passport.authenticate('google', { session: true, failureRedirect: "/login"}), function (req, res){
        res.redirect('/');
      });

    console.log('google oauth >');
    console.log('        - url :  '+ conf.serverUrl + authUrl );
    console.log('   - callback :  '+ conf.serverUrl + callbackUrl );
};