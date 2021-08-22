import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

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
		SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
		CREATE_A_ROOM: "CREATE_A_ROOM",
	},
	SERVER: {
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
		NEW_MESSAGE_FROM_USER: "NEW_MESSAGE_FROM_USER",
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
	{ connectionId: "dDl6C6KYim9dQ", roomId: "RD05TU9Lc", userId: "84104d83-087c-47e4-bc2f-a45185fbce7a" },
	{ connectionId: "HpziR7gZzdFQ", roomId: "RD05TU9Lc", userId: "6e19c360-49ff-4030-99aa-0b148ad35c00" },
];
/**
 * Single chat with each other:
 * 	bob1 -> bob2
 *
 * Group Chat with each other
 * bob1 -> bob2 -> bob3
 *
 * bob1 -> dc2500f5-f8a4-4924-a38c-9a9b1fe10d63
 * bob2 -> 84104d83-087c-47e4-bc2f-a45185fbce7a
 * bob3 -> 6e19c360-49ff-4030-99aa-0b148ad35c00
 */

function getUserConnections(allRooms: Room[], allConnections: UserRoomConnection[], userId: string) {
	// The of rooms the user should join upon connection
	let serverJoinUserToTheseRoomIds: string[];
	serverJoinUserToTheseRoomIds = [];

	// The list of available rooms we send back to the user
	let returnRoomsListToUser: Room[];
	returnRoomsListToUser = [];

	/**
	 * Sorting the rooms available to the user by searching by their connections
	 * This is similar to a joined foreign key I guess, till we do the DB implementation with TypeORM
	 *  */
	const usersConns = allConnections.filter((conn) => conn.userId === userId);
	usersConns.forEach((conn) => {
		const roomMatchesUserId = allRooms.find((r: Room) => r.roomId === conn.roomId);
		if (roomMatchesUserId) returnRoomsListToUser.push(roomMatchesUserId);
	});

	/**
	 * Extracting the room ids from the connections
	 */
	serverJoinUserToTheseRoomIds = usersConns.map((conn) => conn.roomId);

	return { returnRoomsListToUser, serverJoinUserToTheseRoomIds };
}

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.use(socketTokenAuth);

	io.on(EVENTS.connection, (socket: Socket) => {
		log.info(`User connected ${socket.id}, userId is ${socket.handshake.auth.userId}`);

		socket.on(EVENTS.disconnection, async () => {
			//User disconnect cleanup
			log.info(`User ${socket.handshake.auth.userId} has disconnected`);
		});

		/**
		 * @done
		 * on(connection) => finding + joining user to existing rooms + emitting user's rooms back to user
		 * */
		const { returnRoomsListToUser, serverJoinUserToTheseRoomIds } = getUserConnections(
			globalRooms,
			globalUserRoomConnections,
			socket.handshake.auth.userId
		);
		socket.join(serverJoinUserToTheseRoomIds);
		socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);

		/**
		 * @done
		 * on(client-sendMessageToRoom) => broadcast/emit message to room by id
		 **/
		socket.on(EVENTS.CLIENT.SEND_MESSAGE_TO_ROOM, ({ roomId, message }) => {
			const messageObject = { id: v4(), roomId, message };
			socket.to(roomId).emit(EVENTS.SERVER.NEW_MESSAGE_FROM_USER, messageObject);
		});

		/**
		 * @done
		 * on(createNewRoom) => create Room and join user to the room
		 */
		socket.on(EVENTS.CLIENT.CREATE_A_ROOM, ({ name, type }) => {
			const newRoom: Room = { roomId: v4(), type, name };
			globalRooms.push(newRoom); //Push to global rooms

			const newConnection: UserRoomConnection = {
				connectionId: v4(),
				roomId: newRoom.roomId,
				userId: socket.handshake.auth.userId,
			};
			globalUserRoomConnections.push(newConnection); // Push to global conns
			log.warn(`New room created`);
			log.warn(newRoom);
			socket.join(newRoom.roomId);

			const { returnRoomsListToUser } = getUserConnections(
				globalRooms,
				globalUserRoomConnections,
				socket.handshake.auth.userId
			);
			// Return to use all their rooms
			socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
		});

		/**
		 * @todo
		 * on(client->entersRoom) => load previous messages
		 */

		/**
		 * @todo
		 * on (client-> add new user to room) create connection Object and emit to new user the room
		 */
	});
}

export default socket;
