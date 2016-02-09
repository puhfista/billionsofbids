/**
 * Created by ryanpfister on 3/23/15.
 */

var express = require("express");
var auth = require("../auth");
var bidService = require("../bid");
var itemService = require("../item");

var bid = express.Router();

bid.post("/", auth.ensureApiAuthenticated, function(req, res){
	bidService.saveBid(req).then(function(result){
		res.send(result);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});

bid.get("/item/:itemId", function(req, res){
	bidService.getBids(req.params.itemId).then(function(bids){
		res.send(bids);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});



function ensureSameUser(req, res, next){
	var itemId = req.params.itemId;

	if(!itemId){
		res.status(500).send("No item indicated");
		return;
	}

	itemService.getItem(false, itemId, req.user).then(function(item){
		if(req.user.id != item.userId){
			res.status(403).send("Unauthorized");
			return;
		}

		next();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	});

}


module.exports = bid;