import { createSlice } from "@reduxjs/toolkit";

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
		demoSetUserLoggedIn: (state) => {
			state.token =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYzI1MDBmNS1mOGE0LTQ5MjQtYTM4Yy05YTliMWZlMTBkNjMiLCJpYXQiOjE2Mjk1MjA3MTUsImV4cCI6MTYyOTUyMjUxNX0.v1JGUtuHk5_O57RWgT9VcOPwcMbhh9BzuZ2fWQaOYvk";
			state.isLoggedIn = true;
			state.user.userId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
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
