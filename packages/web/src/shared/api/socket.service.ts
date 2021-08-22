import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { setMyChatRooms } from "../redux/slices/chatRooms";
import { store } from "../redux/store";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";

const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	connect_error: "connect_error",
	CLIENT: {
		SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
		CREATE_A_ROOM: "CREATE_A_ROOM",
		CLIENT_ADD_USER_TO_ROOM: "CLIENT_ADD_USER_TO_ROOM",
		CLIENT_REMOVE_USER_FROM_ROOM: "CLIENT_REMOVE_USER_FROM_ROOM",
		CLIENT_CREATE_ROOM_WITH_GUEST: "CLIENT_CREATE_ROOM_WITH_GUEST",
	},
	SERVER: {
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
		NEW_MESSAGE_FROM_USER: "NEW_MESSAGE_FROM_USER",
		NEW_ROOM_YOU_ARE_SUBSCRIBED_TO: "NEW_ROOM_YOU_ARE_SUBSCRIBED_TO",
	},
};

let socket: Socket;

// Connect to the server
export const initiateSocketConnection = (token: string) => {
	socket = io(SOCKET_URL, { auth: { token } });
	console.log("Connection to Socket.IO server");

	socket.on(EVENTS.connect_error, (err) => {
		console.log(`err instanceof Error: ${err instanceof Error}`); // true
		console.log(`err.message ${err.message}`); // not authorized
		console.log(`err.data`, err.data); // { content: "Please retry later" }
	});
};
export type TypeInitiateSocketConnection = typeof initiateSocketConnection;

// Disconnect from the server
export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		console.log("Disconnecting socket...");
	}
};
export type TypeDisconnectSocket = typeof disconnectSocket;

// Get the rooms I am connected to
export const socketGetAllConnectedRooms = () => {
	socket.on(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, (rooms) => {
		// console.log("Rooms you are subscribed to:");
		// console.log(rooms);
		store.dispatch(setMyChatRooms(rooms));
	});
};
export type TypeSocketGetAllConnectedRooms = typeof socketGetAllConnectedRooms;

// Send a message
export const socketSendMessageToRoom = (roomId: string, message: string) => {
	socket.emit(EVENTS.CLIENT.SEND_MESSAGE_TO_ROOM, { roomId, message });
};
export type TypeSocketSendMessageToRoom = typeof socketSendMessageToRoom;

// Listen for messages directed to me or my rooms
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
		// console.log(messageObject);
	});
};
export type TypeSocketListenToRoomMessages = typeof socketListenToRoomMessages;

// Add user to a room
export const socketAddUserToRoom = (roomId: string, userId: string) => {
	socket.emit(EVENTS.CLIENT.CLIENT_ADD_USER_TO_ROOM, { roomId, userId });
};
export type TypeSocketAddUserToRoom = typeof socketAddUserToRoom;

// Create a new room and join me into the room
export const socketCreateNewRoom = (name: string, type: "single" | "group") => {
	socket.emit(EVENTS.CLIENT.CREATE_A_ROOM, { name, type });
};
export type TypeSocketCreateNewRoom = typeof socketCreateNewRoom;

// Remove user (authUser or guest) from a room
export const socketRemoveUserFromRoom = (roomId: string, userId: string) => {
	socket.emit(EVENTS.CLIENT.CLIENT_REMOVE_USER_FROM_ROOM, { roomId, userId });
};
export type TypeSocketRemoveUserFromRoom = typeof socketRemoveUserFromRoom;

export const socketCreateNewRoomWithGuests = (name: string, type: "single" | "group", users: string[]) => {
	socket.emit(EVENTS.CLIENT.CLIENT_CREATE_ROOM_WITH_GUEST, { name, type, guestIds: users });
};
export type TypeSocketCreateNewRoomWithGuests = typeof socketCreateNewRoomWithGuests;
