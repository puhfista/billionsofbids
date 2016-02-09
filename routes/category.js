/**
 * Created by ryanpfister on 4/27/15.
 */

var express = require("express");
var auth = require("../auth");
var categoryService = require("../category");
var facebook = require("../facebook");
var config = require("config");

categories = express.Router();

categories.get("/", function(req, res){
	categoryService.all().then(function(categories){
		res.send(categories);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});

categories.post("/search", function(req, res){
	categoryService.search(req.body.letters).then(function(categories){
		res.send(categories);
		res.end();
	}).fail(function(err){
		res.status(500).send(err);
		res.end();
	})
});

module.exports = categories;