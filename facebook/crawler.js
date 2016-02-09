/**
 * Created by ryanpfister on 3/13/15.
 */

var Item = require("../models/item");

var regex = new RegExp("facebookexternalhit|Facebot");
var url = require("url");
var truncate = require("truncate");
var config = require("config");

var handleFacebookCrawler = function(req, res, next){

	if(regex.test(req.useragent.source) && req.params.itemId){
		Item.findById(req.params.itemId, function(err, item) {
			if(err){
				console.log(err);
				next();
				return;
			}

			res.render('itemSocial', {
				item: item,
				truncatedDescription: truncate(item.description, 300),
				path: config.forceDomain.protocol + '://' + req.headers.host + url.parse(req.originalUrl).pathname
			});
		});
	}
	else {
		next();
	}
};

module.exports.handleFacebookCrawler = handleFacebookCrawler;