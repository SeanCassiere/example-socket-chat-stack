import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthRoute } from "./AuthRoute";
import Navbar from "#root/shared/components/Navbar/Navbar";

import LoginScreen from "#root/modules/LoginScreen/LoginScreen";
import RegisterScreen from "#root/modules/RegisterScreen/RegisterScreen";
import ProfileScreen from "#root/modules/ProfileScreen/ProfileScreen";
import LogoutScreen from "#root/modules/LogoutScreen/LogoutScreen";
import ChatScreen from "#root/modules/ChatScreen/ChatScreen";
import DevScreen from "#root/modules/DevScreen/DevScreen";

const Routes = () => {
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					pauseOnHover
				/>
				<Switch>
					<Route path='/' component={LoginScreen} exact />
					<Route path='/login' component={LoginScreen} exact />
					<Route path='/logout' component={LogoutScreen} exact />
					<Route path='/register' component={RegisterScreen} exact />
					<AuthRoute path='/profile' component={ProfileScreen} exact />
					<AuthRoute path='/chat' component={ChatScreen} exact />
					<AuthRoute path='/chat/:id' component={ChatScreen} exact />
					<AuthRoute path='/dev' component={DevScreen} exact />
				</Switch>
			</BrowserRouter>
		</>
	);
};

export default Routes;
