import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";

const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	CLIENT: {
		CREATE_ROOM: "CREATE_ROOM",
		SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
		JOIN_ROOM: "JOIN_ROOM",
	},
	SERVER: {
		ROOMS: "ROOMS",
		JOINED_ROOM: "JOINED_ROOM",
		ROOM_MESSAGE: "ROOM_MESSAGE",
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

export const joinRoom = () => {
	socket.emit(EVENTS.CLIENT.JOIN_ROOM, "1");

	socket.on(EVENTS.SERVER.BROADCAST_MESSAGE, (msg) => {
		console.log(msg);
	});
};
