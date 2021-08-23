import { Server, Socket } from "socket.io";

import { log } from "#root/utils/logger";
import { socketTokenAuth } from "#root/middleware/authMiddleware";

import { addUserOnline, EVENTS, removeUserOnline } from "#root/utils/in-mem/db";
import { createRoomWithOnlyClient } from "#root/controllers/sockets/createRoomWithOnlyClient";
import { sendRoomsBackToLoginClient } from "#root/controllers/sockets/sendRoomsBackToLoginClient";
import { clientSendsMessage } from "#root/controllers/sockets/clientSendsMessage";
import { createRoomWithGuests } from "#root/controllers/sockets/createRoomGuests";
import { addUserToRoom } from "#root/controllers/sockets/addUserToRoom";
import { removeUserFromRoom } from "#root/controllers/sockets/removeUserFromRoom";
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

		/**
		 * On disconnection, remove the client from the active users list { [user]: sockets[]}
		 */
		socket.on(EVENTS.disconnection, async () => {
			removeUserOnline(socket.id, socket.handshake.auth.userId);
			log.info(`User ${socket.handshake.auth.userId} has disconnected`);
		});

		/**
		 * On connection, send the rooms back to the client
		 */
		sendRoomsBackToLoginClient(socket);

		socket.on(EVENTS.CLIENT.SEND_MESSAGE_TO_ROOM, (args) => clientSendsMessage(socket, args));

		socket.on(EVENTS.CLIENT.CREATE_A_ROOM, (args) => createRoomWithOnlyClient(socket, args));

		socket.on(EVENTS.CLIENT.CLIENT_CREATE_ROOM_WITH_GUEST, (args) => createRoomWithGuests(socket, args));

		socket.on(EVENTS.CLIENT.CLIENT_ADD_USER_TO_ROOM, (args) => addUserToRoom(socket, args));

		socket.on(EVENTS.CLIENT.CLIENT_REMOVE_USER_FROM_ROOM, (args) => removeUserFromRoom(socket, io, args));
	});
}

export default socket;
