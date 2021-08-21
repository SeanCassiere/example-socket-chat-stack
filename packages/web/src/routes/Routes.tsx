import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { AuthRoute } from "./AuthRoute";
import Navbar from "#root/shared/component/Navbar/Navbar";
import LoginScreen from "#root/modules/LoginScreen/LoginScreen";
import RegisterScreen from "#root/modules/RegisterScreen/RegisterScreen";
import ProfileScreen from "#root/modules/ProfileScreen/ProfileScreen";
import LogoutScreen from "#root/modules/LogoutScreen/LogoutScreen";

const Routes = () => {
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Switch>
					<Route path='/' component={LoginScreen} exact />
					<Route path='/login' component={LoginScreen} exact />
					<Route path='/logout' component={LogoutScreen} exact />
					<Route path='/register' component={RegisterScreen} exact />
					<AuthRoute path='/profile' component={ProfileScreen} exact />
				</Switch>
			</BrowserRouter>
		</>
	);
};

export default Routes;
