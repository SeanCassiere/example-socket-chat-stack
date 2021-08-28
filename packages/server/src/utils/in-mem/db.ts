import { log } from "#root/utils/logger";

export const EVENTS = {
	connection: "connection",
	disconnection: "disconnect",
	connect_error: "connect_error",
	CLIENT: {
		SEND_MESSAGE_TO_ROOM: "SEND_MESSAGE_TO_ROOM",
		CREATE_A_ROOM: "CREATE_A_ROOM",
		CLIENT_ADD_USER_TO_ROOM: "CLIENT_ADD_USER_TO_ROOM",
		CLIENT_REMOVE_USER_FROM_ROOM: "CLIENT_REMOVE_USER_FROM_ROOM",
		CLIENT_CREATE_ROOM_WITH_GUEST: "CLIENT_CREATE_ROOM_WITH_GUEST",
	},
	SERVER: {
		ROOMS_YOU_ARE_SUBSCRIBED_TO: "ROOMS_YOU_ARE_SUBSCRIBED_TO",
		NEW_MESSAGE_FROM_USER: "NEW_MESSAGE_FROM_USER",
	},
};

export interface Room {
	roomId: string;
	type: "single" | "group";
	name: string;
}
export let globalRooms: Room[] = [
	{ roomId: "qu02F3RW2", type: "single", name: "single chat with bob1 and bob2" },
	{ roomId: "RD05TU9Lc", type: "group", name: "group chat with bob1, bob2 and bob3" },
];

export interface UserRoomConnection {
	connectionId: string;
	roomId: string;
	userId: string;
}
export let globalUserRoomConnections: UserRoomConnection[] = [
	{ connectionId: "Ob3CfnLHs", roomId: "qu02F3RW2", userId: "dc2500f5-f8a4-4924-a38c-9a9b1fe10d63" },
	{ connectionId: "irqRP_2Ts", roomId: "qu02F3RW2", userId: "84104d83-087c-47e4-bc2f-a45185fbce7a" },
	{ connectionId: "Je-0XXsH2", roomId: "RD05TU9Lc", userId: "dc2500f5-f8a4-4924-a38c-9a9b1fe10d63" },
	{ connectionId: "dDl6C6KYim9dQ", roomId: "RD05TU9Lc", userId: "84104d83-087c-47e4-bc2f-a45185fbce7a" },
	{ connectionId: "HpziR7gZzdFQ", roomId: "RD05TU9Lc", userId: "6e19c360-49ff-4030-99aa-0b148ad35c00" },
];

export let activeUsers: Record<string, string[]> = {};
export type OnlineUsers = typeof activeUsers;
export function addUserOnline(socketId: string, userId: string) {
	// If user not exist, add an empty key
	if (!activeUsers[userId]) {
		activeUsers = {
			...activeUsers,
			[userId]: [],
		};
	}

	// add this socket to the user
	activeUsers[userId].push(socketId);
}

function removeItemAll(arr: string[], value: string) {
	let i: number = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}

export function removeUserOnline(socketId: string, userId: string) {
	const availableUserSockets = activeUsers[userId];
	const newSocketList = removeItemAll(availableUserSockets, socketId);
	activeUsers = {
		...activeUsers,
		[userId]: newSocketList,
	};
}

export function getOnlineUserSocketsList(users: OnlineUsers, userId: string) {
	if (users[userId]) return users[userId];
	return [];
}

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

export function getUserConnections(allRooms: Room[], allConnections: UserRoomConnection[], userId: string) {
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

export function isRoomAccessibleToUser(allConnections: UserRoomConnection[], roomId: string, userId: string) {
	const availableConns = allConnections.filter((conn) => conn.roomId === roomId && conn.userId === userId);
	if (availableConns && availableConns.length > 0) return true;
	log.warn(`User ${userId} tried to access roomId ${roomId} in an unauthorized state`);
	return false;
}

export function isUserAlreadyInRoom(allConnections: UserRoomConnection[], roomId: string, userId: string) {
	const res = allConnections.find((c) => c.roomId === roomId && c.userId === userId);
	if (res) return true;
	return false;
}

export function setGlobalUserConnections(connections: UserRoomConnection[]) {
	globalUserRoomConnections = connections;
}
