var lobbyName = 'lobby';
var usersDic = {};

module.exports = function(server) {
	var io = require("socket.io")(server, { path : '/jason/socket'});

	io.on('connection', function(socket){
		usersDic[socket.id] = {
			'id' : socket.id,
			'ip' : socket.request.connection.remoteAddress,
			'uname' : ''
		}
		socket.room = '';

	    var onevent = socket.onevent;
	    //joinRoom(socket, lobbyName);
	    console.log(socket.id + ' connected');
	    console.log('connections : ' + io.engine.clientsCount);

	    socket.onevent = function (packet) {
	        var args = packet.data || [];
	        onevent.call (this, packet);
	        packet.data = ["*"].concat(args);
	        onevent.call(this, packet);
	    };
	    socket.on('setname', function(pn) {
	    	usersDic[socket.id].uname = pn;
	    	console.log(usersDic);
	    });
	    socket.on('disconnect', function(e){
	    	console.log(socket.id + ' closed');
	    	emitToRoom(socket, 'user_disconnect', socket.id);
	    	console.log('connections : ' + io.engine.clientsCount);
	    	delete usersDic[socket.id];
	    });
	    socket.on('join', function(room, cb) {
	    	if (usersDic[socket.id].uname =='') {
	    		cb('err: setname first');
	    		return;
	    	}
	    	joinRoom(socket, room);
	    	cb('done');
	    });
	    socket.on('leave', function(cb) {
	    	if (usersDic[socket.id].uname =='') {
	    		cb('err: setname first');
	    		return;
	    	}
	    	joinRoom(socket, lobbyName);
	    });
	    socket.on('userlist', function(fn) {
    		var _ss = io.sockets.adapter.rooms[socket.room].sockets;
    		var _list = [];
    		for (var itm in _ss) {
    			_list.push(usersDic[itm]);
    		}
    		fn(_list);
    	});

	    socket.on("*", function() {
	        //console.log("Socket data");
	        //console.log(arguments);
	        var event = arguments[0];
	        if (event == 'join') return;
	        if (event == 'leave') return;
	        if (event == 'userlist') return;
	        if (event == 'setname') return;
	        var args = Array.prototype.slice.call(arguments);
	    	args.splice(0, 0, socket);
	        emitToRoom.apply(null, args);
	    });
	});
	function emitToSocket(socket) {
		var args = Array.prototype.slice.call(arguments);
		var _id = args[1];
		args.splice(0,2);
		socket.to(_id).emit.apply(socket, args);
	}
	function emitToRoom(socket) {
		var args = Array.prototype.slice.call(arguments);
		args.splice(0,1);
		socket.to(socket.room).emit.apply(socket, args);
	}
	function joinRoom(socket, room) {
		if (socket.room == room) return;
		emitToRoom(socket, 'user_leave', socket.id);
		socket.leave(socket.room);
		socket.join(room);
		socket.room = room;
		emitToRoom(socket, 'user_join', socket.id);
	}
}