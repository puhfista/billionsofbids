/**
 * Created by ryanpfister on 1/8/15.
 */

(function(){

	var app = angular.module("main");

	var listItemController = function($scope, $http, $timeout, $state, imageUpload, categories, authService){
		$scope.noWellOverride = true;

		$scope.item = {postToFacebook: true};
		$scope.images = [];
		$scope.categories = [];

		imageUpload.setButtonSpinner(Ladda.create($("#listItemUploadButton")[0]));

		imageUpload.subscribeImageUploaded(function(image){
			$scope.images.push(image);
		});

		$scope.categoryGroupBy = categories.categoryGroupBy;

		$scope.refreshCategories = function(letters){
			categories.refreshCategories(letters, $scope);
		};

		$scope.deleteImage = function(imageData){

			$scope.images = _.filter($scope.images, function(img){
				return img.public_id != imageData.public_id;
			});

			imageUpload.deleteImage(imageData, authService.currentUserId(), null);
		};

		$scope.$watch('files', imageUpload.watchFiles);

		$scope.postItem = function(){
			$scope.item.images = [];
			_.each(imageUpload.getImages(), function(image){
				$scope.item.images.push(image.public_id);
			});
			$http.post("/item", $scope.item).success(function(data, status, headers){
				$state.go("itemDetails", {itemId: data.id});
			}).error(function(data, status, headers){
				//handle this
			});
		};

		$scope.$on('$viewContentLoaded', function(){
			$('#listItemForm [data-toggle="popover"]').popover()
		});

	};

	app.controller("listItemController", listItemController);

})();