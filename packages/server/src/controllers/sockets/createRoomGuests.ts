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
 * on(client -> createRoom with a guest Ids) => create Room and join users (authUser + guests[])
 */
export const createRoomWithGuests = (socket: Socket, args: any) => {
	const { name, type, guestIds } = args;

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
};
