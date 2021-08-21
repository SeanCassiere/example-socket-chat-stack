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
		JOIN_ROOM: "JOIN_ROOM",
		TURN_USER_ONLINE: "TURN_USER_ONLINE",
		GET_ONLINE_USERS: "GET_ONLINE_USERS",
	},
	SERVER: {
		ALL_ONLINE_USERS: "ALL_ONLINE_USERS",
		BROADCAST_MESSAGE: "BROADCAST_MESSAGE",
	},
};

const users: string[] = [];

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
		 * Get the online users
		 */
		socket.on(EVENTS.CLIENT.GET_ONLINE_USERS, () => {
			log.info(`Getting online users for ${socket.id}`);
			io.to(socket.id).emit(EVENTS.SERVER.ALL_ONLINE_USERS, users);
		});

		/**
		 * Make user online
		 */
		socket.on(EVENTS.CLIENT.TURN_USER_ONLINE, (id) => {
			log.info(`Turning user ${id} online for ${socket.id}`);
			users.push(id);
			io.emit(EVENTS.SERVER.ALL_ONLINE_USERS, users);
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
