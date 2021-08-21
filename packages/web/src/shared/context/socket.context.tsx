import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_HOST_URL || "http://localhost:4000";
export const EVENTS = {
	connection: "connection",
	CLIENT: {
		CREATE_ROOM: "CREATE_ROOM",
		SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
		JOIN_ROOM: "JOIN_ROOM",
	},
	SERVER: {
		ROOMS: "ROOMS",
		JOINED_ROOM: "JOINED_ROOM",
		ROOM_MESSAGE: "ROOM_MESSAGE",
	},
};

interface Context {
	socket: Socket;
	username?: string;
	setUsername: Function;
	messages?: { message: string; time: string; username: string }[];
	setMessages: Function;
	roomId?: string;
	rooms: { id: string; name: string }[];
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
	socket,
	setUsername: () => false,
	setMessages: () => false,
	rooms: [],
	messages: [],
});

function SocketsProvider(props: any) {
	const [username, setUsername] = useState("");
	const [roomId, setRoomId] = useState("");
	const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
	const [messages, setMessages] = useState<{ message: string; username: string; time: string }[]>([]);

	useEffect(() => {
		window.onfocus = function () {
			document.title = "Chat app";
		};
	}, []);

	socket.on(EVENTS.SERVER.ROOMS, (value) => {
		setRooms(value);
	});

	socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
		setRoomId(value);

		setMessages([]);
	});

	useEffect(() => {
		socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
			if (!document.hasFocus()) {
				document.title = "New message...";
			}

			setMessages((messages) => [...messages, { message, username, time }]);
		});
		//
	}, [socket]); // eslint-disable-line

	return (
		<SocketContext.Provider
			value={{
				socket,
				username,
				setUsername,
				rooms,
				roomId,
				messages,
				setMessages,
			}}
			{...props}
		/>
	);
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
