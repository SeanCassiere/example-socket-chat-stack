import { Socket } from "socket.io";
import { v4 } from "uuid";

import { EVENTS, globalUserRoomConnections, isRoomAccessibleToUser } from "#root/utils/in-mem/db";

/**
 * @done
 * on(client-sendMessageToRoom) => broadcast/emit message to room by id
 **/
export const clientSendsMessage = (socket: Socket, args: any) => {
	const { roomId, message } = args;
	if (isRoomAccessibleToUser(globalUserRoomConnections, roomId, socket.handshake.auth.userId)) {
		const messageObject = { id: v4(), roomId, message };
		socket.to(roomId).emit(EVENTS.SERVER.NEW_MESSAGE_FROM_USER, messageObject);
	}
};
