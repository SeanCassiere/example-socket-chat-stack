import { configureStore, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";

import { authUserReducer } from "#root/shared/redux/slices/authUser";

const combinedReducers = combineReducers({
	authUser: authUserReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	return combinedReducers(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
});

// Typings
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducers>;

// Selectors
export const selectAuthUserState = (state: RootState) => state.authUser;
