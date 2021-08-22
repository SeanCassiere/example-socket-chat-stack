import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "#root/App.css";

import Routes from "./routes/Routes";
import { AppDispatch, selectAuthUserState } from "./shared/redux/store";
import { userFetchRefreshedAccessTokenThunk } from "./shared/redux/thunks/authUser.thunks";
import Loader from "./shared/components/Loader/Loader";

import { useSocket } from "./shared/context/Socket.context";

const App = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isAuthenticating, isLoggedIn, user, token } = useSelector(selectAuthUserState);

	const { connectSocket, disconnectSocket, getMyRooms, listenForMessages } = useSocket();

	// auto login if cookie available
	useEffect(() => {
		dispatch(userFetchRefreshedAccessTokenThunk());
	}, [dispatch]);

	// if the user logs-in, activate these socket methods
	useEffect(() => {
		if (isLoggedIn && token && user && user.username) {
			connectSocket(token);
			getMyRooms();
			listenForMessages();
		}

		return () => disconnectSocket();
	}, [isLoggedIn, user, token, connectSocket, disconnectSocket, getMyRooms, listenForMessages]);

	if (isAuthenticating) return <Loader />;

	return (
		<>
			<Routes />
		</>
	);
};

export default App;
