/**
 * Created by ryanpfister on 3/25/15.
 */


(function(conversationService){

	var Conversation = require("../models/conversation");

	var facebookService = require("../facebook");
	var shortid = require('shortid');
	var q = require('q');
	var sanitizeHtml = require('sanitize-html');
	var socketService = require("../socket");
	var bigInt = require("big-integer");


	function getConversationParams(otherUserId, currentUserId){
		var numericOtherUserId = bigInt(otherUserId);
		var numericCurrentUserId = bigInt(currentUserId);

		var largerid = bigInt.max(numericOtherUserId, numericCurrentUserId);
		var smallerId = bigInt.min(numericOtherUserId, numericCurrentUserId);

		return {
			id: "Larger/" + largerid.toString() + "/Smaller/" + smallerId.toString(),
			largerId: largerid,
			smallerId: smallerId,
			numericOtherUserId: numericOtherUserId,
			numericCurrentUserId: numericCurrentUserId
		};
	}

	function getMessageId(convoId){
		return convoId + "/" + shortid.generate();
	}

	conversationService.getConversation = function(userId1, userId2){

		var deferred = q.defer();

		var params = getConversationParams(userId1, userId2);

		var query = Conversation.findById(params.id)
			.sort('-createdOn');

		query.exec(function(err, data){

			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(data);
		});

		return deferred.promise;
	};

	function conversationCreation(accessToken, convoParams, senderName){
		var deferred = q.defer();

		Conversation.findById(convoParams.id, function(err, conversation){
			if(err){
				deferred.reject(err);
				return;
			}

			if(!conversation){

				facebookService.getOtherUserInfo(convoParams.numericOtherUserId.toString(), accessToken).then(function(data){

					var conversation = new Conversation({
						_id: convoParams.id,
						largerUser: convoParams.largerId,
						smallerUser: convoParams.smallerId,
						largerName: (convoParams.largerId.equals(convoParams.numericOtherUserId) ? data.name : senderName),
						smallerName: (convoParams.smallerId.equals(convoParams.numericOtherUserId) ? data.name: senderName)
					});

					conversation.save(function(err, newConversation){
						if(err){
							deferred.reject(err);
							return;
						}

						deferred.resolve(newConversation);
					});

				}).fail(function(err){
					deferred.reject(err);
				});
			}
			else{
				deferred.resolve(conversation);
			}
		});

		return deferred.promise;
	}

	conversationService.saveMessage = function(accessToken, otherUserId, currentUserId, senderName, messageBody){
		var deferred = q.defer();

		var convoParams = getConversationParams(otherUserId, currentUserId);
		var convoId = convoParams.id;

		conversationCreation(accessToken, convoParams, senderName).then(function(conversation){
			console.log(conversation);

			var message = {
				_id: getMessageId(convoId),
				senderId: currentUserId,
				recipientId: otherUserId,
				senderName: senderName,
				body: sanitizeHtml(messageBody)
			};

			conversation.messages.push(message);

			conversation.save(function(err, modifiedConversation){
				if(err){
					deferred.reject(err);
					return;
				}

				message.convoId = convoId;
				modifiedConversation.messages = [];
				var returnResult = {
					message: message,
					convo: modifiedConversation
				};
				socketService.broadcastEvent({
					type: otherUserId + "messages",
					name: "newMessage",
					message: returnResult
				});

				deferred.resolve(returnResult);
			});

		}).fail(function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	};

	conversationService.getAllForUser = function(userId, limit){
		var deferred = q.defer();


		var query = Conversation.find( { $or:[ {'largerUser':userId}, {'smallerUser':userId} ]});

		if(limit){
			query.limit(limit);
		}

		query.sort("-createdOn");

		query.exec(function(err, data){
			if(err){
				deferred.reject(err);
				return;
			}

			deferred.resolve(data);
		});

		return deferred.promise;

	};



})(module.exports);