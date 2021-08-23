import { createAsyncThunk } from "@reduxjs/toolkit";

import appAxiosInstance from "#root/shared/api/appInstance";
import { UserForApplication } from "#root/shared/interfaces/user/authUser";
import { RootState } from "#root/shared/redux/store";
import { setAllUsersForChat } from "#root/shared/redux/slices/chatRooms";

export const chatGetAllUsers = createAsyncThunk("chatRooms/getAllUsers", async (_, thunkApi) => {
	const state = thunkApi.getState() as RootState;
	const { token } = state.authUser;
	const allUsers = await appAxiosInstance.get<UserForApplication[]>(`/users`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (allUsers && allUsers.status === 200) {
		thunkApi.dispatch(setAllUsersForChat(allUsers.data));
		return true;
	}

	console.error("fetch all users for chat failed", allUsers.data);
	return thunkApi.rejectWithValue("cookie invalid");
});
