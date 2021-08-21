import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { AppDispatch } from "#root/shared/redux/store";
import { userLogoutThunk } from "#root/shared/redux/thunks/authUser.thunks";

export const LogoutScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();

	// logout on load
	useEffect(() => {
		dispatch(userLogoutThunk());
		history.replace("/login");
	}, [history, dispatch]);

	return (
		<Container className='mt-5 mb-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Logout</h2>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<h5>Please wait...</h5>
				</Col>
			</Row>
		</Container>
	);
};

export default LogoutScreen;
