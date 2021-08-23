import { Socket } from "socket.io";

import { EVENTS, getUserConnections, globalRooms, globalUserRoomConnections } from "#root/utils/in-mem/db";

/**
 * @done
 * on(connection) => finding + joining user to existing rooms + emitting user's rooms back to user
 * */
export const sendRoomsBackToLoginClient = (socket: Socket) => {
	const { returnRoomsListToUser, serverJoinUserToTheseRoomIds } = getUserConnections(
		globalRooms,
		globalUserRoomConnections,
		socket.handshake.auth.userId
	);
	socket.join(serverJoinUserToTheseRoomIds);
	socket.emit(EVENTS.SERVER.ROOMS_YOU_ARE_SUBSCRIBED_TO, returnRoomsListToUser);
};
