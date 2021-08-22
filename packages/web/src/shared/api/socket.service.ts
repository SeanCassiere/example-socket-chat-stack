import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";

const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	connect_error: "connect_error",
	CLIENT: {
		JOIN_ROOM: "JOIN_ROOM",
		TURN_USER_ONLINE: "TURN_USER_ONLINE",
		GET_ONLINE_USERS: "GET_ONLINE_USERS",
	},
	SERVER: {
		ALL_ONLINE_USERS: "ALL_ONLINE_USERS",
		BROADCAST_MESSAGE: "BROADCAST_MESSAGE",
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
	},
};

let socket: Socket;

export const initiateSocketConnection = (token: string) => {
	socket = io(SOCKET_URL, { auth: { token } });
	console.log("Connection to Socket.IO server");

	socket.on(EVENTS.connect_error, (err) => {
		console.log(`err instanceof Error: ${err instanceof Error}`); // true
		console.log(`err.message ${err.message}`); // not authorized
		console.log(`err.data`, err.data); // { content: "Please retry later" }
	});
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		console.log("Disconnecting socket...");
	}
};

export const socketGetAllConnectedRooms = () => {
	socket.on(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, (rooms) => {
		console.log("Rooms you are subscribed to:");
		console.log(rooms);
	});
};
