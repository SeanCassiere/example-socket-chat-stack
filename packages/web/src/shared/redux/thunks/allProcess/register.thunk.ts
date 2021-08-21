import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import appAxiosInstance from "#root/shared/api/appInstance";
import { UserForApplication } from "#root/shared/interfaces/user/authUser";
import { setProcessError, setProcessLoading, setProcessSuccess } from "#root/shared/redux/slices/allProcess";

export const registerUserThunk = createAsyncThunk(
	"allProcesses/registerUser",
	async (
		{
			username,
			password,
			firstName,
			lastName,
		}: { username: string; password: string; firstName: string; lastName: string },
		thunkApi
	) => {
		thunkApi.dispatch(setProcessLoading("register"));

		try {
			await appAxiosInstance.post<UserForApplication>(`/users`, {
				username,
				password,
				firstName,
				lastName,
			});

			return thunkApi.dispatch(setProcessSuccess("register"));
		} catch (error) {
			if (error && error.response) {
				const axiosErr = error as AxiosError;
				thunkApi.dispatch(
					setProcessError({ type: "register", data: axiosErr.response?.data, msg: "User registration failed" })
				);
			}
			return thunkApi.rejectWithValue("registration failed");
		}
	}
);
