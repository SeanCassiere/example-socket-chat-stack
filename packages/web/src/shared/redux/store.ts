import { configureStore, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";

import { authUserReducer } from "#root/shared/redux/slices/authUser";
import { allProcessesReducer } from "#root/shared/redux/slices/allProcess";

const combinedReducers = combineReducers({
	allProcesses: allProcessesReducer,
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

// Selectors for Processes
export const selectRegisterProcess = (state: RootState) => state.allProcesses.register;
export const selectUpdateProfileProcess = (state: RootState) => state.allProcesses.updateProfileDetails;
export const selectChangeUserPasswordProcess = (state: RootState) => state.allProcesses.changeUserPasswordProcess;
