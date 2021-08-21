import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProcessInterface {
	loading: boolean;
	success: boolean;
	error: boolean;
	errorMsg: string | null;
	errorData: any | null;
}

const initialEmptyProcess: ProcessInterface = {
	loading: false,
	success: false,
	error: false,
	errorMsg: null,
	errorData: null,
};

interface AllProcesses {
	register: ProcessInterface;
	updateProfileDetails: ProcessInterface;
	changeUserPasswordProcess: ProcessInterface;
}

let allProcessesInitialState: AllProcesses;

allProcessesInitialState = {
	register: initialEmptyProcess,
	updateProfileDetails: initialEmptyProcess,
	changeUserPasswordProcess: initialEmptyProcess,
};

export const allProcessesSlice = createSlice({
	name: "allProcesses",
	initialState: allProcessesInitialState,
	reducers: {
		resetProcess: (state, action: PayloadAction<keyof AllProcesses>) => {
			state[action.payload].loading = false;
			state[action.payload].success = false;
			state[action.payload].error = false;
			state[action.payload].errorMsg = null;
			state[action.payload].errorData = false;
		},
		setProcessLoading: (state, action: PayloadAction<keyof AllProcesses>) => {
			state[action.payload].success = false;
			state[action.payload].loading = true;
		},
		setProcessSuccess: (state, action: PayloadAction<keyof AllProcesses>) => {
			state[action.payload].success = true;
			state[action.payload].loading = false;
		},
		setProcessError: (state, action: PayloadAction<{ type: keyof AllProcesses; data: any; msg: string }>) => {
			state[action.payload.type].loading = false;
			state[action.payload.type].error = true;
			state[action.payload.type].errorMsg = action.payload.msg;
			state[action.payload.type].errorData = action.payload.data;
		},
	},
});

export const { resetProcess, setProcessLoading, setProcessSuccess, setProcessError } = allProcessesSlice.actions;

export const allProcessesReducer = allProcessesSlice.reducer;
