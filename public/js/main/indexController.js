/**
 * Created by ryanpfister on 1/8/15.
 */

(function() {

	var app = angular.module("main");

	var indexController = function($scope, $interval, $window, $timeout, $state, $http, searchResults, categories, alertThingy) {

		$scope.noWellOverride = true;
		$scope.search = {
			distance: 15
		};

		if(searchResults.getSavedSearch()){
			$scope.search = searchResults.getSavedSearch();
		}

		$scope.categories = [];

		$timeout(function(){
			addAd();
			addAd();
		});


		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(obj){
				$http.post("/location/getReverseLocation", {
					lng: obj.coords.longitude,
					lat: obj.coords.latitude
				}).success(function(data){
					if(data && !$scope.search.location) {
						$scope.search.location = data.city + ", " + data.state + " " + data.zipcode;
					}
				}).error(function(err){
					console.error(err);
				});
			});
		}

		$scope.categoryGroupBy = categories.categoryGroupBy;

		$scope.refreshCategories = function(letters){
			categories.refreshCategories(letters,  $scope);
		};

		$scope.doNothing = function(){};

		$scope.doSearch = function() {

			if(!$scope.search.categories || !$scope.search.location){
				var cheat = $("#homeSearchButton").offset();
				alertThingy({
					top: cheat.top,
					left: cheat.left,
					message: "Gotta tell us more! Help us help you!"
				});
				return;
			}

			searchResults.setSavedSearch($scope.search);

			var categoryIds = _.pluck($scope.search.categories, "_id");
			var categoryNames = _.map($scope.search.categories, function(category){
				return category.name + " (" + category.group + ")";
			});

			searchResults.performSearch({
				title: $scope.search.title,
				categoryIds: categoryIds,
				categoryNames: categoryNames,
				distance: $scope.search.distance,
				location: $scope.search.location
			}).then(function(data){
				$state.go("searchResults", {
					title: $scope.search.title,
					categoryIds: angular.toJson(categoryIds, false),
					categoryNames: angular.toJson(categoryNames, false),
					distance: $scope.search.distance,
					location: $scope.search.location
				});
			}).fail(function(err){
				console.error(err);
			});
		};

		function addAd() {
			if (!$window.adsbygoogle) {
				$window.adsbygoogle = [];
			}
			$timeout(function () {
				$window.adsbygoogle.push({});
			});
		}
	};

	app.controller("indexController", indexController);

}());