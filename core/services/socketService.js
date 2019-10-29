/***
socketService
Returns and instande of socket.io server
***/

const Rx = require('rxjs');
const IoServer = require('socket.io');
const notif = require('../models/conversationModel')
const turnos = require('../models/turnoModel')

// Socket I/O server


/***
 *
    httpServer (http.Server) the server to bind to.


Server Side
==============================================================================
const Server = require('socket.io');

const io = require('socket.io')()

or

const Server = require('socket.io');
const io = new Server(httpServer, options)

server === io == instance of an engine.io

    options (Object)
        path (String): name of the path to capture server side (/socket.io)
      serveClient (Boolean): whether to serve the client files (true)
        adapter (Adapter): the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See socket.io-adapter
        origins (String): the allowed origins (*)
        parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.
			 pingTimeout (number) (60000) how many ms without a pong packet to consider the connection closed
			 pingInterval (number) (25000) how many ms before sending a new ping packet
			 transports (Array<string>): transports to allow connections to. Default = ['polling', 'websocket']
			  cookie: (Boolean)
			  reconnection

    		reconnection (Boolean) whether to reconnect automatically (true)
    		reconnectionAttempts (Number) number of reconnection attempts before giving up (Infinity)
    		reconnectionDelay (Number) how long to initially wait before attempting a new reconnection (1000). 
    		      Affected by +/- randomizationFactor, for example the default initial delay will be between 500 to 1500ms.
    		reconnectionDelayMax (Number) maximum amount of time to wait between reconnections (5000). 
    		            Each attempt increases the reconnection delay by 2x along with a randomization as above
    		randomizationFactor (Number) (0.5), 0 <= randomizationFactor <= 1
    		timeout (Number) connection timeout before a connect_error and connect_timeout events are emitted (20000)
    		autoConnect (Boolean) by setting this false, you have to call manager.open whenever you decide it's appropriate
    		query (Object): additional query parameters that are sent when connecting a namespace (then found in socket.handshake.query object on the server-side)
    		parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.

io.serveClient(true|false) //previous to io.attach()!!!
io.attach(server, opts) or io.listen(server, opts) // synonyms
io.sockets

clients_in_room = io.sockets.adapter.rooms[roomId]
const adminNamespace = io.of('/notifications' || '/');
			Initializes and retrieves the given Namespace by its pathname identifier nsp. If the namespace was already initialized it returns it immediately.

const connectedSocketIds = adminNamespace.connected;
iterate:
    ns.connected[id]
    ns.connected[id].rooms.indexOf(roomId)

io.sockets.sockets.map(function(e) {
    return e.username;
})    

io.sockets.connected //Return {socket_1_id: {}, socket_2_id: {}} . This is the most convenient one, since you can just refer to io.sockets.connected[id] then do common things like emit()
io.sockets.sockets //Returns [{socket_1}, {socket_2}, ....]. Can refer to socket_i.id to distinguish
io.sockets.adapter.sids //Return {socket_1_id: {}, socket_2_id: {}} . Looks similar to the first one but the object is not actually the socket, just the information.

// Not directly helps but still relevant
io.sockets.adapter.rooms //Returns {room_1_id: {}, room_2_id: {}}
io.sockets.server.eio.clients //Return client sockets
io.sockets.server.eio.clientsCount //Return number of connected clients
Also, do note that when using socket.io with namespace, the above methods will break since io.sockets becomes an array instead of an object. To resolve, just replace io.sockets by io (i.e io.sockets.connected becomes io.connected, io.sockets.adapter.rooms becomes io.adapter.rooms ...)

function findClientsSocket(io, roomId, namespace) {
    var res = [],
        ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                // ns.connected[id].rooms is an object!
                var rooms = Object.values(ns.connected[id].rooms);  
                var index = rooms.indexOf(roomId);
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            }
            else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}



ioSite.of('/').in(roomId).clients((error, clients) => {
    if (error) throw error;
    for (var i=0;i<clients.length;i++) {
        clientId=clients[i];
        console.log(clientId);

        // load the socket of your namespace
        var socket=ioSite.of('/').in(roomId).connected[clientId]
        console.log(socket.constructor.name);
        console.log(socket.id);
    }
});
const Server = require('socket.io');
const PORT   = 3030;
const server = require('http').Server(); // qué hace esto???

const io = Server(PORT);

io.close(); // Close current server

server.listen(PORT); // PORT is free to use

io = Server(server);

io.sockets.sockets[socketId] --> un cierto socket

var clients = io.sockets.clients();
var clients = io.sockets.clients('room'); // all users from room `room`

var clients = io.of('/chat').clients();
var clients = io.of('/chat').clients('room'); // all users from room `room`

================================
Client Side
    options (Object)
        path (String): name of the path to capture server side (/socket.io)
        serveClient (Boolean): whether to serve the client files (true)
        adapter (Adapter): the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See socket.io-adapter
        origins (String): the allowed origins (*)
        parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.
			  pingTimeout (number) (60000) how many ms without a pong packet to consider the connection closed
			  pingInterval (number) (25000) how many ms before sending a new ping packet
			  transports (Array<string>): transports to allow connections to. Default = ['polling', 'websocket']
			  cookie: (Boolean)
			  reconnection

    		reconnection (Boolean) whether to reconnect automatically (true)
    		reconnectionAttempts (Number) number of reconnection attempts before giving up (Infinity)
    		reconnectionDelay (Number) how long to initially wait before attempting a new reconnection (1000). 
    		      Affected by +/- randomizationFactor, for example the default initial delay will be between 500 to 1500ms.
    		reconnectionDelayMax (Number) maximum amount of time to wait between reconnections (5000). 
    		            Each attempt increases the reconnection delay by 2x along with a randomization as above
    		randomizationFactor (Number) (0.5), 0 <= randomizationFactor <= 1
    		timeout (Number) connection timeout before a connect_error and connect_timeout events are emitted (20000)
    		autoConnect (Boolean) by setting this false, you have to call manager.open whenever you decide it's appropriate
    		query (Object): additional query parameters that are sent when connecting a namespace (then found in socket.handshake.query object on the server-side)
    		parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.

 *
 *
**/


