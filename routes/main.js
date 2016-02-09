/**
 * Created by ryanpfister on 1/7/15.
 */

var express = require('express');
var router = express.Router();
var facebook = require("../facebook");

function serveMain(req, res){
	if(!req.isAuthenticated()){
		res.render('main', { title: 'Billions of Bids', user: null });
		return;
	}

	res.render('main', {title: 'Billions of Bids', user: req.user})
}


router.get('/details/:itemId', facebook.handleFacebookCrawler, serveMain);
router.get('/*', serveMain);

module.exports = router;
