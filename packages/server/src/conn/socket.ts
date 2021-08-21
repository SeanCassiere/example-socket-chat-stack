import { Server, Socket } from "socket.io";
// import { v4 } from "uuid";

import { log } from "#root/utils/logger";

/**
 *  imported from https://github1s.com/TomDoesTech/Realtime-Chat-Application/blob/HEAD/server/src/socket.ts#L1-L81
 * https://deepinder.me/creating-a-real-time-chat-application-with-react-hooks-socket-io-and-nodejs
 * */
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

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.on(EVENTS.connection, (socket: Socket) => {
		log.info(`User connected ${socket.id}`);

		/**
		 * User disconnect cleanup
		 */
		socket.on(EVENTS.disconnection, () => {
			log.info("user disconnected");
		});

		/**
		 * User joins a room
		 */
		socket.on(EVENTS.CLIENT.JOIN_ROOM, (i) => {
			log.info(`User joined the room: ${i}`);
			io.emit(EVENTS.SERVER.BROADCAST_MESSAGE, `Server message from room: ${i}`);
		});
	});
}

export default socket;
