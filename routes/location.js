/**
 * Created by ryanpfister on 3/13/15.
 */

var express = require('express');
var router = express.Router();
var geocoderService = require("../geocoder");

router.post('/getReverseLocation', function(req, res) {

	geocoderService.reverseLookup({
		lat: req.body.lat,
		lng: req.body.lng
	}).then(function (geoResponse) {
		res.send(geoResponse);
		res.end();
	}).fail(function (err) {
		res.status(500).send(err);
		res.end();
	});
});

module.exports = router;