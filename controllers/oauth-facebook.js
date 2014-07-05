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
    console.log(conf.oauth.facebook);
    var authUrl = conf.oauth.facebook.authUrl;
    if(_.isEmpty(conf.oauth.facebook.authUrl)) authUrl = '/auth/facebook';

    var callbackUrl = conf.oauth.facebook.callbackUrl;
    if(_.isEmpty(conf.oauth.facebook.callbackUrl)) callbackUrl = '/auth/facebook/callback';

    var FacebookStrategy = require('passport-facebook').Strategy;
    passport.use(new FacebookStrategy({
        clientID:     conf.oauth.facebook.key,
        clientSecret: conf.oauth.facebook.secret,
        callbackURL:  conf.serverUrl + callbackUrl
      },
      function(accessToken, refreshToken, profile, done) {
        console.log('##############');
        console.log('accessToken  : ', accessToken);
        console.log('refreshToken : ', refreshToken);
        console.log('profile      : ', profile);
        console.log('##############');

        var name = profile.displayName;
        var login = "F"+profile.id;
        var password = profile.id;
        var picture = "https://graph.facebook.com/"+profile.id+"/picture"

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
        passport.authenticate('facebook', { session: true })(req, res);
      });

    app.get(callbackUrl,
      passport.authenticate('facebook', { session: true, failureRedirect: "/login"}), function (req, res){
        res.redirect('/');
      });

    console.log('Facebook oauth >');
    console.log('        - url :  '+ conf.serverUrl + authUrl );
    console.log('   - callback :  '+ conf.serverUrl + callbackUrl );
};