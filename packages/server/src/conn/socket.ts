import { Server, Socket } from "socket.io";
// import { v4 } from "uuid";

import { log } from "#root/utils/logger";
import { socketTokenAuth } from "#root/middleware/authMiddleware";

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
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
	},
};

interface Room {
	roomId: string;
	type: "single" | "group";
	name: string;
}
const globalRooms: Room[] = [
	{ roomId: "qu02F3RW2", type: "single", name: "chat with bob1-bob2" },
	{ roomId: "RD05TU9Lc", type: "group", name: "chat with group1" },
];

interface UserRoomConnection {
	connectionId: string;
	roomId: string;
	userId: string;
}
const globalUserRoomConnections: UserRoomConnection[] = [
	{ connectionId: "Ob3CfnLHs", roomId: "qu02F3RW2", userId: "dc2500f5-f8a4-4924-a38c-9a9b1fe10d63" },
	{ connectionId: "irqRP_2Ts", roomId: "qu02F3RW2", userId: "84104d83-087c-47e4-bc2f-a45185fbce7a" },
	{ connectionId: "Je-0XXsH2", roomId: "RD05TU9Lc", userId: "dc2500f5-f8a4-4924-a38c-9a9b1fe10d63" },
];

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.use(socketTokenAuth);

	io.on(EVENTS.connection, (socket: Socket) => {
		let userConns: UserRoomConnection[] | undefined;
		userConns = undefined;

		let userRoomsToJoin: string[] | undefined;
		userRoomsToJoin = undefined;

		let roomsToSendUser: Room[];
		roomsToSendUser = [];

		log.info(`User connected ${socket.id}, userId is ${socket.handshake.auth.userId}`);
		/**
		 * User disconnect cleanup
		 */
		socket.on(EVENTS.disconnection, async () => {
			log.info(`User ${socket.handshake.auth.userId} has disconnected`);
		});

		/**
		 * @done
		 * on(connection) => finding + joining user to existing rooms + emitting user's rooms back to user
		 * */
		userConns = globalUserRoomConnections.filter((conn) => conn.userId === socket.handshake.auth.userId);
		userRoomsToJoin = userConns.map((conn) => conn.roomId);

		userConns.forEach((conn) => {
			const room = globalRooms.find((r: Room) => r.roomId === conn.roomId);
			if (room) roomsToSendUser.push(room);
		});
		socket.join(userRoomsToJoin);
		socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, roomsToSendUser);

		/**
		 * @todo
		 * on(client-sendMessageToRoom) => broadcast/emit message to room by id
		 **/

		/**
		 * @todo
		 * on(createNewRoom) => create Room and join user to the room
		 */
	});
}

export default socket;
