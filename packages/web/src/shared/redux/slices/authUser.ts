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
		demoSetUserLoggedIn: (state) => {
			state.token =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYzI1MDBmNS1mOGE0LTQ5MjQtYTM4Yy05YTliMWZlMTBkNjMiLCJpYXQiOjE2Mjk1MjA3MTUsImV4cCI6MTYyOTUyMjUxNX0.v1JGUtuHk5_O57RWgT9VcOPwcMbhh9BzuZ2fWQaOYvk";
			state.isLoggedIn = true;
			state.user.userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
			state.user.username = "JohnDoeName";
			state.user.firstName = "John";
			state.user.lastName = "Doe";
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

export const { demoSetUserLoggedIn, setUserAccessToken, setUserProfileDetails, setUserToLoggedOut } =
	authUserSlice.actions;

export const authUserReducer = authUserSlice.reducer;
