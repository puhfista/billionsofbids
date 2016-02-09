/**
 * Created by ryanpfister on 3/12/15.
 */

var express = require('express');
var router = express.Router();


router.get('/:redirectBack?', function(req, res) {
	res.render('login', { title: 'Billions of Bids - Login', user: null, redirectBack: req.params.redirectBack });
});

module.exports = router;
