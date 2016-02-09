/**
 * Created by ryanpfister on 3/25/15.
 */


var express = require('express');
var facebook = express.Router();
var auth = require("../auth");
var facebookService = require("../facebook");

facebook.get("/userInfo/:userId", auth.ensureApiAuthenticated, function(req, res){

	facebookService.getOtherUserInfo(req.params.userId, req.user.accessToken).then(function(data){
		res.send(data);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	});

});

module.exports = facebook;