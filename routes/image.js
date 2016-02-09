/**
 * Created by mrpfister on 2/20/15.
 */

var express = require('express');
var router = express.Router();
var auth = require("../auth");
var cloudinaryService = require("../cloudinary");
var itemService = require("../item");
var _ = require("underscore");

router.post("/upload", auth.ensureApiAuthenticated, function(req, res){
	cloudinaryService.uploadToCloud(req).then(function(result){
		res.send(result);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	});
});

router.post("/delete", auth.ensureApiAuthenticated, function(req, res){

	if(!req.body.itemId && !req.body.userId){
		res.status(403).send("Not your images");
	}

	if(!req.body.itemId && req.body.userId !== req.user.id) {
		res.status(403).send("Not your images");
	}

	function deleteFromCloud(){
		cloudinaryService.deleteFromCloud(req.body.imageId).then(function(result){
			res.send(result);
			res.end();
		}).fail(function(err){
			res.status(500).send(err);
			res.end();
		});
	}

	if(!req.body.itemId){
		deleteFromCloud();
		return;
	}

	itemService.getItem(false, req.body.itemId, null).then(function(item){
		if(item.userId == req.user.id){
			deleteFromCloud();
		}
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	});

});

module.exports = router;
