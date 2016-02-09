var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Billions of Bids' });
});

router.get('/landing', function(req, res) {
	res.render('landing', { title: 'Billions of Bids' });
});

router.get('/termsOfService', function(req, res) {

	if(!req.isAuthenticated()){
		res.render('termsOfService', { title: 'Billions of Bids - Terms of Service', user: null });
		return;
	}

	res.render('termsOfService', {title: 'Billions of Bids - Terms of Service', user: req.user})
});

router.get('/privacyPolicy', function(req, res) {

	if(!req.isAuthenticated()){
		res.render('privacyPolicy', { title: 'Billions of Bids - Privacy Policy', user: null });
		return;
	}

	res.render('privacyPolicy', {title: 'Billions of Bids - Privacy Policy', user: req.user})
});

module.exports = router;
