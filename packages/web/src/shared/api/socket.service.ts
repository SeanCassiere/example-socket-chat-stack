import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";

const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	CLIENT: {
		JOIN_ROOM: "JOIN_ROOM",
		TURN_USER_ONLINE: "TURN_USER_ONLINE",
		GET_ONLINE_USERS: "GET_ONLINE_USERS",
	},
	SERVER: {
		ALL_ONLINE_USERS: "ALL_ONLINE_USERS",
		BROADCAST_MESSAGE: "BROADCAST_MESSAGE",
	},
};

let socket: Socket;

export const initiateSocketConnection = () => {
	socket = io(SOCKET_URL);
	console.log("Connection to Socket.IO server");
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		console.log("Disconnecting socket...");
	}
};

export const socketGetAllOnlineUsers = () => {
	socket.emit(EVENTS.CLIENT.GET_ONLINE_USERS);

	socket.on(EVENTS.SERVER.ALL_ONLINE_USERS, (users) => {
		console.log(users);
	});
};

export const socketPostShowCurrentUserOnline = (id: string) => {
	socket.emit(EVENTS.CLIENT.TURN_USER_ONLINE, id);
};

export const joinRoom = () => {
	socket.emit(EVENTS.CLIENT.JOIN_ROOM, "1");

	socket.on(EVENTS.SERVER.BROADCAST_MESSAGE, (msg) => {
		console.log(msg);
	});
};
