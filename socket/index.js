/**
 * Created by ryanpfister on 3/23/15.
 */


(function(socketService){

	var socketio = require('socket.io');
	var EventEmitter = new require('events').EventEmitter;
	var emitter = new EventEmitter();


	socketService.init = function(server){

		var io = socketio.listen(server);

		//var bidNamespace = io.of('/bid');

		emitter.on("eventPushed", function (event) {
			console.log('event "' + event.name + '": "' + event.message + '"');

			if(event.type) {
				io.sockets.in(event.type).emit(event.name, event.message);
			}
			else{
				io.emit(event.name, event.message);
			}
		});


		io.on('connection', function(socket){
			console.log('socket connected');

			socket.on("joinNamespace", function(namespaceId){
				console.log('joining namespace ' + namespaceId);
				socket.join(namespaceId);
			});

			socket.on("itemBid", function(bid){
				console.log(bid.itemId + ' just received a bid');
				io.to(bid.itemId).emit("itemBid", bid);
			});
		});
	};

	socketService.broadcastEvent = function(event){
		emitter.emit("eventPushed", event);
		console.log('event pushed emitted');
	};


})(module.exports);