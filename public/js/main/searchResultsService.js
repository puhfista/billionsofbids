/**
 * Created by ryanpfister on 3/11/15.
 */

angular.module('main')
	.service('searchResults', function ($http, $timeout) {
		var results = [];
		var lastSearchObject = null;
		var savedSearch = null;

		this.setSavedSearch = function(searchObject){
			savedSearch = searchObject;
		};

		this.getSavedSearch = function(){
			return savedSearch;
		};

		this.performSearch = function(searchObject) {
			var deferred = Q.defer();

			$timeout(function() {
				if (_.isEqual(searchObject, lastSearchObject)) {
					deferred.resolve(results);
					return;
				}

				$http.post("/item/search", searchObject).success(function(data){
					lastSearchObject = searchObject;
					results = data;
					deferred.resolve(results);
				}).error(function(err){
					deferred.reject(err);
				});
			});

			return deferred.promise;
		};

	});
