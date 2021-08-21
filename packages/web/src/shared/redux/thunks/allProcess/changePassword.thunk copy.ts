import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import appAxiosInstance from "#root/shared/api/appInstance";
import { RootState } from "#root/shared/redux/store";
import { UserForApplication } from "#root/shared/interfaces/user/authUser";
import { setProcessError, setProcessLoading, setProcessSuccess } from "#root/shared/redux/slices/allProcess";
import { setUserProfileDetails } from "#root/shared/redux/slices/authUser";

export const changeUserPasswordThunk = createAsyncThunk(
	"allProcesses/changePassword",
	async ({ password }: { password: string }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("changeUserPasswordProcess"));
		const state = thunkApi.getState() as RootState;
		const { token } = state.authUser;

		try {
			const res = await appAxiosInstance.put<UserForApplication>(
				`/users/profile`,
				{
					password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			thunkApi.dispatch(setUserProfileDetails(res.data));

			return thunkApi.dispatch(setProcessSuccess("changeUserPasswordProcess"));
		} catch (error) {
			if (error && error.response) {
				const axiosErr = error as AxiosError;
				thunkApi.dispatch(
					setProcessError({
						type: "changeUserPasswordProcess",
						data: axiosErr.response?.data,
						msg: "User password change failed",
					})
				);
			}
			return thunkApi.rejectWithValue("User password change failed");
		}
	}
);
