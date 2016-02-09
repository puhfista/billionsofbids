/**
 * Created by mrpfister on 1/31/15.
 */

(function(facebookApi){

	var request = require("request");
	var fbCrawler = require("./crawler");
	var q = require("q");
	var config = require('config');

	var graphVersion = "https://graph.facebook.com/v2.2/";

	facebookApi.getProfilePicture = function(access_token){
		var deferred = q.defer();

		request(graphVersion + "me/picture?access_token=" + access_token + "&format=json&method=get&pretty=0&redirect=false&suppress_http_code=1", function(error, response,body){
			if(error){
				deferred.reject(error);
				return;
			}

			deferred.resolve(JSON.parse(body));
		});

		return deferred.promise;
	};

	facebookApi.getOtherUserInfo = function(userId, access_token){
		var deferred = q.defer();

		request(graphVersion + userId + "/?access_token=" + access_token, function(error, response,body){
			if(error){
				deferred.reject(error);
				return;
			}

			deferred.resolve(JSON.parse(body));
		});

		return deferred.promise;
	};

	facebookApi.postToUserFeed = function(access_token, options){
		var deferred = q.defer();

		request.post({
			url: graphVersion + "me/feed?access_token=" + access_token,
			formData: {
				message: options.message,
				link: options.linkUrl,
				picture: options.picture,
				caption: options.caption,
				name: options.name,
				description: options.description
			}
		}, function(error, response,body){
			if(error){
				deferred.reject(error);
				return;
			}

			deferred.resolve(JSON.parse(body));
		});

		return deferred.promise;
	};

	facebookApi.handleFacebookCrawler = fbCrawler.handleFacebookCrawler;


})(module.exports);