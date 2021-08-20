import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
		demoSetUserLoggedIn: (
			state,
			action: PayloadAction<{ token: string; username: string; firstName: string; lastName: string }>
		) => {
			state.user.username = action.payload.username;
			state.user.firstName = action.payload.firstName;
			state.user.lastName = action.payload.lastName;
		},
	},
});

export const { demoSetUserLoggedIn } = authUserSlice.actions;

export const authUserReducer = authUserSlice.reducer;
