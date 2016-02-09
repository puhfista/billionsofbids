/**
 * Created by ryanpfister on 3/25/15.
 */


(function(itemService){
	var Item = require('../models/item.js');
	var categoryService = require('../category');
	var geocodeService = require("../geocoder");
	var sanitizeHtml = require('sanitize-html');
	var facebook = require("../facebook");
	var q = require("q");
	var _ = require("underscore");

	itemService.saveItem = function(req){
		var deferred = q.defer();

		geocodeService.getCoords(req.body.address + ' ' + req.body.city + ' ' + req.body.state + ' ' + req.body.zip)
			.then(function(geocodeRes) {

				var categories = _.pluck(req.body.categories, '_id');

				var item = new Item({
					userId: req.user.id,
					images: req.body.images,
					title: sanitizeHtml(req.body.title, {
						allowedTags: []
					}),
					categories: categories,
					geolocation: [geocodeRes[0].longitude, geocodeRes[0].latitude],
					city: sanitizeHtml(geocodeRes[0].city, {
						allowedTags: []
					}),
					state: sanitizeHtml(geocodeRes[0].stateCode, {
						allowedTags: []
					}),
					zipcode: sanitizeHtml(geocodeRes[0].zipcode, {
						allowedTags: []
					}),
					videoUrl: (req.body.videoUrl ? sanitizeHtml(req.body.videoUrl, {
						allowedTags: []
					}) : null),
					description: sanitizeHtml(req.body.description, {
						allowedTags: []
					}),
					minimumBid: sanitizeHtml(req.body.minimumBid, {
						allowedTags: []
					}),
					endDate: sanitizeHtml(req.body.endDate, {
						allowedTags: []
					})
				});

				item.save(function(err, result){
					if(err){
						deferred.reject(err);
						return;
					}

					deferred.resolve(result);
				});
			})
			.fail(function(err) {
				deferred.reject(err);
			});

		return deferred.promise;
	};

	itemService.updateItem = function(req){
		var deferred = q.defer();

		var categories = _.pluck(req.body.categories, '_id');

		Item.update({ _id: req.body._id },
			{
				$set:
				{
					images: req.body.images,
					title: sanitizeHtml(req.body.title, {
						allowedTags: []
					}),
					categories: categories,
					videoUrl: (req.body.videoUrl ? sanitizeHtml(req.body.videoUrl, {
						allowedTags: []
					}) : null),
					description: sanitizeHtml(req.body.description, {
						allowedTags: []
					}),
					minimumBid: sanitizeHtml(req.body.minimumBid, {
						allowedTags: []
					}),
					endDate: sanitizeHtml(req.body.endDate, {
						allowedTags: []
					})
				}},
			function(err, item){
				if(err){
					deferred.reject(err);
					return;
				}

				deferred.resolve({
					id: req.body._id,
					title: req.body.title,
					description: req.body.description,
					images: req.body.images
				});
			});

		return deferred.promise;
	};


	itemService.getItem = function(getFacebookInfo, itemId, user){
		var deferred = q.defer();

		Item.findById(itemId, function(err, item){
			if(err){
				deferred.reject(err);
				return;
			}

			if(!getFacebookInfo || !user || !user.accessToken){
				deferred.resolve({
					item: item
				});
				return;
			}

			facebook.getOtherUserInfo(item.userId, user.accessToken).then(function(data){
				deferred.resolve({
					item: item,
					displayName: data.name,
					accessToken: user.accessToken
				});
			}).fail(function(err){
				res.status(500).send(err);
				res.end();
			});

		});

		return deferred.promise;
	};

	itemService.getItemForEdit = function(itemId){
		var deferred = q.defer();

		Item.findById(itemId, function(err, item){
			if(err){
				deferred.reject(err);
				return;
			}

			categoryService.getByIds(item.categories).then(function(categories){
				item._doc.categories = _.map(categories, function(category){
					return {
						_id: category._id,
						name: category.name,
						group: category.group
					}
				});
				deferred.resolve(item);
			}).fail(function(err){
				deferred.reject(err);
			});

		});

		return deferred.promise;
	};

	itemService.search = function(location, title, categories, distance){
		var deferred = q.defer();

		geocodeService.getCoords(location)
			.then(function(geocodeRes){

				var conditions = {};

				if(title){
					conditions["$text"] = { $search : title};
				}

				var scoreObject = null;

				if(title){
					scoreObject = {score : { $meta: "textScore" }};
				}

				var query = Item
					.find(conditions,scoreObject)
					.where('geolocation').within({ center: [geocodeRes[0].longitude, geocodeRes[0].latitude], radius: distance / 3963.1676, unique: true, spherical: true })
					.limit(10);

				if(categories.length > 0){
					query = query.where("categories").in(categories);
				}

				if(title) {
					query = query.sort({
						score: {$meta: 'textScore'}
					})
				}

				query.exec(function(err, documents) {
					if(err){
						deferred.reject(err);
						return;
					}

					deferred.resolve(documents);
				});


			}).catch(function(err) {
				deferred.reject(err);
			});

		return deferred.promise;
	};

	itemService.getForUser = function(userId){
		var deferred = q.defer();

		var query = Item.where("userId")
			.equals(userId)
			.sort("-createdOn");

		query.exec(function(err, data){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(data);
		});

		return deferred.promise;
	};

	itemService.getMostRecent = function(limit){
		var deferred = q.defer();
		var query = Item
			.where("images")
			.ne([])
			.sort("-createdOn")
			.limit(limit || 10);

		query.exec(function(err, data){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(data);
		});

		return deferred.promise;
	}


})(module.exports);