/**
  io.sockets -> namespace
  io.serveClient = false: para que no sirva los static files:

	Sets the path value under which engine.io and the static files will be served. Defaults to /socket.io. If no arguments are supplied this method returns the current value.

	const io = require('socket.io')();
	io.path('/myownpath');

	// client-side
	const socket = io({
	  path: '/myownpath'
	});

server.engine.generateId

Overwrites the default method to generate your custom socket id.

The function is called with a node request object (http.IncomingMessage) as first parameter.

io.engine.generateId = (req) => {
  return "custom:id:" + custom_id++; // custom id must be unique
}



*/



const config = {

}

let numUsers = 0;

//UserConversation Listener. Emits UserConversation model when new or update
const userconvListener = notif.userConversationsListener();
const turnoListener = turnos.turnosUpdateListener();



function fetchUserConversations(socket){
	// fetches initial user conversations at login-time
	if(!(socket && socket.userId)) return;

	notif.fetchNonReadUserConversations(socket.userId).then(ucs => {
		let msj;

		if(ucs && ucs.length){
			ucs.forEach(userconv => {
				msj = notif.buildMessage(userconv)
				msj.username = socket.username;
				socket.emit('notification:message', msj)
			})
		}

	})

}

function helloworld(){
	let su = new Rx.Subject();
	su.subscribe(data => {

	})

	su.next('salud y pesetas');

	let userId = '597008d3b13931027e9fa691';
	notif.fetchNonReadUserConversations(userId).then(records => {
		//console.dir(records && reco);
	})


}

function subscribeListeners(io){
	console.log('subscribing Listeners');

	//tunos
	turnoListener.subscribe(token =>{
		console.log('turno listener... listening')
		io.emit('turnos:update')
	});

	// user conversation
	userconvListener.subscribe(userconv => {

		if(userconv.role === 'from') return;


		let ns = io.sockets; // default namespace object
		let clients = ns.connected; // hash of connectd objects
		let msj;

		for(let i in clients){
			if(clients[i].userId && (clients[i].userId === userconv.userId)) {
				//console.log('connected: [%s] [%s] role:[%s]', clients[i].userId, userconv.userId, userconv.role);
				msj = notif.buildMessage(userconv)
				msj.username = clients[i].username;
				clients[i].emit('notification:message', msj)
			}	
		}
	})

}

exports.serverFactory = function(http_server){
	console.log('serverFactory BEGINS')

	const io = new IoServer(http_server, config);

	engineSetUp(io);

	subscribeListeners(io)

	return io;
}


function engineSetUp(io){

	io.on('connection', socket => {
		let addedUser = false;

		io.emit('notification:new', {username: socket.id, content: 'on connection'});

		// console.log('======== socket information ==================')
		// console.log('headers  [%s]', socket.handshake.headers)
		// console.log('time     [%s]', socket.handshake.time)
		// console.log('address  [%s]', socket.handshake.address)
		// console.log('xdomain  [%s]', socket.handshake.xdomain)
		// console.log('secure   [%s]', socket.handshake.secure)
		// console.log('issued   [%s]', socket.handshake.issued)
		// console.log('url      [%s]', socket.handshake.url)
		// console.log('query    [%s]', socket.handshake.query)
		// console.log('======== end socket information ==================')
		// console.log('======== server (io) information ==================')
		// console.log('io.sockets [%s]', io.sockets.length)
		// console.log('path       [%s]', io.path())
		// console.log('origins    [%s]', io.origins())
		// console.log('======== end io information ==================')


		socket.on('notification:new', data => {
			data.username = socket.username;
			socket.broadcast.emit('notification:new', data);
		});

		socket.on('user:connect', user =>{
			if(!(user && user.userId) || user.username === 'invitado') return;

			socket.username = user.username;
			socket.userId = user.userId;

			if(addedUser) return;

			numUsers += 1;
			addedUser = true;
			socket.emit('login', {numUsers: numUsers});
			socket.broadcast.emit('user:joined', {numUsers: numUsers, username: user.username});

			// emit notifications
			fetchUserConversations(socket);
		
			// io.clients((error, clients) =>  {
			// 	if (error) throw error;
			// 	clients.forEach(socketid => {
			// 		console.log('clients: [%s]', socketid)
			// 		socket.to(socketid).emit('notification:new',{username: socket.id, content: 'broadcast to one client'})

			// 	})
			// });




		})

		socket.on('typing:start', () =>{
			socket.broadcast.emit('typing:start', {username: socket.username});
		})

		console.log('SOCKET REGISTRY *******')
		socket.on('turnos:update', () =>{
			console.log('socket.on..... ready to emit')
			socket.broadcast.emit('turnos:update', {event: 'update'});
		})


		socket.on('typing:stop', () =>{
			socket.broadcast.emit('typing:stop', {username: socket.username});
		})

		socket.on('goodbye', () =>{

			if(addedUser) {

				numUsers -= 1;
				socket.disconnect(false);
			}
		})

		socket.on('disconnect', (reason) =>{
			socket.broadcast.emit('user:left', {
				username: socket.username,
				numUsers: numUsers,
				content: reason
			})

		})

	});

}

