/**
 * Created by ryanpfister on 3/25/15.
 */

(function(){

	var app = angular.module("main");

	var messageHeaderController = function($scope, $http){
		var socket = io.connect();

		var thisUserId = $("#loggedIn").val();
		$scope.messageBadgeNum = 0;


		socket.emit("joinNamespace", thisUserId + "messages");

		socket.on("newMessage", function(result){
			if(!$scope.conversations){
				$scope.conversations = [];
			}

			var int;
			var affectedConvo = _.find($scope.conversations, function(a,b,c){
				int = b;
				return a._id == result.convo._id;
			});

			if(affectedConvo){
				affectedConvo.messages.push(result.message);
				//$scope.conversations[int] = affectedConvo
			}
			else{
				result.convo.messages.push(result.message);
				$scope.conversations.push(result.convo);
			}

			$scope.messageBadgeNum++;
			$scope.$apply();
		});

		$http.get("/conversation/10").success(function(data){
			$scope.conversations = data;
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
	};

	app.controller("messageHeaderController", messageHeaderController);

})();