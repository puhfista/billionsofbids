/**
 * Created by ryanpfister on 1/11/15.
 */

(function(){

	var app = angular.module("main");

	var conversationController = function($scope, $stateParams, $http, $timeout, smoothScroll){
		var socket = io.connect();

		$scope.otherUserId = $stateParams.otherUserId;

		var thisUserId = $("#loggedIn").val();
		socket.emit("joinNamespace", thisUserId + "messages");

		socket.on("newMessage", function(result){
			$scope.messages.push(result.message);
			$scope.$apply();
		});

		$http.get("/facebook/userInfo/" + $scope.otherUserId).success(function(data){
			$scope.otherPersonName = data.name;
			$scope.otherPersonLink = data.link;
		}).error(function(err){
			console.error(err);
		});

		$http.get("/conversation/otherUser/" + $scope.otherUserId).success(function(data){
			$scope.messages = (data ? data.messages : []);

			$timeout(function(){
				var element = document.getElementById('conversationTextbox');
				smoothScroll(element);
			});
		}).error(function(err){
			console.error(err);
		});

		$scope.sendMessage = function(){

			$http.post("/conversation/message", {
				otherUserId: $scope.otherUserId,
				messageBody: $scope.newMessageBody
			}).success(function(result){
				$scope.messages.push(result.message);
				$scope.newMessageBody = "";
			}).error(function(err){
				console.error(err);
			})

		};

		$scope.getRelativeDate = function(message){
			return moment(message.createdOn).fromNow();
		};


	};

	app.controller("conversationController", conversationController);

})();