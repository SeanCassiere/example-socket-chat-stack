import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";

import "#root/App.css";

import Routes from "./routes/Routes";
import { AppDispatch, selectAuthUserState } from "./shared/redux/store";
import { userFetchRefreshedAccessTokenThunk } from "./shared/redux/thunks/authUser.thunks";
import Loader from "./shared/components/Loader/Loader";

import { disconnectSocket, initiateSocketConnection, joinRoom } from "./shared/api/socket.service";

const App = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isAuthenticating, isLoggedIn, user } = useSelector(selectAuthUserState);

	// auto login if cookie available
	useEffect(() => {
		dispatch(userFetchRefreshedAccessTokenThunk());
	}, [dispatch]);

	// if user is present
	useEffect(() => {
		if (isLoggedIn && user && user.username) {
			initiateSocketConnection();
			joinRoom();
		}

		return () => disconnectSocket();
	}, [isLoggedIn, user]);

	if (isAuthenticating) return <Loader />;

	return (
		<>
			<Routes />
		</>
	);
};

export default App;
