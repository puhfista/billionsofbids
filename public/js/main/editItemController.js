/**
 * Created by ryanpfister on 6/4/15.
 */

(function(){

	var app = angular.module("main");

	var editItemController = function($scope, $stateParams, $http, $timeout, $state, imageUpload, categories, authService, thumbnailUrl){
		$scope.noWellOverride = true;

		$scope.itemId = $stateParams.itemId;
		$scope.categories = [];
		$scope.imagesToDelete = [];


		$http.get("/item/forEdit/" + $scope.itemId).success(function(data) {


			var imageFacades = _.map(data.images, function(publicId){
				return {
					public_id: publicId,
					thumbnailUrl: thumbnailUrl + publicId
				};
			});

			$scope.images = imageFacades;
			imageUpload.setImages(_.clone(imageFacades));
			$scope.item = data;
			$scope.item.postToFacebook = false;

		});

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

			imageUpload.setImages(_.clone($scope.images));
			console.log('deleting image ' + imageData.public_id);
			$scope.imagesToDelete.push(imageData.public_id);
		};

		$scope.$watch('files', imageUpload.watchFiles);

		$scope.editItem = function(){
			$scope.item.images = [];
			_.each(imageUpload.getImages(), function(image){
				$scope.item.images.push(image.public_id);
			});
			$scope.item.imagesToDelete = $scope.imagesToDelete;
			$http.post("/item/update", $scope.item).success(function(data, status, headers){
				$state.go("itemDetails", {itemId: data.id});
			}).error(function(data, status, headers){
				console.error("failed to update item");
			});
		};

		$scope.$on('$viewContentLoaded', function(){
			$('#listItemForm [data-toggle="popover"]').popover()
		});

	};

	app.controller("editItemController", editItemController);

})();