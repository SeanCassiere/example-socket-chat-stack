import { createAsyncThunk } from "@reduxjs/toolkit";

import appAxiosInstance from "#root/shared/api/appInstance";
import { UserForApplicationWithToken } from "#root/shared/interfaces/user/authUser";
import { setUserAccessToken, setUserProfileDetails } from "../slices/authUser";

export const userLoginThunk = createAsyncThunk(
	"authUser/userLogin",
	async ({ username, password }: { username: string; password: string }, thunkApi) => {
		const res = await appAxiosInstance.post<UserForApplicationWithToken>(`/users/login`, {
			username,
			password,
		});

		if (res && res.status === 400) {
			console.log("login failed", res.data);
			return thunkApi.rejectWithValue("bad request");
		}

		if (res && res.status === 401) {
			console.log("login failed", res.data);
			return thunkApi.rejectWithValue("invalid credentials");
		}

		thunkApi.dispatch(setUserAccessToken(res.data.token));
		thunkApi.dispatch(setUserProfileDetails(res.data));
		return true;
	}
);
