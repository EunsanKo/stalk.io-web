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

    var authUrl = conf.oauth.twitter.authUrl;
    if(_.isEmpty(conf.oauth.twitter.authUrl)) authUrl = '/auth/twitter';

    var callbackUrl = conf.oauth.twitter.callbackUrl;
    if(_.isEmpty(conf.oauth.twitter.callbackUrl)) callbackUrl = '/auth/twitter/callback';

    var TwitterStrategy = require('passport-twitter').Strategy;
    passport.use(new TwitterStrategy({
        consumerKey:     conf.oauth.twitter.key,
        consumerSecret: conf.oauth.twitter.secret,
        callbackURL:  conf.serverUrl + callbackUrl
      },
      function(token, tokenSecret, rawProfile, done) {
        var profile = rawProfile._json;
        console.log('##############');
        console.log('token  : ', token);
        console.log('tokenSecret : ', tokenSecret);
        console.log('profile      : ', profile);
        console.log('##############');

        var name = profile.name;
        var login = "T"+profile.id;
        var password = profile.id;
        var picture = profile.profile_image_url;

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
        passport.authenticate('twitter', { session: true })(req, res);
      });

    app.get(callbackUrl,
      passport.authenticate('twitter', { session: true, failureRedirect: "/login"}), function (req, res){
        res.redirect('/');
      });

    console.log('Twitter oauth >');
    console.log('        - url :  '+ conf.serverUrl + authUrl );
    console.log('   - callback :  '+ conf.serverUrl + callbackUrl );
};