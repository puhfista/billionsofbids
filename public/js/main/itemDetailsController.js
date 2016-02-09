/**
 * Created by ryanpfister on 1/8/15.
 */


(function() {

	var app = angular.module("main");

	var itemDetailsController = function($scope, $stateParams, $window, $http, $timeout, $location, $animate, authService, alertThingy, imagePreview, angularLoad) {

		var socket = io.connect();
		$animate.enabled(false);

		var poundRegex = /#(.*)?/;
		var questionRegex = /\?(.*)?/;

		$scope.itemId = $stateParams.itemId;
		$scope.absoluteUrl = $location.absUrl().replace(poundRegex, "").replace(questionRegex, "");
		console.log($scope.absoluteUrl);


		$scope.getEncodedField = function(item, field){

			if(field == "image"){
				return (item.images.length > 0 ? encodeURIComponent($scope.getImagePreview(item.images[0], "large")) : "");
			}

			return encodeURIComponent(item[field]);
		};

		$scope.getImagePreview = function(image, size){

			if(!$scope.item)
				return "";

			return imagePreview($scope.item, image, size);
		};

		socket.emit("joinNamespace", $scope.itemId);

		$scope.highestbid = [];
		socket.on("itemBid", function(bid){
			console.log("bid added:" + JSON.stringify(bid));
			if($scope.highestbid.length ==0
				|| !$scope.highestbid[0]
				|| ($scope.highestbid.length > 0 &&  bid.bidAmount > $scope.highestbid[0].bidAmount)) {
				$scope.highestbid.pop();
				$timeout(function () {
					$scope.highestbid.unshift(bid);
					$scope.$apply();
				}, 0);
			}

			$scope.bids.push(bid);
			$scope.$apply();
		});

		$http.get("/item/" + $scope.itemId).success(function(data){
			$scope.item = data.item;
			$scope.displayName = data.displayName;
			$scope.accessToken = data.accessToken;
			$scope.isUsersItem = authService.currentUserId() == data.item.userId;


			window.fbAsyncInit = function() {
				FB.init({
					appId      : '372074856315059',
					xfbml      : false,
					version    : 'v2.3'
				});

				addAd();
			};


			angularLoad.loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=372074856315059').then(function(){


				FB.XFBML.parse($("#itemFacebookLikes")[0]);
				FB.XFBML.parse($("#itemFacebookComments")[0]);


				var pinterestAnchor = $("<a />");
				pinterestAnchor.attr("href", "https://www.pinterest.com/pin/create/button/" +
					"?url=" + encodeURIComponent($scope.absoluteUrl) +
					"&media=" + $scope.getEncodedField($scope.item, 'image') +
					"&description=" + $scope.getEncodedField($scope.item, 'description'));
				pinterestAnchor.attr("data-pin-do", "buttonPin");
				//pinterestAnchor.attr("data-pin-config", "above");
				$("#pinterestContainer").append(pinterestAnchor);

				console.log('what?');
				angularLoad.loadScript('/js/pinterest.js').then(function(){
					$scope.pinterestLoaded = true;
				}).catch(function(){
					console.error('failed to load pinterest');
				});

				initLightbox();
			});
		}).error(function(err){
			console.error(err);
		});

		$http.get("/bid/item/" + $scope.itemId).success(function(bids){
			$scope.bids = bids;

			$scope.highestbid.push(bids[0]);

			$timeout(function(){
				$animate.enabled(true)
			});

		}).error(function(err){
			console.error(err);
		});

		$scope.placeBid = function(){

			if(!authService.isAuthenticated()){
				authService.redirectToLogin();
				return;
			}

			var cheat = $("#bidPlacingButton").offset();
			if(!$scope.bidAmount){

				alertThingy({
					top: cheat.top,
					left: cheat.left,
					message: "Tell us how muchgit!"
				});

				return;
			}

			var bidAmount = $scope.bidAmount;
			$scope.bidAmount = null;

			$http.post("/bid", {
				itemId: $scope.itemId,
				bidAmount: bidAmount
			}).success(function(bid){
				socket.emit("itemBid", {
					itemId: bid.itemId,
					firstName: bid.firstName,
					lastName: bid.lastName,
					bidAmount: bid.bidAmount
				});

				alertThingy({
					top: cheat.top,
					left: cheat.left,
					message: "Bid placed yo!"
				});
			}).error(function(err){
				console.error(err);
			});
		};

		$scope.getRelativeDate = function(bid){
			return moment(bid.createdOn).fromNow();
		};

		$scope.formatBid = function(bidAmount){
			if(!bidAmount) {
				return "";
			}

			return bidAmount.format();
		};

		function initLightbox(){
			$("#itemDetailsDOM").find(".thumbnail-view-hover").click(function(e){
				e.preventDefault();
				$(this).ekkoLightbox();
			});

			$("#itemDetailsDOM").find("#itemDetailsVideo").click(function(e){
				e.preventDefault();
				$(this).ekkoLightbox();
			});
		}

		function addAd(){
			if (!$window.adsbygoogle) {
				$window.adsbygoogle = [];
			}
			$timeout(function(){
				$window.adsbygoogle.push({});
			});
		}

	};

	app.controller("itemDetailsController", itemDetailsController);

}());