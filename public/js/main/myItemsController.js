/**
 * Created by ryanpfister on 1/9/15.
 */

(function(){

	var app = angular.module("main");

	var myItemsController = function($scope, $http, imagePreview){

		$scope.getImagePreview = function(item){
			return imagePreview(item, null, "small");
		};

		$scope.getRelativeDate = function(item){
			return moment(item.createdOn).fromNow();
		};

		$http.get("/item").success(function(data){
			$scope.items = data;
		}).error(function(err){
			console.error(err);
		});


	};


	app.controller("myItemsController", myItemsController);


})();