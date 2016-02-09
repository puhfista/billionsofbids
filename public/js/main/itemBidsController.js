/**
 * Created by ryanpfister on 1/9/15.
 */

(function(){

    var app = angular.module("main");


    var itemBidsController = function($scope, $stateParams, $http){

		 $scope.itemId = $stateParams.itemId;


		 $http.get("/item/" + $scope.itemId).success(function(data){
			 $scope.item = data.item;
		 }).error(function(err){
			 console.error(err);
		 });

		 $http.get("/bid/item/" + $scope.itemId).success(function(bids){
			 $scope.bids = bids;
		 }).error(function(err){
			 console.error(err);
		 });

		 $scope.getRelativeDate = function(bid){
			 return moment(bid.createdOn).fromNow();
		 };

    };


    app.controller("itemBidsController", itemBidsController);



})();