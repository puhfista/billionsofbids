/**
 * Created by ryanpfister on 4/27/15.
 */


(function(categoryService) {
	var Category = require('../models/category.js');
	var q = require("q");
	var _ = require("underscore");

	categoryService.all = function(){
		var deferred = q.defer();

		var query = Category.find({});

		query.sort("group");

		query.exec({}, function(err, categories){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(_.map(categories, function(category){
				return {
					name: category.name + " (" + category.group + ")"
				}
			}));
		});


		return deferred.promise;
	};


	categoryService.search = function(letters){
		var deferred = q.defer();

		var query = Category.find({});

		query.or([{ name: { $regex: new RegExp(letters, "i") }}, { group: { $regex: new RegExp(letters, "i") }}]);
		query.sort("group");
		query.limit(50);

		query.exec({}, function(err, categories){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(categories);
		});


		return deferred.promise;
	};

	categoryService.getByIds = function(ids){
		var deferred = q.defer();

		Category.find({
			'_id': { $in: ids}
		}, function(err, categories){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(categories);
		});

		return deferred.promise;
	}

})(module.exports);
