import { Server, Socket } from "socket.io";
// import { v4 } from "uuid";

import { log } from "#root/utils/logger";
import { Secret, verify } from "jsonwebtoken";
import { GeneratedTokenInterface } from "#root/interfaces/jwtTokenInterfaces";
import environmentVariables from "#root/utils/env";

const JWT_SECRET: Secret = environmentVariables.JWT_SECRET || "dev_jwt_secret";

/**
 *  imported from https://github1s.com/TomDoesTech/Realtime-Chat-Application/blob/HEAD/server/src/socket.ts#L1-L81
 * https://deepinder.me/creating-a-real-time-chat-application-with-react-hooks-socket-io-and-nodejs
 * */
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
	},
};

const users: string[] = [];

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.use((socket, next) => {
		if (socket.handshake.auth.token) {
			try {
				const decoded = verify(socket.handshake.auth.token, JWT_SECRET) as GeneratedTokenInterface;
				socket.handshake.auth.userId = decoded.userId;
				next();
			} catch (e) {
				const err = new Error("not authorized") as any;
				err.data = { content: "Please retry later" }; // additional details
				next(err);
			}
		} else {
			const err = new Error("not authorized") as any;
			err.data = { content: "Please retry later" }; // additional details
			next(err);
		}
	});

	io.on(EVENTS.connection, (socket: Socket) => {
		log.info(`User connected ${socket.id}, userId is ${socket.handshake.auth.userId}`);
		/**
		 * User disconnect cleanup
		 */
		socket.on(EVENTS.disconnection, async () => {
			log.info("user disconnected");
		});

		/**
		 * Strategy to consider
		 * @todo
		 * implement a store with user ids and the rooms ids they are subscribed to.
		 * use following:
		 *	Room: {
		 *		roomId: string,
		 *		type: "single" | "group"
		 *  }[]
		 *
		 * 	User: {
		 * 		roomIds: Room[]
		 *  }
		 * */

		/**
		 * @todo
		 * on(connection) => connect socket (user) to pre existing rooms by ids
		 * */

		/**
		 * @todo
		 * on(sendMessageToRoom) => broadcast/emit message to room by id
		 **/

		/**
		 * @todo
		 * on(createNewRoom) => create Room and join user to the room
		 */

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
