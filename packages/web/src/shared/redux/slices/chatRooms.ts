import { UserForApplication } from "#root/shared/interfaces/user/authUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Room {
	roomId: string;
	type: "single" | "group";
	name: string;
}

interface AllProcesses {
	myRooms: Room[];
	allUsers: UserForApplication[];
}

let roomsInitialState: AllProcesses;

roomsInitialState = {
	myRooms: [],
	allUsers: [],
};

export const chatRoomsSlice = createSlice({
	name: "chatRooms",
	initialState: roomsInitialState,
	reducers: {
		setMyChatRooms: (state, action: PayloadAction<Room[]>) => {
			state.myRooms = action.payload;
		},
		setAllUsersForChat: (state, action: PayloadAction<UserForApplication[]>) => {
			state.allUsers = action.payload;
		},
	},
});

export const { setMyChatRooms, setAllUsersForChat } = chatRoomsSlice.actions;

export const chatRoomsReducer = chatRoomsSlice.reducer;
