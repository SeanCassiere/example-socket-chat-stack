import { Socket } from "socket.io";
import { v4 } from "uuid";

import {
	activeUsers,
	EVENTS,
	getOnlineUserSocketsList,
	getUserConnections,
	globalRooms,
	globalUserRoomConnections,
	isRoomAccessibleToUser,
	isUserAlreadyInRoom,
	UserRoomConnection,
} from "#root/utils/in-mem/db";

/**
 * @done
 * on (client-> add new user to room) create connection Object and emit to new user the room
 */
export const addUserToRoom = (socket: Socket, args: any) => {
	const { roomId, userId } = args;

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
};
