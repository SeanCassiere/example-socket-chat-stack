import React, { useEffect, useState } from "react";
import { Button, Form, Container, FloatingLabel, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { AppDispatch, selectAuthUserState } from "#root/shared/redux/store";
// import { demoSetUserLoggedIn } from "#root/shared/redux/slices/authUser";
import { userLoginThunk } from "#root/shared/redux/thunks/authUser.thunks";

export const LoginScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { isLoggedIn } = useSelector(selectAuthUserState);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// if user is logged in, redirect to dashboard
	useEffect(() => {
		if (isLoggedIn) return history.push("/dashboard");
	}, [history, isLoggedIn]);

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		await dispatch(userLoginThunk({ username, password }));

		if (isLoggedIn) {
			const {
				location: { state },
			} = history;
			const routeState = state as any;

			if (routeState && routeState.next) return history.push(routeState.next);

			return history.push("/dashboard");
		}
	};

	return (
		<Container className='mt-5 mb-5 min-vh-75'>
			<Row className='justify-content-md-center align-items-md-center mb-3'>
				<Col xs lg='6'>
					<h2>Login</h2>
				</Col>
			</Row>
			<Row className='justify-content-md-center align-items-md-center'>
				<Col xs lg='6'>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<FloatingLabel controlId='floatingUsername' label='Username' className='mb-3'>
								<Form.Control
									type='text'
									placeholder='Your username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className='mb-3' controlId='formBasicPassword'>
							<FloatingLabel controlId='floatingPassword' label='Password' className='mb-3'>
								<Form.Control
									type='password'
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</FloatingLabel>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Login
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default LoginScreen;
