var express = require("express");
var auth = require("../auth");
var itemService = require("../item");
var facebook = require("../facebook");
var config = require("config");
var cloudinaryService = require("../cloudinary");

items = express.Router();

function postToFacebook(req, result){
	var linkUrl = config.forceDomain.protocol + "://" + config.forceDomain.domain + config.Facebook.itemDetailsPath + result.id;
	facebook.postToUserFeed(req.user.accessToken,{
		message: req.body.facebookStatusMessage || "",
		linkUrl: linkUrl,
		name: result.title,
		caption: config.Facebook.tagLine,
		description: result.description,
		picture: ((result.images && result.images.length > 0) ? cloudinaryService.getUrl(result.images[0], {secure: true, width: 350, height: 350, crop: 'pad'}) : "")
	}).then(function(result){
		console.log(result);
	}).fail(function(err){
		console.log(err);
	});
}

items.post("/", auth.ensureApiAuthenticated, function(req, res){
	res.type("json");

	itemService.saveItem(req).then(function(result){
		if(req.body.postToFacebook === true){
			postToFacebook(req, result);
		}

		res.send({id: result.id});
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	})
});

items.post("/update", auth.ensureApiAuthenticated, function(req, res) {
	res.type("json");

	itemService.updateItem(req).then(function(result){

		req.body.imagesToDelete.forEach(function(publicId){
			cloudinaryService.deleteFromCloud(publicId).then(function(result){

			}).fail(function(err){
				console.log(err);
			});
		});

		if(req.body.postToFacebook === true){
			postToFacebook(req, result);
		}

		res.send({id: result.id});
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});
});


items.get("/mostRecent/", function(req, res){
	itemService.getMostRecent(10).then(function(results){
		res.send(results);
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});
});

items.get("/:itemId", function(req, res){
	res.type("json");

	var itemId = req.params.itemId;
	var isAuthenticated = req.isAuthenticated();

	itemService.getItem(isAuthenticated, itemId, req.user).then(function(result){
		res.send(result);
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});
});

items.get("/forEdit/:itemId", function(req, res){
	res.type("json");

	var itemId = req.params.itemId;

	itemService.getItemForEdit(itemId).then(function(result){
		res.send(result);
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});
});

items.post("/search", function(req, res){
	res.type("json");

	itemService.search(req.body.location, req.body.title, req.body.categoryIds, req.body.distance).then(function(results){
		res.send(results);
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});
});

items.get("/", auth.ensureApiAuthenticated, function(req, res){
	res.type("json");

	itemService.getForUser(req.user.id).then(function(results){
		res.send(results);
		res.end();
	}).fail(function(err){
		console.log(err);
		res.status(500).send(err);
		res.end();
	});


});


module.exports = items;