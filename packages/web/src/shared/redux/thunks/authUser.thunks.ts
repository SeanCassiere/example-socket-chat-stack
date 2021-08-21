import { createAsyncThunk } from "@reduxjs/toolkit";

import appAxiosInstance from "#root/shared/api/appInstance";
import { UserForApplication, UserForApplicationWithToken } from "#root/shared/interfaces/user/authUser";
import { setUserAccessToken, setUserProfileDetails, setUserToLoggedOut } from "../slices/authUser";

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

export const userFetchRefreshedAccessTokenThunk = createAsyncThunk(
	"authUser/userFetchNewAccessToken",
	async (_, thunkApi) => {
		const tokenRes = await appAxiosInstance.get<{ token: string }>(`/users/refreshToken`);

		if (tokenRes && tokenRes.status === 200) {
			const profileRes = await appAxiosInstance.get<UserForApplication>("/users/profile", {
				headers: {
					Authorization: `Bearer ${tokenRes.data.token}`,
				},
			});

			if (profileRes && profileRes.status === 200) {
				thunkApi.dispatch(setUserProfileDetails(profileRes.data));
				thunkApi.dispatch(setUserAccessToken(tokenRes.data.token));
				return true;
			}

			return thunkApi.rejectWithValue("profile not fetched");
		}

		console.log("login failed", tokenRes.data);
		return thunkApi.rejectWithValue("cookie invalid");
	}
);

export const userLogoutThunk = createAsyncThunk("authUser/userLogOut", async (_, thunkApi) => {
	const res = await appAxiosInstance.get<{ success: boolean }>(`/users/logout`);

	if (res && res.status !== 200) {
		return thunkApi.rejectWithValue("logout failed");
	}

	thunkApi.dispatch(setUserToLoggedOut());
	return true;
});

// export const userFetchProfileThunk = createAsyncThunk("authUser/userFetchProfile", async (_, thunkApi) => {
// 	const res = await appAxiosInstance.get<{ token: string }>(`/users/refreshToken`);

// 	if (res && res.status === 200) {
// 		thunkApi.dispatch(setUserAccessToken(res.data.token));
// 		return true;
// 	}

// 	console.log("login failed", res.data);
// 	return thunkApi.rejectWithValue("cookie invalid");
// });
