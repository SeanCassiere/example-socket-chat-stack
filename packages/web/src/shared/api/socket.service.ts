import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";

const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	connect_error: "connect_error",
	CLIENT: {
		SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
		CREATE_A_ROOM: "CREATE_A_ROOM",
	},
	SERVER: {
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
		NEW_MESSAGE_FROM_USER: "NEW_MESSAGE_FROM_USER",
		NEW_ROOM_YOU_ARE_SUBSCRIBED_TO: "NEW_ROOM_YOU_ARE_SUBSCRIBED_TO",
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

export const socketSendMessageToRoom = (roomId: string, message: string) => {
	socket.emit(EVENTS.CLIENT.SEND_MESSAGE_TO_ROOM, { roomId, message });
};

export const socketListenToRoomMessages = () => {
	socket.on(EVENTS.SERVER.NEW_MESSAGE_FROM_USER, (messageObject) => {
		toast(messageObject.message, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		console.log(messageObject);
	});
};

export const socketCreateNewRoom = ({ name, type }: { name: string; type: "single" | "group" }) => {
	socket.emit(EVENTS.CLIENT.CREATE_A_ROOM, { name, type });
};
