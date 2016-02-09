/**
 * Created by ryanpfister on 5/6/15.
 */


angular.module('main')
	.service('categories', function ($http, $timeout) {

		this.categoryGroupBy = function(category){
			return category.group;
		};

		this.refreshCategories = function(letters, $scope){
			if(!letters || letters.length <3){
				$scope.categories = [];
				return;
			}

			$http.post("/category/search/", {
				letters: letters
			}).success(function(categories){

				if(categories.length === 0){
					$scope.categories = [];
					return;
				}

				$scope.categories = categories;
			}).error(function(err){
				console.error(err);
			});
		};

	});