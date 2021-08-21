import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import appAxiosInstance from "#root/shared/api/appInstance";
import { RootState } from "#root/shared/redux/store";
import { UserForApplication } from "#root/shared/interfaces/user/authUser";
import { setProcessError, setProcessLoading, setProcessSuccess } from "#root/shared/redux/slices/allProcess";
import { setUserProfileDetails } from "#root/shared/redux/slices/authUser";

export const updateUserProfileThunk = createAsyncThunk(
	"allProcesses/updateUserProfile",
	async ({ firstName, lastName }: { firstName: string; lastName: string }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("updateProfileDetails"));
		const state = thunkApi.getState() as RootState;
		const { token } = state.authUser;

		console.log(token);

		try {
			const res = await appAxiosInstance.put<UserForApplication>(
				`/users/profile`,
				{
					firstName,
					lastName,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			thunkApi.dispatch(setUserProfileDetails(res.data));

			return thunkApi.dispatch(setProcessSuccess("updateProfileDetails"));
		} catch (error) {
			if (error && error.response) {
				const axiosErr = error as AxiosError;
				thunkApi.dispatch(
					setProcessError({
						type: "updateProfileDetails",
						data: axiosErr.response?.data,
						msg: "User profile updating failed",
					})
				);
			}
			return thunkApi.rejectWithValue("User profile updating failed");
		}
	}
);
