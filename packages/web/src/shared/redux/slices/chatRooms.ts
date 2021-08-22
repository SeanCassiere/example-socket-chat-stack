import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Room {
	roomId: string;
	type: "single" | "group";
	name: string;
}

interface AllProcesses {
	myRooms: Room[];
}

let roomsInitialState: AllProcesses;

roomsInitialState = {
	myRooms: [],
};

export const chatRoomsSlice = createSlice({
	name: "chatRooms",
	initialState: roomsInitialState,
	reducers: {
		setMyChatRooms: (state, action: PayloadAction<Room[]>) => {
			state.myRooms = action.payload;
		},
	},
});

export const { setMyChatRooms } = chatRoomsSlice.actions;

export const chatRoomsReducer = chatRoomsSlice.reducer;
