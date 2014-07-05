'use strict';

var User = require('../models/user'),
	Model = require('../models/signup');
    


module.exports = function (app) {

    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    app.get('/signup', function (req, res) {
    	var model = new Model();    
        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        res.render('signup',model);
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    app.post('/signup', function (req, res) {

    	
       	var email = req.param("email");
    	var name = req.param("name");
    	var password = req.param("password");
    	
    	console.log(email);
    	console.log(name);
    	console.log(password);

    	User.findOne({login: email}, function (err, user) {
            console.log(user);
            if(user){
            	req.flash('error', "Email already exists");
       			res.redirect("/signup");
            }else{
            	var u = new User({
			        name: name,
			        login: email,
			        password: password,
			        role: 'admin'
			    });
		    	u.save();
		    	res.redirect("/login");

            }
        });

    });

    

};
