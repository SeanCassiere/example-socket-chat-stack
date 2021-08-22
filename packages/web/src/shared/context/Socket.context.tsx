import { FC, createContext, useContext } from "react";

import {
	disconnectSocket,
	initiateSocketConnection,
	socketAddUserToRoom,
	socketCreateNewRoom,
	socketCreateNewRoomWithGuests,
	socketGetAllConnectedRooms,
	socketListenToRoomMessages,
	socketRemoveUserFromRoom,
	socketSendMessageToRoom,
	TypeSocketCreateNewRoomWithGuests,
} from "#root/shared/api/socket.service";
import type {
	TypeInitiateSocketConnection,
	TypeDisconnectSocket,
	TypeSocketGetAllConnectedRooms,
	TypeSocketSendMessageToRoom,
	TypeSocketListenToRoomMessages,
	TypeSocketAddUserToRoom,
	TypeSocketCreateNewRoom,
	TypeSocketRemoveUserFromRoom,
} from "#root/shared/api/socket.service";

interface ISocketContext {
	connectSocket: TypeInitiateSocketConnection;
	disconnectSocket: TypeDisconnectSocket;
	getMyRooms: TypeSocketGetAllConnectedRooms;
	listenForMessages: TypeSocketListenToRoomMessages;
	sendMessage: TypeSocketSendMessageToRoom;
	addUser: TypeSocketAddUserToRoom;
	createRoom: TypeSocketCreateNewRoom;
	removeUser: TypeSocketRemoveUserFromRoom;
	createRoomWithGuests: TypeSocketCreateNewRoomWithGuests;
}

const initialValues: ISocketContext = {
	connectSocket: initiateSocketConnection,
	disconnectSocket: disconnectSocket,
	getMyRooms: socketGetAllConnectedRooms,
	listenForMessages: socketListenToRoomMessages,
	sendMessage: socketSendMessageToRoom,
	addUser: socketAddUserToRoom,
	removeUser: socketRemoveUserFromRoom,
	createRoom: socketCreateNewRoom,
	createRoomWithGuests: socketCreateNewRoomWithGuests,
};

const SocketContext = createContext<ISocketContext>({
	...initialValues,
});

export const SocketProvider: FC = ({ children }) => {
	return (
		<SocketContext.Provider
			value={{
				...initialValues,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
