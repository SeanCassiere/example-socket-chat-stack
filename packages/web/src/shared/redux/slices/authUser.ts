import { createSlice } from "@reduxjs/toolkit";

interface AuthUserSliceState {
	token: string | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	user: {
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
		username: null,
		firstName: null,
		lastName: null,
	},
};

export const authUserSlice = createSlice({
	name: "authUser",
	initialState: initialStateData,
	reducers: {
		demoSetUserLoggedIn: (state) => {
			state.token = "token";
			state.isLoggedIn = true;
			state.user.username = "JohnDoeName";
			state.user.firstName = "John";
			state.user.lastName = "Doe";
		},
		demoSetUserLoggedOut: (state) => {
			state.token = null;
			state.isLoggedIn = false;
			state.user.username = null;
			state.user.firstName = null;
			state.user.lastName = null;
		},
	},
});

export const { demoSetUserLoggedIn } = authUserSlice.actions;

export const authUserReducer = authUserSlice.reducer;
