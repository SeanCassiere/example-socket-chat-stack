import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userFetchRefreshedAccessTokenThunk, userLoginThunk } from "../thunks/authUser.thunks";

interface AuthUserSliceState {
	token: string | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	user: {
		userId: string | null;
		username: string | null;
		firstName: string | null;
		lastName: string | null;
	};
}

let initialStateData: AuthUserSliceState;

initialStateData = {
	token: null,
	isLoggedIn: false,
	isAuthenticating: false,
	user: {
		userId: null,
		username: null,
		firstName: null,
		lastName: null,
	},
};

export const authUserSlice = createSlice({
	name: "authUser",
	initialState: initialStateData,
	reducers: {
		setUserAccessToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		setUserProfileDetails: (
			state,
			action: PayloadAction<{ userId: string; username: string; firstName: string; lastName: string }>
		) => {
			state.user.userId = action.payload.userId;
			state.user.username = action.payload.username;
			state.user.firstName = action.payload.firstName;
			state.user.lastName = action.payload.lastName;
		},
		setUserToLoggedOut: (state) => {
			state.token = null;
			state.isLoggedIn = false;
			state.isAuthenticating = false;
			state.user.userId = null;
			state.user.username = null;
			state.user.firstName = null;
			state.user.lastName = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(userLoginThunk.pending, (state) => {
			state.isLoggedIn = false;
			state.isAuthenticating = true;
		});
		builder.addCase(userLoginThunk.fulfilled, (state) => {
			state.isLoggedIn = true;
			state.isAuthenticating = false;
		});
		builder.addCase(userLoginThunk.rejected, (state) => {
			state.isLoggedIn = false;
			state.isAuthenticating = false;
		});
		builder.addCase(userFetchRefreshedAccessTokenThunk.pending, (state) => {
			state.isAuthenticating = true;
		});
		builder.addCase(userFetchRefreshedAccessTokenThunk.fulfilled, (state) => {
			state.isLoggedIn = true;
			state.isAuthenticating = false;
		});
		builder.addCase(userFetchRefreshedAccessTokenThunk.rejected, (state) => {
			state.isLoggedIn = false;
			state.isAuthenticating = false;
		});
	},
});

export const { setUserAccessToken, setUserProfileDetails, setUserToLoggedOut } = authUserSlice.actions;

export const authUserReducer = authUserSlice.reducer;
