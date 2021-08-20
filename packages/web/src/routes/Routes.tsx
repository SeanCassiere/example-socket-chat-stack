import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { AuthRoute } from "./AuthRoute";
import LoginScreen from "#root/modules/LoginScreen/LoginScreen";

const Routes = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/' component={LoginScreen} exact />
				<Route path='/login' component={LoginScreen} exact />
				<AuthRoute path='/hello' component={LoginScreen} exact />
			</Switch>
		</BrowserRouter>
	);
};

export default Routes;
