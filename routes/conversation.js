/**
 * Created by ryanpfister on 3/25/15.
 */

var express = require("express");
var auth = require("../auth");
var conversationService = require("../conversation");

var conversation = express.Router();

conversation.post("/message", auth.ensureApiAuthenticated, function(req, res){

	var otherUserId = req.body.otherUserId;
	var currentUserId = req.user.id;

	conversationService.saveMessage(req.user.accessToken, otherUserId, currentUserId, req.user.displayName, req.body.messageBody).then(function(result){
		res.send(result);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});

conversation.get("/otherUser/:otherUserId", auth.ensureApiAuthenticated, function(req, res){

	var otherUserId = req.params.otherUserId;
	var currentUserId = req.user.id;

	conversationService.getConversation(otherUserId, currentUserId).then(function(conversation){
		res.send(conversation);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});

conversation.get("/:limit?", auth.ensureApiAuthenticated, function(req, res) {

	var currentUserId = req.user.id;
	conversationService.getAllForUser(currentUserId, req.params.limit).then(function(data){
		res.send(data);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	});

});





	module.exports = conversation;