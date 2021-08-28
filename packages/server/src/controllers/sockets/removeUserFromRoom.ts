import { Server, Socket } from "socket.io";

import {
	activeUsers,
	EVENTS,
	getOnlineUserSocketsList,
	getUserConnections,
	globalRooms,
	globalUserRoomConnections,
	isRoomAccessibleToUser,
	setGlobalUserConnections,
} from "#root/utils/in-mem/db";

/**
 * @done
 * on (client-> remove user from room) remove connection and emit the room list back to the user
 */
export const removeUserFromRoom = (socket: Socket, io: Server, args: any) => {
	const { roomId, userId } = args;

	if (isRoomAccessibleToUser(globalUserRoomConnections, roomId, socket.handshake.auth.userId)) {
		const findConnection = globalUserRoomConnections.filter((conn) => conn.roomId === roomId && conn.userId === userId);
		const newConnList = globalUserRoomConnections.filter((conn) => conn !== findConnection[0]);
		setGlobalUserConnections(newConnList);
		// console.log("Connections at removal", globalUserRoomConnections);

		// Find and broadcast this new connection to the user by updating their rooms
		const socketsForUser = getOnlineUserSocketsList(activeUsers, userId);
		const { returnRoomsListToUser } = getUserConnections(globalRooms, globalUserRoomConnections, userId);
		io.to(socketsForUser).socketsLeave(roomId);
		io.to(socketsForUser).emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
	}
};
