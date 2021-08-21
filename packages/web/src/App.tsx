import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";

import "#root/App.css";

import Routes from "./routes/Routes";
import { userFetchRefreshedAccessTokenThunk } from "./shared/redux/thunks/authUser.thunks";

const App = () => {
	const dispatch = useDispatch();

	// auto login if cookie available
	useEffect(() => {
		dispatch(userFetchRefreshedAccessTokenThunk());
	}, [dispatch]);

	return (
		<>
			<Routes />
		</>
	);
};

export default App;
