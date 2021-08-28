import { Socket } from "socket.io";
import { v4 } from "uuid";

import {
	activeUsers,
	EVENTS,
	getOnlineUserSocketsList,
	getUserConnections,
	globalRooms,
	globalUserRoomConnections,
	Room,
	UserRoomConnection,
} from "#root/utils/in-mem/db";

/**
 * @done
 * on(createNewRoom) => create Room and join user to the room
 */
export const createRoomWithOnlyClient = (socket: Socket, args: any) => {
	const { name, type } = args;

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
};
