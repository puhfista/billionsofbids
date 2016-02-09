/**
 * Created by mrpfister on 1/12/15.
 */

(function (auth){

	var passport = require("passport");
	var facebookStrategy = require("passport-facebook").Strategy;
	var config = require('config');


	auth.init = function(app) {

		app.use(passport.initialize());
		app.use(passport.session());

		passport.use(new facebookStrategy({
					authorizationURL: 'https://www.facebook.com/v2.3/dialog/oauth',
					profileURL: 'https://graph.facebook.com/v2.3/me',
					tokenURL: 'https://graph.facebook.com/v2.3/oauth/access_token',
					clientID: 372074856315059,
					clientSecret: "8a5f26c7b274a04be00fa75f5e2d1ffa",
					callbackURL: config.get("Facebook").callbackUrl
				},
				function (accessToken, refreshToken, profile, done) {
					console.log("accessToken: " + accessToken);
					console.log("refreshToken: " + refreshToken);
					console.log("profile: " + profile);
					profile.accessToken = accessToken;
					done(null, profile);
				})
		);

		passport.serializeUser(function(user, done) {
			done(null, user);
		});

		passport.deserializeUser(function(user, done) {
			done(null, user);
		});


		app.get('/facebookLogin/:redirectBack?', function(req, res){
			req.session.backTo = req.params.redirectBack || "";
			res.redirect('/auth/facebook/');
		});

		app.get('/facebookWelcomeBack', function(req, res){
			console.log(req.session.backTo);
			res.redirect('/main' + (req.session.backTo || '/'));
		});

		app.get('/auth/facebook/', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends', 'publish_actions']}));

		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', { successRedirect: '/facebookWelcomeBack' , failureRedirect: '/main' }));

		app.get('/logout', function(req, res){
			req.logout();
			res.redirect('/');
		})

	};

	auth.ensureAuthenticated = function(req, res, next){
		if(req.isAuthenticated()){
			next();
		}
		else{
			req.session.returnTo = request.path;
			res.redirect("/login");
		}
	};

	auth.ensureApiAuthenticated = function(req, res, next){
		if(req.isAuthenticated()){
			next();
		}
		else{
			res.status(401).send("Unauthorized");
		}
	};


})(module.exports);