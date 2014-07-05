'use strict';

var LoginModel = require('../models/login'),
    User = require('../models/user'),
    auth = require('../lib/auth'),
    passport = require('passport');


module.exports = function (app) {

    var model = new LoginModel();


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/login', function (req, res) {
        
        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        model.loginPage = "true";
        //res.render('login', model);
        res.send('');
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    app.post('/login', function (req, res) {

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: "/login",
            failureFlash: true
        })(req, res);

    });


     /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    app.post('/app/login', function (req, res) {
        
        var username = req.param("username");
        var password = req.param("password");

        console.log(username);
        console.log(password);

        //Retrieve the user from the database by login
        User.findOne({login: username}, function (err, user) {
            console.log(user);
            //If something weird happens, abort.
            if (err) {
                res.json({message:"error"});
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                res.json({ message: 'Login not found' });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.passwordMatches(password)) {
                res.json({ message: 'Incorrect Password' });
            }

            //If everything passes, return the retrieved user object.
            res.json({message:"ok",user:user});

        });

    });

    /**
     * Allow the users to log out
     */
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/userInfo',auth.isAuthenticated(),function (req, res){
        res.send({ status:'success', data : req.user });
    });

};
