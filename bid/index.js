/**
 * Created by ryanpfister on 3/25/15.
 */

(function(bidService){
	var Bid = require("../models/bid");
	var shortid = require('shortid');
	var _ = require("underscore");
	var q = require('q');

	var isNumeric = function( obj ) {
		return !_.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	};

	bidService.saveBid = function(req){
		var deferred = q.defer();

		setTimeout(function(){
			if(!req.body.itemId){
				deferred.reject(new Error("Invalid item id"));
			}

			if(!isNumeric(req.body.bidAmount)){
				deferred.reject(new Error("Invalid bid amount"));
			}

			var bid = new Bid({
				_id: "Item/" + req.body.itemId + "/Bid/" + shortid.generate(),
				itemId: req.body.itemId,
				userId: req.user.id,
				firstName: req.user.name.givenName,
				lastName: req.user.name.familyName,
				bidAmount: req.body.bidAmount
			});

			bid.save(function(err, result){
				if(err){
					deferred.reject(err);
					return;
				}

				deferred.resolve(result);
			});
		}, 0);

		return deferred.promise;
	};

	bidService.getBids = function(itemId){
		var deferred = q.defer();

		var query = Bid
			.where("itemId")
			.equals(itemId)
			.limit(10)
			.sort({bidAmount: -1, createdOn: -1});

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