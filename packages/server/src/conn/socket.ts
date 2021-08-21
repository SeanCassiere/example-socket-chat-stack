import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

import { log } from "#root/utils/logger";

// imported from https://github1s.com/TomDoesTech/Realtime-Chat-Application/blob/HEAD/server/src/socket.ts#L1-L81
const EVENTS = {
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

const rooms: { id: string; name: string }[] = [];

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.on(EVENTS.connection, (socket: Socket) => {
		log.info(`User connected ${socket.id}`);

		socket.emit(EVENTS.SERVER.ROOMS, rooms);

		/*
		 * When a user creates a new room
		 */
		socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
			console.log({ roomName });
			// create a roomId
			const roomId = v4();
			// add a new room to the rooms object
			rooms.push({ id: roomId, name: roomName });

			socket.join(roomId);

			// broadcast an event saying there is a new room
			socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

			// emit back to the room creator with all the rooms
			socket.emit(EVENTS.SERVER.ROOMS, rooms);
			// emit event back the room creator saying they have joined a room
			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
			log.info(`server joined: ${socket.id} has into room ${roomId}`);
		});

		/*
		 * When a user sends a room message
		 */

		socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {
			const date = new Date();

			socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
				message,
				username,
				time: `${date.getHours()}:${date.getMinutes()}`,
			});
		});

		/*
		 * When a user joins a room
		 */
		socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
			socket.join(roomId);

			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
			log.info(`${socket.id} has joined room ${roomId}`);
		});
	});
}

export default socket;
