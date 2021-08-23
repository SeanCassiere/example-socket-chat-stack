import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

import { log } from "#root/utils/logger";
import { socketTokenAuth } from "#root/middleware/authMiddleware";

import {
	activeUsers,
	addUserOnline,
	EVENTS,
	getOnlineUserSocketsList,
	getUserConnections,
	globalRooms,
	globalUserRoomConnections,
	isRoomAccessibleToUser,
	isUserAlreadyInRoom,
	removeUserOnline,
	Room,
	setGlobalUserConnections,
	UserRoomConnection,
} from "#root/utils/in-mem/db";
/**
 *  imported from https://github1s.com/TomDoesTech/Realtime-Chat-Application/blob/HEAD/server/src/socket.ts#L1-L81
 * https://deepinder.me/creating-a-real-time-chat-application-with-react-hooks-socket-io-and-nodejs
 * */

function socket({ io }: { io: Server }) {
	log.info(`Sockets enabled`);

	io.use(socketTokenAuth);

	io.on(EVENTS.connection, (socket: Socket) => {
		log.info(`User connected ${socket.id}, userId is ${socket.handshake.auth.userId}`);
		addUserOnline(socket.id, socket.handshake.auth.userId);
		// log.warn(activeUsers); //Showing active users

		socket.on(EVENTS.disconnection, async () => {
			//User disconnect cleanup
			removeUserOnline(socket.id, socket.handshake.auth.userId);
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
			// Filter and see if this user has a connection to this room
			if (isRoomAccessibleToUser(globalUserRoomConnections, roomId, socket.handshake.auth.userId)) {
				const messageObject = { id: v4(), roomId, message };
				socket.to(roomId).emit(EVENTS.SERVER.NEW_MESSAGE_FROM_USER, messageObject);
			}
		});

		/**
		 * @done
		 * on(createNewRoom) => create Room and join user to the room
		 */
		socket.on(EVENTS.CLIENT.CREATE_A_ROOM, ({ name, type }) => {
			const socketsForUser = getOnlineUserSocketsList(activeUsers, socket.handshake.auth.userId);

			const newRoom: Room = { roomId: v4(), type, name };
			globalRooms.push(newRoom); //Push to global rooms

			const newConnection: UserRoomConnection = {
				connectionId: v4(),
				roomId: newRoom.roomId,
				userId: socket.handshake.auth.userId,
			};
			globalUserRoomConnections.push(newConnection); // Push to global conns
			socketsForUser.forEach((soc) => socket.to(soc).socketsJoin(newRoom.roomId));
			socket.join(newRoom.roomId);

			const { returnRoomsListToUser } = getUserConnections(
				globalRooms,
				globalUserRoomConnections,
				socket.handshake.auth.userId
			);
			// Return to user all their rooms

			socketsForUser.forEach((soc) => {
				socket.to(soc).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
			});
			socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
		});

		/**
		 * @done
		 * on(client -> createRoom with a guest Ids) => create Room and join users (authUser + guests[])
		 */
		socket.on(EVENTS.CLIENT.CLIENT_CREATE_ROOM_WITH_GUEST, ({ name, type, guestIds }) => {
			let guestSockets: string[][] = [];
			const socketsForAuthUser = getOnlineUserSocketsList(activeUsers, socket.handshake.auth.userId);
			guestIds.forEach((guest: string) => guestSockets.push(getOnlineUserSocketsList(activeUsers, guest)));

			const newRoom: Room = { roomId: v4(), type, name };
			globalRooms.push(newRoom); //Push to global rooms

			const newConnection: UserRoomConnection = {
				connectionId: v4(),
				roomId: newRoom.roomId,
				userId: socket.handshake.auth.userId,
			};
			globalUserRoomConnections.push(newConnection); // Push to global conns

			// Push all the guest connections to global conns
			guestIds.forEach((guestId: string) => {
				const guestConnection: UserRoomConnection = {
					connectionId: v4(),
					roomId: newRoom.roomId,
					userId: guestId,
				};
				globalUserRoomConnections.push(guestConnection);
			});

			socketsForAuthUser.forEach((soc) => socket.to(soc).socketsJoin(newRoom.roomId));
			socket.join(newRoom.roomId);
			// Join all the guest sockets to this new room
			guestSockets.forEach((group) => {
				group.forEach((sockId) => {
					socket.to(sockId).socketsJoin(newRoom.roomId);
					const { returnRoomsListToUser } = getUserConnections(globalRooms, globalUserRoomConnections, sockId);
					socket.to(sockId).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser); // return new rooms list
				});
			});

			const { returnRoomsListToUser } = getUserConnections(
				globalRooms,
				globalUserRoomConnections,
				socket.handshake.auth.userId
			);
			// Return to user all their rooms
			socketsForAuthUser.forEach((soc) => {
				socket.to(soc).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
			});
			// Returns guests their rooms
			guestIds.forEach((guest: string) => {
				const socketsForTheGuest = getOnlineUserSocketsList(activeUsers, guest);
				const { returnRoomsListToUser } = getUserConnections(globalRooms, globalUserRoomConnections, guest);
				socketsForTheGuest.forEach((soc: string) => {
					socket.to(soc).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser); // return new rooms list
				});
			});
			socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
		});

		/**
		 * @done
		 * on (client-> add new user to room) create connection Object and emit to new user the room
		 */
		socket.on(EVENTS.CLIENT.CLIENT_ADD_USER_TO_ROOM, ({ roomId, userId }) => {
			/**
			 * If this room is accessible by this user
			 * If this user is not already connected to this rooms
			 */
			if (
				isRoomAccessibleToUser(globalUserRoomConnections, roomId, socket.handshake.auth.userId) &&
				!isUserAlreadyInRoom(globalUserRoomConnections, roomId, userId)
			) {
				// Create the new connection
				const newConnection: UserRoomConnection = { connectionId: v4(), roomId, userId };
				globalUserRoomConnections.push(newConnection);

				// Find and broadcast this new connection to the user by updating their rooms
				const socketsForUser = getOnlineUserSocketsList(activeUsers, userId);
				const { returnRoomsListToUser } = getUserConnections(globalRooms, globalUserRoomConnections, userId);
				socketsForUser.forEach((soc) => {
					socket.in(soc).socketsJoin(roomId);
					socket.in(soc).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
				});
			}
		});

		/**
		 * @done
		 * on (client-> remove user from room) remove connection and emit the room list back to the user
		 */
		socket.on(EVENTS.CLIENT.CLIENT_REMOVE_USER_FROM_ROOM, ({ roomId, userId }) => {
			if (isRoomAccessibleToUser(globalUserRoomConnections, roomId, socket.handshake.auth.userId)) {
				const findConnection = globalUserRoomConnections.filter(
					(conn) => conn.roomId === roomId && conn.userId === userId
				);
				const newConnList = globalUserRoomConnections.filter((conn) => conn !== findConnection[0]);
				setGlobalUserConnections(newConnList);
				// console.log("Connections at removal", globalUserRoomConnections);

				// Find and broadcast this new connection to the user by updating their rooms
				const socketsForUser = getOnlineUserSocketsList(activeUsers, userId);
				const { returnRoomsListToUser } = getUserConnections(globalRooms, globalUserRoomConnections, userId);
				io.to(socketsForUser).socketsLeave(roomId);
				io.to(socketsForUser).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
			}
		});
	});
}

export default socket;
