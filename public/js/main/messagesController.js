/**
 * Created by ryanpfister on 1/11/15.
 */


(function(){

	var app = angular.module("main");

	var messagesController = function($scope, $window, $timeout, $http){
		var thisUserId = Number($("#loggedIn").val());

		$http.get("/conversation").success(function(data){
			$scope.conversations = data;

			addAd();
			addAd();
			addAd();
		}).error(function(err){
			console.error(err);
		});

		$scope.getOtherId = function(conversation){
			return (thisUserId == conversation.largerUser ? conversation.smallerUser : conversation.largerUser);
		};

		$scope.getOtherName = function(conversation){
			return (thisUserId == conversation.largerUser ? conversation.smallerName : conversation.largerName);
		};

		$scope.getRelativeDate = function(conversation){
			return moment(conversation.messages[conversation.messages.length -1].createdOn).fromNow();
		};

		$scope.getLastMessage = function(conversation){
			return conversation.messages[conversation.messages.length -1].body;
		};

		function addAd(){
			if (!$window.adsbygoogle) {
				$window.adsbygoogle = [];
			}
			$timeout(function(){
				$window.adsbygoogle.push({});
			});
		}
	};


	app.controller("messagesController", messagesController);

})();